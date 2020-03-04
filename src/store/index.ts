import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    passport: { logined: false },
    routeLoading: false
  },
  mutations: {
    passport(state, payload) {
      state.passport = payload;
    },
    routeLoading(state, isLoading) {
      state.routeLoading = isLoading;
    }
  },
  actions: {},
  getters: {
    passport: state => state.passport
  }
});
