import React from 'react';
import classNames from 'classnames';
import {Pagination} from "antd";

import {dateFormat} from "../../utils/prettifiers";

import './LotteryHistory.scss'

const LotteryHistory = ({ data, handleLotteryWithdraw, userAddress, pageCount, currentPage, handleChangePage }) => {

    return (
        <>
            <div className="container l-history">
                <div className="l-history__title">history</div>
                <div className="l-history__table">
                    <div className="l-history__row l-history__row-head">
                        <div className="l-history__row-item">data</div>
                        <div className="l-history__row-item">amount</div>
                        <div className="l-history__row-item">winner</div>
                    </div>
                    {data &&
                        data.map((item, index) => {
                            return <div key={index} className={classNames('container l-history__row l-history__row-content', {
                                'active': item.winner.toLowerCase() === userAddress.toLowerCase()
                            })}>
                                <div className="l-history__row-item">{dateFormat(+item.date)}</div>
                                <div className="l-history__row-item">{item.amount}</div>
                                <div className="l-history__row-item">
                                    {
                                        item.winner.toLowerCase() === userAddress.toLowerCase() ?
                                            <div className="l-history__win">
                                                <span>YOU WIN</span>
                                                {item.isWithdrawed ? <button onClick={() => handleLotteryWithdraw(item.day)} className="btn btn--withdraw l-history__win-btn">WITHDRAW</button> : ''}
                                            </div>
                                            : <div className="l-history__row-item-address">{item.winner}</div>
                                    }
                                </div>
                            </div>
                        })
                    }
                </div>
            </div>
            {pageCount > 1 &&
            <div className="a-lobby__pages">
                <Pagination current={currentPage} onChange={handleChangePage} total={pageCount * 10} />
            </div>
            }
        </>
    );
}

export default LotteryHistory;
