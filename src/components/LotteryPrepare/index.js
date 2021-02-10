import React from 'react';
import moment from 'moment';

import { LotteryProgress } from '../../components';
import {dateFormat} from "../../utils/prettifiers";

import './Lottery.scss'

import tampaImg from '../../assets/img/binance.svg';
import tampaDarkImg from '../../assets/img/binance.svg';
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
                <div className="lottery__list-head">What you need to do to become a participant in the lottery:</div>
                <div className="lottery__list-item">Enter the auction in the first hour</div>
                <div className="lottery__list-subitem">
                    - Tuesday, Thursday, Saturday - for every 1 ETH you enter in the auction lobby, you get 1 chance to win the jackpot.
                </div>
                <div className="lottery__list-subitem">
                    - Monday, Wednesday, Friday, Sunday - the same jackpot chance for everyone, regardless of the amount you enter the auction with.
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
                            <span>BNB</span>
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
