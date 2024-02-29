import { useEffect, useState } from 'react';
import './App.css';
import TradingCard from './TradingCard';
import { useLocation } from "react-router-dom";
import grandpaCollection from './GrandpaCollection.json';
import uncleCollection from './UncleCollection.json';
import PropTypes from 'prop-types';

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
  
  return (
    <>
        <h2>{collectionName.toUpperCase()}</h2>
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
    </>
  )
}

export default CardCollection;