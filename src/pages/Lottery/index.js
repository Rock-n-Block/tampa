import BigNumber from 'bignumber.js';
import React, { useState } from 'react';

import { Lottery, LotteryHistory } from '../../components';
import ContractService from '../../utils/contractService';

import './Lottery.scss'

const LotteryPage = ({ isDarkTheme, userAddress }) => {
    const [contractService] = useState(new ContractService())

    const [amountOfDraw, setAmountOfDraw] = useState(0)
    const [lotteryPercents, setLotteryPercents] = useState({})
    const [lotteryHistoryItems, setLotteryHistoryItems] = useState([])

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

    const getData = React.useCallback(() => {

        contractService.currentDay()
            .then(days => {
                getWinners(days)

                contractService.xfLobby(days - 1)
                    .then(amount => {
                        setAmountOfDraw(new BigNumber(amount).multipliedBy(25).dividedBy(1000).toString())
                    })
                    .catch(err => console.log(err))

                contractService.loteryCountLen(days)
                    .then(res => {
                        console.log(res, 'res')
                        let membersPromises = []

                        for (let i = 0; i < +res; i++) {
                            membersPromises.push(contractService.loteryCount(days, i))
                        }

                        return membersPromises
                    })
                    .then(promises => {
                        Promise.all(promises)
                            .then(result => {
                                const members = {}

                                result.forEach(member => {
                                    if (members[member.who]) {
                                        members[member.who] += +member.chanceCount
                                    } else {
                                        members[member.who] = +member.chanceCount
                                    }
                                })
                                setLotteryPercents(members)
                            })
                            .catch(err => console.log(err))
                    })
                    .catch(err => console.log(err))

                // contractService.endLoteryDay(days)
                //     .then(res => {
                //         console.log(res, 'endLottery')

                //         contractService.winners(days)
                //             .then(res => {
                //                 console.log(res, 'winners')
                //             })
                //             .catch(err => console.log(err))
                //     })
                //     .catch(err => console.log(err))
            })
            .catch(err => console.log(err))
    }, [contractService, getWinners])

    React.useEffect(() => {
        if (userAddress) {
            getData()
        }
    }, [userAddress, getData])

    return (
        <div className="p-lottery">
            <div className="row row--md">
                <Lottery
                    amountOfDraw={amountOfDraw}
                    userAddress={userAddress}
                    lotteryPercents={lotteryPercents}
                />
                <LotteryHistory data={lotteryHistoryItems} />
            </div>
        </div>
    );
}

export default LotteryPage;
