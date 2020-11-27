import React from 'react';
import moment from 'moment';

import { LotteryWheel, RowItemTooltip } from '../../components';

import './LotteryActive.scss'
import tampaImg from '../../assets/img/eth.svg';
import tampaDarkImg from '../../assets/img/eth.svg';

const LotteryActive = ({ isDarkTheme, lotteryWinner, lotteryMembers, isLotteryStarted, amountOfDraw }) => {
    return (
        <div className="container lottery-a" id="lottery-a">
            <h1 className="lottery-a__title">today's lottery</h1>
            {(lotteryMembers || (lotteryWinner && lotteryWinner.who)) && <LotteryWheel lotteryWinner={lotteryWinner && lotteryWinner.who} lotteryMembers={lotteryMembers} isLotteryStarted={isLotteryStarted} />}
            <div className="lottery__content container">
                <div className="lottery__info-item lottery-a__info-item">
                    <div className="lottery__info-head">{lotteryWinner && lotteryWinner.isMe ? 'you win' : 'winner'}</div>
                    <div className="lottery__info-head lottery-a__info-head">
                        {lotteryWinner && lotteryWinner.who}
                    </div>
                </div>
                <div className="lottery__info lottery-a__info">
                    <div className="lottery__info-item lottery-a__info-item">
                        <div className="lottery__info-head">lottery pool from</div>
                        <div className="lottery__info-content lottery__info-date">{moment.utc().add(1, 'days').format('DD.MM.YYYY')}</div>
                    </div>
                    <div className="lottery__info-item lottery-a__info-item">
                        <div className="lottery__info-head">Amount of the draw</div>
                        <div className="lottery__info-content">{amountOfDraw}</div>
                        <div className="lottery__info-wrapper">
                            {isDarkTheme ? <img src={tampaDarkImg} alt="" /> : <img src={tampaImg} alt="" />}
                            <span>eth</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LotteryActive;
