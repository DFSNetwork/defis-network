// 系统性状态存储
const sys = {
  state: {
    baseConfig: {
    },
    // 区块链浏览器配置
    blockBrowser: {
      eos: {
        tx: 'https://bloks.io/transaction/',
        account: 'https://bloks.io/account/',
        token: 'https://bloks.io/tokens/',
      },
    },
    testConfig: { // 测试环境配置
      node: {
        area: "test",
        protocol: "https",
        host: "api.testnet.eos.io",
        // port: "443",
        url: "https://api.testnet.eos.io/",
        chainId: "cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f",
      },
      toAccountSwap: 'jinswap11112', // 主交易 swap 合约
      toAccountJin: ' jinbankoneo2', // JIN 合约
      toAccountByHyk: 'jintokensell', // 限量买HYK
      oracle: 'jinoracle113', // 价格合约
      hykContranct: '', // HYK 合约
      bonusAccount: 'jindaojindao', // 分红账号
      baseCoin: 'EOS', // 母币
      baseCoinContract: 'eosio.token',
      teamFunds: 'jinteamfunds', // 资金账户
    },
    devConfig: { // 开发环境配置
      node: {
        area: "dev",
        protocol: "http",
        host: "183.250.89.179",
        // port: "58888",
        url: "http://183.250.89.179:58888",
        chainId: "cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f",
      },
      toAccountSwap: 'jinswap11112', // 主交易 swap 合约
      toAccountJin: 'jinbankoneo2', // JIN 合约
      toAccountByHyk: 'jintokensell', // 限量买HYK
      hykContranct: 'jindaotokens', // HYK 合约
      bonusAccount: 'jindaojindao', // 分红账号
      oracle: 'jinoracle113', // 价格合约
      baseCoin: 'SYS', // 母币
      baseCoinContract: 'eosio.token',
      teamFunds: 'jinteamfunds', // 资金账户
    },
    proConfig: localStorage.getItem('proConfig') ? JSON.parse(localStorage.getItem('proConfig')) : { // 生产环境配置
      node: {
        area: 'production',
        protocol: 'https',
        host: 'eos.blockeden.cn', // eospush.tokenpocket.pro
        // port: '443',
        url: 'https://eos.blockeden.cn', // https://eospush.tokenpocket.pro https://eos.greymass.com
        chainId: "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906",
      },
      toAccountSwap: 'defisswapcnt', // 主交易 swap 合约
      toAccountJin: 'bankofusddv1', // JIN 合约
      toAccountByHyk: 'jintokensell', // 限量买HYK
      hykContranct: 'jindaotokens', // HYK 合约
      bonusAccount: 'jindaojindao', // 分红账号
      oracle: 'jinoraclesv1', // 价格合约
      baseCoin: 'EOS', // 母币
      baseCoinContract: 'eosio.token',
      teamFunds: 'jinteamfunds', // 资金账户
    },
    weightList: localStorage.getItem('weightList') ? JSON.parse(localStorage.getItem('weightList')) : [], // 挖矿权重列表
    aprs: localStorage.getItem('aprs') ? JSON.parse(localStorage.getItem('aprs')) : {}, // 全局aprs
    damping: localStorage.getItem('damping') || 0.75, // DFS流通量计算得出 - Math.pow(0.75, parseInt(dfsCurrent / 1000000))
    dfsPrice: localStorage.getItem('dfsPrice') || '0', // DFS 5分钟均价
    eggargs: localStorage.getItem('eggargs') ? JSON.parse(localStorage.getItem('eggargs')) : [], // 全局aprs
    feesApr: localStorage.getItem('feesApr') ? JSON.parse(localStorage.getItem('feesApr')) : [], // 全局aprs
    sortClass: {
      gold: [39, 329],
      // silver: [],
      // bronze: []
      silver: [5, 17, 309],
      bronze: [4, 305]
    },
    dsrPools: [{
      "id": 1,
      "bonus": "1.05000000000000000",
      "refund_delay_sec": 2592000
    },
    {
      "id": 2,
      "bonus": "1.10000000000000000",
      "refund_delay_sec": 7776000
    },
    {
      "id": 3,
      "bonus": "1.20000000000000000",
      "refund_delay_sec": 15552000
    },
    {
      "id": 4,
      "bonus": "1.50000000000000000",
      "refund_delay_sec": 31104000
    }],
    dfsData: {},
    poolsBal: '0.0000', // swap EOS数量

    // 挖矿年化计算数据
    list: [], // yfc挖矿列表
    dbcList: [], // DBC 挖矿列表
    yfcBal: '0.00000000', // YFC池子余额
    dbcBal: '0.00000000', // YFC池子余额
    dampingYfc: 1, // YFC挖矿衰减
    dampingDbc: 1, // DBC挖矿衰减
  },
  mutations: {
    SET_BASECONFIG: (state, baseConfig) => {
      state.baseConfig = baseConfig;
    },
    // 挖矿权重列表
    SET_WEIGHTLIST: (state, weightList) => {
      state.weightList = weightList;
      localStorage.setItem('weightList', JSON.stringify(weightList));
    },
    // 全局aprs
    SET_APRS: (state, aprs) => {
      state.aprs = aprs;
      localStorage.setItem('aprs', JSON.stringify(aprs));
    },
    SET_DAMPING: (state, damping) => {
      state.damping = damping;
      localStorage.setItem('damping', JSON.stringify(damping));
    },
    SET_DFSPRICE: (state, dfsPrice) => {
      state.dfsPrice = dfsPrice;
      localStorage.setItem('dfsPrice', dfsPrice);
    },
    SET_EGGARGS: (state, eggargs) => {
      state.eggargs = eggargs;
      localStorage.setItem('eggargs', JSON.stringify(eggargs));
    },
    SET_FEESAPR: (state, feesApr) => {
      state.feesApr = feesApr;
      localStorage.setItem('feesApr', JSON.stringify(feesApr));
    },
    SET_DfsData: (state, dfsData) => {
      state.dfsData = dfsData;
    },
    SET_PoolsBal: (state, poolsBal) => {
      state.poolsBal = poolsBal;
    },
    SET_List: (state, list) => {
      state.list = list;
    },
    SET_YfcBal: (state, yfcBal) => {
      state.yfcBal = yfcBal;
    },
    SET_DampingYfc: (state, dampingYfc) => {
      state.dampingYfc = dampingYfc;
    },
    SET_DbcList: (state, dbcList) => {
      state.dbcList = dbcList;
    },
    SET_DbcBal: (state, dbcBal) => {
      state.dbcBal = dbcBal;
    },
    SET_DampingDbc: (state, dampingDbc) => {
      state.dampingDbc = dampingDbc;
    },
  },
  actions: {
    setBaseConfig({ commit }, baseConfig) {
      commit('SET_BASECONFIG', baseConfig);
    },
    // 挖矿权重列表
    setWeightList({ commit }, weightList) {
      commit('SET_WEIGHTLIST', weightList);
    },
    // 全局aprs
    setAprs({ commit }, aprs) {
      commit('SET_APRS', aprs);
    },
    setDamping({ commit }, damping) {
      commit('SET_DAMPING', damping);
    },
    setDfsPrice({ commit }, dfsPrice) {
      commit('SET_DFSPRICE', dfsPrice);
    },
    setEggargs({ commit }, eggargs) {
      commit('SET_EGGARGS', eggargs);
    },
    setFeesApr({ commit }, feesApr) {
      commit('SET_FEESAPR', feesApr);
    },
    setDfsData({ commit }, dfsData) {
      commit('SET_DfsData', dfsData);
    },
    setPoolsBal({ commit }, poolsBal) {
      commit('SET_PoolsBal', poolsBal);
    },
    setList({ commit }, list) {
      commit('SET_List', list);
    },
    setYfcBal({ commit }, poolsBal) {
      commit('SET_YfcBal', poolsBal);
    },
    setDampingYfc({ commit }, poolsBal) {
      commit('SET_DampingYfc', poolsBal);
    },
    setDbcList({ commit }, dbcList) {
      commit('SET_DbcList', dbcList);
    },
    setDbcBal({ commit }, poolsBal) {
      commit('SET_DbcBal', poolsBal);
    },
    setDampingDbc({ commit }, poolsBal) {
      commit('SET_DampingDbc', poolsBal);
    },
  }
};

export default sys;
