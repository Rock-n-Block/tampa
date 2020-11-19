import React from 'react';
import classNames from 'classnames';
import { format, eachDayOfInterval } from 'date-fns';

import { RowItemTooltip } from '../../components';

import './ActiveStakes.scss'

import refreshImg from '../../assets/img/refresh.svg';
import refreshDarkImg from '../../assets/img/refresh-dark.svg';

const ActiveStakes = ({ isDarkTheme, activeStakes, handleRefreshActiveStakes, isRefreshingStates, handleWithdraw }) => {
    const navItems = ['My Active Stakes', 'My Ended Stakes']

    const [activeTab, setActiveTab] = React.useState(0)


    const dateFormat = (date) => {
        return format(new Date(date * 1000), 'dd.MM.Y')
    }

    const handleRefresh = () => {
        if (!isRefreshingStates) handleRefreshActiveStakes(!!!activeTab).then().catch()
    }

    const handlecChangeNav = (index) => {
        setActiveTab(index)

        if (!isRefreshingStates) handleRefreshActiveStakes(!!!index).then().catch()
    }

    const calcProgress = (start, end) => {
        const stakeDays = eachDayOfInterval({
            start: new Date(+start * 1000),
            end: new Date(+end * 1000)
        })

        const pastDays = eachDayOfInterval({
            start: new Date(+start * 1000),
            end: new Date()
        })

        return ((pastDays.length - 1) / (stakeDays.length - 1) * 100).toFixed(0)
    }

    return (
        <div className="container stakes" id="stakes">
            <div className={classNames('stakes__refresh', {
                'refreshing': isRefreshingStates
            })} onClick={handleRefresh}>
                {isDarkTheme ? <img src={refreshDarkImg} alt="" /> : <img src={refreshImg} alt="" />}
            </div>
            <div className="stakes__nav">
                {
                    navItems.map((item, index) => {
                        return <div key={index} onClick={() => handlecChangeNav(index)} className={classNames('stakes__nav-item', {
                            'active': activeTab === index
                        })}>{item}</div>
                    })
                }
            </div>
            <div className="stakes__row t-row t-row__head">
                <div className="stakes__row-head-item">Start</div>
                <div className="stakes__row-head-item">END</div>
                <div className="stakes__row-head-item">Progress</div>
                <div className="stakes__row-head-item">Staked</div>
                <div className="stakes__row-head-item">Shares</div>
                <div className="stakes__row-head-item">BonusDay Rewards</div>
                <div className="stakes__row-head-item">Dividends Rewards</div>
                <div className="stakes__row-head-item stakes__red">Interest</div>
                <div className="stakes__row-head-item">Current Value</div>
            </div>
            {activeStakes &&
                activeStakes.map((item, index) => {
                    return <div key={index} className="container stakes__row t-row t-row__content">
                        <div className="stakes__row-item">{dateFormat(+item.start)}</div>
                        <div className="stakes__row-item">{dateFormat(+item.end)}</div>
                        <div className="stakes__row-item">
                            {/* {(item.start / item.end * 100).toFixed(0)}% */}
                            {calcProgress(item.start, item.end)}%
                        </div>
                        <div className="stakes__row-item">{item.staked}</div>
                        <div className="stakes__row-item">
                            <RowItemTooltip tooltipText={item.shares} parent="stakes">{item.shares}</RowItemTooltip>
                        </div>
                        <div className="stakes__row-item">
                            <RowItemTooltip tooltipText={item.bonusday} parent="stakes">{item.bonusday}</RowItemTooltip>
                        </div>
                        <div className="stakes__row-item">
                            <RowItemTooltip tooltipText={item.dividents} parent="stakes">{item.dividents}</RowItemTooltip>
                        </div>
                        <div className="stakes__row-item stakes__red">
                            <RowItemTooltip tooltipText={item.interest} parent="stakes">{item.interest}</RowItemTooltip>
                        </div>
                        <div className="stakes__row-item">
                            <RowItemTooltip tooltipText={item.currentValue} parent="stakes">{item.currentValue}</RowItemTooltip>
                        </div>
                        <button onClick={() => handleWithdraw(+item.index, +item.stakeId)} className="stakes__btn btn btn--withdraw">withdraw</button>
                    </div>
                })
            }
        </div>
    );
}

export default ActiveStakes;
