
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
                        <div key={index}>{isOddDay ? 'Today, an even chance of winning in the lottery for everyone who entry the auction in first hour.' : 'Today, one chance for every 1 ETH to winning in the lottery for everyone, who entry the auction in first hour.'}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                    </>
                )}
            </Ticker>}
        </div>
    );
}

export default TickerComponent;
