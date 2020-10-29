import React from 'react';

import './LotteryHistory.scss'

const LotteryHistory = ({ data = [
    {
        date: '20.10.2020',
        amount: '100,00',
        winner: '0x50483798978979796306'
    },
    {
        date: '20.10.2020',
        amount: '100,00',
        winner: '0x50483798978979796306'
    }
] }) => {
    return (
        <div className="container l-history">
            <div className="l-history__title">history</div>
            <div className="l-history__table">
                <div className="l-history__row l-history__row-head">
                    <div className="l-history__row-item">data</div>
                    <div className="l-history__row-item">amount</div>
                    <div className="l-history__row-item">winner</div>
                </div>
                {
                    data.map((item, index) => {
                        return <div key={index} className="container l-history__row">
                            <div className="l-history__row-item">{item.date}</div>
                            <div className="l-history__row-item">{item.amount}</div>
                            <div className="l-history__row-item">{item.winner}</div>
                        </div>
                    })
                }
            </div>
        </div>
    );
}

export default LotteryHistory;
