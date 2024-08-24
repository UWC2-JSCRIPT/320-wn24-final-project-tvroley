import { useEffect, useState } from "react";
import "./App.css";
import TradingCard from "./TradingCard";
import Nav from "./Nav";

function FindAnyCard({}) {
  const [tradingCards, setTradingCards] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [offset, setOffset] = useState(0);

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
      setOffset(0);
    } else {
      setErrorMessage(`Error: failed to search for cards`);
    }
  };

  const nextCards = () => {
    if (offset + 50 < tradingCards.length) {
      setOffset(offset + 50);
    }
  };

  const previousCards = () => {
    if (offset - 50 >= 0) {
      setOffset(offset - 50);
    }
  };

  const getLastCard = () => {
    if (offset + 51 > tradingCards.length) {
      return tradingCards.length;
    } else {
      return offset + 51;
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
        {tradingCards.map((card, index) => {
          if (
            index < offset ||
            index >= 50 + offset ||
            index >= tradingCards.length
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
                <TradingCard tradingCard={card} />
              </div>
            );
          }
        })}
      </div>
      <p>
        Showing cards {offset + 1} through {getLastCard()} of{" "}
        {tradingCards.length}
      </p>
      <div className="div-add-button">
        <button onClick={previousCards}>Previous</button>
        <button onClick={nextCards}>Next</button>
      </div>
      <Nav />
    </>
  );
}

export default FindAnyCard;
