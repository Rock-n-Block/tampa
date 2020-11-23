
import React from 'react';
import Ticker from 'react-ticker'
import moment from 'moment';

import './Ticker.scss'

const TickerComponent = () => {
    const [isOddDay, setOddDay] = React.useState(false)

    React.useEffect(() => {

        console.log(moment().day(), 'moment().day()')
        setOddDay(!!(moment().day() % 2))
    }, [])

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
