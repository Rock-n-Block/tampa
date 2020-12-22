import React from 'react';
import { Popover, InputNumber } from 'antd';
import classNames from 'classnames';
import { format } from 'date-fns';
import { Pagination } from 'antd';

import { RowItemTooltip, AuctionRowLoading } from '../../components';
import {dateFormat} from "../../utils/prettifiers";

import './AuctionLobby.scss'

import refreshImg from '../../assets/img/refresh.svg';
import refreshDarkImg from '../../assets/img/refresh-dark.svg';
import ethImg from '../../assets/img/binance.svg';

export default class AuctionLobby extends React.PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            activeRow: null,
            auctionValue: ''
        }

        this.handlePopoverVisibleChange = this.handlePopoverVisibleChange.bind(this)
    }

    handlePopoverVisibleChange = (value, index) => {
        if (value) {
            this.setState({
                activeRow: index
            })
        } else {
            this.setState({
                activeRow: null
            })
        }
    }

    render() {
        return (
            <>
                <div className="container a-lobby" id="a-lobby">
                    <div className={classNames('a-lobby__refresh', {
                        'refreshing': this.props.isRefreshing
                    })} onClick={this.props.handleRefresh}>
                        {this.props.isDarkTheme ? <img src={refreshDarkImg} alt="" /> : <img src={refreshImg} alt="" />}
                    </div>
                    <div className="a-lobby__title">Auction lobby</div>
                    <div className="a-lobby__row t-row t-row__head">
                        <div className="a-lobby__row-head-item">Day</div>
                        <div className="a-lobby__row-head-item">Jackpot Pool</div>
                        <div className="a-lobby__row-head-item">BNB \ Jackpot</div>
                        <div className="a-lobby__row-head-item">Jackpot Received</div>
                        <div className="a-lobby__row-head-item">Your Entry</div>
                        <div className="a-lobby__row-head-item">Daily Entry</div>
                    </div>
                    {this.props.rows.length ?
                        this.props.rows.map((item, index) => {
                            return <div key={index} className={classNames('container a-lobby__row t-row t-row__content', {
                                'active': index === this.state.activeRow
                            })}>
                                <div className="a-lobby__row-item">{dateFormat(+item.day)}</div>
                                <div className="a-lobby__row-item">
                                    <RowItemTooltip tooltipText={item.pool} parent="a-lobby">{item.pool}</RowItemTooltip>
                                </div>
                                <div className="a-lobby__row-item">
                                    <RowItemTooltip tooltipText={item.eth} parent="a-lobby">{item.eth}</RowItemTooltip>
                                </div>
                                <div className="a-lobby__row-item">
                                    <RowItemTooltip tooltipText={item.received} parent="a-lobby">{item.received}</RowItemTooltip>
                                </div>
                                <div className="a-lobby__row-item">
                                    <RowItemTooltip tooltipText={item.yourEntry} parent="a-lobby">{item.yourEntry}</RowItemTooltip>
                                </div>
                                <div className="a-lobby__row-item">
                                    <RowItemTooltip tooltipText={item.dailyEntry} parent="a-lobby">{item.dailyEntry}</RowItemTooltip>
                                </div>
                                <div className="a-lobby__row-item">
                                    {item.state && <Popover
                                        getPopupContainer={() => document.getElementById(`a-lobby`)}
                                        onVisibleChange={(value) => this.handlePopoverVisibleChange(value, index)}
                                        placement="top"
                                        trigger="click"
                                        content={
                                            <div className="a-lobby__popover">
                                                <div className="a-lobby__popover-text">enter the auction:</div>
                                                <InputNumber value={this.state.auctionValue} onChange={value => this.setState({ auctionValue: value })} placeholder="0,0" type="number" className="a-lobby__popover-input" />
                                                <div className="a-lobby__popover-eth">
                                                    <img src={ethImg} alt="" />
                                                    <span>BNB</span>
                                                </div>
                                                <button onClick={() => { this.props.handleEnterAuction(this.state.auctionValue); this.setState({ auctionValue: '' }) }} className="a-lobby__popover-btn btn" disabled={!this.state.auctionValue || this.state.auctionValue <= 0}>send</button>
                                                <div className="a-lobby__popover-text">Your balance: {this.props.ethBalance} <span onClick={() => this.setState({ auctionValue: this.props.ethBalance })}>MAX</span></div>
                                            </div>
                                        } >
                                        <button className="a-lobby__btn btn btn--md">ENTER</button>
                                    </Popover>}
                                    {!item.state && item.status && <button className="a-lobby__btn a-lobby__btn--collect btn btn--md" onClick={() => this.props.handleExitAuction(item.countDay)}>COLLECT</button>}
                                    {!item.state && !item.status && <button className="a-lobby__btn btn btn--md" disabled>ENDED</button>}
                                </div>
                            </div>
                        }) : ''

                    }
                    {this.props.isRefreshing && <AuctionRowLoading />}
                </div>
                {this.props.pageCount > 1 && <div className="a-lobby__pages">
                    <Pagination current={this.props.currentPage} onChange={this.props.handleChangePage} total={this.props.pageCount * 10} />
                </div>}
            </>
        )
    }
}