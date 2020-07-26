import Vue from 'vue';
import Vuex from 'vuex';
import app from './modules/app';
import sys from './modules/sys';
import getters from './getters';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    app,
    sys,
  },
  getters,
});

export default store;
