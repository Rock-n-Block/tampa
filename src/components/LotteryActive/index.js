import React from 'react';
import moment from 'moment';

import { LotteryWheel } from '../../components';

import './LotteryActive.scss'
import tampaImg from '../../assets/img/eth.svg';
import tampaDarkImg from '../../assets/img/eth.svg';

const LotteryActive = ({ isDarkTheme, lotteryWinner, lotteryMembers, isLotteryStarted, handleLotteryWithdraw }) => {
    return (
        <div className="container lottery-a">
            <h1 className="lottery-a__title">today's lottery</h1>
            <LotteryWheel lotteryWinner={lotteryWinner && lotteryWinner.who} lotteryMembers={lotteryMembers} isLotteryStarted={isLotteryStarted} />
            <div className="lottery__content container">
                <div className="lottery__info">
                    <div className="lottery__info-item lottery-a__info-item">
                        <div className="lottery__info-head">{lotteryWinner && lotteryWinner.isMe ? 'you win' : 'winner'}</div>
                        {(lotteryWinner && lotteryWinner.isMe) && <button onClick={handleLotteryWithdraw} className="lottery-a__withdraw btn">withdraw</button>}
                        <div className="lottery__info-head">{lotteryWinner && lotteryWinner.who}</div>
                    </div>
                    <div className="lottery__info-item lottery-a__info-item">
                        <div className="lottery__info-head">lottery pool from</div>
                        <div className="lottery__info-content lottery__info-date">{moment.utc().add(1, 'days').format('DD.MM.YYYY')}</div>
                    </div>
                    <div className="lottery__info-item lottery-a__info-item">
                        <div className="lottery__info-head">Amount of the draw</div>
                        <div className="lottery__info-content">{lotteryWinner && lotteryWinner.totalAmount}</div>
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
