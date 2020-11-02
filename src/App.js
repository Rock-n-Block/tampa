import React from 'react';
import { Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import classNames from 'classnames';

import { Header, Ticker } from './components';
import { StakePage, AuctionPage, LotteyrPage, testPage } from './pages';

import './styles/main.scss'

function App() {
  const isDarkTheme = useSelector(({ theme }) => theme.isDarkTheme)
  return (
    <div className={classNames('tampa', {
      'darktheme': isDarkTheme
    })}>
      <Header />
      <div className="row">
        <Ticker />

        <Route exact path="/" render={() => <StakePage isDarkTheme={isDarkTheme} />} />
        <Route path="/auction" render={() => <AuctionPage isDarkTheme={isDarkTheme} />} />
        <Route path="/lottery" component={LotteyrPage} />



        <Route path="/testpage" component={testPage} />
      </div>
    </div>
  );
}

export default App;
