/*
* vuex 全站存储
* get: this.$store.state.模块.state
* 如： this.$store.state.app.language
* set: this.$store.dispatch(actions, value)
* 如： this.$store.dispatch('setLanguage', 'en');
*/

const app = {
  state: {
    // 多语言
    language: localStorage.getItem('language') || 'en',
    // 主题 默认白天
    theme: localStorage.getItem('theme') || 'theme-278EDA',
    // 钱包账户对象
    scatter: sessionStorage.getItem('scatter') ? JSON.parse(sessionStorage.getItem('scatter')) : {
      identity: null,
      wallet: '',
      chain: 'eos',
      online: false, // 账户是否在线
    },
    // 节点切换参数
    nodeChecked: localStorage.getItem('nodeChecked') ? JSON.parse(localStorage.getItem('nodeChecked')) : {
      eos: {},
      timer: '',
    },
    slipPoint: localStorage.getItem('slipPoint') ? parseInt(localStorage.getItem('slipPoint')) : 1,
    rSwitch: localStorage.getItem('rSwitch') ? JSON.parse(localStorage.getItem('rSwitch')) : true,
    minScreen: false,
    accInfo: {
      avatar: "https://cdn.jsdelivr.net/gh/defis-net/material2/coin/tagtokenmain-tag.png",
      cover: "https://cdn.jsdelivr.net/gh/defis-net/material/accBanner/banner0.png",
      desc: "",
      nick: "",
      sex: 2,
    },
    account: {},
    accFollow: [],
  },
  mutations: {
    SET_ACCINFO: (state, accInfo) => {
      state.accInfo = accInfo;
    },
    SET_MINSCREEN: (state, minScreen) => {
      state.minScreen = minScreen;
    },
    SET_LANGUAGE: (state, language) => {
      state.language = language;
      localStorage.setItem('language', language);
    },
    SET_THEME: (state, theme) => {
      state.theme = theme;
      localStorage.setItem('theme', theme);
      // localStorage.removeItem('tradingview.chartproperties');
    },
    SET_SCATTER: (state, scatter) => {
      state.scatter = scatter;
      sessionStorage.setItem('scatter', JSON.stringify(scatter));
    },
    SET_NODECHECKED: (state, nodeChecked) => {
      state.nodeChecked = nodeChecked;
      localStorage.setItem('nodeChecked', JSON.stringify(nodeChecked));
    },
    SET_SLIPPOINT: (state, slipPoint) => {
      state.slipPoint = slipPoint;
      localStorage.setItem('slipPoint', JSON.stringify(slipPoint));
    },
    SET_rSwitch: (state, rSwitch) => {
      state.rSwitch = rSwitch;
      localStorage.setItem('rSwitch', JSON.stringify(rSwitch));
    },
    SET_ACCOUNT: (state, account) => {
      state.account = account;
    },
    SET_ACCFOLLOW: (state, accFollow) => {
      state.accFollow = accFollow;
    },
  },
  actions: {
    setAccInfo({ commit }, accInfo) {
      commit('SET_ACCINFO', accInfo);
    },
    setMinScreen({ commit }, minScreen) {
      commit('SET_MINSCREEN', minScreen);
    },
    setLanguage({ commit }, language) {
      commit('SET_LANGUAGE', language);
    },
    setTheme({ commit }, theme) {
      commit('SET_THEME', theme);
    },
    setScatter({ commit }, scatter) {
      commit('SET_SCATTER', scatter);
    },
    setNodeChecked({ commit }, nodeChecked) {
      commit('SET_NODECHECKED', nodeChecked);
    },
    setSlipPoint({ commit }, slipPoint) {
      commit('SET_SLIPPOINT', Number(slipPoint));
    },
    setRSwitch({ commit }, rSwitch) {
      commit('SET_rSwitch', rSwitch);
    },
    setAccount({ commit }, account) {
      commit('SET_ACCOUNT', account);
    },
    setAccFollow({ commit }, accFollow) {
      commit('SET_ACCFOLLOW', accFollow);
    },
  }
};

export default app;
