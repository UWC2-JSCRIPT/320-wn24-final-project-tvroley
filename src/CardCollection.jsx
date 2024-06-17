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
        console.log(responseGetCollections);
      }
    };
    getData();
  }, []);

  const goAdd = () => {
    navigate(`/collection/add`);
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
        <p className="p-instructions">Click on card images for full size</p>
        <p className="sold p-legend">SOLD</p>
        <p className="unsold p-legend">NOT SOLD</p>
      </div>
      <div className="div-restore-buttons">
        <button onClick={saveLocal}>Save Cards Locally</button>
      </div>
      <label htmlFor="div-collections">Collections</label>
      <div className="div-collections">
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
