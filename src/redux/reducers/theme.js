const initialState = {
    isDarkTheme: window.localStorage.isDarkTheme!==undefined ? window.localStorage.isDarkTheme : true
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