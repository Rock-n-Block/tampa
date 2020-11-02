import React from 'react';
import classNames from 'classnames';

import './ActiveStakes.scss'

import refreshImg from '../../assets/img/refresh.svg';
import refreshDarkImg from '../../assets/img/refresh-dark.svg';

const ActiveStakes = ({ isDarkTheme }) => {
    const navItems = ['My Active Stakes', 'My Ended Stakes']

    const [activeTab, setActiveTab] = React.useState(0)

    const data = [
        {
            start: '20.10.2020',
            end: '20.10.2020',
            progress: '20.10.2020',
            staked: '1,000',
            shares: '1,000',
            bonusday: '1,000',
            dividents: '1,000',
            interest: '1,000',
            currentValue: '1,000'
        },
        {
            start: '20.10.2020',
            end: '20.10.2020',
            progress: '20.10.2020',
            staked: '1,000',
            shares: '1,000',
            bonusday: '1,000',
            dividents: '1,000',
            interest: '1,000',
            currentValue: '1,000'
        }
    ]

    return (
        <div className="container stakes">
            {isDarkTheme ? <img src={refreshDarkImg} alt="" className="stakes__refresh" /> : <img src={refreshImg} alt="" className="stakes__refresh" />}
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
            {
                data.map((item, index) => {
                    return <div key={index} className="container stakes__row t-row t-row__content">
                        <div className="stakes__row-item">{item.start}</div>
                        <div className="stakes__row-item">{item.end}</div>
                        <div className="stakes__row-item">{item.progress}</div>
                        <div className="stakes__row-item">{item.staked}</div>
                        <div className="stakes__row-item">{item.shares}</div>
                        <div className="stakes__row-item">{item.bonusday}</div>
                        <div className="stakes__row-item">{item.dividents}</div>
                        <div className="stakes__row-item stakes__red">{item.interest}</div>
                        <div className="stakes__row-item">{item.currentValue}</div>
                    </div>
                })
            }
        </div>
    );
}

export default ActiveStakes;
