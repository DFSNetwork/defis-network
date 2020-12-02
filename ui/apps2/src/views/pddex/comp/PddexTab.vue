<template>
  <div class="pddexTab flexb">
    <span class="flexc act">首页</span>
    <span class="flexc">交易</span>
    <span class="flexc">订单</span>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { logicToDealMarket, logicToDealBoxMarket, logicToDealBoxMids } from './appLogic'

export default {
  name: 'pddexTab',
  data() {
    return {
      boxMarketList: [],
      dfsLists: [],
    }
  },
  mounted() {
    this.handleGetBoxMids()
    this.handleGetPddexMarketList();
    this.handleBoxLists();
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
        this.handleDealBoxAndDfs()
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
    // 获取支持box的交易对id
    async handleGetBoxMids() {
      const {status, result} = await this.$api.boxMidsAndOrder();
      if (!status) {
        return
      }
      console.log(result)
      logicToDealBoxMids(result)
    },
    // 获取ppdex支持交易对
    async handleGetPddexMarketList() {
      console.log(this.baseConfig)
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
      this.pddexList = lists;
      // console.log(lists)

      this.handleDealSwapAndPddex()
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
      console.log(newMList)
    },
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
      const lists = result.rows;
      this.boxMarketList = lists;
      const boxLists = logicToDealBoxMarket(lists)
      this.boxLists = boxLists;
      this.handleDealBoxAndDfs()
    },
    handleDealBoxAndDfs() {
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

    // 获取做市列表
    async handleGetAllMarket() {
      const params = {
        code: this.baseConfig.swap,
        scope: this.baseConfig.swap,
        table: 'markets',
        json: true,
        limit: 1000
      }
      const {status, result} = await this.$api.get_table_rows(params);
      if (!status) {
        return
      }
      const lists = result.rows;
      const newListSort = logicToDealMarket(lists, this.topLists, this.klineMids)
      this.dfsLists = newListSort;

      this.handleDealBoxAndDfs()
    },
  }
}
</script>

<style lang="scss" scoped>
.pddexTab{
  font-size: 32px;
  color: #999;
  margin: 0 170px 15px;
  font-weight: 500;
  height: 90px;
  position: relative;
  &>span{
    height: 100%;
  }
  .act{
    color: #333;
    &::after{
      content: '';
      position: absolute;
      bottom: 0px;
      height: 6px;
      width: 44px;
      border-radius: 10px;
      background: #29D4B0;
    }
  }
}
</style>
