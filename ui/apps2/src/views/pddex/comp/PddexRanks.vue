<template>
  <div class="">
    <div class="pddexTab flexb">
      <span class="flexc" :class="{'act': active === 0}" @click="active = 0">自选</span>
      <span class="flexc" :class="{'act': active === 1}" @click="active = 1">全部</span>
      <!-- <span class="flexc" :class="{'act': active === 2}" @click="active = 2">深度榜</span> -->
    </div>
    <div class="rankTabs">
      <van-tabs v-model="coinName"
        animated
        class="subTab"
        title-inactive-color="#999"
        title-active-color="#29D4B0"
        color="#29D4B0">
        <van-tab v-for="(a, i) in areaLists" :key="`area${i}`" :name="a" :title="a"></van-tab>
      </van-tabs>
      <div class="subTitle flexb">
        <div class="flexa">
          <span class="flexa" @click="handleSortVol">
            <span>24H额</span>
            <img class="sortCoin" v-if="sortVol === 0" src="https://cdn.jsdelivr.net/gh/defis-net/material2/pddex/sort_default.png" alt="">
            <img class="sortCoin" v-else-if="sortVol === 1" src="https://cdn.jsdelivr.net/gh/defis-net/material2/pddex/sort_down.png" alt="">
            <img class="sortCoin" v-else src="https://cdn.jsdelivr.net/gh/defis-net/material2/pddex/sort_up.png" alt="">
          </span>
          <span class="flexa" @click="handleSortPools">
            <span>底池</span>
            <img class="sortCoin" v-if="sortPools === 0" src="https://cdn.jsdelivr.net/gh/defis-net/material2/pddex/sort_default.png" alt="">
            <img class="sortCoin" v-else-if="sortPools === 1" src="https://cdn.jsdelivr.net/gh/defis-net/material2/pddex/sort_down.png" alt="">
            <img class="sortCoin" v-else src="https://cdn.jsdelivr.net/gh/defis-net/material2/pddex/sort_up.png" alt="">
          </span>
          <span class="flexa" @click="handleSortApy">
            <span>APY</span>
            <img class="sortCoin" v-if="sortApy === 0" src="https://cdn.jsdelivr.net/gh/defis-net/material2/pddex/sort_default.png" alt="">
            <img class="sortCoin" v-else-if="sortApy === 1" src="https://cdn.jsdelivr.net/gh/defis-net/material2/pddex/sort_down.png" alt="">
            <img class="sortCoin" v-else src="https://cdn.jsdelivr.net/gh/defis-net/material2/pddex/sort_up.png" alt="">
          </span>
        </div>
        <div class="rateDiv">
          <span class="flexa" @click="handleSortPrice">
            <span>最新价</span>
            <img class="sortCoin noMargin" v-if="sortPrice === 0" src="https://cdn.jsdelivr.net/gh/defis-net/material2/pddex/sort_default.png" alt="">
            <img class="sortCoin noMargin" v-else-if="sortPrice === 1" src="https://cdn.jsdelivr.net/gh/defis-net/material2/pddex/sort_down.png" alt="">
            <img class="sortCoin noMargin" v-else src="https://cdn.jsdelivr.net/gh/defis-net/material2/pddex/sort_up.png" alt="">
          </span>
        </div>
        <div class="rateDiv">
          <span class="flexa" @click="handleSortRate">
            <span>24H涨跌幅</span>
            <img class="sortCoin noMargin" v-if="sortRate === 0" src="https://cdn.jsdelivr.net/gh/defis-net/material2/pddex/sort_default.png" alt="">
            <img class="sortCoin noMargin" v-else-if="sortRate === 1" src="https://cdn.jsdelivr.net/gh/defis-net/material2/pddex/sort_down.png" alt="">
            <img class="sortCoin noMargin" v-else src="https://cdn.jsdelivr.net/gh/defis-net/material2/pddex/sort_up.png" alt="">
          </span>
        </div>
      </div>
      <div class="rankList" v-if="active === 0">
        <div class="noDate tip" v-if="!followList.length">
          <img class="noDataPng" src="https://cdn.jsdelivr.net/gh/defis-net/material/noData/noStar.png" alt="">
          <div>快去添加你感兴趣的交易对吧</div>
          <div class="toFollow flexc" @click="active = 1">添加</div>
        </div>
        <div class="rankItem flexb dinReg" v-for="(v, index) in followList" :key="`${active}-${index}`" @click="handleToTrade(v)">
          <div class="name flexa">
            <img class="coinUrl" :src="v.sym1Data.imgUrl" :onerror="errorCoinImg">
            <div>
              <div>{{ v.symbol1 }}/{{ v.symbol0 }}</div>
              <div class="tip smallTip">
                <span v-if="sortPools">底池 {{ v.volume24H }}</span>
                <span v-else-if="sortApy">APY {{ v.countApy }}%</span>
                <span v-else>24H额 {{ v.volume24H }}</span>
              </div>
            </div>
          </div>
          <div class="priceDiv">
            <div>{{ v.price || '-' }}</div>
            <div class="tip smallTip">
              <span>{{ language === 'en' ? '$' : '¥' }}</span>
              <span>{{ v.aboutPrice }}</span>
            </div>
          </div>
          <div class="rateDiv">
            <span class="rate flexc"
              :class="{'green': parseFloat(v.price_change_rate) > 0,
                       'red': parseFloat(v.price_change_rate) < 0}">
              {{ v.priceRate || '-' }}</span>
          </div>
        </div>
      </div>
      <div class="rankList" v-else>
        <div class="rankItem flexb dinReg" v-for="(v, index) in cdAreaLists" :key="`${active}-${index}`" @click="handleToTrade(v)">
          <div class="name flexa">
            <img class="coinUrl" :src="v.sym1Data.imgUrl" :onerror="errorCoinImg">
            <div>
              <div>{{ v.symbol1 }}/{{ v.symbol0 }}</div>
              <div class="tip smallTip">
                <span v-if="sortPools">底池 {{ v.volume24H }}</span>
                <span v-else-if="sortApy">APY {{ v.countApy }}%</span>
                <span v-else>24H额 {{ v.volume24H }}</span>
              </div>
            </div>
          </div>
          <div class="priceDiv">
            <div>{{ v.price || '-' }}</div>
            <div class="tip smallTip">
              <span>{{ language === 'en' ? '$' : '¥' }}</span>
              <span>{{ v.aboutPrice }}</span>
            </div>
          </div>
          <div class="rateDiv">
            <span class="rate flexc"
              :class="{'green': parseFloat(v.price_change_rate) > 0,
                       'red': parseFloat(v.price_change_rate) < 0}">
              {{ v.priceRate || '-' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { getCoin, dealPrice} from '@/utils/public';

import { perDayRewardV3 } from '@/utils/logic';
import { getDmdMinerHourRoi, getTagLpApy } from '@/utils/public';
import { timeApy } from '@/utils/minerLogic';

export default {
  name: 'pddexTab',
  data() {
    return {
      coinName: 'EOS',
      active: 1,
      followList: [], // 关注展示列表
      tradeRankList: [], // 成交量排行
      tradeList: [],
      rankList: [],
      likeArr: [], // 存放接口返回的关注数据
      swapTradeLists: {},
      errorCoinImg: 'this.src="https://ndi.340wan.com/eos/eosio.token-eos.png"',
      allMarket: {},
      areaLists: ['EOS', 'TAG', 'USDT'],
      cdAreaLists: [],

      // 排序
      sortVol: 0,
      sortPools: 0,
      sortApy: 0,
      sortRate: 0,
      sortPrice: 0,
    }
  },
  mounted() {
    // this.handleGetFees()
    this.handleGetMarkets()
  },
  computed: {
    ...mapState({
      language: state => state.app.language,
      account: state => state.app.account,
      marketLists: state => state.config.marketLists,
      hotLists: state => state.config.hotLists, // 生产环境
      dfsPrice: state => state.sys.dfsPrice,
      tagLpMids: state => state.config.tagLpMids,
    })
  },
  watch: {
    // marketLists: {
    //   handler: function ml(newVal) {
    //     if (!newVal.length) {
    //       return
    //     }
    //     // this.handleDealTradeRankLogic()
    //     // this.handleRankList()
    //     // this.handleDealLike()
    //   },
    //   immediate: true,
    //   deep: true,
    // },
    // active() {
    //   // this.handleRankList()
    // },
    allMarket: {
      handler: function am() {
        this.handleDealLike()
      },
      deep: true,
      immediate: true
    },
    coinName: {
      handler: function cn() {
        this.sortVol = 0;
        this.sortPools = 0;
        this.sortApy = 0;
        this.sortRate = 0;
        this.sortPrice = 0;
        this.handleDealArea()
      },
      deep: true,
      immediate: true,
    },
    account: {
      handler: function at(newVal) {
        if (!newVal.name) {
          return
        }
        this.handleGetLikes();
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    // 处理排序
    handleDealSort() {
      const area = this.coinName;
      let arr = JSON.parse(JSON.stringify(this.allMarket[area] || []));
      if (this.active === 0) {
        this.handleDealLike()
        arr = JSON.parse(JSON.stringify(this.followList || []));
      }
      let tArr = arr;
      if (!arr.length) {
        return
      }
      if (this.sortRate) {
        tArr = arr.sort((a, b) => {
          return this.sortRate === 2 ? parseFloat(a.price_change_rate) - parseFloat(b.price_change_rate)
                                     : parseFloat(b.price_change_rate) - parseFloat(a.price_change_rate)
        })
      } else if (this.sortApy) {
        tArr = arr.sort((a, b) => {
          return this.sortApy === 2 ? parseFloat(a.countApy) - parseFloat(b.countApy)
                                     : parseFloat(b.countApy) - parseFloat(a.countApy)
        })
      } else if (this.sortPools) {
        tArr = arr.sort((a, b) => {
          return this.sortPools === 2 ? parseFloat(a.usdt_value) - parseFloat(b.usdt_value)
                                     : parseFloat(b.usdt_value) - parseFloat(a.usdt_value)
        })
      } else if (this.sortVol) {
        tArr = arr.sort((a, b) => {
          return this.sortVol === 2 ? parseFloat(a.volume24H) - parseFloat(b.volume24H)
                                     : parseFloat(b.volume24H) - parseFloat(a.volume24H)
        })
      } else if (this.sortPrice) {
        tArr = arr.sort((a, b) => {
          return this.sortPrice === 2 ? parseFloat(a.price) - parseFloat(b.price)
                                     : parseFloat(b.price) - parseFloat(a.price)
        })
      } 
      this.active === 0 ? this.followList = tArr : this.cdAreaLists = tArr;
    },
    handleSortVol() {
      let t = (this.sortVol + 1) % 3;
      this.sortVol = t;
      this.sortPools = 0;
      this.sortApy = 0;
      this.sortRate = 0;
      this.sortPrice = 0;
      this.handleDealSort()
    },
    handleSortPools() {
      let t = (this.sortPools + 1) % 3;
      this.sortPools = t;
      this.sortVol = 0;
      this.sortApy = 0;
      this.sortRate = 0;
      this.sortPrice = 0;
      this.handleDealSort()
    },
    handleSortApy() {
      let t = (this.sortApy + 1) % 3;
      this.sortApy = t;
      this.sortPools = 0;
      this.sortVol = 0;
      this.sortRate = 0;
      this.sortPrice = 0;
      this.handleDealSort()
    },
    handleSortRate() {
      let t = (this.sortRate + 1) % 3;
      this.sortRate = t;
      this.sortPools = 0;
      this.sortApy = 0;
      this.sortVol = 0;
      this.sortPrice = 0;
      this.handleDealSort()
    },
    handleSortPrice() {
      let t = (this.sortPrice + 1) % 3;
      console.log(t)
      this.sortPrice = t;
      this.sortPools = 0;
      this.sortVol = 0;
      this.sortApy = 0;
      this.sortRate = 0;
      this.handleDealSort()
    },

    // 处理币种APY
    handleDealApy(v) {
      // 手续费年化
      const fees = parseFloat(v.volume24H || 0) * 0.002;
      const sym0Liq = parseFloat(v.reserve0 || 0) * 2;
      const feesApr = fees / (sym0Liq - fees) * 365 * 100;
      // DFS 挖矿年化
      const rewardV3 = perDayRewardV3(v.mid)
      const aprV3 = rewardV3 * this.dfsPrice / 20000 * 365 * 100;
      // console.log(aprV3)
      // DMD 挖矿年化
      const dmdPool = this.marketLists.find(vv => vv.mid === 326)
      let dmdRoi = getDmdMinerHourRoi(v, 'year', dmdPool)
      const dmdApy = dmdRoi;
      // TIME 挖矿年化
      let tApy = 0
      const pool = this.marketLists.find(vv => vv.mid === 530) || {}
      let apy = timeApy(v, 'year', pool)
      if (Number(apy)) {
        tApy = apy;
      }
      // TAG 挖矿年化
      let tagLpApy = 0
      const has = this.tagLpMids.find(vv => vv === v.mid)
      if (has) {
        tagLpApy = getTagLpApy(v.mid)
      }
      // console.log( parseFloat(feesApr), parseFloat(aprV3), parseFloat(dmdApy)
      //               , parseFloat(tApy), parseFloat(tagLpApy))

      const countApy = parseFloat(feesApr) + parseFloat(aprV3) + parseFloat(dmdApy)
                     + parseFloat(tApy) + parseFloat(tagLpApy)
      return countApy
    },

    // 获取关注列表
    async handleGetLikes() {
      if (!this.account.name) {
        return
      }
      const params = {
        "code":"dfsusersinfo",
        "scope": `${this.account.name}`,
        "table":"likes",
        "json":true,
        "limit": 1000,
      }
      const {status, result} = await this.$api.get_table_rows(params);
      if (!status) {
        return
      }
      const rows = result.rows;
      if (!rows.length) {
        return
      }
      this.likeArr = rows;
      this.handleDealLike()
    },
    // 处理关注数据
    handleDealLike() {
      const keys = Object.keys(this.allMarket)
      if (!this.likeArr.length || !keys.length) {
        return
      }
      const dealArr = [];
      const allMarket = []
      keys.forEach(key => {
        allMarket.push(...this.allMarket[key])
      })
      
      this.likeArr.forEach(v => {
        const item = allMarket.find(vv => vv.mid === v.mid)
        if (!item) {
          return
        }
        dealArr.push(item)
      })
      this.followList = dealArr;
    },
    // 交易页面跳转
    handleToTrade(li) {
      let symbol = 'eosio.token-eos-minedfstoken-dfs';
      if (li) {
        symbol = `${li.contract0}-${li.symbol0}-${li.contract1}-${li.symbol1}`
      }
      this.$router.push({
        name: 'pddexTrade',
        params: {
          symbol
        }
      })
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
        const coin = key.split('_markets')[0].toUpperCase()
        const arr = this.handleDealArr(result[key] || [], coin)
        lists[coin] = arr;
      })
      // console.log(result)
      this.allMarket = lists;
      this.handleDealArea()
    },
    handleDealArea() {
      const coin = this.coinName;
      if (!this.allMarket[coin]) {
        return
      }
      this.cdAreaLists = this.allMarket[coin];
      // console.log(this.allMarket[coin])
    },
    handleExchange(coin, v) {
      if (coin === 'EOS' && v.contract0 === 'eosio.token' && v.sym0 === '4,EOS') {
        return true
      }
      if (coin === 'TAG' && v.contract0 === 'tagtokenmain' && v.sym0 === '8,TAG') {
        return true
      }
      if (coin === 'USDT' && v.contract0 === 'tethertether' && v.sym0 === '4,USDT') {
        return true
      }
      return false
    },
    handleDealArr(arr, coin) {
      const newArr = []
      const coinPrice = this.handleGetCoinPrice(coin);
      arr.forEach(list => {
        let v = list;
        if (!this.handleExchange(coin, v)) {
          const tLi = {
            contract0: v.contract1,
            contract1: v.contract0,
            last_update: v.last_update,
            liquidity_token: v.liquidity_token,
            mid: v.mid,
            price0_cumulative_last: v.price1_cumulative_last,
            price0_last: v.price1_last,
            price1_cumulative_last: v.price0_cumulative_last,
            price1_last: v.price0_last,
            reserve0: v.reserve1,
            reserve1: v.reserve0,
            sym0: v.sym1,
            sym1: v.sym0,
            exchangeSym: true,
            cur_price: v.cur_price,
            eos_value: v.eos_value,
            last_price: v.last_price,
            usdt_value: v.usdt_value,
            volume24H: v.volume24H,
            price_change_rate: v.price_change_rate,
            price_change_24h: v.price_change_24h,
          }
          v = tLi;
        }
        const sym0 = v.sym0.split(',');
        v.symbol0 = sym0[1]; // 币种
        v.decimal0 = sym0[0]; // 精度
        const sym1 = v.sym1.split(',');
        v.symbol1 = sym1[1]; // 币种
        v.decimal1 = sym1[0]; // 精度
        v.price = dealPrice((parseFloat(v.reserve0) / parseFloat(v.reserve1) || 0))
        v.aboutPrice = (coinPrice * v.price).toFixed(2)
        v.priceRate = parseFloat(v.price_change_rate) > 0 ? `+${v.price_change_rate}` : v.price_change_rate;
        v.sym0Data = {
          mid: v.mid,
          last_update: v.last_update,
          liquidity_token: v.liquidity_token,
          price_cumulative_last: v.price0_cumulative_last,
          price_last: v.price0_last,
          contract: v.contract0,
          decimal: v.decimal0,
          reserve: v.reserve0,
          sym: v.sym0,
          symbol: v.symbol0,
          imgUrl: getCoin(v.contract0, v.symbol0),
        }
        v.sym1Data = {
          mid: v.mid,
          last_update: v.last_update,
          liquidity_token: v.liquidity_token,
          price_cumulative_last: v.price1_cumulative_last,
          price_last: v.price1_last,
          contract: v.contract1,
          decimal: v.decimal1,
          reserve: v.reserve1,
          sym: v.sym1,
          symbol: v.symbol1,
          imgUrl: getCoin(v.contract1, v.symbol1),
        }
        const countApy = this.handleDealApy(v)
        v.countApy = parseFloat(countApy || 0).toFixed(2);
        newArr.push(v)
      })
      return newArr
    },
    // 获取分区币种的价格
    handleGetCoinPrice(coin) {
      const lang = this.language;
      let mid = 17;
      if (coin === 'EOS') {
        mid = 17;
      } else if (coin === 'TAG') {
        mid = 665;
      } else if (coin === 'USDT') {
        mid = 0;
      }
      if (mid === 0) {
        return lang === 'en' ? 1 : 6.5;
      }
      if (!this.marketLists.length) {
        return 0
      }
      const market = this.marketLists.find(v => v.mid === mid)
      let price = coin === market.symbol1 ? 
                  parseFloat(market.reserve0) / parseFloat(market.reserve1) :
                  parseFloat(market.reserve1) / parseFloat(market.reserve0);
      return lang === 'en' ? price : 6.5 * price;
    },

    // 暂时吧使用
    // 排行数据
    handleRankList() {
      this.handleDealTradeRank()
      // 深度排行
      const tArr = JSON.parse(JSON.stringify(this.marketLists))
      const newArr = this.handleHotMarket(tArr)

      this.rankList = newArr.slice(0, 20);
    },
    async handleGetFees() {
      const {status, result} = await this.$api.get_swap_summary()
      if (!status) {
        return
      }
      this.swapTradeLists = result
      this.handleDealTradeRankLogic()
    },
    handleDealTradeRankLogic() {
      console.log(this.marketLists.length)
      if (!this.marketLists.length) {
        return
      }
      const tradeList = [];
      const inLists = this.swapTradeLists.trading_volume_in || []
      inLists.forEach(v => {
        const market = this.marketLists.find(vv => vv.mid === v.mid)
        // 不存在
        if (!market || v.sym !== 'EOS') {
          return
        }
        // 非EOS交易对
        if (market.contract0 !== 'eosio.token' && market.contract1 !== 'eosio.token') {
          return
        }
        const li = {
          mid: v.mid,
          count: Number(v.total || 0).toFixed(4),
        }
        tradeList.push(li)
      })
      const outLists = this.swapTradeLists.trading_volume_out || []
      outLists.forEach(v => {
        const market = this.marketLists.find(vv => vv.mid === v.mid)
        // 不存在
        if (!market || v.sym !== 'EOS') {
          return
        }
        // 非EOS交易对
        if (market.contract0 !== 'eosio.token' && market.contract1 !== 'eosio.token') {
          return
        }
        const index = tradeList.findIndex(vv => vv.mid === v.mid)
        if (index === -1) {
          tradeList.push({
            mid: v.mid,
            count: Number(v.total || 0).toFixed(4),
          })
          return
        }
        let count = Number(tradeList[index].count) + v.total
        tradeList[index].count = Number(count).toFixed(4)
      })
      tradeList.sort((a, b) => {
        return Number(b.count) - Number(a.count)
      })
      this.tradeList = tradeList.slice(0, 20);
      console.log(this.tradeList)
      this.handleDealTradeRank()
    },
    handleDealTradeRank() {
      if (!this.tradeList.length || !this.marketLists.length) {
        return
      }
      const tradeRankList = [];
      this.tradeList.forEach(v => {
        const market = this.marketLists.find(vv => vv.mid == v.mid) || {};
        market.count = v.count;
        tradeRankList.push(market)
      })

      const newArr = this.handleHotMarket(tradeRankList)

      this.tradeRankList = newArr;
      // console.log(tradeRankList)
    },
    // 处理置顶
    handleHotMarket(arr) {
      const newArr = arr || [];
      const hotArr = []
      this.hotLists.forEach(v => {
        const market = this.marketLists.find(vv => vv.mid === v.mid)
        if (!market) {
          return
        }
        const nowDate = Date.parse(new Date());
        const time = nowDate - v.beginTime;
        if (time < 0 || time > v.duration * 1000) {
          return
        }
        market.isTop = true;
        hotArr.push(market)

        // 去重
        const rankIndex = newArr.findIndex(vv => vv.mid === v.mid)
        if (rankIndex !== -1) {
          newArr.splice(rankIndex, 1)
        }
      })
      return [...hotArr, ...newArr];
    }
  }
}
</script>

<style lang="scss" scoped>
.pddexTab{
  font-size: 32px;
  color: #999;
  margin: 15px 30px 5px;
  height: 70px;
  position: relative;
  border: 1px solid rgba(220,220,220,.3);
  border-radius: 4px;
  &>span{
    flex: 1;
    height: 100%;
    border-radius: 4px;
  }
  .act{
    color: #FFF;
    background: #29D4B0;
  }
}
.rankTabs{
  font-size: 28px;
  /deep/ .van-sticky{
    display: none;
  }
  .subTitle{
    height: 60px !important;
    color: #999 !important;
    border-top: 0px solid #e3e3e3 !important;
    padding: 0 30px;
    font-size: 24px;
    background: #F9F9F9;
    margin-top: 8px;
    font-weight: 300;

    .sortCoin{
      width: 16px;
      margin-right: 18px;
      &.noMargin{
        margin: 0;
      }
    }
  }
  .subTab{
    height: 50px;
    /deep/ .van-tabs__wrap{
      height: auto;
    }
    /deep/ .van-tabs__nav{
      padding-bottom: 0;
      .van-tab{
        height: 50px;
      }
      .van-tabs__line{
        height: 4px;
        width: 36px;
        bottom: 0;
      }
      height: auto;
      font-size: 26px;
    }
  }
  .rankList{
    background: #FFF;
    border-radius: 15px;
    overflow: hidden;
    font-size: 26px;
    .noDate{
      padding: 100px 0;
      font-size: 27px;
      .noDataPng{
        height: 400px;
      }
      .toFollow{
        color: #FFF;
        background: #29D4B0;
        height: 72px;
        width: 360px;
        border-radius: 40px;
        font-size: 28px;
        margin: 30px auto;
      }
    }
    .smallTip{
      font-size: 20px;
    }
    .priceDiv{
      .tip{
        font-size: 20px;
      }
    }
    .rate{
      font-size: 24px;
      background: #999;
      border-radius: 4px;
      color: #FFF;
      height: 50px;
      width: 116px;
      &.green{
        background: #1FCD12;
      }
      &.red{
        background: #FE3B37;
      }
    }
    .rankItem{
      height: 100px;
      background: #FFF;
      margin: 0 30px;
      color: #333;
    }
  }
  .rankItem,.subTitle{
    // border-top: 1px solid #eee;
    &>div{
      flex: 1;
      &:first-child{
        text-align: left;
      }
      &:nth-child(2){
        max-width: 200px;
        min-width: 200px;
        text-align: right;
      }
      &:last-child{
        max-width: 180px;
        min-width: 180px;
        text-align: right;
      }
      .coinUrl{
        width: 42px;
        height: 42px;
        border-radius: 30px;
        margin-right: 8px;
      }
    }
    .rateDiv{
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
    .name{
      // font-size: 30px;
      font-weight: 500;
      position: relative;
      .small{
        font-size: 24px;
        color: #999;
      }
      .toTop{
        position: absolute;
        width: 40px;
        top: 0px;
        right: 0px;
      }
    }
  }
}
</style>
