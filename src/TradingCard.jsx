import { useState } from 'react';
import './App.css';
import PropTypes from 'prop-types';

function TradingCard({tradingCard, index, tradingCardCollection, setTradingCardCollection}) {
  const [card, setCard] = useState(tradingCard);

  const flipImage = (event) => {
    const el = event.target.parentElement.parentElement.firstChild;
    if(el.src === card.frontCardImageLink) {
        el.src = card.backCardImageLink;
    } else {
        el.src = card.frontCardImageLink;
    }
  }

  const toggleSold = (event) => {
    const cardClone = structuredClone(card);
    cardClone.sold = event.target.checked;
    const arr1 = tradingCardCollection.slice(0, index);
    const arr2 = tradingCardCollection.slice(index + 1);
    setTradingCardCollection([...arr1, cardClone, ...arr2]);
    setCard(cardClone);
  }

  const toggleImageSize = (event) => {
    const el = event.target;
    el.classList.toggle('img-small');
  }

  const getCardNumberText = () => { 
    let currentCardNumber = " ";
    if(card.cardNumber) {
      currentCardNumber = ` #${card.cardNumber} `;
    }
    return currentCardNumber;
  }
  
  return (
      <>
        <img src={card.frontCardImageLink} alt={`picture of a ${card.year} ${card.brand} ${card.player} card`} onClick={(event) => toggleImageSize(event)} className='img-small'/>
        <p>{`${card.cardSet}${getCardNumberText()}${card.player}`}</p>
        <p>{card.gradingCompany} {card.grade} #{card.certificationNumber}</p>
        <div className='div-cards-buttons'>
          <button onClick={(event) => flipImage(event)}>Flip Image</button>
        </div>
      </>
  )
}

TradingCard.propTypes = {
    tradingCard: PropTypes.shape({
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
    }),
    index: PropTypes.number.isRequired,
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
};

export default TradingCard;