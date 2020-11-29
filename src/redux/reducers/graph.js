const initialState = {
    graphDots: [],
    stakeGraphDots: [],
    dividentsPool: 0
}

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case 'GRAPH:SET_DOTS':
            let zeroDot = payload[0]
            let stakeGraphDots = []
            const auctionDots = [...payload]
            if (payload.length > 7) {
                stakeGraphDots = payload.splice(-7)
                // stakeGraphDots.unshift(zeroDot)
            } else {
                stakeGraphDots = [...payload]
            }
            return {
                ...state,
                graphDots: auctionDots,
                stakeGraphDots
            };
        case 'GRAPH:SET_DIVIDENTS_POOL':
            return {
                ...state,
                dividentsPool: payload
            }
        default:
            return state
    }
}