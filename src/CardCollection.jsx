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
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorCode, setErrorCode] = useState('');
  
  const collectionName = useLocation().pathname.split("/")[1];

  useEffect(() => {
    const getData = async () => {
        const cards = [];
        const cardQuery = query(collection(db, collectionName), orderBy('year', 'asc'));
        onSnapshot(cardQuery, snapshot => {
            setHasError(false);
            snapshot.docChanges().map((change) => {
                if(change.type === "added") {
                    cards.push(change.doc.data());
                }
            });
            setTradingCardCollection(cards);
            },
            onerror => {
                setHasError(true);
                setErrorCode(onerror.code);
                setErrorMessage(onerror.message);
            }
        );
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

  if(hasError){
    return <p>Error code: {errorCode} Error message: {errorMessage}</p>
  }

  return (
    <>
        <h2>{collectionName.toUpperCase()}: {tradingCardCollection.length} Cards</h2>
        <div>
          <p className='p-instructions'>Click on card images for full size</p>
          <p className='sold p-legend'>SOLD</p>
          <p className='unsold p-legend'>NOT SOLD</p>
        </div>
        <div className='div-restore-buttons'>
          <button onClick={restoreFromJson}>Restore Collection From Backup</button>
        </div>
        <AddCard collectionName={collectionName} tradingCardCollection={tradingCardCollection} setTradingCardCollection={setTradingCardCollection}/>
        <SortButtons collectionName={collectionName} setTradingCardCollection={setTradingCardCollection}/>
        <div className='div-cards'>
            {tradingCardCollection.map((card) => {
                let cardClass = 'unsold';
                if(card.sold) {
                    cardClass = 'sold';
                }
                return (
                    <div key={card.certificationNumber} className={`div-card ${cardClass}`}>
                      <TradingCard tradingCard={card}/>
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