import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import lotteryWheel from '../../utils/lotteryWheel';
import { lotteryActions } from '../../redux/actions';

import './LotteryWheel.scss'

import lotteryEndAudio from '../../assets/mp3/click_wheel.mp3';
import lotteryPlayingAudio from '../../assets/mp3/test.mp3';

const LotteryWheel = () => {
    const dispatch = useDispatch();

    const container = React.useRef()
    const audioEnd = React.useRef()
    const playingAudio = React.useRef()

    const isLotteryStarted = useSelector(({ lottery }) => lottery.isLotteryStarted)

    const handleStartLottery = () => {
        dispatch(lotteryActions.startLottery())
        window.localStorage.isLotteryStarted = true
    }


    const iniLottery = (params) => {

        const data = [];
        for (let k = 0; k < 100; k++) {
            data.push('0x' + ('00000000000' + k.toString(16)).slice(-8));
        }
        params.data = data;
        const lottery = new lotteryWheel(params);
        lottery.start();

        setTimeout(() => {
            lottery.showWinner('0x00000020');
        }, 0)
        setTimeout(() => {
            lottery.setWinner('0x00000020')
        }, 10000)
    }

    React.useEffect(() => {
        if (isLotteryStarted) {
            iniLottery({
                element: container.current,
                data: [],
                visibleElementsCount: 20,
                speed: 1,
                audioEnd: audioEnd.current,
                playingAudio: playingAudio.current,
                callback: () => {
                    delete window.localStorage.isLotteryStarted
                }
            });
        }
    }, [isLotteryStarted])

    return (
        <div className="l-wheel">
            {!isLotteryStarted && <button onClick={handleStartLottery} className="l-wheel__btn btn">START</button>}
            <div className="l-wheel__content" ref={container}></div>
            <audio ref={audioEnd} src={lotteryEndAudio}></audio>
            <audio ref={playingAudio} src={lotteryPlayingAudio} loop></audio>
        </div>
    );
}

export default LotteryWheel;
