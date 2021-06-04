import ContractDetails from '..//web3/contract-details';
import decimals from '..//web3/decimals';
import BigNumber from "bignumber.js"

class ContractService {

    constructor(walletService) {
        this.walletService = walletService
        this.tampaContract = this.walletService.getContract(ContractDetails.TAMPA.ABI, ContractDetails.TAMPA.ADDRESS)
    }

    loteryDayWaitingForWinnerNew = () => {
        return this.tampaContract.methods.loteryDayWaitingForWinnerNew().call()
    }

    loteryDayWaitingForWinner = () => {
        return this.tampaContract.methods.loteryDayWaitingForWinner().call()
    }
    lastEndedLoteryDay = () => {
        return this.tampaContract.methods.lastEndedLoteryDay().call()
    }

    globwhatDayIsItTodayals = (day) => {
        return this.tampaContract.methods.whatDayIsItToday(day).call()
    }

    globals = () => {
        return this.tampaContract.methods.globals().call()
    }

    waasLobby = (day) => {
        return this.tampaContract.methods.waasLobby(day).call()
    }

    defaultReferrerAddr = () => {
        return this.tampaContract.methods.defaultReferrerAddr().call()
    }

    getUnstakeParams = (address, stakeIndex, stakeId) => {
        return this.tampaContract.methods.getUnstakeParams(address, stakeIndex, +stakeId).call()
    }

    winners = (day) => {
        return this.tampaContract.methods.winners(day).call()
    }

    endLoteryDay = (day) => {
        return this.tampaContract.methods.endLoteryDay(day).call()
    }

    loteryCount = (day, index) => {
        return this.tampaContract.methods.loteryCount(day, index).call()
    }

    loteryCountLen = (day) => {
        return this.tampaContract.methods.loteryCountLen(day).call()
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

    endedStakeLists = (address, stake) => {
        return this.tampaContract.methods.endedStakeLists(address, stake).call()
    }

    stakeLists = (address, stake) => {
        return this.tampaContract.methods.stakeLists(address, stake).call()
    }

    endedStakeCount = (address) => {
        return this.tampaContract.methods.endedStakeCount(address).call()
    }

    stakeCount = (address) => {
        return this.tampaContract.methods.stakeCount(address).call()
    }

    fromReferrs = (address) => {
        return this.tampaContract.methods.fromReferrs(address).call()
    }

    xfLobby = (days) => {
        return this.tampaContract.methods.xfLobby(days).call()
    }

    balanceOf = (address) => {
        return new Promise((resolve, reject) => {
            return this.tampaContract.methods.balanceOf(address).call()
                .then(res => {
                    resolve(BigNumber(res / Math.pow(10, decimals.TAMPA)).toFixed())
                })
                .catch(err => {
                    reject(err)
                })
        })
    }

    currentDay = () => {
        return this.tampaContract.currentDay().call()
    }
    approveToken = (address) => {
        return this.tampaContract.approve(ContractDetails.TAMPA.ADDRESS, new BigNumber(90071992.5474099)
            .times(Math.pow(10, Math.max(18, 7)))
            .toString(10)).send({
                from: address
            })
    }

    checkAllowance = (address) => {
        return new Promise((resolve, reject) => {
            this.walletService.checkAllowance(address, ContractDetails.TAMPA.ADDRESS, 0, this.tampaContract)
                .then(() => {
                    resolve(true)
                })
                .catch(() => {
                    reject(false)
                })
        })
    }

    getEthBalance = (address) => {
        return this.walletService.getEthBalance(address)
    }
}

export default ContractService