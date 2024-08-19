import "./App.css";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import firebaseApp from "./firebaseApp";
import { getStorage, ref, uploadBytesResumable } from "firebase/storage";

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
  const [sold, setSold] = useState(false);
  const [resultMessage, setResultMessage] = useState(false);
  const [username, setUsername] = useState(
    localStorage.getItem("cardsUsername"),
  );
  const handleCheck = () => {
    setSold(!sold);
  };
  const cardId = useLocation().pathname.split("/")[2];

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
    setSold(tradingCard.sold);
  };

  const editCard = async (event) => {
    event.preventDefault();

    const frontCardImageFileEl = document.getElementById(
      "front-image-file-input",
    );
    const frontCardImageFile = frontCardImageFileEl.files[0];
    const backCardImageFileEl = document.getElementById(
      "back-image-file-input",
    );
    const backCardImageFile = backCardImageFileEl.files[0];

    if (
      year &&
      brand &&
      cardSet &&
      subject &&
      gradingCompany &&
      grade &&
      certificationNumber &&
      frontCardImageFile &&
      backCardImageFile
    ) {
      const storage = getStorage(firebaseApp);
      const frontCardImageRef = ref(
        storage,
        `${username}/${gradingCompany}${certificationNumber}front`,
      );
      if (frontCardImageFile) {
        const uploadFrontTask = uploadBytesResumable(
          frontCardImageRef,
          frontCardImageFile,
        );
        uploadFrontTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setResultMessage(`Upload is ${progress}% done`);
            switch (snapshot.state) {
              case "paused":
                setResultMessage("Upload is paused");
                break;
              case "running":
                setResultMessage("Upload is running");
                break;
            }
          },
          (error) => {
            setResultMessage(`Error uploading front card image: ${error}`);
          },
          () => {
            frontCardImageFileEl.classList.remove("invalid");
            const backCardImageRef = ref(
              storage,
              `${username}/${gradingCompany}${certificationNumber}back`,
            );
            if (backCardImageFile) {
              const uploadBackTask = uploadBytesResumable(
                backCardImageRef,
                backCardImageFile,
              );
              uploadBackTask.on(
                "state_changed",
                (snapshot) => {
                  const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                  setResultMessage(`Upload is ${progress}% done`);
                  switch (snapshot.state) {
                    case "paused":
                      setResultMessage("Upload is paused");
                      break;
                    case "running":
                      setResultMessage("Upload is running");
                      break;
                  }
                },
                (error) => {
                  setResultMessage(`Error uploading back card image: ${error}`);
                },
                async () => {
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
                    setResultMessage(`Card successfully edited`);
                  } else {
                    setResultMessage(`Could not edit card`);
                  }
                },
              );
            } else {
              setResultMessage(`Please select a back card image file`);
            }
          },
        );
      } else {
        setResultMessage(`Please select a front card image file`);
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
            <label htmlFor="front-image-file-input">Front Image Link</label>
            <input type="file" id="front-image-file-input"></input>
          </div>
          <div className="div-input-label">
            <label htmlFor="back-image-file-input">Back Image Link</label>
            <input type="file" id="back-image-file-input"></input>
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
        <div className="div-input-group div-add-button">
          <input
            className="btn"
            type="submit"
            value="Edit Card"
            onClick={editCard}
          />
        </div>
        <p>{resultMessage}</p>
      </form>
    </div>
  );
}

export default EditCard;
