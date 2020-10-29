import React from 'react';
import { Route } from 'react-router-dom';

import { Header, Ticker } from './components';
import { StakePage, AuctionPage, LotteyrPage } from './pages';

import './styles/main.scss'

function App() {
  return (
    <div className="tampo">
      <Header />
      <div className="row">
        <Ticker />

        <Route exact path="/" component={StakePage} />
        <Route path="/auction" component={AuctionPage} />
        <Route path="/lottery" component={LotteyrPage} />
      </div>
    </div>
  );
}

export default App;
