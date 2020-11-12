import React from 'react';
import { Popover, InputNumber } from 'antd';
import classNames from 'classnames';
import { format } from 'date-fns';

import './AuctionLobby.scss'

import ethImg from '../../assets/img/eth.svg';

export default class AuctionLobby extends React.PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            activeRow: null,
            auctionValue: ''
        }

        this.handlePopoverVisibleChange = this.handlePopoverVisibleChange.bind(this)
        this.dateFormat = this.dateFormat.bind(this)
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

    dateFormat = (date) => {
        return format(new Date(date * 1000), 'dd.MM.Y')
    }

    render() {
        return(

        <div className="container a-lobby" id="a-lobby">
        <div className="a-lobby__title">Auction lobby</div>
        <div className="a-lobby__row t-row t-row__head">
            <div className="a-lobby__row-head-item">Day</div>
            <div className="a-lobby__row-head-item">Tampa Pool</div>
            <div className="a-lobby__row-head-item">Tampa\ETH</div>
            <div className="a-lobby__row-head-item">State</div>
            <div className="a-lobby__row-head-item">Tampa Received</div>
            <div className="a-lobby__row-head-item">Your Entry</div>
            <div className="a-lobby__row-head-item">Daily Entry</div>
            <div className="a-lobby__row-head-item a-lobby__red">Status</div>
        </div>
        {this.props.rows &&
            this.props.rows.map((item, index) => {
                return <div key={index} className={classNames('container a-lobby__row t-row t-row__content', {
                    'active': index === this.state.activeRow
                })}>
                    <div className="a-lobby__row-item">{this.dateFormat(+item.day)}</div>
                    <div className="a-lobby__row-item">{item.pool}</div>
                    <div className="a-lobby__row-item">{item.eth}</div>
                    <div className="a-lobby__row-item">{item.state ? 'Open' : 'Close'}</div>
                    <div className="a-lobby__row-item">{item.received}</div>
                    <div className="a-lobby__row-item">{item.yourEntry}</div>
                    <div className="a-lobby__row-item">{item.dailyEntry}</div>
                    <div className="a-lobby__row-item a-lobby__red">{item.status ? 'Active' : 'Closed'}</div>
                    <div className="a-lobby__row-item">
                        <Popover
                            getPopupContainer={() => document.getElementById(`a-lobby`)}
                            onVisibleChange={(value) => this.handlePopoverVisibleChange(value, index)}
                            placement="bottom"
                            trigger="click"
                            content={
                                <div className="a-lobby__popover">
                                    <div className="a-lobby__popover-text">enter the auction:</div>
                                    <InputNumber value={this.state.auctionValue} onChange={value => this.setState({auctionValue: value})} placeholder="0,0" type="number" className="a-lobby__popover-input" />
                                    <div className="a-lobby__popover-eth">
                                        <img src={ethImg} alt="" />
                                        <span>ETH</span>
                                    </div>
                                    <button onClick={() => this.props.handleEnterAuction(this.state.auctionValue)} className="a-lobby__popover-btn btn">BID</button>
                                    <div className="a-lobby__popover-text">Your balance: {this.props.ethBalance} <span onClick={() => this.setState({auctionValue: 0})}>MAX</span></div>
                                </div>
                            } >
                            <button className="a-lobby__btn btn btn--md">ENTER</button>
                        </Popover>
                    </div>
                </div>
            })
        }
    </div>
        )
    }
}