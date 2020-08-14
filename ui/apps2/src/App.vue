<template>
  <div id="app" class="app">
    <router-view></router-view>

    <warm-tip />
  </div>
</template>

<script>
import moment from 'moment';
import axios from 'axios';
import { mapState } from 'vuex';
import WarmTip from '@/components/WarmTip';
import { GetUrlPara, login, getUrlParams, toLocalTime, accPow, accDiv } from '@/utils/public';
import { EosModel } from '@/utils/eos';

export default {
  name: 'App',
  components: {
    WarmTip
  },
  computed: {
    ...mapState({
      // 箭头函数可使代码更简练
      minScreen: state => state.app.minScreen,
      baseConfig: state => state.sys.baseConfig, // 基础配置 - 默认为{}
      testConfig: state => state.sys.testConfig, // 测试网环境
      devConfig: state => state.sys.devConfig, // 开发环境
      proConfig: state => state.sys.proConfig, // 生产环境
    }),
  },
  data() {
    return {
      priceTimer: null,
    }
  },
  watch: {
  },
  created() {
    this.handleSetLang();
    this.handleResize();
  },
  mounted(){
    this.handleEnvReLoad();
    this.handleEnvSet();
    EosModel.scatterInit(this, () => {
      this.handleLogin()
    });
    setTimeout(() => {
      this.handleGetWeight()
      this.handleGetAprs()
      this.handleGetDfsCurrent()
      clearInterval(this.priceTimer)
      this.handleGetPrice()
      this.priceTimer = setInterval(() => {
        this.handleGetPrice()
      }, 300000);
    }, 500);
  },
  beforeDestroy: function () {
    clearInterval(this.priceTimer);
  },
  methods: {
    handleResize () {
      if (document.documentElement.clientWidth <= 750 && !this.minScreen) {
        this.$store.dispatch('setMinScreen', true)
        return;
      }
      if (document.documentElement.clientWidth > 750 && this.minScreen) {
        this.$store.dispatch('setMinScreen', false)
      }
    },
    // 登录
    handleLogin() {
      login(this, () => {})
    },
    handleRegInviAcc(inviAcc) {
      setTimeout(() => {
        const params = {
          "code": "dfsdfsfamily",
          "scope": "dfsdfsfamily",
          "table": "codes",
          "index_position": 2,
          "key_type": "i64",
          "lower_bound": inviAcc,
          "upper_bound": inviAcc,
          "json": true,
        }
        EosModel.getTableRows(params, (res) => {
          if (!res.rows.length) {
            localStorage.removeItem('inviAcc')
            return
          }
          const inviAcc = res.rows[0];
          localStorage.setItem('inviAcc', JSON.stringify(inviAcc))
        })
      }, 200);
    },
    handleSetLang() {
      const urlParams = getUrlParams(window.location.href) || {};
      // set inviAcc
      const inviAcc = urlParams.code;
      const localInviAcc = localStorage.getItem('inviAcc') ? JSON.parse(localStorage.getItem('inviAcc')) : {}
      if (inviAcc && !localInviAcc.accSet) {
        this.handleRegInviAcc(inviAcc)
      }
      // set Language
      const lang = urlParams.lang;
      if (lang) {
        this.$i18n.locale = lang;
        this.$store.dispatch('setLanguage', lang);
        return
      }
      this.handleGetPhoneLanguage();
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
    },
    // 获取交易对权重 - 全局取一次
    handleGetWeight() {
      const params = {
        code: 'miningpool11',
        scope: 'miningpool11',
        table: 'weights',
        json: true,
        limit: 100
      }
      EosModel.getTableRows(params, (res) => {
        const rows = res.rows || [];
        if (!rows.length) {
          return
        }
        this.$store.dispatch('setWeightList', rows)
      })
    },
    // 获取aprs - 全局一次
    handleGetAprs() {
      const params = {
        code: 'miningpool11',
        scope: 'miningpool11',
        table: 'args',
        lower_bound: 'EOS',
        upper_bound: 'EOS',
        // primary_key: 'EOS',
        json: true,
      }
      EosModel.getTableRows(params, (res) => {
        const rows = res.rows || [];
        if (!rows.length) {
          return
        }
        const aprs = rows[0];
        let lastTime = toLocalTime(`${aprs.last_drip}.000+0000`);
        lastTime = moment(lastTime).valueOf();
        aprs.lastTime = lastTime;
        this.$store.dispatch('setAprs', aprs)
      })
    },
    // 获取DFS流通量 - 全局区一次
    async handleGetDfsCurrent() {
      const https = this.baseConfig.node.url;
      const params = {
        code: 'minedfstoken',
        symbol: 'DFS'
      }
      const result = await axios.post(`${https}/v1/chain/get_currency_stats`, JSON.stringify(params))
      if (result.status !== 200) {
        return;
      }
      const res = result.data['DFS'];
      const supply = res.supply.split(' ')[0];
      
      const damping = accPow(0.75, accDiv(supply, 1000000).toFixed(0));
      this.$store.dispatch('setDamping', damping)
    },
    // DFS价格 - 5分钟一次
    handleGetPrice() {
      const params = {
        "code": "defislinkeos",
        "scope": "39",
        "table": "avgprices",
        "limit": 3,
        "json": true,
      }
      EosModel.getTableRows(params, (res) => {
        const rows = res.rows || [];
        if (!rows.length) {
          return
        }
        const price = rows.find(v => v.key === 300) || {};
        const price5min = accDiv(price.price1_avg_price, 10000) || 0;
        this.$store.dispatch('setDfsPrice', price5min)
      })
    },
  },
}
</script>

<style lang="scss">
/*iphone Xs Max*/
@media only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio:3){
}
/*iphoneX、iphoneXs*/
@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
}
*{
  padding: 0;
  margin: 0;
  /deep/ .el-message{
    // width: 80% !important;
    // min-width: 80% !important;
    // max-width: 80% !important;
    .el-message__icon{
      font-size: 42px;
    }
    .el-message__content{
      font-size: 26px !important;
    }
  }
  /deep/ .el-loading-spinner .path{
    stroke: rgba(2,198,152,1);
  }
}

#app {
  font-family: 'Sarasa', Helvetica, Arial, sans-serif !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  max-width: 750px;
  margin: auto;
}
</style>
