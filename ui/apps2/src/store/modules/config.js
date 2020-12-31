// 系统性状态存储
const config = {
  state: {
    dmdMineConfig: [ // 钻石参与LP挖矿配置
      {
        mid: 39,
        duration: 31104000,
        epoch: 1600855200,
        maxSupply: 500,
        poolContract: "eosdmdpool1d",
        poolid: 9,
        sTokenContract: "",
        sTokenPrecision: 4,
        sTokenSymbol: "",
      },
      { // hub
        mif: 344,
        duration: 1209600,
        epoch: 1599796800,
        maxSupply: 2000,
        poolContract: "eosdmdpool1b",
        poolid: 7,
        sTokenContract: "",
        sTokenPrecision: 4,
        sTokenSymbol: "",
      },
      {
        mid: 329,
        duration: 1209600,
        epoch: 1599796800,
        maxSupply: 2000,
        poolContract: "eosdmdpool1a",
        poolid: 6,
        sTokenContract: "",
        sTokenPrecision: 4,
        sTokenSymbol: "",
      },
    ],
    // YFC类型LP挖矿配置
    lpMid: [
      // {
      // mid: 329,
      // symbol: 'YFC',
      // contract: 'yfctokenmain', // 币种合约
      // poolAcc: 'yfcfishponds', // 待瓜分余额
      // mineAcc: 'yfcfishponds', // 挖矿操作合约账户
      // decimal: 8,
      // }, 
    //   {
    //   mid: 346,
    //   symbol: 'DBC',
    //   contract: 'dbctokenmain', // 币种合约
    //   poolAcc: 'dbcfarmers11', // 待瓜分余额
    //   mineAcc: 'dbcfarmers11', // 挖矿操作合约账户
    //   decimal: 8,
    // }, 
    {
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
    // Time 挖矿列表
    timeList: [],
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
    }],

    // pddex Data
    boxMids: [], // 设置Box的做市Mid
    marketLists: [], // pddex使用的做市列表 - 整合DFS 和 BOX
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
    SET_TimeList: (state, timeList) => {
      state.timeList = timeList;
    },
    // pddex Data
    SET_BOXMIDS: (state, boxMids) => {
      state.boxMids = boxMids;
    },
    SET_PddexMarketLists: (state, marketLists) => {
      state.marketLists = marketLists;
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
    setTimeList({ commit }, timeList) {
      commit('SET_TimeList', timeList);
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
