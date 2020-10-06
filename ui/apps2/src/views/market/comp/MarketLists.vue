<template>
  <div class="marketLists">
    <div class="title">
      <span class="act">{{ $t('market.myMarkets') }}</span>
    </div>
    <div>
      <div class="noData" v-loading="!getToken" v-if="!dealLists.length">{{ $t('public.noData') }}</div>
      <div v-for="(item, index) in dealLists" :key="index">
        <MarketData :thisMarket="item" :token="item.token" :capital="item.capital" :isList="true"
          :startTime="item.startTime"
          @listenToMarket="handleToMarket"/>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapState } from 'vuex';
import { EosModel } from '@/utils/eos';
import { toFixed, getClass, toLocalTime } from '@/utils/public';
import { sellToken } from '@/utils/logic';
import MarketData from './MarketData';
export default {
  components: {
    MarketData,
  },
  data() {
    return {
      getToken: false,
      getCapital: false,
      lists: [],
    }
  },
  props: {
    marketLists: {
      type: Array,
      default: function lists() {
        return []
      }
    }
  },
  watch: {
    marketLists: {
      handler: function mlt() {
        if (!this.getToken) {
          this.handleGetToken()
          return
        }
        this.handleDealLists();
      }
    }
  },
  computed: {
    ...mapState({
      minScreen: state => state.app.minScreen,
      scatter: state => state.app.scatter,
      slipPoint: state => state.app.slipPoint,
      baseConfig: state => state.sys.baseConfig,
    }),
    dealLists() {
      let dealLists = [];
      let gold = [], silver = [], bronze = [];
      this.lists.forEach(v => {
        const curr = this.handleGetNowMarket(v)
        const newV = v;
        newV.nowMarket = curr;
        const myclass = getClass(v.mid)
        if (myclass === 'gold') {
          gold.push(newV)
          return
        }
        if (myclass === 'silver') {
          silver.push(newV)
          return
        }
        if (myclass === 'bronze') {
          bronze.push(newV)
          return
        }
        dealLists.push(newV)
      })
      gold = gold.sort((a, b) => {
        return parseFloat(b.reserve0) - parseFloat(a.reserve0)
      })
      silver = silver.sort((a, b) => {
        return parseFloat(b.reserve0) - parseFloat(a.reserve0)
      })
      bronze = bronze.sort((a, b) => {
        return parseFloat(b.reserve0) - parseFloat(a.reserve0)
      })
      dealLists = dealLists.sort((a, b) => {
        return parseFloat(b.reserve0) - parseFloat(a.reserve0)
      })
      return [...gold, ...silver, ...bronze, ...dealLists]
    }
  },
  methods: {
    handleToMarket(mid) {
      this.$emit('listenToMarket', mid)
    },
    handleGetToken() {
      this.lists = []
      this.marketLists.forEach((v, index) => {
        const next = parseInt(index / 10)
        setTimeout(() => {
          this.handleGetTable(v)
        }, next * 1000);
      })
    },
    handleGetTable(v) {
      const params = {
        code: this.baseConfig.toAccountSwap,
        scope: v.mid,
        table: 'liquidity',
        lower_bound: ` ${this.scatter.identity.accounts[0].name}`,
        upper_bound: ` ${this.scatter.identity.accounts[0].name}`,
        json: true
      }
      EosModel.getTableRows(params, (res) => {
        this.getToken = true;
        const list = res.rows || [];
        let token = '0'
        !list[0] ? token = '0' : token = `${list[0].token}`;
        if (Number(token)) {
          // this.handleGetCapital(v, token)
          this.handleGetMarketDataByChain(v, token)
        }
      })
    },
    handleGetCapital(v, token) {
      const params = {
        user: this.scatter.identity.accounts[0].name,
        // user: 'dfsdevloper',
        mid: v.mid,
      }
      axios.get('https://dfsinfoapi.sgxiang.com/dapi/changelogdata', {params}).then((result) => {
        const res = result.data;
        const newArr = [toFixed(res[v.symbol0], v.decimal0), toFixed(res[v.symbol1], v.decimal1)];
        this.lists.push(Object.assign(v, {
          token,
          capital: newArr,
          startTime: res.tag_log_utc_block_time
        }))
      })
    },
    handleGetMarketDataByChain(v, token) {
      const params = {
        "code": "defislogsone",
        "json": true,
        "scope": v.mid,
        "table": "records",
        "lower_bound": ` ${this.scatter.identity.accounts[0].name}`,
        "upper_bound": ` ${this.scatter.identity.accounts[0].name}`,
      }
      EosModel.getTableRows(params, (res) => {
        const list = res.rows || [];
        this.sTime = '0'
        this.marketData = [];
        if (!list.length) {
          return
        }
        const symbol0 = list[0].bal0.split(' ');
        const symbol1 = list[0].bal1.split(' ');
        const newArr = [
          symbol0[0],
          symbol1[0]
        ]
        if (symbol0[1] === 'EOS') {
          newArr[0] = symbol0[0];
          newArr[1] = symbol1[0];
        } else if (symbol1[1] === 'EOS') {
          newArr[0] = symbol1[0];
          newArr[1] = symbol0[0];
        }
        this.lists.push(Object.assign(v, {
          token,
          capital: newArr,
          startTime: `${Date.parse(toLocalTime(`${list[0].start}.000+0000`)) / 1000 - 8 * 3600}`
        }))
      })
    },
    handleGetNowMarket(item) {
      const inData = {
        poolSym0: item.reserve0.split(' ')[0],
        poolSym1: item.reserve1.split(' ')[0],
        poolToken: item.liquidity_token,
        sellToken: item.token
      }
      const nowMarket = sellToken(inData);
      nowMarket.getNum1 = toFixed(nowMarket.getNum1, 4)
      nowMarket.getNum2 = toFixed(nowMarket.getNum2, 4)
      return nowMarket;
    },
    handleDealLists() {
      this.lists.forEach(v => {
        const newMkt = this.marketLists.find(vv => vv.mid === v.mid)
        this.$set(v, 'reserve0', newMkt.reserve0)
        this.$set(v, 'reserve1', newMkt.reserve1)
        this.$set(v, 'liquidity_token', newMkt.liquidity_token)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.marketLists{
  margin: 0 40px 40px;
}
.title{
  font-size: 32px;
  text-align: left;
  margin: 0 0 40px;
  &>span{
    margin-right: 60px;;
  }
  .act{
    color: $color-black;
    position: relative;
    &::before{
      content: '';
      position: absolute;
      width:60px;
      height:8px;
      background:rgba(2,198,152,1);
      border-radius:4px;
      bottom: -20px;
      left: 50%;
      transform: translateX(-45%);
    }
  }
}
.noData{
  text-align: center;
  margin: 100px 0;
  color: #A6A6A6;
  font-size: 24px;
}
</style>
