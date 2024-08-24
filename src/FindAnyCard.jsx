import { useEffect, useState } from "react";
import "./App.css";
import TradingCard from "./TradingCard";
import Nav from "./Nav";

function FindAnyCard({}) {
  const [tradingCards, setTradingCards] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const getData = async () => {
      let urlGetAllCards = new URL(
        `https://trading-cards-backend-production.up.railway.app/cards/`,
      );
      const responseGetAllCards = await fetch(urlGetAllCards, {
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
      if (responseGetAllCards.status === 200) {
        const data = await responseGetAllCards.json();
        const myCards = data.cards;
        if (myCards.length > 0) {
          setTradingCards(myCards);
        } else {
          setErrorMessage(`Did not find any cards`);
        }
      } else {
        setErrorMessage(`Could not get all cards`);
      }
    };
    getData();
  }, []);

  const searchAllCards = async (event) => {
    let url = new URL(
      `https://trading-cards-backend-production.up.railway.app/cards/search`,
    );
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
      setTradingCards(responseData.cards);
    } else {
      setErrorMessage(`Error: failed to search for cards`);
    }
  };

  return (
    <>
      <h2>Find Any Card</h2>
      <h4>{tradingCards.length} Cards</h4>
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
          <label htmlFor="card-search-input">Search For Any Card</label>
          <input
            id="card-search-input"
            type="text"
            required
            minLength="1"
            maxLength="100"
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
          />
          <button onClick={searchAllCards}>Search</button>
        </div>
      </div>
      <div className="div-cards">
        {tradingCards.map((card) => {
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

export default FindAnyCard;
