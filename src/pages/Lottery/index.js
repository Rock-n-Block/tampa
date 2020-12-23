import BigNumber from 'bignumber.js';
import classNames from 'classnames';
import React, { useState } from 'react';
import moment from 'moment';

import { LotteryPrepare, LotteryHistory, LotteryActive, QuestionTooltip } from '../../components';
import decimals from '../../utils/web3/decimals';

import './Lottery.scss'

const LotteryPage = ({ isDarkTheme, userAddress, contractService }) => {
    const navItems = ["today's lottery", "tomorrow's lottery"]

    const [activeTab, setActiveTab] = useState(0)
    const [currentDay, setCurrentDay] = useState(null)
    const [isParticipant, setParticipant] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [pageCount, setPageCount] = useState(1)
    const [lotteryRows, setLotteryRows] = useState([])

    const [amountOfDraw, setAmountOfDraw] = useState(0)
    const [amountOfDrawTomorrow, setAmountOfDrawTomorrow] = useState(0)
    const [lotteryPercents, setLotteryPercents] = useState(null)
    const [isOddDay, setOddDay] = useState(false)
    const [lotteryHistoryItems, setLotteryHistoryItems] = useState([])


    const [lotteryWinner, setLotteryWinner] = useState(null)
    const [lotteryMembers, setLotteryMembers] = useState(null)
    const [isLotteryStarted, setLotteryStarted] = useState(false)
    const [isSlowShow, setSlowShow] = useState(false)

    const [winnerInterval, setWinnerInterval] = useState(null)

    const handleChangePage = (page) => {
        setCurrentPage(page)
        getRows(page, lotteryHistoryItems)
    }

    const getWinners = React.useCallback(async (days) => {
        try {
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
            getRows(1, newWinners)
            const newPageCount = Math.ceil(newWinners.length / 6) + 1
            setPageCount(newPageCount)
        } catch (e) {
            console.error(e);
        }
    }, [contractService])

    const getRows = React.useCallback(async (page = 1, winners = []) => {
        try {
            let newLotteryRows = [];
            const itemsFrom = 6 * (page - 1)
            const itemsTo = 6 * (page)
            newLotteryRows = winners.slice(itemsFrom,itemsTo)
            setLotteryRows(newLotteryRows)
        } catch (e) {
            console.error(e);
        }
    }, [])

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

    const getWinner = (day, interval, isSlow) => {
        contractService.winners(+day)
            .then(res => {
                console.log(res, 'winner', day)

                if (res.who !== '0x0000000000000000000000000000000000000000') {

                    if (interval) {
                        clearInterval(interval)
                        setSlowShow(true)
                    }
                    setLotteryWinner({
                        who: res.who,
                        isMe: res.who.toLowerCase() === userAddress.toLowerCase(),
                        totalAmount: new BigNumber(res.totalAmount).dividedBy(new BigNumber(10).pow(decimals.ETH)).toFixed(),
                    })

                    getWinners(currentDay)
                }
            })
            .catch(err => console.log(err))
    }

    const getData = React.useCallback(() => {

        contractService.currentDay()
            .then(days => {
                setCurrentDay(days)
                getWinners(days)

                Promise.all([contractService.loteryDayWaitingForWinner(), contractService.loteryDayWaitingForWinnerNew()])
                .then(lotteryDays => {
                    const day = +lotteryDays[1] < +days ? lotteryDays[1] : lotteryDays[0]
                    contractService.getDayUnixTime(day)
                    .then(date => {
                        let lotteryDateStart = moment.utc(date * 1000)
                        let dateNow = moment.utc()

                        const isStarted = dateNow.isAfter(lotteryDateStart)

                        setLotteryStarted(isStarted)

                        if (isStarted) {

                            getWinner(day)

                            const interval = setInterval(() => {
                                getWinner(day, interval, true)
                            }, 6000)
                            setWinnerInterval(interval)
                        }
                    })
                })
                .catch(err => console.log(err))

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
                                if (!(res % 2)) {
                                    setLotteryPercents(members)
                                }
                            })
                            .catch(err => console.log(err))
                    })
                    .catch(err => console.log(err))

                // getWinner(days - 1)
                // setInterval(() => {
                //     getWinner(days - 1)
                // }, 60000)

            })
            .catch(err => console.log(err))
    }, [contractService, getWinners, userAddress])

    React.useEffect(() => {
        if (userAddress && contractService) {
            getData(userAddress)
        }
        return () => {
            clearInterval(winnerInterval)
        }
    }, [userAddress, getData, contractService])

    return (
        <div className="p-lottery" id="p-lottery">
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
                    <QuestionTooltip isDarkTheme={isDarkTheme} parent="p-lottery"
                        tooltipText="The lottery pool is 2.5% of all BNB that enters the daily Auction Lobby.<br><br>Send a video confirmation of winning the lottery by the link and get bonus 2.5%<br><br>The name of the winner will be revealed on the next day by the first person to enter the auction at 2-00 UTC or later."

                    />
                </div>
                {activeTab === 1 && <LotteryPrepare
                    amountOfDraw={amountOfDrawTomorrow}
                    userAddress={userAddress}
                    lotteryPercents={lotteryPercents}
                    isParticipant={isParticipant}
                    isDarkTheme={isDarkTheme}
                    isOddDay={isOddDay}
                />}
                {activeTab === 0 &&
                <LotteryActive
                isSlowShow={isSlowShow}
                amountOfDraw={amountOfDraw}
                handleLotteryWithdraw={handleLotteryWithdraw}
                lotteryWinner={lotteryWinner}
                lotteryMembers={lotteryMembers}
                isLotteryStarted={isLotteryStarted}
                />
                }
                <LotteryHistory
                userAddress={userAddress}
                data={lotteryRows}
                handleLotteryWithdraw={handleLotteryWithdraw}
                currentPage={currentPage}
                pageCount={pageCount}
                handleChangePage={handleChangePage}
                />
            </div>
        </div>
    );
}

export default LotteryPage;
