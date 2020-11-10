import React from 'react';
import {
    ResponsiveContainer, LineChart, Line, XAxis, YAxis, ReferenceLine, ReferenceArea,
    ReferenceDot, Tooltip, CartesianGrid, Legend, Brush, ErrorBar, AreaChart, Area,
    Label, LabelList
} from 'recharts';

import './Graph.scss'

import arrowImg from '../../assets/img/arrow.svg';
import ethImg from '../../assets/img/eth-r.svg';

const Graph = ({ dividentsPool }) => {
    const data = [
        { day: 0, value: 0 },
        { day: 10, value: 1000 },
        { day: 35, value: 2050 },
        { day: 40, value: 5000 },
        { day: 50, value: 3000 },
    ]
    return (
        <div className="container s-graph">
            <div className="s-graph__head">
                <div className="s-graph__wrapper">
                    <div className="s-graph__text">ETH DIVIDENDS HISTORY</div>
                    <button className="s-graph__btn btn btn--md"><img src={arrowImg} alt="" /></button>
                </div>
                <div className="">
                    <div className="s-graph__text">
                        {dividentsPool}
                        <img src={ethImg} alt="" />
                    </div>
                    <div className="s-graph__text--black">Current Dividends Pool </div>
                </div>
            </div>
            <div className="s-graph__content">
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={data} syncId="test">
                        <CartesianGrid stroke="#FCFCFF" fill="#F8F7FD" strokeWidth="10" />
                        <XAxis
                            type="number"
                            dataKey="day"
                            axisLine={false}
                            tickLine={false}
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
                            stroke="#DB4848"
                        >
                        </YAxis>
                        <Line
                            key="value"
                            type="monotone"
                            dataKey="value"
                            stroke="#DF5D5D"
                            strokeWidth="6"
                            dot={false}
                        >
                        </Line>
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default Graph;
