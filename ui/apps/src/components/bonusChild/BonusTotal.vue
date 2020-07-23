<template>
  <div class="list">
    <div class="next">
      <div class="item mt12">
        <span>{{ $t('bonus.nextDividends') }}</span>
        <span>{{ `${timeJson.hours}:${timeJson.minutes}:${timeJson.seconds}` }}</span>
      </div>
      <div class="item">
        <span>{{ $t('bonus.totalDividends') }}</span>
        <span>{{ balanceEos }} EOS</span>
      </div>
    </div>
    <div class="item mt12">
      <span>{{ $t('bonus.dfsSupply') }}</span>
      <span>{{ outTeamSupply }} DFS</span>
    </div>
    <div class="item">
      <span>{{ $t('bonus.dfsStaked') }}</span>
      <span>{{ balanceDfs }} DFS</span>
    </div>
    <div class="item mt12">
      <span></span>
      <span class="small">{{ $t('bonus.ofPercent', {percent}) }}</span>
    </div>
    <div class="item">
      <span>{{ $t('hyk.perBonus') }}</span>
      <span class="green">{{ dealWDfs }} EOS</span>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { mapState } from 'vuex';
import { EosModel } from '@/utils/eos';
import { toFixed, accMul, accDiv, countdown, toLocalTime, accSub } from "@/utils/public";

export default {
  name: 'BonusTotal',
  data() {
    return {
      nextTime: '',
      perDfs: '0.0000',
      wDfs: '0.0000',
      balanceDfs: '0.0000',
      balanceEos: '0.0000',
      balanceTeam: '0.0000',
      timeJson: {
        days: 0,
        hours: '00',
        minutes: '00',
        seconds: '00',
        total: 0,
      },
      supply: '0.0000',
      outTeamSupply: '0.0000',
      timer: null,
      balanTimer: null,
    }
  },
  computed:{
     ...mapState({
      // 箭头函数可使代码更简练
      scatter: state => state.app.scatter,
      baseConfig: state => state.sys.baseConfig, // 基础配置 - 默认为{}
    }),
    percent() {
      if (!Number(this.outTeamSupply) || !Number(this.balanceDfs)) {
        return '0.00'
      }
      let p = accDiv(this.balanceDfs, this.outTeamSupply)
      p = accMul(p, 100);
      return toFixed(p, 4)
    },
    dealWDfs() {
      if (!Number(this.balanceDfs)) {
        return '0.0000'
      }
      const perDfs = accDiv(this.balanceEos, this.balanceDfs)
      return toFixed(accMul(perDfs, 10000), 4);
    }
  },
  mounted() {
    this.handleGetBonusInfo();
    this.handleStartBalanTimer();
    this.handleGetDfsStats();
  },
  beforeDestroy() {
    clearInterval(this.timer)
    clearInterval(this.balanTimer)
    this.handleGetDfsStats();
  },
  methods: {
    // 开启余额定时器
    handleStartBalanTimer() {
      this.handleGetBalance();
      this.handleGetBalance('staked');
      clearInterval(this.balanTimer)
      this.balanTimer = setInterval(() => {
        this.handleGetBalance();
        this.handleGetBalance('staked');
      }, 20000)
    },
    // 获取分红信息
    handleGetBonusInfo() {
      const params = {
        code: 'defidividend',
        scope: 'defidividend',
        table: 'divds',
        json: true
      }
      EosModel.getTableRows(params, (res) => {
        this.nextTime = toLocalTime(res.rows[0].next_dividend + '.000+0000');
        // this.nextTime = toLocalTime('2020-07-16T09:28:45.000+0000');
        this.perDfs = res.rows[0].reward_per_dfs;
        // this.wDfs = toFixed(accMul(this.perDfs, 10000), 4);
        this.timeJson = countdown(this.nextTime)
        this.$emit('listenPerDfs', this.perDfs)
        clearInterval(this.timer)
        this.timer = setInterval(() => {
          if (this.timeJson.total <= 0) {
            clearInterval(this.timer)
          }
          this.timeJson = countdown(this.nextTime)
        }, 1000);
      })
    },
    // 获取账户余额
    async handleGetBalance(type) {
      let params = { // 分红合约余额
        code: this.baseConfig.baseCoinContract,
        coin: 'EOS',
        decimal: 4,
        account: 'defidividend',
      }
      if (type === 'staked') {
        params = { // 质押合约余额
          code: 'minedfstoken',
          coin: 'DFS',
          decimal: 4,
          account: 'defistakedfs',
        }
      }
      if (type === 'team') {
        params = { // 质押合约余额
          code: 'minedfstoken',
          coin: 'DFS',
          decimal: 4,
          account: 'difesteam111',
        }
      }
      await EosModel.getCurrencyBalance(params, res => {
        let balance = '0.0000'
        if (!res || res.length === 0) {
          balance = '0.0000';
        } else {
          balance = res.split(' ')[0];
        }
        if (type === 'staked') {
          this.balanceDfs = balance;
          return;
        }
        if (type === 'team') {
          this.balanceTeam = balance;
          let outTeamSupply = accSub(this.supply, this.balanceTeam)
          this.outTeamSupply = toFixed(outTeamSupply, 4)
          return
        }
        this.balanceEos = toFixed(accMul(balance, 0.5), 4);
      })
    },
    // 获取总发行量
    async handleGetDfsStats() {
      const https = this.baseConfig.node.url;
      const params = {
        code: 'minedfstoken',
        symbol: 'DFS'
      }
      const result = await axios.post(`${https}/v1/chain/get_currency_stats`, JSON.stringify(params))
      if (result.status !== 200) {
        return;
      }
      const res = result.data['DFS'];
      this.supply = res.supply.split(' ')[0];
      await this.handleGetBalance('team')
    },
  }
}
</script>

<style lang="scss" scoped>
.list{
  font-size: 14px;
  color: #070707;
  position: relative;
  .stop{
    position: absolute;
    background: rgba(255,255,255, .8);
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .next{
    background: #f9f9f9;
    padding: 20px 15px;
    margin: 20px 0 18px;
  }
  .item{
    display: flex;
    align-items: center;
    justify-content: space-between;
    &.mt12{
      margin-bottom: 12px;
    }
    &.mt15{
      margin-bottom: 15px;
    }
    span{
      &:last-child{
        font-weight: 500;
      }
      &.small{
        font-size: 12px;
        // margin-top: 3px;
        font-weight: normal !important;
      }
    }
    .right{
      font-size: 12px;
      margin-left: 10px;
    }
  }
  .bonusNum{
    font-weight: 500;
    font-size: 16px;
    text-align: left;
  }
  .inputItem{
    background: #f9f9f9;
    height: 37px;
    margin-top: 5px;
    input{
      background: transparent;
      height: 100%;
      width: calc(100% - 70px);
      border: 0px;
      outline: none;
      font-size: 14px;
      padding-left: 10px;
    }
    .btn{
      font-size: 12px;
      font-weight: 500;
      height: 31px;
      width: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #42B48F;
      color: #f9f9f9;
      border-radius: 2px;
      margin-right: 10px;
    }
  }
}
</style>