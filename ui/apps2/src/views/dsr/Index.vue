<template>
  <div class="dsr">
    <dsr-info :args="args" @listenAllLock="listenAllLock"/>
    <div class="allClaim flexb">
      <div>
        <div class="subTitle flexa">
          <span>{{ $t('mine.waitClaim') }}</span>
          <img class="tipIcon ml10" @click="showReWardTip = true" src="@/assets/img/dex/tips_icon_btn.svg" alt="">
        </div>
        <div class="claimNum">{{myDepositInfo.showReward || '0.00000000'}} DFS</div>
      </div>
      <div class="flexb">
        <div class="allClaimBtn" v-loading="allClaim" @click="handleClaimAll">领取</div>
      </div>
    </div>
    <dsr-list :args="args" @listenShowUnOpen="handleClaimAll"
              :myDepositInfo="myDepositInfo" :allLock="allLock"/>
    <dsr-miner-list :args="args"/>

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
import { EosModel } from '@/utils/eos';
import moment from 'moment';
import { toFixed, accAdd, accMul, toLocalTime } from '@/utils/public';
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
  data() {
    return {
      allClaim: false,
      allReward: '0.00000000',
      minReward: '0.0001',
      showReWardTip: false,
      showUnOpen: false,
      myDepositInfo: {},
      args: {},
      argsTimer: null,
      secTimer: null,
      allLock: '0.0000',
    }
  },
  mounted() {
    this.handleArgsTimer();
  },
  beforeDestroy() {
    clearInterval(this.secTimer)
  },
  methods: {
    listenAllLock(balan) {
      this.allLock = balan;
    },
    handleArgsTimer() {
      clearTimeout(this.argsTimer)
      this.handleGetArgs();
      this.argsTimer = setTimeout(() => {
        this.handleArgsTimer()
      }, 5000);
    },
    handleClaimAll() {
      // this.showUnOpen = true;
      const formName = this.$store.state.app.scatter.identity.accounts[0].name;
      const permission = this.$store.state.app.scatter.identity.accounts[0].authority;
      const params = {
        actions: [
          {
            account: 'dfsdsrsystem',
            name: 'claim',
            authorization: [{
              actor: formName, // 转账者
              permission,
            }],
            data: {
              user: formName,
            }
          },
        ]
      }
      EosModel.toTransaction(params, (res) => {
        if(res.code && JSON.stringify(res.code) !== '{}') {
          this.$message({
            message: res.message,
            type: 'error'
          });
          return
        }
        this.$message({
          message: this.$t('public.success'),
          type: 'success'
        });
        setTimeout(() => {
          this.handleGetList();
        }, 1000);
      })
    },
    handleGetArgs() {
      const params = {
        "code": "dfsdsrsystem",
        "scope": "dfsdsrsystem",
        "table": "args",
        "json": true,
      }
      EosModel.getTableRows(params, (res) => {
        if (!res.rows.length) {
          return
        }
        this.args = res.rows[0];
        this.handleRunReward()
      })
    },
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
          const releaseTime = toLocalTime(`${v.release_time}.000+0000`)
          this.$set(v, 'releaseTime', releaseTime);
          this.$set(v, 'balance', v.bal.split(' ')[0]);
        })
        this.myDepositInfo = allList[0];
        this.handleRunReward()
      })
    },
    // 秒级定时器
    handleRunReward() {
      clearInterval(this.secTimer)
      if (!this.myDepositInfo.holder || !Number(this.args.aprs) || !this.dsrPools.length) {
        return
      }
      this.handleRunLogic()
      this.secTimer = setInterval(() => {
        this.handleRunLogic()
      }, 1000);
    },
    handleRunLogic() {
      let userTime = toLocalTime(`${this.myDepositInfo.last_drip}.000+0000`)
      userTime = moment(userTime).valueOf();
      const nowTime = moment().valueOf(); // 当前时间
      const t = (nowTime - userTime) / 1000;
      let reward = parseFloat(this.myDepositInfo.bal) * Math.pow(this.args.aprs, t) - parseFloat(this.myDepositInfo.bal)
      if (this.myDepositInfo.pool) {
        const pool = this.dsrPools.find(vv => vv.id === this.myDepositInfo.pool)
        reward = reward * pool.bonus;
      }
      this.$set(this.myDepositInfo, 'reward', reward)
      this.$set(this.myDepositInfo, 'showReward', toFixed(reward, 8))
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
