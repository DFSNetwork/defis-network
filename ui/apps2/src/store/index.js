import Vue from 'vue';
import Vuex from 'vuex';
import app from './modules/app';
import sys from './modules/sys';
import config from './modules/config';
import getters from './getters';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    app,
    sys,
    config,
  },
  getters,
});

export default store;
