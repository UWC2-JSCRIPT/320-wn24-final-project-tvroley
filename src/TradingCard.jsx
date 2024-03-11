import { useState } from 'react';
import './App.css';
import PropTypes from 'prop-types';

function TradingCard({tradingCard}) {

  const flipImage = (event) => {
    const el = event.target.parentElement.parentElement.firstChild;
    if(el.src === tradingCard.frontCardImageLink) {
        el.src = tradingCard.backCardImageLink;
    } else {
        el.src = tradingCard.frontCardImageLink;
    }
  }

  const toggleImageSize = (event) => {
    const el = event.target;
    el.classList.toggle('img-small');
  }

  const getCardNumberText = () => { 
    let currentCardNumber = " ";
    if(tradingCard.cardNumber) {
      currentCardNumber = ` #${tradingCard.cardNumber} `;
    }
    return currentCardNumber;
  }
  
  return (
      <>
        <img src={tradingCard.frontCardImageLink} alt={`picture of a ${tradingCard.year} ${tradingCard.brand} ${tradingCard.player} card`} onClick={(event) => toggleImageSize(event)} className='img-small'/>
        <p>{`${tradingCard.cardSet}${getCardNumberText()}${tradingCard.player}`}</p>
        <p>{tradingCard.gradingCompany} {tradingCard.grade} #{tradingCard.certificationNumber}</p>
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
    })
};

export default TradingCard;