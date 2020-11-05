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

    const [isTokenApproved, setIsTokenApproved] = useState(false)
    const [isTokenApproving, setIsTokenApproving] = useState(false)

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

                contractService.xfLobby(res)
                    .then(resXfLobby => {
                        const result = BigNumber(resXfLobby * 0.9).toFixed()
                        setDividentsPool(result)
                    })
                    .catch(err => console.log(err))
            })
            .catch(err => console.log(err))

        contractService.fromReferrs(userAddress)
            .then(res => setFromReferrs(res))
            .catch(err => console.log(err))

        contractService.stakeCount(userAddress)
            .then(res => {
                const promises = []
                for (let stakeIndex = 0; stakeIndex < res; stakeIndex++) {
                    promises.push(contractService.stakeLists(userAddress, stakeIndex))
                }

                Promise.all([...promises])
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
                    fromReferrs={fromReferrs}
                />
                <ActiveStakes isDarkTheme={isDarkTheme} />
            </div>
        </div>
    );
}

export default StakePage;
