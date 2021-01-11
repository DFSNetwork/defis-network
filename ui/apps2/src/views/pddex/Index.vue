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
import { logicToDealBoxMarket, logicToDealBoxMids } from './comp/appLogic'
import { DApp } from '@/utils/wallet';
import { dealAreaArr } from '@/views/pddex/comp/appLogic';

export default {
  name: 'pddex',
  components: {
  },
  data() {
    return {
      boxMarketList: [],
      dfsLists: [],
      allMarket: {},
    }
  },
  mounted() {
    this.handleGetMarkets()
    this.handleGetPddexMarketList();
    // this.handleGetBoxMids()
    // this.handleBoxLists();
    DApp.scatterInit(this, () => {
    })
  },
  computed: {
    ...mapState({
      baseConfig: state => state.sys.baseConfig, // 基础配置 - 默认为{}
      marketLists: state => state.sys.marketLists, // 生产环境
      boxMids: state => state.config.boxMids, // 生产环境
    })
  },
  watch: {
    boxMids: {
      handler: function bm() {
        if (!this.boxMarketList.length) {
          return
        }
        const boxLists = logicToDealBoxMarket(this.boxMarketList)
        this.boxLists = boxLists;
        // this.handleDealBoxAndDfs()
      },
      deep: true,
      immediate: true,
    },
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
    // 获取支持box的交易对id
    async handleGetBoxMids() {
      const {status, result} = await this.$api.boxMidsAndOrder();
      if (!status) {
        return
      }
      logicToDealBoxMids(result)
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
      keys.forEach(key => {
        allMarket.push(...this.allMarket[key])
      })
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
      console.log(this.allMarket)
      this.$store.dispatch('setPddexMarketLists', allMarket)
    },

    // 暂时不用
    // 获取BOX做市列表
    async handleBoxLists() {
      const params = {
        code: this.baseConfig.box,
        scope: this.baseConfig.box,
        table: 'pairs',
        json: true,
        limit: 2000
      }
      const {status, result} = await this.$api.get_table_rows(params);
      if (!status) {
        return
      }
      // console.log(result)
      const lists = result.rows;
      this.boxMarketList = lists;
      const boxLists = logicToDealBoxMarket(lists)
      // console.log(boxLists)
      // console.log(boxLists.length)
      this.boxLists = boxLists;
      this.handleDealBoxAndDfs()
    },
    handleDealBoxAndDfs() {
      // console.log(JSON.parse(JSON.stringify(this.dfsLists)))
      // console.log(JSON.parse(JSON.stringify(this.boxLists)))
      if (!this.dfsLists.length || !this.boxLists.length) {
        return
      }
      this.boxLists.forEach(v => {
        const index = this.dfsLists.findIndex(vv => {
          return vv.contract0 === v.contract0 && vv.contract1 === v.contract1
        })
        const reserve0 = parseFloat(v.reserve0) // + parseFloat(this.dfsLists[index].reserve0)
        const reserve1 = parseFloat(v.reserve1) // + parseFloat(this.dfsLists[index].reserve1)
        this.$set(this.dfsLists[index], 'reserve0', `${reserve0} ${v.symbol0}`)
        this.$set(this.dfsLists[index], 'reserve1', `${reserve1} ${v.symbol1}`)
        this.$set(this.dfsLists[index], 'boxMid', v.boxMid)
        // console.log(this.dfsLists[index])
      })
      const newListSort = this.dfsLists.sort((a, b) => {
        let aEos = 0;
        if (a.sym0Data.contract === 'eosio.token') {
          aEos = parseInt(a.reserve0)
        } else if(a.sym1Data.contract === 'eosio.token') {
          aEos = parseInt(a.reserve1)
        }
        let bEos = 0;
        if (b.sym0Data.contract === 'eosio.token') {
          bEos = parseInt(b.reserve0)
        } else if(a.sym1Data.contract === 'eosio.token') {
          bEos = parseInt(b.reserve1)
        }
        return bEos - aEos;
      })

      // console.log(newListSort)
      this.$store.dispatch('setPddexMarketLists', newListSort)
      this.handleDealSwapAndPddex();
    },
    // 整合swap列表 和 pddex列表
    handleDealSwapAndPddex() {
      if (!this.pddexList.length || !this.marketLists.length) {
        return
      }
      const newMList = JSON.parse(JSON.stringify(this.marketLists))
      this.pddexList.forEach(v => {
        const marketIndex = newMList.findIndex(vv => {
          return vv.contract0 === v.contract0 && vv.contract1 === v.contract1
        })
        if (marketIndex === -1) {
          console.log(v)
          return
        }
        this.$set(newMList[marketIndex], 'pid', v.pid)
        this.$set(newMList[marketIndex], 'unikey', v.unikey)
      })
      this.$store.dispatch('setPddexMarketLists', newMList)
    },
  }
}
</script>

<style lang="scss" scoped>

</style>
