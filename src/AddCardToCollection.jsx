import "./App.css";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Mongo from "./Mongo";

function AddCardToCollection({}) {
  const cardId = useLocation().pathname.split("/")[3];
  const location = useLocation();
  const myTradingCard = location.state.tradingCard;
  const myCollections = location.state.collections;
  const frontCardImageURL = location.state.frontCardImageURL;
  const tradingCard = myTradingCard;
  const [resultMessage, setResultMessage] = useState([]);
  const collections = myCollections;
  const [collectionsForCard, setCollectionsForCard] = useState([]);
  const [username, setUsername] = useState(
    sessionStorage.getItem("cardsUsername"),
  );
  const server = new Mongo();

  useEffect(() => {
    const getData = async () => {
      const responseGetCollectionsForCard = await server.getCollectionsForCard(cardId);
      let myCollectionsForCard = [];
      if (responseGetCollectionsForCard.status === 200) {
        const data = await responseGetCollectionsForCard.json();
        const cardCollections = data.collections;
        myCollectionsForCard = cardCollections;
        setCollectionsForCard(cardCollections);
      }

      const collectionsDivEl = document.getElementById("collections-div");
      const childDivs = collectionsDivEl.children;
      Array.from(childDivs).map((div) => {
        const collectLabel = div.firstElementChild;
        const collectCheckbox = div.lastElementChild;
        const matching = myCollectionsForCard.filter(
          (collect) => collect.title === collectLabel.textContent,
        );
        if (matching.length > 0) {
          collectCheckbox.checked = true;
        }
      });
    };

    getData();
  }, [resultMessage]);

  const addCardToCollection = async (event) => {
    event.preventDefault();
    let totalResultMessage = [];
    const checkedCollections = [];
    const uncheckedCollections = [];
    const collectionsDivEl = document.getElementById("collections-div");
    const childDivs = collectionsDivEl.children;
    Array.from(childDivs).map((div) => {
      const collectLabel = div.firstElementChild;
      const collectCheckbox = div.lastElementChild;
      if (collectCheckbox.checked) {
        checkedCollections.push(collectLabel.textContent);
      } else {
        uncheckedCollections.push(collectLabel.textContent);
      }
    });
    const collectionsToAddObjs = [];
    checkedCollections.map((collect) => {
      const alreadyAddedObjArray = collectionsForCard.filter(
        (obj) => obj.title === collect,
      );

      if (alreadyAddedObjArray.length === 0) {
        const collectObjArray = collections.filter(
          (obj) => obj.title === collect,
        );
        collectionsToAddObjs.push(collectObjArray[0]);
      }
    });
    collectionsToAddObjs.map(async (collectObj) => {
      const cardId = tradingCard._id;
      const collectionId = collectObj._id;
      const respAddCardToCollect = await server.addCardToCollection(collectionId, cardId);
      if (respAddCardToCollect.status === 200) {
        totalResultMessage.push(
          `Card successfully added to ${collectObj.title} collection`,
        );
        setResultMessage(totalResultMessage);
      } else {
        totalResultMessage.push(
          `Could not add card to ${collectObj.title} collection`,
        );
        setResultMessage(totalResultMessage);
      }
    });
    const collectionsToRemoveObjs = [];
    uncheckedCollections.map((collect) => {
      const notYetDeletedArray = collectionsForCard.filter(
        (obj) => obj.title === collect,
      );
      if (notYetDeletedArray.length > 0) {
        collectionsToRemoveObjs.push(notYetDeletedArray[0]);
      }
    });
    collectionsToRemoveObjs.map(async (collectObj) => {
      const cardId = tradingCard._id;
      const collectionId = collectObj._id;
      const responseDeleteCollections = await server.removeCardFromCollection(collectionId, cardId);
      if (responseDeleteCollections.status === 200) {
        totalResultMessage.push(
          `Card successfully removed from ${collectObj.title} collection`,
        );
        setResultMessage(totalResultMessage);
      } else {
        totalResultMessage.push(
          `Card not removed from ${collectObj.title} collection`,
        );
        setResultMessage(totalResultMessage);
      }
    });
  };

  return (
    <div className="div-add-cards">
      <h3>Add card to a collection</h3>
      <form id="card-form" className="form-card">
        <div key={tradingCard.certificationNumber} className={`div-card`}>
          <img
            src={frontCardImageURL}
            alt={`picture of a ${tradingCard.year} ${tradingCard.brand} ${tradingCard.subject} card`}
            className="img-small"
          ></img>
        </div>
        <p>
          {tradingCard.gradingCompany}: {tradingCard.certificationNumber}
        </p>
        <label htmlFor="collections-div">Collections</label>
        <div className="div-collections" id="collections-div">
          {Array.from(collections).map((collect) => {
            if (collect.title !== username) {
              return (
                <div
                  className="div-collection-check"
                  id={`${collect.title}-div`}
                  key={`${collect.title}-div`}
                >
                  <label
                    htmlFor={`${collect.title}-check`}
                    id={`${collect.title}-check-label`}
                    key={`${collect.title}-check-label`}
                  >
                    {collect.title}
                  </label>
                  <input
                    type="checkbox"
                    id={`${collect.title}-check`}
                    key={`${collect.title}-check`}
                  />
                </div>
              );
            }
          })}
        </div>
        <div className="div-input-group div-add-button">
          <input
            className="btn"
            type="submit"
            value="Update Collections For Card"
            onClick={addCardToCollection}
          />
        </div>
        <div>
          {resultMessage.map((result, index) => {
            return <p key={`message${index}`}>{result}</p>;
          })}
        </div>
      </form>
    </div>
  );
}

export default AddCardToCollection;
