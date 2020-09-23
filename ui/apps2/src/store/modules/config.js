// 系统性状态存储
const config = {
  state: {
    dmdMineConfig: [ // 钻石参与LP挖矿配置
      // {
      //   mid: 326,
      //   "poolid": 5,
      //   "epoch": 1599796800,
      //   "duration": 1209600,
      //   "maxSupply": 2000,
      //   "poolContract": "eosdmdpool15",
      //   "sTokenContract": "",
      //   "sTokenSymbol": "",
      //   "sTokenPrecision": 4
      // },
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
      // {
      //   mid: 344,
      //   duration: 1209600,
      //   epoch: 1599796800,
      //   maxSupply: 1000,
      //   poolContract: "eosdmdpool1b",
      //   poolid: 7,
      //   sTokenContract: "",
      //   sTokenPrecision: 4,
      //   sTokenSymbol: "",
      // }
    ],
    // YFC类型LP挖矿配置
    lpMid: [{
      mid: 329,
      symbol: 'YFC',
      contract: 'yfctokenmain', // 币种合约
      poolAcc: 'yfcfishponds', // 待瓜分余额
      decimal: 8,
    }, {
      mid: 346,
      symbol: 'DBC',
      contract: 'dbctokenmain', // 币种合约
      poolAcc: 'dbcfarmers11', // 待瓜分余额
      decimal: 8,
    }],
    lpMineList: {}, // 存放格式为 {YFC: [...],}
    lpPoolsBal: {}, // 存放格式为 {YFC: '1.00...'}
    lpDamping: {},  // 存放格式为 {YFC: 0.75, ...}
    tampList: 0,
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
  }
};

export default config;
