import "./App.css";
import PropTypes from "prop-types";

function SortButtons({ collectionId, setTradingCardCollection }) {
  const sortCards = async (event) => {
    let sortBy = "year";
    const buttonId = event.target.id;
    switch (buttonId) {
      case "sort-cert-button":
        sortBy = "cert";
        break;
      case "sort-year-button":
        sortBy = "year";
        break;
      case "sort-subject-button":
        sortBy = "subject";
        break;
      case "sort-sold-button":
        sortBy = "sold";
        break;
      case "sort-brand-button":
        sortBy = "brand";
        break;
      case "sort-set-button":
        sortBy = "cardSet";
        break;
      default:
        console.log("unkown button pressed");
        return;
    }

    let url = new URL(
      `https://trading-cards-backend-production.up.railway.app/collections/` +
        collectionId,
    );
    url.searchParams.append("verbose", "true");
    url.searchParams.append("sortBy", sortBy);
    const response = await fetch(url, {
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

    if (response.status === 200) {
      const data = await response.json();
      setTradingCardCollection(data.tradingCards);
    }
  };

  return (
    <>
      <div className="div-sort-buttons">
        <button id="sort-cert-button" onClick={sortCards}>
          Sort By Certification Number
        </button>
        <button id="sort-year-button" onClick={sortCards}>
          Sort By Year
        </button>
        <button id="sort-subject-button" onClick={sortCards}>
          Sort By Subject
        </button>
        <button id="sort-sold-button" onClick={sortCards}>
          Sort By Sold Status
        </button>
        <button id="sort-brand-button" onClick={sortCards}>
          Sort By Brand
        </button>
        <button id="sort-set-button" onClick={sortCards}>
          Sort By Card Set
        </button>
      </div>
    </>
  );
}

SortButtons.propTypes = {
  collectionId: PropTypes.string.isRequired,
  setTradingCardCollection: PropTypes.func.isRequired,
};

export default SortButtons;
