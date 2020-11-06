import React, { useState, useEffect } from 'react';

import { StakeForm, ReferrerLink, StakeInfo, ActiveStakes, Graph } from '../../components';
import ContractService from '../../utils/contractService';

import './Stake.scss'
import { BigNumber } from 'bignumber.js';
import decimals from '../../utils/web3/decimals';

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

    const [isTokenApproved, setIsTokenApproved] = useState(false)
    const [isTokenApproving, setIsTokenApproving] = useState(false)

    const calcLBP = (firstArg, secondArg) => {
        const amount = new BigNumber(firstArg)
        const days = new BigNumber(secondArg)

        return amount.multipliedBy(BigNumber.min(3640, days.minus(1)).dividedBy(1820))

        // amountToStake * (min{3640; daysToStake - 1} / 1820)
    }

    const calcBPB = (firstArg) => {
        const amount = new BigNumber(firstArg)
        const multi = BigNumber(7).multipliedBy(new BigNumber(10).pow(24))

        return amount.multipliedBy(BigNumber.min(multi, amount).dividedBy(BigNumber(7).multipliedBy(new BigNumber(10).pow(25))))
        // amountToStake * (min{7 * 10^24; amountToStake} / 7 * 10^25)
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
                setStartDay(+res + 1)
                return +res
            })
            .then(currentDay => {

                contractService.xfLobby(currentDay)
                    .then(resXfLobby => {
                        const result = BigNumber(resXfLobby * 0.9).toFixed()
                        setDividentsPool(result)
                    })
                    .catch(err => console.log(err))

                contractService.stakeCount(userAddress)
                    .then(res => {
                        const promises = []
                        for (let stakeIndex = 0; stakeIndex < res; stakeIndex++) {
                            promises.push(contractService.stakeLists(userAddress, stakeIndex))
                        }

                        Promise.all([...promises])
                            .then(result => {
                                // const activeStakesObj = {}
                                let newTotalStaked = 0;
                                let newTotalShares = 0;
                                let newTotalTimeBonus = new BigNumber(0);
                                let newTotalValueBonus = new BigNumber(0);

                                const totalDividentsPromises = result.map(item => {
                                    newTotalStaked = +newTotalStaked + +item.stakedSuns
                                    newTotalShares = +newTotalShares + +item.stakeShares

                                    newTotalTimeBonus = newTotalTimeBonus.plus(calcLBP(item.stakedSuns, item.stakedDays))
                                    newTotalValueBonus = newTotalValueBonus.plus(calcBPB(item.stakedSuns))

                                    return contractService.calcPayoutDividendsReward(item.stakeShares, item.lockedDay, item.stakedDays, currentDay)
                                })

                                newTotalStaked = BigNumber((newTotalStaked) / Math.pow(10, decimals.TAMPA)).toFixed()

                                setTotalStaked(newTotalStaked)
                                setTotalShares(newTotalShares)
                                setTotalTimeBonus(newTotalTimeBonus.toString())
                                setTotalValueBonus(newTotalValueBonus.toString())

                                return Promise.all([...totalDividentsPromises])

                            })
                            .then(result => {
                                const newTotalDividents = 0

                                result.map(item => newTotalDividents = +newTotalDividents + item)

                                setTotalDividents(newTotalDividents)
                            })
                            .catch(err => console.log(err))
                    })
                    .catch(err => console.log(err))
            })
            .catch(err => console.log(err))

        contractService.fromReferrs(userAddress)
            .then(res => setFromReferrs(res))
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
                days
            },
            address: userAddress,
            swapMethod: 'stakeStart',
            contractName: 'TAMPA',
            stake: true,
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
                    startDay={startDay}
                    isTokenApproved={isTokenApproved}
                    isTokenApproving={isTokenApproving}
                    handleApproveToken={handleApproveToken}
                    handleStake={handleStake}
                />
                <Graph dividentsPool={dividentsPool} />
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
                <ActiveStakes isDarkTheme={isDarkTheme} />
            </div>
        </div>
    );
}

export default StakePage;
