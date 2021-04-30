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
                            <QuestionTooltip isDarkTheme={isDarkTheme} parent="s-graph" tooltipText={`- 90% of all ETH that enters the daily Auction Lobby is pooled and distributed back to Jackpot stakers in addition to Jackpot tokens.
                            <br>- 5% of the ETH is allocated to the lottery "Jackpot" pool. 2.5% is automatically delivered daily to the winner by the smart contract. The other 2.5% is either accumulated, or claimed by the day's winner when they send a video of them winning the lottery to one of the social media accounts on <a href="mailto:https://jackpotstaking.com">https://jackpotstaking.com</a> <br>

More details will be provided as the project progresses so make sure to check for new info because there will also be times this 2.5% is allowed to accumulate for days or weeks in order to have Maga Jackpots. Keep in mind, the lottery is based off of yesterday's pool. So the larger the pool from the day before, the higher amount of ETH will be won the next day by a winner who is randomly chosen by the smart contract.

                            <br>- the final 5% is held by the founders and will be used to provide liquidity for pairings, exchange listings, promote and improve the ecosystem, as well as continue to foster relationships with use case partners that will be honoring the tokens at a high multiple (many Xs) of the auction cost to create more buy pressure for the Jackpot tokens to an audience much larger than the crypto audience.`} />
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
                                    // type="number"
                                    dataKey="day"
                                    // tickCount={8}
                                    // tickSize={1}
                                    // minTickGap={1}
                                    axisLine={false}
                                    tickLine={false}
                                    // interval='preserveStart'
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
