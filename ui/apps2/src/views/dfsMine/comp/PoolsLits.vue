<template>
  <div class="poolsLists">
    <div class="title flexb">
      <span>{{ $t('mine.poolsList') }}</span>
      <!-- <div class="flexa rules">
        <img class="tipImg" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/tips_icon_btn.svg">
        <span>挖矿规则</span>
      </div> -->
    </div>

    <div class="lists">
      <div class="tip noData" v-if="!lists.length">Loading...</div>
      <div class="list" v-for="(v, i) in lists" :key="i" @click="handleToMarket(v)">
        <div class="bgShadow" v-if="v.mid === 17 || v.mid === 39 || v.mid === 451"></div>
        <div class="info">
          <div class="flexa">
            <img class="coinLogo" :src="v.imgUrl1">
            <div style="flex: 1">
              <div class="flexb">
                <div class="coinName">{{ v.symbol1 }} / {{ v.symbol0 }}</div>
                <div class="apy din">APY: {{ handleGetApy(v) }}%</div>
              </div>
              <div class="dinBold reward">{{ v.showReward || '0.00000000' }}</div>
            </div>
          </div>
          <div class="liq flexa dinReg tip">
            <div>{{ $t('dex.pools') }}：</div>
            <div>{{ parseInt(v.reserve1) }} {{ v.symbol1 }} / {{ parseInt(v.reserve0) }} {{ v.symbol0 }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { DApp } from '@/utils/wallet';
import moment from 'moment';
import { mapState } from 'vuex';
import { dfsMineLists, getApy, getReward } from '../dfsMine'
import { sellToken } from '@/utils/logic';
import { toLocalTime, toFixed } from '@/utils/public';
export default {
  name: 'poolsLists',
  props: {
    swapBal: {
      type: Object,
      default: function sbl() {
        return {}
      }
    },
    allBal: {
      type: Object,
      default: function sbl() {
        return {}
      }
    },
  },
  data() {
    return {
      getMarkets: false,
      lists: [],
      accLiqs: [],
      runTimer: [],
      listsTimer: null,
    }
  },
  beforeDestroy() {
    clearTimeout(this.listsTimer)
    clearInterval(this.runTimer)
  },
  computed: {
    ...mapState({
      // 箭头函数可使代码更简练
      account: state => state.app.account,
      damping: state => state.sys.damping,
      rankInfoV3: state => state.sys.rankInfoV3,
      marketLists: state => state.sys.marketLists,
    }),
    dfsApy() {
      const apy = getApy(this.allBal, this.swapBal,'dfs');
      return parseFloat(apy || 0).toFixed(2)
    },
    eosApy() {
      const apy = getApy(this.allBal, this.swapBal,'eos');
      return parseFloat(apy || 0).toFixed(2)
    },
    usdtApy() {
      const apy = getApy(this.allBal, this.swapBal,'usdt');
      return parseFloat(apy || 0).toFixed(2)
    },
  },
  watch: {
    marketLists: {
      handler: function ml(newVal) {
        if (!newVal.length || !this.rankInfoV3.length || this.getMarkets) {
          return
        }
        this.handleDealLists();
      },
      deep: true,
      immediate: true
    },
    account: {
      handler: function ml(newVal) {
        if (!newVal.name) {
          return
        }
        this.handleGetLiqs();
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    handleToMarket(item) {
      this.$router.push({
        name: 'dfsMinePool',
        params: {
          mid: item.mid
        }
      })
    },
    handleClaim() {
      if (!this.account.name) {
        return
      }
      const formName = this.account.name;
      const permission = this.account.permissions;
      const actions = [];
      this.lists.forEach(item => {
        if (!item.reward || Number(item.reward) < Number(this.minReward)) {
          return
        }
        actions.push({
          account: 'miningpool11',
          name: 'claim2',
          authorization: [{
            actor: formName, // 转账者
            permission,
          }],
          data: {
            user: formName,
            mid: item.mid,
          }
        })
      })
      if (!actions.length) {
        return
      }
      const params = {
        actions
      }
      DApp.toTransaction(params, (err) => {
        this.loading = false;
        if (err && err.code === 402) {
          this.$emit('listenUpdate', true)
          return;
        }
        if (err) {
          this.$toast({
            type: 'fail',
            message: err.message,
          })
          return;
        }
        this.$toast({
          type: 'success',
          message: 'Success'
        })
        this.handleGetLiqs();
      })
    },
    handleDealLists() {
      this.getMarkets = true;
      const rankInfoV3 = this.rankInfoV3;
      const markets = JSON.parse(JSON.stringify(this.marketLists))
      let lists = [];
      rankInfoV3.forEach(v => {
        const item = markets.find(vv => vv.mid === v.mid)
        lists.push(item)
      });
      this.lists = dfsMineLists(lists, [39, 17, 451]);
      // this.$forceUpdate()
      this.handleDealReward()
    },
    handleGetApy(v) {
      let apy = 0;
      if (v.contract0 === 'tethertether' || v.contract1 === 'tethertether') {
        apy = parseFloat(apy || 0) + parseFloat(this.usdtApy || 0);
      }
      if (v.contract0 === 'eosio.token' || v.contract1 === 'eosio.token') {
        apy = parseFloat(apy || 0) + parseFloat(this.eosApy || 0);
      }
      if (v.contract0 === 'minedfstoken' || v.contract1 === 'minedfstoken') {
        apy = parseFloat(apy || 0) + parseFloat(this.dfsApy || 0);
      }
      return parseFloat(apy || 0).toFixed(2)
    },
    async handleGetLiqs() {
      const name = this.account.name;
      const params = {
        "code":"defislogsone",
        "scope": ` ${name}`,
        "table":"liqs2",
        "json":true,
        limit: 1000,
      }
      const { status, result } = await this.$api.get_table_rows(params);
      if (!status) {
        return
      }
      const list = result.rows || [];
      this.accLiqs = list;
      this.handleDealReward()
    },
    handleDealReward() {
      if (!this.accLiqs.length || !this.lists.length) {
        return
      }
      this.lists.forEach(async v => {
        const hasLiq = this.accLiqs.find(vv => vv.mid === v.mid);
        if (!hasLiq) {
          return
        }
        const name = this.account.name;
        // 获取DFS
        const params = {
          code: 'miningpool11',
          scope: v.mid,
          table: 'miners2',
          lower_bound: ` ${name}`,
          upper_bound: ` ${name}`,
          json: true,
        }
        const {status, result} = await this.$api.get_table_rows(params);
        if (!status || !result.rows.length) {
          return
        }
        const row = result.rows[0];
        const item = this.lists.find(vv => vv.mid === v.mid)
        const inData = {
          poolSym0: item.reserve0.split(' ')[0],
          poolSym1: item.reserve1.split(' ')[0],
          poolToken: item.liquidity_token,
          sellToken: `${row.token}`
        }
        const nowMarket = sellToken(inData);
        row.liq_bal0 = `${parseFloat(nowMarket.getNum1).toFixed(item.decimal0)} ${item.symbol0}`
        row.liq_bal1 = `${parseFloat(nowMarket.getNum2).toFixed(item.decimal1)} ${item.symbol1}`
        let lastTime = toLocalTime(`${row.last_drip}.000+0000`);
        row.lastTime = moment(lastTime).valueOf();

        this.$set(v, 'minnerData', row)
      })
      this.handleRunRewardTimer()
    },
    handleRunRewardTimer() {
      clearTimeout(this.listsTimer)
      this.listsTimer = setTimeout(() => {
        this.handleRunRewardTimer()
      }, 1000);
      this.lists.forEach(v => {
        if (!v.minnerData || !v.minnerData.token) {
          return
        }
        let reward = 0
        if (v.contract0 === 'tethertether' || v.contract1 === 'tethertether') {
          const num = v.contract0 === 'tethertether' ? parseFloat(v.minnerData.liq_bal0) : parseFloat(v.minnerData.liq_bal1) 
          const reward0 = getReward({
            poolBal: this.allBal.usdtPoolsBal,
            swapBal: this.swapBal.usdtSwapBal
          }, {
            lastTime: v.minnerData.lastTime,
            num
          })
          reward = parseFloat(reward || 0) + parseFloat(reward0 || 0);
        }
        if (v.contract0 === 'eosio.token' || v.contract1 === 'eosio.token') {
          const num = v.contract0 === 'eosio.token' ? parseFloat(v.minnerData.liq_bal0) : parseFloat(v.minnerData.liq_bal1) 
          const reward0 = getReward({
            poolBal: this.allBal.eosPoolsBal,
            swapBal: this.swapBal.eosSwapBal
          }, {
            lastTime: v.minnerData.lastTime,
            num
          })
          reward = parseFloat(reward || 0) + parseFloat(reward0 || 0);
        }
        if (v.contract0 === 'minedfstoken' || v.contract1 === 'minedfstoken') {
          const num = v.contract0 === 'minedfstoken' ? parseFloat(v.minnerData.liq_bal0) : parseFloat(v.minnerData.liq_bal1) 
          const reward0 = getReward({
            poolBal: this.allBal.dfsPoolsBal,
            swapBal: this.swapBal.dfsSwapBal
          }, {
            lastTime: v.minnerData.lastTime,
            num
          })
          reward = parseFloat(reward || 0) + parseFloat(reward0 || 0);
        }
        this.$set(v, 'reward', reward)
      })
      this.handleRun()
    },
    handleRun() {
      clearInterval(this.runTimer)
      this.runTimer = setInterval(() => {
        let total = 0;
        this.lists.forEach(v => {
          if (!v.minnerData || !v.minnerData.token || !parseFloat(v.reward)) {
            return
          }
          const reward = v.reward;
          let showReward = v.showReward || reward;
          let tReward = v.tReward || showReward;
          const t = (reward - showReward) / 20;

          tReward = Number(tReward) + Number(t);
          showReward = toFixed(tReward, 8)
          this.$set(v, 'showReward', showReward)
          this.$set(v, 'tReward', tReward)
          total = parseFloat(total || 0) + parseFloat(showReward || 0)
          this.$emit('totalClaim', total)
        })
      }, 50);
    },
  }
}
</script>

<style lang="scss" scoped>
.poolsLists{
  margin: 30px 0;
  .title{
    font-size: 32px;
    &>span{
      position: relative;
      padding-left: 32px;
      font-weight: 500;
      &::before{
        position: absolute;
        content: '';
        height: 28px;
        width: 8px;
        border-radius: 4px;
        background: $color-main;
        top: 50%;
        left: 4px;
        transform: translate(0, -50%);
      }
    }
    .rules{
      font-size: 24px;
      color: #999;
      .tipImg{
        width: 28px;
        margin-right: 9px;
      }
    }
  }
  .lists{
    text-align: left;
    .noData{
      text-align: center;
      padding: 50px;
    }
    .list{
      position: relative;
      margin: 36px 0;
      border-radius: 12px;
      box-shadow: 2px 2px 10px 4px rgba(230,230,230,0.64);
    }
    .info{
      border-radius: 12px;
      padding: 30px;
      position: relative;
      z-index: 1;
      background: rgba(#FFF, 1);
    }
    .coinLogo{
      width: 80px;
      margin-right: 15px;
    }
    .coinName{
      font-size: 32px;
      font-weight: 500;
    }
    .apy{
      color: $color-main;
    }
    .reward{
      font-size: 44px;
    }
    .liq{
      margin-top: 15px;
    }
  }
}
</style>