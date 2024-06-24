import "./App.css";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function AddCardToCollection({}) {
  const [tradingCard, setTradingCard] = useState({});
  const [resultMessage, setResultMessage] = useState(false);
  const [collections, setCollections] = useState([]);
  const [collectionsForCard, setCollectionsForCard] = useState([]);
  const [username, setUsername] = useState(
    localStorage.getItem("cardsUsername"),
  );

  const cardId = useLocation().pathname.split("/")[3];

  useEffect(() => {
    const getData = async () => {
      let urlGetCard = new URL(
        `https://trading-cards-backend-production.up.railway.app/cards/${cardId}`,
      );
      const responseGetCard = await fetch(urlGetCard, {
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
      if (responseGetCard.status === 200) {
        const data = await responseGetCard.json();
        setTradingCard(data.card);
      } else {
        setResultMessage(`Could not fetch card`);
      }
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
      const responseGetCollectionsForCard = await fetch(urlGetCollectionsForCard, {
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
        const matching = myCollectionsForCard.filter((collect) => collect.title === collectLabel.textContent);
        if (matching.length > 0) {
          collectCheckbox.checked = true;
        }
      });
    };

    getData();
  }, []);

  const addCardToCollection = async (event) => {
    event.preventDefault();
    const checkedCollections = [];
    const collectionsDivEl = document.getElementById("collections-div");
    const childDivs = collectionsDivEl.children;
    Array.from(childDivs).map((div) => {
      const collectLabel = div.firstElementChild;
      const collectCheckbox = div.lastElementChild;
      if (collectCheckbox.checked) {
        checkedCollections.push(collectLabel.textContent);
      }
    });
    const collectionsToAddObjs = [];
    checkedCollections.map((collect) => {
      const alreadyAddedObjArray = collectionsForCard.filter(
        (obj) => obj.title === collect,
      );

      if(alreadyAddedObjArray.length === 0) {
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
        setResultMessage(`Card successfully added to collection`);
      } else {
        setResultMessage(`Could not add card to collection`);
      }
    });
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
            return (
              <div
                className="div-collection-check"
                key={`${collect.title}-div`}
              >
                <label htmlFor={`${collect.title}-check`}>
                  {collect.title}
                </label>
                <input type="checkbox" key={`${collect.title}-check`} />
              </div>
            );
          })}
        </div>
        <div className="div-input-group">
          <input
            className="btn"
            type="submit"
            value="Submit Card"
            onClick={addCardToCollection}
          />
        </div>
        <p>{resultMessage}</p>
      </form>
    </div>
  );
}

export default AddCardToCollection;
