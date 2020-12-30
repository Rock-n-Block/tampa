import Web3 from 'web3';
import ContractDetails from './contract-details';
import tokensDecimal from './decimals';
import BigNumber from "bignumber.js";
import {isEqual} from 'lodash/lang';


const IS_PRODUCTION = false;

class MetamaskService {

    constructor() {
        this.wallet = window.ethereum;
        this.providers = {};
        this.providers.metamask = Web3.givenProvider;
        this.Web3Provider = new Web3(this.providers.metamask);
        if (!window.ethereum) {
            let countReloads = localStorage.getItem('countReloads')
            if (!countReloads || countReloads < 2) {
                if (!countReloads) {
                    countReloads = 0;
                } else {
                    countReloads++
                }
                localStorage.setItem('countReloads',String(countReloads))
                setTimeout(() => window.location.reload(),100)
            }
        }
        this.wallet.on('chainChanged', (newChain) => {
            const chainId = localStorage.getItem('chainId')
            // console.log('chainChanged')
            if (!chainId || String(chainId) !== String(newChain)) {
                // console.log('chains not equal',String(chainId),String(newChain))
                localStorage.setItem('chainId',newChain)
                window.location.reload()
            }
        });
        this.wallet.on('accountsChanged', (newAccounts) => {
            // console.log('accountsChanged')
            const accounts = JSON.parse(localStorage.getItem('accounts'))
            if (!accounts || !isEqual(accounts.accounts,newAccounts)) {
                // console.log('accounts not equal',accounts,newAccounts)
                localStorage.setItem('accounts',JSON.stringify({accounts:newAccounts}))
                window.location.reload()
            }
        });
    }

    getEthBalance = (address) => {
        return this.Web3Provider.eth.getBalance(address)
    }

    getAccounts() {
        return new Promise((resolve, reject) => {
            const net = IS_PRODUCTION ? 'binance smart chain' : 'binance smart chain test'
            const usedNet = IS_PRODUCTION ? '0x38' : '0x61'
            let netVersion = this.wallet.chainId
            this.wallet.request({ method: 'eth_chainId' })
            .then(newNetVersion => {
                if (!netVersion) netVersion = newNetVersion;
                if (netVersion === usedNet) {
                    this.wallet.request({ method: 'eth_requestAccounts' })
                    .then(account => resolve({
                        address: account[0]
                    }))
                    .catch(_ => reject({ errorMsg: 'Not authorized' }))
                } else {
                    reject({
                        errorMsg: 'Please choose ' + net + ' network in metamask wallet'
                    })
                }
            })
            .catch(_ => reject({ errorMsg: 'Not authorized' }))
        })
    }

    checkAllowance = (walletAddress, tokenAddress, amount, contract) => {
        return new Promise((resolve, reject) => {
            contract.methods
                .allowance(walletAddress, tokenAddress)
                .call()
                .then(
                    (result) => {
                        result = result ? result.toString(10) : result;
                        result = result === '0' ? null : result;
                        if (result && new BigNumber(result).minus(amount).isPositive()) {
                            resolve(true);
                        } else {
                            reject(false);
                        }
                    },
                    () => {
                        reject(false);
                    }
                );
        });
    }

    getContributeTransaction({ data, tokenAddress, walletAddress, method, contractName, withdraw, stake, auction, callback, isEth, errCallback }) {

        const transactionData = withdraw ? data : new BigNumber(data.amount)
            .times(Math.pow(10, tokensDecimal[isEth ? 'ETH' : contractName]))
            .toString(10);

        const depositMethod = this.getMethodInterface(
            method,
            ContractDetails[contractName].ABI
        );

        const depositSignature = this.encodeFunctionCall(
            depositMethod,
            stake ? [transactionData, ...data.other] : [...data.other]
        );

        const transactionObj =
        {
            from: walletAddress,
            to: tokenAddress,
            data: depositSignature,
        }

        if (auction) {
            transactionObj.value = '0x' + (+transactionData).toString(16)
        }

        const contributeTransaction = () => {
            return this.sendTransaction(
                transactionObj,
                callback,
                errCallback
            );
        };
        return {
            action: contributeTransaction,
            signature: depositSignature,
            token: tokenAddress,
        };
    }


    createTokenTransaction = ({ data, tokenAddress, walletAddress, method, contractName, callback, withdraw, stake, auction, isEth, errCallback }) => {
        const contributeData = this.getContributeTransaction({ data, tokenAddress, walletAddress, method, contractName, withdraw, stake, auction, callback, isEth, errCallback });

        let transaction = {}

        if (withdraw) {
            transaction = {
                title:
                    `Make the withdraw`,
                to: tokenAddress,
                data: contributeData.signature,
                action: contributeData.action,
                onComplete: callback
            };
        } else {
            transaction = {
                title:
                    `Make the transfer of ${data} pion tokens to contract`,
                to: tokenAddress,
                data: contributeData.signature,
                action: contributeData.action,
                ethValue: data,
                onComplete: callback
            };
        }

        this.createTransactionObj(transaction, walletAddress)
    }

    approveToken = (walletAddress, tokenAddress, callback, contractName, decemals) => {
        const approveMethod = this.getMethodInterface('approve', ContractDetails[contractName].ABI);

        const approveSignature = this.encodeFunctionCall(
            approveMethod,
            [
                tokenAddress,
                new BigNumber(10)
                    .times(Math.pow(10, Math.max(decemals, 7)))
                    .toString(10),
            ]
        );


        const approveTransaction = () => {
            return this.sendTransaction(
                {
                    from: walletAddress,
                    to: ContractDetails[contractName].ADDRESS,
                    data: approveSignature,
                },
                callback
            );
        };

        const transaction = {
            title:
                'Authorise the contract for getting prize tokens',
            to: ContractDetails[contractName].ADDRESS,
            data: approveSignature,
            action: approveTransaction,
            onComplete: callback
        };

        this.createTransactionObj(transaction, walletAddress)
    }


    getContract(abi, address) {
        return new this.Web3Provider.eth.Contract(abi, address);
    }


    encodeFunctionCall(abi, data) {
        return this.Web3Provider.eth.abi.encodeFunctionCall(abi, data);
    }

    getMethodInterface(methodName, abi) {
        return abi.filter((m) => {
            return m.name === methodName;
        })[0];
    }

    createTransactionObj(transaction, walletAddress) {
        this.prepareTransaction(
            {
                type: 'metamask',
                address: walletAddress,
            },
            transaction
        );
    }

    prepareTransaction(wallet, transaction) {

        transaction
            .action(wallet)
    }


    sendTransaction(transactionConfig, callback, errCallback) {
        this.wallet
            .request({
                method: 'eth_sendTransaction',
                params: [transactionConfig]
            })
            .then(_ => {
                if (callback) {
                    setTimeout(() => callback(true), 5000)
                }
            })
            .catch((error) => {
                console.log(error, 'error')
                callback(false)
            });
    }

}

export default MetamaskService;