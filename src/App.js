import React from 'react';
import { Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';
import { isMobile } from "react-device-detect";

import { Header, Ticker, Modal, ModalDialog } from './components';
import { StakePage, AuctionPage, LotteyrPage, testPage } from './pages';
import MetamaskService from './utils/web3';
import ContractService from './utils/contractService';
import { userActions, modalActions } from './redux/actions';

import './styles/main.scss'

function App() {
  const [contractService, setContractService] = React.useState(null)
  const [walletService, setWalletService] = React.useState(null)
  const dispatch = useDispatch()
  const { isDarkTheme, userAddress, userHexAddress } = useSelector(({ theme, user }) => ({
    isDarkTheme: theme.isDarkTheme,
    userAddress: user.address,
    userHexAddress: user.hexAddress
  }))

  const getData = () => {
    let counter = 0;
    const interval = setInterval(async () => {
      counter += 1000;
      if (window.tronWeb && window.tronWeb.ready) {
        clearInterval(interval)
        const tron = new MetamaskService()
        const contractService = new ContractService(tron)
        setWalletService(tron)
        setContractService(contractService)
        try {
          const addresses = await tron.getTronAccount();
          dispatch(userActions.setUserData({
            address: addresses.base58,
            hexAddress: addresses.hex
          }))
          dispatch(modalActions.toggleModal(false))
        } catch (err) {
          dispatch(userActions.setUserData({
            errorMsg: err.message
          }))
          dispatch(modalActions.toggleModal(true))

          console.log(err, 'err')
        }
      } else if (counter > 2000) {
        clearInterval(interval)
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

        <Route exact path="/" render={() => <StakePage isDarkTheme={isDarkTheme} walletService={walletService} userAddress={userAddress} contractService={contractService} />} />
        <Route path="/auction" render={() => <AuctionPage isDarkTheme={isDarkTheme} walletService={walletService} userAddress={userAddress} contractService={contractService} />} />
        <Route path="/lottery" render={() => <LotteyrPage isDarkTheme={isDarkTheme} walletService={walletService} userHexAddress={userHexAddress} userAddress={userAddress} contractService={contractService} />} />



        <Route path="/testpage" component={testPage} />
      </div>
      <Modal />
      <ModalDialog />
    </div>
  );
}

export default App;
