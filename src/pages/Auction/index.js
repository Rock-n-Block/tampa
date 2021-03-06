import BigNumber from 'bignumber.js';
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { SummaryBets, AuctionLobby, Graph, QuestionTooltip } from '../../components';
import decimals from '../../utils/web3/decimals';
import { graphActions } from '../../redux/actions';

import './Auction.scss'

const AuctionPage = ({ isDarkTheme, userAddress, contractService }) => {
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

        const dailyEntryCurrentDay = await contractService.xfLobby(day)

        let calcTotalReceive = +dailyEntryCurrentDay !== 0 ? new BigNumber(currentRawAmount.dividedBy(dailyEntryCurrentDay).multipliedBy(pool)) : new BigNumber(0)


        const defaultReferrerAddr = await contractService.defaultReferrerAddr()

        if (memberEntry.referrerAddr && memberEntry.referrerAddr !== 0 && memberEntry.referrerAddr.toUpperCase() !== userAddress.toUpperCase() && memberEntry.referrerAddr.toUpperCase() !== defaultReferrerAddr.toUpperCase()) {
            calcTotalReceive = calcTotalReceive.multipliedBy(1.05)
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

            auctionRow.pool = new BigNumber(auctionRow.pool).dividedBy(new BigNumber(10).pow(decimals.TAMPA)).toFixed()

            for (let j = 0; j < +memberObj.tailIndex; j++) {
                memberEntry = await contractService.xfLobbyEntry(userAddress, i, j)

                currentRawAmount = currentRawAmount.plus(new BigNumber(memberEntry.rawAmount).dividedBy(new BigNumber(10).pow(decimals.ETH)))
            }


            const received = await calcReceived(i, memberEntry, currentRawAmount, auctionRow.pool)

            auctionRow.received = new BigNumber(received).multipliedBy(new BigNumber(10).pow(decimals.ETH)).toFixed()

            auctionRow.day = await contractService.getDayUnixTime(i)

            auctionRow.state = +i === +days ? true : false

            auctionRow.yourEntry = currentRawAmount.toFixed();

            const dailyEntry = await contractService.xfLobby(i)

            auctionRow.dailyEntry = new BigNumber(dailyEntry).dividedBy(new BigNumber(10).pow(decimals.ETH)).toFixed()

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
                setCurrentDays(days)

                contractService.getEthBalance(userAddress)
                    .then(balance => {
                        setEthBalance(new BigNumber(balance).dividedBy(new BigNumber(10).pow(decimals.ETH)).toFixed())
                    })
                    .catch(err => console.log(err))

                contractService.getFirstAuction()
                    .then(async res => {
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
                                currentRawAmount = currentRawAmount.plus(new BigNumber(memberEntry.rawAmount).dividedBy(new BigNumber(10).pow(decimals.ETH)))
                            }
                            if (+currentRawAmount.toFixed() > 0) {

                                let pool = await contractService.waasLobby(i)

                                pool = new BigNumber(pool).dividedBy(new BigNumber(10).pow(decimals.TAMPA)).toFixed()

                                rawAmount = rawAmount.plus(currentRawAmount)

                                let received = await calcReceived(i, memberEntry, currentRawAmount, pool)

                                received = new BigNumber(received).multipliedBy(new BigNumber(10).pow(decimals.ETH)).toFixed()

                                newTotalReceive = newTotalReceive.plus(received)


                                if (+memberObj.tailIndex > 0) {
                                    newParticipation++

                                    const dailyEntry = await contractService.xfLobby(i)

                                    newAverageRate = newAverageRate.plus(new BigNumber(pool).dividedBy(new BigNumber(dailyEntry).dividedBy(new BigNumber(10).pow(decimals.ETH))))
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
                    let graphDots = []
                    let zeroDay = {
                        day: 0,
                        value: 0
                    }
                    for (let i = +auctionObj[1]; i <= +currentDays; i++) {
                        let value = await contractService.xfLobby(i)
                        value = new BigNumber(value).multipliedBy(0.9).dividedBy(new BigNumber(10).pow(decimals.ETH)).toFixed()

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

    const handleEnterAuction = (amount) => {
        contractService.createTokenTransaction({
            data: {
                amount,
                other: [window.localStorage.referal || userAddress]
            },
            address: userAddress,
            swapMethod: 'xfLobbyEnter',
            contractName: 'TAMPA',
            stake: false,
            isEth: true,
            auction: true,
            callback: () => getData()
        })
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
                        tooltipText="Auction lobbies are Daily Auctions that offer J tokens for ETH based on the J and ETH pool at the end of the day.<br>

The J token pool in the lobby will start at 5 million TMP per day and decrease to 1 million over the next 365 days. Starting from day 366, the auction pool will be equal to 1 million J tokens per day.<br><br>

Lobbies are daily and restart every day at 01:00 UTC.<br>
Enter the auction in the first hour to participate in the lottery.<br><br>

Auction lobbies are another way to buy J tokens that might be more profitable than purchasing on exchanges. Plus the ETH spent is rewarded back to Stakers."

                    />
                </h1>
                <Graph dividentsPool={dividentsPool} isDarkTheme={isDarkTheme} data={graphData} />
                <SummaryBets
                    isDarkTheme={isDarkTheme}
                    currentDays={currentDays}
                    participation={participation}
                    totalReceive={totalReceive}
                    averageRate={averageRate}
                    totalEntry={totalEntry}
                    isLoading={isSummaryBetsLoading}
                />
                <AuctionLobby
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
