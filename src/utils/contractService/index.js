import MetamaskService from '../web3';
import ContractDetails from '..//web3/contract-details';
import tokensDecimal from '..//web3/decimals';
import decimals from '..//web3/decimals';
import BigNumber from "bignumber.js"
import contractDetails from '..//web3/contract-details';

class ContractService {

    constructor() {
        this.metamaskService = new MetamaskService()
        this.tampaContract = this.metamaskService.getContract(ContractDetails.TAMPA.ABI, ContractDetails.TAMPA.ADDRESS)
    }

    stakeLists = (address, stake) => {
        return this.tampaContract.methods.stakeLists(address, stake).call()
    }

    stakeCount = (address) => {
        return this.tampaContract.methods.stakeCount(address).call()
    }

    fromReferrs = (address) => {
        return this.tampaContract.methods.fromReferrs(address).call()
    }

    xfLobby = (days) => {
        return this.tampaContract.methods.xfLobby(++days).call()
    }

    balanceOf = (address) => {
        return new Promise((resolve, reject) => {
            return this.tampaContract.methods.balanceOf(address).call()
                .then(res => {
                    resolve(BigNumber(res / Math.pow(10, decimals.TAMPA)).toFixed(0))
                })
                .catch(err => {
                    reject(err)
                })
        })
    }

    currentDay = () => {
        return this.tampaContract.methods.currentDay().call()
    }
    approveToken = (address, collback) => {
        this.metamaskService.approveToken(address, ContractDetails.TAMPA.ADDRESS, collback, 'TAMPA', 18)
    }

    checkAllowance = (address) => {
        return new Promise((resolve, reject) => {
            this.metamaskService.checkAllowance(address, ContractDetails.TAMPA.ADDRESS, 0, this.tampaContract)
                .then(() => {
                    resolve(true)
                })
                .catch(() => {
                    reject(false)
                })
        })
    }


    createTokenTransaction = ({ data, address, swapMethod, contractName, callback, withdraw, stake }) => {
        this.metamaskService.createTokenTransaction({
            data,
            tokenAddress: ContractDetails[contractName].ADDRESS,
            walletAddress: address,
            method: swapMethod,
            contractName,
            callback,
            withdraw,
            stake
        })
    }

}

export default ContractService