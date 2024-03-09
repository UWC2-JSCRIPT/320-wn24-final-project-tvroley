import './App.css';
import db from './db';
import { doc, query, collection, orderBy, getDocs, } from "firebase/firestore";
import PropTypes from 'prop-types';

function SortButtons({collectionName, setTradingCardCollection}) {
    
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
          const cardsQuery = await query(collection(db, collectionName), orderBy(sortBy, 'asc'));
          const querySnapshot = await getDocs(cardsQuery);
          querySnapshot.docs.forEach(
            x => {cards.push(x.data());}
          );

          setTradingCardCollection(cards);  
          //setIsLoading(false);
        } catch {
            //setHasError(true);
            //setIsLoading(false);
        }
    }
    
    return (
        <>
            <div className='div-sort-buttons'>
                <button id='sort-cert-button' onClick={sortCards}>Sort By Certification Number</button>
                <button id='sort-year-button' onClick={sortCards}>Sort By Year</button>
                <button id='sort-player-button' onClick={sortCards}>Sort By Player</button>
                <button id='sort-sold-button' onClick={sortCards}>Sort By Sold Status</button>
                <button id='sort-brand-button' onClick={sortCards}>Sort By Brand</button>
                <button id='sort-set-button' onClick={sortCards}>Sort By Card Set</button>
            </div>
        </>
    )
}

SortButtons.propTypes = {
  collectionName: PropTypes.string.isRequired,
  setTradingCardCollection: PropTypes.func.isRequired
}

export default SortButtons;