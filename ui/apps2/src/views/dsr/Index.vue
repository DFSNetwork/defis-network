<template>
  <div class="dsr">
    <dsr-info />
    <div class="allClaim flexb">
      <div>
        <div class="subTitle flexa">
          <span>{{ $t('mine.waitClaim') }}</span>
          <img class="tipIcon ml10" @click="showReWardTip = true" src="@/assets/img/dex/tips_icon_btn.svg" alt="">
        </div>
        <div class="claimNum">{{allReward}} DFS</div>
      </div>
      <div class="flexb">
        <div class="allClaimBtn" v-loading="allClaim" @click="handleClaimAll">{{ $t('mine.claimAll') }}</div>
      </div>
    </div>
    <dsr-list @listenShowUnOpen="handleClaimAll"/>
    <dsr-miner-list />

    <el-dialog
      class="myDialog"
      :visible.sync="showReWardTip">
      <MinReward :minReward="minReward"/>
    </el-dialog>

    <el-dialog
      class="myDialog"
      :visible.sync="showUnOpen">
      <UnOpen/>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import MinReward from '@/views/market/popup/MinReward'
import DsrInfo from './comp/DsrInfo';
import DsrList from './comp/DsrList';
import DsrMinerList from './comp/DsrMinerList';
import UnOpen from './dialog/UnOpen';
export default {
  name: 'dsr',
  components: {
    DsrInfo,
    MinReward,
    DsrList,
    DsrMinerList,
    UnOpen
  },
  computed: {
    ...mapState({
      // 箭头函数可使代码更简练
      // baseConfig: state => state.sys.baseConfig, // 基础配置 - 默认为{}
      weightList: state => state.sys.weightList, // 交易对权重列表
      aprs: state => state.sys.aprs,
      damping: state => state.sys.damping,
      scatter: state => state.app.scatter,
      dfsPrice: state => state.sys.dfsPrice,
    }),
  },
  data() {
    return {
      allClaim: false,
      allReward: '0.00000000',
      minReward: '0.0001',
      showReWardTip: false,
      showUnOpen: false
    }
  },
  methods: {
    handleClaimAll() {
      this.showUnOpen = true;
    },
  }
}
</script>

<style lang="scss" scoped>
.dsr{
  .allClaim{
    margin: 0 40px 40px;
    background: #07D79B;
    border-radius: 20px;
    color: #FFF;
    padding: 40px;
    box-shadow: 0px 20px 40px 0px rgba(220,220,220,0.5);
    .ml10{
      margin-left: 10px;
    }
    .subTitle{
      font-size: 26px;
    }
    .claimNum{
      font-size: 30px;
      font-weight: 500;
      margin-top: 8px;
    }
    .allClaimBtn{
      background: #FFF;
      border-radius: 8px;
      color: #07D79B;
      font-size: 28px;
      padding: 10px 30px;
    }
  }
}
.myDialog{
  /deep/ .el-dialog{
    position: relative;
    margin: auto;
    width: 590px;
    border-radius: 20px;
    .el-dialog__body,
    .el-dialog__header{
      padding: 0;
    }
  }
}
</style>
