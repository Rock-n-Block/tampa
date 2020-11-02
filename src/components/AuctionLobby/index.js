import React from 'react';
import { Popover, InputNumber } from 'antd';
import classNames from 'classnames';

import './AuctionLobby.scss'

import ethImg from '../../assets/img/eth.svg';

const AuctionLobby = () => {
    const [activeRow, setActiveRow] = React.useState(null);
    const [auctionValue, setAuctionValue] = React.useState('');

    const data = [
        {
            day: '20.10.2020',
            pool: '100,000',
            eth: '100,000',
            state: 'Open',
            received: '100,000',
            yourEntry: '100,000',
            dailyEntry: '20.10.2020',
            status: 'Active'
        },
        {
            day: '20.10.2020',
            pool: '100,000',
            eth: '100,000',
            state: 'Open',
            received: '100,000',
            yourEntry: '100,000',
            dailyEntry: '20.10.2020',
            status: 'Active'
        }
    ]

    const handlePopoverVisibleChange = (value, index) => {
        if (value) {
            setActiveRow(index)
        } else {
            setActiveRow(null)
        }
    }

    return (
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
            {
                data.map((item, index) => {
                    return <div key={index} className={classNames('container a-lobby__row t-row t-row__content', {
                        'active': index === activeRow
                    })}>
                        <div className="a-lobby__row-item">{item.day}</div>
                        <div className="a-lobby__row-item">{item.pool}</div>
                        <div className="a-lobby__row-item">{item.eth}</div>
                        <div className="a-lobby__row-item">{item.state}</div>
                        <div className="a-lobby__row-item">{item.received}</div>
                        <div className="a-lobby__row-item">{item.yourEntry}</div>
                        <div className="a-lobby__row-item">{item.dailyEntry}</div>
                        <div className="a-lobby__row-item a-lobby__red">{item.status}</div>
                        <div className="a-lobby__row-item">
                            <Popover
                                getPopupContainer={() => document.getElementById(`a-lobby`)}
                                onVisibleChange={(value) => handlePopoverVisibleChange(value, index)}
                                placement="bottom"
                                trigger="click"
                                content={
                                    <div className="a-lobby__popover">
                                        <div className="a-lobby__popover-text">enter the auction:</div>
                                        <InputNumber value={auctionValue} placeholder="0,0" type="number" className="a-lobby__popover-input" />
                                        <div className="a-lobby__popover-eth">
                                            <img src={ethImg} alt="" />
                                            <span>ETH</span>
                                        </div>
                                        <button className="a-lobby__popover-btn btn">BID</button>
                                        <div className="a-lobby__popover-text">Your balance: 495829589458 <span>MAX</span></div>
                                    </div>
                                } >
                                <button className="a-lobby__btn btn btn--md">ENTER</button>
                            </Popover>
                        </div>
                    </div>
                })
            }
        </div>
    );
}

export default AuctionLobby;
