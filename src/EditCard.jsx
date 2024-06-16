import "./App.css";
import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import firebaseConfig from "./firebaseConfig";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

function EditCard({}) {
  const [tradingCard, setTradingCard] = useState({});
  const [year, setYear] = useState(0);
  const [brand, setBrand] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardSet, setCardSet] = useState("");
  const [variety, setVariety] = useState("");
  const [subject, setSubject] = useState("");
  const [gradingCompany, setGradingCompany] = useState("");
  const [grade, setGrade] = useState("");
  const [certificationNumber, setCertificationNumber] = useState("");
  const [frontCardImageLink, setFrontCardImageLink] = useState("");
  const [backCardImageLink, setBackCardImageLink] = useState("");
  const [sold, setSold] = useState(false);
  const handleCheck = () => {
    setSold(!sold);
  };
  const cardId = useLocation().pathname.split("/")[2];

  firebase.initializeApp(firebaseConfig);

  useEffect(() => {
    const getData = async () => {
      console.log(cardId);
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
        console.log(responseGetCard);
        const data = await responseGetCard.json();
        setTradingCard(data.card);
        console.log(tradingCard);
      }
    };
    getData();
  }, []);

  const populateFields = () => {
    setYear(tradingCard.year);
    setBrand(tradingCard.brand);
    setCardNumber(tradingCard.cardNumber || "");
    setCardSet(tradingCard.cardSet);
    setVariety(tradingCard.variety || "");
    setSubject(tradingCard.subject);
    setGradingCompany(tradingCard.gradingCompany);
    setGrade(tradingCard.grade);
    setCertificationNumber(tradingCard.certificationNumber);
    setFrontCardImageLink(tradingCard.frontCardImageLink);
    setBackCardImageLink(tradingCard.backCardImageLink);
    setSold(tradingCard.sold);
  };

  const editCard = async (event) => {
    event.preventDefault();

    if (
      year &&
      brand &&
      cardSet &&
      subject &&
      gradingCompany &&
      grade &&
      certificationNumber &&
      frontCardImageLink &&
      backCardImageLink
    ) {
      const myCard = {
        year: Number(year),
        brand: brand,
        cardNumber: cardNumber,
        cardSet: cardSet,
        variety: variety,
        subject: subject,
        gradingCompany: tradingCard.gradingCompany,
        grade: grade,
        certificationNumber: tradingCard.certificationNumber,
        frontCardImageLink: frontCardImageLink,
        backCardImageLink: backCardImageLink,
        sold: Boolean(sold),
      };

      let urlGetCard = new URL(
        `https://trading-cards-backend-production.up.railway.app/cards/${tradingCard._id}`,
      );
      const responseGetCards = await fetch(urlGetCard, {
        method: "PUT",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("cardsToken"),
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify(myCard),
      });
      if (responseGetCards.status === 200) {
        const data = await responseGetCards.json();
        console.log(data);
      }

      const yearEl = document.getElementById("year-input");
      yearEl.classList.remove("invalid");
      const brandEl = document.getElementById("brand-input");
      brandEl.classList.remove("invalid");
      const cardNumberEl = document.getElementById("card-set-input");
      cardNumberEl.classList.remove("invalid");
      const subjectEl = document.getElementById("subject-input");
      subjectEl.classList.remove("invalid");
      const gradeEl = document.getElementById("grade-input");
      gradeEl.classList.remove("invalid");
      const gradingCompanyEl = document.getElementById("grading-company-input");
      gradingCompanyEl.classList.remove("invalid");
      const certificationNumberEl = document.getElementById(
        "certification-number-input",
      );
      certificationNumberEl.classList.remove("invalid");
      const frontEl = document.getElementById("front-image-link-input");
      frontEl.classList.remove("invalid");
      const backEl = document.getElementById("back-image-link-input");
      backEl.classList.remove("invalid");
    } else {
      if (!year) {
        const yearEl = document.getElementById("year-input");
        yearEl.classList.add("invalid");
      } else {
        const yearEl = document.getElementById("year-input");
        yearEl.classList.remove("invalid");
      }
      if (!brand) {
        const brandEl = document.getElementById("brand-input");
        brandEl.classList.add("invalid");
      } else {
        const brandEl = document.getElementById("brand-input");
        brandEl.classList.remove("invalid");
      }
      if (!cardSet) {
        const cardNumberEl = document.getElementById("card-set-input");
        cardNumberEl.classList.add("invalid");
      } else {
        const cardNumberEl = document.getElementById("card-set-input");
        cardNumberEl.classList.remove("invalid");
      }
      if (!subject) {
        const subjectEl = document.getElementById("subject-input");
        subjectEl.classList.add("invalid");
      } else {
        const subjectEl = document.getElementById("subject-input");
        subjectEl.classList.remove("invalid");
      }
      if (!grade) {
        const gradeEl = document.getElementById("grade-input");
        gradeEl.classList.add("invalid");
      } else {
        const gradeEl = document.getElementById("grade-input");
        gradeEl.classList.remove("invalid");
      }
      if (!gradingCompany) {
        const gradingCompanyEl = document.getElementById(
          "grading-company-input",
        );
        gradingCompanyEl.classList.add("invalid");
      } else {
        const gradingCompanyEl = document.getElementById(
          "grading-company-input",
        );
        gradingCompanyEl.classList.remove("invalid");
      }
      if (!certificationNumber) {
        const certificationNumberEl = document.getElementById(
          "certification-number-input",
        );
        certificationNumberEl.classList.add("invalid");
      } else {
        const certificationNumberEl = document.getElementById(
          "certification-number-input",
        );
        certificationNumberEl.classList.remove("invalid");
      }
      if (!frontCardImageLink) {
        const frontEl = document.getElementById("front-image-link-input");
        frontEl.classList.add("invalid");
      } else {
        const frontEl = document.getElementById("front-image-link-input");
        frontEl.classList.remove("invalid");
      }
      if (!backCardImageLink) {
        const backEl = document.getElementById("back-image-link-input");
        backEl.classList.add("invalid");
      } else {
        const backEl = document.getElementById("back-image-link-input");
        backEl.classList.remove("invalid");
      }
    }
  };

  return (
    <div className="div-add-cards">
      <h3>Edit Card</h3>
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
      <div>
        <button onClick={populateFields}>Populate Fields</button>
      </div>
      <form id="card-form" className="form-card">
        <div className="div-input-group">
          <div className="div-input-label">
            <label htmlFor="year-input">Year</label>
            <input
              id="year-input"
              type="number"
              min="0"
              max="2050"
              step="1"
              onChange={(e) => setYear(e.target.value)}
              value={year}
              required
            />
          </div>
          <div className="div-input-label">
            <label htmlFor="brand-input">Brand</label>
            <input
              id="brand-input"
              type="text"
              required
              minLength="1"
              maxLength="50"
              onChange={(e) => setBrand(e.target.value)}
              value={brand}
            />
          </div>
          <div className="div-input-label">
            <label htmlFor="card-number-input">Card Number</label>
            <input
              id="card-number-input"
              type="text"
              maxLength="15"
              onChange={(e) => setCardNumber(e.target.value)}
              value={cardNumber}
            />
          </div>
        </div>
        <div className="div-input-group">
          <div className="div-input-label">
            <label htmlFor="card-set-input">Set</label>
            <input
              id="card-set-input"
              type="text"
              maxLength="100"
              onChange={(e) => setCardSet(e.target.value)}
              value={cardSet}
              required
            />
          </div>
          <div className="div-input-label">
            <label htmlFor="card-variety-input">Variety</label>
            <input
              id="card-variety-input"
              type="text"
              maxLength="100"
              onChange={(e) => setVariety(e.target.value)}
              value={variety}
            />
          </div>
          <div className="div-input-label">
            <label htmlFor="subject-input">Subject</label>
            <input
              id="subject-input"
              type="text"
              minLength="1"
              maxLength="100"
              required
              onChange={(e) => setSubject(e.target.value)}
              value={subject}
            />
          </div>
        </div>
        <div className="div-input-group">
          <div className="div-input-label">
            <label htmlFor="grading-company-input">Grading Company</label>
            <input
              id="grading-company-input"
              type="text"
              minLength="1"
              maxLength="100"
              required
              onChange={(e) => setGradingCompany(e.target.value)}
              value={gradingCompany}
            />
          </div>
          <div className="div-input-label">
            <label htmlFor="grade-input">Grade</label>
            <input
              id="grade-input"
              type="text"
              minLength="1"
              maxLength="50"
              required
              onChange={(e) => setGrade(e.target.value)}
              value={grade}
            />
          </div>
          <div className="div-input-label">
            <label htmlFor="certification-number-input">
              Certification Number
            </label>
            <input
              id="certification-number-input"
              type="text"
              minLength="1"
              maxLength="100"
              required
              onChange={(e) => setCertificationNumber(e.target.value)}
              value={certificationNumber}
            />
          </div>
        </div>
        <div className="div-input-group">
          <div className="div-input-label">
            <label htmlFor="front-image-link-input">Front Image Link</label>
            <input
              id="front-image-link-input"
              type="text"
              minLength="1"
              maxLength="400"
              required
              onChange={(e) => setFrontCardImageLink(e.target.value)}
              value={frontCardImageLink}
            />
          </div>
          <div className="div-input-label">
            <label htmlFor="back-image-link-input">Back Image Link</label>
            <input
              id="back-image-link-input"
              type="text"
              minLength="1"
              maxLength="400"
              required
              onChange={(e) => setBackCardImageLink(e.target.value)}
              value={backCardImageLink}
            />
          </div>
          <div className="div-input-label">
            <label htmlFor="sold-input">Sold</label>
            <input
              type="checkbox"
              id="sold-input"
              checked={sold}
              onChange={handleCheck}
            />
          </div>
        </div>
        <div className="div-input-group">
          <input
            className="btn"
            type="submit"
            value="Edit Card"
            onClick={editCard}
          />
        </div>
      </form>
    </div>
  );
}

export default EditCard;
