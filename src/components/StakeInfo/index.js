import React from 'react';

import { RowItemTooltip } from '../../components';

import './StakeInfo.scss'

const StakeInfo = ({ totalStaked, totalShares, fromReferrs, totalDividents, totalTimeBonus, totalValueBonus }) => {
    return (
        <div className="container s-info">
            <div className="s-info__title">My active stakes summary info</div>
            <div className="container s-info__content" id="s-info__content">
                <div className="s-info__item">
                    <div className="s-info__item-head">{totalStaked}</div>
                    <div className="s-info__item-subhead">Total staked</div>
                </div>
                <div className="s-info__item">
                    <div className="s-info__item-head">
                        <RowItemTooltip tooltipText={totalShares} parent="s-info__content">{totalShares}</RowItemTooltip>
                    </div>
                    <div className="s-info__item-subhead">Total shares</div>
                </div>
                <div className="s-info__item">
                    <div className="s-info__item-head">{fromReferrs}</div>
                    <div className="s-info__item-subhead">From referrs</div>
                </div>
                <div className="s-info__item">
                    <div className="s-info__item-head">{totalDividents}</div>
                    <div className="s-info__item-subhead">Total dividends</div>
                </div>
                <div className="s-info__item">
                    <div className="s-info__item-head">
                        <RowItemTooltip tooltipText={totalTimeBonus} parent="s-info__content">{totalTimeBonus}</RowItemTooltip>
                    </div>
                    <div className="s-info__item-subhead">Total<br /> time bonus</div>
                </div>
                <div className="s-info__item">
                    <div className="s-info__item-head">
                        <RowItemTooltip tooltipText={totalValueBonus} parent="s-info__content">{totalValueBonus}</RowItemTooltip>
                    </div>
                    <div className="s-info__item-subhead">Total<br /> value bonus</div>
                </div>
            </div>
        </div>
    );
}

export default StakeInfo;
