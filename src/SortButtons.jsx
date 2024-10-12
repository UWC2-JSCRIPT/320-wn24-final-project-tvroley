import "./App.css";
import PropTypes from "prop-types";
import { useState } from "react";
import Mongo from "./Mongo";

function SortButtons({ collectionId, setTradingCardCollection, setOffset }) {
  const [certAsc, setCertAsc] = useState("ASC");
  const [yearAsc, setYearAsc] = useState("ASC");
  const [subjectAsc, setSubjectAsc] = useState("ASC");
  const [soldAsc, setSoldAsc] = useState("ASC");
  const [brandAsc, setBrandAsc] = useState("ASC");
  const [setAsc, setSetAsc] = useState("ASC");
  const server = new Mongo();
  const sortCards = async (event) => {
    let sortBy = "year";
    const buttonId = event.target.id;
    let currentAsc = "ASC";
    switch (buttonId) {
      case "sort-cert-button":
        sortBy = "cert";
        if (certAsc === "ASC") {
          setCertAsc("DESC");
          currentAsc = "DESC";
        } else {
          setCertAsc("ASC");
        }
        break;
      case "sort-year-button":
        sortBy = "year";
        if (yearAsc === "ASC") {
          setYearAsc("DESC");
          currentAsc = "DESC";
        } else {
          setYearAsc("ASC");
        }
        break;
      case "sort-subject-button":
        sortBy = "subject";
        if (subjectAsc === "ASC") {
          setSubjectAsc("DESC");
          currentAsc = "DESC";
        } else {
          setSubjectAsc("ASC");
        }
        break;
      case "sort-sold-button":
        sortBy = "sold";
        if (soldAsc === "ASC") {
          setSoldAsc("DESC");
          currentAsc = "DESC";
        } else {
          setSoldAsc("ASC");
        }
        break;
      case "sort-brand-button":
        sortBy = "brand";
        if (brandAsc === "ASC") {
          setBrandAsc("DESC");
          currentAsc = "DESC";
        } else {
          setBrandAsc("ASC");
        }
        break;
      case "sort-set-button":
        sortBy = "cardSet";
        if (setAsc === "ASC") {
          setSetAsc("DESC");
          currentAsc = "DESC";
        } else {
          setSetAsc("ASC");
        }
        break;
      default:
        console.log("unkown button pressed");
        return;
    }
    const response = await server.sort(collectionId, sortBy, currentAsc);

    if (response.status === 200) {
      const data = await response.json();
      setTradingCardCollection(data.tradingCards);
      setOffset(0);
    }
  };

  return (
    <>
      <div className="div-sort-buttons">
        <div className="div-sort-button">
          <button id="sort-cert-button" onClick={sortCards}>
            Sort By Certification Number
          </button>
          <label htmlFor="sort-cert-button">{certAsc}</label>
        </div>
        <div className="div-sort-button">
          <button id="sort-year-button" onClick={sortCards}>
            Sort By Year
          </button>
          <label htmlFor="sort-year-button">{yearAsc}</label>
        </div>
        <div className="div-sort-button">
          <button id="sort-subject-button" onClick={sortCards}>
            Sort By Subject
          </button>
          <label htmlFor="sort-subject-button">{subjectAsc}</label>
        </div>
        <div className="div-sort-button">
          <button id="sort-sold-button" onClick={sortCards}>
            Sort By Sold Status
          </button>
          <label htmlFor="sort-sold-button">{soldAsc}</label>
        </div>
        <div className="div-sort-button">
          <button id="sort-brand-button" onClick={sortCards}>
            Sort By Brand
          </button>
          <label htmlFor="sort-brand-button">{brandAsc}</label>
        </div>
        <div className="div-sort-button">
          <button id="sort-set-button" onClick={sortCards}>
            Sort By Card Set
          </button>
          <label htmlFor="sort-set-button">{setAsc}</label>
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
