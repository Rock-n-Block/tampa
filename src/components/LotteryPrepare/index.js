import React from 'react';
import moment from 'moment';

import { LotteryProgress, QuestionTooltip } from '../../components';

import './Lottery.scss'

import tampaImg from '../../assets/img/eth.svg';
import tampaDarkImg from '../../assets/img/eth.svg';
import ruleSImg from '../../assets/img/rule-s.svg';
import ruleFImg from '../../assets/img/rule-f.svg';

const Lottery = ({ isDarkTheme, amountOfDraw, userAddress, lotteryPercents, isParticipant }) => {
    return (
        <div className="container lottery" id="lottery">
            <h1 className="lottery__title">lottery
                    <QuestionTooltip isDarkTheme={isDarkTheme} parent="lottery"
                    tooltipText="The lottery pool is 2.5% of all ETH that enters the daily Auction Lobby.<br><br>f the winner of the lottery sends a video confirmation within 7 days to the address, he will additionally receive 2.5% ETH<br><br>The name of the winner will be revealed on the next day by the first person to enter the auction at 2-00 UTC or later."

                />
            </h1>
            <div className="lottery__rule">
                {isParticipant ? <img src={ruleSImg} alt="" /> : <img src={ruleFImg} alt="" />}
                <span>{isParticipant ? 'You are a lottery participant' : 'You are not a participant in the lottery'}</span>
            </div>
            <div className="lottery__list">
                <div className="lottery__list-head">WHAT YOU NEED TO DO TO BECOME A PARTICIPANT IN THE LOTTERY:</div>
                <div className="lottery__list-item">1. enter the auction for the current day at the first hour</div>
                <div className="lottery__list-subitem">
                    - Tuesday, Thursday, Saturday, for each 1 ETH you put in during the 1st hour of the auction lobby you get 1 chance to win the JACKPOT.
                </div>
                <div className="lottery__list-subitem">
                    - Monday, Wednesday, Friday, Sunday: everyone who buys in the first hour of the auction lobby gets a chance to win the JACKPOT.
                </div>
                <div className="lottery__list-item">2. active staking made for at least 5 days</div>
            </div>
            <div className="container lottery__content">
                <div className="lottery__info">
                    <div className="container lottery__info-item">
                        <div className="lottery__info-head">lottery pool from</div>
                        <div className="lottery__info-content lottery__info-date">{moment.utc().format('DD.MM.YYYY')}</div>
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
                <LotteryProgress userAddress={userAddress} segments={lotteryPercents} />
            </div>
        </div>
    );
}

export default Lottery;
