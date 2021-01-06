import Vue from 'vue';
import Vuex from 'vuex';
import app from './modules/app';
import sys from './modules/sys';
import config from './modules/config';
import mine from './modules/mine';
import getters from './getters';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    app,
    sys,
    config,
    mine,
  },
  getters,
});

export default store;
