import "./App.css";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import firebaseApp from "./firebaseApp";
import { getStorage, ref, uploadBytesResumable } from "firebase/storage";
import Nav from "./Nav";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Mongo from "./Mongo";

function EditCard({}) {
  const [tradingCard, setTradingCard] = useState({});
  const [year, setYear] = useState(0);
  const [brand, setBrand] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardSet, setCardSet] = useState("");
  const [variety, setVariety] = useState("");
  const [subject, setSubject] = useState("");
  const [gradingCompany, setGradingCompany] = useState("PSA");
  const [grade, setGrade] = useState("");
  const [certificationNumber, setCertificationNumber] = useState("");
  const [sold, setSold] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [frontResultMessage, setFrontResultMessage] = useState("");
  const [backResultMessage, setBackResultMessage] = useState("");
  const [frontCardImageFile, setFrontCardImageFile] = useState("");
  const [backCardImageFile, setBackCardImageFile] = useState("");
  const maxHeight = 1008;
  const maxWidth = 600;
  const location = useLocation();
  const [frontCardImageURL, setFrontCardImageURL] = useState(
    location.state.frontCardImageURL,
  );
  const [username, setUsername] = useState(
    sessionStorage.getItem("cardsUsername"),
  );
  let uid;
  const fiveMB = 5 * 1024 * 1024;
  const server = new Mongo();

  const handleCheck = () => {
    setSold(!sold);
  };
  const cardId = useLocation().pathname.split("/")[2];

  useEffect(() => {
    const getData = async () => {
      const responseGetCard = await server.getCard(cardId);
      if (responseGetCard.status === 200) {
        const data = await responseGetCard.json();
        setTradingCard(data.card);
      } else {
        setResultMessage(`Could not fetch card`);
      }
    };
    getData();
  }, []);

  onAuthStateChanged(getAuth(firebaseApp), (user) => {
    if (user) {
      uid = user.uid;
    }
  });

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
      const myCard = {
        year: Number(year),
        brand: brand,
        cardNumber: cardNumber,
        cardSet: cardSet,
        variety: variety,
        subject: subject,
        gradingCompany: gradingCompany,
        grade: grade,
        certificationNumber: certificationNumber,
        sold: Boolean(sold),
      };
      const responseEditCard = await server.editCard(tradingCard._id, myCard);
      if (responseEditCard.status === 200) {
        const data = await responseEditCard.json();
        setResultMessage(`Card information updated`);
      } else {
        setResultMessage(
          `Could not edit card information, possibly because no changes were made, updating photos separately`,
        );
      }
      const frontMetaData = {
        contentType: frontCardImageFile.type,
        customMetadata: {
          author_uid: uid,
        },
      };
      const backMetaData = {
        contentType: backCardImageFile.type,
        customMetadata: {
          author_uid: uid,
        },
      };
      const storage = getStorage(firebaseApp);
      const frontCardImageRef = ref(storage, `images/${tradingCard._id}-front`);
      const uploadFrontTask = uploadBytesResumable(
        frontCardImageRef,
        frontCardImageFile,
        frontMetaData,
      );
      uploadFrontTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setFrontResultMessage(`Upload is ${progress}% done`);
          switch (snapshot.state) {
            case "paused":
              setFrontResultMessage("Uploading front of card image is paused");
              break;
            case "running":
              setFrontResultMessage("Uploading front of card image");
              break;
          }
        },
        (error) => {
          setFrontResultMessage(`Error uploading front card image: ${error}`);
        },
        () => {
          setFrontResultMessage(`Card front image successfully updated`);
        },
      );

      const backCardImageRef = ref(storage, `images/${tradingCard._id}-back`);
      const uploadBackTask = uploadBytesResumable(
        backCardImageRef,
        backCardImageFile,
        backMetaData,
      );
      uploadBackTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setBackResultMessage(`Upload is ${progress}% done`);
          switch (snapshot.state) {
            case "paused":
              setBackResultMessage("Uploading back of card image is paused");
              break;
            case "running":
              setBackResultMessage("Uploading back of card image");
              break;
          }
        },
        (error) => {
          setBackResultMessage(`Error uploading back card image: ${error}`);
        },
        async () => {
          setBackResultMessage(`Card back image successfully updated`);
        },
      );

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
      const gradingCompanyEl = document.getElementById(
        "grading-company-select",
      );
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
          "grading-company-select",
        );
        gradingCompanyEl.classList.add("invalid");
      } else {
        const gradingCompanyEl = document.getElementById(
          "grading-company-select",
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
      if (!frontCardImageFile) {
        setResultMessage(`Please select an image for the front of this card`);
      }
      if (!backCardImageFile) {
        setResultMessage(`Please select an image for the back of this card`);
      }
    }
  };

  const convertImage = (event) => {
    const el = event.target;
    let side = "front";
    if (el.id === "back-image-file-input") {
      side = "back";
    }
    const chosenImageFile = el.files[0];
    if (
      chosenImageFile.type !== "image/jpeg" &&
      chosenImageFile.type !== "image/png"
    ) {
      setResultMessage(`${side} image file must be a jpeg or png`);
      el.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const image = new Image();
      image.onload = (imageEvent) => {
        const canvas = document.createElement("canvas");
        let width = image.width;
        let height = image.height;
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(image, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg");
        const arr = dataUrl.split(",");
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[arr.length - 1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        const myFile = new File([u8arr], "temp", { type: mime });
        if (side === "front") {
          setFrontCardImageFile(myFile);
        } else {
          setBackCardImageFile(myFile);
        }
      };
      image.onerror = (imageError) => {
        setResultMessage(`Error converting image for uploading: ${imageError}`);
      };
      image.src = readerEvent.target.result;
    };
    reader.onerror = (readerError) => {
      setResultMessage(`Error converting image for uploading: ${readerError}`);
    };
    reader.readAsDataURL(chosenImageFile);
  };

  return (
    <>
      <div className="div-add-cards">
        <h3>Edit Card</h3>
        <div key={tradingCard.certificationNumber} className={`div-card`}>
          <img
            src={frontCardImageURL}
            alt={`picture of a ${tradingCard.gradingCompany} ${tradingCard.grade} ${tradingCard.cardSet} ${tradingCard.subject} card`}
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
              <label htmlFor="grading-company-select">Grading Company</label>
              <select
                name="grading-company"
                id="grading-company-select"
                required
                onChange={(e) => setGradingCompany(e.target.value)}
                value={gradingCompany}
              >
                <option value="PSA">PSA</option>
                <option value="SGC">SGC</option>
                <option value="CSG">CSG</option>
                <option value="CGC">CGC</option>
                <option value="BGS">BGS</option>
              </select>
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
              <input
                type="file"
                id="front-image-file-input"
                onChange={convertImage}
              ></input>
            </div>
            <div className="div-input-label">
              <label htmlFor="back-image-file-input">Back Image Link</label>
              <input
                type="file"
                id="back-image-file-input"
                onChange={convertImage}
              ></input>
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
          <p>{frontResultMessage}</p>
          <p>{backResultMessage}</p>
        </form>
      </div>
      <Nav />
    </>
  );
}

export default EditCard;
