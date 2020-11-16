import BigNumber from 'bignumber.js';
import React, {useState} from 'react';

import { Lottery, LotteryHistory } from '../../components';
import ContractService from '../../utils/contractService';
import decimals from '../../utils/web3/decimals';

import './Lottery.scss'

const LotteryPage = ({isDarkTheme, userAddress}) => {
    const [contractService] = useState(new ContractService())

    const [amountOfDraw, setAmountOfDraw] = useState(0)

    const getData = () => {

        contractService.currentDay()
            .then(days => {
                contractService.xfLobby(days - 1)
                .then(amount => {
                    setAmountOfDraw(new BigNumber(amount).multipliedBy(25).dividedBy(1000).toString())
                })
                .catch(err => console.log(err))

                contractService.loteryCountLen(days)
                .then(res => {
                    console.log(res, 'res')
                })
                .catch(err => console.log(err))

                contractService.endLoteryDay(days)
                .then(res => {
                    console.log(res, 'endLottery')

                    contractService.winners(days)
                    .then(res => {
                        console.log(res, 'winners')
                    })
                    .catch(err => console.log(err))
                })
                .catch(err => console.log(err))
            })
            .catch(err => console.log(err))
    }

    React.useEffect(() => {
        if(userAddress) {
            getData()
        }
    }, [userAddress])

    return (
        <div className="p-lottery">
            <div className="row row--md">
                <Lottery 
                    amountOfDraw={amountOfDraw}
                />
                <LotteryHistory />
            </div>
        </div>
    );
}

export default LotteryPage;
