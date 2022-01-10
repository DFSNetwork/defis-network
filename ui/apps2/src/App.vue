<template>
  <div id="app" class="app">
    <router-view></router-view>
    <my-konami />
  </div>
</template>

<script>
import moment from 'moment';
import { DApp } from '@/utils/wallet';
import { mapState } from 'vuex';
import { GetUrlPara, login, getUrlParams, toLocalTime, accPow, accDiv, toFixed } from '@/utils/public';
import { getVotePools, get_balance } from '@/utils/api';
import { EosModel } from '@/utils/eos';
import MyKonami from '@/views/konami/Index';

import {getTagLpBal} from '@/utils/minerLogic';

export default {
  name: 'App',
  components: {
    MyKonami
  },
  computed: {
    ...mapState({
      // 箭头函数可使代码更简练
      minScreen: state => state.app.minScreen,
      baseConfig: state => state.sys.baseConfig, // 基础配置 - 默认为{}
      testConfig: state => state.sys.testConfig, // 测试网环境
      devConfig: state => state.sys.devConfig, // 开发环境
      proConfig: state => state.sys.proConfig, // 生产环境

      // 挖矿配置
      lpMid: state => state.config.lpMid, // 生产环境
    }),
  },
  data() {
    return {
      priceTimer: null,
      yfcTimer: null,
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
      DApp.scatterInit(this, () => {
      })
    });
    setTimeout(() => {
      this.handleGetDfsCurrent()
      this.handleYfcData();

      // 获取代币token
      this.handleGetPoolsApr()

      clearInterval(this.priceTimer)
      this.handleGetPrice()
      this.priceTimer = setInterval(() => {
        this.handleGetPrice()
      }, 300000);
      this.handleGetSwapBal('dfs')
      this.handleGetSwapBal('usdc')
      this.handleGetPoolsBal('dfs')
      this.handleGetPoolsBal('usdc')
      this.handleGetUsdxRank('dfs')
      this.handleGetUsdxRank('usdt')
      // 获取USDT价格
      // this.handleGetUsdtPrice();
      this.$api.getUsdtPrice()

    }, 500);
  },
  beforeDestroy: function () {
    clearInterval(this.priceTimer);
  },
  methods: {
    handleYfcData() {
      this.handleGetPonds()
      this.handleGetBalance()
      this.handleGetBalance('lp')
      this.handleGetYfcCurrent();
      clearInterval(this.yfcTimer)
      this.yfcTimer = setInterval(() => {
        this.handleGetBalance()
        this.handleGetBalance('lp')
        this.handleGetYfcCurrent();
      }, 10000)
    },
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
          "lower_bound": ` ${inviAcc}`,
          "upper_bound": ` ${inviAcc}`,
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
      // set wallet
      const wallet = urlParams.wallet || localStorage.getItem('WALLET') || 'scatter';
      localStorage.setItem('WALLET', wallet)
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
    // 获取DFS流通量 - 全局区一次
    async handleGetDfsCurrent() {
      const params = {
        code: 'minedfstoken',
        symbol: 'DFS'
      }
      const {status, result} = await this.$api.get_currency_stats(params);
      if (!status) {
        return;
      }
      const res = result['DFS'];
      const supply = res.supply.split(' ')[0];
      
      const damping = accPow(0.75, parseInt(accDiv(supply, 1000000)));
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
    // 获取YFC矿池列表 - 执行一次
    handleGetPonds() {
      this.lpMid.forEach(v => {
        const params = {
          "code": v.mineAcc,
          "scope": v.mineAcc,
          "table": "ponds",
          "json": true,
          limit: 1000,
        }
        EosModel.getTableRows(params, (res) => {
          const rows = res.rows || []
          if (!rows.length) {
            return
          }
          const list = rows;
          list.forEach(v => {
            if (v.start) {
              let beginTime = toLocalTime(`${v.start}.000+0000`);
              beginTime = moment(beginTime).valueOf();
              this.$set(v, 'beginTime', beginTime / 1000);
            }
            if (v.end) {
              let endTime = toLocalTime(`${v.end}.000+0000`);
              endTime = moment(endTime).valueOf();
              this.$set(v, 'endTime', endTime / 1000);
            }
          });
          const lpMineList = this.$store.state.config.lpMineList;
          lpMineList[v.symbol] = list;
          this.$store.dispatch('setLpMineList', lpMineList)
        })
      })
    },
    // 获取swap, yfc池子账户余额 - 10秒轮询
    handleGetBalance(type) {
      if (!type) {
        let params = {
          code: 'eosio.token',
          coin: 'EOS',
          decimal: 4,
          account: 'defisswapcnt'
        };
        EosModel.getCurrencyBalance(params, res => {
          let balanceYfc = toFixed('0.0000000000001', params.decimal);
          (!res || res.length === 0) ? balanceYfc : balanceYfc = res.split(' ')[0];
          this.$store.dispatch('setPoolsBal', balanceYfc)
        })
      }
      this.lpMid.forEach(v => {
        const params = {
          code: v.contract,
          coin: v.symbol,
          decimal: v.decimal,
          account: v.poolAcc
        }
        EosModel.getCurrencyBalance(params, res => {
          let balanceYfc = toFixed('0.0000000000001', params.decimal);
          (!res || res.length === 0) ? balanceYfc : balanceYfc = res.split(' ')[0];
          const lpPoolsBal = this.$store.state.config.lpPoolsBal;
          lpPoolsBal[v.symbol] = balanceYfc;
          this.$store.dispatch('setLpPoolsBal', lpPoolsBal)
        })
      })
      getTagLpBal(() =>{})
    },
    // 获取当前发行量 和 计算衰减
    handleGetYfcCurrent() {
      this.lpMid.forEach(async v => {
        const params = {
          code: v.contract,
          symbol: v.symbol
        }
        const {status, result} = await this.$api.get_currency_stats(params);
        if (!status) {
          return;
        }
        let dampNum = v.contract === 'yfctokenmain' ? 1000 : 100;
        const res = result[v.symbol];
        const supply = res.supply.split(' ')[0];
        const t = parseInt(supply / dampNum)
        const dampingYfc = 1 * Math.pow(0.75, t)
        const lpDamping = this.$store.state.config.lpDamping;
        lpDamping[v.symbol] = dampingYfc;
        this.$store.dispatch('setLpDamping', lpDamping)
      })
    },
    // 获取矿池排行奖励
    handleGetPoolsApr() {
      getVotePools()
    },

    // 获取USDC矿池余额
    // 获取矿池余额
    async handleGetPoolsBal(type) {
      const params = {
        code: 'usdxusdxusdx',
        symbol: 'USDC',
        decimal: 4,
        account: 'usdxpoolusds', // bytesmonster / usdxpoolusds
      }
      if (type === 'usdc') {
        params.account = 'usdxpoolusdc'; // usdxpoolusdc
      }
      const {status, result} = await get_balance(params);
      if (!status) {
        return
      }
      if (!result.length) {
        return
      }
      const bal = result.split(' ')[0];
      if (type === 'usdc') {
        this.$store.dispatch('setUsdcBalForUsdc', bal)
        return
      }
      this.$store.dispatch('setUsdcBalForDfs', bal)
    },
    // 获取swap 底池数量
    async handleGetSwapBal(type) {
      const params = {
        code: 'minedfstoken',
        symbol: 'DFS',
        decimal: 4,
        account: 'defisswapcnt',
      }
      if (type === 'usdc') {
        params.code = 'usdxusdxusdx';
        params.symbol = 'USDC';
      }
      const {status, result} = await get_balance(params);
      if (!status) {
        return
      }
      if (!result.length) {
        return
      }
      const bal = result.split(' ')[0];
      if (type === 'usdc') {
        this.$store.dispatch('setSwapUsdcBal', bal)
        return
      }
      this.$store.dispatch('setSwapDfsBal', bal)
    },
    // 获取USDC 、DFS 矿池排名 - usdc挖矿
    async handleGetUsdxRank(type) {
      const params = {
        "code":"usdxvotevote",
        "scope": "usdxvotevote",
        "table":"pools",
        "json":true,
        "limit": 1000,
      }
      if (type === 'dfs') {
        params.table = 'pools2'
      }
      const {status, result} = await this.$api.get_table_rows(params);
      if (!status) {
        return
      }
      let rows = result.rows || [];
      rows.sort((a, b) => {
        return parseFloat(b.total_votes) - parseFloat(a.total_votes)
      })
      rows = rows.slice(0, 21)
      if (type === 'dfs') {
        this.$store.dispatch('setDfsPools', rows)
        return
      }
      this.$store.dispatch('setUsdcPools', rows)
    }
  },
}
</script>

<style lang="scss">
/*iphone Xs Max*/
@media only screen and (device-width: 414px) and (device-height: 896px) {
  #app{
    padding-bottom: 30px !important;
  }
}
/*iphoneX、iphoneXs*/
@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
  #app{
    padding-bottom: 30px !important;
  }
}
*{
  padding: 0;
  margin: 0;
}

#app {
  font-family: 'Sarasa', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  max-width: 750px;
  margin: auto;
}
</style>
