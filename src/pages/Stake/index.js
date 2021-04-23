import React, { useState, useEffect } from 'react';
import {Checkbox, Modal} from 'antd';
import { BigNumber } from 'bignumber.js';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

import { StakeForm, ReferrerLink, StakeInfo, ActiveStakes, Graph } from '../../components';
import decimals from '../../utils/web3/decimals';
import {graphActions, modalActions, dialogActions} from '../../redux/actions';

import './Stake.scss'

const DialogApproveToken = ({ approveToken }) => {
    const [iUnderstand, setIUnderstand] = useState(false)

    const handleIUnderstand = (e) => {
        setIUnderstand(e.target.checked)
    }

    const handleApproveToken = (e) => {
        localStorage.setItem('iUnderstand', 'true');
        approveToken()
    }

    return (
    <div className="dialog">
        <div className="dialog-h1">
            Staking information
        </div>
        <div className="dialog-text">
            <p></p>
            <p>
                You will earn 20% APY or more on your staked Jackpot tokens, plus any bonuses for referral, stake length, and amount staked.
            </p>
            <p>
                You will ALSO receive ETH dividends at the end of your stake.
            </p>
            <p>
                Do not forget to collect your funds when the collect button appears and turns green.
            </p>
            <p>
                Un-staking early will cause a penalty.
            </p>
            <p>
                For more information, audit results, mathematical formulas, and all other social and information links visit{' '}
                <a href="https://jackpotstaking.com" target="_blank">https://jackpotstaking.com</a>
            </p>
        </div>
        <div className="dialog-buttons">
            <div>
                <input
                id="iUnderstand"
                name="iUnderstand"
                type="checkbox"
                className="checkbox"
                checked={iUnderstand}
                onChange={handleIUnderstand}
                />
                <label htmlFor="iUnderstand">
                    I understand
                </label>
            </div>
            <button
            key="submit"
            type="primary"
            className="btn dialog-button"
            disabled={!iUnderstand}
            onClick={handleApproveToken}
            >
                Contnue
            </button>
        </div>
    </div>
    )
}

const StakePage = ({ isDarkTheme, userAddress, contractService }) => {
    const dispatch = useDispatch()

    const toggleDialog = (props) => dispatch(dialogActions.toggleDialog(props))

    const [walletBalance, setWalletBalance] = useState(0)
    const [startDay, setStartDay] = useState(0)
    const [totalInterests, setTotalInterests] = useState(0)
    const [totalStaked, setTotalStaked] = useState(0)
    const [totalShares, setTotalShares] = useState(0)
    const [totalBonusShares, setTotalBonusShares] = useState(0)
    const [totalDividents, setTotalDividents] = useState(0)
    const [totalPaidAmount, setTotalPaidAmount] = useState(0)

    const [shareRate, setShareRate] = useState(0)

    const [activeStakes, setActiveStakes] = useState([])
    const [activeStakesRefreshing, setActiveStakesRefreshing] = useState([])

    const [isTokenApproved, setIsTokenApproved] = useState(false)
    const [isTokenApproving, setIsTokenApproving] = useState(false)

    const [isActiveStakes, setIsActiveStakes] = useState(true)

    const calcLBP = (firstArg, secondArg) => {
        const amount = new BigNumber(firstArg).multipliedBy(new BigNumber(10).pow(decimals.TAMPA))
        const days = new BigNumber(secondArg)

        return +firstArg === 0 || +secondArg === 0 ? 0 : amount.multipliedBy(BigNumber.min(3640, days.minus(1)).dividedBy(1820))

        // amountToStake * (min{3640; daysToStake - 1} / 1820)
    }

    const calcBPB = (firstArg) => {
        const amount = new BigNumber(firstArg).multipliedBy(new BigNumber(10).pow(decimals.TAMPA))
        const multi = BigNumber(7).multipliedBy(new BigNumber(10).pow(14))

        return +firstArg === 0 ? 0 : amount.multipliedBy(BigNumber.min(multi, amount).dividedBy(BigNumber(7).multipliedBy(new BigNumber(10).pow(15))))
        // amountToStake * (min{7 * 10^14; amountToStake} / 7 * 10^15)
    }

    const calcStakeProgress = async (start, end, currentDay) => {

        const currentDayUnix = await contractService.getDayUnixTime(currentDay)

        const stakeDays = moment.utc(+end * 1000).diff(moment.utc(+start * 1000), 'days')
        let pastDays = moment.utc(+end * 1000).diff(moment.utc(+currentDayUnix * 1000), 'days');

        pastDays = pastDays >= 0 ? pastDays : 0;
        const percent = (100 - (100 * pastDays / stakeDays)).toFixed(0)

        return percent > 100 ? 100 : percent < 0 ? 0 : percent
    }

    const getStakes = (isActive = true, currentDay = startDay) => {
        const method = isActive ? 'stakeCount' : 'endedStakeCount'
        setActiveStakesRefreshing(true)
        return new Promise((resolve, reject) => {
            contractService[method](userAddress)
                .then(async res => {
                    const promises = []
                    for (let stakeIndex = 0; stakeIndex < res; stakeIndex++) {
                        if (isActive) {
                            promises.push(contractService.stakeLists(userAddress, stakeIndex))

                            // const test = await contractService.stakeLists(userAddress, stakeIndex)
                            // console.log(test)
                        } else {
                            promises.push(contractService.endedStakeLists(userAddress, stakeIndex))
                        }
                    }
                    return Promise.all([...promises])
                })
                .then(async result => {
                    const activeStakesArray = []
                    let newTotalShares = new BigNumber(0)
                    let newTotalDividents = new BigNumber(0)
                    let newTotalInterests = new BigNumber(0)
                    let newTotalBonusShares = new BigNumber(0)
                    let newTotalPaidAmount = new BigNumber(0)

                    for (let i = result.length - 1; i >= 0; i--) {
                        const stake = result[i]

                        const activeStakesItem = {
                            index: i,
                            stakeId: stake.stakeId,
                            start: '',
                            end: '',
                            progress: '20.10.2020',
                            staked: '1,000',
                            shares: '1000',
                            bonusday: '1,000',
                            dividents: '1,000',
                            interest: '1,000',
                            currentValue: '1,000',
                            paidAmount: '1000',
                            isEnded: !isActive,
                            penalti: 0,
                            penaltiDividents: 0,
                            stakeReturn: 0
                        }

                        if (isActive) {
                            const unstakeParams = await contractService.getUnstakeParams(userAddress, i, stake.stakeId)

                            activeStakesItem.penalti = new BigNumber(unstakeParams.cappedPenalty).dividedBy(new BigNumber(10).pow(decimals.TAMPA)).toFixed()
                            activeStakesItem.penaltiDividents = new BigNumber(unstakeParams.dividends).dividedBy(new BigNumber(10).pow(decimals.ETH)).toFixed()
                            activeStakesItem.stakeReturn = new BigNumber(unstakeParams.stakeReturn).dividedBy(new BigNumber(10).pow(decimals.TAMPA)).toFixed()
                        }

                        activeStakesItem.start = await contractService.getDayUnixTime(stake.lockedDay)

                        activeStakesItem.staked = new BigNumber(stake.stakedSuns).dividedBy(new BigNumber(10).pow(decimals.TAMPA)).toFixed()

                        activeStakesItem.shares = new BigNumber(stake.stakeShares).dividedBy(new BigNumber(10).pow(decimals.TAMPA)).toFixed()

                        activeStakesItem.end = await contractService.getDayUnixTime(+stake.lockedDay + +stake.stakedDays)

                        activeStakesItem.progress = await calcStakeProgress(activeStakesItem.start, activeStakesItem.end, currentDay)
                        activeStakesItem.bonusday = await contractService.calcPayoutReward(stake.stakeShares, stake.lockedDay, stake.stakedDays, currentDay, 'calcPayoutRewardsBonusDays')

                        activeStakesItem.bonusday = new BigNumber(activeStakesItem.bonusday).dividedBy(new BigNumber(10).pow(decimals.TAMPA)).toFixed()

                        activeStakesItem.dividents = await contractService.calcPayoutReward(stake.stakeShares, stake.lockedDay, stake.stakedDays, currentDay, 'calcPayoutDividendsReward')

                        newTotalDividents = newTotalDividents.plus(activeStakesItem.dividents)

                        activeStakesItem.dividents = new BigNumber(activeStakesItem.dividents).dividedBy(new BigNumber(10).pow(decimals.ETH)).toFixed()

                        activeStakesItem.interest = await contractService.calcPayoutReward(stake.stakeShares, stake.lockedDay, stake.stakedDays, currentDay, 'calcPayoutRewards')

                        newTotalInterests = newTotalInterests.plus(activeStakesItem.interest)

                        activeStakesItem.interest = new BigNumber(activeStakesItem.interest).dividedBy(new BigNumber(10).pow(decimals.TAMPA)).toFixed()

                        newTotalBonusShares = newTotalBonusShares.plus(activeStakesItem.interest).plus(activeStakesItem.bonusday)

                        activeStakesItem.currentValue = BigNumber.sum(activeStakesItem.interest, activeStakesItem.staked).toFixed()

                        newTotalShares = newTotalShares.plus(activeStakesItem.shares)

                        activeStakesItem.paidAmount = stake.unstakePayout ? new BigNumber(stake.unstakePayout).dividedBy(new BigNumber(10).pow(decimals.TAMPA)).toFixed() : 0

                        newTotalPaidAmount = newTotalPaidAmount.plus(activeStakesItem.paidAmount)

                        activeStakesArray.push(activeStakesItem)
                        setActiveStakes(activeStakesArray)
                    }
                    setActiveStakesRefreshing(false)
                    setTotalShares(newTotalShares.toFixed())
                    setTotalDividents(newTotalDividents.dividedBy(new BigNumber(10).pow(decimals.ETH)).toFixed())
                    setTotalInterests(newTotalInterests.dividedBy(new BigNumber(10).pow(decimals.TAMPA)).toFixed())
                    setTotalBonusShares(newTotalBonusShares.toFixed())
                    setTotalPaidAmount(newTotalPaidAmount.toFixed())

                    resolve(result)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }

    const { graphData, dividentsPool } = useSelector(({ graph }) => {
        return {
            graphData: graph.stakeGraphDots,
            dividentsPool: graph.dividentsPool
        }
    })

    const getGraphDots = () => {
        if (!graphData.length && userAddress && startDay) {
            contractService.getFirstAuction()
                .then(async auctionObj => {
                    let graphDots = []
                    let zeroDay = {
                        day: 0,
                        value: 0
                    }
                    for (let i = auctionObj[1]; i <= startDay; i++) {
                        let value = await contractService.xfLobby(i)
                        value = new BigNumber(value).multipliedBy(0.9).dividedBy(new BigNumber(10).pow(decimals.ETH)).toFixed()

                        const graphDot = {
                            day: i,
                            value
                        }

                        let dividentsPool = 0

                        if (+value !== 0 && i !== 0 && i !== startDay) {
                            graphDots.push(graphDot)
                        }

                        if (i === startDay) {
                            dividentsPool = value

                            dispatch(graphActions.setDividentsPool(dividentsPool))
                        }
                        if (i === 0) {
                            zeroDay = {
                                day: 0,
                                value
                            }
                        }
                    }

                    graphDots.unshift(zeroDay)

                    dispatch(graphActions.setDots(graphDots))
                })
                .catch(err => console.log(err))
        }
    }

    const getData = (isActive = true) => {
        setIsActiveStakes(isActive)
        setActiveStakes([])
        contractService.balanceOf(userAddress)
            .then(res => setWalletBalance(res))
            .catch(err => console.log(err))

        contractService.checkAllowance(userAddress)
            .then(res => setIsTokenApproved(res))
            .catch(err => setIsTokenApproved(err))

        contractService.globals().then(res => setShareRate(res[2])).catch(err => console.log(err))

        contractService.currentDay()
            .then(res => {
                setStartDay(+res)
                return +res
            })
            .then(currentDay => {

                getStakes(isActive, currentDay)
                    .then(result => {

                        let newTotalStaked = 0;

                        result.map(item => {
                            newTotalStaked = +newTotalStaked + +item.stakedSuns
                        })

                        newTotalStaked = BigNumber((newTotalStaked) / Math.pow(10, decimals.TAMPA)).toFixed()

                        setTotalStaked(newTotalStaked)


                    })
                    .catch(err => console.log(err))
            })
            .catch(err => console.log(err))
    }

    const handleApproveToken = () => {
        const iUnderstand = localStorage.getItem('iUnderstand');
        if (iUnderstand === 'true') return approveToken();
        toggleDialog({
            open: true,
            content: <DialogApproveToken approveToken={approveToken}/>,
        })
    }

    const approveToken = () => {
        toggleDialog({
            open: false,
            content: null,
        })
        setIsTokenApproving(true)
        contractService.approveToken(userAddress, (res) => {
            setIsTokenApproving(false)
            setIsTokenApproved(res)
        })
    }

    const handleStake = (amount, days) => {
        contractService.createTokenTransaction({
            data: {
                amount,
                other: [days]
            },
            address: userAddress,
            swapMethod: 'stakeStart',
            contractName: 'TAMPA',
            stake: true,
            callback: () => getData()
        })
    }

    const handleWithdraw = (index, stakeId) => {
        contractService.createTokenTransaction({
            data: {
                other: [
                    index,
                    stakeId
                ]
            },
            address: userAddress,
            swapMethod: 'stakeEnd',
            contractName: 'TAMPA',
            withdraw: true,
            callback: () => getData()
        })
    }

    useEffect(() => {
        if (userAddress && contractService) {
            getData()
        }
    }, [userAddress, contractService])

    useEffect(() => {
        if (contractService) {
            getGraphDots()
        }
    }, [userAddress, startDay, contractService])

    return (
        <div className="stake">
            <div className="row row--sm">
                <StakeForm
                    isDarkTheme={isDarkTheme}
                    walletBalance={walletBalance}
                    startDay={+startDay + 1}
                    isTokenApproved={isTokenApproved}
                    isTokenApproving={isTokenApproving}
                    handleApproveToken={handleApproveToken}
                    handleStake={handleStake}
                    calcLBP={calcLBP}
                    calcBPB={calcBPB}
                    shareRate={shareRate}
                />
                <Graph to="/auction" dividentsPool={dividentsPool} isDarkTheme={isDarkTheme} data={graphData} />
                <ReferrerLink userAddress={userAddress} isDarkTheme={isDarkTheme} />
            </div>
            <div className="row row--lg">
                <StakeInfo
                    totalStaked={totalStaked}
                    totalShares={totalShares}
                    totalInterests={totalInterests}
                    totalDividents={totalDividents}
                    isActiveStakes={isActiveStakes}
                    totalBonusShares={totalBonusShares}
                    totalPaidAmount={totalPaidAmount}
                    isDarkTheme={isDarkTheme}
                />
                <ActiveStakes
                    isDarkTheme={isDarkTheme}
                    activeStakes={activeStakes}
                    handleRefreshActiveStakes={getData}
                    isRefreshingStates={activeStakesRefreshing}
                    handleWithdraw={handleWithdraw}
                    startDay={startDay}
                    contractService={contractService}
                />
            </div>
        </div>
    );
}

export default StakePage;
