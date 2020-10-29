import React from 'react';
import { InputNumber } from 'antd';

import './StakeForm.scss'

import tampaImg from '../../assets/img/tampa.svg';
import questionImg from '../../assets/img/question.svg';

const StakeForm = () => {
    const [amount, setAmount] = React.useState(1000)
    const [days, setDays] = React.useState(90)

    return (
        <div className="s-form">
            <div className="container s-form__container">
                <div className="s-form__box s-form__head">
                    <div className="s-form__title">
                        <h1>Stake</h1>
                        <img className="s-form__quest-img" src={questionImg} alt="" />
                    </div>
                    <div className="s-form__balance">
                        Your balance: 495829589458 <span>MAX</span>
                    </div>
                </div>
                <div className="container s-form__content">
                    <div className="s-form__input-box">
                        <div className="s-form__input-head">Amount to Stake:</div>
                        <InputNumber value={amount} onChange={(value) => setAmount(value)} className="s-form__input" placeholder="1000,00" />
                        <div className="s-form__img">
                            <img src={tampaImg} alt="" />
                            <span>Tampa</span>
                        </div>
                    </div>
                    <div className="container s-form__days">
                        <div className="s-form__days-head">Days to Stake:</div>
                        <div className="s-form__days-input-box">
                            <InputNumber value={days} onChange={(value) => setDays(value)} className="s-form__input s-form__days-input" placeholder="90" />
                        </div>
                    </div>
                </div>
                <div className="s-form__box">
                    <button className="s-form__btn btn">STAKE</button>
                    <div className="s-form__info">
                        <div className="s-form__info-item">
                            <span>4</span>
                            <span>Start day</span>
                        </div>
                        <div className="s-form__info-item">
                            <span>200</span>
                            <span>Last full day</span>
                        </div>
                        <div className="s-form__info-item">
                            <span>855</span>
                            <span>End Day</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container s-form__bonus">
                <div className="s-form__bonus-title">
                    <span>Bonus Info</span>
                    <img className="s-form__quest-img" src={questionImg} alt="" />
                </div>
                <div className="s-form__bonus-content">
                    <div className="s-form__bonus-box">
                        <div className="s-form__bonus-item">
                            <div className="s-form__info-item">
                                <span>+4.6</span>
                                <span>Time Bonus</span>
                            </div>
                        </div>
                        <div className="s-form__bonus-item">
                            <div className="s-form__info-item">
                                <span>250</span>
                                <span>Total</span>
                            </div>
                        </div>
                    </div>
                    <div className="s-form__bonus-box">
                        <div className="s-form__bonus-item">
                            <div className="s-form__info-item">
                                <span>5959...595</span>
                                <span>Value Bonus</span>
                            </div>
                        </div>
                        <div className="s-form__bonus-item">
                            <div className="s-form__info-item">
                                <span>546</span>
                                <span>Effective Tampa</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StakeForm;
