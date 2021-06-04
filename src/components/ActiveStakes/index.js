import React, { memo } from 'react';
import classNames from 'classnames';
import { Modal } from 'antd';
import { format } from 'date-fns';
import moment from 'moment';

import { RowItemTooltip, AuctionRowLoading, QuestionTooltip } from '../../components';
import { dateFormat, formatNumberWithCommas } from "../../utils/prettifiers";

import './ActiveStakes.scss'

import refreshImg from '../../assets/img/refresh.svg';
import refreshDarkImg from '../../assets/img/refresh-dark.svg';

export default memo(({ isDarkTheme, activeStakes, handleRefreshActiveStakes, isRefreshingStates, handleWithdraw, startDay, contractService }) => {
    const navItems = ['My Active Stakes', 'My Ended Stakes']

    const [activeTab, setActiveTab] = React.useState(0)
    const [activeStake, setActiveStake] = React.useState({})
    const [isVisibleModal, setVisibleModal] = React.useState(false)
    const [isEarlyUnstake, setEarlyUnstake] = React.useState(null)

    const handleRefresh = () => {
        if (!isRefreshingStates) handleRefreshActiveStakes(!!!activeTab)
    }

    const handlecChangeNav = (index) => {
        setActiveTab(index)

        if (!isRefreshingStates) handleRefreshActiveStakes(!!!index)
    }

    const onWithdrawClick = async (stake, index, stakeId, end) => {
        const currentDayUnix = await contractService.getDayUnixTime(startDay)
        const endDay = moment.utc(end * 1000)

        // const diffDays = moment.utc(+currentDayUnix * 1000).diff(endDay, 'days');
        const diffDays = moment.utc().diff(endDay, 'minutes')

        console.log(diffDays, 'diffDays')

        if (diffDays < 0) {
            setEarlyUnstake(true)
        } else if (diffDays >= 14) {
            // } else if (diffDays >= 10) {
            setEarlyUnstake(false)
        }

        setActiveStake({
            stake,
            index,
            stakeId
        })

        const seconds = moment.utc(stake.start * 1000).diff(moment.utc(+currentDayUnix * 1000), 'seconds')

        console.log(seconds, 'seconds')
        // if ((diffDays < 0 || diffDays >= 14) && seconds <= 0) {
        if ((diffDays < 0 || diffDays >= 10)) {
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
                    <QuestionTooltip isDarkTheme={isDarkTheme} parent="stakes" tooltipText={`There are penalties for withdrawing stakes early.  If your stake has not begun yet you may withdraw with no penalty.  A stake done today will start at 01:00 UTC tomorrow.  At that point early withdrawal penalties will occur, the penalties lesson over time, and the penalties are distributed to other stakers who do not withdraw early.  Formulas for penalties can be found on the whitepaper at <a href="https://jackpotstaking.com/" target="_blank">jackpotstaking.com</a> (cut and paste into your browser if hyperlink does not work)`} />
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

                <div className="stakes__list">
                    {activeStakes.length ?
                        activeStakes.map((item, index) => {
                            return <div key={index} className={classNames("container stakes__row t-row t-row__content", {
                                'stakes__row--ended': item.isEnded
                            })}>
                                <div className="stakes__row-item" data-name="Start">{dateFormat(+item.start)}</div>
                                <div className="stakes__row-item" data-name="End">{dateFormat(+item.end)}</div>
                                {!item.isEnded &&
                                    <div className="stakes__row-item" data-name="Progress">
                                        {item.progress}%
                                </div>
                                }
                                <div className="stakes__row-item" data-name="Staked">
                                    <RowItemTooltip tooltipText={formatNumberWithCommas(item.staked)} parent="stakes">
                                        {formatNumberWithCommas(item.staked)}
                                    </RowItemTooltip>
                                </div>
                                <div className="stakes__row-item" data-name="Shares">
                                    <RowItemTooltip tooltipText={formatNumberWithCommas(item.shares)} parent="stakes">
                                        {formatNumberWithCommas(item.shares)}
                                    </RowItemTooltip>
                                </div>
                                <div className="stakes__row-item" data-name="BonusDay Rewards">
                                    <RowItemTooltip tooltipText={item.bonusday} parent="stakes">{item.bonusday}</RowItemTooltip>
                                </div>
                                <div className="stakes__row-item" data-name="eth Dividends Rewards">
                                    <RowItemTooltip tooltipText={item.dividents} parent="stakes">{item.dividents}</RowItemTooltip>
                                </div>
                                <div className="stakes__row-item stakes__red" data-name="Interest">
                                    <RowItemTooltip tooltipText={formatNumberWithCommas(item.interest)} parent="stakes">
                                        {formatNumberWithCommas(item.interest)}
                                    </RowItemTooltip>
                                </div>
                                <div className="stakes__row-item" data-name={!activeTab ? 'Current Value' : 'paid amount'}>
                                    <RowItemTooltip
                                        tooltipText={
                                            !activeTab ?
                                                formatNumberWithCommas(item.currentValue) :
                                                formatNumberWithCommas(item.paidAmount)
                                        }
                                        parent="stakes"
                                    >
                                        {!activeTab ?
                                            formatNumberWithCommas(item.currentValue) :
                                            formatNumberWithCommas(item.paidAmount)
                                        }
                                    </RowItemTooltip>
                                </div>
                                {!item.isEnded && <button onClick={() => onWithdrawClick(item, +item.index, +item.stakeId, +item.end)} className="stakes__btn btn btn--withdraw">withdraw</button>}
                            </div>
                        }) : ''
                    }
                </div>
                {isRefreshingStates && <AuctionRowLoading />}
            </div>
            <Modal
                visible={isVisibleModal}
                onOk={() => onWithdrawClick(activeStake)}
                onCancel={() => setVisibleModal(false)}
                footer={false}
                closable={false}
                className={isDarkTheme && 'darktheme'}
                centered={true}
                width={510}
            >
                <div className="stakes__modal">
                    <div className="stakes__modal-title">Attention!</div>
                    {activeStake.stake &&
                        <div className="stakes__modal-text">
                            {isEarlyUnstake ? 'Early unstake!' : 'Late unstake!'}
                            {` You will get ${activeStake.stake.stakeReturn} J, ${activeStake.stake.penalti} j will be penalized!`}
                            <br></br>
                            {`Your dividends in eth ${activeStake.stake.penaltiDividents}.`}
                        </div>
                    }
                    <div className="stakes__modal-btns">
                        <button className="stakes__modal-btn stakes__modal-btn--cancel btn btn--withdraw" onClick={() => setVisibleModal(false)}>CLOSE</button>
                        <button className="stakes__modal-btn btn btn--withdraw" onClick={() => { handleWithdraw(activeStake.index, activeStake.stakeId); setVisibleModal(false) }}>OK</button>
                    </div>
                </div>
            </Modal>
        </>
    );
})