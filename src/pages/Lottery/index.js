import React from 'react';

import { Lottery, LotteryHistory } from '../../components';

import './Lottery.scss'

const LotteryPage = () => {
    return (
        <div className="p-lottery">
            <div className="row row--md">
                <Lottery />
                <LotteryHistory />
            </div>
        </div>
    );
}

export default LotteryPage;
