import Web3 from 'web3';
import ContractDetails from './contract-details';
import tokensDecimal from './decimals';
import BigNumber from "bignumber.js";

const IS_PRODUCTION = true;


class MetamaskService {

    wallet;
    providers;
    Web3Provider;
    tronWebProvider;
    testnet = 'https://event.nileex.io'

    constructor() {


        this.providers = {};
        this.providers.metamask = Web3.givenProvider;
        this.wallet = window.tronWeb;
        this.Web3Provider = new Web3(window.tronWeb);
        // this.wallet.on('chainChanged', (newChain) => {
        //     const chainId = localStorage.getItem('chainId')
        //     if (String(chainId) !== String(newChain)) {
        //         localStorage.setItem('chainId', newChain)
        //         window.location.reload()
        //     }
        // });
        // this.wallet.on('accountsChanged', (newAccounts) => {
        //     const accounts = JSON.parse(localStorage.getItem('accounts'))
        //     console.log('accountsChanged', accounts)
        //     if (!accounts || !isEqual(accounts.accounts, newAccounts)) {
        //         localStorage.setItem('accounts', JSON.stringify({ accounts: newAccounts }))
        //         window.location.reload()
        //     }
        // });
    }

    async getTronAccount() {
        return this.wallet.defaultAddress.base58
    }

    getEthBalance = (address) => {
        return this.wallet.trx.getBalance(address)
    }

    checkAllowance = (walletAddress, tokenAddress, amount, contract) => {
        return new Promise((resolve, reject) => {
            contract.methods
                .allowance(walletAddress, tokenAddress)
                .call()
                .then(
                    (result) => {
                        result = result._hex ? parseInt(result._hex) : result;
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

    getContract(abi, address) {
        return this.wallet.contract(abi, address);
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

    async sendTx({ method, params, walletAddr, options = {} }) {
        try {
            const txObj = await this.wallet.transactionBuilder.triggerSmartContract(
                this.wallet.address.toHex(ContractDetails.TAMPA.ADDRESS),
                method,
                options,
                params,
                this.wallet.address.toHex(walletAddr),
            )

            const signedTransaction = await this.wallet.trx.sign(txObj.transaction);

            const broadcast = await this.wallet.trx.sendRawTransaction(signedTransaction);
            console.log(broadcast)
        } catch (err) {
            console.log(err, 'sendTx')
            throw Error
        }
    }



    sendTransaction(transactionConfig, provider, callback, errCallback) {
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


    async addToken() {
        try {
            const wasAdded = await this.wallet.request({
                method: "wallet_watchAsset",
                params: {
                    type: "ERC20",
                    options: {
                        address: ContractDetails['TAMPA'].ADDRESS,
                        symbol: ContractDetails['TAMPA'].SYMBOL,
                        decimals: ContractDetails['TAMPA'].DECIMALS,
                    },
                },
            });
            if (wasAdded) {
                console.log("Complete");
            }
        } catch (error) {
            console.log(error);
        }
    }
}

export default MetamaskService;