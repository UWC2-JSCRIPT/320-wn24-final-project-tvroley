import { useEffect, useState } from "react";
import "./App.css";
import TradingCard from "./TradingCard";
import { useNavigate } from "react-router-dom";
import SortButtons from "./SortButtons";
import Nav from "./Nav";
import Mongo from "./Mongo";

function CardCollection({}) {
  const [tradingCardCollection, setTradingCardCollection] = useState([]);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorCode, setErrorCode] = useState("");
  const [collectionId, setCollectionId] = useState("");
  const [collectionTitle, setCollectionTitle] = useState("");
  const [username, setUsername] = useState(
    sessionStorage.getItem("cardsUsername"),
  );
  const [collections, setCollections] = useState([]);
  const [currentCollection, setCurrentCollection] = useState({});
  const [baseCollectionId, setBaseCollectionId] = useState("");
  const [addedCollection, setAddedCollection] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [addCollectionResult, setAddCollectionResult] = useState("");
  const [offset, setOffset] = useState(0);

  const navigate = useNavigate();
  const server = new Mongo();

  useEffect(() => {
    const getData = async () => {
      setOffset(0);
      if (!username) {
        setErrorMessage("You need to login to view your collections");
      } else {
        const responseGetCollections = await server.getCollections(username);
        if (responseGetCollections.status === 200) {
          const data = await responseGetCollections.json();
          const myCollections = data.collections;
          const baseCollectionArray = myCollections.filter(
            (collect) => username === collect.title,
          );
          if (baseCollectionArray.length > 0) {
            const baseCollection = baseCollectionArray[0];
            setCurrentCollection(baseCollection);
            setBaseCollectionId(baseCollection._id);
            setCollectionId(baseCollection._id);
            setCollectionTitle(baseCollection.title);
            setCollections(myCollections);

            const response = await server.getCardsInCollection(baseCollection._id);
            if (response.status === 200) {
              const responseData = await response.json();
              setTradingCardCollection(responseData.tradingCards);
            } else {
              setErrorMessage("Could not retrieve base collection");
            }
          } else {
            setErrorMessage("Could not retrieve base collection");
          }
        } else if (responseGetCollections.status === 401) {
          setErrorMessage(`Failed to authorize user`);
        } else {
          setErrorMessage(`Could not get collections for user`);
        }
      }
    };
    getData();
  }, []);

  const goAdd = () => {
    if (!username) {
      return;
    }
    navigate(`/collection/add`, {
      state: { baseCollectionId: baseCollectionId },
    });
  };

  const goManageCollections = () => {
    if (!username) {
      return;
    }
    navigate(`/collection/manage`);
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

  const addCollection = async (event) => {
    if (!username || !addedCollection) {
      return;
    }
    const countResponse = await server.getCollectionsCount();
    if (countResponse.status === 200) {
      const responseData = await countResponse.json();
      const count = responseData.count;
      if (count >= 20) {
        setAddCollectionResult(
          `Error: You have reached the maximum number of collections`,
        );
        return;
      }
    } else {
      setAddCollectionResult(`Could not count current collections`);
      return;
    }
    const response = await server.addCollection(addedCollection);

    if (response.status === 200) {
      const responseData = await response.json();
      const myCollection = responseData.collection;
      const myCollections = collections;
      myCollections.push(myCollection);
      setCollections(myCollections);
      setAddCollectionResult(`Added collection ${myCollection.title}`);
    } else {
      setAddCollectionResult(`Could not add collection`);
    }
  };

  const changeCollection = async (event) => {
    if (!username) {
      return;
    }
    setOffset(0);
    const buttonCollection = event.target.innerText;
    const buttonCollectionArray = collections.filter(
      (collect) => buttonCollection === collect.title,
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
      document.getElementById("card-collection-div").scrollIntoView();
    } else {
      setErrorMessage(`Error: could not get cards when changing collection`);
    }
  };

  const searchCollection = async (event) => {
    if (!username || !searchQuery) {
      return;
    }
    setOffset(0);
    const response = await server.searchCardsInCollection(collectionId, searchQuery);
    const responseData = await response.json();
    if (response.status === 200) {
      setTradingCardCollection(responseData.tradingCards);
      setOffset(0);
      if (responseData.tradingCards.length > 0) {
        document.getElementById("card-collection-div").scrollIntoView();
      }
    } else {
      setErrorMessage(`Error: failed to search for cards`);
    }
  };

  const getLastCard = () => {
    if (offset + 51 > tradingCardCollection.length) {
      return tradingCardCollection.length;
    } else {
      return offset + 51;
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
      <h2>My Collection</h2>
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
          <button onClick={searchCollection}>Search</button>
        </div>
      </div>
      <div className="div-add-collection">
        <div className="div-enter-collection">
          <label htmlFor="collection-input">Add Collection</label>
          <input
            id="collection-input"
            type="text"
            required
            minLength="1"
            maxLength="50"
            onChange={(e) => setAddedCollection(e.target.value)}
            value={addedCollection}
          />
          <button onClick={addCollection}>Submit</button>
        </div>
      </div>
      <p>{addCollectionResult}</p>
      <h4>Choose Your Collection</h4>
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
      <div className="div-restore-buttons">
        <button onClick={goManageCollections}>Manage Collections</button>
      </div>
      <div className="div-add-button">
        <button onClick={goAdd}>Add Card</button>
      </div>
      <SortButtons
        collectionId={collectionId}
        setTradingCardCollection={setTradingCardCollection}
        setOffset={setOffset}
      />
      <div className="div-cards" id="card-collection-div">
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
        setOffset={setOffset}
      />
      <Nav />
    </>
  );
}

export default CardCollection;
