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
    },
    devConfig: { // 开发环境配置
      node: {
        area: "dev",
        protocol: "http",
        host: "183.250.89.179",
        port: "58888",
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
    proConfig: { // 生产环境配置
      node: {
        area: 'production',
        protocol: 'https',
        host: 'eos.greymass.com', // eospush.tokenpocket.pro
        port: '443',
        url: 'https://eos.greymass.com', // https://eospush.tokenpocket.pro
        chainId: "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906",
      },
      toAccountSwap: 'defisswapcnt', // 主交易 swap 合约
      createMarket: 'defisfactory', // 创建市场合约
      toAccountJin: 'bankofusddv1', // JIN 合约
      toAccountByHyk: 'jintokensell', // 限量买HYK
      hykContranct: 'jindaotokens', // HYK 合约
      bonusAccount: 'jindaojindao', // 分红账号
      oracle: 'jinoraclesv1', // 价格合约
      baseCoin: 'EOS', // 母币
      baseCoinContract: 'eosio.token',
      teamFunds: 'jinteamfunds', // 资金账户
    }
  },
  mutations: {
    SET_BASECONFIG: (state, baseConfig) => {
      state.baseConfig = baseConfig;
    },
    // 接收账户
    SET_TOACCOUNT: (state, toAccount) => {
      state.toAccount = toAccount;
      localStorage.setItem('toAccount', toAccount);
    },
  },
  actions: {
    setBaseConfig({ commit }, baseConfig) {
      commit('SET_BASECONFIG', baseConfig);
    },
    // 接收账户
    setToAccount({ commit }, toAccount) {
      commit('SET_TOACCOUNT', toAccount);
    },
  }
};

export default sys;
