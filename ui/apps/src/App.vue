<template>
  <div id="app" class="app" :class="{'noTab': $route.meta.noTabbar}">
    <router-view></router-view>
    <div class="tabbarDiv" v-if="!$route.meta.noTabbar">
      <tabbar />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { GetUrlPara, login, getUrlParams } from '@/utils/public';
// import { EosModel } from '@/utils/eos';
import Tabbar from '@/components/Tabbar';

export default {
  name: 'App',
  components: {
    Tabbar,
  },
  computed: {
    ...mapState({
      // 箭头函数可使代码更简练
      baseConfig: state => state.sys.baseConfig, // 基础配置 - 默认为{}
      testConfig: state => state.sys.testConfig, // 测试网环境
      devConfig: state => state.sys.devConfig, // 开发环境
      proConfig: state => state.sys.proConfig, // 生产环境
    }),
  },
  watch: {
    // '$route':function list(newVal) {
    //   console.log(newVal)
    // }
  },
  created() {
    this.handleEnvReLoad()
    this.handleEnvSet();
    this.handleSetLang();
    this.handleGetPhoneLanguage();
  },
  mounted() {
    this.handleLogin();
    // EosModel.scatterInit(this, () => {
    //   this.handleLogin();
    // })
  },
  methods: {
    handleSetLang() {
      const urlParams = getUrlParams(window.location.href) || {};
      // set Language
      const lang = urlParams.lang;
      if (lang) {
        this.$i18n.locale = lang;
        this.$store.dispatch('setLanguage', lang);
      }
    },
    // 登录
    handleLogin() {
      login(this, () => {})
    },
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
      this.$i18n.locale = this.language;
      this.$store.dispatch('setLanguage', this.language);
    },
    handleEnvReLoad() {
      const urlData = GetUrlPara();
      const protocol = location.protocol;
      if (urlData.env === 'dev' && protocol === 'https:') {
        location.href = `http://${location.host}?env=dev`
        // location.href = `http://www.baidu.com`
      }
    },
    handleEnvSet() {
      const urlData = GetUrlPara();
      let config = this.baseConfig;
      if (!urlData.env || urlData.env === 'production') { // 没有配置环境 - 默认生产环境
        sessionStorage.setItem('ENV', 'production')
        config = this.proConfig;
      } else if (urlData.env === 'test') {
        sessionStorage.setItem('ENV', 'test')
        config = this.testConfig;
      } else {
        sessionStorage.setItem('ENV', 'dev')
        config = this.devConfig;
      }
      this.$store.dispatch('setBaseConfig', config)
      // console.log(this.baseConfig)
    }
  },
}
</script>

<style lang="scss">
/*iphone Xs Max*/
@media only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio:3){
  .app{
    padding-bottom: 80px !important;
  }
  .noTab{
    padding-bottom: 0px !important;
  }
}
/*iphoneX、iphoneXs*/
@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
  .app{
    padding-bottom: 80px !important;
  }
  .noTab{
    padding-bottom: 0px !important;
  }
}

*{
  padding: 0;
  margin: 0;
  /deep/ .el-message{
    width: 80% !important;
    min-width: 80% !important;
    max-width: 80% !important;
  }
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.app{
  padding-bottom: 50px;
}

.noTab{
  padding-bottom: 0px !important;
}
.tabbarDiv{
  position: fixed;
  bottom: 0px;
  width: 100%;
  z-index: 10;
  background: #FFF;
}
</style>
