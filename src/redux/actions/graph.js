export default {
    setDots: (dots) => ({
        type: 'GRAPH:SET_DOTS',
        payload: dots
    }),
    setDividentsPool: (data) => ({
        type: 'GRAPH:SET_DIVIDENTS_POOL',
        payload: data
    })
}