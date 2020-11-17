import React, { useState, useEffect } from 'react';
import { BigNumber } from 'bignumber.js';

import { StakeForm, ReferrerLink, StakeInfo, ActiveStakes, Graph } from '../../components';
import ContractService from '../../utils/contractService';
import decimals from '../../utils/web3/decimals';

import './Stake.scss'

const StakePage = ({ isDarkTheme, userAddress }) => {
    const [contractService] = useState(new ContractService())

    const [walletBalance, setWalletBalance] = useState(0)
    const [startDay, setStartDay] = useState(0)
    const [dividentsPool, setDividentsPool] = useState(0)
    const [fromReferrs, setFromReferrs] = useState(0)
    const [totalStaked, setTotalStaked] = useState(0)
    const [totalShares, setTotalShares] = useState(0)
    const [totalDividents, setTotalDividents] = useState(0)
    const [totalTimeBonus, setTotalTimeBonus] = useState(0)
    const [totalValueBonus, setTotalValueBonus] = useState(0)
    const [bonusDay, setBonusDay] = useState(0)

    const [activeStakes, setActiveStakes] = useState([])
    const [activeStakesRefreshing, setActiveStakesRefreshing] = useState([])

    const [isTokenApproved, setIsTokenApproved] = useState(false)
    const [isTokenApproving, setIsTokenApproving] = useState(false)

    const calcLBP = (firstArg, secondArg) => {
        const amount = new BigNumber(firstArg).multipliedBy(new BigNumber(10).pow(decimals.TAMPA))
        const days = new BigNumber(secondArg)

        return +firstArg === 0 || +secondArg === 0 ? 0 : amount.multipliedBy(BigNumber.min(3640, days.minus(1)).dividedBy(1820))

        // amountToStake * (min{3640; daysToStake - 1} / 1820)
    }

    const calcBPB = (firstArg) => {
        const amount = new BigNumber(firstArg).multipliedBy(new BigNumber(10).pow(decimals.TAMPA))
        const multi = BigNumber(7).multipliedBy(new BigNumber(10).pow(24))

        return +firstArg === 0 ? 0 : amount.multipliedBy(BigNumber.min(multi, amount).dividedBy(BigNumber(7).multipliedBy(new BigNumber(10).pow(25))))
        // amountToStake * (min{7 * 10^24; amountToStake} / 7 * 10^25)
    }

    const getStakes = (isActive = true, currentDay = startDay) => {
        const method = isActive ? 'stakeCount' : 'endedStakeCount'
        setActiveStakesRefreshing(true)
        return new Promise((resolve, reject) => {
            contractService[method](userAddress)
                .then(res => {
                    const promises = []
                    for (let stakeIndex = 0; stakeIndex < res; stakeIndex++) {
                        if (isActive) {
                            promises.push(contractService.stakeLists(userAddress, stakeIndex))
                        } else {
                            promises.push(contractService.endedStakeLists(userAddress, stakeIndex))
                        }
                    }
                    return Promise.all([...promises])
                })
                .then(async result => {
                    const activeStakesArray = []
                    for (let i = 0; i < result.length; i++) {
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
                            currentValue: '1,000'
                        }

                        activeStakesItem.start = await contractService.getDayUnixTime(stake.lockedDay)

                        activeStakesItem.staked = new BigNumber(stake.stakedSuns).dividedBy(new BigNumber(10).pow(decimals.TAMPA)).toString()

                        activeStakesItem.shares = new BigNumber(stake.stakeShares).dividedBy(new BigNumber(10).pow(decimals.TAMPA)).toString()

                        activeStakesItem.end = await contractService.getDayUnixTime(stake.lockedDay + stake.stakedDays)

                        activeStakesItem.bonusday = await contractService.calcPayoutReward(stake.stakeShares, stake.lockedDay, stake.stakedDays, currentDay, 'calcPayoutRewardsBonusDays')

                        activeStakesItem.dividents = await contractService.calcPayoutReward(stake.stakeShares, stake.lockedDay, stake.stakedDays, currentDay, 'calcPayoutDividendsReward')

                        activeStakesItem.interest = await contractService.calcPayoutReward(stake.stakeShares, stake.lockedDay, stake.stakedDays, currentDay, 'calcPayoutRewards')

                        activeStakesItem.currentValue = BigNumber.sum(activeStakesItem.interest, activeStakesItem.shares).toFixed()

                        activeStakesArray.push(activeStakesItem)
                    }
                    setActiveStakesRefreshing(false)
                    setActiveStakes(activeStakesArray.reverse())
                    resolve(result)

                })
                .catch(err => {
                    reject(err)
                })
        })
    }

    const getData = () => {
        contractService.balanceOf(userAddress)
            .then(res => setWalletBalance(res))
            .catch(err => console.log(err))

        contractService.checkAllowance(userAddress)
            .then(res => setIsTokenApproved(res))
            .catch(err => setIsTokenApproved(err))

        contractService.currentDay()
            .then(res => {
                setStartDay(+res)
                console.log(res, 'days')
                return +res
            })
            .then(currentDay => {


                contractService.xfLobby(currentDay)
                    .then(resXfLobby => {
                        const result = BigNumber(resXfLobby * 0.9).toString()
                        setDividentsPool(result)
                    })
                    .catch(err => console.log(err))

                getStakes(true, currentDay)
                    .then(result => {
                        let newTotalStaked = 0;
                        let newTotalShares = new BigNumber(0);
                        let newTotalTimeBonus = new BigNumber(0);
                        let newTotalValueBonus = new BigNumber(0);

                        const totalDividentsPromises = result.map(item => {
                            newTotalStaked = +newTotalStaked + +item.stakedSuns
                            newTotalShares = newTotalShares.plus(item.stakedSuns)

                            newTotalTimeBonus = newTotalTimeBonus.plus(calcLBP(item.stakedSuns, item.stakedDays))
                            newTotalValueBonus = newTotalValueBonus.plus(calcBPB(item.stakedSuns))

                            return contractService.calcPayoutReward(item.stakeShares, item.lockedDay, item.stakedDays, currentDay, 'calcPayoutDividendsReward')
                        })

                        newTotalStaked = BigNumber((newTotalStaked) / Math.pow(10, decimals.TAMPA)).toString()

                        setTotalStaked(newTotalStaked)
                        setTotalShares(newTotalShares.toString())
                        setTotalTimeBonus(newTotalTimeBonus.toFixed())
                        setTotalValueBonus(newTotalValueBonus.toFixed())

                        return Promise.all([...totalDividentsPromises])

                    })
                    .then(result => {
                        let newTotalDividents = 0

                        result.map(item => newTotalDividents = +newTotalDividents + item)

                        setTotalDividents(newTotalDividents)
                    })
                    .catch(err => console.log(err))
            })
            .catch(err => console.log(err))

        contractService.fromReferrs(userAddress)
            .then(res => setFromReferrs(res))
            .catch(err => console.log(err))

    }

    const handleCalcBonusDay = (amount, days) => {
        contractService.dailyData(startDay)
            .then(res => {

                const { dayPayoutTotal, dayStakeSharesTotal } = res
                const formAmount = new BigNumber(amount).multipliedBy(new BigNumber(10).pow(decimals.TAMPA))

                const calcBonusDay = +dayStakeSharesTotal === 0 ? 0 : formAmount.multipliedBy(dayPayoutTotal).multipliedBy(new BigNumber(days).dividedBy(5)).dividedBy(dayStakeSharesTotal)

                setBonusDay(calcBonusDay.toString())

                // dayPayoutTotal * amountToStake * (daysToStake / 5) / dayStakeSharesTotal
            })
            .catch(err => console.log(err))
    }

    const handleApproveToken = () => {
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
        if (userAddress) {
            getData()
        }
    }, [userAddress])

    return (
        <div className="stake">
            <div className="row row--md">
                <StakeForm
                    isDarkTheme={isDarkTheme}
                    walletBalance={walletBalance}
                    startDay={+startDay + 1}
                    isTokenApproved={isTokenApproved}
                    isTokenApproving={isTokenApproving}
                    handleApproveToken={handleApproveToken}
                    handleStake={handleStake}
                    bonusDay={bonusDay}
                    handleCalcBonusDay={handleCalcBonusDay}
                    calcLBP={calcLBP}
                    calcBPB={calcBPB}
                />
                <Graph dividentsPool={dividentsPool} isDarkTheme={isDarkTheme} />
                <ReferrerLink />
            </div>
            <div className="row row--lg">
                <StakeInfo
                    totalStaked={totalStaked}
                    totalShares={totalShares}
                    fromReferrs={fromReferrs}
                    totalDividents={totalDividents}
                    totalTimeBonus={totalTimeBonus}
                    totalValueBonus={totalValueBonus}
                />
                <ActiveStakes
                    isDarkTheme={isDarkTheme}
                    activeStakes={activeStakes}
                    handleRefreshActiveStakes={getStakes}
                    isRefreshingStates={activeStakesRefreshing}
                    handleWithdraw={handleWithdraw}
                />
            </div>
        </div>
    );
}

export default StakePage;
