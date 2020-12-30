import React from 'react';
import { Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';
import {isMobile} from "react-device-detect";

import { Header, Ticker, Modal } from './components';
import { StakePage, AuctionPage, LotteyrPage, testPage } from './pages';
import MetamaskService from './utils/web3';
import ContractService from './utils/contractService';
import { userActions, modalActions } from './redux/actions';

import './styles/main.scss'
import {isEqual} from "lodash/lang";

function App() {
  const [contractService, setContractService] = React.useState(null)
  const [walletService, setWalletService] = React.useState(null)
  const dispatch = useDispatch()
  const { isDarkTheme, userAddress } = useSelector(({ theme, user }) => ({
    isDarkTheme: theme.isDarkTheme,
    userAddress: user.address
  }))

  const getData = () => {
    let counter = 0;
    const interval = setInterval(() => {
      counter += 1000;
      if (window.ethereum) {
        clearInterval(interval)
        const metamask = new MetamaskService()
        const contractService = new ContractService(metamask)
        setWalletService(metamask)
        setContractService(contractService)
        metamask.getAccounts().then(res => {
          dispatch(userActions.setUserData(res))
          dispatch(modalActions.toggleModal(false))
        }).catch(err => {
          dispatch(userActions.setUserData(err))
          dispatch(modalActions.toggleModal(true))
        })
      } else if (counter > 2000) {
        if (isMobile) return window.location.reload()
        dispatch(userActions.setUserData({
          errorCode: 1,
          errorMsg: 'Metamask extension is not found. You can install it from <a href="https://metamask.io" target="_blank">metamask.io</a>'
        }))
        dispatch(modalActions.toggleModal(true))
      }
    }, 1000)
  }



  React.useEffect(() => {
    getData()
  }, [])



  return (
    <div className={classNames('tampa', {
      'darktheme': isDarkTheme
    })}>
      <Header isDarkTheme={isDarkTheme} userAddress={userAddress} contractService={contractService} walletService={walletService} />
      <div className="row">
        <Ticker contractService={contractService} />

        <Route exact path="/" render={() => <StakePage isDarkTheme={isDarkTheme} userAddress={userAddress} contractService={contractService} />} />
        <Route path="/auction" render={() => <AuctionPage isDarkTheme={isDarkTheme} userAddress={userAddress} contractService={contractService} />} />
        <Route path="/lottery" render={() => <LotteyrPage isDarkTheme={isDarkTheme} userAddress={userAddress} contractService={contractService} />} />



        <Route path="/testpage" component={testPage} />
      </div>
      <Modal />
    </div>
  );
}

export default App;
