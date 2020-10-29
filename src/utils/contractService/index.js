import MetamaskService from '../web3';
import ContractDetails from '..//web3/contract-details';
import tokensDecimal from '..//web3/decimals';
import decimals from '..//web3/decimals';
import BigNumber from "bignumber.js"
import contractDetails from '..//web3/contract-details';

class ContractService {
    metamaskService;

    pionContract;
    pionV1Contract;
    uniPairContract;
    prizeContract;
    uniContract;
    mesonContract;
    uniV2Contract;
    pionSwapContract;
    uniswapV2Router02;



    constructor() {
        this.metamaskService = new MetamaskService()
        this.pionContract = this.metamaskService.getContract(ContractDetails.PION.ABI, ContractDetails.PION.ADDRESS)
        this.uniPairContract = this.metamaskService.getContract(ContractDetails.UNI_PAIR.ABI, ContractDetails.UNI_PAIR.ADDRESS)
        this.prizeContract = this.metamaskService.getContract(ContractDetails.PRIZE.ABI, ContractDetails.PRIZE.ADDRESS)
        this.uniContract = this.metamaskService.getContract(ContractDetails.UNI.ABI, ContractDetails.UNI.ADDRESS)
        this.mesonContract = this.metamaskService.getContract(ContractDetails.MESON.ABI, ContractDetails.MESON.ADDRESS)
        this.uniV2Contract = this.metamaskService.getContract(ContractDetails.UNI_V2.ABI, ContractDetails.UNI_V2.ADDRESS)
        this.pionSwapContract = this.metamaskService.getContract(ContractDetails.PION_SWAP.ABI, ContractDetails.PION_SWAP.ADDRESS)
        this.pionV1Contract = this.metamaskService.getContract(ContractDetails.PION_V1.ABI, ContractDetails.PION_V1.ADDRESS)
        this.uniswapV2Router02 = this.metamaskService.getContract(ContractDetails.UNI_V2_ROUTER_02.ABI, ContractDetails.UNI_V2_ROUTER_02.ADDRESS)
    }


    swapV1ToV2 = (amount) => {
        return new Promise((resolve, reject) => {
            this.pionSwapContract.methods.swapTokens(amount)
                .call()
                .then(res => {
                    resolve(res)
                })
                .catch(err => reject(err))
        })
    }

    getUserSwaps = (address) => {
        return new Promise((resolve, reject) => {
            this.pionSwapContract.methods.getUserSwaps(address)
                .call()
                .then(res => {
                    resolve(res)
                })
                .catch(err => reject(err))
        })
    }

    estimateMaxReward = (amount) => {
        return new Promise((resolve, reject) => {
            this.mesonContract.methods.estimateMaxReward(BigNumber(amount).toFixed())
                .call()
                .then(res => {
                    resolve(res)
                })
                .catch(err => reject(err))
        })
    }

    getReservesUniPair = () => {
        return new Promise((resolve, reject) => {
            this.uniPairContract.methods.getReserves()
                .call()
                .then(res => {
                    resolve(res['_reserve1'] / (res['_reserve0'] * Math.pow(10, tokensDecimal.PION)))
                })
                .catch(err => reject(err))
        })
    }

    getAmountsOut = () => {
        return new Promise((resolve, reject) => {
            this.uniswapV2Router02.methods.getAmountsOut(1000000000, [contractDetails.PION.ADDRESS, contractDetails.WETH.ADDRESS])
                .call()
                .then(res => {
                    resolve(res)
                })
                .catch(err => reject(err))
        })
    }


    getUniV2Balance = (address) => {
        return new Promise((resolve, reject) => {
            this.uniV2Contract.methods.balanceOf(address)
                .call()
                .then(res => {
                    resolve(res)
                })
                .catch(err => reject(err))
        })
    }


    getPionV1Balance = (address) => {
        return new Promise((resolve, reject) => {
            this.pionV1Contract.methods.balanceOf(address)
                .call()
                .then(res => {
                    resolve(res / Math.pow(10, tokensDecimal.PION_SWAP))
                })
                .catch(err => reject(err))
        })
    }

    getPionBalance = (address) => {
        return new Promise((resolve, reject) => {
            this.pionContract.methods.balanceOf(address)
                .call()
                .then(res => {
                    resolve(res / Math.pow(10, tokensDecimal.PION))
                })
                .catch(err => reject(err))
        })
    }

    swapsById = (id) => {
        return new Promise((resolve, reject) => {
            this.pionSwapContract.methods.swapsById(id)
                .call()
                .then(res => {
                    resolve(res)
                })
                .catch(err => reject(err))
        })
    }

    swapPeriod = () => {
        return new Promise((resolve, reject) => {
            this.pionSwapContract.methods.swapPeriod()
                .call()
                .then(res => {
                    resolve(res)
                })
                .catch(err => reject(err))
        })
    }

    withdrawRemainingTokens = (swapId) => {
        return new Promise((resolve, reject) => {
            this.pionSwapContract.methods.withdrawRemainingTokens(swapId)
                .call()
                .then(res => {
                    resolve(res)
                })
                .catch(err => reject(err))
        })
    }

    totalRewardsClaimed = (address) => {
        return new Promise((resolve, reject) => {
            this.mesonContract.methods.totalRewardsClaimed(address)
                .call()
                .then(res => {
                    resolve(res)
                })
                .catch(err => reject(err))
        })
    }





    getUniPairBalance = (address) => {
        return new Promise((resolve, reject) => {
            this.uniPairContract.methods.balanceOf(address)
                .call()
                .then(res => {
                    resolve(res)
                })
                .catch(err => reject(err))
        })
    }

    getPrizeBalance = (address) => {
        return new Promise((resolve, reject) => {
            this.prizeContract.methods.balanceOf(address)
                .call()
                .then(res => {
                    resolve(res / Math.pow(10, tokensDecimal.PION))
                })
                .catch(err => reject(err))
        })
    }

    getUniBalance = (address) => {
        return new Promise((resolve, reject) => {
            this.uniContract.methods.balanceOf(address)
                .call()
                .then(res => {
                    resolve(res)
                })
                .catch(err => reject(err))
        })
    }

    totalStakedFor = (address) => {
        return new Promise((resolve, reject) => {
            this.mesonContract.methods.totalStakedFor(address)
                .call()
                .then(res => {
                    resolve(res)
                })
                .catch(err => reject(err))
        })
    }

    updateAccounting = (address) => {
        return new Promise((resolve, reject) => {
            this.mesonContract.methods.updateAccounting(address)
                .call()
                .then(res => {
                    resolve(res[5])
                })
                .catch(err => reject(err))
        })
    }

    totalStaked = () => {
        return new Promise((resolve, reject) => {
            this.mesonContract.methods.totalStaked()
                .call()
                .then(res => {
                    resolve(res)
                })
                .catch(err => reject(err))
        })
    }

    updateAccounting = () => {
        return new Promise((resolve, reject) => {
            this.mesonContract.methods.updateAccounting()
                .call()
                .then(res => {
                    resolve(res[4] / 86400)
                })
                .catch(err => reject(err))
        })
    }

    calculateRewardFor = (address, amount) => {
        return new Promise((resolve, reject) => {
            this.mesonContract.methods.calculateRewardFor(address, amount.toString())
                .call()
                .then(res => {
                    resolve(res)
                })
                .catch(err => reject(err))
        })
    }

    stake = (amount) => {
        return new Promise((resolve, reject) => {
            this.mesonContract.methods.stake(amount, '0x0000000000000000000000000000000000000000')
                .call()
                .then(res => {
                    resolve(res)
                })
                .catch(err => reject(err))
        })
    }


    totalLocked = () => {
        return this.mesonContract.methods.totalLocked().call()
    }

    totalUnlocked = () => {
        return this.mesonContract.methods.totalUnlocked().call()
    }


    approveToken = (address, collback) => {
        this.metamaskService.approveToken(address, ContractDetails.PRIZE.ADDRESS, collback, 'PION', 9)
    }
    approveSwapV1ToV2 = (address, collback) => {
        this.metamaskService.approveToken(address, ContractDetails.PION_SWAP.ADDRESS, collback, 'PION_V1', 18)
    }
    approveUniToken = (address, collback) => {
        this.metamaskService.approveToken(address, ContractDetails.MESON.ADDRESS, collback, 'UNI_V2', 18)
    }

    checkAllowance = (address, amount) => {
        return new Promise((resolve, reject) => {
            this.metamaskService.checkAllowance(address, ContractDetails.PRIZE.ADDRESS, amount, this.pionContract)
                .then(() => {
                    resolve(true)
                })
                .catch(() => {
                    reject(false)
                })
        })
    }

    checkSwapAllowance = (address, amount) => {
        return new Promise((resolve, reject) => {
            this.metamaskService.checkAllowance(address, ContractDetails.PION_SWAP.ADDRESS, amount, this.pionV1Contract)
                .then(() => {
                    resolve(true)
                })
                .catch(() => {
                    reject(false)
                })
        })
    }
    checkUniAllowance = (address, amount) => {
        return new Promise((resolve, reject) => {
            this.metamaskService.checkAllowance(address, ContractDetails.MESON.ADDRESS, amount, this.uniV2Contract)
                .then(() => {
                    resolve(true)
                })
                .catch(() => {
                    reject(false)
                })
        })
    }


    createTokenTransaction = ({ data, address, swapMethod, contractName = 'PRIZE', callback, withdraw, stake }) => {
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