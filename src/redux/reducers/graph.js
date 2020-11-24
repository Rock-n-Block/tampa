const initialState = {
    graphDots: [],
    stakeGraphDots: []
}

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case 'GRAPH:SET_DOTS':
            let zeroDot = payload[0]
            let stakeGraphDots = []
            const auctionDots = [...payload]
            if (payload.length > 7) {
                stakeGraphDots = payload.splice(-7)
            }
            stakeGraphDots.unshift(zeroDot)
            return {
                ...state,
                graphDots: auctionDots,
                stakeGraphDots
            };
        default:
            return state
    }
}