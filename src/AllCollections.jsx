import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./App.css";
import Nav from "./Nav";
import TradingCard from "./TradingCard";

function AllCollections({}) {
  const [collections, setCollections] = useState([]);
  const [tradingCardCollection, setTradingCardCollection] = useState([]);
  const [collectionId, setCollectionId] = useState("");
  const [collectionTitle, setCollectionTitle] = useState("");
  const [currentCollection, setCurrentCollection] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
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
          Authorization: "Bearer " + localStorage.getItem("cardsToken"),
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
    if(buttonCollectionText.indexOf("base collection") > 0) {
        collectionText = buttonCollectionText.split(" base ")[0];
        ownerText = buttonCollectionText.split(" base ")[0];     
    } else {
        collectionText = buttonCollectionText.split(" by ")[0];
        ownerText = buttonCollectionText.split(" by ")[1];
    }
    const buttonCollectionArray = collections.filter(
      (collect) => collectionText === collect.title && ownerText === collect.ownerName,
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
      <Nav />
    </>
  );
}

export default AllCollections;
