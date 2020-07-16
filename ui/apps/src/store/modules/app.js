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
    // 用户信息存储
    userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : {},
    klineConfig: { // k线配置
      interval: '15', // 分辨率，时间
    },
    // 节点切换参数
    nodeChecked: localStorage.getItem('nodeChecked') ? JSON.parse(localStorage.getItem('nodeChecked')) : {
      eos: {},
      timer: '',
    },
    // 公告数据
    notice: localStorage.getItem('notice') ? JSON.parse(localStorage.getItem('notice')) : [],
    auctionRecord: { // 抢拍订单信息
      marginCallInfo: {}, // 爆仓订单
      currenUserInfo: [], // 当前选中订单
      finishOrder: [] // 订单完成数据
    },
    wsRealPrice: {}, // ws推送的价格
    wsNewdexPrice: {}, // ws推送的Newdex价格
    userOpenPosition: {}, // 用户开仓信息
    wsOrderListen: { // 订单更新监听
      res: {},
      listener: 0,
      t: Math.random()
    },
  },
  mutations: {
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
    SET_USERINFO: (state, userInfo) => {
      state.userInfo = userInfo;
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
    },
    SET_KLINECONFIG: (state, klineConfig) => {
      state.klineConfig = klineConfig;
    },
    SET_NODECHECKED: (state, nodeChecked) => {
      state.nodeChecked = nodeChecked;
      localStorage.setItem('nodeChecked', JSON.stringify(nodeChecked));
    },
    SET_NOTICE: (state, notice) => {
      state.notice = notice;
      localStorage.setItem('notice', JSON.stringify(notice));
    },
    // 爆仓订单
    SET_MARGINCALLINFO: (state, marginCallInfo) => {
      state.auctionRecord.marginCallInfo = marginCallInfo;
    },
    // 当前抢拍订单
    SET_CURRENUSERINFO: (state, currenUserInfo) => {
      state.auctionRecord.currenUserInfo = currenUserInfo;
    },
    // 订单完成数据
    SET_FINISHORDER: (state, finishOrder) => {
      state.auctionRecord.finishOrder = finishOrder;
    },
    // ws推送的价格
    SET_WSREALPRICE: (state, wsRealPrice) => {
      state.wsRealPrice = wsRealPrice;
    },
    // ws推送的Newdex价格
    SET_WSNEWDEXPRICE: (state, wsNewdexPrice) => {
      state.wsNewdexPrice = wsNewdexPrice;
    },
    // 用户开仓信息
    SET_USEROPENPOSITION: (state, userOpenPosition) => {
      state.userOpenPosition = userOpenPosition;
    },
    // 订单更新监听
    SET_WSORDERLISTEN: (state, wsOrderListen) => {
      state.wsOrderListen = wsOrderListen;
    },
  },
  actions: {
    setLanguage({ commit }, language) {
      commit('SET_LANGUAGE', language);
    },
    setTheme({ commit }, theme) {
      commit('SET_THEME', theme);
    },
    setScatter({ commit }, scatter) {
      commit('SET_SCATTER', scatter);
    },
    setUserInfo({ commit }, userInfo) {
      commit('SET_USERINFO', userInfo);
    },
    setKlineConfig({ commit }, klineConfig) {
      commit('SET_KLINECONFIG', klineConfig);
    },
    setNodeChecked({ commit }, nodeChecked) {
      commit('SET_NODECHECKED', nodeChecked);
    },
    setNotice({ commit }, notice) {
      commit('SET_NOTICE', notice);
    },
    // 爆仓订单
    setMarginCallInfoo({ commit }, marginCallInfo) {
      commit('SET_MARGINCALLINFO', marginCallInfo);
    },
    // 当前抢拍订单
    setCurrenUserInfo({ commit }, currenUserInfo) {
      commit('SET_CURRENUSERINFO', currenUserInfo);
    },
    // 订单完成数据
    setFinishOrder({ commit }, finishOrder) {
      commit('SET_FINISHORDER', finishOrder);
    },
    // ws推送的价格
    setWsRealPrice({ commit }, wsRealPrice) {
      commit('SET_WSREALPRICE', wsRealPrice);
    },
    // ws推送的Newdex价格
    setWsNewdexPrice({ commit }, wsNewdexPrice) {
      commit('SET_WSNEWDEXPRICE', wsNewdexPrice);
    },
    // 用户开仓信息
    setUserOpenPosition({ commit }, userOpenPosition) {
      commit('SET_USEROPENPOSITION', userOpenPosition);
    },
    // 订单更新监听
    setWsOrderListen({ commit }, wsOrderListen) {
      commit('SET_WSORDERLISTEN', wsOrderListen);
    },
  }
};

export default app;
