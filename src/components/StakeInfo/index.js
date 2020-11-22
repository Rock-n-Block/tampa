import React from 'react';
import classNames from 'classnames';

import { RowItemTooltip } from '../../components';

import './StakeInfo.scss'

const StakeInfo = ({ totalStaked, totalShares, totalInterests, totalDividents, totalTimeBonus, totalValueBonus, isActiveStakes, totalBonusShares, totalPaidAmount }) => {
    return (
        <div className="container s-info">
            <div className="s-info__title">My {isActiveStakes ? 'active' : 'ended'} stakes summary info</div>
            <div className={classNames("container s-info__content", {
                's-info__content--ended': !isActiveStakes
            })} id="s-info__content">
                <div className="s-info__item">
                    <div className="s-info__item-head">
                        <RowItemTooltip tooltipText={totalStaked} parent="s-info__content">{totalStaked}</RowItemTooltip>
                    </div>
                    <div className="s-info__item-subhead">Total staked</div>
                </div>
                <div className="s-info__item">
                    <div className="s-info__item-head">
                        <RowItemTooltip tooltipText={isActiveStakes ? totalShares : totalPaidAmount} parent="s-info__content">{isActiveStakes ? totalShares : totalPaidAmount}</RowItemTooltip>
                    </div>
                    <div className="s-info__item-subhead">{isActiveStakes ? 'Total shares' : 'total paid amount'}</div>
                </div>
                <div className="s-info__item">
                    <div className="s-info__item-head">
                        <RowItemTooltip tooltipText={totalDividents} parent="s-info__content">{totalDividents}</RowItemTooltip>
                    </div>
                    <div className="s-info__item-subhead">Total eth dividends</div>
                </div>
                <div className="s-info__item">
                    <div className="s-info__item-head">
                        <RowItemTooltip tooltipText={isActiveStakes ? totalInterests : totalBonusShares} parent="s-info__content">{isActiveStakes ? totalInterests : totalBonusShares}</RowItemTooltip>
                    </div>
                    <div className="s-info__item-subhead">{isActiveStakes ? 'Total interest' : 'total bonus shares'}</div>
                </div>
                {isActiveStakes && <div className="s-info__item">
                    <div className="s-info__item-head">
                        <RowItemTooltip tooltipText={totalTimeBonus} parent="s-info__content">{totalTimeBonus}</RowItemTooltip>
                    </div>
                    <div className="s-info__item-subhead">Total<br /> time bonus</div>
                </div>}
                {isActiveStakes && <div className="s-info__item">
                    <div className="s-info__item-head">
                        <RowItemTooltip tooltipText={totalValueBonus} parent="s-info__content">{totalValueBonus}</RowItemTooltip>
                    </div>
                    <div className="s-info__item-subhead">Total<br /> value bonus</div>
                </div>}
            </div>
        </div>
    );
}

export default StakeInfo;
