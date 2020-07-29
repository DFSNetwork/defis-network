<template>
  <div class="layout">
    <header-tools @listenShowNav="handleShowNav" @listenShowTools="handleShowTools"/>
    <acc-login v-if="$route.name !== 'tutorial'"/>
    <transition name="fade" mode="out-in">
      <router-view class="content" :marketLists="marketLists"/>
    </transition>
    <my-footer />
    <Nav ref="nav"/>
    <SlipPointTools ref="slipPointTools"/>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { EosModel } from '@/utils/eos';
import HeaderTools from '@/components/Header';
import AccLogin from '@/components/AccLogin';
import MyFooter from '@/components/Footer';
import Nav from '@/components/Nav';
import SlipPointTools from '@/components/SlipPointTools';
export default {
  name: 'layout',
  components: {
    HeaderTools,
    AccLogin,
    MyFooter,
    Nav,
    SlipPointTools,
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
    this.handleRowsMarket();
    this.handleStartTimer();
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    handleShowNav() {
      this.$refs.nav.showNav = true;
    },
    handleShowTools() {
      this.$refs.slipPointTools.showNav = true;
    },
    handleStartTimer() {
      clearInterval(this.timer);
      this.timer = setInterval(() => {
        this.handleRowsMarket();
      }, 5000);
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
            symbol: v.symbol0,
            imgUrl: `https://ndi.340wan.com/eos/${v.contract0}-${v.symbol0.toLowerCase()}.png`,
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
            symbol: v.symbol1,
            imgUrl: `https://ndi.340wan.com/eos/${v.contract1}-${v.symbol1.toLowerCase()}.png`,
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
  position: relative;
  box-sizing: border-box;
}
</style>