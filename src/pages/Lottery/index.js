import BigNumber from 'bignumber.js';
import classNames from 'classnames';
import React, { useState } from 'react';
import { isAfter } from 'date-fns';
import moment from 'moment';

import { LotteryPrepare, LotteryHistory, LotteryActive } from '../../components';
import decimals from '../../utils/web3/decimals';

import './Lottery.scss'

const LotteryPage = ({ isDarkTheme, userAddress, contractService }) => {
    const navItems = ["today's lottery", "tomorrow's lottery"]

    const [activeTab, setActiveTab] = useState(0)
    const [currentDay, setCurrentDay] = useState(null)
    const [isParticipant, setParticipant] = useState(false)

    const [amountOfDraw, setAmountOfDraw] = useState(0)
    const [amountOfDrawTomorrow, setAmountOfDrawTomorrow] = useState(0)
    const [lotteryPercents, setLotteryPercents] = useState(null)
    const [isOddDay, setOddDay] = useState(false)
    const [lotteryHistoryItems, setLotteryHistoryItems] = useState([])


    const [lotteryWinner, setLotteryWinner] = useState(null)
    const [lotteryMembers, setLotteryMembers] = useState(null)
    const [isLotteryStarted, setLotteryStarted] = useState(false)

    const getWinners = React.useCallback(async (days) => {
        const newWinners = []
        for (let i = days; i >= 0; i--) {
            const winner = await contractService.winners(i)

            if (winner.who !== '0x0000000000000000000000000000000000000000') {
                const winnerObj = {
                    day: i,
                    date: '20.10.2020',
                    amount: new BigNumber(winner.totalAmount).dividedBy(new BigNumber(10).pow(decimals.ETH)).toFixed(),
                    winner: winner.who,
                    isWithdrawed: +winner.restAmount
                }

                winnerObj.date = await contractService.getDayUnixTime(i)
                newWinners.push(winnerObj)
            }
        }
        setLotteryHistoryItems(newWinners)
    }, [contractService])

    const getMembersPromises = day => {
        return new Promise((resolve, _) => {
            contractService.loteryCountLen(day)
                .then(res => {
                    let membersPromises = []

                    for (let i = 0; i < +res; i++) {
                        membersPromises.push(contractService.loteryCount(day, i))
                    }

                    resolve(Promise.all(membersPromises))
                })
        })
    }

    const handleLotteryWithdraw = (day) => {
        contractService.createTokenTransaction({
            data: {
                other: [
                    day
                ]
            },
            address: userAddress,
            swapMethod: 'withdrawLotery',
            contractName: 'TAMPA',
            withdraw: true,
            callback: () => getWinners(currentDay)
        })
    }

    const getWinner = (day) => {
        if (isLotteryStarted) {
            contractService.winners(day - 1)
                .then(res => {
                    console.log(res, 'winner')

                    if (res.who !== '0x0000000000000000000000000000000000000000') {
                        setLotteryWinner({
                            who: res.who,
                            isMe: res.who.toLowerCase() === userAddress.toLowerCase(),
                            totalAmount: new BigNumber(res.totalAmount).dividedBy(new BigNumber(10).pow(decimals.ETH)).toFixed(),
                        })
                    }
                })
                .catch(err => console.log(err))
        }
    }

    const getData = React.useCallback(() => {

        contractService.currentDay()
            .then(days => {
                setCurrentDay(days)
                getWinners(days)


                contractService.getDayUnixTime(days - 1)
                    .then(date => {
                        let lotteryDateStart = moment.utc(date * 1000)
                        let dateNow = moment.utc()

                        setLotteryStarted(dateNow.isAfter(lotteryDateStart))
                    })

                contractService.xfLobby(days)
                    .then(amount => {
                        setAmountOfDrawTomorrow(new BigNumber(amount).multipliedBy(25).dividedBy(1000).dividedBy(new BigNumber(10).pow(decimals.ETH)).toFixed())
                    })
                    .catch(err => console.log(err))

                contractService.xfLobby(days - 1)
                    .then(amount => {
                        setAmountOfDraw(new BigNumber(amount).multipliedBy(25).dividedBy(1000).dividedBy(new BigNumber(10).pow(decimals.ETH)).toFixed())
                    })
                    .catch(err => console.log(err))

                getMembersPromises(days - 1)
                    .then(result => {
                        console.log(result, 'lottery members')
                        const lotteryMembers = []

                        result.forEach(member => {
                            lotteryMembers.push(member.who)
                        })


                        if (lotteryMembers.length) {
                            setLotteryMembers(lotteryMembers)
                        }
                    })

                contractService.globwhatDayIsItTodayals(days)
                    .then(res => {
                        setOddDay(!!!(res % 2))
                        if (!(res % 2)) {
                            getMembersPromises(days)
                                .then(result => {
                                    const members = {}
                                    let allChancesCount = 0;
                                    console.log(result, 'members')

                                    result.forEach(member => {
                                        if (members[member.who]) {
                                            members[member.who] += +member.chanceCount
                                        } else {
                                            members[member.who] = +member.chanceCount
                                        }

                                        allChancesCount += +member.chanceCount

                                        if (member.who.toLowerCase() === userAddress.toLowerCase()) {
                                            setParticipant(true)
                                        }
                                    })
                                    for (let key in members) {
                                        members[key] = members[key] ? (members[key] * 100 / allChancesCount).toFixed(2) : 0
                                    }
                                    setLotteryPercents(members)
                                })
                                .catch(err => console.log(err))
                        }
                    })
                    .catch(err => console.log(err))

                getWinner(days)
                setTimeout(() => {
                    getWinner(days)
                }, 60000)
            })
            .catch(err => console.log(err))
    }, [contractService, getWinners])

    React.useEffect(() => {
        if (userAddress && contractService) {
            getData()
        }
    }, [userAddress, getData, contractService])

    return (
        <div className="p-lottery">
            <div className="row row--md">
                <div className="p-lottery__nav container">
                    <div className="nav">
                        {
                            navItems.map((item, index) => {
                                return <div key={index} onClick={() => { setActiveTab(index); getData() }} className={classNames('nav__item', {
                                    'active': activeTab === index
                                })}>{item}</div>
                            })
                        }
                    </div>
                </div>
                {activeTab === 1 && <LotteryPrepare
                    amountOfDraw={amountOfDrawTomorrow}
                    userAddress={userAddress}
                    lotteryPercents={lotteryPercents}
                    isParticipant={isParticipant}
                    isDarkTheme={isDarkTheme}
                    isOddDay={isOddDay}
                />}
                {activeTab === 0 && <LotteryActive amountOfDraw={amountOfDraw} handleLotteryWithdraw={handleLotteryWithdraw} lotteryWinner={lotteryWinner} lotteryMembers={lotteryMembers} isLotteryStarted={isLotteryStarted} />}
                <LotteryHistory userAddress={userAddress} data={lotteryHistoryItems} handleLotteryWithdraw={handleLotteryWithdraw} />
            </div>
        </div>
    );
}

export default LotteryPage;
