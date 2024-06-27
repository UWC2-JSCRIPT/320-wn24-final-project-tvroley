import "./App.css";
import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";

function TradingCard({ tradingCard }) {
  const navigate = useNavigate();

  const goEdit = () => {
    navigate(`/collection/${tradingCard._id}`);
  };

  const goAddToCollection = () => {
    navigate(`addtocollection/${tradingCard._id}`);
  };

  const flipImage = (event) => {
    const el = event.target.parentElement.parentElement.firstChild;
    if (el.src === tradingCard.frontCardImageLink) {
      el.src = tradingCard.backCardImageLink;
    } else {
      el.src = tradingCard.frontCardImageLink;
    }
  };

  const toggleImageSize = (event) => {
    const el = event.target;
    el.classList.toggle("img-small");
  };

  const getCardNumberText = () => {
    let currentCardNumber = "";
    if (tradingCard.cardNumber) {
      currentCardNumber = `#${tradingCard.cardNumber} `;
    }
    return currentCardNumber;
  };

  const getVarietyText = () => {
    let currentVariety = "";
    if (tradingCard.variety) {
      currentVariety = `${tradingCard.variety} `;
    }
    return currentVariety;
  };

  const getCollectionsPageType = () => {
    const collectionsPage = useLocation().pathname.split("/")[1];
    if(collectionsPage === "collection") {
      return (
        <>
        <button onClick={(event) => goEdit(event)}>Edit</button>
        <button onClick={(event) => goAddToCollection(event)}>
          Add Card To A Collection
        </button>
        </>
      )
    }
  }

  return (
    <>
      <img
        src={tradingCard.frontCardImageLink}
        alt={`picture of a ${tradingCard.year} ${tradingCard.brand} ${tradingCard.subject} card`}
        onClick={(event) => toggleImageSize(event)}
        className="img-small"
      />
      <div>
        <p>{`${tradingCard.cardSet}`}</p>
        <p>{`${getVarietyText()}`}</p>
        <p>{`${getCardNumberText()}${tradingCard.subject}`}</p>
        <p>
          {tradingCard.gradingCompany} {tradingCard.grade} #
          {tradingCard.certificationNumber}
        </p>
      </div>
      <div className="div-cards-buttons">
        {getCollectionsPageType()}
        <button onClick={(event) => flipImage(event)}>Flip Image</button>
      </div>
    </>
  );
}

TradingCard.propTypes = {
  tradingCard: PropTypes.shape({
    year: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    brand: PropTypes.string,
    cardSet: PropTypes.string,
    variety: PropTypes.string,
    cardNumber: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    subject: PropTypes.string,
    gradingCompany: PropTypes.string,
    grade: PropTypes.string,
    certificationNumber: PropTypes.string,
    frontCardImageLink: PropTypes.string,
    backCardImageLink: PropTypes.string,
    sold: PropTypes.bool,
  }),
};

export default TradingCard;
