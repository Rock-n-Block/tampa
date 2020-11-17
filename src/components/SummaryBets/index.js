import React from 'react';
import { Progress } from 'antd';

import { RowItemTooltip } from '../../components';

import './SummaryBets.scss'

const SummaryBets = ({ isDarkTheme, currentDays, participation, totalReceive, totalEntry, averageRate }) => {

    return (
        <div className="container s-bets" id="s-bets">
            <div className="s-bets__title">My summary bets</div>
            <div className="container s-bets__content">
                <div className="s-bets__item s-bets__item-progress">
                    <Progress strokeColor={{ '0%': isDarkTheme ? '#53B9EA' : '#E16B6C', '100%': isDarkTheme ? '#53B9EA' : '#E16B6C' }} type="circle" percent={participation / currentDays * 100} format={() => `${participation}/${currentDays}`} width={57} />
                    <span>participation in auctions</span>
                </div>
                <div className="s-bets__item">
                    <div className="s-bets__item-head">
                        <RowItemTooltip tooltipText={totalReceive} parent="s-bets">+{totalReceive}</RowItemTooltip>
                    </div>
                    <div className="s-bets__item-content">total receive</div>
                </div>
                <div className="s-bets__item">
                    <div className="s-bets__item-head">
                        +{totalEntry}
                    </div>
                    <div className="s-bets__item-content">total entry</div>
                </div>
                <div className="s-bets__item">
                    <div className="s-bets__item-head">
                        <RowItemTooltip tooltipText={averageRate} parent="s-bets">{averageRate}</RowItemTooltip>
                    </div>
                    <div className="s-bets__item-content">average rate tampa \ ETH</div>
                </div>
            </div>
        </div>
    );
}

export default SummaryBets;
