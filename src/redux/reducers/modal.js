const initialState = {
    isOpen: false
}

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case 'MODAL:TOGGLE':
            return {
                ...state,
                isOpen: payload
            };
        default:
            return state
    }
}