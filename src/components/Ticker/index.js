
import React from 'react';
import Ticker from 'react-ticker'
import moment from 'moment';

import './Ticker.scss'

const TickerComponent = ({ contractService }) => {
    const [isOddDay, setOddDay] = React.useState(false)

    React.useEffect(() => {
        // setOddDay(!!(moment.utc().day() % 2))

        if (contractService) {

            contractService.currentDay()
                .then(day => {
                    contractService.globwhatDayIsItTodayals(day)
                        .then(res => {
                            setOddDay(!!!(res % 2))
                        })
                        .catch(err => console.log(err))
                })
                .catch(err => console.log(err))
        }
    }, [contractService])

    return (
        <div className="ticker-box">
            <Ticker offset="80">
                {({ index }) => (
                    <>
                        <div key={index}>{isOddDay ? 'Today one chance for every who entry the auction.' : 'Today one chance per every 1 ETH in the entry in the auction.'}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                    </>
                )}
            </Ticker>
        </div>
    );
}

export default TickerComponent;
