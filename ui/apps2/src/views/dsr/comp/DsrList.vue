<template>
  <div class="dsrList">
    <div class="list">
      <div class="flexb tools">
        <div class="coinName">DFS Bank</div>
        <div class="flexa">
          <div class="btn flexc" @click.stop="showActionsIn = true">{{ $t('dsr.deposit') }}</div>
          <div class="btn backBtn flexc" @click.stop="showActionsOut = true">{{ $t('dsr.retrieve') }}</div>
        </div>
      </div>
      <div class="flexb header" @click="showMyDeposit = true">
        <div>
          <div class="mb10">{{ $t('dsr.myDeposit') }}(DFS)</div>
          <div>
            <span>{{ myDepositInfo.balance || '0.0000'}} </span>
            <span class="tip">({{rate}}%)</span>
          </div>
        </div>
        <div>
          <div class="mb10">{{ $t('dsr.endDate') }}</div>
          <div>
            {{myDepositInfo.releaseTime || '-'}}
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      class="myDialog"
      :visible.sync="showActionsIn">
      <ActionsIn :myDepositInfo="myDepositInfo" :yearApr="yearApr" @listenClose="handleClose"/>
    </el-dialog>
    <el-dialog
      class="myDialog"
      :visible.sync="showActionsOut">
      <ActionsOut :myDepositInfo="myDepositInfo" @listenClose="handleClose"/>
    </el-dialog>
    <el-dialog
      class="myDialog"
      :visible.sync="showMyDeposit">
      <MyDeposit :myDepositInfo="myDepositInfo" :yearApr="yearApr" :rate="rate" :isMe="true"/>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
// import { EosModel } from '@/utils/eos';
// import moment from 'moment';
import { toFixed, accMul, accDiv } from '@/utils/public';
import ActionsIn from '../dialog/ActionsIn';
import ActionsOut from '../dialog/ActionsOut';
import MyDeposit from '../dialog/MyDeposit';
export default {
  name: 'dsrList',
  components: {
    ActionsIn,
    ActionsOut,
    MyDeposit
  },
  data() {
    return {
      showActionsIn: false,
      showActionsOut: false,
      showMyDeposit: false,
    }
  },
  props: {
    myDepositInfo: {
      type: Object,
      default: function md() {
        return {}
      }
    },
    args: {
      type: Object,
      default: function a() {
        return {}
      }
    },
    allLock: {
      type: String,
      default: '0.0000'
    }
  },
  computed: {
    ...mapState({
      dsrPools: state => state.sys.dsrPools,
    }),
    yearApr() {
      let apr = Math.pow(this.args.aprs, 86400 * 365) - 1
      apr = apr * 100;
      if (this.myDepositInfo.pool) {
        const pool = this.dsrPools.find(vv => vv.id === this.myDepositInfo.pool)
        apr = apr * pool.bonus;
      }
      return toFixed(apr, 2)
    },
    rate() {
      if (!Number(this.allLock)) return;
      let rate = accDiv(parseFloat(this.myDepositInfo.balance), this.allLock)
      rate = accMul(rate, 100);
      return toFixed(rate, 2)
    }
  },
  methods: {
    handleClose() {
      this.showActionsIn = false;
      this.showActionsOut = false;
      this.$emit('listenUpdate', true)
    },
    listenShowUnOpen() {
      this.$emit('listenShowUnOpen')
    },
  },
}
</script>

<style lang="scss" scoped>
.mb10{
  margin-bottom: 8px;
}
.dsrList{
  font-size: 28px;
  margin: 40px;
  .list{
    padding: 40px;
    border-radius: 20px;
    box-shadow: 0px 20px 40px 0px rgba(220,220,220,0.5);
    .header,.content{
      margin-bottom: 10px;
      text-align: left;
      &>div{
        flex: 1;
      }
    }
    .tip{
      font-size: 24px
    }
    .content{
      margin-bottom: 0;
    }
    .tools{
      margin-bottom: 20px;
      .coinName{
        font-size: 40px;
        font-weight: 500;
        color: rgba(2,198,152,1);
      }
      .btn{
        font-size: 24px;
        background:rgba(7,215,155,1);
        border-radius: 30px;
        color: #fff;
        padding: 14px 25px;
        &:active{
          background:rgba(2,198,152,1);
        }
        &.backBtn{
          background:rgba(192,93,93,1);
          margin-left: 15px;
          &:active{
            background:rgba(185,78,90,1);
          }
        }
      }
    }
  }
  .coinImg{
    width: 60px;
    margin-right: 5px;
  }
}
.myDialog{
  /deep/ .el-dialog{
    position: relative;
    margin: auto;
    width: 650px;
    border-radius: 20px;
    .el-dialog__body,
    .el-dialog__header{
      padding: 0;
    }
  }
}
</style>
