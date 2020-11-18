import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import './ReferrerLink.scss'

import leftImg from '../../assets/img/referrer-1.svg';
import rightImg from '../../assets/img/referrer-2.svg';

const ReferrerLink = ({ userAddress }) => {
    return (
        <div className="container r-link">
            <img src={leftImg} alt="" className="r-link__img r-link__img--left" />
            <img src={rightImg} alt="" className="r-link__img r-link__img--right" />
            <div className="r-link__box">
                <div className="r-link__title">Your Referrer Link</div>
                <div className="r-link__link">{`${window.location.origin}/auction/?ref=${userAddress}`}</div>
            </div>
            <CopyToClipboard text={`${window.location.origin}/auction/?ref=${userAddress}`}>
                <button className="r-link__btn btn btn--md">COPY</button>
            </CopyToClipboard>
        </div>

    );
}

export default ReferrerLink;
