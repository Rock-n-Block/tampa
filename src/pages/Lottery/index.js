import BigNumber from 'bignumber.js';
import classNames from 'classnames';
import React, { useState } from 'react';
import { isAfter } from 'date-fns';
import moment from 'moment';

import { LotteryPrepare, LotteryHistory, LotteryActive } from '../../components';
import decimals from '../../utils/web3/decimals';
import ContractService from '../../utils/contractService';

import './Lottery.scss'

const LotteryPage = ({ isDarkTheme, userAddress }) => {
    const navItems = ["today's lottery", "tomorrow's lottery"]

    const [contractService] = useState(new ContractService())

    const [activeTab, setActiveTab] = useState(0)
    const [currentDay, setCurrentDay] = useState(null)
    const [isParticipant, setParticipant] = useState(false)

    const [amountOfDraw, setAmountOfDraw] = useState(0)
    const [lotteryPercents, setLotteryPercents] = useState(null)
    const [lotteryHistoryItems, setLotteryHistoryItems] = useState([])

    const [lotteryWinner, setLotteryWinner] = useState(null)
    const [lotteryMembers, setLotteryMembers] = useState(null)
    const [isLotteryStarted, setLotteryStarted] = useState(false)

    const getWinners = React.useCallback(async (days) => {
        const newWinners = []
        for (let i = 0; i <= days; i++) {
            const winner = await contractService.winners(i)

            if (winner.who !== '0x0000000000000000000000000000000000000000') {
                const winnerObj = {
                    date: '20.10.2020',
                    amount: winner.totalAmount,
                    winner: winner.who
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

    const handleLotteryWithdraw = () => {
        contractService.createTokenTransaction({
            data: {
                other: [
                    currentDay
                ]
            },
            address: userAddress,
            swapMethod: 'withdrawLotery',
            contractName: 'TAMPA',
            withdraw: true,
            callback: () => getData()
        })
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

                contractService.xfLobby(days - 1)
                    .then(amount => {
                        setAmountOfDraw(new BigNumber(amount).multipliedBy(25).dividedBy(1000).dividedBy(new BigNumber(10).pow(decimals.TAMPA)).toFixed())
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

                getMembersPromises(days)
                    .then(result => {
                        const members = {}
                        console.log(result, 'members')

                        result.forEach(member => {
                            if (members[member.who]) {
                                members[member.who] += +member.chanceCount
                            } else {
                                members[member.who] = +member.chanceCount
                            }

                            if (member.who.toLowerCase() === userAddress.toLowerCase()) {
                                setParticipant(true)
                            }
                        })
                        setLotteryPercents(members)
                    })
                    .catch(err => console.log(err))



                // для победителя и участников лотереи брать currentDay - 1
                contractService.winners(days - 1)
                    .then(res => {
                        console.log(res, 'winner')

                        if (res.who !== '0x0000000000000000000000000000000000000000') {
                            setLotteryWinner({
                                who: res.who,
                                isMe: res.who.toLowerCase() === userAddress.toLowerCase(),
                                totalAmount: res.totalAmount
                            })
                        }
                    })
                    .catch(err => console.log(err))
            })
            .catch(err => console.log(err))
    }, [contractService, getWinners])

    React.useEffect(() => {
        window.moment = moment
        if (userAddress) {
            getData()
        }
    }, [userAddress, getData])

    return (
        <div className="p-lottery">
            <div className="row row--md">
                <div className="p-lottery__nav container">
                    <div className="nav">
                        {
                            navItems.map((item, index) => {
                                return <div key={index} onClick={() => setActiveTab(index)} className={classNames('nav__item', {
                                    'active': activeTab === index
                                })}>{item}</div>
                            })
                        }
                    </div>
                </div>
                {activeTab === 0 && <LotteryPrepare
                    amountOfDraw={amountOfDraw}
                    userAddress={userAddress}
                    lotteryPercents={lotteryPercents}
                    isParticipant={isParticipant}
                />}
                {activeTab === 1 && <LotteryActive handleLotteryWithdraw={handleLotteryWithdraw} lotteryWinner={lotteryWinner} lotteryMembers={lotteryMembers} isLotteryStarted={isLotteryStarted} />}
                <LotteryHistory data={lotteryHistoryItems} />
            </div>
        </div>
    );
}

export default LotteryPage;
