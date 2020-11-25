import React, { memo } from 'react';
import classNames from 'classnames';
import { Modal } from 'antd';
import { format } from 'date-fns';
import moment from 'moment';

import { RowItemTooltip, AuctionRowLoading, QuestionTooltip } from '../../components';

import './ActiveStakes.scss'

import refreshImg from '../../assets/img/refresh.svg';
import refreshDarkImg from '../../assets/img/refresh-dark.svg';

export default memo(({ isDarkTheme, activeStakes, handleRefreshActiveStakes, isRefreshingStates, handleWithdraw }) => {
    const navItems = ['My Active Stakes', 'My Ended Stakes']

    const [activeTab, setActiveTab] = React.useState(0)
    const [activeStake, setActiveStake] = React.useState({})
    const [isVisibleModal, setVisibleModal] = React.useState(false)
    const [isEarlyUnstake, setEarlyUnstake] = React.useState(null)

    const dateFormat = (date) => {
        return format(new Date(date * 1000), 'dd.MM.Y')
    }

    const handleRefresh = () => {
        if (!isRefreshingStates) handleRefreshActiveStakes(!!!activeTab)
    }

    const handlecChangeNav = (index) => {
        setActiveTab(index)

        if (!isRefreshingStates) handleRefreshActiveStakes(!!!index)
    }

    const onWithdrawClick = (stake, index, stakeId, end) => {
        const endDay = moment.utc(end * 1000)

        // const diffDays = moment.utc().diff(endDay, 'days')
        const diffDays = moment.utc().diff(endDay, 'minutes')

        console.log(diffDays, 'diffDays')

        if (diffDays < 0) {
            setEarlyUnstake(true)
            // } else if (diffDays >= 14) {
        } else if (diffDays >= 10) {
            setEarlyUnstake(false)
        }

        setActiveStake({
            stake,
            index,
            stakeId
        })

        // if (diffDays < 0 || diffDays >= 14) {
        if (diffDays < 0 || diffDays >= 10) {
            setVisibleModal(true)
        } else {
            handleWithdraw(index, stakeId)
        }
    }


    return (
        <>
            <div className="container stakes" id="stakes">
                <div className={classNames('stakes__refresh', {
                    'refreshing': isRefreshingStates
                })} onClick={handleRefresh}>
                    {isDarkTheme ? <img src={refreshDarkImg} alt="" /> : <img src={refreshImg} alt="" />}
                </div>
                <div className="stakes__wrapper">
                    <div className="stakes__nav">
                        {
                            navItems.map((item, index) => {
                                return <div key={index} onClick={() => handlecChangeNav(index)} className={classNames('stakes__nav-item', {
                                    'active': activeTab === index
                                })}>{item}</div>
                            })
                        }
                    </div>
                    <QuestionTooltip isDarkTheme={isDarkTheme} parent="stakes" tooltipText="You are subject up to a 100% penalty depending on your stake terms." />
                </div>
                <div className={classNames("stakes__row t-row t-row__head", {
                    'stakes__row--ended': activeStakes[0] && activeStakes[0].isEnded
                })}>
                    <div className="stakes__row-head-item">Start</div>
                    <div className="stakes__row-head-item">END</div>
                    {!activeTab && <div className="stakes__row-head-item">Progress</div>}
                    <div className="stakes__row-head-item">Staked</div>
                    <div className="stakes__row-head-item">Shares</div>
                    <div className="stakes__row-head-item">BonusDay Rewards</div>
                    <div className="stakes__row-head-item">eth Dividends Rewards</div>
                    <div className="stakes__row-head-item stakes__red">Interest</div>
                    <div className="stakes__row-head-item">{!activeTab ? 'Current Value' : 'paid amount'}</div>
                </div>
                {activeStakes.length ?
                    activeStakes.map((item, index) => {
                        return <div key={index} className={classNames("container stakes__row t-row t-row__content", {
                            'stakes__row--ended': item.isEnded
                        })}>
                            <div className="stakes__row-item">{dateFormat(+item.start)}</div>
                            <div className="stakes__row-item">{dateFormat(+item.end)}</div>
                            {!item.isEnded && <div className="stakes__row-item">
                                {item.progress}%
                        </div>}
                            <div className="stakes__row-item">
                                <RowItemTooltip tooltipText={item.staked} parent="stakes">{item.staked}</RowItemTooltip>
                            </div>
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
                                <RowItemTooltip tooltipText={!activeTab ? item.currentValue : item.paidAmount} parent="stakes">{!activeTab ? item.currentValue : item.paidAmount}</RowItemTooltip>
                            </div>
                            {!item.isEnded && <button onClick={() => onWithdrawClick(item, +item.index, +item.stakeId, +item.end)} className="stakes__btn btn btn--withdraw">withdraw</button>}
                        </div>
                    }) : ''

                }
                {isRefreshingStates && <AuctionRowLoading />}
            </div>
            <Modal
                visible={isVisibleModal}
                onOk={() => onWithdrawClick(activeStake)}
                onCancel={() => setVisibleModal(false)}
                footer={false}
                closable={false}
                centered={true}
                width={510}
            >
                <div className="stakes__modal">
                    <div className="stakes__modal-title">Attention!</div>
                    {activeStake.stake && <div className="stakes__modal-text">
                        {/* {isEarlyUnstake ? 'Early unstake! You will get 931,33 ETH, 401,31 EHT will be peranized!' : 'Later unstake! You will get 931.33 J, 401.31 J will be penalized!'} */}
                        {`tokens return: ${activeStake.stake.stakeReturn}, penalti: ${activeStake.stake.penalti}, dividents: ${activeStake.stake.penaltiDividents}`}
                        {isEarlyUnstake ? ' ,early' : 'later'}
                    </div>}
                    <div className="stakes__modal-btns">
                        <button className="stakes__modal-btn stakes__modal-btn--cancel btn btn--withdraw" onClick={() => setVisibleModal(false)}>CLOSE</button>
                        <button className="stakes__modal-btn btn btn--withdraw" onClick={() => { handleWithdraw(activeStake.index, activeStake.stakeId); setVisibleModal(false) }}>OK</button>
                    </div>
                </div>
            </Modal>
        </>
    );
})