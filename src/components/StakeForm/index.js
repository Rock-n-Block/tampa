import React from 'react';
import { InputNumber } from 'antd';
import BigNumber from 'bignumber.js';

import { RowItemTooltip, QuestionTooltip } from '../../components';
import decimals from '../../utils/web3/decimals';
import { formatNumberWithCommas } from '../../utils/prettifiers';

import './StakeForm.scss';

import tampaImg from '../../assets/img/tampa.svg';
import tampaDarkImg from '../../assets/img/tampa-dark.svg';
import Spiner from '../../assets/img/oval.svg';
import { modalActions, userActions } from "../../redux/actions";
import { useDispatch } from "react-redux";

const StakeForm = ({ isDarkTheme, walletBalance, startDay, isTokenApproved, isTokenApproving, handleApproveToken, handleStake, calcLBP, calcBPB, shareRate }) => {
    const dispatch = useDispatch()

    const [amount, setAmount] = React.useState('')
    const [days, setDays] = React.useState('')

    const [valueBonus, setValueBonus] = React.useState(0)
    const [timeBonus, setTimeBonus] = React.useState(0)

    const handleSendMax = () => {
        setAmount(walletBalance)
    }

    const handleChangeTokenAmount = (value) => {
        setAmount(value)
    }

    const handleChangeDays = (days) => {
        if (days > 180) {
            dispatch(userActions.setUserData({
                errorCode: 1,
                errorMsg: 'Please, enter less than 181 days',
            }))
            dispatch(modalActions.toggleModal(true))
            setDays(180)
        } else {
            setDays(days)
        }
    }

    const onStake = () => {
        handleStake(amount, days)
        setAmount('')
        setDays('')
    }

    React.useEffect(() => {
        const calclbp = calcLBP(amount, days)
        const calcbpb = calcBPB(amount)
        setTimeBonus(calclbp ? calclbp.dividedBy(new BigNumber(10).pow(decimals.TAMPA)).toFixed(8) : 0)
        setValueBonus(calcbpb ? calcbpb.dividedBy(new BigNumber(10).pow(decimals.TAMPA)).toFixed(8) : 0)
    }, [amount, days])

    return (
        <div className="s-form" id="s-form">
            <div className="container s-form__container">
                <div className="s-form__box s-form__head">
                    <div className="s-form__title">
                        <h1>Stake</h1>
                        <QuestionTooltip
                            isDarkTheme={isDarkTheme}
                            parent="s-form"
                            tooltipText={`
                            <div>
                                <p>
                                    You can stake your Jackpot tokens for a fixed number of days to earn interest.  If you stake more than 5 days to be eligible to get bonus days reward.  Bonus days give double rewards on day 5, 10, 15, 20 etc of the auction calendar.
                                </p><br />
                                <p>
                                At the end of every day, a daily stake pool of Jackpot tokens will be calculated and it will be shared and allocated to all the open stakes based on the amount of staked tokens and the amount which will be available for users to withdraw when the stake ends. Formulas for staking calculations are on the whitepaper at <a href="https://jackpotstaking.com/" target="_blank">jackpotstaking.com</a>, and analysis tools/dashboards will also be posted there as well as the project develops.
                                </p>
                            </div>
                        `}
                        />
                    </div>
                    <div className="s-form__balance">
                        Your balance: {formatNumberWithCommas(walletBalance)} <span onClick={handleSendMax}>MAX</span>
                    </div>
                </div>
                <div className="container s-form__content">
                    <div className="s-form__input-box">
                        <div className="s-form__input-head">Amount to Stake:</div>
                        <InputNumber value={amount} onChange={handleChangeTokenAmount} className="s-form__input" placeholder="0.00" />
                        <div className="s-form__img">
                            {isDarkTheme ? <img src={tampaDarkImg} alt="" /> : <img src={tampaImg} alt="" />}
                            <span>Jackpot</span>
                        </div>
                    </div>
                    <div className="container s-form__days">
                        <div className="s-form__days-head">Days to Stake:</div>
                        <div className="s-form__days-input-box">
                            <InputNumber value={days} onChange={handleChangeDays} className="s-form__input s-form__days-input" placeholder="0" />
                        </div>
                    </div>
                </div>
                <div className="s-form__box">
                    {isTokenApproved ?
                        <button className="s-form__btn btn" onClick={onStake} disabled={!amount || !days || amount < 0 || days < 0 || amount > walletBalance}>STAKE</button> :
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
                    <QuestionTooltip isDarkTheme={isDarkTheme} parent="s-form" tooltipText="For starting a stake you get a bonus reward for your stake which is based on the amount and time that you are staking." />
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
                                    <RowItemTooltip tooltipText={amount ? new BigNumber(timeBonus).plus(valueBonus).toFixed(8) : 0} parent="stakes">{amount ? new BigNumber(timeBonus).plus(valueBonus).toFixed(8) : 0}</RowItemTooltip>
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
                                    <RowItemTooltip tooltipText={valueBonus && amount ? new BigNumber(timeBonus).plus(valueBonus).plus(amount).multipliedBy(new BigNumber(10).pow(5)).dividedBy(shareRate).toFixed(8) : 0} parent="stakes">{valueBonus && amount ? new BigNumber(timeBonus).plus(valueBonus).plus(amount).multipliedBy(new BigNumber(10).pow(5)).dividedBy(shareRate).toFixed(8) : 0}</RowItemTooltip>
                                </span>
                                <span>shares</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="s-form__bonus-day">
                    <div className="s-form__info-item">
                        <span>{Math.floor(days / 5)}</span>
                        <span>bonus day
                    <QuestionTooltip isDarkTheme={isDarkTheme} parent="s-form" tooltipText="Every stake will get a bonus day every 5 days that it has been active. Stakes get 2X interest on bonus days. <br><br>Example: creating a stake on day 4 (there are 365 auction days total) for 15 days gives this stake 3 bonus at days 10,15, and day 20 etc.  We anticipate you being able to sell your Jackpot on DEX and CEX very quickly but we also predict you will be able sell or use your tokens with our use case partners beginning around the 180th day of the auctions at a much higher premium than exchanges.  This is not financial advice! This is for entertainment purposes only. Do not play with funds you need to pay your bills with." />
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StakeForm;
