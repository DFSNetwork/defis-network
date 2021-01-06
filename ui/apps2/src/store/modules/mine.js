
const mine = {
  state: {
    usdcBalForDfs: '0.0000', // usdc 下的DFS矿池挖矿余额
    usdcBalForUsdc: '0.0000', // usdc 下的USDC矿池挖矿余额
    swapDfsBal: '0.0000', // swap 内DFS余额
    swapUsdcBal: '0.0000', // swap 内USDC余额
  },
  mutations: {
    SET_usdcBalForDfs: (state, usdcBalForDfs) => {
      state.usdcBalForDfs = usdcBalForDfs;
    },
    SET_usdcBalForUsdc: (state, usdcBalForUsdc) => {
      state.usdcBalForUsdc = usdcBalForUsdc;
    },
    SET_swapDfsBal: (state, swapDfsBal) => {
      state.swapDfsBal = swapDfsBal;
    },
    SET_swapUsdcBal: (state, swapUsdcBal) => {
      state.swapUsdcBal = swapUsdcBal;
    },
  },
  actions: {
    setUsdcBalForDfs({ commit }, usdcBalForDfs) {
      commit('SET_usdcBalForDfs', usdcBalForDfs);
    },
    setUsdcBalForUsdc({ commit }, usdcBalForUsdc) {
      commit('SET_usdcBalForUsdc', usdcBalForUsdc);
    },
    setSwapDfsBal({ commit }, swapDfsBal) {
      commit('SET_swapDfsBal', swapDfsBal);
    },
    setSwapUsdcBal({ commit }, swapUsdcBal) {
      commit('SET_swapUsdcBal', swapUsdcBal);
    },
  }
};

export default mine;
