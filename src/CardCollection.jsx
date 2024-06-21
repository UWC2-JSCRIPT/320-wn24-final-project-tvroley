import { useEffect, useState } from "react";
import "./App.css";
import TradingCard from "./TradingCard";
import { useLocation, useNavigate } from "react-router-dom";
import SortButtons from "./SortButtons";
import Nav from "./Nav";

function CardCollection({}) {
  const [tradingCardCollection, setTradingCardCollection] = useState([]);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorCode, setErrorCode] = useState("");
  const [collectionId, setCollectionId] = useState("");
  const [collectionTitle, setCollectionTitle] = useState("");
  const [username, setUsername] = useState(
    localStorage.getItem("cardsUsername"),
  );
  const [collections, setCollections] = useState([]);
  const [currentCollection, setCurrentCollection] = useState({});
  const [addedCollection, setAddedCollection] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      let urlGetCollections = new URL(
        `https://trading-cards-backend-production.up.railway.app/collections`,
      );
      urlGetCollections.searchParams.append("ownerName", username);
      const responseGetCollections = await fetch(urlGetCollections, {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("cardsToken"),
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
      });
      if (responseGetCollections.status === 200) {
        const data = await responseGetCollections.json();
        const myCollections = data.collections;
        const baseCollectionArray = myCollections.filter(
          (collect) => username === collect.title,
        );
        if (baseCollectionArray.length > 0) {
          const baseCollection = baseCollectionArray[0];
          setCurrentCollection(baseCollection);
          setCollectionId(baseCollection._id);
          setCollectionTitle(baseCollection.title);
          setCollections(myCollections);

          let url = new URL(
            `https://trading-cards-backend-production.up.railway.app/collections/` +
              baseCollection._id,
          );
          url.searchParams.append("verbose", "true");
          const response = await fetch(url, {
            method: "GET",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("cardsToken"),
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
          });

          const responseData = await response.json();
          if (response.status === 200) {
            setTradingCardCollection(responseData.tradingCards);
          } else {
            console.log(responseData);
          }
        } else {
          console.log("Could not find base collection");
        }
      } else {
        console.log(`Could not get collections for user`);
      }
    };
    getData();
  }, []);

  const goAdd = () => {
    navigate(`/collection/add`);
  };

  const addCollection = async (event) => {
    const titleObj = { collectionTitle: addedCollection };
    let url = new URL(
      `https://trading-cards-backend-production.up.railway.app/collections/`,
    );
    const response = await fetch(url, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("cardsToken"),
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify(titleObj),
    });

    if (response.status === 200) {
      const responseData = await response.json();
      const myCollection = responseData.collection;
      const myCollections = collections;
      myCollections.push(myCollection);
      setCollections(myCollections);
    } else {
      console.log(`Error: could not add collection`);
    }
  };

  const changeCollection = async (event) => {
    const buttonCollection = event.target.innerText;
    const buttonCollectionArray = collections.filter(
      (collect) => buttonCollection === collect.title,
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
        Authorization: "Bearer " + localStorage.getItem("cardsToken"),
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
    });

    const responseData = await response.json();
    if (response.status === 200) {
      setTradingCardCollection(responseData.tradingCards);
    } else {
      console.log(`Error: could not get cards`);
    }
  };

  const saveLocal = () => {
    const cardsWord = JSON.stringify(tradingCardCollection);
    localStorage.setItem("cards", cardsWord);
  };

  const searchCollection = async (event) => {
    let url = new URL(
      `https://trading-cards-backend-production.up.railway.app/collections/` +
        collectionId,
    );
    url.searchParams.append("verbose", "true");
    url.searchParams.append("search", searchQuery);
    const response = await fetch(url, {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("cardsToken"),
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
    });

    const responseData = await response.json();
    if (response.status === 200) {
      setTradingCardCollection(responseData.tradingCards);
    } else {
      console.log(`Error: could not get cards`);
    }
  };

  if (hasError) {
    return (
      <p>
        Error code: {errorCode} Error message: {errorMessage}
      </p>
    );
  }

  return (
    <>
      <h2>
        {collectionTitle.toUpperCase()}: {tradingCardCollection.length} Cards
      </h2>
      <div>
        <div className="div-sold-legend">
          <p className="p-instructions">Click on card images for full size</p>
        </div>
        <div className="div-sold-legend">
          <p className="sold p-legend">SOLD</p>
          <p className="unsold p-legend">NOT SOLD</p>
        </div>
      </div>
      <div className="div-restore-buttons">
        <button onClick={saveLocal}>Save Cards Locally</button>
      </div>
      <div className="div-add-collection">
        <div className="div-enter-collection">
          <label htmlFor="card-search-input">
            Search For A Card In Collection
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
        <button onClick={searchCollection}>Search</button>
      </div>
      <div className="div-add-collection">
        <div className="div-enter-collection">
          <label htmlFor="collection-input">Enter Collection</label>
          <input
            id="collection-input"
            type="text"
            required
            minLength="1"
            maxLength="50"
            onChange={(e) => setAddedCollection(e.target.value)}
            value={addedCollection}
          />
        </div>
        <button onClick={addCollection}>Add Collection</button>
      </div>
      <p>Collections</p>
      <div className="div-collections" id="collections-div">
        {Array.from(collections).map((collect) => {
          return (
            <button
              onClick={(event) => changeCollection(event)}
              key={`${collect.title}-button`}
            >
              {collect.title}
            </button>
          );
        })}
      </div>
      <div className="div-add-button">
        <button onClick={goAdd}>Add Card</button>
      </div>
      <SortButtons
        collectionId={collectionId}
        setTradingCardCollection={setTradingCardCollection}
      />
      <div className="div-cards">
        {tradingCardCollection.map((card) => {
          let cardClass = "unsold";
          if (card.sold) {
            cardClass = "sold";
          }
          return (
            <div
              key={card.certificationNumber}
              className={`div-card ${cardClass}`}
            >
              <TradingCard tradingCard={card} />
            </div>
          );
        })}
      </div>
      <SortButtons
        collectionId={collectionId}
        setTradingCardCollection={setTradingCardCollection}
      />
      <Nav />
    </>
  );
}

export default CardCollection;
