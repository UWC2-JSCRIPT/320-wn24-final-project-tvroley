import { useEffect, useState } from "react";
import "./App.css";
import Nav from "./Nav";
import TradingCard from "./TradingCard";
import SortButtons from "./SortButtons";

function AllCollections({}) {
  const [collections, setCollections] = useState([]);
  const [tradingCardCollection, setTradingCardCollection] = useState([]);
  const [collectionId, setCollectionId] = useState("");
  const [collectionTitle, setCollectionTitle] = useState("");
  const [currentCollection, setCurrentCollection] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedCollections, setSearchedCollections] = useState([]);
  const [offset, setOffset] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [username, setUsername] = useState(
    sessionStorage.getItem("cardsUsername"),
  );

  useEffect(() => {
    const getData = async () => {
      if (!username) {
        setErrorMessage("You need to login to view All Collections");
        return;
      }
      let urlGetCollections = new URL(
        `https://trading-cards-backend-production.up.railway.app/collections`,
      );
      urlGetCollections.searchParams.append("getAll", "true");
      const responseGetCollections = await fetch(urlGetCollections, {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("cardsToken"),
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
      });
      if (responseGetCollections.status === 200) {
        const data = await responseGetCollections.json();
        const myCollections = data.collections;
        setCollections(myCollections);
      } else {
        console.log(`Error: could not get all collections`);
      }
    };
    getData();
  }, []);

  const changeCollection = async (event) => {
    const buttonCollectionText = event.target.innerText;
    let collectionText = "";
    let ownerText = "";
    if (buttonCollectionText.indexOf("base collection") > 0) {
      collectionText = buttonCollectionText.split(" base ")[0];
      ownerText = buttonCollectionText.split(" base ")[0];
    } else {
      collectionText = buttonCollectionText.split(" by ")[0];
      ownerText = buttonCollectionText.split(" by ")[1];
    }
    const buttonCollectionArray = collections.filter(
      (collect) =>
        collectionText === collect.title && ownerText === collect.ownerName,
    );
    const myCollection = buttonCollectionArray[0];
    setCollectionId(myCollection._id);
    setCollectionTitle(myCollection.title);
    setCurrentCollection(myCollection);
    let url = new URL(
      `https://trading-cards-backend-production.up.railway.app/collections/` +
        myCollection._id,
    );
    url.searchParams.append("verbose", "true");
    const response = await fetch(url, {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("cardsToken"),
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
    });

    const responseData = await response.json();
    if (response.status === 200) {
      setTradingCardCollection(responseData.tradingCards);
      setOffset(0);
    } else {
      console.log(`Error: could not get cards`);
    }
  };

  const collectionSearch = async (event) => {
    if(!searchQuery || !username){
      return;
    }
    let url = new URL(
      `https://trading-cards-backend-production.up.railway.app/collections/search`,
    );
    url.searchParams.append("search", searchQuery);
    const response = await fetch(url, {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("cardsToken"),
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
    });

    const responseData = await response.json();
    if (response.status === 200) {
      setSearchedCollections(responseData.collections);
      setOffset(0);
    } else {
      console.log(`No results found`);
    }
  };

  const getCollectionButtonText = (collect) => {
    let collectionButtonText = `${collect.title} by ${collect.ownerName}`;
    if (collect.title === collect.ownerName) {
      collectionButtonText = `${collect.ownerName} base collection`;
    }
    return collectionButtonText;
  };

  const nextCards = () => {
    if (offset + 50 < tradingCardCollection.length) {
      setOffset(offset + 50);
    }
  };

  const previousCards = () => {
    if (offset - 50 >= 0) {
      setOffset(offset - 50);
    }
  };

  const getLastCard = () => {
    if (offset + 51 > tradingCardCollection.length) {
      return tradingCardCollection.length;
    } else {
      return offset + 51;
    }
  };

  return (
    <>
      <h2>All Collections</h2>
      <h3>{collectionTitle.toUpperCase()}</h3>
      <h4>{tradingCardCollection.length} Cards</h4>
      <p>{errorMessage}</p>
      <div>
        <div>
          <p className="p-instructions">Click on card images for full size</p>
        </div>
        <div className="div-sold-legend">
          <p className="sold p-legend">SOLD</p>
          <p className="unsold p-legend">NOT SOLD</p>
        </div>
      </div>
      <div className="div-add-collection">
        <div className="div-enter-collection">
          <label htmlFor="card-search-input">
            Search For A Collection By Title
          </label>
          <input
            id="card-search-input"
            type="text"
            required
            minLength="1"
            maxLength="100"
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
          />
        </div>
        <div className="div-sort-buttons">
          <button onClick={collectionSearch}>Search</button>
        </div>
        <div className="div-collections" id="search-collections-div">
          {Array.from(searchedCollections).map((collect) => {
            return (
              <button
                onClick={changeCollection}
                key={`${collect.title}-${collect.ownerName}-search-button`}
              >
                {getCollectionButtonText(collect)}
              </button>
            );
          })}
        </div>
      </div>
      <div className="div-collections" id="collections-div">
        {Array.from(collections).map((collect) => {
          return (
            <button
              onClick={changeCollection}
              key={`${collect.title}-${collect.ownerName}-button`}
            >
              {getCollectionButtonText(collect)}
            </button>
          );
        })}
      </div>
      <SortButtons
        collectionId={collectionId}
        setTradingCardCollection={setTradingCardCollection}
      />
      <div className="div-cards">
        {tradingCardCollection.map((card, index) => {
          if (
            index < offset ||
            index >= 50 + offset ||
            index >= tradingCardCollection.length ||
            !card.hasOwnProperty("year")
          ) {
            return;
          } else {
            let cardClass = "unsold";
            if (card.sold) {
              cardClass = "sold";
            }

            return (
              <div
                key={card.certificationNumber}
                className={`div-card ${cardClass}`}
              >
                <TradingCard tradingCard={card} collections={collections} />
              </div>
            );
          }
        })}
      </div>
      <p>
        Showing cards {offset + 1} through {getLastCard()} of{" "}
        {tradingCardCollection.length}
      </p>
      <div className="div-add-button">
        <button onClick={previousCards}>Previous</button>
        <button onClick={nextCards}>Next</button>
      </div>
      <SortButtons
        collectionId={collectionId}
        setTradingCardCollection={setTradingCardCollection}
      />
      <Nav />
    </>
  );
}

export default AllCollections;
