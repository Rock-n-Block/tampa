const initialState = {
    isLotteryStarted: window.localStorage.isLotteryStarted
}

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case 'LOTTERY:START':
            return {
                ...state,
                isLotteryStarted: true
            };
        default:
            return state
    }
}