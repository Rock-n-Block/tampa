import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import lotteryWheel from '../../utils/lotteryWheel';

import { lotteryActions } from '../../redux/actions';

import './LotteryWheel.scss'

const LotteryWheel = () => {
    const dispatch = useDispatch();
    const container = React.useRef()

    const isLotteryStarted = useSelector(({ lottery }) => lottery.isLotteryStarted)

    const handleStartLottery = () => {
        dispatch(lotteryActions.startLottery())
        window.localStorage.isLotteryStarted = true
    }


    const iniLottery = (params) => {

        const data = [];
        for (let k = 0; k < 10000; k++) {
            data.push('0x' + ('00000000000' + k.toString(16)).slice(-8));
        }
        params.data = data;
        const lottery = new lotteryWheel(params);
        lottery.start();
    }

    React.useEffect(() => {
        if (isLotteryStarted) {
            iniLottery({
                element: container.current,
                data: [],
                visibleElementsCount: 20,
                winner: '0x00000020',
                speed: 1
            });
        }
    }, [isLotteryStarted])

    return (
        <div className="l-wheel">
            {!isLotteryStarted && <button onClick={handleStartLottery} className="l-wheel__btn btn">START</button>}
            <div className="l-wheel__content" ref={container}></div>
        </div>
    );
}

export default LotteryWheel;
