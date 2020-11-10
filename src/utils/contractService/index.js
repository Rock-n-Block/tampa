import MetamaskService from '../web3';
import ContractDetails from '..//web3/contract-details';
import decimals from '..//web3/decimals';
import BigNumber from "bignumber.js"

class ContractService {

    constructor() {
        this.metamaskService = new MetamaskService()
        this.tampaContract = this.metamaskService.getContract(ContractDetails.TAMPA.ABI, ContractDetails.TAMPA.ADDRESS)
    }

    xfLobby = (day) => {
        return this.tampaContract.methods.xfLobby(day).call()
    }
    
    tampaReceivedAuction = (day, address) => {
        return this.tampaContract.methods.tampaReceivedAuction(day, address).call()
    }

    getDayUnixTime = (day) => {
        return this.tampaContract.methods.getDayUnixTime(day).call()
    }

    xfLobbyEntry = (address, day, index) => {
        return this.tampaContract.methods.xfLobbyEntry(address, day, index).call()
    }

    getFirstAuction = () => {
        return this.tampaContract.methods.getFirstAuction().call()
    }

    tampaReceivedAuction = (day, address) => {
        return this.tampaContract.methods.tampaReceivedAuction(day, address).call()
    }

    xfLobbyMembers = (day, address) => {
        return this.tampaContract.methods.xfLobbyMembers(day, address).call()
    }

    dailyData = (currentDay) => {
        return this.tampaContract.methods.dailyData(currentDay - 1).call()
    }

    getDayUnixTime = (lockedDay) => {
        return this.tampaContract.methods.getDayUnixTime(lockedDay).call()
    }

    calcPayoutReward = (stakeShares, lockedDay, stakedDays, currentDay, method) => {
        const sum = BigNumber.sum(stakedDays, lockedDay).toString()

        return new Promise((resolve, reject) => {
            if (lockedDay >= currentDay) {
                resolve(0)
            } else {
                this.tampaContract.methods[method](stakeShares, lockedDay, BigNumber.min(currentDay, sum).toString()).call()
                    .then(res => {
                        resolve(res)
                    })
                    .catch(err => {
                        reject(err)
                    })
            }
        })
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