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
        port: "443",
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
      // nodePools config
      nodeMiner: 'tagtokenmine',
      nodeToken: 'tagtokentest',
      nodecoin: 'tagissuetest',
      fundation: 'dfsfundatest',
      lpPools: 'tageosmining',
      // pddex config
      swap: 'defisswapcnt',
      pddex: 'pddex.dfs',
      box: 'swap.defi',
    },
    devConfig: { // 开发环境配置
      node: {
        area: 'production',
        protocol: 'https',
        host: 'eos.blockeden.cn', // eospush.tokenpocket.pro
        port: '443',
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
      type: true,
      // nodePools config
      nodeMiner: 'tagtokenmine',
      nodeToken: 'tagtokentest',
      nodecoin: 'tagissuetest',
      fundation: 'dfsfundatest',
      lpPools: 'tageosmining',
      // pddex config
      swap: 'defisswapcnt',
      pddex: 'pddex.dfs',
      box: 'swap.defi',
    },
    proConfig: { // 生产环境配置
      node: localStorage.getItem('proConfig') ? JSON.parse(localStorage.getItem('proConfig')).node : {
        area: 'production',
        protocol: 'https',
        host: 'eos.blockeden.cn', // eospush.tokenpocket.pro
        port: '443',
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
      isNewConfig: true,
      // nodePools config
      nodeMiner: 'tagtokenfarm',
      nodeToken: 'tagtokenmain',
      nodecoin: 'tagissuemain',
      fundation: 'dfsfundation',
      lpPools: 'tageosmining',
      // pddex config
      swap: 'defisswapcnt',
      pddex: 'pddex.dfs',
      box: 'swap.defi',
    },
    damping: localStorage.getItem('damping') || 0.75, // DFS流通量计算得出 - Math.pow(0.75, parseInt(dfsCurrent / 1000000))
    dfsPrice: localStorage.getItem('dfsPrice') || '0', // DFS 5分钟均价
    eggargs: localStorage.getItem('eggargs') ? JSON.parse(localStorage.getItem('eggargs')) : [], // 全局aprs
    feesApr: localStorage.getItem('feesApr') ? JSON.parse(localStorage.getItem('feesApr')) : [], // 全局aprs
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
    rankInfoV3: localStorage.getItem('rankInfoV3') ? JSON.parse(localStorage.getItem('rankInfoV3')) : [], // 挖矿权重列表,
    rankTrade: localStorage.getItem('rankTrade') ? JSON.parse(localStorage.getItem('rankTrade')) : [], // 挖矿权重列表,
    dfsData: {},
    poolsBal: '0.0000', // swap EOS数量
    poolsTagBal: localStorage.getItem('poolsTagBal') ? localStorage.getItem('poolsTagBal') : '1000.00000000', // swap TAG数量

    // 挖矿年化计算数据
    list: [], // yfc挖矿列表
    dbcList: [], // DBC 挖矿列表
    yfcBal: '0.00000000', // YFC池子余额
    dbcBal: '0.00000000', // YFC池子余额
    dampingYfc: 1, // YFC挖矿衰减
    dampingDbc: 1, // DBC挖矿衰减

    marketLists: localStorage.getItem('marketLists') ? JSON.parse(localStorage.getItem('marketLists')) : [], // 做市列表
    filterMkLists: localStorage.getItem('filterMkLists') ? JSON.parse(localStorage.getItem('filterMkLists')) : [], // 过滤后的做市列表

    // TagLp余额
    tagLpBal: 0,

    nodeLists: [],
    nodeListsTamp: Number(localStorage.getItem('nodeListsTamp') || 0),
    // pddex
    tradeInfo: {},
    usdtPrice: 6.5,
    coinPrices: localStorage.getItem('coinPrices') ? JSON.parse(localStorage.getItem('coinPrices')) : [], // 常用价格
  },
  mutations: {
    SET_CoinPrices: (state, coinPrices) => {
      state.coinPrices = coinPrices;
      localStorage.setItem('coinPrices', JSON.stringify(coinPrices))
    },
    SET_UsdtPrice: (state, usdtPrice) => {
      state.usdtPrice = usdtPrice;
    },
    SET_TagLpBal: (state, tagLpBal) => {
      state.tagLpBal = tagLpBal;
    },
    SET_NodeLists: (state, nodeLists) => {
      state.nodeLists = nodeLists;
    },
    SET_NodeListsTamp: (state, nodeListsTamp) => {
      state.nodeListsTamp = nodeListsTamp;
    },
    SET_RANKINFOV3: (state, rankInfoV3) => {
      state.rankInfoV3 = rankInfoV3;
    },
    SET_RANKTRADE: (state, rankTrade) => {
      state.rankTrade = rankTrade;
    },
    SET_BASECONFIG: (state, baseConfig) => {
      state.baseConfig = baseConfig;
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
    SET_PoolsTagBal: (state, poolsTagBal) => {
      state.poolsTagBal = poolsTagBal;
      localStorage.setItem('poolsTagBal', poolsTagBal)
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
    SET_MarketLists: (state, marketLists) => {
      state.marketLists = marketLists;
      localStorage.setItem('marketLists', JSON.stringify(marketLists))
    },
    SET_FilterMkLists: (state, filterMkLists) => {
      state.filterMkLists = filterMkLists;
      localStorage.setItem('filterMkLists', JSON.stringify(filterMkLists))
    },
    // pddex
    SET_TRADEINFO: (state, tradeInfo) => {
      state.tradeInfo = tradeInfo;
    },
  },
  actions: {
    setCoinPrices({ commit }, coinPrices) {
      commit('SET_CoinPrices', coinPrices);
    },
    setUsdtPrice({ commit }, usdtPrice) {
      commit('SET_UsdtPrice', usdtPrice);
    },
    setTagLpBal({ commit }, tagLpBal) {
      commit('SET_TagLpBal', tagLpBal);
    },
    setNodeLists({ commit }, nodeLists) {
      commit('SET_NodeLists', nodeLists);
    },
    setNodeListsTamp({ commit }, nodeListsTamp) {
      commit('SET_NodeListsTamp', nodeListsTamp);
    },
    setRankInfoV3({ commit }, rankInfoV3) {
      commit('SET_RANKINFOV3', rankInfoV3);
    },
    setRankTrade({ commit }, rankTrade) {
      commit('SET_RANKTRADE', rankTrade);
    },
    setBaseConfig({ commit }, baseConfig) {
      commit('SET_BASECONFIG', baseConfig);
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
    setPoolsTagBal({ commit }, poolsTagBal) {
      commit('SET_PoolsTagBal', poolsTagBal)
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
    setMarketLists({ commit }, marketLists) {
      commit('SET_MarketLists', marketLists);
    },
    setFilterMkLists({ commit }, filterMkLists) {
      commit('SET_FilterMkLists', filterMkLists);
    },
    // pddex
    setTradeInfo({ commit }, tradeInfo) {
      commit('SET_TRADEINFO', tradeInfo);
    },
  }
};

export default sys;
