import React from 'react';
import { Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';

import { Header, Ticker, Modal } from './components';
import { StakePage, AuctionPage, LotteyrPage, testPage } from './pages';
import MetamaskService from './utils/web3';
import ContractService from './utils/contractService';
import { userActions, modalActions } from './redux/actions';

import './styles/main.scss'

function App() {
  const [contractService, setContractService] = React.useState(null)
  const dispatch = useDispatch()
  const { isDarkTheme, userAddress } = useSelector(({ theme, user }) => ({
    isDarkTheme: theme.isDarkTheme,
    userAddress: user.address
  }))


  React.useEffect(() => {
    let counter = 0;
    const metamask = new MetamaskService()

    const interval = setInterval(() => {
      counter += 10;
      if (window['ethereum'] && window['ethereum'].isMetaMask) {
        clearInterval(interval)

        metamask.getAccounts().then(res => {
          dispatch(userActions.setUserData(res))
          dispatch(modalActions.toggleModal(false))
        }).catch(err => {

          dispatch(userActions.setUserData(err))
          dispatch(modalActions.toggleModal(true))
        })
      } else if (counter > 3000) {
        dispatch(userActions.setUserData({
          errorCode: 1,
          errorMsg: 'Metamask extension is not found. You can install it from <a href="https://metamask.io" target="_blank">metamask.io</a>'
        }))
        dispatch(modalActions.toggleModal(true))
      }
    }, 10)
  }, [dispatch])

  React.useEffect(() => {
    const contractService = new ContractService()

    setContractService(contractService)
  }, [])

  return (
    <div className={classNames('tampa', {
      'darktheme': isDarkTheme
    })}>
      <Header isDarkTheme={isDarkTheme} userAddress={userAddress} contractService={contractService} />
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
