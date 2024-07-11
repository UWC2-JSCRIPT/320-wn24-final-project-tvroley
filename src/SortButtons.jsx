import "./App.css";
import PropTypes from "prop-types";
import { useState } from "react";

function SortButtons({ collectionId, setTradingCardCollection }) {
  const [certAsc, setCertAsc] = useState("ASC");
  const [yearAsc, setYearAsc] = useState("ASC");
  const [subjectAsc, setSubjectAsc] = useState("ASC");
  const [soldAsc, setSoldAsc] = useState("ASC");
  const [brandAsc, setBrandAsc] = useState("ASC");
  const [setAsc, setSetAsc] = useState("ASC");
  const sortCards = async (event) => {
    let sortBy = "year";
    const buttonId = event.target.id;
    switch (buttonId) {
      case "sort-cert-button":
        sortBy = "cert";
        if(certAsc === "ASC") {
          setCertAsc("DESC");  
        } else {
          setCertAsc("ASC");
        }
        break;
      case "sort-year-button":
        sortBy = "year";
        if(yearAsc === "ASC") {
          setYearAsc("DESC");  
        } else {
          setYearAsc("ASC");
        }
        break;
      case "sort-subject-button":
        sortBy = "subject";
        if(subjectAsc === "ASC") {
          setSubjectAsc("DESC");  
        } else {
          setSubjectAsc("ASC");
        }
        break;
      case "sort-sold-button":
        sortBy = "sold";
        if(soldAsc === "ASC") {
          setSoldAsc("DESC");  
        } else {
          setSoldAsc("ASC");
        }
        break;
      case "sort-brand-button":
        sortBy = "brand";
        if(brandAsc === "ASC") {
          setBrandAsc("DESC");  
        } else {
          setBrandAsc("ASC");
        }
        break;
      case "sort-set-button":
        sortBy = "cardSet";
        if(setAsc === "ASC") {
          setSetAsc("DESC");  
        } else {
          setSetAsc("ASC");
        }
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
        <div className="div-sort-button">
        <button id="sort-cert-button" onClick={sortCards}>
          Sort By Certification Number
        </button>
        <label htmlFor="sort-cert-button">
          {certAsc}
        </label>
        </div>
        <div className="div-sort-button">
        <button id="sort-year-button" onClick={sortCards}>
          Sort By Year
        </button>
        <label htmlFor="sort-year-button">
          {yearAsc}
        </label>
        </div>
        <div className="div-sort-button">
        <button id="sort-subject-button" onClick={sortCards}>
          Sort By Subject
        </button>
        <label htmlFor="sort-subject-button">
          {subjectAsc}
        </label>
        </div>
        <div className="div-sort-button">
        <button id="sort-sold-button" onClick={sortCards}>
          Sort By Sold Status
        </button>
        <label htmlFor="sort-sold-button">
          {soldAsc}
        </label>
        </div>
        <div className="div-sort-button">
        <button id="sort-brand-button" onClick={sortCards}>
          Sort By Brand
        </button>
        <label htmlFor="sort-brand-button">
          {brandAsc}
        </label>
        </div>
        <div className="div-sort-button">
        <button id="sort-set-button" onClick={sortCards}>
          Sort By Card Set
        </button>
        <label htmlFor="sort-set-button">
          {setAsc}
        </label>
        </div>
      </div>
    </>
  );
}

SortButtons.propTypes = {
  collectionId: PropTypes.string.isRequired,
  setTradingCardCollection: PropTypes.func.isRequired,
};

export default SortButtons;
