import BigNumber from 'bignumber.js';
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { SummaryBets, AuctionLobby, Graph, QuestionTooltip } from '../../components';
import decimals from '../../utils/web3/decimals';
import { graphActions } from '../../redux/actions';

import './Auction.scss'

const AuctionPage = ({ isDarkTheme, userAddress, contractService, walletService }) => {
    const dispatch = useDispatch()
    const location = useLocation()
    const params = new URLSearchParams(location.search)

    const [currentDays, setCurrentDays] = useState(0)
    const [firstAuctionObj, setFirstAuctionObj] = useState({})
    const [participation, setParticipation] = useState(0)
    const [totalReceive, setTotalReceive] = useState(0)
    const [totalEntry, setTotalEntry] = useState(0)
    const [averageRate, setAverageRate] = useState(0)
    const [ethBalance, setEthBalance] = useState(0)

    const [pageCount, setPageCount] = useState(4)
    const [currentPage, setCurrentPage] = useState(1)

    const [auctionRows, setAuctionsRows] = useState([])

    const [isSummaryBetsLoading, setIsSummaryBetsLoading] = useState(false)

    const [isAuctionRefreshing, setAuctionRefreshing] = useState(false)

    const { graphData, dividentsPool } = useSelector(({ graph }) => {
        return {
            graphData: graph.graphDots,
            dividentsPool: graph.dividentsPool
        }
    })

    const calcReceived = async (day, memberEntry, currentRawAmount, pool) => {

        let dailyEntryCurrentDay = await contractService.xfLobby(day)
        dailyEntryCurrentDay = parseInt(dailyEntryCurrentDay._hex)

        let calcTotalReceive = +dailyEntryCurrentDay !== 0 ? new BigNumber(currentRawAmount.dividedBy(dailyEntryCurrentDay).multipliedBy(pool)) : new BigNumber(0)


        const defaultReferrerAddr = await contractService.defaultReferrerAddr()

        if (memberEntry.referrerAddr && memberEntry.referrerAddr !== 0 && memberEntry.referrerAddr.toUpperCase() !== userAddress.toUpperCase() && memberEntry.referrerAddr.toUpperCase() !== defaultReferrerAddr.toUpperCase()) {
            calcTotalReceive = calcTotalReceive.multipliedBy(1.1)
        }

        return calcTotalReceive.toFixed()
    }

    const getRows = React.useCallback(async (page = 1, days, auctionObj) => {
        setAuctionsRows([])
        let newAuctionsRows = []

        const newPageCount = Math.ceil(new BigNumber(days).minus(+auctionObj[1]).dividedBy(5))

        setPageCount(newPageCount)

        // const startPoint = auctionObj[0] ? +auctionObj[1] + (page - 1) * 5 - 1 : +days
        // const endPoint = +startPoint + 5 - 1 > +days ? days : +startPoint + 5 - 1

        const startPoint = +days - (page - 1) * 5
        const endPoint = +startPoint - 5 < +auctionObj[1] ? +auctionObj[1] : +startPoint - 5


        for (let i = startPoint; i >= endPoint; i--) {
            let currentRawAmount = new BigNumber(0);

            const memberObj = await contractService.xfLobbyMembers(i, userAddress)

            let memberEntry = {}

            const auctionRow = {
                countDay: i,
                day: '20.10.2020',
                pool: '100,000',
                eth: '100,000',
                state: 'Open',
                received: '0',
                yourEntry: '100,000',
                dailyEntry: '20.10.2020',
                status: 'Active'
            }

            auctionRow.pool = await contractService.waasLobby(i)
            auctionRow.pool = parseInt(auctionRow.pool._waasLobby._hex)

            auctionRow.pool = new BigNumber(auctionRow.pool).dividedBy(new BigNumber(10).pow(decimals.TAMPA)).toFixed()

            for (let j = 0; j < +memberObj.tailIndex; j++) {
                memberEntry = await contractService.xfLobbyEntry(userAddress, i, j)
                memberEntry.rawAmount = parseInt(memberEntry.rawAmount._hex)

                currentRawAmount = currentRawAmount.plus(new BigNumber(memberEntry.rawAmount).dividedBy(new BigNumber(10).pow(decimals.TRX)))
            }


            const received = await calcReceived(i, memberEntry, currentRawAmount, auctionRow.pool)

            auctionRow.received = new BigNumber(received).multipliedBy(new BigNumber(10).pow(decimals.TRX)).toFixed()

            auctionRow.day = await contractService.getDayUnixTime(i)
            auctionRow.day = parseInt(auctionRow.day._hex)

            auctionRow.state = +i === +days ? true : false

            auctionRow.yourEntry = currentRawAmount.toFixed();

            let dailyEntry = await contractService.xfLobby(i)
            dailyEntry = parseInt(dailyEntry._hex)

            auctionRow.dailyEntry = new BigNumber(dailyEntry).dividedBy(new BigNumber(10).pow(decimals.TRX)).toFixed()

            auctionRow.status = memberObj.headIndex < memberObj.tailIndex

            auctionRow.eth = +auctionRow.dailyEntry !== 0 ? new BigNumber(auctionRow.pool).dividedBy(auctionRow.dailyEntry).toFixed() : 0

            newAuctionsRows.push(auctionRow)
        }
        setAuctionsRows(newAuctionsRows)
        setAuctionRefreshing(false)
    }, [currentPage, userAddress, contractService])

    const getData = React.useCallback(() => {
        setAuctionRefreshing(true)
        setIsSummaryBetsLoading(true)
        contractService.currentDay()
            .then(days => {
                days = parseInt(days._hex)
                days = days <= 365 ? days : 365
                setCurrentDays(days)

                contractService.getEthBalance(userAddress)
                    .then(balance => {
                        setEthBalance(new BigNumber(balance).dividedBy(new BigNumber(10).pow(decimals.TRX)).toFixed())
                    })
                    .catch(err => console.log(err))

                contractService.getFirstAuction()
                    .then(async res => {
                        res[1] = parseInt(res[1]._hex)
                        setFirstAuctionObj(res)

                        getRows(currentPage, days, res)

                        let newAverageRate = new BigNumber(0)
                        let rawAmount = new BigNumber(0);
                        let newParticipation = 0
                        let newTotalReceive = new BigNumber(0)
                        let totalLotteryEntryes = 0;

                        for (let i = res[0] ? +res[1] : days; i <= days; i++) {
                            let currentRawAmount = new BigNumber(0);

                            const memberObj = await contractService.xfLobbyMembers(i, userAddress)
                            let memberEntry = {}

                            for (let j = 0; j < +memberObj.tailIndex; j++) {
                                totalLotteryEntryes++
                                memberEntry = await contractService.xfLobbyEntry(userAddress, i, j)
                                memberEntry.rawAmount = parseInt(memberEntry.rawAmount._hex)

                                currentRawAmount = currentRawAmount.plus(new BigNumber(memberEntry.rawAmount).dividedBy(new BigNumber(10).pow(decimals.TRX)))
                            }
                            if (+currentRawAmount.toFixed() > 0) {

                                let pool = await contractService.waasLobby(i)
                                pool = parseInt(pool._waasLobby._hex)

                                pool = new BigNumber(pool).dividedBy(new BigNumber(10).pow(decimals.TAMPA)).toFixed()

                                rawAmount = rawAmount.plus(currentRawAmount)

                                let received = await calcReceived(i, memberEntry, currentRawAmount, pool)

                                received = new BigNumber(received).multipliedBy(new BigNumber(10).pow(decimals.TRX)).toFixed()

                                newTotalReceive = newTotalReceive.plus(received)


                                if (+memberObj.tailIndex > 0) {
                                    newParticipation++

                                    let dailyEntry = await contractService.xfLobby(i)
                                    dailyEntry = parseInt(dailyEntry._hex)

                                    newAverageRate = newAverageRate.plus(new BigNumber(pool).dividedBy(new BigNumber(dailyEntry).dividedBy(new BigNumber(10).pow(decimals.TRX))))
                                }
                            }
                        }
                        newAverageRate = totalLotteryEntryes === 0 ? 0 : newAverageRate.dividedBy(totalLotteryEntryes)

                        setTotalReceive(newTotalReceive.toFixed())
                        setAverageRate(newAverageRate.toFixed())
                        setTotalEntry(rawAmount.toFixed())
                        setParticipation(newParticipation)


                        setIsSummaryBetsLoading(false)
                    })
                    .catch(err => {
                        console.log(err)
                    })


            })
            .catch(err => console.log(err))

    }, [userAddress, contractService])

    const handleChangePage = (page) => {
        setCurrentPage(page)

        getRows(page, currentDays, firstAuctionObj)
    }
    const handleRefreshAuctions = () => {
        if (!isAuctionRefreshing) {
            getData()
        }
    }

    const getGraphDots = () => {
        if (!graphData.length && userAddress && currentDays) {
            contractService.getFirstAuction()
                .then(async auctionObj => {
                    auctionObj[1] = parseInt(auctionObj[1]._hex)
                    let graphDots = []
                    let zeroDay = {
                        day: 0,
                        value: 0
                    }
                    for (let i = +auctionObj[1]; i <= +currentDays; i++) {
                        let value = await contractService.xfLobby(i)
                        value = parseInt(value._hex)
                        value = new BigNumber(value).multipliedBy(0.9).dividedBy(new BigNumber(10).pow(decimals.TRX)).toFixed()

                        const graphDot = {
                            day: i,
                            value
                        }

                        let dividentsPool = 0

                        if (+value !== 0 && i !== 0 && i !== currentDays) {
                            graphDots.push(graphDot)
                        }

                        if (i === +currentDays) {
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

    const handleEnterAuction = async (amount) => {
        try {
            await walletService.sendTx({
                method: 'xfLobbyEnter(address)',
                params: [
                    {
                        type: 'address',
                        value: window.localStorage.referal || userAddress
                    }
                ],
                walletAddr: userAddress,
                options: {
                    callValue: new BigNumber(amount).times(Math.pow(10, decimals.TRX)).toString(10)
                }
            })

            setTimeout(() => {
                getData();
            }, 1000)
        } catch (err) {
            console.log(err)
        }
    }

    const handleExitAuction = (day) => {
        contractService.createTokenTransaction({
            data: {
                other: [day, 0]
            },
            address: userAddress,
            swapMethod: 'xfLobbyExit',
            contractName: 'TAMPA',
            stake: false,
            widtdraw: true,
            callback: () => getData()
        })
    }

    React.useEffect(() => {
        if (userAddress && contractService) {
            getData()
        }
    }, [userAddress, getData, contractService])

    React.useEffect(() => {
        const referal = params.get('ref')

        if (referal) {
            window.localStorage['referal'] = referal
        }
    }, [])
    React.useEffect(() => {
        if (contractService) {
            getGraphDots()
        }
    }, [userAddress, currentDays, contractService])

    return (
        <div className="auction" id="auction">
            <div className="row row--lg">
                <h1 className="auction__title">Auction
                    <QuestionTooltip isDarkTheme={isDarkTheme} parent="auction"
                        tooltipText="Auction lobbies are Daily Auctions that offer Jackpot tokens to those who make ETH deposits. The Jackpot token pool in the lobby will start at 2.5 million Jackpot per day and decrease to 1 million over the next 365 days. Starting from day 366 there will be no further auctions and Jackpot tokens will have to be purchased from current holders are earned from staking from that point forward. There will be no other way to receive more Jackpot tokens which is designed to increase the price.<br>

Lobbies are daily and restart every day at 01:00 UTC. Enter the auction in the first hour to participate in the Jackpot lottery. Refresh the page to see if the current day is a day that you get one chance per full ETH deposited, or one chance regardless of how much ETH you deposit in the first hour.  Keep in mind, 95% of the ETH deposited into the smart contract is returned to stakers/those who purchased Jackpot tokens.<br><br>

Systems that pay out more are often unsustainable, as there is no fuel for marketing or improvement of the project.  This project is designed to be profitable for years to come."

                    />
                </h1>
                <Graph dividentsPool={dividentsPool} isDarkTheme={isDarkTheme} data={graphData} />
                <SummaryBets
                    isDarkTheme={isDarkTheme}
                    currentDays={+currentDays + 1}
                    participation={participation}
                    totalReceive={totalReceive}
                    averageRate={averageRate}
                    totalEntry={totalEntry}
                    isLoading={isSummaryBetsLoading}
                />
                <AuctionLobby
                    currentDays={currentDays}
                    isDarkTheme={isDarkTheme}
                    handleChangePage={handleChangePage}
                    pageCount={pageCount}
                    isRefreshing={isAuctionRefreshing}
                    currentPage={currentPage}
                    rows={auctionRows}
                    handleEnterAuction={handleEnterAuction}
                    handleExitAuction={handleExitAuction}
                    ethBalance={ethBalance}
                    handleRefresh={handleRefreshAuctions}
                />
            </div>
        </div>
    );
}

export default AuctionPage;
