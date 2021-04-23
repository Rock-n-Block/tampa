const initialState = {
    open: false,
    content: null,
    footer: [],
}

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case 'DIALOG:TOGGLE':
            return {
                ...state,
                ...payload
            };
        default:
            return state
    }
}