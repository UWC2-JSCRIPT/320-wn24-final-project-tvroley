import "./App.css";
import PropTypes from "prop-types";

function NextPrevButtons({
  collectionLength,
  offset,
  setOffset,
  cardsPerPage,
}) {
  const nextCards = () => {
    if (offset + cardsPerPage < collectionLength) {
      setOffset(offset + cardsPerPage);
    }
  };

  const previousCards = () => {
    if (offset - cardsPerPage >= 0) {
      setOffset(offset - cardsPerPage);
    }
  };

  const getLastCard = () => {
    if (offset + cardsPerPage + 1 > collectionLength) {
      return collectionLength;
    } else {
      return offset + cardsPerPage;
    }
  };

  return (
    <>
      <p>
        Showing cards {offset + 1} through {getLastCard()} of {collectionLength}
      </p>
      <div className="div-next-button">
        <button onClick={previousCards}>Previous</button>
        <button onClick={nextCards}>Next</button>
      </div>
    </>
  );
}

NextPrevButtons.propTypes = {
  collectionLength: PropTypes.number.isRequired,
  setOffset: PropTypes.func.isRequired,
  cardsPerPage: PropTypes.number.isRequired,
  offset: PropTypes.number.isRequired,
};

export default NextPrevButtons;
