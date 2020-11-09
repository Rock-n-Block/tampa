import React from 'react';
import classNames from 'classnames';
import { format, parseISO } from 'date-fns';

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
        if (!isRefreshingStates) handleRefreshActiveStakes().then().catch()
    }

    return (
        <div className="container stakes">
            <div className={classNames('stakes__refresh', {
                'refreshing': isRefreshingStates
            })} onClick={handleRefresh}>
                {isDarkTheme ? <img src={refreshDarkImg} alt="" /> : <img src={refreshImg} alt="" />}
            </div>
            <div className="stakes__nav">
                {
                    navItems.map((item, index) => {
                        return <div key={index} onClick={() => setActiveTab(index)} className={classNames('stakes__nav-item', {
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
                        <div className="stakes__row-item">{item.progress}</div>
                        <div className="stakes__row-item">{item.staked}</div>
                        <div className="stakes__row-item">{item.shares}</div>
                        <div className="stakes__row-item">{item.bonusday}</div>
                        <div className="stakes__row-item">{item.dividents}</div>
                        <div className="stakes__row-item stakes__red">{item.interest}</div>
                        <div className="stakes__row-item">{item.currentValue}</div>
                        <button onClick={() => handleWithdraw(+item.index, +item.stakeId)} className="stakes__btn btn btn--withdraw">withdraw</button>
                    </div>
                })
            }
        </div>
    );
}

export default ActiveStakes;
