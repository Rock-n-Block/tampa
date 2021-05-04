import React from 'react';
import { Progress } from 'antd';

import { RowItemTooltip } from '../../components';

import './SummaryBets.scss'
import Spiner from '../../assets/img/oval-r.svg';

const SummaryBets = ({ isDarkTheme, currentDays, participation, totalReceive, totalEntry, averageRate, isLoading }) => {

    return (
        <div className="container s-bets" id="s-bets">
            {isLoading && <img src={Spiner} alt="" className="s-bets__spinner" />}
            <div className="s-bets__title">My summary deposits</div>
            <div className="container s-bets__content">
                <div className="s-bets__item s-bets__item-progress">
                    <Progress strokeColor={{ '0%': isDarkTheme ? '#53B9EA' : '#E16B6C', '100%': isDarkTheme ? '#53B9EA' : '#E16B6C' }} type="circle" percent={participation / currentDays * 100} format={() => `${participation}/${currentDays}`} width={57} />
                    <div className="s-bets__item-content">participation in auctions</div>
                </div>
                <div className="s-bets__item">
                    <div className="s-bets__item-head">
                        <RowItemTooltip tooltipText={totalReceive} parent="s-bets">+{totalReceive}</RowItemTooltip>
                    </div>
                    <div className="s-bets__item-content">Total Jackpot Received</div>
                </div>
                <div className="s-bets__item">
                    <div className="s-bets__item-head">
                        <RowItemTooltip tooltipText={totalEntry} parent="s-bets">+{totalEntry}</RowItemTooltip>
                    </div>
                    <div className="s-bets__item-content">total entry</div>
                </div>
                <div className="s-bets__item">
                    <div className="s-bets__item-head">
                        <RowItemTooltip tooltipText={averageRate} parent="s-bets">{averageRate}</RowItemTooltip>
                    </div>
                    <div className="s-bets__item-content">average rate eth \ Jackpot</div>
                </div>
            </div>
        </div>
    );
}

export default SummaryBets;
