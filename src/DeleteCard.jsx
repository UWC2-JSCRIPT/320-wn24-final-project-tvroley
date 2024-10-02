import "./App.css";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { getStorage, ref, deleteObject } from "firebase/storage";
import Mongo from "./Mongo";

function DeleteCard({}) {
  const location = useLocation();
  const tradingCard = location.state.tradingCard;
  const frontCardImageURL = location.state.frontCardImageURL;
  const [resultMessage, setResultMessage] = useState("");
  const [backMessage, setBackMessage] = useState("");
  const [frontMessage, setFrontMessage] = useState("");
  const server = new Mongo();

  const deleteCard = async (event) => {
    event.preventDefault();
    
    const responseDeleteCard = await server.deleteCard(tradingCard._id);
    if (responseDeleteCard.status === 200) {
      const storage = getStorage();
      const frontImageRef = ref(storage, `images/${tradingCard._id}-front`);

      deleteObject(frontImageRef).then(() => {
        setFrontMessage(`Deleted front of card image`);
      }).catch((error) => {
        setFrontMessage(`Error deleting front of card image: ${error.message}`);
      });

      const backImageRef = ref(storage, `images/${tradingCard._id}-back`);

      deleteObject(backImageRef).then(() => {
        setBackMessage(`Deleted back of card image`);
      }).catch((error) => {
        setBackMessage(`Error deleting back of card image: ${error.message}`);
      });

      setResultMessage(
        `Deleted ${tradingCard.gradingCompany} ${tradingCard.certificationNumber}`,
      );
    } else {
      setResultMessage(
        `Could not delete ${tradingCard.gradingCompany} ${tradingCard.certificationNumber}`,
      );
    }
  };

  return (
    <div className="div-add-cards">
      <h3>Are you sure you want to permanently delete this card?</h3>
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
        <p></p>
        <p>
          If you sold the card, you can just mark the card as sold, and keep it
          in your collection
        </p>
        <div className="div-input-group div-delete">
          <input
            className="btn"
            type="submit"
            value="Delete Card"
            onClick={deleteCard}
          />
        </div>
        <div>
          <p>{resultMessage}</p>
          <p>{frontMessage}</p>
          <p>{backMessage}</p>
        </div>
      </form>
    </div>
  );
}

export default DeleteCard;
