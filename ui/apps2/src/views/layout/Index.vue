<template>
  <div class="layout">
    <header-tools v-if="!$route.meta.noHeader" @listenShowNav="handleShowNav" @listenShowTools="handleShowTools"/>
    <!-- <acc-login v-if="showAcc && !$route.meta.noHeader"/> -->
    <transition name="fade" mode="out-in">
      <router-view class="content" :marketLists="marketLists" @listenUpdateList="listenUpdateList"/>
    </transition>
    <my-footer v-if="!$route.meta.noFooter" :marketLists="marketLists"/>

    <Tabbar v-if="!$route.meta.noTab"/>

    <!-- 弹窗 -->
    <Nav ref="nav" @listenShowComp="handleShowComp"/>
    <SlipPointTools ref="slipPointTools"/>
    <el-dialog
      class="mydialog"
      :visible.sync="showInvi">
      <invi-acc v-if="showInvi" />
    </el-dialog>
    <el-dialog
      class="nodeDialog"
      :visible.sync="showNode">
      <NodeSet v-if="showNode" />
    </el-dialog>

    <warm-tip :showWarm="showWarm" @listenClose="handleClose" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { EosModel } from '@/utils/eos';
import HeaderTools from '@/components/Header';
// import AccLogin from '@/components/AccLogin';
import MyFooter from '@/components/Footer';
// import Nav from '@/components/Nav';
import Nav from '@/views/layout/comp/More';
import SlipPointTools from '@/components/SlipPointTools';
import InviAcc from '@/components/InviAcc';
import NodeSet from '@/components/popup/NodeSet';
import WarmTip from '@/components/WarmTip';
import Tabbar from './comp/Tabbar';
import { getCoin } from '@/utils/public'

import { getFilterPrice } from '@/utils/logic';

export default {
  name: 'layout',
  components: {
    HeaderTools,
    // AccLogin,
    MyFooter,
    Nav,
    SlipPointTools,
    InviAcc,
    NodeSet,
    WarmTip,
    Tabbar,
  },
  data() {
    return {
      marketLists: [],
      timer: null,
      topLists: [
        39
      ],
      showInvi: false,
      showNode: false,
      showWarm: false,
    }
  },
  computed:{
    ...mapState({
      // 箭头函数可使代码更简练
      scatter: state => state.app.scatter,
      baseConfig: state => state.sys.baseConfig, // 基础配置 - 默认为{}
      mkFilterConf: state => state.config.mkFilterConf, // 基础配置 - 默认为{}
    }),
    showAcc() {
      const showAcc = !this.$route.meta.noAcc;
      return showAcc
    }
  },
  mounted() {
    this.handleRowsMarket();
    this.handleStartTimer();
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    handleClose() {
      this.showWarm = false;
    },
    handleShowComp(type) {
      if (type === 'invi') {
        this.showInvi = true;
      }
      if (type === 'node') {
        this.showNode = true
      }
      if (type === 'warn') {
        this.showWarm = true;
      }
      if (type === 'silderSet') {
        this.$refs.slipPointTools.showNav = true;
      }
    },
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
    listenUpdateList() {
      this.handleRowsMarket();
    },
    // 获取做市池子
    handleRowsMarket() {
      const params = {
        code: this.baseConfig.toAccountSwap,
        scope: this.baseConfig.toAccountSwap,
        table: 'markets',
        json: true,
        limit: 1000
      }
      EosModel.getTableRows(params, (res) => {
        const list = res.rows || [];
        const newList = []
        const mainList = []; // 存放EOS - token 和 usdt - token 的交易对
        let dfsData = {}
        const priceObj = getFilterPrice(list)
        list.forEach((item) => {
          let v = item;
          if (v.contract1 === 'eosio.token' && v.sym1 === '4,EOS') {
            const newList = {
              contract0: v.contract1,
              contract1: v.contract0,
              last_update: v.last_update,
              liquidity_token: v.liquidity_token,
              mid: v.mid,
              price0_cumulative_last: v.price1_cumulative_last,
              price0_last: v.price1_last,
              price1_cumulative_last: v.price0_cumulative_last,
              price1_last: v.price0_last,
              reserve0: v.reserve1,
              reserve1: v.reserve0,
              sym0: v.sym1,
              sym1: v.sym0,
              exchangeSym: true,
            }
            v = newList;
          }
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
            imgUrl: getCoin(v.contract0, v.symbol0.toLowerCase()),
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
            imgUrl: getCoin(v.contract1, v.symbol1.toLowerCase()),
          }
          const i = this.topLists.find(vv => vv === v.mid)
          if (i) {
            // newList.unshift(v)
            dfsData = v;
          } else {
            // 处理过滤数组
            this.mkFilterConf.forEach(conf => {
              if ((v.sym0Data.symbol === conf.symbol && v.sym0Data.contract === conf.contract)
                || (v.sym1Data.symbol === conf.symbol && v.sym1Data.contract === conf.contract)) {
                const priceAll = parseFloat(v.sym0Data.reserve) * priceObj[conf.symbol];
                if (priceAll >= conf.minEos) {
                  mainList.push(v)
                }
              }
            })

            if ((v.sym0Data.symbol === 'EOS' && v.sym0Data.contract === 'eosio.token') ||
                (v.sym1Data.symbol === 'EOS' && v.sym1Data.contract === 'eosio.token')) {
              newList.unshift(v)
              return
            }
            newList.push(v)
          }
        });
        const newListSort = newList.sort((a, b) => {
          let aEos = 0;
          if (a.sym0Data.contract === 'eosio.token') {
            aEos = parseInt(a.reserve0)
          } else if(a.sym1Data.contract === 'eosio.token') {
            aEos = parseInt(a.reserve1)
          }
          let bEos = 0;
          if (b.sym0Data.contract === 'eosio.token') {
            bEos = parseInt(b.reserve0)
          } else if(a.sym1Data.contract === 'eosio.token') {
            bEos = parseInt(b.reserve1)
          }
          return bEos - aEos;
        })
        newListSort.splice(1, 0, dfsData)
        this.marketLists = newListSort;
        this.$store.dispatch('setMarketLists', newListSort)

        // 保存过滤列表
        const newMainList = mainList.sort((a, b) => {
          let aEos = 0;
          if (a.sym0Data.contract === 'eosio.token') {
            aEos = parseInt(a.reserve0)
          } else if(a.sym1Data.contract === 'eosio.token') {
            aEos = parseInt(a.reserve1)
          }
          let bEos = 0;
          if (b.sym0Data.contract === 'eosio.token') {
            bEos = parseInt(b.reserve0)
          } else if(a.sym1Data.contract === 'eosio.token') {
            bEos = parseInt(b.reserve1)
          }
          return bEos - aEos;
        })
        newMainList.splice(1, 0, dfsData)
        this.$store.dispatch('setFilterMkLists', newMainList)
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
  .mydialog,.nodeDialog{
    /deep/ .el-dialog{
      border-radius: 12px;
      width: 480px;
      margin-top: 15vh !important;
      .el-dialog__header{
        padding: 0;
      }
      .el-dialog__body{
        font-size: 26px;
        padding: 35px;
      }
    }
  }
  .nodeDialog{
    /deep/ .el-dialog{
      width: 620px;
    }
  }
}

</style>