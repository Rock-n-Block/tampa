import React from 'react';
import { Progress } from 'antd';

import './SummaryBets.scss'

const SummaryBets = ({ isDarkTheme }) => {
    const [participation, setParticipation] = React.useState(8)

    return (
        <div className="container s-bets">
            <div className="s-bets__title">My summary bets</div>
            <div className="container s-bets__content">
                <div className="s-bets__item s-bets__item-progress">
                    <Progress strokeColor={{ from: isDarkTheme ? '#53B9EA' : '#E16B6C', to: isDarkTheme ? '#53B9EA' : '#E16B6C' }} type="circle" percent={participation / 13 * 100} format={() => `${participation}/13`} width={57} />
                    <span>participation in auctions</span>
                </div>
                <div className="s-bets__item">
                    <div className="s-bets__item-head">+ 5.000</div>
                    <div className="s-bets__item-content">total receive</div>
                </div>
                <div className="s-bets__item">
                    <div className="s-bets__item-head">+2.445</div>
                    <div className="s-bets__item-content">total entry</div>
                </div>
                <div className="s-bets__item">
                    <div className="s-bets__item-head">0.000</div>
                    <div className="s-bets__item-content">average rate tampa \ ETH</div>
                </div>
            </div>
        </div>
    );
}

export default SummaryBets;
