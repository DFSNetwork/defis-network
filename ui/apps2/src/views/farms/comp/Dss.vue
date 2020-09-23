<template>
  <div class="lists" v-loading="loading">
    <div class="projectName flexb">
      <span>DFS金库</span>
      <span class="claim green" v-loading="claiming || allClaiming" @click.stop="handleClaim">领取</span>
    </div>
    <div class="reward">
      <span>收益：</span>
      <span>{{ myDepositInfo.showReward || '0.00000000' }} DFS</span>
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
    }),
  },
  watch: {
    scatter: {
      handler: function listen(newVal) {
        if (newVal.identity && !this.isGetAccinfo) {
          this.handleGetAccDssInfo()
        }
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
    this.handleGetDssArgs();
  },
  beforeDestroy() {
    clearInterval(this.secTimer)
    clearInterval(this.runTimer)
  },
  methods: {
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
.lists{
  text-align: left;
  border-radius: 15px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0px 10px 40px 0px rgba(220,220,220,0.5);
  .projectName{
    font-size: 30px;
    font-weight: 500;
    margin-bottom: 10px;
    .claim{
      font-size: 27px;
      font-weight: 400;
    }
  }
}
.green{
  color: #07D79B;
}
</style>
