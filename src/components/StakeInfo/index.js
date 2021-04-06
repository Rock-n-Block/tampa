import React from 'react';
import classNames from 'classnames';

import { RowItemTooltip, QuestionTooltip } from '../../components';
import { formatNumberWithCommas } from '../../utils/prettifiers';

import './StakeInfo.scss'

const StakeInfo = ({ totalStaked, totalShares, totalInterests, totalDividents, isActiveStakes, totalBonusShares, totalPaidAmount, isDarkTheme }) => {
    return (
        <div className="container s-info">
            <div className="s-info__title">My {isActiveStakes ? 'active' : 'ended'} stakes summary info</div>
            <div className={classNames("container s-info__content", {
                's-info__content--ended': !isActiveStakes
            })} id="s-info__content">
                <div className="s-info__item">
                    <div className="s-info__item-head">
                        <RowItemTooltip
                        tooltipText={formatNumberWithCommas(totalStaked)}
                        parent="s-info__content"
                        >
                            {formatNumberWithCommas(totalStaked)}
                        </RowItemTooltip>
                    </div>
                    <div className="s-info__item-subhead">Total staked</div>
                </div>
                <div className="s-info__item">
                    <div className="s-info__item-head">
                        <RowItemTooltip
                        tooltipText={
                            isActiveStakes ?
                            formatNumberWithCommas(totalShares) :
                            formatNumberWithCommas(totalPaidAmount)
                        }
                        parent="s-info__content"
                        >
                            {
                                isActiveStakes ?
                                formatNumberWithCommas(totalShares) :
                                formatNumberWithCommas(totalPaidAmount)
                            }
                        </RowItemTooltip>
                    </div>
                    <div className="s-info__item-subhead">{isActiveStakes ? 'Total shares' : 'total paid amount'}</div>
                </div>
                <div className="s-info__item">
                    <div className="s-info__item-head">
                        <RowItemTooltip tooltipText={totalDividents} parent="s-info__content">{totalDividents}</RowItemTooltip>
                    </div>
                    <div className="s-info__item-subhead">Total BNB dividends
                            <QuestionTooltip isDarkTheme={isDarkTheme} parent="s-info__content" tooltipText="One of the benefits of Staking Jackpot tokens is the BNB dividends you receive. At the end of each day, an BNB dividends pool will be calculated and allocated to all the open stakes based on their stake amount, stake length, and stake start date.<br><br> The BNB dividends pool comes from the total daily entry of the auction lobby. The only way to receive BNB Dividends is to stake your Jackpot tokens.<br><br> Not only will you get BNB dividends when you stake, but you will also be rewarded with more Jackpot tokens every day.  You can collect both the BNB and Jackpot rewards without penalty at the end of your stake, all you have to pay is your BNB gas fee.<br><br> After you exit your stakes you will receive your BNB dividends." />
                    </div>
                </div>
                <div className="s-info__item">
                    <div className="s-info__item-head">
                        <RowItemTooltip tooltipText={isActiveStakes ? totalInterests : totalBonusShares} parent="s-info__content">{isActiveStakes ? totalInterests : totalBonusShares}</RowItemTooltip>
                    </div>
                    <div className="s-info__item-subhead">{isActiveStakes ? 'Total interest' : 'total bonus shares'}
                        {isActiveStakes &&
                            <QuestionTooltip isDarkTheme={isDarkTheme} parent="s-info__content" tooltipText={`Please note that in addition to your BNB dividends, Jackpot supply has a 12% inflation per year. This daily pool will be distributed between all the Stakers as their stake interest in Jackpot. Although Jackpot has this "inflation", it is possible that Jackpot tokens overall have a deflationary outcome because there are various deflationary aspects that will be put in place in regards to the exchange of the Jackpot tokens and the use cases.  The goal is that there will be fewer and fewer Jackpot tokens every year, while Jackpot stakers continue to earn more Jackpot tokens over time.  This design is meant to keep the price of Jackpot going up, and the overall supply going down.`} />
                        }
                    </div>
                </div>
                {/* {isActiveStakes && <div className="s-info__item">
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
                </div>} */}
            </div>
        </div>
    );
}

export default StakeInfo;
