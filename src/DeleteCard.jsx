import "./App.css";
import { useLocation } from "react-router-dom";
import { useState } from "react";

function DeleteCard({}) {
  const location = useLocation();
  const tradingCard = location.state.tradingCard;
  const [resultMessage, setResultMessage] = useState("");

  const deleteCard = async (event) => {
    event.preventDefault();
    let urlPostCard = new URL(
      `https://trading-cards-backend-production.up.railway.app/cards/` +
        tradingCard._id,
    );
    const responseGetCollections = await fetch(urlPostCard, {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("cardsToken"),
      },
    });
    if (responseGetCollections.status === 200) {
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
            src={tradingCard.frontCardImageLink}
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
        </div>
      </form>
    </div>
  );
}

export default DeleteCard;
