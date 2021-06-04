import Web3 from 'web3';
import ContractDetails from './contract-details';
import BigNumber from "bignumber.js";

const IS_PRODUCTION = false;


class MetamaskService {

    wallet;
    providers;
    Web3Provider;
    tronWebProvider;
    net = IS_PRODUCTION ? '' : 'https://api.shasta.trongrid.io'

    constructor() {


        this.providers = {};
        this.providers.metamask = Web3.givenProvider;
        this.wallet = window.tronWeb;
        this.Web3Provider = new Web3(window.tronWeb);

        window.addEventListener('message', function (e) {

            if (e.data.message && e.data.message.action == "setAccount") {
                window.location.reload();

            }
        })
    }

    convertUserAddressFromHex(address) {
        return this.wallet.address.fromHex(address)
    }

    async getTronAccount() {
        if (!IS_PRODUCTION && this.wallet.eventServer.host !== this.net) {
            throw new Error('Please choose shasta testnet in TronLink wallet')
        }
        return this.wallet.defaultAddress
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