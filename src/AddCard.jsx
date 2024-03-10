import './App.css';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { doc, setDoc, } from "firebase/firestore";
import db from './db';

function AddCard({collectionName, tradingCardCollection, setTradingCardCollection}) {
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

    const addCard = async(event) => {
        event.preventDefault();
        if(year && brand && cardSet && player && gradingCompany && grade && certificationNumber && frontCardImageLink && backCardImageLink){
            const card = {year: Number(year), brand: brand, cardNumber: cardNumber, cardSet: cardSet, player: player, gradingCompany: gradingCompany, grade: grade, certificationNumber: certificationNumber, frontCardImageLink: frontCardImageLink, backCardImageLink: backCardImageLink, sold: false};
            const cards = [...tradingCardCollection, card];
            setTradingCardCollection(cards);
            await setDoc(doc(db, collectionName, `${card.gradingCompany}${card.certificationNumber}`), {
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
            });

            setYear(0);
            setBrand('');
            setCardNumber('');
            setCardSet('');
            setPlayer('');
            setGradingCompany('');
            setGrade('');
            setCertificationNumber('');
            setFrontCardImageLink('');
            setBackCardImageLink('');

            const yearEl = document.getElementById('year-input');
            yearEl.classList.remove('invalid');
            const brandEl = document.getElementById('brand-input');
            brandEl.classList.remove('invalid');
            const cardNumberEl = document.getElementById('card-set-input');
            cardNumberEl.classList.remove('invalid');
            const playerEl = document.getElementById('player-input');
            playerEl.classList.remove('invalid');
            const gradingCompanyEl = document.getElementById('grading-company-input');
            gradingCompanyEl.classList.remove('invalid');
            const gradeEl = document.getElementById('grade-input');
            gradeEl.classList.remove('invalid');
            const certEl = document.getElementById('certification-number-input');
            certEl.classList.remove('invalid');
            const frontEl = document.getElementById('front-image-link-input');
            frontEl.classList.remove('invalid');
            const backEl = document.getElementById('back-image-link-input');
            backEl.classList.remove('invalid');
        } else {
            if(!year){
                const yearEl = document.getElementById('year-input');
                yearEl.classList.add('invalid');
            }
            if(!brand){
                const brandEl = document.getElementById('brand-input');
                brandEl.classList.add('invalid');
            }
            if(!cardSet){
                const cardNumberEl = document.getElementById('card-set-input');
                cardNumberEl.classList.add('invalid');
            }
            if(!player){
                const playerEl = document.getElementById('player-input');
                playerEl.classList.add('invalid');
            }
            if(!gradingCompany){
                const gradingCompanyEl = document.getElementById('grading-company-input');
                gradingCompanyEl.classList.add('invalid');
            }
            if(!grade){
                const gradeEl = document.getElementById('grade-input');
                gradeEl.classList.add('invalid');
            }
            if(!certificationNumber){
                const certEl = document.getElementById('certification-number-input');
                certEl.classList.add('invalid');
            }
            if(!frontCardImageLink){
                const frontEl = document.getElementById('front-image-link-input');
                frontEl.classList.add('invalid');
            }
            if(!backCardImageLink){
                const backEl = document.getElementById('back-image-link-input');
                backEl.classList.add('invalid');
            }
        }
    }

    return (
        <div className='div-add-cards'>
          <h3>Add Card</h3>
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
                    <label htmlFor="grading-company-input">Grading Company</label>
                    <input
                        id="grading-company-input"
                        type="text"
                        minLength="1"
                        maxLength="50"
                        required
                        onChange={e => setGradingCompany(e.target.value)} 
                        value={gradingCompany}
                    />
                </div>
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
                <div className='div-input-label'>
                    <label htmlFor="certification-number-input">Certification Number</label>
                    <input
                        id="certification-number-input"
                        type="text"
                        minLength="1"
                        maxLength="50"
                        required
                        onChange={e => setCertificationNumber(e.target.value)} 
                        value={certificationNumber}
                    />
                    <span className="invalid hidden" id="certification-error"/>
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
            </div>
            <div className='div-input-group'>
                <input className="btn" type="submit" value="Submit Card" onClick={addCard} />
            </div>
          </form>
        </div>
    )
}

AddCard.propTypes = {
    collectionName: PropTypes.string.isRequired,
    tradingCardCollection: PropTypes.arrayOf(
        PropTypes.shape({
            year: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
            brand: PropTypes.string,
            cardSet: PropTypes.string,
            cardNumber: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
            player: PropTypes.string,
            gradingCompany: PropTypes.string,
            grade: PropTypes.string,
            certificationNumber: PropTypes.string,
            frontCardImageLink: PropTypes.string,
            backCardImageLink: PropTypes.string,
            sold: PropTypes.bool
        })
    ),
    setTradingCardCollection: PropTypes.func.isRequired
}

export default AddCard;