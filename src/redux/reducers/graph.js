const initialState = {
    graphDots: []
}

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case 'GRAPH:SET_DOTS':
            return {
                ...state,
                graphDots: payload
            };
        default:
            return state
    }
}