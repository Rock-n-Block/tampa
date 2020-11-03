const initialState = {
    isDarkTheme: false
}

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case 'THEME:TOGGLE':
            return {
                ...state,
                isDarkTheme: payload
            };
        default:
            return state
    }
}