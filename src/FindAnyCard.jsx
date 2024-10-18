import { useEffect, useState } from "react";
import "./App.css";
import TradingCard from "./TradingCard";
import Nav from "./Nav";
import Mongo from "./Mongo";

function FindAnyCard({}) {
  const [tradingCards, setTradingCards] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [offset, setOffset] = useState(0);
  const [username, setUsername] = useState(
    sessionStorage.getItem("cardsUsername"),
  );
  const server = new Mongo();
  const cardsPerPage = 50;

  useEffect(() => {
    const getData = async () => {
      if (!username) {
        setErrorMessage("You need to login to use the find any card page");
        return;
      }
      const responseGetAllCards = await server.getAllCards();
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
    if (!username || !searchQuery) {
      return;
    }
    const response = await server.searchAllCards(searchQuery);

    if (response.status === 200) {
      const responseData = await response.json();
      setTradingCards(responseData.cards);
      setOffset(0);
      if (responseData.cards.length > 0) {
        document.getElementById("card-collection-div").scrollIntoView();
      }
    } else {
      setErrorMessage(`Error: failed to search for cards`);
    }
  };

  const nextCards = () => {
    if (offset + cardsPerPage < tradingCards.length) {
      setOffset(offset + cardsPerPage);
    }
  };

  const previousCards = () => {
    if (offset - cardsPerPage >= 0) {
      setOffset(offset - cardsPerPage);
    }
  };

  const getLastCard = () => {
    if (offset + cardsPerPage + 1 > tradingCards.length) {
      return tradingCards.length;
    } else {
      return offset + cardsPerPage;
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
      <h4>Search</h4>
      <div className="div-add-collection">
        <div className="div-enter-collection">
          <label htmlFor="card-search-input">Search for any card</label>
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
      <div id="card-collection-div" className="div-cards">
        {tradingCards.map((card, index) => {
          if (
            index < offset ||
            index >= cardsPerPage + offset ||
            index >= tradingCards.length ||
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
