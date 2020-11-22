import BigNumber from 'bignumber.js';
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { SummaryBets, AuctionLobby, Graph } from '../../components';
import ContractService from '../../utils/contractService';
import decimals from '../../utils/web3/decimals';
import { graphActions } from '../../redux/actions';

import './Auction.scss'

const AuctionPage = ({ isDarkTheme, userAddress }) => {
    const dispatch = useDispatch()
    const location = useLocation()
    const params = new URLSearchParams(location.search)

    const [contractService] = useState(new ContractService())

    const [currentDays, setCurrentDays] = useState(1)
    const [firstAuctionObj, setFirstAuctionObj] = useState({})
    const [participation, setParticipation] = useState(0)
    const [totalReceive, setTotalReceive] = useState(0)
    const [totalEntry, setTotalEntry] = useState(0)
    const [dividentsPool, setDividentsPool] = useState(0)
    const [averageRate, setAverageRate] = useState(0)
    const [ethBalance, setEthBalance] = useState(0)

    const [pageCount, setPageCount] = useState(4)
    const [currentPage, setCurrentPage] = useState(1)

    const [auctionRows, setAuctionsRows] = useState([])

    const [isSummaryBetsLoading, setIsSummaryBetsLoading] = useState(false)

    const graphData = useSelector(({ graph }) => graph.graphDots)

    const getAuctionPool = (day) => {
        let result = 0;
        if (day >= 0 && day <= 365) {
            result = new BigNumber(5)
                .multipliedBy(new BigNumber(10).pow(6))
                .multipliedBy(new BigNumber(10).pow(18))
                .minus(new BigNumber(day).multipliedBy(new BigNumber(10958904109589041095890)));
            // 5 * 10^6 * 10^18 - ((enterDay - 1) * 1095890410958)
        } else {
            result = new BigNumber(1).multipliedBy(new BigNumber(10).pow(6)).multipliedBy(new BigNumber(10).pow(18));
            // 1 * 10^6 * 10^18
        }

        return result.dividedBy(new BigNumber(10).pow(decimals.TAMPA)).toFixed()
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

            for (let j = +memberObj.headIndex; j < +memberObj.tailIndex; j++) {
                const memberEntry = await contractService.xfLobbyEntry(userAddress, i, j)
                currentRawAmount = new BigNumber(memberEntry.rawAmount).dividedBy(new BigNumber(10).pow(decimals.TAMPA))
            }


            const auctionRow = {
                countDay: i,
                day: '20.10.2020',
                pool: '100,000',
                eth: '100,000',
                state: 'Open',
                received: '100,000',
                yourEntry: '100,000',
                dailyEntry: '20.10.2020',
                status: 'Active'
            }

            auctionRow.day = await contractService.getDayUnixTime(i)

            auctionRow.pool = getAuctionPool(i)

            auctionRow.state = +i === +days ? true : false

            const received = await contractService.tampaReceivedAuction(i, userAddress)
            auctionRow.received = new BigNumber(received).dividedBy(new BigNumber(10).pow(decimals.TAMPA)).toFixed()

            auctionRow.yourEntry = currentRawAmount.toFixed();

            const dailyEntry = await contractService.xfLobby(i - 1)

            auctionRow.dailyEntry = new BigNumber(dailyEntry).dividedBy(new BigNumber(10).pow(decimals.TAMPA)).toFixed()

            auctionRow.status = memberObj.headIndex < memberObj.tailIndex

            auctionRow.eth = new BigNumber(auctionRow.dailyEntry).dividedBy(auctionRow.pool).toFixed()

            newAuctionsRows.push(auctionRow)
        }

        setAuctionsRows(newAuctionsRows)
    }, [currentPage, userAddress, contractService])

    const getData = React.useCallback(() => {
        setIsSummaryBetsLoading(true)
        contractService.currentDay()
            .then(days => {
                setCurrentDays(days)


                contractService.getFirstAuction()
                    .then(async res => {
                        setFirstAuctionObj(res)

                        getRows(1, days, res)

                        const receivePromises = []
                        let newAverageRate = new BigNumber(0)
                        let rawAmount = new BigNumber(0);
                        let newParticipation = 0

                        for (let i = res[0] ? +res[1] : days; i <= days; i++) {

                            receivePromises.push(contractService.tampaReceivedAuction(i, userAddress))

                            const memberObj = await contractService.xfLobbyMembers(i, userAddress)

                            for (let j = +memberObj.headIndex; j < +memberObj.tailIndex; j++) {
                                const memberEntry = await contractService.xfLobbyEntry(userAddress, i, j)
                                rawAmount = rawAmount.plus(new BigNumber(memberEntry.rawAmount).dividedBy(new BigNumber(10).pow(decimals.TAMPA)))
                            }


                            if (+memberObj.tailIndex > 0) {
                                newParticipation++

                                const dailyEntry = await contractService.xfLobby(i - 1)
                                const pool = getAuctionPool(i)

                                newAverageRate = newAverageRate.plus(new BigNumber(dailyEntry).dividedBy(pool))
                            }
                        }

                        setAverageRate(newAverageRate.toFixed())
                        setTotalEntry(rawAmount.toFixed())
                        setParticipation(newParticipation)

                        contractService.getEthBalance(userAddress)
                            .then(balance => {
                                setEthBalance(new BigNumber(balance).dividedBy(new BigNumber(10).pow(decimals.TAMPA)).toString())
                            })
                            .catch(err => console.log(err))

                        Promise.all(receivePromises)
                            .then(result => {
                                let totalReceive = new BigNumber(0)

                                result.map(item => totalReceive = totalReceive.plus(item))

                                setTotalReceive(totalReceive.dividedBy(new BigNumber(10).pow(decimals.TAMPA)).toFixed())
                            })
                            .catch(err => {
                                console.log(err)
                            })
                        setIsSummaryBetsLoading(false)
                    })
                    .catch(err => {
                        console.log(err)
                    })


                !graphData.length && contractService.getFirstAuction()
                    .then(async auctionObj => {
                        const graphDots = [{
                            day: 0,
                            value: 0
                        }]
                        for (let i = auctionObj[1]; i < days; i++) {
                            let value = await contractService.xfLobby(i)

                            const graphDot = {
                                day: i,
                                value: new BigNumber(value).multipliedBy(0.9).dividedBy(new BigNumber(10).pow(decimals.TAMPA)).toFixed()
                            }

                            if (+value !== 0) {
                                graphDots.push(graphDot)
                            }

                            if (i === days) {
                                setDividentsPool(new BigNumber(value).multipliedBy(0.9).dividedBy(new BigNumber(10).pow(decimals.TAMPA)).toFixed())
                            }
                        }

                        dispatch(graphActions.setDots(graphDots))
                    })
                    .catch(err => console.log(err))


            })
            .catch(err => console.log(err))

    }, [userAddress, contractService])

    const handleChangePage = (page) => {
        setCurrentPage(page)

        getRows(page, currentDays, firstAuctionObj)
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
        if (userAddress) {
            getData()
        }
    }, [userAddress, getData])

    React.useEffect(() => {
        const referal = params.get('ref')

        if (referal) {
            window.localStorage['referal'] = referal
        }
    }, [])

    return (
        <div className="auction">
            <div className="row row--lg">
                <h1 className="auction__title">Auction</h1>
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
                    handleChangePage={handleChangePage}
                    pageCount={pageCount}
                    currentPage={currentPage}
                    rows={auctionRows}
                    handleEnterAuction={handleEnterAuction}
                    handleExitAuction={handleExitAuction}
                    ethBalance={ethBalance}
                />
            </div>
        </div>
    );
}

export default AuctionPage;
