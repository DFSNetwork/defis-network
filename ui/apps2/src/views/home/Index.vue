<template>
  <div class="home">
    <Banner />
    <Notice />
    <Tools />
    <MyFooter />
    <!-- <DfsInfo /> -->
    <Rank />
    <div class="fullBtn" v-if="canFull" @click="handleFullScreen">
      <img v-if="fullScreen" src="https://cdn.jsdelivr.net/gh/defis-net/material2/icon/min.png">
      <img v-else src="https://cdn.jsdelivr.net/gh/defis-net/material2/icon/full.png">
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
// import { DApp } from '@/utils/wallet';

import Banner from '@/views/home/comp/Banner';
import Notice from '@/views/home/comp/Notice';
import Tools from '@/views/home/comp/Tools';
import Rank from '@/views/home/comp/Rank';
import MyFooter from '@/components/Footer';
// import DfsInfo from '@/views/home/comp/DfsInfo';

import { dealAreaArr } from '@/views/pddex/comp/appLogic';
import { walletConnected, fullScreen } from '@/utils/wallet/fullScreen';
export default {
  name: 'home',
  components: {
    Banner,
    Notice,
    Tools,
    Rank,
    MyFooter,
    // DfsInfo,
  },
  data() {
    return {
      allMarket: {},
      pddexList: [],
      iArr: ['USDT', 'USDC', 'EOS', 'DFS', 'TAG'],
      canFull: false,
      fullScreen: parseInt(localStorage.getItem('setFullScreen') || 0),
    }
  },
  mounted() {
    this.handleGetMarkets()
    this.handleGetPddexMarketList();
    this.canFull = walletConnected()
  },
  computed: {
    ...mapState({
      baseConfig: state => state.sys.baseConfig, // 基础配置 - 默认为{}
      coinPrices: state => state.sys.coinPrices,
    })
  },
  methods: {
    handleFullScreen() {
      this.fullScreen = (this.fullScreen + 1) % 2;
      fullScreen(this.fullScreen)
      localStorage.setItem('setFullScreen', this.fullScreen)
    },
    // 获取ppdex支持交易对 配对pid
    async handleGetPddexMarketList() {
      const params = {
        code: this.baseConfig.pddex,
        scope: this.baseConfig.pddex,
        table: 'pairs',
        json: true,
        limit: 1000
      }
      const {status, result} = await this.$api.get_table_rows(params);
      if (!status) {
        return
      }
      const lists = result.rows || [];
      lists.forEach(v => {
        const sym0Arr = v.sym0.split(',')
        const sym1Arr = v.sym1.split(',')
        this.$set(v, 'symbol0', sym0Arr[1])
        this.$set(v, 'decimal0', sym0Arr[0])
        this.$set(v, 'symbol1', sym1Arr[1])
        this.$set(v, 'decimal1', sym1Arr[0])
      })
      this.pddexList = lists;
      this.handleDealAllMarket()
    },
    // 获取行情数据
    async handleGetMarkets() {
      const {status, result} = await this.$api.getPddexMarkets()
      if (!status) {
        return
      }
      const keys = Object.keys(result);
      const lists = {}
      keys.forEach(key => {
        let coin = key.split('_markets')[0].toUpperCase()
        if (coin === 'BTC' || coin.toLowerCase() === 'display_limit') {
          return
        }
        coin = coin === 'BTC' ? coin = 'PBTC' : coin;
        const arr = dealAreaArr(result[key] || [], coin)
        lists[coin] = arr;
      })
      this.allMarket = lists;
      this.handleDealAllMarket()
    },
    // 处理 allMarket 对应pid
    handleDealAllMarket() {
      const keys = Object.keys(this.allMarket) || []
      if (!keys.length || !this.pddexList.length) {
        return
      }
      let allMarket = []
      this.iArr.forEach(key => {
        allMarket.push(...this.allMarket[key])
      })
      // keys.forEach(key => {
      //   allMarket.push(...this.allMarket[key])
      // })
      allMarket.forEach(v => {
        const has = this.pddexList.find(vv => {
          return (vv.contract0 === v.contract0 && vv.symbol0 === v.symbol0 && vv.contract1 === v.contract1 && vv.symbol1 === v.symbol1)
              || (vv.contract0 === v.contract1 && vv.symbol0 === v.symbol1 && vv.contract1 === v.contract0 && vv.symbol1 === v.symbol0)
        })
        if (!has) {
          return
        }
        this.$set(v, 'pid', has.pid)
        this.$set(v, 'unikey', has.unikey)
      })
      this.$store.dispatch('setPddexMarketLists', allMarket)
    },
  }
}
</script>

<style lang="scss" scoped>
.home{
  background: linear-gradient(to bottom, #FFF, #fafafa 80px , #F6F6F6);
  min-height: 100vh;
  padding-bottom: 30px;
  .fullBtn{
    position: fixed;
    top: 49%;
    left: 0px;
    padding: 18px;
    background: rgba(#FFF, .8);
    border-radius: 4px;
    font-size: 20px;
    color: $color-tip;
    box-shadow: 3px 0 5px 2px rgba(#eee, .8);
    z-index: 2;
    img{
      opacity: .5;
      display: block;
      width: 40px;
      margin: auto;
    }
  }
}
</style>
