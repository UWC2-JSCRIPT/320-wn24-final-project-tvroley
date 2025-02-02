import { useEffect, useState } from "react";
import "./App.css";
import Nav from "./Nav";
import TradingCard from "./TradingCard";
import SortButtons from "./SortButtons";
import Mongo from "./Mongo";
import NextPrevButtons from "./NextPrevButtons";

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
  const server = new Mongo();
  const cardsPerPage = 50;

  useEffect(() => {
    const getData = async () => {
      if (!username) {
        setErrorMessage("You need to login to view All Collections");
        return;
      }
      const responseGetCollections = await server.getAllCollections();
      if (responseGetCollections.status === 200) {
        const data = await responseGetCollections.json();
        const myCollections = data.collections;
        setCollections(myCollections);
      } else {
        setErrorMessage(`Error: could not get all collections`);
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
    const response = await server.getCardsInCollection(myCollection._id);
    const responseData = await response.json();
    if (response.status === 200) {
      setTradingCardCollection(responseData.tradingCards);
      setOffset(0);
      document.getElementById("cards-div").scrollIntoView();
    } else {
      setErrorMessage(`Error: could not get cards`);
    }
  };

  const collectionSearch = async (event) => {
    if (!searchQuery || !username) {
      return;
    }
    const response = await server.searchCollections(searchQuery);
    const responseData = await response.json();
    if (response.status === 200) {
      setSearchedCollections(responseData.collections);
      setOffset(0);
    } else {
      setErrorMessage(`No results found`);
    }
  };

  const getCollectionButtonText = (collect) => {
    let collectionButtonText = `${collect.title} by ${collect.ownerName}`;
    if (collect.title === collect.ownerName) {
      collectionButtonText = `${collect.ownerName} base collection`;
    }
    return collectionButtonText;
  };

  return (
    <>
      <h2>All Collections</h2>
      <h3>{collectionTitle.toUpperCase()}</h3>
      <h4>{tradingCardCollection.length} Cards</h4>
      <p>{errorMessage}</p>
      <div>
        <div>
          <p className="p-instructions">Click on card images for larger size</p>
        </div>
        <div className="div-sold-legend">
          <p className="sold p-legend">SOLD</p>
          <p className="unsold p-legend">NOT SOLD</p>
        </div>
      </div>
      <h4>Search</h4>
      <div className="div-add-collection">
        <div className="div-enter-collection">
          <label htmlFor="card-search-input">
            Search for a collection by title
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
          <button onClick={collectionSearch}>Search</button>
        </div>
      </div>
      <h4>Search Results</h4>
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
      <h4>Collections</h4>
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
      <NextPrevButtons
        collectionLength={tradingCardCollection.length}
        setOffset={setOffset}
        cardsPerPage={cardsPerPage}
        offset={offset}
      />
      <div id="cards-div" className="div-cards">
        {tradingCardCollection.map((card, index) => {
          if (
            index < offset ||
            index >= cardsPerPage + offset ||
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
      <NextPrevButtons
        collectionLength={tradingCardCollection.length}
        setOffset={setOffset}
        cardsPerPage={cardsPerPage}
        offset={offset}
      />
      <SortButtons
        collectionId={collectionId}
        setTradingCardCollection={setTradingCardCollection}
      />
      <Nav />
    </>
  );
}

export default AllCollections;
