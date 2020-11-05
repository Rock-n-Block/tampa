import React from 'react';
import { InputNumber } from 'antd';

import './StakeForm.scss'

import tampaImg from '../../assets/img/tampa.svg';
import tampaDarkImg from '../../assets/img/tampa-dark.svg';
import questionImg from '../../assets/img/question.svg';
import Spiner from '../../assets/img/oval.svg';

const StakeForm = ({ isDarkTheme, walletBalance, startDay, isTokenApproved, isTokenApproving, handleApproveToken, handleStake }) => {
    const [amount, setAmount] = React.useState(10)
    const [days, setDays] = React.useState(90)

    const handleSendMax = () => {
        setAmount(walletBalance)
    }

    return (
        <div className="s-form">
            <div className="container s-form__container">
                <div className="s-form__box s-form__head">
                    <div className="s-form__title">
                        <h1>Stake</h1>
                        <img className="s-form__quest-img" src={questionImg} alt="" />
                    </div>
                    <div className="s-form__balance">
                        Your balance: {walletBalance} <span onClick={handleSendMax}>MAX</span>
                    </div>
                </div>
                <div className="container s-form__content">
                    <div className="s-form__input-box">
                        <div className="s-form__input-head">Amount to Stake:</div>
                        <InputNumber value={amount} onChange={(value) => setAmount(value)} className="s-form__input" placeholder="1000,00" />
                        <div className="s-form__img">
                            {isDarkTheme ? <img src={tampaDarkImg} alt="" /> : <img src={tampaImg} alt="" />}
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
                    {isTokenApproved ?
                        <button className="s-form__btn btn" onClick={() => handleStake(amount, days)}>STAKE</button> :
                        <button className="s-form__btn btn" onClick={handleApproveToken} disabled={isTokenApproving}>
                            {isTokenApproving && <img src={Spiner} alt="" />}
                            <span>{isTokenApproving ? 'Waiting' : 'Approve'}</span>
                        </button>
                    }
                    <div className="s-form__info">
                        <div className="s-form__info-item">
                            <span>{startDay}</span>
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
