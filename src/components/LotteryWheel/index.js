import React, { useRef } from 'react';
import SwiperCore, { Autoplay } from 'swiper';

import './LotteryWheel.scss'

const LotteryWheel = () => {
    const [elements, setElements] = React.useState(['0x45945945945', '0x5045905043', '0x4105059205', '0x325252525', '0x5324536436', '0x450395035', '0x5095039503', '0x459405930345', '0x350350250205025'])

    const box = useRef()

    const start = Date.now()
    let counter = 0;

    const animate = () => {
        let timePassed = Date.now() - start;

        if (timePassed >= 1000) {
            return;
        }
        counter++
        let div = document.createElement('div');
        div.className = 'l-wheel__item'
        div.innerHTML = elements[0]

        box.current.style.transform = `translateY(-${counter * 43})`

        box.current.appendChild(div)
        requestAnimationFrame(animate)
    }

    React.useEffect(() => {
        animate()
    }, [])

    return (
        <div className="l-wheel">
            <div className="l-wheel__wrapper" ref={box}>
                {
                    elements.map((item, index) => {
                        return <div key={item} className="l-wheel__item">{item}</div>
                    })
                }
            </div>
        </div>
    );
}

export default LotteryWheel;
