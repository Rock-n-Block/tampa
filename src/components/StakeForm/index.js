import React from 'react';
import { InputNumber } from 'antd';
import BigNumber from 'bignumber.js';

import { RowItemTooltip } from '../../components';

import './StakeForm.scss'

import tampaImg from '../../assets/img/tampa.svg';
import tampaDarkImg from '../../assets/img/tampa-dark.svg';
import questionImg from '../../assets/img/question.svg';
import questionImgDark from '../../assets/img/question-d.svg';
import Spiner from '../../assets/img/oval.svg';

const StakeForm = ({ isDarkTheme, walletBalance, startDay, isTokenApproved, bonusDay, isTokenApproving, handleApproveToken, handleStake, handleCalcBonusDay, calcLBP, calcBPB }) => {
    const [amount, setAmount] = React.useState(10)
    const [days, setDays] = React.useState(90)

    const [valueBonus, setValueBonus] = React.useState(0)
    const [timeBonus, setTimeBonus] = React.useState(0)

    const handleSendMax = () => {
        setAmount(walletBalance)
    }

    const handleChangeTokenAmount = (value) => {
        setAmount(value)

        handleCalcBonusDay(value, days)
    }

    const handleChangeDays = (days) => {
        setDays(days)

        handleCalcBonusDay(amount, days)
    }

    React.useEffect(() => {
        setTimeBonus(calcLBP(amount, days).toString())
        setValueBonus(calcBPB(amount).toString())
    }, [amount, days])

    return (
        <div className="s-form">
            <div className="container s-form__container">
                <div className="s-form__box s-form__head">
                    <div className="s-form__title">
                        <h1>Stake</h1>
                        {isDarkTheme ? <img className="s-form__quest-img" src={questionImgDark} alt="" /> : <img className="s-form__quest-img" src={questionImg} alt="" />}
                    </div>
                    <div className="s-form__balance">
                        Your balance: {walletBalance} <span onClick={handleSendMax}>MAX</span>
                    </div>
                </div>
                <div className="container s-form__content">
                    <div className="s-form__input-box">
                        <div className="s-form__input-head">Amount to Stake:</div>
                        <InputNumber value={amount} onChange={handleChangeTokenAmount} className="s-form__input" placeholder="0,00" />
                        <div className="s-form__img">
                            {isDarkTheme ? <img src={tampaDarkImg} alt="" /> : <img src={tampaImg} alt="" />}
                            <span>Tampa</span>
                        </div>
                    </div>
                    <div className="container s-form__days">
                        <div className="s-form__days-head">Days to Stake:</div>
                        <div className="s-form__days-input-box">
                            <InputNumber value={days} onChange={handleChangeDays} className="s-form__input s-form__days-input" placeholder="90" />
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
                            <span>{startDay + days - 1}</span>
                            <span>Last full day</span>
                        </div>
                        <div className="s-form__info-item">
                            <span>{startDay + days}</span>
                            <span>End Day</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container s-form__bonus">
                <div className="s-form__bonus-title">
                    <span>Bonus Info</span>
                    {isDarkTheme ? <img className="s-form__quest-img" src={questionImgDark} alt="" /> : <img className="s-form__quest-img" src={questionImg} alt="" />}
                </div>
                <div className="s-form__bonus-content">
                    <div className="s-form__bonus-box">
                        <div className="s-form__bonus-item">
                            <div className="s-form__info-item">
                                <span>
                                    <RowItemTooltip tooltipText={amount ? timeBonus : 0} parent="stakes">+{amount ? timeBonus : 0}</RowItemTooltip>
                                </span>
                                <span>Time Bonus</span>
                            </div>
                        </div>
                        <div className="s-form__bonus-item">
                            <div className="s-form__info-item">
                                <span>
                                    <RowItemTooltip tooltipText={amount ? new BigNumber(timeBonus).plus(valueBonus).toString() : 0} parent="stakes">{amount ? new BigNumber(timeBonus).plus(valueBonus).toString() : 0}</RowItemTooltip>
                                </span>
                                <span>Total</span>
                            </div>
                        </div>
                    </div>
                    <div className="s-form__bonus-box">
                        <div className="s-form__bonus-item">
                            <div className="s-form__info-item">
                                <span>
                                    <RowItemTooltip tooltipText={amount ? valueBonus : 0} parent="stakes">{amount ? valueBonus : 0}</RowItemTooltip>
                                </span>
                                <span>Value Bonus</span>
                            </div>
                        </div>
                        <div className="s-form__bonus-item">
                            <div className="s-form__info-item">
                                <span>
                                    <RowItemTooltip tooltipText={valueBonus && amount ? new BigNumber(timeBonus).plus(valueBonus).plus(amount).toString() : 0} parent="stakes">{valueBonus && amount ? new BigNumber(timeBonus).plus(valueBonus).plus(amount).toString() : 0}</RowItemTooltip>
                                </span>
                                <span>Effective Tampa</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="s-form__bonus-day">
                    <div className="s-form__info-item">
                        <span>{bonusDay}</span>
                        <span>bonus day</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StakeForm;
