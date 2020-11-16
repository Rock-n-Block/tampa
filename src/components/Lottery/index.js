import React from 'react';

import { LotteryProgress, LotteryWheel } from '../../components';

import './Lottery.scss'

import tampaImg from '../../assets/img/tampa.svg';
import tampaDarkImg from '../../assets/img/tampa-dark.svg';

const Lottery = ({ isDarkTheme, amountOfDraw }) => {
    return (
        <div className="container lottery">
            <h1 className="lottery__title">lottery</h1>
            <LotteryWheel />
            <div className="container lottery__content">
                <div className="lottery__info">
                    <div className="container lottery__info-item">
                        <div className="lottery__info-head">Draw</div>
                        <div className="lottery__info-content lottery__info-date">NOW</div>
                    </div>
                    <div className="container lottery__info-item">
                        <div className="lottery__info-head">Amount of the draw</div>
                        <div className="lottery__info-content">{amountOfDraw}</div>
                        <div className="lottery__info-wrapper">
                            {isDarkTheme ? <img src={tampaDarkImg} alt="" /> : <img src={tampaImg} alt="" />}
                            <span>Tampa</span>
                        </div>
                    </div>
                </div>
                <LotteryProgress />
            </div>
        </div>
    );
}

export default Lottery;
