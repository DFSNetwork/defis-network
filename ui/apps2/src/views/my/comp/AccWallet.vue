<template>
  <div class="accWallet">
    <div class="flexb title">
      <span>我的钱包</span>
      <!-- <span class="flexa green_p">
        <span>立即做市</span>
        <img class="rightIcon" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/right.png" alt="">
      </span> -->
    </div>
    <div class="wallet flexb">
      <div class="has">
        <div class="subTitle">DFS资产</div>
        <div>
          <span class="num dinBold">{{ allDfs | numberTofixed}}</span>
          <span class="small">DFS</span>
        </div>
      </div>
      <div class="has unClaim">
        <div class="subTitle">待领取(DFS)</div>
        <div>
          <span class="num dinBold">{{ rewardRun || '0.00000000' }}</span>
          <span class="small">DFS</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import { mapState } from 'vuex';
import {get_table_rows, get_balance} from '@/utils/api'
import { sellToken } from '@/utils/logic';
import { toFixed, accAdd, accDiv, accSub, toLocalTime, dealMinerData } from '@/utils/public';
import { dealRewardV3 } from '@/utils/logic';

export default {
  name: 'accWallet',
  data() {
    return {
      dssInfo: {},
      bal: '0.0000',
      token: '0',
      nowMarket: {},
      minerInfo: {},
      args: {},

      // 定时器
      secTimer: null,
      runTimer: null,
      marketTimer: null,
      marketRunTimer: null,
    }
  },
  mounted() {
    this.handleGetArgs()
  },
  beforeDestroy() {
    clearInterval(this.secTimer)
    clearInterval(this.runTimer)
    clearInterval(this.marketTimer)
    clearInterval(this.marketRunTimer);
  },
  computed: {
    ...mapState({
      scatter: state => state.app.scatter,
      baseConfig: state => state.sys.baseConfig,
      marketLists: state => state.sys.marketLists,
      dsrPools: state => state.sys.dsrPools,
    }),
    allDfs() {
      let all = parseFloat(this.bal || 0);
      all = accAdd(all, parseFloat(this.nowMarket.getNum2 || 0))
      all = accAdd(all, parseFloat(this.dssInfo.balance))
      return all
    },
    rewardRun() {
      let all = accAdd(parseFloat(this.minerInfo.showReward || 0), parseFloat(this.dssInfo.showReward || 0));
      return all.toFixed(8)
    }
  },
  watch: {
    scatter: {
      handler: function acc(newVal) {
        if (newVal.identity) {
          this.handleGetBal();
          this.handleGetDss();
          this.handleGetDfsMarket();
          this.handleGetAccMiner()
        }
      },
      deep: true,
      immediate: true
    },
    marketLists: {
      handler: function acc() {
        this.handleGetMarketDfs();
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    async handleGetArgs() {
      const params = {
        "code": "dfsdsrsystem",
        "scope": "dfsdsrsystem",
        "table": "args",
        "json": true,
      }
      const {status, result} = await get_table_rows(params)
      if (!status) {
        return
      }
      this.args = result.rows[0];
      this.handleRunReward()
    },
    handleGetMarketDfs() {
      if (!this.token || !this.marketLists.length) {
        return
      }
      const market = this.marketLists.find(v => v.mid === 39)
      const inData = {
        poolSym0: market.reserve0.split(' ')[0],
        poolSym1: market.reserve1.split(' ')[0],
        poolToken: market.liquidity_token,
        sellToken: this.token
      }
      const nowMarket = sellToken(inData);
      nowMarket.getNum1 = toFixed(nowMarket.getNum1, 4)
      nowMarket.getNum2 = toFixed(nowMarket.getNum2, 4)
      this.nowMarket = nowMarket;
    },
    async handleGetBal() {
      const formName = this.scatter.identity.accounts[0].name;
      const params = {
        code: 'minedfstoken',
        symbol: 'DFS',
        decimal: 4,
        account: formName,
      }
      const {status, result} = await get_balance(params);
      if (!status) {
        return
      }
      this.bal = result;
    },
  
    async handleGetDss() {
      const formName = this.scatter.identity.accounts[0].name;
      const params = {
        "code": "dfsdsrsystem",
        "scope": "dfsdsrsystem",
        "table": "holders",
        "lower_bound": ` ${formName}`,
        "upper_bound": ` ${formName}`,
        "json": true,
      }
      const {status, result} = await  get_table_rows(params)
      if (!status) {
        return
      }
      if (!result.rows.length) {
        this.dssInfo = {}
        return
      }
      const allList = result.rows;
      allList.forEach((v) => {
        const inTime = toLocalTime(`${v.last_drip}.000+0000`)
        this.$set(v, 'inTime', inTime);
        this.$set(v, 'balance', v.bal.split(' ')[0]);
      })
      this.dssInfo = allList[0];
      this.handleRunReward()
    },
    // 秒级定时器
    handleRunReward() {
      clearInterval(this.secTimer)
      if (!this.dssInfo.holder || !Number(this.args.aprs) || !this.dsrPools.length) {
        return
      }
      this.handleRunLogic()
      this.secTimer = setInterval(() => {
        this.handleRunLogic()
      }, 1000);
    },
    handleRunLogic() {
      clearInterval(this.runTimer)
      let userTime = toLocalTime(`${this.dssInfo.last_drip}.000+0000`)
      userTime = moment(userTime).valueOf();
      const nowTime = moment().valueOf(); // 当前时间
      const time = (nowTime - userTime) / 1000;
      let reward = parseFloat(this.dssInfo.bal) * Math.pow(this.args.aprs, time) - parseFloat(this.dssInfo.bal)
      if (this.dssInfo.pool) {
        const pool = this.dsrPools.find(vv => vv.id === this.dssInfo.pool)
        reward = reward * pool.bonus;
      }
      if (Number(this.ableClaimNum) < Number(reward)) {
        reward = this.ableClaimNum;
      }
      reward = toFixed(reward, 8)
      const v = this.dssInfo;
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

    async handleGetDfsMarket() {
      const formName = this.scatter.identity.accounts[0].name;
      const params = {
        code: this.baseConfig.toAccountSwap,
        scope: 39,
        table: 'liquidity',
        lower_bound: ` ${formName}`,
        upper_bound: ` ${formName}`,
        json: true
      }
      const {status, result} = await get_table_rows(params)
      if (!status) {
        return
      }
      const list = result.rows || [];
      !list[0] ? this.token = '0' : this.token = `${list[0].token}`;
    },
    // 获取挖矿用户数据
    async handleGetAccMiner() {
      const formName = this.scatter.identity.accounts[0].name;
      const params = {
        code: 'miningpool11',
        scope: 39,
        table: 'miners',
        lower_bound: ` ${formName}`,
        upper_bound: ` ${formName}`,
        json: true,
      }
      const {status, result} = await get_table_rows(params);
      if (!status) {
        return
      }
      let rows = result.rows || []
      if (!rows.length) {
        return
      }
      const minerInfo = dealMinerData(rows[0])
      rows[0].minerData = JSON.parse(JSON.stringify(minerInfo));
      this.minerInfo = rows[0];
      this.handleRunRewardMarket()
    },
    handleRunRewardMarket() {
      clearInterval(this.marketTimer)
      this.marketTimer = setInterval(() => {
        this.handleRunMarketReward()
      }, 1000);
      this.handleRunMarketReward()
    },
    handleRunMarketReward() {
      clearInterval(this.marketRunTimer);
      const v = this.minerInfo;
      if (!v.minerData || !Number(v.minerData.liq)) {
        return
      }
      const reward = dealRewardV3(v.minerData, 39)
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
      this.marketRunTimer = setInterval(() => {
        countReward = accAdd(countReward, t)
        if (countReward > Number(reward)) {
          showReward = toFixed(reward, 8);
          clearInterval(this.marketRunTimer)
        } else {
          showReward = toFixed(countReward, 8);
        }
        this.$set(v, 'showReward', showReward);
      }, 50);
    }
  }
}
</script>

<style lang="scss" scoped>
.accWallet{
  color: #333;
  position: relative;
  font-size: 24px;
  background: #FFF;
  border-radius: 12px;
  margin: -60px 28px 34px;
  // padding: 24px 28px;
  box-shadow: 0px 4px 8px 0px rgba(226,226,226,0.5);
  overflow: hidden;
  .title{
    font-size: 40px;
    font-weight: 500;
    padding: 24px 28px;
    border-bottom: 1px solid #eee;
    .green_p{
      font-size: 27px;
      font-weight: normal;
    }
    .rightIcon{
      width: 10px;
      margin-left: 8px;
    }
  }
  .wallet{
    padding: 16px 0;
    text-align: left;
    .has{
      flex: 1;
      padding: 26px 28px;
      &:first-child{
        border-right: 1px solid rgba(220, 220, 220, .3);
      }
      .subTitle{
        font-weight: 500;
        margin-bottom: 12px;
      }
    }
    .num{
      font-size: 40px;
    }
    .small{
      font-size: 22px;
      font-weight: 300;
      margin-left: 10px;
    }
  }
}
</style>