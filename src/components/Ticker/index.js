
import React from 'react';
import Ticker from 'react-ticker'

import './Ticker.scss'

const TickerComponent = ({ contractService }) => {
    const [isOddDay, setOddDay] = React.useState(null)

    React.useEffect(() => {

        if (contractService) {

            contractService.currentDay()
                .then(day => {
                    if (day>365) return setOddDay(null);
                    contractService.globwhatDayIsItTodayals(day)
                        .then(res => {
                            setOddDay(!!(res % 2))
                        })
                        .catch(err => console.log(err))
                })
                .catch(err => console.log(err))
        }
    }, [contractService])

    return (
        <div className="ticker-box">
            {isOddDay !== null && <Ticker offset="80">
                {({ index }) => (
                    <>
                        <div key={index}>{isOddDay ? 'Refresh your page for the latest information. Today, everyone who participates in the auction in the first hour has an equal chance of winning the Jackpot lottery.' : 'Refresh your page for the latest information. Today, one chance to win the Jackpot lottery for every 1ETH you enter in the auction in the first hour.'}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                    </>
                )}
            </Ticker>}
        </div>
    );
}

export default TickerComponent;
