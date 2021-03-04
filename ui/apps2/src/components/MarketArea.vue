<template>
  <div class="newMarkets">
    <div class="title">选择市场</div>
    <div class="area">
      <van-tabs color="#29D4B0"
        v-if="type === 'other'"
        v-model="area"
        title-active-color="#29D4B0">
        <van-tab v-for="(v, index) in areaLists" :title="v.tab" :key="index"></van-tab>
      </van-tabs>
      <div class="search flexa">
        <img class="searchImg" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/search.png" alt="">
        <van-field v-model="search" placeholder="搜索市场名称.."/>
      </div>
      <div class="lists" v-if="type === 'other'">
        <div class="list flexb" v-for="(v, i) in searchArr" :key="`list${i}`"
          @click="handleSelectThis(v)">
          <div class="flexa">
            <img class="coinImg" :src="v.sym1Data.imgUrl" :onerror="errorCoinImg">
            <div>
              <span>{{ v.symbol1 }}</span>
              <span class="small">/{{ v.symbol0 }}</span>
            </div>
          </div>
          <div class="price din">{{ v.price || '0.000000' }}</div>
        </div>
        <div v-if="!search" class="searchMore flexc">更多代币请搜索查询</div>
      </div>
      <div class="lists" v-else>
        <div class="list flexb" v-for="(v, i) in searchArr" :key="`list${i}`"
          @click="handleSelectThis(v)">
          <div class="flexa">
            <img class="coinImg" :src="v.imgUrl" :onerror="errorCoinImg">
            <div>
              <span>{{ v.symbol }}</span>
            </div>
          </div>
          <div class="price din"></div>
        </div>
        <div v-if="!search" class="searchMore flexc">更多代币请搜索查询</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import {dealSymArr} from '@/utils/public';

export default {
  props: {
    marketLists: {
      type: Array,
      default: function mls() {
        return []
      }
    },
    thisMarket0: {
      type: Object,
      default: function market() {
        return {}
      }
    },
    thisMarket1: {
      type: Object,
      default: function market() {
        return {}
      }
    },
    type: {
      type: String,
      default: 'other'
    }
  },
  data() {
    return {
      errorCoinImg: 'this.src="https://ndi.340wan.com/eos/eosio.token-eos.png"',
      search: '',
      area: 1,
      areaLists: [{
        tab: '自选',
        contract: '',
      }, {
        tab: 'USDT',
        contract: 'tethertether',
      }, {
        tab: 'EOS',
        contract: 'eosio.token',
      }, {
        tab: 'USDC',
        contract: 'usdxusdxusdx',
      }, {
        tab: 'DFS',
        contract: 'minedfstoken',
      }, {
        tab: 'TAG',
        contract: 'tagtokenmain',
      }, {
        tab: '其他',
        contract: '',
      }],
      searchArr: [],
    }
  },
  computed: {
    ...mapState({
      filterMkLists: state => state.sys.filterMkLists,
      accFollow: state => state.app.accFollow,
    }),
  },
  // mounted() {
  //   console.log(this.type)
  // },
  watch: {
    area() {
      this.handleSearch();
    },
    marketLists: {
      handler: function mlt(newVal, oldVal) {
        if (!newVal.length || (oldVal && oldVal.length === newVal.length)) {
          return;
        }
        // 筛选出所有币种
        this.coinList = [];
        this.filterCoinList = [];
        if (this.type === 'kline') {
          this.searchArr = this.marketLists;
        } else if (this.type === 'pools') {
          const arr = dealSymArr(newVal)
          arr.shift()
          this.coinList = arr;
          this.filterCoinList = arr;
        } else if (this.type !== 'other') {
          const arr = dealSymArr(newVal)
          this.coinList = arr;
          const arr2 = dealSymArr(this.filterMkLists)
          this.filterCoinList = arr2;
        } else {
          this.searchArr = this.filterMkLists;
        }
        this.handleSearch();
      },
      deep: true,
      immediate: true
    },
    search() {
      this.handleSearch();
    }
  },
  methods: {
    handleToCreate() {
      this.$router.push({name: 'createMarket'})
    },
    handleSearch() {
      const search = this.search.toUpperCase();
      if (this.type === 'kline') {
        const searchArr = this.marketLists.filter(v => v.symbol0.indexOf(search) !== -1 || v.symbol1.indexOf(search) !== -1)
        this.searchArr = searchArr;
        return
      }
      if (this.type === 'other') {
        let searchArr = [];
        if (!search) {
          searchArr = this.filterMkLists;
        } else {
          searchArr = this.marketLists.filter(v => v.symbol0.indexOf(search) !== -1 || v.symbol1.indexOf(search) !== -1);
        }
        this.searchArr = this.handleDealFGollow(searchArr);
        return
      }
      if (!search) {
        this.searchArr = this.filterCoinList;
        // console.log(this.searchArr)
        return
      }
      const searchArr = this.coinList.filter(v => v.symbol.indexOf(search) !== -1)
      this.searchArr = searchArr;
    },
    handleDealFGollow(arr) {
      if (!this.area) {
        return this.handleDealSelf(arr)
      }
      if (this.area === 6) {
        return this.handleDealOther(arr)
      }
      const area = this.areaLists[this.area];
      const follow = [];
      const other = [];
      arr.forEach(v => {
        const has = (v.contract0 === area.contract && v.symbol0 === area.tab)
                 || (v.contract1 === area.contract && v.symbol1 === area.tab)
        if (!has) {
          return
        }
        const isFollow = this.accFollow.find(vv => vv.mid === v.mid);
        let newList = JSON.parse(JSON.stringify(v));
        if (v.contract1 === area.contract && v.symbol1 === area.tab) {
          newList = {
            contract0: v.contract1,
            contract1: v.contract0,
            decimal0: v.decimal1,
            decimal1: v.decimal0,
            eos_value: v.eos_value,
            last_update: v.last_update,
            liquidity_token: v.liquidity_token,
            mid: v.mid,
            price: v.price,
            price0_cumulative_last: v.price1_cumulative_last,
            price0_last: v.price1_last,
            price1_cumulative_last: v.price0_cumulative_last,
            price1_last: v.price0_last,
            reserve0: v.reserve1,
            reserve1: v.reserve0,
            sym0: v.sym1,
            sym0Data: v.sym1Data,
            sym1: v.sym0,
            sym1Data: v.sym0Data,
            symbol0: v.symbol1,
            symbol1: v.symbol0,
            usdt_value: v.usdt_value
          }
        }
        const price = parseFloat(newList.reserve0) / parseFloat(newList.reserve1)
        newList.price = (price || 0).toFixed(6)
        if (isFollow) {
          follow.push(newList)
          return
        }
        other.push(newList)
      });
      // console.log(follow, other)
      return [...follow, ...other]
    },
    handleDealSelf(searchArr) {
      let arr = []
      this.accFollow.forEach(v => {
        const market = searchArr.find(vv => vv.mid === v.mid)
        if (!market) {
          return
        }
        arr.push(market)
      })
      let dealArr = [];
      arr.forEach(v => {
        const has = this.areaLists.find(vv => {
          return (vv.contract === v.contract0 && vv.tab === v.symbol0)
              || (vv.contract === v.contract1 && vv.tab === v.symbol1)
        })
        if (!has) {
          dealArr.push(v)
          return
        }
        let newList = JSON.parse(JSON.stringify(v))
        if (has.contract === v.contract1 && has.tab === v.symbol1) {
          newList = {
            contract0: v.contract1,
            contract1: v.contract0,
            decimal0: v.decimal1,
            decimal1: v.decimal0,
            eos_value: v.eos_value,
            last_update: v.last_update,
            liquidity_token: v.liquidity_token,
            mid: v.mid,
            price: v.price,
            price0_cumulative_last: v.price1_cumulative_last,
            price0_last: v.price1_last,
            price1_cumulative_last: v.price0_cumulative_last,
            price1_last: v.price0_last,
            reserve0: v.reserve1,
            reserve1: v.reserve0,
            sym0: v.sym1,
            sym0Data: v.sym1Data,
            sym1: v.sym0,
            sym1Data: v.sym0Data,
            symbol0: v.symbol1,
            symbol1: v.symbol0,
            usdt_value: v.usdt_value
          }
        }
        const price = parseFloat(newList.reserve0) / parseFloat(newList.reserve1)
        newList.price = (price || 0).toFixed(6)
        
        dealArr.push(newList)
      })
      return dealArr
    },
    handleDealOther(searchArr) {
      const arr = [];
      searchArr.forEach(v => {
        const reg = this.handleRegOther(v)
        if (reg) {
          return
        }
        arr.push(v)
      })
      return arr
    },
    // 验证是否存含有分区币种
    handleRegOther(item) {
      try {
        this.areaLists.forEach(v => {
          if (!v.contract) {
            return
          }
          const has = (v.contract === item.contract0 && v.tab === item.symbol0)
                 || (v.contract === item.contract1 && v.tab === item.symbol1)
          if (has) {
            throw true 
          }
        })
        return false;
      } catch (error) {
        return true
      }
    },
    handleShowBank(item) {
      const type = this.type;
      if (type === 'bankEnd') {
        return !(item.contract === 'eosio.token' && item.symbol === 'EOS')
      }
      return true
    },
    handleShow(item) {
      const type = this.type;
      if (type === 'start') {
        return !(item.contract === this.thisMarket1.contract && item.symbol === this.thisMarket1.symbol)
      }
      return !(item.contract === this.thisMarket0.contract && item.symbol === this.thisMarket0.symbol)
    },
    handleClose() {
      this.$emit('listenClose', false)
    },
    // 选择当前市场
    handleSelectThis(item) {
      this.$emit('listenMarketChange', item, this.type)
    },
  },
}
</script>

<style lang="scss" scoped>
.newMarkets{
  text-align: left;
  font-size: 30px;
  color: #333;
  .title{
    padding: 20px 28px 8px;
    font-size: 32px;
  }
  .area{
    height: 70px;
    /deep/ .van-tab{
      font-size: 26px;
    }
    /deep/ .van-tabs__wrap{
      height: 70px;
      .van-tab{
        padding: 0 28px;
      }
    }
    /deep/ .van-tabs__nav{
      padding: 0 0;
    }
    /deep/ .van-tabs__line{
      height: 2px;
      width: 52px;
      bottom: 0px;
    }
  }
  .search{
    // margin: 0 28px;
    background: #FAFAFA;
    padding: 0 28px;
    .searchImg{
      width: 30px;
    }
    /deep/ .van-cell{
      padding-left: 16px;
      background-color: transparent;
    }
  }
  .lists{
    .list{
      height: 80px;
      padding: 0 28px;
      border-bottom: 1px solid rgba(220,220,220,.3);
      .coinImg{
        width: 44px;
        height: 44px;
        border-radius: 50%;
        margin-right: 12px;
      }
      .small{
        font-size: 24px;
        color: #999;
      }
    }
    .searchMore{
      height: 115px;
      text-align: center;
      color: #999;
    }
  }
}
</style>
