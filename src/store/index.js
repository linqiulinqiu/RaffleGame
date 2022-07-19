import Vue from 'vue'
import Vuex from 'vuex'
import tokens from '../tokens'

Vue.use(Vuex)
export default new Vuex.Store({
    state: {
        bsc: {},
        baddr: false,
        WBalance: 0,
        
    },
    mutations: {
        setBsc(state, bsc) {
            tokens.setbsc(bsc) // TODO: remove this injection later
            state.bsc = bsc
        },
        setBaddr(state, baddr) {
            state.baddr = baddr
        },
        setWBalance(state, balance) {
            state.WBalance = balance
        }
    },
    actions: {},
    modules: {}
})
