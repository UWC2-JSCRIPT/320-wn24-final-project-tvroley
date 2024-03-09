import { describe, expect, it } from "vitest";
import { screen, render } from "@testing-library/react";
import TradingCard from "../TradingCard";
import uncleCollection from '../UncleCollection.json';

describe('TradingCard component tests', ()=>{
    const tradingCard = {
        "year": 2002,
        "brand": "Fleer",
        "cardSet": "2002 Fleer Ultra",
        "cardNumber": 101,
        "player": "Sue Bird",
        "gradingCompany": "PSA",
        "grade": "9",
        "certificationNumber": "63741116",
        "frontCardImageLink": "https://d1htnxwo4o0jhw.cloudfront.net/cert/126428695/355823629.jpg",
        "backCardImageLink": "https://d1htnxwo4o0jhw.cloudfront.net/cert/126428695/355819081.jpg",
        "sold": false
    };
    const index = 1;
    const tradingCardCollection = uncleCollection;
    const setTradingCardCollection = () => {};
    it('should have an image with the alt text: picture of a 2002 Fleer Sue Bird card', ()=>{
        render(<TradingCard tradingCard={tradingCard} index={index} tradingCardCollection={tradingCardCollection} setTradingCardCollection={setTradingCardCollection}/>);
        screen.debug();
        const altText = `picture of a 2002 Fleer Sue Bird card`;
        const imgEl = screen.getByAltText(altText);
        console.log(imgEl);
        expect(imgEl.tagName).toEqual('IMG');
    });
});