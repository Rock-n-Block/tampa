export default {
    TAMPA: {
        ADDRESS: '0x3C96a8de8d9A650E96d64300CEC1a44e7A909E92',
        ABI: [
            {
                "inputs": [

                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "constructor"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "spender",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "value",
                        "type": "uint256"
                    }
                ],
                "name": "Approval",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "updaterAddr",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "timestamp",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "beginDay",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "endDay",
                        "type": "uint256"
                    }
                ],
                "name": "DailyDataUpdate",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "previousOwner",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "newOwner",
                        "type": "address"
                    }
                ],
                "name": "OwnershipTransferred",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "uint40",
                        "name": "stakeId",
                        "type": "uint40"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "timestamp",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "newShareRate",
                        "type": "uint256"
                    }
                ],
                "name": "ShareRateChange",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "uint40",
                        "name": "stakeId",
                        "type": "uint40"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint40",
                        "name": "prevUnlocked",
                        "type": "uint40"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "stakerAddr",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "lockedDay",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "servedDays",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "stakedSuns",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "stakeShares",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "payout",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "penalty",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "stakeReturn",
                        "type": "uint256"
                    }
                ],
                "name": "StakeEnd",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "uint40",
                        "name": "stakeId",
                        "type": "uint40"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "stakerAddr",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "senderAddr",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "stakedSuns",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "stakeShares",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "payout",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "penalty",
                        "type": "uint256"
                    }
                ],
                "name": "StakeGoodAccounting",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "uint40",
                        "name": "stakeId",
                        "type": "uint40"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "stakerAddr",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "stakedSuns",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "stakeShares",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "stakedDays",
                        "type": "uint256"
                    }
                ],
                "name": "StakeStart",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "from",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "to",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "value",
                        "type": "uint256"
                    }
                ],
                "name": "Transfer",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "timestamp",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "enterDay",
                        "type": "uint256"
                    },
                    {
                        "indexed": true,
                        "internalType": "uint256",
                        "name": "entryIndex",
                        "type": "uint256"
                    },
                    {
                        "indexed": true,
                        "internalType": "uint256",
                        "name": "rawAmount",
                        "type": "uint256"
                    }
                ],
                "name": "XfLobbyEnter",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "timestamp",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "enterDay",
                        "type": "uint256"
                    },
                    {
                        "indexed": true,
                        "internalType": "uint256",
                        "name": "entryIndex",
                        "type": "uint256"
                    },
                    {
                        "indexed": true,
                        "internalType": "uint256",
                        "name": "xfAmount",
                        "type": "uint256"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "referrerAddr",
                        "type": "address"
                    }
                ],
                "name": "XfLobbyExit",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "timestamp",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "enterDay",
                        "type": "uint256"
                    },
                    {
                        "indexed": true,
                        "internalType": "uint256",
                        "name": "rawAmount",
                        "type": "uint256"
                    }
                ],
                "name": "loteryLobbyEnter",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "timestamp",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "enterDay",
                        "type": "uint256"
                    },
                    {
                        "indexed": true,
                        "internalType": "uint256",
                        "name": "rawAmount",
                        "type": "uint256"
                    }
                ],
                "name": "loteryLobbyExit",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "day",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "address",
                        "name": "who",
                        "type": "address"
                    }
                ],
                "name": "loteryWin",
                "type": "event"
            },
            {
                "payable": true,
                "stateMutability": "payable",
                "type": "fallback"
            },
            {
                "constant": true,
                "inputs": [

                ],
                "name": "allocatedSupply",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "spender",
                        "type": "address"
                    }
                ],
                "name": "allowance",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "spender",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "name": "approve",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "account",
                        "type": "address"
                    }
                ],
                "name": "balanceOf",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "stakeSharesParam",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "beginDay",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "endDay",
                        "type": "uint256"
                    }
                ],
                "name": "calcPayoutDividendsReward",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "payout",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "stakeSharesParam",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "beginDay",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "endDay",
                        "type": "uint256"
                    }
                ],
                "name": "calcPayoutRewards",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "payout",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "stakeSharesParam",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "beginDay",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "endDay",
                        "type": "uint256"
                    }
                ],
                "name": "calcPayoutRewardsBonusDays",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "payout",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [

                ],
                "name": "currentDay",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "name": "dailyData",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "dayPayoutTotal",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "dayDividends",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "dayStakeSharesTotal",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "beginDay",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "endDay",
                        "type": "uint256"
                    }
                ],
                "name": "dailyDataRange",
                "outputs": [
                    {
                        "internalType": "uint256[]",
                        "name": "_dayStakeSharesTotal",
                        "type": "uint256[]"
                    },
                    {
                        "internalType": "uint256[]",
                        "name": "_dayPayoutTotal",
                        "type": "uint256[]"
                    },
                    {
                        "internalType": "uint256[]",
                        "name": "_dayDividends",
                        "type": "uint256[]"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "beforeDay",
                        "type": "uint256"
                    }
                ],
                "name": "dailyDataUpdate",
                "outputs": [

                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "name": "dayChanceCount",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [

                ],
                "name": "decimals",
                "outputs": [
                    {
                        "internalType": "uint8",
                        "name": "",
                        "type": "uint8"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "spender",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "subtractedValue",
                        "type": "uint256"
                    }
                ],
                "name": "decreaseAllowance",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [

                ],
                "name": "defaultReferrerAddr",
                "outputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "endDay",
                        "type": "uint256"
                    }
                ],
                "name": "endLoteryDay",
                "outputs": [

                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "stakerAddr",
                        "type": "address"
                    }
                ],
                "name": "endedStakeCount",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "name": "endedStakeLists",
                "outputs": [
                    {
                        "internalType": "uint40",
                        "name": "stakeId",
                        "type": "uint40"
                    },
                    {
                        "internalType": "uint256",
                        "name": "stakedSuns",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "stakeShares",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint16",
                        "name": "lockedDay",
                        "type": "uint16"
                    },
                    {
                        "internalType": "uint16",
                        "name": "stakedDays",
                        "type": "uint16"
                    },
                    {
                        "internalType": "uint16",
                        "name": "unlockedDay",
                        "type": "uint16"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [

                ],
                "name": "flushAddr",
                "outputs": [
                    {
                        "internalType": "address payable",
                        "name": "",
                        "type": "address"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "name": "fromReferrs",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "day",
                        "type": "uint256"
                    }
                ],
                "name": "getDayUnixTime",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "pure",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [

                ],
                "name": "getFirstAuction",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    },
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [

                ],
                "name": "globalInfo",
                "outputs": [
                    {
                        "internalType": "uint256[10]",
                        "name": "",
                        "type": "uint256[10]"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [

                ],
                "name": "globals",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "lockedSunsTotal",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "nextStakeSharesTotal",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint40",
                        "name": "shareRate",
                        "type": "uint40"
                    },
                    {
                        "internalType": "uint256",
                        "name": "stakePenaltyTotal",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint16",
                        "name": "dailyDataCount",
                        "type": "uint16"
                    },
                    {
                        "internalType": "uint256",
                        "name": "stakeSharesTotal",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint40",
                        "name": "latestStakeId",
                        "type": "uint40"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "spender",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "addedValue",
                        "type": "uint256"
                    }
                ],
                "name": "increaseAllowance",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [

                ],
                "name": "isOwner",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [

                ],
                "name": "lastEndedLoteryDay",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "name": "loteryCount",
                "outputs": [
                    {
                        "internalType": "address",
                        "name": "who",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "chanceCount",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "day",
                        "type": "uint256"
                    }
                ],
                "name": "loteryCountLen",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "name": "loteryLobby",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "change",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "chanceCount",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [

                ],
                "name": "name",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [

                ],
                "name": "owner",
                "outputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [

                ],
                "name": "renounceOwnership",
                "outputs": [

                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "_defaultReferrerAddr",
                        "type": "address"
                    }
                ],
                "name": "setDefaultReferrerAddr",
                "outputs": [

                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "internalType": "address payable",
                        "name": "_flushAddr",
                        "type": "address"
                    }
                ],
                "name": "setFlushAddr",
                "outputs": [

                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "stakerAddr",
                        "type": "address"
                    }
                ],
                "name": "stakeCount",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "stakeIndex",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint40",
                        "name": "stakeIdParam",
                        "type": "uint40"
                    }
                ],
                "name": "stakeEnd",
                "outputs": [

                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "stakerAddr",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "stakeIndex",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint40",
                        "name": "stakeIdParam",
                        "type": "uint40"
                    }
                ],
                "name": "stakeGoodAccounting",
                "outputs": [

                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "name": "stakeLists",
                "outputs": [
                    {
                        "internalType": "uint40",
                        "name": "stakeId",
                        "type": "uint40"
                    },
                    {
                        "internalType": "uint256",
                        "name": "stakedSuns",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "stakeShares",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint16",
                        "name": "lockedDay",
                        "type": "uint16"
                    },
                    {
                        "internalType": "uint16",
                        "name": "stakedDays",
                        "type": "uint16"
                    },
                    {
                        "internalType": "uint16",
                        "name": "unlockedDay",
                        "type": "uint16"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "newStakedSuns",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "newStakedDays",
                        "type": "uint256"
                    }
                ],
                "name": "stakeStart",
                "outputs": [

                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [

                ],
                "name": "symbol",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "name": "tampaReceivedAuction",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [

                ],
                "name": "totalSupply",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "recipient",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "name": "transfer",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "sender",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "recipient",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "name": "transferFrom",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "newOwner",
                        "type": "address"
                    }
                ],
                "name": "transferOwnership",
                "outputs": [

                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "name": "winners",
                "outputs": [
                    {
                        "internalType": "address payable",
                        "name": "who",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "totalAmount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "restAmount",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "day",
                        "type": "uint256"
                    }
                ],
                "name": "withdrawLotery",
                "outputs": [

                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [

                ],
                "name": "xfFlush",
                "outputs": [

                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "name": "xfLobby",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "referrerAddr",
                        "type": "address"
                    }
                ],
                "name": "xfLobbyEnter",
                "outputs": [

                ],
                "payable": true,
                "stateMutability": "payable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "memberAddr",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "enterDay",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "entryIndex",
                        "type": "uint256"
                    }
                ],
                "name": "xfLobbyEntry",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "rawAmount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "referrerAddr",
                        "type": "address"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "enterDay",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "count",
                        "type": "uint256"
                    }
                ],
                "name": "xfLobbyExit",
                "outputs": [

                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "name": "xfLobbyMembers",
                "outputs": [
                    {
                        "internalType": "uint40",
                        "name": "headIndex",
                        "type": "uint40"
                    },
                    {
                        "internalType": "uint40",
                        "name": "tailIndex",
                        "type": "uint40"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "memberAddr",
                        "type": "address"
                    }
                ],
                "name": "xfLobbyPendingDays",
                "outputs": [
                    {
                        "internalType": "uint256[2]",
                        "name": "words",
                        "type": "uint256[2]"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "beginDay",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "endDay",
                        "type": "uint256"
                    }
                ],
                "name": "xfLobbyRange",
                "outputs": [
                    {
                        "internalType": "uint256[]",
                        "name": "list",
                        "type": "uint256[]"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            }
        ]
    },


}