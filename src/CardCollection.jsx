import { useEffect, useState } from 'react';
import './App.css';
import TradingCard from './TradingCard';
import { useLocation } from "react-router-dom";
import grandpaCollection from './GrandpaCollection.json';
import uncleCollection from './UncleCollection.json';
import AddCard from './AddCard';
import SortButtons from './SortButtons';
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
          const cardQuery = query(collection(db, collectionName), orderBy('year', 'asc'));
          onSnapshot(cardQuery, snapshot => {
            snapshot.docChanges().forEach((change) => {
              if(change.type === "added") {
                cards.push(change.doc.data());
              }
            });
            console.log(cards);
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

  return (
    <>
        <h2>{collectionName.toUpperCase()}: {tradingCardCollection.length} Cards</h2>
        <button onClick={restoreFromJson}>Restore Collection From Backup</button>
        <AddCard collectionName={collectionName} tradingCardCollection={tradingCardCollection} setTradingCardCollection={setTradingCardCollection}/>
        <SortButtons collectionName={collectionName} setTradingCardCollection={setTradingCardCollection}/>
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
        <SortButtons collectionName={collectionName} setTradingCardCollection={setTradingCardCollection}/>
        <Nav/>
    </>
  )
}

export default CardCollection;