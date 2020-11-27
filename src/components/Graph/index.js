import React from 'react';
import {
    ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import { QuestionTooltip } from '../../components';

import './Graph.scss'

import arrowImg from '../../assets/img/arrow.svg';
import ethImg from '../../assets/img/eth-r.svg';
import ethImgDark from '../../assets/img/eth-b.svg';
import refreshImg from '../../assets/img/refresh.svg';
import refreshDarkImg from '../../assets/img/refresh-dark.svg';

const Graph = ({ dividentsPool, isDarkTheme, data, to }) => {
    return (
        <>
            <div className="container s-graph" id="s-graph">
                <div className="s-graph__head">
                    <div className="s-graph__wrapper">
                        <div className="s-graph__text">ETH DIVIDENDS HISTORY</div>
                        {to && <Link to={to}><button className="s-graph__btn btn btn--md"><img src={arrowImg} alt="" /></button></Link>}
                    </div>
                    <div className="">
                        <div className="s-graph__text">
                            {dividentsPool}
                            {isDarkTheme ? <img src={ethImgDark} alt="" /> : <img src={ethImg} alt="" />}
                            <QuestionTooltip isDarkTheme={isDarkTheme} parent="s-graph" tooltipText="- 90% of all ETH that enters the daily Auction Lobby is pooled and distributed back out to Stakers. <br>- 5% of ETH is allocated to the lottery pool. <br>- the other 5% ETH reserve for promotion and platform development costs." />
                        </div>
                        <div className="s-graph__text--black">Current Dividends Pool </div>
                    </div>
                </div>
                <div className="s-graph__content">
                    {!data.length && <div className="s-graph__loader">
                        {isDarkTheme ? <img src={refreshDarkImg} alt="" className="s-graph__loader-img" /> : <img src={refreshImg} alt="" className="s-graph__loader-img" />}
                    </div>}
                    {<div className={classNames({
                        'invisible': !data.length
                    })}>
                        <ResponsiveContainer width="100%" height={400}>
                            <LineChart data={data} syncId="test">
                                <CartesianGrid stroke={isDarkTheme ? '#252253' : '#FCFCFF'} fill={isDarkTheme ? '#363362' : '#F8F7FD'} strokeWidth="10" />
                                <XAxis
                                    type="number"
                                    dataKey="day"
                                    axisLine={false}
                                    tickLine={false}
                                    stroke={isDarkTheme ? '#53B9EA' : "#DB4848"}
                                >
                                </XAxis>
                                <Tooltip
                                    content={({ payload }) => <div className="s-graph__tooltip">
                                        <div className="s-graph__tooltip-circle"></div>
                                        <div className="s-graph__tooltip-value">{payload[0] && payload[0].value}</div>
                                    </div>}
                                    contentStyle={{ borderRadius: '14px' }}

                                />
                                <YAxis
                                    type="number"
                                    dataKey="value"
                                    tickLine={false}
                                    stroke={isDarkTheme ? '#53B9EA' : "#DB4848"}
                                >
                                </YAxis>
                                <Line
                                    key="value"
                                    type="monotone"
                                    dataKey="value"
                                    stroke={isDarkTheme ? '#53B9EA' : "#DF5D5D"}
                                    strokeWidth="6"
                                    dot={false}
                                >
                                </Line>
                            </LineChart>
                        </ResponsiveContainer>
                    </div>}
                </div>
            </div>
        </>
    );
}

export default Graph;
