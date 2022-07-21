import Vue from 'vue'
import Vuex from 'vuex'
import tokens from '../tokens'

Vue.use(Vuex)
export default new Vuex.Store({
    state: {
        bsc: {},
        baddr: false,
        buyerList:{}
        
    },
    mutations: {
        setBsc(state, bsc) {
            tokens.setbsc(bsc) // TODO: remove this injection later
            state.bsc = bsc
        },
        setBaddr(state, baddr) {
            state.baddr = baddr
        },
        setBuyerList(state, list) {
            state.buyerList = Object.assign({},list)
        }
    },
    actions: {},
    modules: {}
})
