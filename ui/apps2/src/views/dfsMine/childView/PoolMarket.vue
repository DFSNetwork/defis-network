<template>
  <div class="poolMarket">
    <div class="select din flexa" @click="showMarketList = true">
      <span>{{ thisMarket.symbol0 }}-{{ thisMarket.symbol1 }} {{ $t('mine.pools') }}</span>
      <img class="selectImg" src="https://cdn.jsdelivr.net/gh/defis-net/material2/icon/select.png">
    </div>

    <RewardInfo :total="accMiner.showReward" @listenUpdate="handleClaim"/>
    <div class="marketInfo">
      <div class="coinInfo flexb">
        <div class="flexa">
          <img class="logo" :src="thisMarket.sym0Data.imgUrl" >
          <div>
            <div class="coinName">{{ thisMarket.symbol0 }}</div>
            <div class="contract tip">{{ thisMarket.contract0 }}</div>
          </div>
        </div>
        <img class="addImg" src="https://cdn.jsdelivr.net/gh/defis-net/material/svg/add.svg">
        <div class="flexa">
          <img class="logo" :src="thisMarket.sym1Data.imgUrl" >
          <div>
            <div class="coinName">{{ thisMarket.symbol1 }}</div>
            <div class="contract tip">{{ thisMarket.contract1 }}</div>
          </div>
        </div>
      </div>
      <div class="apy flexa">
        <span>{{ $t('apy.title') }}：</span>
        <span class="dinBold num">{{ apy }}%</span>
        <span class="green" @click="showApyDetail = true">{{ $t('public.detail') }}></span>
      </div>
      <div class="liq dinReg">
        {{ $t('dex.pools') }}：{{ thisMarket.reserve0 }} / {{ thisMarket.reserve1 }}
      </div>
    </div>

    <MinerLists :allBal="allBal" :swapBal="swapBal"/>



    <!-- 弹窗组件 -->
    <van-popup
      class="newMarket"
      v-model="showMarketList"
      position="left">
      <market-list :marketLists="marketLists"
        @listenMarketChange="handleMarketChange"
        @listenClose="handleClose"/>
    </van-popup>

    <van-popup
      class="popup_p"
      v-model="showApyDetail">
      <MarketApy :countApy="apy" :isActual="true"
                 :aprInfo="aprInfo"/>
    </van-popup>
  </div>
</template>

<script>
import { DApp } from '@/utils/wallet';
import { mapState } from 'vuex';
import moment from 'moment';

import { sellToken } from '@/utils/logic';
import { toLocalTime, toFixed } from '@/utils/public';
import { getReward } from '../dfsMine'

import RewardInfo from '../comp/RewardInfo'
import MinerLists from '../comp/MinerLists'
import MarketList from '@/components/MarketArea';
import MarketApy from '@/views/market/popup/MarketApy'
export default {
  name: 'poolMarket',
  components: {
    RewardInfo, MinerLists, MarketList, MarketApy,
  },
  data() {
    return {
      totalReward: '0.0000',
      thisMarket: {
        symbol0: 'EOS',
        symbol1: 'DFS',
        sym0Data: {},
        sym1Data: {},
      },
      allBal: {},
      swapBal: {},
      accMiner: {},
      apy: '0.00',

      secTimer: null,
      runTimer: null,
      showMarketList: false,
      showApyDetail: false,
      aprInfo: {},
    }
  },
  mounted() {
    this.handleGetSwapBal('dfs')
    this.handleGetSwapBal('eos')
    this.handleGetSwapBal('usdt')
    this.handleGetBal('dfs')
    this.handleGetBal('eos')
    this.handleGetBal('usdt')
    this.handleGetApy()
  },
  beforeDestroy() {
    clearTimeout(this.secTimer)
    clearInterval(this.runTimer)
  },
  computed: {
    ...mapState({
      account: state => state.app.account,
      marketLists: state => state.sys.marketLists,
    }),
  },
  watch: {
    '$route': {
      handler: function rt(newVal) {
        if (newVal.params.mid == this.thisMarket.mid) {
          return
        }
        const market = this.marketLists.find(v => v.mid == this.$route.params.mid);
        if (this.thisMarket.mid === market.mid) {
          return
        }
        this.thisMarket = market || {};
        this.handleDealMiner()
        this.handleGetAccLiq()
      },
      deep: true,
      immediate: true
    },
    marketLists: {
      handler: function mls(newVal) {
        if (!newVal.length) {
          return
        }
        const market = newVal.find(v => v.mid == this.$route.params.mid);
        if (this.thisMarket.mid === market.mid) {
          return
        }
        this.thisMarket = market || {};
        this.handleDealMiner()
      },
      deep: true,
      immediate: true
    },
    account: {
      handler: function mls(newVal) {
        if (!newVal.name) {
          return
        }
        this.handleGetAccLiq()
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    async handleGetApy() {
      const params = {
        mid: this.$route.params.mid
      };
      const {status, result} = await this.$api.get_market_info(params)
      if (!status) {
        return
      }
      this.apy = parseFloat(result.apy || 0).toFixed(2);
      this.aprInfo = result.apy_detail
    },
    handleClose() {
      this.showMarketList = false;
    },
    handleMarketChange(item) {
      this.handleClose()
      this.$router.replace({
        name: 'dfsMinePool',
        params: {
          mid: item.mid
        }
      })
    },
    // 获取swap做市余额
    async handleGetSwapBal(type = "dfs") {
      const params = {
        code: 'minedfstoken',
        symbol: 'DFS',
        decimal: 4,
        account: 'defisswapcnt'
      }
      if (type === 'eos') {
        params.code = 'eosio.token'
        params.symbol = 'EOS'
      } else if (type === 'usdt') {
        params.code = 'tethertether'
        params.symbol = 'USDT'
      }
      const {status, result} = await this.$api.get_currency_balance(params);
      if (!status) {
        return
      }
      const bal = result;
      if (type === 'dfs') {
        this.$set(this.swapBal, 'dfsSwapBal', parseFloat(bal) + '')
      } else if (type === 'eos') {
        this.$set(this.swapBal, 'eosSwapBal', parseFloat(bal) + '')
      } else if (type === 'usdt') {
        this.$set(this.swapBal, 'usdtSwapBal', parseFloat(bal) + '')
      }
    },
    // 获取矿池余额
    async handleGetBal(type = "total") {
      const params = {
        code: 'minedfstoken',
        symbol: 'DFS',
        decimal: 4,
        account: 'dfsavingpool'
      }
      if (type === 'dfs') {
        params.account = 'dfspool11111'
      } else if (type === 'eos') {
        params.account = 'dfspool22222'
      } else if (type === 'usdt') {
        params.account = 'dfspool33333'
      } else if (type === 'dss') {
        params.account = 'dfspool44444'
      }
      const {status, result} = await this.$api.get_currency_balance(params);
      if (!status) {
        return
      }
      const bal = result;
      if (type === 'dfs') {
        this.$set(this.allBal, 'dfsPoolsBal', parseFloat(bal) + '')
      } else if (type === 'eos') {
        this.$set(this.allBal, 'eosPoolsBal', parseFloat(bal) + '')
      } else if (type === 'usdt') {
        this.$set(this.allBal, 'usdtPoolsBal', parseFloat(bal) + '')
      }
    },
    // 获取用户做市数据
    async handleGetAccLiq() {
      const name = this.account.name;
      if (!name) {
        this.accMiner = {}
        return
      }
      const params = {
        code: "miningpool11",
        scope: this.$route.params.mid,
        table: "miners2",
        limit: 200,
        json: true,
        lower_bound: ` ${name}`,
        upper_bound: ` ${name}`,
      };
      const {status, result} = await this.$api.get_table_rows(params)
      if (!status || !result.rows.length) {
        this.accMiner = {}
        return
      }
      this.accMiner = result.rows[0];
      this.handleDealMiner()
    },
    handleDealMiner() {
      if (!this.accMiner.token || !this.thisMarket.mid) {
        return;
      }
      const v = this.accMiner;
      const inData = {
        poolSym0: parseFloat(this.thisMarket.reserve0),
        poolSym1: parseFloat(this.thisMarket.reserve1),
        poolToken: this.thisMarket.liquidity_token,
        sellToken: v.token
      }
      const nowMarket = sellToken(inData);
      v.liq_bal0 = `${parseFloat(nowMarket.getNum1).toFixed(this.thisMarket.decimal0)} ${this.thisMarket.symbol0}`
      v.liq_bal1 = `${parseFloat(nowMarket.getNum2).toFixed(this.thisMarket.decimal1)} ${this.thisMarket.symbol1}`
      let lastTime = toLocalTime(`${v.last_drip}.000+0000`);
      v.lastTime = moment(lastTime).valueOf();
      this.accMiner = v;
      this.handleRunReward()
    },
    handleRunReward() {
      clearTimeout(this.secTimer)
      this.secTimer = setTimeout(() => {
        this.handleRunReward()
      }, 1000);
      const arr = [this.accMiner];
      arr.forEach(v => {
        if (!v.token) {
          return
        }
        const market = this.thisMarket;
        let reward = 0
        if (market.contract0 === 'tethertether' || market.contract1 === 'tethertether') {
          const num = market.contract0 === 'tethertether' ? parseFloat(v.liq_bal0) : parseFloat(v.liq_bal1) 
          const reward0 = getReward({
            poolBal: this.allBal.usdtPoolsBal,
            swapBal: this.swapBal.usdtSwapBal
          }, {
            lastTime: v.lastTime,
            num
          })
          reward = parseFloat(reward || 0) + parseFloat(reward0 || 0);
        }
        if (market.contract0 === 'eosio.token' || market.contract1 === 'eosio.token') {
          const num = market.contract0 === 'eosio.token' ? parseFloat(v.liq_bal0) : parseFloat(v.liq_bal1) 
          const reward0 = getReward({
            poolBal: this.allBal.eosPoolsBal,
            swapBal: this.swapBal.eosSwapBal
          }, {
            lastTime: v.lastTime,
            num
          })
          reward = parseFloat(reward || 0) + parseFloat(reward0 || 0);
        }
        if (market.contract0 === 'minedfstoken' || market.contract1 === 'minedfstoken') {
          const num = market.contract0 === 'minedfstoken' ? parseFloat(v.liq_bal0) : parseFloat(v.liq_bal1) 
          const reward0 = getReward({
            poolBal: this.allBal.dfsPoolsBal,
            swapBal: this.swapBal.dfsSwapBal
          }, {
            lastTime: v.lastTime,
            num
          })
          reward = parseFloat(reward || 0) + parseFloat(reward0 || 0);
        }
        this.$set(v, 'reward', reward)
      })
      this.accMiner = arr[0]
      this.handleRun()
    },
    // 数据滚动效果
    handleRun() {
      clearInterval(this.runTimer)
      this.runTimer = setInterval(() => {
        const v = this.accMiner
        if (!v.token || !parseFloat(v.reward)) {
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
      }, 50);
    },
    handleClaim() {
      if (!this.account.name) {
        return
      }
      const formName = this.account.name;
      const permission = this.account.permissions;
      const actions = [];
      if (!this.accMiner.reward || Number(this.accMiner.reward) < Number(this.minReward)) {
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
          mid: this.thisMarket.mid,
        }
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
        this.handleGetAccLiq();
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.poolMarket{
  color: #333;
  padding: 0 30px;
  font-size: 28px;
  .select{
    font-size: 36px;
    margin-bottom: 20px;
    .selectImg{
      width: 32px;
      height: 20px;
      margin-left: 10px;
    }
  }
  .marketInfo{
    text-align: left;
    padding: 28px;
    border-radius: 12px;
    margin: 30px 0;
    box-shadow: 4px 4px 10px 4px rgba(230,230,230,0.64);
    .coinInfo{
      margin-bottom: 20px;
      .logo{
        width: 70px;
        height: 70px;
        margin-right: 12px;
      }
      .coinName{
        font-size: 32px;
      }.contract{
        font-size: 24px;
      }
      .addImg{
        width: 30px;
      }
    }
    .apy{
      margin-bottom: 16px;
      font-size: 28px;
      .num{
        font-size: 30px;
      }
      .green{
        color: $color-main;
        margin-left: 15px;
      }
    }
    .liq{
      color: #000;
    }
  }
}
</style>
