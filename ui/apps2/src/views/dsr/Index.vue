<template>
  <div class="dsr">
    <dsr-info :args="args" :timesmap="timesmap" :claimLoading="claimLoading" :ableClaimNum="ableClaimNum"
      @listenAllLock="listenAllLock"/>
    <div class="allClaim flexb">
      <img class="bgImg" src="https://cdn.jsdelivr.net/gh/defis-net/material/bg/myReward.png" alt="">
      <div>
        <div class="subTitle flexa tip">
          <span>{{ $t('mine.waitClaim') }}</span>
          <img class="tipIcon ml10" @click="showReWardTip = true" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/tips_icon_btn.svg" alt="">
        </div>
        <div class="claimNum dinBold">{{myDepositInfo.showReward || '0.00000000'}} DFS</div>
      </div>
      <div class="flexb">
        <div class="allClaimBtn" v-loading="allClaim" @click="handleClaimAll">{{ $t('bonus.claim') }}</div>
      </div>
    </div>
    <dsr-list :args="args" @listenUpdate="listenUpdate"
              :myDepositInfo="myDepositInfo" :allLock="allLock"/>
    <dsr-miner-list :args="args" :timesmap="timesmap" :allLock="allLock" :ableClaimNum="ableClaimNum"/>

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
import { toFixed, accAdd, accSub, accDiv, toLocalTime, countdown } from '@/utils/public';
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
      allReward: '0.00000000',
      minReward: '0.0001',
      showReWardTip: false,
      showUnOpen: false,
      myDepositInfo: {},
      args: {},
      argsTimer: null,
      secTimer: null,
      runTimer: null,
      allLock: '0.0000',
      timesmap: 0,
      allClaim: false,
      ableClaimNum: '0.0000',
      claimLoading: true,
    }
  },
  mounted() {
    this.handleArgsTimer();
  },
  beforeDestroy() {
    clearInterval(this.secTimer)
    clearInterval(this.runTimer)
    clearInterval(this.argsTimer)
  },
  methods: {
    listenUpdate() {
      this.timesmap = moment().valueOf();
      this.handleArgsTimer();
      this.handleGetList()
      console.log('update')
    },
    listenAllLock(balan) {
      this.allLock = balan;
    },
    handleArgsTimer() {
      clearTimeout(this.argsTimer)
      this.handleGetArgs();
      this.handleGetDfsBalance()
      this.argsTimer = setTimeout(() => {
        this.handleGetDfsBalance()
        this.handleArgsTimer()
      }, 5000);
    },
    handleClaimAll() {
      if (this.allClaim) {
        return
      }
      this.allClaim = true;
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
        this.allClaim = false;
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
        if (!res.rows.length) {
          this.myDepositInfo = {}
          return
        }
        const allList = res.rows;
        allList.forEach((v) => {
          let accApr = this.handleYearApr(v)
          this.$set(v, 'buff', accApr);
          accApr = accAdd(5, accApr);
          this.$set(v, 'accApr', accApr);
          const inTime = toLocalTime(`${v.last_drip}.000+0000`)
          this.$set(v, 'inTime', inTime);
          const releaseTime = toLocalTime(`${v.release_time}.000+0000`)
          this.$set(v, 'releaseTime', releaseTime);
          this.$set(v, 'balance', v.bal.split(' ')[0]);
          const endT = countdown(releaseTime);
          this.$set(v, 'isRelease', endT.total < 0);
        })
        this.myDepositInfo = allList[0];
        this.handleRunReward()
      })
    },
    handleYearApr(item) {
      let apr = Math.pow(this.args.aprs, 86400 * 365) - 1
      apr = apr * 100;
      if (item.pool) {
        const pool = this.dsrPools.find(vv => vv.id === item.pool)
        apr = apr * pool.bonus;
      }
      return toFixed(apr, 2)
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
      clearInterval(this.runTimer)
      let userTime = toLocalTime(`${this.myDepositInfo.last_drip}.000+0000`)
      userTime = moment(userTime).valueOf();
      const nowTime = moment().valueOf(); // 当前时间
      const time = (nowTime - userTime) / 1000;
      let reward = parseFloat(this.myDepositInfo.bal) * Math.pow(this.args.aprs, time) - parseFloat(this.myDepositInfo.bal)
      if (this.myDepositInfo.pool) {
        const pool = this.dsrPools.find(vv => vv.id === this.myDepositInfo.pool)
        reward = reward * pool.bonus;
      }
      if (Number(this.ableClaimNum) < Number(reward)) {
        reward = this.ableClaimNum;
      }
      reward = toFixed(reward, 8)
      const v = this.myDepositInfo;
      let showReward = v.reward || '0.00000000';
        let countReward = showReward;
        if (!v.showReward) {
          this.$set(v, 'showReward', reward)
          showReward = reward;
          countReward = reward;
        }
        this.$set(v, 'reward', reward)
        let t = accSub(reward, showReward);
        t = accDiv(t, 20)
        this.runTimer = setInterval(() => {
          countReward = accAdd(countReward, t)
          if (countReward > Number(reward)) {
            showReward = toFixed(reward, 8);
            clearInterval(this.runTimer)
          } else {
            showReward = toFixed(countReward, 8);
          }
          this.$set(v, 'showReward', showReward);
        }, 50);
    },
    handleGetDfsBalance() {
      const params = {
        code: 'minedfstoken',
        coin: 'DFS',
        decimal: 4,
        account: 'dfspool44444'
      };
      EosModel.getCurrencyBalance(params, res => {
        let balance = toFixed('0.0000000000001', params.decimal);
        (!res || res.length === 0) ? balance : balance = res.split(' ')[0];
        this.claimLoading = false;
        this.ableClaimNum = balance;
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.dsr{
  .allClaim{
    position: relative;
    margin: 30px 32px;
    height: 160px;
    border-radius: 12px;
    color: #333;
    padding: 28px;
    box-sizing: border-box;
    box-shadow: 0px 4px 8px 4px rgba(220,220,220,0.5);
    .bgImg{
      position: absolute;
      left: -10px;
      top: -10;
      width: 103%;
      // height: 170px;
      z-index: -1;
    }
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
      background: #29D4B0;
      border-radius: 30px;
      color: #FFF;
      font-size: 28px;
      padding: 10px 36px;
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
