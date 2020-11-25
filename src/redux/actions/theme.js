export default {
    toggleTheme: data => {
        window.localStorage.isDarkTheme = data ? true : ''
        return {
            type: 'THEME:TOGGLE',
            payload: data
        }
    }
}