import React from 'react';

import { LotteryWheel } from '../../components';

import './LotteryActive.scss'
import tampaImg from '../../assets/img/eth.svg';
import tampaDarkImg from '../../assets/img/eth.svg';

const LotteryActive = ({ isDarkTheme, amountOfDraw }) => {
    return (
        <div className="container lottery-a">
            <h1 className="lottery-a__title">today's lottery</h1>
            <LotteryWheel />
            <div className="lottery__content container">
                <div className="lottery__info">
                    <div className="lottery__info-item lottery-a__info-item">
                        <div className="lottery__info-head">you win</div>
                        <div className="lottery__info-content lottery__info-date">18.11.2020</div>
                    </div>
                    <div className="lottery__info-item lottery-a__info-item">
                        <div className="lottery__info-head">lottery pool from</div>
                        <div className="lottery__info-content lottery__info-date">18.11.2020</div>
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
