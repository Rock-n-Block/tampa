import React from 'react';

import lotteryWheel from '../../utils/lotteryWheel';

import './LotteryWheel.scss'

import lotteryEndAudio from '../../assets/mp3/click_wheel.mp3';
import lotteryPlayingAudio from '../../assets/mp3/test.mp3';

const LotteryWheel = ({ lotteryWinner, lotteryMembers, isLotteryStarted, isSlowShow }) => {
    const [lottery, setLottery] = React.useState(null)

    const container = React.useRef()
    const audioEnd = React.useRef()
    const playingAudio = React.useRef()

    const iniLottery = (params) => {
        const data = [];
        const length = params.lotteryMembers.length >= 30 ? params.lotteryMembers.length : 30;
        for (let k = 0; k < length; k++) {
            data.push(...params.lotteryMembers);
            if (params.lotteryMembers.length < 30) {
                for (let i = 0; i < 20; i++) {
                    data.push('0x' + Math.floor(Math.random() * 16).toString(16) + Math.floor(Math.random() * 16).toString(16) + Math.floor(Math.random() * 16).toString(16) + Math.floor(Math.random() * 16).toString(16) + Math.floor(Math.random() * 16).toString(16) + Math.floor(Math.random() * 16).toString(16) + Math.floor(Math.random() * 16).toString(16) + Math.floor(Math.random() * 16).toString(16) + Math.floor(Math.random() * 16).toString(16) + Math.floor(Math.random() * 16).toString(16) + Math.floor(Math.random() * 16).toString(16) + Math.floor(Math.random() * 16).toString(16) + Math.floor(Math.random() * 16).toString(16) + Math.floor(Math.random() * 16).toString(16) + Math.floor(Math.random() * 16).toString(16) + Math.floor(Math.random() * 16).toString(16) + Math.floor(Math.random() * 16).toString(16) + Math.floor(Math.random() * 16).toString(16) + Math.floor(Math.random() * 16).toString(16) + Math.floor(Math.random() * 16).toString(16) + Math.floor(Math.random() * 16).toString(16));
                }
            }
        }
        params.data = data;
        const lottery = new lotteryWheel(params);
        setLottery(lottery)
        lottery.start();

        if (lotteryWinner) {
            setTimeout(() => {
                lottery.showWinner(lotteryWinner);
            }, 0)
        }
        // setTimeout(() => {
        //     lottery.setWinner('0x00000020')
        // }, 10000)
    }

    React.useEffect(() => {
        if (lottery && lotteryWinner) {
            if (isSlowShow) {
                lottery.setWinner(lotteryWinner)
            } else {

                lottery.showWinner(lotteryWinner);
            }
        }
    }, [lottery, lotteryWinner])

    React.useEffect(() => {
        if (isLotteryStarted && lotteryMembers) {
            iniLottery({
                element: container.current,
                data: [],
                visibleElementsCount: 20,
                speed: 1,
                audioEnd: audioEnd.current,
                lotteryMembers: lotteryMembers,
                playingAudio: playingAudio.current,
                callback: () => {
                    delete window.localStorage.isLotteryStarted
                }
            });
        }
    }, [isLotteryStarted])

    return (
        <div className="l-wheel">
            <div className="l-wheel__content" ref={container}></div>
            <audio ref={audioEnd} src={lotteryEndAudio}></audio>
            <audio ref={playingAudio} src={lotteryPlayingAudio} loop></audio>
        </div>
    );
}

export default LotteryWheel;
