// 系统性状态存储
const config = {
  state: {
    // YFC类型LP挖矿配置
    lpMid: [{
      mid: 459,
      symbol: 'PDD',
      contract: 'pddtokenmain', // 币种合约
      poolAcc: 'pddissuemain', // 待瓜分余额
      mineAcc: 'pddfarmers11', // 挖矿操作合约账户
      decimal: 8,
    }],
    lpMineList: {}, // 存放格式为 {YFC: [...],}
    lpPoolsBal: {}, // 存放格式为 {YFC: '1.00...'}
    lpDamping: {},  // 存放格式为 {YFC: 0.75, ...}
    tampList: 0,
    // TAG LP Mids
    tagLpMids: localStorage.getItem('tagLpMids') ? JSON.parse(localStorage.getItem('tagLpMids')) : [],

    // market 过滤配置列表
    mkFilterConf: [{
      symbol: 'EOS',
      sym: '4,EOS',
      contract: 'eosio.token',
      minEos: 100, // 最低价值 100 EOS
      priceMid: 17,
    }, {
      symbol: 'USDT',
      sym: '4,USDT',
      contract: 'tethertether',
      minEos: 100, // 最低价值 100 EOS
      priceMid: 17,
    }, {
      symbol: 'TAG',
      sym: '8,TAG',
      contract: 'tagtokenmain',
      minEos: 100, // 最低价值 100 EOS
      priceMid: 602,
    }, {
      symbol: 'DFS',
      sym: '4,DFS',
      contract: 'minedfstoken',
      minEos: 100, // 最低价值 100 EOS
      priceMid: 39,
    }, {
      symbol: 'USDC',
      sym: '4,USDC',
      contract: 'usdxusdxusdx',
      minEos: 100, // 最低价值 100 EOS
      priceMid: 738,
    }],

    // pddex Data
    boxMids: [], // 设置Box的做市Mid
    marketLists: localStorage.getItem('pddexMarketLists') ? JSON.parse(localStorage.getItem('pddexMarketLists')) : [], // pddex使用的做市列表 - 整合DFS 和 BOX
    hotLists: [],
  },
  mutations: {
    SET_LpMineList: (state, lpMineList) => {
      state.lpMineList = lpMineList;
      state.tampList = Math.random() * 1000;
    },
    SET_LpPoolsBal: (state, lpPoolsBal) => {
      state.lpPoolsBal = lpPoolsBal;
    },
    SET_LpDamping: (state, lpDamping) => {
      state.lpDamping = lpDamping;
    },
    // pddex Data
    SET_BOXMIDS: (state, boxMids) => {
      state.boxMids = boxMids;
    },
    SET_PddexMarketLists: (state, marketLists) => {
      state.marketLists = marketLists;
      localStorage.setItem('pddexMarketLists', JSON.stringify(marketLists))
    },
    SET_TagLpMids: (state, tagLpMids) => {
      state.tagLpMids = tagLpMids;
      localStorage.setItem('tagLpMids', JSON.stringify(tagLpMids))
    },
  },
  actions: {
    setLpMineList({ commit }, baseConfig) {
      commit('SET_LpMineList', baseConfig);
    },
    setLpPoolsBal({ commit }, lpPoolsBal) {
      commit('SET_LpPoolsBal', lpPoolsBal);
    },
    setLpDamping({ commit }, lpDamping) {
      commit('SET_LpDamping', lpDamping);
    },
    // pddex Data
    setBoxMids({ commit }, boxMids) {
      commit('SET_BOXMIDS', boxMids);
    },
    setPddexMarketLists({ commit }, marketLists) {
      commit('SET_PddexMarketLists', marketLists);
    },
    setTagLpMids({ commit }, tagLpMids) {
      commit('SET_TagLpMids', tagLpMids);
    },
  }
};

export default config;
