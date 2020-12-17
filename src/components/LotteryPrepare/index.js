import React from 'react';
import moment from 'moment';

import { LotteryProgress } from '../../components';
import {dateFormat} from "../../utils/prettifiers";

import './Lottery.scss'

import tampaImg from '../../assets/img/eth.svg';
import tampaDarkImg from '../../assets/img/eth.svg';
import ruleSImg from '../../assets/img/rule-s.svg';
import ruleFImg from '../../assets/img/rule-f.svg';

const Lottery = ({ isDarkTheme, amountOfDraw, userAddress, lotteryPercents, isParticipant, isOddDay }) => {
    return (
        <div className="container lottery" id="lottery">
            <h1 className="lottery__title">lottery
            </h1>
            <div className="lottery__rule">
                {isParticipant ? <img src={ruleSImg} alt="" /> : <img src={ruleFImg} alt="" />}
                <span>{isParticipant ? 'You are a lottery participant' : 'You are not a participant in the lottery'}</span>
            </div>
            <div className="lottery__list">
                <div className="lottery__list-head">WHAT YOU NEED TO DO TO BECOME A PARTICIPANT IN THE LOTTERY:</div>
                <div className="lottery__list-item">enter the auction for the current day at the first hour</div>
                <div className="lottery__list-subitem">
                    - Tuesday, Thursday, Saturday, for each 1 ETH you put in during the 1st hour of the auction lobby you get 1 chance to win the JACKPOT.
                </div>
                <div className="lottery__list-subitem">
                    - Monday, Wednesday, Friday, Sunday: everyone who buys in the first hour of the auction lobby gets a chance to win the JACKPOT.
                </div>
            </div>
            <div className="container lottery__content">
                <div className="lottery__info">
                    <div className="container lottery__info-item">
                        <div className="lottery__info-head">lottery pool from</div>
                        <div className="lottery__info-content lottery__info-date">
                            {dateFormat(moment.utc() / 1000)}
                        </div>
                    </div>
                    <div className="container lottery__info-item">
                        <div className="lottery__info-head">Amount of the draw</div>
                        <div className="lottery__info-content">{amountOfDraw}</div>
                        <div className="lottery__info-wrapper">
                            {isDarkTheme ? <img src={tampaDarkImg} alt="" /> : <img src={tampaImg} alt="" />}
                            <span>eth</span>
                        </div>
                    </div>
                </div>
                {isOddDay && lotteryPercents && Object.keys(lotteryPercents).length ? <LotteryProgress userAddress={userAddress} segments={lotteryPercents} /> : ''}
                {!isOddDay && <div className="lottery__info-progress">Everyone has an equal chance of winning</div>}
            </div>
        </div>
    );
}

export default Lottery;
