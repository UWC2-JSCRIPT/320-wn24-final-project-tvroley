import { useEffect, useState } from "react";
import "./App.css";
import Nav from "./Nav";
import TradingCard from "./TradingCard";
import SortButtons from "./SortButtons";
import Mongo from "./Mongo";

function Collectors({}) {
  const [collections, setCollections] = useState([]);
  const [tradingCardCollection, setTradingCardCollection] = useState([]);
  const [collectionId, setCollectionId] = useState("");
  const [collectionTitle, setCollectionTitle] = useState("");
  const [currentCollector, setCurrentCollector] = useState({});
  const [currentCollection, setCurrentCollection] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [offset, setOffset] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [usernames, setUsernames] = useState("");
  const [searchedUsernames, setSearchedUsernames] = useState("");
  const [username, setUsername] = useState(
    sessionStorage.getItem("cardsUsername"),
  );
  const cardsPerPage = 50;
  const server = new Mongo();

  useEffect(() => {
    const getData = async () => {
      if (!username) {
        setErrorMessage("You need to login to view the Collectors page");
        return;
      }
      const responseGetUsernames = await server.getAllUsernames();
      if (responseGetUsernames.status === 200) {
        const data = await responseGetUsernames.json();
        setUsernames(data.usernames);
      } else {
        setErrorMessage(`Error: could not get collectors`);
      }
    };
    getData();
  }, []);

  const changeUser = async (event) => {
    const buttonUserText = event.target.innerText;
    setCurrentCollector(buttonUserText);
    const responseGetCollections = await server.getCollections(buttonUserText);
    if (responseGetCollections.status === 200) {
      const data = await responseGetCollections.json();
      const myCollections = data.collections;
      setCollections(myCollections);
      const baseCollectionArray = myCollections.filter(
        (collect) => buttonUserText === collect.title,
      );
      const myCollection = baseCollectionArray[0];
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
    } else if (responseGetCollections.status === 401) {
      setErrorMessage(`Failed to authorize user`);
    } else {
      setErrorMessage(`Could not get collections for user`);
    }
  };

  const changeCollection = async (event) => {
    const buttonCollectionText = event.target.innerText;
    const buttonCollectionArray = collections.filter(
      (collect) => buttonCollectionText === collect.title,
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

  const userSearch = async (event) => {
    if (!searchQuery || !username) {
      return;
    }
    const response = await server.searchUsernames(searchQuery);
    const responseData = await response.json();
    if (response.status === 200) {
      setSearchedUsernames(responseData.usernames);
      setOffset(0);
    } else {
      setErrorMessage(`No results found`);
    }
  };

  const nextCards = () => {
    if (offset + cardsPerPage < tradingCardCollection.length) {
      setOffset(offset + cardsPerPage);
    }
  };

  const previousCards = () => {
    if (offset - cardsPerPage >= 0) {
      setOffset(offset - cardsPerPage);
    }
  };

  const getLastCard = () => {
    if (offset + cardsPerPage + 1 > tradingCardCollection.length) {
      return tradingCardCollection.length;
    } else {
      return offset + cardsPerPage;
    }
  };

  return (
    <>
      <h2>Collectors</h2>
      <h4>{usernames.length} Collectors</h4>
      <h3>{collectionTitle.toUpperCase()}</h3>
      <p>{errorMessage}</p>
      <div>
        <div>
          <p className="p-instructions">Click on card images for bigger size</p>
        </div>
        <div className="div-sold-legend">
          <p className="sold p-legend">SOLD</p>
          <p className="unsold p-legend">NOT SOLD</p>
        </div>
      </div>
      <h4>Search</h4>
      <div className="div-add-collection">
        <div className="div-enter-collection">
          <label htmlFor="card-search-input">Search For A Collector</label>
          <input
            id="card-search-input"
            type="text"
            required
            minLength="1"
            maxLength="100"
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
          />
          <button onClick={userSearch}>Search</button>
        </div>
      </div>
      <h4>Search Results</h4>
      <div className="div-collections" id="search-usernames-div">
        {Array.from(searchedUsernames).map((username) => {
          return (
            <button onClick={changeUser} key={`${username}-search-button`}>
              {username}
            </button>
          );
        })}
      </div>
      <h4>Collectors</h4>
      <div className="div-collections" id="usernames-div">
        {Array.from(usernames).map((username) => {
          return (
            <button onClick={changeUser} key={`${username}-button`}>
              {username}
            </button>
          );
        })}
      </div>
      <h4>Collections</h4>
      <div className="div-collections" id="collections-div">
        {Array.from(collections).map((collect) => {
          return (
            <button onClick={changeCollection} key={`${collect.title}-button`}>
              {collect.title}
            </button>
          );
        })}
      </div>
      <SortButtons
        collectionId={collectionId}
        setTradingCardCollection={setTradingCardCollection}
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

export default Collectors;
