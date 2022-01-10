<template>
  <div>
    <transition name="fade" mode="out-in">
      <router-view class="content" @listenUpdate="handleUpdate"/>
    </transition>
    <!-- <PddexTab /> -->
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { DApp } from '@/utils/wallet';
import { dealAreaArr } from '@/views/pddex/comp/appLogic';

export default {
  name: 'pddex',
  components: {
  },
  data() {
    return {
      dfsLists: [],
      allMarket: {},
      pddexList: [],
      iArr: ['USDT', 'USDC', 'EOS', 'DFS', 'TAG']
    }
  },
  mounted() {
    this.handleGetMarkets()
    this.handleGetPddexMarketList();
    DApp.scatterInit(this, () => {
    })
  },
  computed: {
    ...mapState({
      baseConfig: state => state.sys.baseConfig, // 基础配置 - 默认为{}
      marketLists: state => state.sys.marketLists, // 生产环境
    })
  },
  watch: {
    marketLists: {
      handler: function ml(newVal) {
        this.dfsLists = newVal
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    handleUpdate() {
      this.handleGetMarkets()
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

</style>
