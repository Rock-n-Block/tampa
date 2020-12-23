import React from 'react';
import moment from 'moment';
import Confetti from 'react-confetti';

import { LotteryWheel } from '../../components';
import { dateFormat } from "../../utils/prettifiers";

import './LotteryActive.scss'
import tampaImg from '../../assets/img/binance.svg';
import tampaDarkImg from '../../assets/img/binance.svg';

const LotteryActive = ({ isDarkTheme, lotteryWinner, lotteryMembers, isLotteryStarted, amountOfDraw, isSlowShow }) => {
    const [isConfettiShown, setIsConfettiShown] = React.useState(false);

    React.useEffect(() => {
        let timeout;
        if (isConfettiShown) {
            timeout = setTimeout(() => {
                setIsConfettiShown(false);
            },60 * 1000)
        }
        return () => clearTimeout(timeout)
    }, [isConfettiShown]);

    React.useEffect(() => {
        if (lotteryWinner && lotteryWinner.who) setIsConfettiShown(true);
    }, [lotteryWinner]);
    return (
        <div className="container lottery-a" id="lottery-a">
            <h1 className="lottery-a__title">today's lottery</h1>
            {(lotteryMembers && lotteryWinner && lotteryWinner.who && isConfettiShown) &&
                <Confetti
                    width={window.innerWidth}
                    height={window.innerHeight}
                />
            }
            {(lotteryMembers || (lotteryWinner && lotteryWinner.who)) && <LotteryWheel isSlowShow={isSlowShow} lotteryWinner={lotteryWinner && lotteryWinner.who} lotteryMembers={lotteryMembers} isLotteryStarted={isLotteryStarted} />}
            <div className="lottery__content container">
                <div className="lottery__info-item lottery-a__info-item">
                    <div className="lottery__info-head">{lotteryWinner && lotteryWinner.isMe ? 'you win' : 'winner'}</div>
                    <div className="lottery__info-head lottery-a__info-head">
                        {(lotteryMembers) && lotteryWinner && lotteryWinner.who}
                    </div>
                </div>
                <div className="lottery__info lottery-a__info">
                    <div className="lottery__info-item lottery-a__info-item">
                        <div className="lottery__info-head">lottery pool from</div>
                        <div className="lottery__info-content lottery__info-date">
                            {dateFormat(moment.utc().add(-1, 'days') / 1000)}
                        </div>
                    </div>
                    <div className="lottery__info-item lottery-a__info-item">
                        <div className="lottery__info-head">Amount of the draw</div>
                        <div className="lottery__info-content">{amountOfDraw}</div>
                        <div className="lottery__info-wrapper">
                            {isDarkTheme ? <img src={tampaDarkImg} alt="" /> : <img src={tampaImg} alt="" />}
                            <span>BNB</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LotteryActive;
