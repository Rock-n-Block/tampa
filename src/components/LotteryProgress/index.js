import React from 'react';
import classNames from 'classnames';

import './LotteryProgress.scss'

const LotteryProgress = ({ segments, userAddress }) => {
    const colors = React.useMemo(() => ['#FF6B6B', '#6478C0', '#1DD1A1', '#F9D06A'], [])

    const [segmentItems, setSegmentItems] = React.useState([])
    const [colorItems, setColorItems] = React.useState([])

    let count = 0;


    React.useEffect(() => {

        const newSegmentItems = []
        const newColorItems = []

        for (const segment in segments) {
            newSegmentItems.push(
                <div key={segment} className="l-progress__item" style={{ maxWidth: `calc(${segments[segment]}% - 3px)`, backgroundColor: colors[count] }}>
                    <div className={classNames('l-progress__item-percent', {
                        'bottom': count % 2,
                    })}>{segments[segment]}%</div>
                </div>
            )
            newColorItems.push(
                <div key={segment} className="l-progress__colors-item">
                    <div className="l-progress__colors-circle" style={{ backgroundColor: colors[count] }}></div>
                    <div className="l-progress__colors-item-text">{segment}</div> {segment.toLowerCase() === userAddress && <span>&nbsp;(YOU)</span>}
                </div>
            )
            count++
        }

        setSegmentItems(newSegmentItems)
        setColorItems(newColorItems)
    }, [segments, colors, count, userAddress])

    return (
        <div className="l-progress">
            <div className="l-progress__title">Head Chart</div>
            <div className="l-progress__content">
                {segmentItems && segmentItems}
            </div>
            <div className="l-progress__colors">
                {colorItems && colorItems}
            </div>
        </div >
    );
}

export default LotteryProgress;
