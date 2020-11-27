import Web3 from 'web3';
import ContractDetails from './contract-details';
import tokensDecimal from './decimals';
import BigNumber from "bignumber.js"


const IS_PRODUCTION = false;

const WEB3_CONSTANTS = {
    kovan: {
        WEB3_PROVIDER: 'https://kovan.infura.io/v3/d53dc6a18ce94162ac4821a9c5ff06f2'
    }
};


const networks = {
    production: 'mainnet',
    testnet: 'kovan'
};

class MetamaskService {

    metaMaskWeb3;
    providers;
    Web3Provider;

    constructor() {
        // this.providers.infura = new Web3.providers.HttpProvider(
        //     WEB3_CONSTANTS[networks[IS_PRODUCTION ? 'mainnet' : 'testnet']].WEB3_PROVIDER
        // );
        this.providers = {};
        this.providers.metamask = Web3.givenProvider;

        this.metaMaskWeb3 = window['ethereum'];
        this.Web3Provider = new Web3(this.providers.metamask);
        window.web34 = this.Web3Provider
    }

    getEthBalance = (address) => {
        return this.Web3Provider.eth.getBalance(address)
    }

    getAccounts = () => {
        return new Promise((resolve, reject) => {
            const onAuth = (address) => {

                this.Web3Provider.setProvider(this.providers.metamask);
                resolve({
                    address,
                    network: net,
                    errorCode: 0,
                    errorMsg: ''
                })
            };

            const onError = (errorParams) => {
                this.Web3Provider.setProvider(this.providers.metamask);
                reject(errorParams)
            };
            const usedNetworkVersion = IS_PRODUCTION ? 1 : 42;
            const net = usedNetworkVersion === 1 ? 'mainnet' : 'kovan';
            const isValidMetaMaskNetwork = () => {
                const networkVersion = Number((this.metaMaskWeb3.networkVersion));
                if (usedNetworkVersion !== networkVersion) {
                    onError({
                        errorCode: 2,
                        errorMsg: 'Please choose ' + net + ' network in Metamask.'
                    })
                    return false
                }
                return true;
            };


            if (this.metaMaskWeb3 && this.metaMaskWeb3.isMetaMask) {
                isValidMetaMaskNetwork()
                this.metaMaskWeb3.on('accountsChanged', (accounts) => {
                    if (isValidMetaMaskNetwork()) {
                        if (accounts.length) {
                            onAuth(accounts[0]);
                        } else {
                            onError({
                                errorCode: 3,
                                errorMsg: 'Not authorized'
                            });
                        }
                    }
                });
                this.metaMaskWeb3.on('chainChanged', () => {
                    window.location.reload();
                });

                if (!this.metaMaskWeb3.selectedAddress) {
                    this.metaMaskWeb3.enable().catch(() => {
                        onError({
                            errorCode: 3,
                            errorMsg: 'Not authorized'
                        });
                    });
                } else {
                    if (this.metaMaskWeb3.selectedAddress) {
                        onAuth(this.metaMaskWeb3.selectedAddress);
                    } else {
                        onError({
                            errorCode: 3,
                            errorMsg: 'Not authorized'
                        });
                    }
                }
            } else {
                onError({
                    errorCode: 1,
                    errorMsg: 'Metamask extension is not found. You can install it from <a href="https://metamask.io" target="_blank">metamask.io</a>'
                });
            }
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

        const contributeTransaction = () => {
            return this.sendTransaction(
                {
                    from: walletAddress,
                    to: tokenAddress,
                    data: depositSignature,
                    value: auction ? transactionData : ''
                },
                'metamask',
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
                new BigNumber(90071992.5474099)
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
                'metamask',
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



    sendTransaction(transactionConfig, provider, callback, errCallback) {
        if (provider) {
            this.Web3Provider.eth.setProvider(this.providers[provider]);
        }
        return new Promise((resolve, reject) => {

            this.Web3Provider.eth
                .sendTransaction(transactionConfig, (err, response) => {
                    if (!err) {
                        const trxSubscription = setInterval(() => {
                            this.Web3Provider.eth.getTransactionReceipt(
                                response,
                                (error, transaction) => {
                                    if (transaction) {
                                        if (transaction.status) {
                                            resolve(transaction);
                                        } else {
                                            reject(err);
                                        }
                                        clearInterval(trxSubscription);
                                    }
                                    if (error) {
                                        clearInterval(trxSubscription);
                                    }
                                },
                            );
                        }, 1000);
                    } else {
                        reject(err);
                    }
                })
                .then(
                    (result) => {
                        if (callback) {
                            setTimeout(() => {
                                callback(true)
                            }, 1000)
                        }
                    },
                    (err) => {
                        if (errCallback) {
                            setTimeout(() => {
                                errCallback(false)
                            }, 1000)
                        }
                    },
                )
                .finally(() => {
                    if (provider) {
                        this.Web3Provider.eth.setProvider(this.providers.metamask);
                    }
                });
        });
    }

}

export default MetamaskService;