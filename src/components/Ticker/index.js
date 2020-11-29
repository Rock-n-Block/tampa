
import React from 'react';
import Ticker from 'react-ticker'

import './Ticker.scss'

const TickerComponent = ({ contractService }) => {
    const [isOddDay, setOddDay] = React.useState(null)

    React.useEffect(() => {

        if (contractService) {

            contractService.currentDay()
                .then(day => {
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
                        <div key={index}>{isOddDay ? 'Today one chance for every who entry the auction.' : 'Today one chance per every 1 ETH in the entry in the auction.'}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                    </>
                )}
            </Ticker>}
        </div>
    );
}

export default TickerComponent;
