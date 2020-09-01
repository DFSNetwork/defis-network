<template>
  <div class="dsrList">
    <div class="list flexb">
      <div @click="showMyDeposit = true">
        <div class="flexa header">
          <!-- <div>币种</div> -->
          <div>{{ $t('dsr.myDeposit') }}</div>
          <div>{{ $t('dsr.percent') }}</div>
          <div></div>
        </div>
        <div class="flexb content">
          <div>
            {{ myDepositInfo.bal || '0.0000 DFS'}}
          </div>
          <div>
            0.00%
          </div>
        </div>
      </div>
      <div class="flexb tools">
        <div class="flexa">
          <div class="btn flexc" @click.stop="showActionsIn = true">{{ $t('dsr.deposit') }}</div>
          <div class="btn backBtn flexc" @click.stop="showActionsOut = true">{{ $t('dsr.retrieve') }}</div>
        </div>
      </div>
    </div>

    <el-dialog
      class="myDialog"
      :visible.sync="showActionsIn">
      <ActionsIn />
    </el-dialog>
    <el-dialog
      class="myDialog"
      :visible.sync="showActionsOut">
      <ActionsOut />
    </el-dialog>
    <el-dialog
      class="myDialog"
      :visible.sync="showMyDeposit">
      <MyDeposit />
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { EosModel } from '@/utils/eos';
// import moment from 'moment';
import { accAdd, accMul, toLocalTime } from '@/utils/public';
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
      myDepositInfo: {},
    }
  },
  computed: {
    ...mapState({
      // 箭头函数可使代码更简练
      scatter: state => state.app.scatter,
      dsrPools: state => state.sys.dsrPools,
    }),
  },
  watch: {
    scatter: {
      handler: function listen(newVal) {
        if (newVal.identity) {
          this.handleGetList()
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    handleGetList() {
      const formName = this.$store.state.app.scatter.identity.accounts[0].name;
      const params = {
        "code": "dfsdsrsystem",
        "scope": "dfsdsrsystem",
        "table": "holders",
        "lower_bound": ` ${formName}`,
        "upper_bound": ` ${formName}`,
        "json": true,
      }
      EosModel.getTableRows(params, (res) => {
        this.loading = false;
        if (!res.rows.length) {
          this.myDepositInfo = {}
          return
        }
        const allList = res.rows;
        const buff = [0, 0.05, 0.1, 0.2, 0.5]
        allList.forEach((v) => {
          let accApr = accMul(5, buff[Number(v.pool)]);
          this.$set(v, 'buff', accApr);
          accApr = accAdd(5, accApr);
          this.$set(v, 'accApr', accApr);
          const inTime = toLocalTime(`${v.last_drip}.000+0000`)
          this.$set(v, 'inTime', inTime);
        })
        this.myDepositInfo = allList[0];
        console.log(this.myDepositInfo)
      })
    },
    listenShowUnOpen() {
      this.$emit('listenShowUnOpen')
    },
  },
}
</script>

<style lang="scss" scoped>
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
        // flex: 2;
        &:first-child{
          min-width: 200px;
        }
        &:nth-child(2){
          min-width: 120px;
          margin: 0 20px;
        }
        &:nth-child(3){
          flex: 1;
          text-align: right;
        }
      }
    }
    .content{
      margin-bottom: 0;
    }
    .tools{
      justify-content: flex-end;
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
