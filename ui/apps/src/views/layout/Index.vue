<template>
  <div class="layout">
    <div class="project">
      <header-nav @listenLogin="handleLogin" @listenShowNav="handleShowNav"/>
    </div>
    <transition name="fade" mode="out-in">
      <router-view class="content" @listenLogin="handleLogin" @listenShowBonus="handleShowBonus"
        :marketLists="marketLists"/>
    </transition>
    <warm-tip />
    <nav-list ref="nav" @listenLoginOut="handleLoginOut" @listenShowBonus="handleShowBonus"/>
    <bonus ref="bonus"/>
  </div>
</template>

<script>
import { login } from '@/utils/public';
import { mapState } from 'vuex'
import { EosModel } from '@/utils/eos';
import WarmTip from '@/components/WarmTip';
import HeaderNav from '@/components/HeaderNav';
import NavList from '@/components/Nav';
import Bonus from '@/components/Bonus';

export default {
  name: 'layout',
  components: {
    WarmTip,
    HeaderNav,
    NavList,
    Bonus
  },
  data() {
    return {
      marketLists: [],
      timer: null,
      topLists: [
        7, 39, 17, 
      ]
    }
  },
  computed:{
    ...mapState({
      // 箭头函数可使代码更简练
      scatter: state => state.app.scatter,
      baseConfig: state => state.sys.baseConfig, // 基础配置 - 默认为{}
    })
  },
  mounted() {
    EosModel.scatterInit(this, () => {
    })
    this.handleRowsMarket();
    this.handleStartTimer();
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    handleStartTimer() {
      clearInterval(this.timer);
      this.timer = setInterval(() => {
        this.handleRowsMarket();
      }, 5000);
    },
    // 登录
    handleLogin() {
      login(this, () => {})
    },
    handleLoginOut() {
      EosModel.accountLoginOut(() => {
        location.reload()
      });
    },
    handleShowNav() {
      this.$refs.nav.showNav = true;
    },
    handleShowBonus() {
      this.$refs.nav.showNav = false;
      this.$refs.bonus.showBonus = true;
    },
    // 获取做市池子
    handleRowsMarket() {
      const params = {
        code: this.baseConfig.toAccountSwap,
        scope: this.baseConfig.toAccountSwap,
        table: 'markets',
        json: true,
        limit: 100
      }
      EosModel.getTableRows(params, (res) => {
        const list = res.rows || [];
        const newList = []
        list.forEach((v) => {
          const sym0 = v.sym0.split(',');
          v.symbol0 = sym0[1]; // 币种
          v.decimal0 = sym0[0]; // 精度
          const sym1 = v.sym1.split(',');
          v.symbol1 = sym1[1]; // 币种
          v.decimal1 = sym1[0]; // 精度
          v.sym0Data = {
            mid: v.mid,
            last_update: v.last_update,
            liquidity_token: v.liquidity_token,
            price_cumulative_last: v.price0_cumulative_last,
            price_last: v.price0_last,
            contract: v.contract0,
            decimal: v.decimal0,
            reserve: v.reserve0,
            sym: v.sym0,
            symbol: v.symbol0
          }
          v.sym1Data = {
            mid: v.mid,
            last_update: v.last_update,
            liquidity_token: v.liquidity_token,
            price_cumulative_last: v.price1_cumulative_last,
            price_last: v.price1_last,
            contract: v.contract1,
            decimal: v.decimal1,
            reserve: v.reserve1,
            sym: v.sym1,
            symbol: v.symbol1
          }
          const i = this.topLists.find(vv => vv === v.mid)
          if (i) {
            newList.unshift(v)
          } else {
            newList.push(v)
          }
        });
        this.marketLists = newList;
      })
    }
  }
}
</script>

<style lang="scss" scoped>
/*iphone Xs Max*/
@media only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio:3){
  .layout{
    min-height: calc(100vh - 80px) !important;
  }
}
/*iphoneX、iphoneXs*/
@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
  .layout{
    min-height: calc(100vh - 80px) !important;
  }
}
.layout{
  width: 100%;
  margin: auto;
  min-height: calc(100vh - 50px);
  position: relative;
  box-sizing: border-box;
  padding-top: 44px;
  box-sizing: border-box;
}
// .content{
//   padding-top: 50px;
// }
.project{
  padding: 0px 0px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  width: 100%;
  background: #FFF;
  box-sizing: border-box;
  top: 0px;
  z-index: 1000;
  box-shadow: 0 0 5px 3px #f0f0f0;
  .logo{
    padding-left: 5px;
  }
}
.account{
  text-align: right;
  font-size: 14px;
  .loginOut{
    color: #F56C6C;
    margin-left: 8px;
    cursor: pointer;
  }
}
</style>