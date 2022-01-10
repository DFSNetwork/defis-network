<template>
  <div class="chartDiv" >
    <div class="title">市场详情</div>
    <MarketInfo :checkedMarket="checkedMarket"/>
    <div class="kline">
      <div class="kTitle flexa">价格K线</div>
      <ChardingView :checkedMarket="checkedMarket"/>
    </div>
    <MinerLists :checkedMarket="checkedMarket"/>

    <div class="nullDiv"></div>
    <div class="btnDiv flexb">
      <div class="btn flexc" @click="handleTo('index')">{{ $t('tab.dex') }}</div>
      <div class="btn market flexc" @click="handleTo('market')">{{ $t('tab.pools') }}</div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import ChardingView from './ChardingView';
import MarketInfo from './comp/MarketInfo';
import MinerLists from './comp/MinerLists';

export default {
  name: 'kLine',
  components: {
    ChardingView,
    MarketInfo,
    MinerLists,
  },
  data() {
    return {
      checkedMarket: {
        // mid: 17,
        symbol0: 'EOS',
        symbol1: 'USDT',
        imgUrl0: 'https://cdn.jsdelivr.net/gh/defis-net/material2/coin/eosio.token-eos.svg',
        imgUrl1: 'https://ndi.340wan.com/eos/tethertether-usdt.png',
      }
    }
  },
  mounted() {
  },
  computed: {
    ...mapState({
      account: state => state.app.account,
      marketLists: state => state.config.marketLists,
      tradeInfo: state => state.sys.tradeInfo,
      baseConfig: state => state.config.baseConfig,
    }),
  },
  watch: {
    marketLists: {
      handler: function ml() {
        this.handleGetMarket()
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    handleTo(name) {
      const params = {
        name,
        params: {
          mid: this.checkedMarket.mid,
        }
      }
      if (name === 'index') {
        const query = {
          in: 'tethertether-USDT',
          out: 'usdxusdxusdx-USDC'
        }
        params.query = query;
      }
      this.$router.push(params)
    },
    handleToTrade() {
      let symbol = 'eosio.token-eos-minedfstoken-dfs';
      const li = this.checkedMarket;
      if (li) {
        symbol = `${li.contract1}-${li.symbol1}-${li.contract0}-${li.symbol0}`
      }
      this.$router.push({
        name: 'pddexTrade',
        params: {
          symbol,
        }
      })
    },
    handleGetMarket() {
      const params = this.$route.params;
      const arr = params.symbol.split('-')
      try {
        const checkedMarket = this.marketLists.find(v => {
          return v.symbol1 === arr[1].toUpperCase() && v.symbol0 === arr[3].toUpperCase()
              && v.contract1 === arr[0] && v.contract0 === arr[2] 
        })
        if (checkedMarket) {
          this.checkedMarket = checkedMarket;
        }
      } catch (error) {
        return
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.chartDiv{
  color: #333;
  font-size: 28px;
  text-align: left;
  .title{
    font-size: 32px;
    text-align: center;
    padding: 26px;
    border-bottom: 10px solid #f5f5f5;
  }
  .kline{
    .kTitle{
      background: #F5F5F5;
      font-size: 30px;
      height: 80px;
      padding-left: 28px;
    }
  }
  .nullDiv{
    height: 130px;
  }
  .btnDiv{
    position: fixed;
    bottom: 0px;
    padding: 12px 28px 32px;
    background: #FFF;
    width: 100%;
    box-sizing: border-box;
    max-width: 750px;
    .btn{
      flex: 1;
      height: 85px;
      border-radius: 48px;
      background: #29D4B0;
      color: #FFF;
      font-size: 34px;
      &.market{
        background: #FFF;
        color: #29D4B0;
        border: 2px solid #29D4B0;
        margin-left: 28px;
      }
    }
  }
}
</style>
