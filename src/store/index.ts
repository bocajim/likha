import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from "vuex-persist";
Vue.use(Vuex)

const vuexLocal = new VuexPersistence({
    storage: window.localStorage
})

export default new Vuex.Store({
    state: {
        scores: [],
        players: []
    },
    mutations: {
        saveState(state: any, data: any) {
            state.scores = data.scores;
            state.players = data.players;
        },
        resetState(state: any) {
            state.scores = []
            state.players = []
        }
    },
    actions: {
        save({commit}, state: { scores: any; players: any}) {
            return new Promise((resolve) => {
                commit('saveState',{scores: state.scores, players: state.players})
                resolve();
            })
        },
        reset({commit}) {
            return new Promise((resolve) => {
                commit('resetState')
                resolve();
            })
        },
        getState({state}) {
            return new Promise((resolve) => {
                resolve({scores: state.scores, players: state.players});
            })
        }
    },
    modules: {},
    plugins: [vuexLocal.plugin]
})
