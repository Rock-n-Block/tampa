import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { QuestionTooltip } from '../../components';

import './ReferrerLink.scss'

import leftImg from '../../assets/img/referrer-1.svg';
import rightImg from '../../assets/img/referrer-2.svg';

const ReferrerLink = ({ userAddress, isDarkTheme }) => {
    return (
        <div className="container r-link" id="r-link">
            <img src={leftImg} alt="" className="r-link__img r-link__img--left" />
            <img src={rightImg} alt="" className="r-link__img r-link__img--right" />
            <div className="r-link__box">
                <div className="r-link__title">Your Referrer Link
                    <QuestionTooltip isDarkTheme={isDarkTheme} parent="r-link" tooltipText="Your referrals will earn an extra 5% minted J tokens on their Auction Lobby Purchase. As a referrer, you will earn an extra 10%. There are no limits on the number or the amount of referrals that you can get." />
                </div>
                <div className="r-link__link">{`${window.location.origin}/auction/?ref=${userAddress}`}</div>
            </div>
            <CopyToClipboard text={`${window.location.origin}/auction/?ref=${userAddress}`}>
                <button className="r-link__btn btn btn--md">COPY</button>
            </CopyToClipboard>
        </div>

    );
}

export default ReferrerLink;
