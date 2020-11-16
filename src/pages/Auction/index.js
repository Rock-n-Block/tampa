import BigNumber from 'bignumber.js';
import React, { useState } from 'react';

import { SummaryBets, AuctionLobby, Graph } from '../../components';
import ContractService from '../../utils/contractService';
import decimals from '../../utils/web3/decimals';

import './Auction.scss'

const AuctionPage = ({ isDarkTheme, userAddress }) => {

    const [contractService] = useState(new ContractService())

    const [currentDays, setCurrentDays] = useState(1)
    const [participation, setParticipation] = useState(0)
    const [totalReceive, setTotalReceive] = useState(0)
    const [totalEntry, setTotalEntry] = useState(0)
    const [averageRate, setAverageRate] = useState(0)
    const [ethBalance, setEthBalance] = useState(0)

    const [auctionRows, setAuctionsRows] = useState([])

    const getData = () => {
        contractService.currentDay()
            .then(days => {
                setCurrentDays(days)


                contractService.getFirstAuction()
                    .then(async res => {
                        if (res[0]) {
                            const receivePromises = []
                            let rawAmount = new BigNumber(0);
                            let newAuctionsRows = []
                            let newParticipation = 0
                            let newAverageRate = new BigNumber(0)

                            for (let i = +res[1]; i <= days; i++) {
                                let currentRawAmount = new BigNumber(0);

                                receivePromises.push(contractService.tampaReceivedAuction(i, userAddress))

                                const memberObj = await contractService.xfLobbyMembers(i, userAddress)

                                for (let j = +memberObj.headIndex; j < +memberObj.tailIndex; j++) {
                                    const memberEntry = await contractService.xfLobbyEntry(userAddress, i, j)
                                    rawAmount = rawAmount.plus(new BigNumber(memberEntry.rawAmount).dividedBy(new BigNumber(10).pow(decimals.TAMPA)))
                                    currentRawAmount = rawAmount
                                }


                                const auctionRow = {
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

                                if (i > 0 && i <= 365) {
                                    auctionRow.pool = new BigNumber(5)
                                        .multipliedBy(new BigNumber(10).pow(6))
                                        .multipliedBy(new BigNumber(10).pow(18))
                                        .minus(new BigNumber(i).minus(1).multipliedBy(new BigNumber(1095890410958))).toFixed();
                                    // 5 * 10^6 * 10^18 - ((enterDay - 1) * 1095890410958)
                                } else {
                                    auctionRow.pool = new BigNumber(1).multipliedBy(new BigNumber(10).pow(6)).multipliedBy(new BigNumber(10).pow(18)).toFixed();
                                    // 1 * 10^6 * 10^18
                                }
                                auctionRow.state = i == +days ? true : false

                                auctionRow.received = await contractService.tampaReceivedAuction(i, userAddress)

                                auctionRow.yourEntry = currentRawAmount.toString();

                                auctionRow.dailyEntry = await contractService.xfLobby(i - 1)

                                auctionRow.status = memberObj.headIndex < memberObj.tailIndex

                                newAuctionsRows.push(auctionRow)

                                if (+memberObj.tailIndex > 0) {
                                    newParticipation++

                                    newAverageRate = newAverageRate.plus(new BigNumber(auctionRow.pool).dividedBy(auctionRow.dailyEntry))
                                }
                            }

                            setAuctionsRows(newAuctionsRows.reverse())
                            setTotalEntry(rawAmount.toString())
                            setParticipation(newParticipation)
                            setAverageRate(newAverageRate.toString())

                            contractService.getEthBalance(userAddress)
                                .then(balance => {
                                    setEthBalance(new BigNumber(balance).dividedBy(new BigNumber(10).pow(decimals.TAMPA)).toString())
                                })
                                .catch(err => console.log(err))

                            Promise.all(receivePromises)
                                .then(result => {
                                    let totalReceive = 0

                                    result.map(item => totalReceive += +item)

                                    setTotalReceive(totalReceive)
                                })
                                .catch(err => {
                                    console.log(err)
                                })
                        } else {
                            setTotalReceive(0)
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })


            })
            .catch(err => console.log(err))

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

    React.useEffect(() => {
        if (userAddress) {
            getData()
        }
    }, [userAddress])

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
                {auctionRows.length ? <AuctionLobby rows={auctionRows} handleEnterAuction={handleEnterAuction} ethBalance={ethBalance} /> : ''}
            </div>
        </div>
    );
}

export default AuctionPage;
