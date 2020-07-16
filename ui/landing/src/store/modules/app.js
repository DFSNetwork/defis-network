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
    minScreen: false,
  },
  mutations: {
    SET_LANGUAGE: (state, language) => {
      state.language = language;
      localStorage.setItem('language', language);
    },
    SET_THEME: (state, theme) => {
      state.theme = theme;
      localStorage.setItem('theme', theme);
    },
    SET_MINSCREEN: (state, minScreen) => {
      state.minScreen = minScreen;
    },
  },
  actions: {
    setLanguage({ commit }, language) {
      commit('SET_LANGUAGE', language);
    },
    setTheme({ commit }, theme) {
      commit('SET_THEME', theme);
    },
    setMinScreen({ commit }, minScreen) {
      commit('SET_MINSCREEN', minScreen);
    },
  }
};

export default app;
