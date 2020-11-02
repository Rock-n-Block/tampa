import React from 'react';

import { StakeForm, ReferrerLink, StakeInfo, ActiveStakes, Graph } from '../../components';

import './Stake.scss'

const StakePage = ({ isDarkTheme }) => {
    return (
        <div className="stake">
            <div className="row row--md">
                <StakeForm isDarkTheme={isDarkTheme} />
                <Graph />
                <ReferrerLink />
            </div>
            <div className="row row--lg">
                <StakeInfo />
                <ActiveStakes isDarkTheme={isDarkTheme} />
            </div>
        </div>
    );
}

export default StakePage;
