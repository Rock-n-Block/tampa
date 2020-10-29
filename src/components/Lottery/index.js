import React from 'react';

import { LotteryProgress } from '../../components';

import './Lottery.scss'

import tampaImg from '../../assets/img/tampa.svg';

const Lottery = () => {
    return (
        <div className="container lottery">
            <h1 className="lottery__title">lottery</h1>
            <div className="container lottery__content">
                <div className="lottery__info">
                    <div className="container lottery__info-item">
                        <div className="lottery__info-head">Draw</div>
                        <div className="lottery__info-content lottery__info-date">NOW</div>
                    </div>
                    <div className="container lottery__info-item">
                        <div className="lottery__info-head">Amount of the draw</div>
                        <div className="lottery__info-content">100.000</div>
                        <div className="lottery__info-wrapper">
                            <img src={tampaImg} alt="" />
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
