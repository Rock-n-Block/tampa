import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { message } from "antd";

import { QuestionTooltip } from '../../components';

import './ReferrerLink.scss'

import leftImg from '../../assets/img/referrer-1.svg';
import rightImg from '../../assets/img/referrer-2.svg';

const ReferrerLink = ({ userAddress, isDarkTheme }) => {
    const success = () => {
        message.info({
            content: 'Copied to Buffer',
            className: `r-link__alert ${isDarkTheme ? 'r-link__alert-dark' : ''}`,

            style: {
                marginTop: '10vh',
            },
        });
    }

    return (
        <div className="container r-link" id="r-link">
            <img src={leftImg} alt="" className="r-link__img r-link__img--left" />
            <img src={rightImg} alt="" className="r-link__img r-link__img--right" />
            <div className="r-link__box">
                <div className="r-link__title">Your Referral Link
                    <QuestionTooltip isDarkTheme={isDarkTheme} parent="r-link" tooltipText="Your referrals will earn an extra 10% minted Jackpot tokens on their Auction Lobby Purchase. As a referrer, you will earn a 10% bonus from what they purchase. They do not get fewer tokens because you referred them. The person being referred, AND the person who referred them BOTH get more tokens when using a referral link. There are no limits on the number or the amount of referrals that you can accumulate." />
                </div>
                <div className="r-link__link">{`${window.location.origin}/auction/?ref=${userAddress}`}</div>
            </div>
            <CopyToClipboard text={`${window.location.origin}/auction/?ref=${userAddress}`}>
                <button onClick={success} className="r-link__btn btn btn--md">COPY</button>
            </CopyToClipboard>
        </div>

    );
}

export default ReferrerLink;
