import React from 'react';

import { SummaryBets, AuctionLobby, Graph } from '../../components';

import './Auction.scss'

const AuctionPage = ({ isDarkTheme }) => {
    return (
        <div className="auction">
            <div className="row row--lg">
                <h1 className="auction__title">Auction</h1>
                <Graph />
                <SummaryBets isDarkTheme={isDarkTheme} />
                <AuctionLobby />
            </div>
        </div>
    );
}

export default AuctionPage;
