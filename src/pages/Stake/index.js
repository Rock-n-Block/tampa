import React from 'react';

import { StakeForm, ReferrerLink, StakeInfo, ActiveStakes } from '../../components';

import './Stake.scss'

const StakePage = () => {
    return (
        <div className="stake">
            <div className="row row--md">
                <StakeForm />
                <ReferrerLink />
            </div>
            <div className="row row--lg">
                <StakeInfo />
                <ActiveStakes />
            </div>
        </div>
    );
}

export default StakePage;
