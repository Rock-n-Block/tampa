import BigNumber from 'bignumber.js';
import React, { useState } from 'react';

import { SummaryBets, AuctionLobby, Graph } from '../../components';
import ContractService from '../../utils/contractService';
import decimals from '../../utils/web3/decimals';

import './Auction.scss'

const AuctionPage = ({ isDarkTheme, userAddress }) => {

    const [contractService] = useState(new ContractService())

    const [currentDays, setCurrentDays] = useState(1)
    const [firstAuctionObj, setFirstAuctionObj] = useState({})
    const [participation, setParticipation] = useState(0)
    const [totalReceive, setTotalReceive] = useState(0)
    const [totalEntry, setTotalEntry] = useState(0)
    const [averageRate, setAverageRate] = useState(0)
    const [ethBalance, setEthBalance] = useState(0)

    const [pageCount, setPageCount] = useState(4)
    const [currentPage, setCurrentPage] = useState(1)

    const [auctionRows, setAuctionsRows] = useState([])

    const getRows = React.useCallback(async (page = 1, days, auctionObj) => {
        let newAuctionsRows = []
        let newAverageRate = new BigNumber(0)

        const newPageCount = Math.ceil(new BigNumber(days).dividedBy(10))

        setPageCount(newPageCount)

        const startPoint = auctionObj[0] ? +auctionObj[1] + (page - 1) * 10 - 1 : +days
        const endPoint = +startPoint + +page * 10 - 1 > +days ? days : +startPoint + +page * 10 - 1
        debugger
        for (let i = startPoint; i <= endPoint; i++) {
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

            if (i >= 0 && i <= 365) {
                auctionRow.pool = new BigNumber(5)
                    .multipliedBy(new BigNumber(10).pow(6))
                    .multipliedBy(new BigNumber(10).pow(18))
                    .minus(new BigNumber(i).multipliedBy(new BigNumber(10958904109589041095890)));
                // 5 * 10^6 * 10^18 - ((enterDay - 1) * 1095890410958)
            } else {
                auctionRow.pool = new BigNumber(1).multipliedBy(new BigNumber(10).pow(6)).multipliedBy(new BigNumber(10).pow(18));
                // 1 * 10^6 * 10^18
            }

            auctionRow.pool = new BigNumber(auctionRow.pool).dividedBy(new BigNumber(10).pow(decimals.TAMPA)).toFixed()

            auctionRow.state = +i === +days ? true : false

            const received = await contractService.tampaReceivedAuction(i, userAddress)
            auctionRow.received = new BigNumber(received).dividedBy(new BigNumber(10).pow(decimals.TAMPA)).toFixed()

            auctionRow.yourEntry = currentRawAmount.toString();

            const dailyEntry = await contractService.xfLobby(i - 1)

            auctionRow.dailyEntry = new BigNumber(dailyEntry).dividedBy(new BigNumber(10).pow(decimals.TAMPA)).toFixed()

            auctionRow.status = memberObj.headIndex < memberObj.tailIndex

            auctionRow.eth = new BigNumber(auctionRow.dailyEntry).dividedBy(auctionRow.pool).toFixed()

            if (+memberObj.tailIndex > 0) {
                newAverageRate = newAverageRate.plus(new BigNumber(auctionRow.dailyEntry).dividedBy(auctionRow.pool))
            }

            newAuctionsRows.push(auctionRow)
        }

        setAuctionsRows(newAuctionsRows.reverse())
        setAverageRate(newAverageRate.toFixed())
    }, [currentPage, userAddress, contractService])

    const getData = React.useCallback(() => {
        contractService.currentDay()
            .then(days => {
                setCurrentDays(days)


                contractService.getFirstAuction()
                    .then(async res => {
                        setFirstAuctionObj(res)
                        const receivePromises = []
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

                            }
                        }

                        getRows(1, days, res)

                        setTotalEntry(rawAmount.toString())
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

    const handleEnterAuction = (amount) => {
        contractService.createTokenTransaction({
            data: {
                amount,
                other: [userAddress]
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

    return (
        <div className="auction">
            <div className="row row--lg">
                <h1 className="auction__title">Auction</h1>
                <Graph isDarkTheme={isDarkTheme} />
                <SummaryBets
                    isDarkTheme={isDarkTheme}
                    currentDays={currentDays}
                    participation={participation}
                    totalReceive={totalReceive}
                    averageRate={averageRate}
                    totalEntry={totalEntry}
                />
                {auctionRows.length ? <AuctionLobby
                    handleChangePage={handleChangePage}
                    pageCount={pageCount}
                    currentPage={currentPage}
                    rows={auctionRows}
                    handleEnterAuction={handleEnterAuction}
                    handleExitAuction={handleExitAuction}
                    ethBalance={ethBalance}
                />
                    : ''}
            </div>
        </div>
    );
}

export default AuctionPage;
