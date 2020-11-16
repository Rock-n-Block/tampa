import React from 'react';
import Ticker from 'react-ticker'

import './Ticker.scss'

const TickerComponent = ({isDarkTheme}) => {

    return (
        <div className="ticker-box">
            <Ticker offset="60">
                {({ index }) => (
                    <>
                        <div key={index}>Text left for Claiming ETH&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                    </>
                )}
            </Ticker>
        </div>
    );
}

export default TickerComponent;
