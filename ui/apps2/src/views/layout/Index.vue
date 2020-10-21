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
import MyFooter from '@/components/Footer';
// import Nav from '@/components/Nav';
import Nav from '@/views/layout/comp/More';
import SlipPointTools from '@/components/SlipPointTools';
import InviAcc from '@/components/InviAcc';
import NodeSet from '@/components/popup/NodeSet';
import WarmTip from '@/components/WarmTip';
import Tabbar from './comp/Tabbar';

import { dealMarketLists } from '@/utils/logic';

export default {
  name: 'layout',
  components: {
    HeaderTools,
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
        // 列表处理
        const dealObj = dealMarketLists(list, this.topLists)
        this.marketLists = dealObj.allLists;
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