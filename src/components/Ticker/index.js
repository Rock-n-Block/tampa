import React from 'react';
import Ticker from 'react-ticker'
import SwiperCore, { Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import './Ticker.scss'
import 'swiper/swiper.scss';

SwiperCore.use([Autoplay]);

const TickerComponent = () => {

    const params = {
        autoplay: {
            delay: 0
        },
        loop: true,
        loopedSlides: 10,
        slidesPerView: 'auto',
        spaceBetween: 60,
        allowTouchMove: false
    }

    return (
        <div className="ticker-box">
            <Ticker offset="60">
                {({ index }) => (
                    <>
                        <div key={index}>Text left for Claiming ETH&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                    </>
                )}
            </Ticker>
        </div>
    );
}

export default TickerComponent;
