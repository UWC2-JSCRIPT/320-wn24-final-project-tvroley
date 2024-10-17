import { useEffect, useState } from "react";
import "./App.css";
import TradingCard from "./TradingCard";
import { useNavigate } from "react-router-dom";
import SortButtons from "./SortButtons";
import firebaseApp from "./firebaseApp";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
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
  const storage = getStorage(firebaseApp);
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

            const response = await server.getCardsInCollection(
              baseCollection._id,
            );
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
    const response = await server.searchCardsInCollection(
      collectionId,
      searchQuery,
    );
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

  const convertImages = (event) => {
    tradingCardCollection.map((tradingCard) => {
      const frontCardImageRef = ref(storage, `images/${tradingCard._id}-front`);
      let frontCardImageURL;
      getDownloadURL(frontCardImageRef)
        .then((url) => {
          frontCardImageURL = url;
          const xhr = new XMLHttpRequest();
          xhr.responseType = "blob";
          xhr.onload = (event) => {
            const file = xhr.response;
            console.log(file);
          };
          xhr.open("GET", url);
          xhr.send();
        })
        .catch((error) => {
          console.log(error);
        });
      const backCardImageRef = ref(storage, `images/${tradingCard._id}-back`);
      let backCardImageURL;
      getDownloadURL(backCardImageRef)
        .then((url) => {
          backCardImageURL = url;
          const xhr = new XMLHttpRequest();
          xhr.responseType = "blob";
          xhr.setRequestHeader("Access-Control-Allow-Origin", "http://localhost:5173/");
          xhr.onload = (event) => {
            const file = xhr.response;
            console.log(file);
          };
          xhr.open("GET", url);
          xhr.send();
        })
        .catch((error) => {
          console.log(error);
        });

      /*const chosenImageFile = el.files[0];
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const image = new Image();
      image.onload = (imageEvent) => {
        const canvas = document.createElement("canvas");
        let width = image.width;
        let height = image.height;
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(image, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg");
        const arr = dataUrl.split(",");
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[arr.length - 1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        const myFile = new File([u8arr], "temp", { type: mime });
        if (side === "front") {
          setFrontCardImageFile(myFile);
        } else {
          setBackCardImageFile(myFile);
        }
      };
      image.onerror = (imageError) => {
        setResultMessage(`Error converting image for uploading: ${imageError}`);
      }
      image.src = readerEvent.target.result;
    };
    reader.onerror = (readerError) => {
      setResultMessage(`Error converting image for uploading: ${readerError}`);
    }
    reader.readAsDataURL(chosenImageFile);*/
    });
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
      <h4>Search</h4>
      <div className="div-add-collection">
        <div className="div-enter-collection">
          <label htmlFor="card-search-input">
            Search for a card in the currently selected collection
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
      <h4>Add Collection</h4>
      <div className="div-add-collection">
        <div className="div-enter-collection">
          <label htmlFor="collection-input">
            Create a new collection with a specific theme
          </label>
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
      <div className="div-add-button">
        <button onClick={convertImages}>Downgrade</button>
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
