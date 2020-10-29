import React from 'react';
import classNames from 'classnames';

import './LotteryProgress.scss'

const LotteryProgress = ({ segments = [
    {
        percent: 19
    },
    {
        percent: 51,
        isMe: true
    },
    {
        percent: 19
    },
    {
        percent: 11
    }
] }) => {
    const colors = ['#FF6B6B', '#6478C0', '#1DD1A1', '#F9D06A']

    return (
        <div className="l-progress">
            <div className="l-progress__title">Head Chart</div>
            <div className="l-progress__content">
                {
                    segments.map((segment, index) => {
                        return <div key={index} className="l-progress__item" style={{ maxWidth: `calc(${segment.percent}% - 3px)`, backgroundColor: colors[index] }}>
                            <div className={classNames('l-progress__item-percent', {
                                'bottom': index % 2,
                            })}>{segment.percent}%</div>
                        </div>
                    })
                }
            </div>
            <div className="l-progress__colors">
                {
                    segments.map((segment, index) => {
                        return <div key={index} className="l-progress__colors-item">
                            <div className="l-progress__colors-circle" style={{ backgroundColor: colors[index] }}></div>
                            TEXT COLOR {segment.isMe && <span>&nbsp;(YOU)</span>}
                        </div>
                    })
                }
            </div>
        </div >
    );
}

export default LotteryProgress;
