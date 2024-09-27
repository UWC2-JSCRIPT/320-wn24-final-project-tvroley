import "./App.css";
import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import firebaseApp from "./firebaseApp";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

function TradingCard({ tradingCard, collections }) {
  const [frontCardImageURL, setFrontCardImageURL] = useState("");
  const [backCardImageURL, setBackCardImageURL] = useState("");
  const storage = getStorage(firebaseApp);

  useEffect(() => {
    const getImageURLs = async () => {
      let correctedCert = tradingCard.certificationNumber;
      if (correctedCert.substring(correctedCert.length - 4) === "DEMO") {
        correctedCert = correctedCert.substring(0, correctedCert.length - 4);
      }
      const frontCardImageRef = ref(storage, `images/${tradingCard._id}-front`);
      getDownloadURL(frontCardImageRef)
        .then((url) => {
          setFrontCardImageURL(url);
        })
        .catch((error) => {
          console.log(error);
        });
      const backCardImageRef = ref(storage, `images/${tradingCard._id}-back`);
      getDownloadURL(backCardImageRef)
        .then((url) => {
          setBackCardImageURL(url);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getImageURLs();
  }, []);

  const navigate = useNavigate();

  const goEdit = () => {
    navigate(`/collection/${tradingCard._id}`, {
      state: { frontCardImageURL: frontCardImageURL },
    });
  };

  const goDelete = () => {
    navigate(`/collection/deletecard/${tradingCard._id}`, {
      state: { tradingCard: tradingCard, frontCardImageURL: frontCardImageURL },
    });
  };

  const goAddToCollection = () => {
    navigate(`addtocollection/${tradingCard._id}`, {
      state: {
        tradingCard: tradingCard,
        collections: collections,
        frontCardImageURL: frontCardImageURL,
      },
    });
  };

  const flipImage = (event) => {
    const el =
      event.target.parentElement.parentElement.parentElement.firstChild;
    if (el.src === frontCardImageURL) {
      el.src = backCardImageURL;
    } else {
      el.src = frontCardImageURL;
    }
  };

  const checkImageLoaded = (event) => {
    const el =
      event.target.parentElement.parentElement.parentElement.firstChild;
    if (el.src === "") {
      el.src = frontCardImageURL;
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

  const getButtons = () => {
    const collectionsPage = useLocation().pathname.split("/")[1];
    if (collectionsPage === "collection") {
      return (
        <>
          <div className="div-card-buttons">
            <button onClick={(event) => goEdit(event)}>Edit</button>
            <button onClick={(event) => goAddToCollection(event)}>
              Add To A Collection
            </button>
            <button onClick={flipImage}>Flip Image</button>
            <button onClick={goDelete}>Delete</button>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className="div-card-buttons">
            <button onClick={flipImage}>Flip Image</button>
          </div>
        </>
      );
    }
  };

  return (
    <>
      <img
        src={frontCardImageURL}
        alt={`picture of a ${tradingCard.gradingCompany} ${tradingCard.grade} ${tradingCard.cardSet} ${tradingCard.subject} card`}
        onClick={(event) => toggleImageSize(event)}
        onLoad={checkImageLoaded}
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
      <div className="div-cards-buttons">{getButtons()}</div>
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
