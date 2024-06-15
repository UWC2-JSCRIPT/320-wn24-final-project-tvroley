import { useEffect, useState } from 'react';
import './App.css';
import TradingCard from './TradingCard';
import { useLocation, useNavigate } from "react-router-dom";
import grandpaCollection from './GrandpaCollection.json';
import uncleCollection from './UncleCollection.json';
import SortButtons from './SortButtons';
import Nav from './Nav';
import db from './db';
import { doc, setDoc, onSnapshot, query, collection, orderBy } from "firebase/firestore";

function CardCollection({}) {
  const [tradingCardCollection, setTradingCardCollection] = useState([]);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorCode, setErrorCode] = useState('');
  const [collectionName, setCollectionName] = useState(localStorage.getItem('cardsUsername'));
  const [username, setUsername] = useState(localStorage.getItem('cardsUsername'));
  const [collections, setCollections] = useState([]);

  const navigate = useNavigate();
  
  useEffect(() => {
    const getData = async () => {
      let urlGetCollections = new URL(`https://trading-cards-backend-production.up.railway.app/collections`);
      urlGetCollections.searchParams.append("ownerName", username);
      const responseGetCollections = await fetch(urlGetCollections, {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem('cardsToken')
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
      });
      if(responseGetCollections.status === 200) {
        const data = await responseGetCollections.json();
        const myCollections = data.collections;
        const baseCollection = myCollections.filter((collect) => username === collect.title);
        const collectionId = baseCollection[0]._id;
        let myCollectionIds = [];
        myCollections.map((collect) => myCollectionIds.push(collect._id));
        setCollections(myCollectionIds);
        console.log(myCollectionIds);
        console.log(collectionId);

        let url = new URL(`https://trading-cards-backend-production.up.railway.app/collections/` + collectionId);
        url.searchParams.append("verbose", "true");
        const response = await fetch(url, {
          method: "GET",
          mode: "cors",
          cache: "no-cache",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem('cardsToken')
          },
          redirect: "follow",
          referrerPolicy: "no-referrer",
        });

        if(response.status === 200) {
          const data = await response.json();
          setTradingCardCollection(data.tradingCards);
          console.log(tradingCardCollection);
        }
      }
    }
    getData();
  }, [collectionName]);

  const goAdd = () => {
    navigate(`/collection/add`);
  }

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

  const saveLocal = () => {
      const cardsWord = JSON.stringify(tradingCardCollection);
      localStorage.setItem('cards', cardsWord);
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
          <button onClick={saveLocal}>Save Cards Locally</button>
          <button onClick={restoreFromJson}>Restore Collection From Backup</button>
        </div>
        <div className='div-add-button'>
          <button onClick={goAdd}>Add Card</button>
        </div>
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