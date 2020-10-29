const initialState = {
    isLightTheme: true
}

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case 'THEME:TOGGLE':
            return {
                ...state,
                isLightTheme: payload
            };
        default:
            return state
    }
}