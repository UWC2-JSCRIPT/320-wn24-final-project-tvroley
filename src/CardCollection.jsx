import { useEffect, useState } from 'react';
import './App.css';
import TradingCard from './TradingCard';
import { useLocation } from "react-router-dom";
import grandpaCollection from './GrandpaCollection.json';
import uncleCollection from './UncleCollection.json';
import AddCard from './AddCard';
import Nav from './Nav';
import db from './db';
import { doc, setDoc, onSnapshot, query, collection, orderBy } from "firebase/firestore";

function CardCollection({}) {
  const [tradingCardCollection, setTradingCardCollection] = useState([]);
  const collectionName = useLocation().pathname.split("/")[1];

  useEffect(() => {
    const getData = async () => {
      try {
          const cards = [];
          const journalQuery = query(collection(db, collectionName), orderBy('year', 'asc'));
          onSnapshot(journalQuery, snapshot => { snapshot.docs.forEach(x => {cards.push(x.data())})
              setTradingCardCollection(cards);
          });  
          //setIsLoading(false);
      } catch {
          //setHasError(true);
          //setIsLoading(false);
      }
    }

    getData();
    return () => onSnapshot;
  }, [collectionName]);

  const restoreFromJson = () => {
    if(collectionName === "grandpa"){
      setTradingCardCollection(grandpaCollection);
    } else if(collectionName === "uncle"){
      setTradingCardCollection(uncleCollection);
    }
    tradingCardCollection.map(async (card) => {
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
    });
  }

  const sortCards = async(event) => {
    let sortBy = 'year';
    const buttonId = event.target.id;
    switch(buttonId){
      case 'sort-cert-button': 
        sortBy = 'certificationNumber';
        break;
      case 'sort-year-button': 
        sortBy = 'year';
        break;
      case 'sort-player-button': 
        sortBy = 'player';
        break;
      case 'sort-sold-button': 
        sortBy = 'sold';
        break;
      case 'sort-brand-button': 
        sortBy = 'brand';
        break;
      case 'sort-set-button': 
        sortBy = 'cardSet';
        break;
      default:
        console.log("unkown button pressed");
        return;
    }

    try {
      const cards = [];
      const journalQuery = await query(collection(db, collectionName), orderBy(sortBy, 'asc'));
      onSnapshot(journalQuery, snapshot => { snapshot.docs.forEach(x => {cards.push(x.data())})
          setTradingCardCollection(cards);
      });  
      //setIsLoading(false);
    } catch {
        //setHasError(true);
        //setIsLoading(false);
    }
  }

  return (
    <>
        <h2>{collectionName.toUpperCase()}</h2>
        <button onClick={restoreFromJson}>Restore Collection To Default</button>
        <AddCard tradingCardCollection={tradingCardCollection} setTradingCardCollection={setTradingCardCollection}/>
        <button id='sort-cert-button' onClick={sortCards}>Sort By Certification Number</button>
        <button id='sort-year-button' onClick={sortCards}>Sort By Year</button>
        <button id='sort-player-button' onClick={sortCards}>Sort By Player</button>
        <button id='sort-sold-button' onClick={sortCards}>Sort By Sold Status</button>
        <button id='sort-brand-button' onClick={sortCards}>Sort By Brand</button>
        <button id='sort-set-button' onClick={sortCards}>Sort By Card Set</button>
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