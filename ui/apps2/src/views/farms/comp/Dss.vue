<template>
  <div class="lists flexa" v-loading="loading">
    <div class="coinDiv flexc">
      <img class="coin" src="https://cdn.jsdelivr.net/gh/defis-net/material2/coin/minedfstoken-dfs.png" alt="">
    </div>
    <div class="f1">
      <div class="projectName flexb">
        <span>DFS金库</span>
        <span class="claim green" v-loading="claiming || allClaiming" @click.stop="handleClaim">领取</span>
      </div>
      <div class="reward">
        <span>收益：</span>
        <span>{{ myDepositInfo.showReward || '0.00000000' }} DFS</span>
      </div>
      <div class="about">
        <span>≈ {{ aboutEos }} EOS</span>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import { EosModel } from '@/utils/eos';
import { mapState } from 'vuex';
import { toFixed, accAdd, accSub, accDiv, toLocalTime, countdown } from '@/utils/public';

export default {
  name: 'dssComp',
  data() {
    return {
      args: {},
      isGetAccinfo: false,
      myDepositInfo: {},
      secTimer: null,
      runTimer: null,
      claiming: false,
      loading: true,
      minReward: '0.0001',
      mid: 39, // dfs: 39 | DMD: 326 | YFC: 329 | DBC: 346 | LOOP: 424
      marketData: {},
      sec10Timer: null, // 10秒定时器
      ableClaimNum: '0.0000',
    }
  },
  props: {
    allClaiming: {
      type: Boolean,
      default: false,
    }
  },
  computed: {
    ...mapState({
      scatter: state => state.app.scatter,
      dsrPools: state => state.sys.dsrPools,
      marketLists: state => state.sys.marketLists,
    }),
    aboutEos() {
      const price = parseFloat(this.marketData.reserve0) / parseFloat(this.marketData.reserve1) || 0;
      const num = price * this.myDepositInfo.showReward;
      return toFixed(num, 4)
    },
  },
  watch: {
    marketLists: {
      handler: function ml(newVal) {
        this.marketData = newVal.find(v => v.mid === this.mid) || {}
      },
      deep: true,
      immediate: true,
    },
    scatter: {
      handler: function listen(newVal) {
        if (newVal.identity && !this.isGetAccinfo) {
          this.handleGetAccDssInfo()
        }
      },
      deep: true,
      immediate: true,
    },
    dsrPools: {
      handler: function listen() {
        this.handleRunReward()
      },
      deep: true,
      immediate: true,
    },
    args: {
      handler: function listen() {
        this.handleRunReward()
      },
      deep: true,
      immediate: true,
    }
  },
  mounted() {
    this.handleGetDssArgs();
    this.handleGetDfsBalance();
  },
  beforeDestroy() {
    clearInterval(this.secTimer)
    clearInterval(this.runTimer)
    clearTimeout(this.sec10Timer)
  },
  methods: {
    handleGetDfsBalance() {
      const params = {
        code: 'minedfstoken',
        coin: 'DFS',
        decimal: 4,
        account: 'dfsdsrbuffer'
      };
      EosModel.getCurrencyBalance(params, res => {
        let balance = toFixed('0.0000000000001', params.decimal);
        (!res || res.length === 0) ? balance : balance = res.split(' ')[0];
        this.ableClaimNum = balance;
      })
      this.sec10Timer = setTimeout(() => {
        this.handleGetDfsBalance();
      }, 10000);
    },
    handleGetDssArgs() {
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
        // console.log(this.args)
      })
    },
    handleGetAccDssInfo() {
      this.isGetAccinfo = true;
      const formName = this.scatter.identity.accounts[0].name;
      const params = {
        "code": "dfsdsrsystem",
        "scope": "dfsdsrsystem",
        "table": "holders",
        "lower_bound": ` ${formName}`,
        "upper_bound": ` ${formName}`,
        "json": true,
      }
      EosModel.getTableRows(params, (res) => {
        // console.log(res)
        this.loading = false;
        if (!res.rows.length) {
          this.myDepositInfo = {}
          return
        }
        const allList = res.rows;
        allList.forEach((v) => {
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
    handleGetActions() {
      const formName = this.scatter.identity.accounts[0].name;
      const permission = this.scatter.identity.accounts[0].authority;
      if (Number(this.minReward) > Number(this.myDepositInfo.reward || 0)) {
        return []
      }
      const action = {
        account: 'dfsdsrsystem',
        name: 'claim',
        authorization: [{
          actor: formName, // 转账者
          permission,
        }],
        data: {
          user: formName,
        }
      }
      return [action];
    },
    handleClaim() {
      if (this.allClaiming || this.claiming) {
        return
      }
      const actions = this.handleGetActions()
      if (!actions.length) {
        return
      }
      this.claiming = true;
      const params = {
        actions
      }
      EosModel.toTransaction(params, (res) => {
        this.claiming = false;
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
          this.handleGetAccDssInfo()
        }, 1000);
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import './comp.scss';
</style>
