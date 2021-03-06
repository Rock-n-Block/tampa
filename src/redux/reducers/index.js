import { combineReducers } from 'redux'

const reducers = ['user', 'modal', 'theme', 'lottery', 'graph']

export default combineReducers(
    reducers.reduce((initial, name) => {
        initial[name] = require(`./${name}`).default
        return initial
    }, {})
)