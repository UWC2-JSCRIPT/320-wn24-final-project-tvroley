import "./App.css";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function AddCardToCollection({}) {
  const [tradingCard, setTradingCard] = useState({});
  const [resultMessage, setResultMessage] = useState([]);
  const [collections, setCollections] = useState([]);
  const [collectionsForCard, setCollectionsForCard] = useState([]);
  const [username, setUsername] = useState(
    localStorage.getItem("cardsUsername"),
  );
  const cardId = useLocation().pathname.split("/")[3];
  const location = useLocation();
  const myTradingCard = location.state.tradingCard;

  useEffect(() => {
    const getData = async () => {
      setTradingCard(myTradingCard);
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
        setCollections(myCollections);
      }

      let urlGetCollectionsForCard = new URL(
        `https://trading-cards-backend-production.up.railway.app/collections/forcard/${cardId}`,
      );
      const responseGetCollectionsForCard = await fetch(
        urlGetCollectionsForCard,
        {
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
        },
      );
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
    setResultMessage([]);
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
      let urlPostCard = new URL(
        `https://trading-cards-backend-production.up.railway.app/collections/` +
          collectObj._id,
      );
      const cardIdObj = { cardId: cardId };
      const responseGetCollections = await fetch(urlPostCard, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("cardsToken"),
        },
        body: JSON.stringify(cardIdObj),
      });
      if (responseGetCollections.status === 200) {
        totalResultMessage.push(
          `Card successfully added to ${collectObj.title} collection`,
        );
      } else {
        totalResultMessage.push(
          `Could not add card to ${collectObj.title} collection`,
        );
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
      let urlDeleteCard = new URL(
        `https://trading-cards-backend-production.up.railway.app/collections/forcard/`,
      );
      urlDeleteCard.searchParams.append("card", cardId);
      urlDeleteCard.searchParams.append("collection", collectObj._id);
      const responseDeleteCollections = await fetch(urlDeleteCard, {
        method: "DELETE",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("cardsToken"),
        },
      });
      if (responseDeleteCollections.status === 200) {
        totalResultMessage.push(
          `Card successfully removed from ${collectObj.title} collection`,
        );
      } else {
        totalResultMessage.push(
          `Card not removed from ${collectObj.title} collection`,
        );
      }
    });
    setResultMessage(totalResultMessage);
  };

  return (
    <div className="div-add-cards">
      <h3>Add card to a collection</h3>
      <form id="card-form" className="form-card">
        <div key={tradingCard.certificationNumber} className={`div-card`}>
          <img
            src={tradingCard.frontCardImageLink}
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
