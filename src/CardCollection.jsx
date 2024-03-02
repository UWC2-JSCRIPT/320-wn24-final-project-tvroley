import { useEffect, useState } from 'react';
import './App.css';
import TradingCard from './TradingCard';
import { useLocation } from "react-router-dom";
import grandpaCollection from './GrandpaCollection.json';
import uncleCollection from './UncleCollection.json';
import AddCard from './AddCard';
import Nav from './Nav';
import db from './db';
import { doc, setDoc } from "firebase/firestore";

function CardCollection({}) {
    const [tradingCardCollection, setTradingCardCollection] = useState([]);
    const collectionName = useLocation().pathname.split("/")[1];

  useEffect(() => {
    if(collectionName === 'grandpa') {
      setTradingCardCollection(grandpaCollection);
    } else if (collectionName === 'uncle') {
      setTradingCardCollection(uncleCollection);
    }
  }, [collectionName]);

  const restoreFromJson = () => {
    tradingCardCollection.map(async (card) => {
      const docRef =  await setDoc(doc(db, collectionName, `${card.gradingCompany}${card.certificationNumber}`), {
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
    });
  }
  
  return (
    <>
        <h2>{collectionName.toUpperCase()}</h2>
        <button onClick={restoreFromJson}>Restore Collection To Default</button>
        <AddCard tradingCardCollection={tradingCardCollection} setTradingCardCollection={setTradingCardCollection}/>
        <div className='div-cards'>
            {tradingCardCollection.map((card, index) => {
                let cardClass = 'unsold';
                if(card.sold) {
                    cardClass = 'sold';
                }
                return (
                    <div key={card.certificationNumber} className={`div-card ${cardClass}`}>
                        <TradingCard tradingCard={card} index={index} tradingCardCollection={tradingCardCollection} setTradingCardCollection={setTradingCardCollection}/>
                    </div>
                )
            })}
        </div>
        <Nav/>
    </>
  )
}

export default CardCollection;