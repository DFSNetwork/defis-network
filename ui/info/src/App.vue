<template>
  <div id="app" class="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'App',
  components: {
  },
  computed: {
    ...mapState({
      // 箭头函数可使代码更简练
      minScreen: state => state.app.minScreen,
    }),
  },
  watch: {
  },
  created() {
    this.handleGetPhoneLanguage();
  },
  mounted(){
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy: function () {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    // 第一次使用dapp时，获取手机语言
    handleGetPhoneLanguage() {
      const lang = localStorage.getItem('language')
      if (lang) {
        return;
      }
      if (navigator.language) {
        this.language = navigator.language;
      } else {
        this.language = navigator.browserLanguage;
      }
      if (this.language !== 'zh-CN') {
        this.language = 'en';
      }
      this.language = 'en';
      this.$i18n.locale = this.language;
      this.$store.dispatch('setLanguage', this.language);
    },
  },
}
</script>

<style>
/*iphone Xs Max*/
@media only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio:3){
}
/*iphoneX、iphoneXs*/
@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
}
*{
  padding: 0;
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #000;
  margin: auto;
}
</style>
