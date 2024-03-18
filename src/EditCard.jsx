import './App.css';
import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc} from "firebase/firestore";
import db from './db';
import { useLocation, useParams } from "react-router-dom";

function EditCard({}) {
    const [tradingCard, setTradingCard] = useState({});
    const [year, setYear] = useState(0);
    const [brand, setBrand] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cardSet, setCardSet] = useState('');
    const [player, setPlayer] = useState('');
    const [gradingCompany, setGradingCompany] = useState('');
    const [grade, setGrade] = useState('');
    const [certificationNumber, setCertificationNumber] = useState('');
    const [frontCardImageLink, setFrontCardImageLink] = useState('');
    const [backCardImageLink, setBackCardImageLink] = useState('');
    const [sold, setSold] = useState(false);
    const handleCheck = () => {setSold(!sold)};
    const collectionName = useLocation().pathname.split("/")[1];
    const { id } = useParams();

    useEffect(() => {
        const getData = async () => {
            const docRef = doc(db, collectionName, id);
            const docSnap = await getDoc(docRef).catch(error => console.log(error));
            if (docSnap.exists()) {
                const myCard = docSnap.data();
                setTradingCard(myCard);
            } else {
                console.log("No such document!");
            }
        }

        getData();
    }, [id]);

    const populateFields = () => {
        setYear(tradingCard.year);
        setBrand(tradingCard.brand);
        setCardNumber(tradingCard.cardNumber);
        setCardSet(tradingCard.cardSet);
        setPlayer(tradingCard.player);
        setGrade(tradingCard.grade);
        setFrontCardImageLink(tradingCard.frontCardImageLink);
        setBackCardImageLink(tradingCard.backCardImageLink);
        setSold(tradingCard.sold);
    }

    const editCard = async(event) => {
        event.preventDefault();
        if(year && brand && cardSet && player && grade && frontCardImageLink && backCardImageLink){
            const card = {year: Number(year), brand: brand, cardNumber: cardNumber, cardSet: cardSet, player: player, gradingCompany: tradingCard.gradingCompany, grade: grade, certificationNumber: tradingCard.certificationNumber, frontCardImageLink: frontCardImageLink, backCardImageLink: backCardImageLink, sold: Boolean(sold)};
            const docRef = await setDoc(doc(db, collectionName, `${card.gradingCompany}${card.certificationNumber}`), {
                year: card.year,
                brand: card.brand,
                cardSet: card.cardSet,
                cardNumber: card.cardNumber,
                player: card.player,
                gradingCompany: card.gradingCompany,
                grade: card.grade,
                certificationNumber: card.certificationNumber,
                frontCardImageLink: card.frontCardImageLink,
                backCardImageLink: card.backCardImageLink,
                sold: card.sold
            }).catch(error => console.log(error));

            const yearEl = document.getElementById('year-input');
            yearEl.classList.remove('invalid');
            const brandEl = document.getElementById('brand-input');
            brandEl.classList.remove('invalid');
            const cardNumberEl = document.getElementById('card-set-input');
            cardNumberEl.classList.remove('invalid');
            const playerEl = document.getElementById('player-input');
            playerEl.classList.remove('invalid');
            const gradeEl = document.getElementById('grade-input');
            gradeEl.classList.remove('invalid');
            const frontEl = document.getElementById('front-image-link-input');
            frontEl.classList.remove('invalid');
            const backEl = document.getElementById('back-image-link-input');
            backEl.classList.remove('invalid');
        } else {
            if(!year){
                const yearEl = document.getElementById('year-input');
                yearEl.classList.add('invalid');
            } else {
                const yearEl = document.getElementById('year-input');
                yearEl.classList.remove('invalid');
            }
            if(!brand){
                const brandEl = document.getElementById('brand-input');
                brandEl.classList.add('invalid');
            } else {
                const brandEl = document.getElementById('brand-input');
                brandEl.classList.remove('invalid');
            }
            if(!cardSet){
                const cardNumberEl = document.getElementById('card-set-input');
                cardNumberEl.classList.add('invalid');
            } else {
                const cardNumberEl = document.getElementById('card-set-input');
                cardNumberEl.classList.remove('invalid');
            }
            if(!player){
                const playerEl = document.getElementById('player-input');
                playerEl.classList.add('invalid');
            } else {
                const playerEl = document.getElementById('player-input');
                playerEl.classList.remove('invalid');
            }
            if(!grade){
                const gradeEl = document.getElementById('grade-input');
                gradeEl.classList.add('invalid');
            } else {
                const gradeEl = document.getElementById('grade-input');
                gradeEl.classList.remove('invalid');
            }
            if(!frontCardImageLink){
                const frontEl = document.getElementById('front-image-link-input');
                frontEl.classList.add('invalid');
            } else {
                const frontEl = document.getElementById('front-image-link-input');
                frontEl.classList.remove('invalid');
            }
            if(!backCardImageLink){
                const backEl = document.getElementById('back-image-link-input');
                backEl.classList.add('invalid');
            } else {
                const backEl = document.getElementById('back-image-link-input');
                backEl.classList.remove('invalid');
            }
        }
    }

    return (
        <div className='div-add-cards'>
          <h3>Edit Card</h3>
          <img src={tradingCard.frontCardImageLink} className='img-small'></img>
          <img src={tradingCard.backCardImageLink} className='img-small'></img>
          <p>{tradingCard.gradingCompany}: {tradingCard.certificationNumber}</p>
          <div>
            <button onClick={populateFields}>Populate Fields</button>
          </div>
          <form id='card-form' className="form-card">
            <div className='div-input-group'>
                <div className='div-input-label'>
                    <label htmlFor="year-input">Year</label>
                    <input
                      id="year-input"
                      type="number"
                      min="0"
                      max="2050"
                      step="1"
                      onChange={e => setYear(e.target.value)} 
                      value={year}
                      required
                    />
                </div>
                <div className='div-input-label'>
                    <label htmlFor="brand-input">Brand</label>
                    <input
                        id="brand-input"
                        type="text"
                        required
                        minLength="1"
                        maxLength="50"
                        onChange={e => setBrand(e.target.value)} 
                        value={brand}
                    />
                </div>
                <div className='div-input-label'>
                    <label htmlFor="card-number-input">Card Number</label>
                    <input
                        id="card-number-input"
                        type="text"
                        maxLength="15"
                        onChange={e => setCardNumber(e.target.value)} 
                        value={cardNumber}
                    />
                </div>
            </div>
            <div className='div-input-group'>
                <div className='div-input-label'>
                    <label htmlFor="card-set-input">Set</label>
                    <input
                        id="card-set-input"
                        type="text"
                        maxLength="100"
                        onChange={e => setCardSet(e.target.value)} 
                        value={cardSet}
                        required
                    />
                </div>
                <div className='div-input-label'>
                    <label htmlFor="player-input">Player</label>
                    <input
                        id="player-input"
                        type="text"
                        minLength="1"
                        maxLength="100"
                        required
                        onChange={e => setPlayer(e.target.value)} 
                        value={player}
                    />
                </div>
            </div>
            <div className='div-input-group'>
                <div className='div-input-label'>
                    <label htmlFor="grade-input">Grade</label>
                    <input
                        id="grade-input"
                        type="text"
                        minLength="1"
                        maxLength="50"
                        required
                        onChange={e => setGrade(e.target.value)} 
                        value={grade}
                    />
                </div>
            </div>
            <div className='div-input-group'>
                <div className='div-input-label'>
                    <label htmlFor="front-image-link-input">Front Image Link</label>
                    <input
                        id="front-image-link-input"
                        type="text"
                        minLength="1"
                        maxLength="400"
                        required
                        onChange={e => setFrontCardImageLink(e.target.value)} 
                        value={frontCardImageLink}
                    />
                </div>
                <div className='div-input-label'>
                    <label htmlFor="back-image-link-input">Back Image Link</label>
                    <input
                        id="back-image-link-input"
                        type="text"
                        minLength="1"
                        maxLength="400"
                        required
                        onChange={e => setBackCardImageLink(e.target.value)} 
                        value={backCardImageLink}
                    />
                </div>
                <div className='div-input-label'>
                    <label htmlFor="sold-input">Sold</label>
                    <input type="checkbox" id="sold-input" checked={sold} onChange={handleCheck}/>
                </div>
            </div>
            <div className='div-input-group'>
                <input className="btn" type="submit" value="Edit Card" onClick={editCard} />
            </div>
          </form>
        </div>
    )
}

export default EditCard;