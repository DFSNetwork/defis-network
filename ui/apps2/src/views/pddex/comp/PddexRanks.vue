<template>
  <div class="">
    <div class="pddexTab flexb">
      <span class="flexc" :class="{'act': active === 0}" @click="active = 0">{{ $t('pddex.follow') }}</span>
      <span class="flexc" :class="{'act': active === 1}" @click="active = 1">{{ $t('pddex.all') }}</span>
    </div>
    <div class="rankTabs">
      <van-tabs v-model="coinName"
        v-if="active === 1"
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
            <span>{{ $t('pddex.amt') }}</span>
            <img class="sortCoin" v-if="sortVol === 0" src="https://cdn.jsdelivr.net/gh/defis-net/material2/pddex/sort_default.png" alt="">
            <img class="sortCoin" v-else-if="sortVol === 1" src="https://cdn.jsdelivr.net/gh/defis-net/material2/pddex/sort_down.png" alt="">
            <img class="sortCoin" v-else src="https://cdn.jsdelivr.net/gh/defis-net/material2/pddex/sort_up.png" alt="">
          </span>
          <span class="flexa" @click="handleSortPools">
            <span>{{ $t('pddex.pools') }}</span>
            <img class="sortCoin" v-if="sortPools === 0" src="https://cdn.jsdelivr.net/gh/defis-net/material2/pddex/sort_default.png" alt="">
            <img class="sortCoin" v-else-if="sortPools === 1" src="https://cdn.jsdelivr.net/gh/defis-net/material2/pddex/sort_down.png" alt="">
            <img class="sortCoin" v-else src="https://cdn.jsdelivr.net/gh/defis-net/material2/pddex/sort_up.png" alt="">
          </span>
          <span class="flexa" @click="handleSortApy">
            <span>{{ $t('pddex.apys') }}</span>
            <img class="sortCoin" v-if="sortApy === 0" src="https://cdn.jsdelivr.net/gh/defis-net/material2/pddex/sort_default.png" alt="">
            <img class="sortCoin" v-else-if="sortApy === 1" src="https://cdn.jsdelivr.net/gh/defis-net/material2/pddex/sort_down.png" alt="">
            <img class="sortCoin" v-else src="https://cdn.jsdelivr.net/gh/defis-net/material2/pddex/sort_up.png" alt="">
          </span>
        </div>
        <div class="rateDiv">
          <span class="flexa" @click="handleSortPrice">
            <span>{{ $t('pddex.newPrice') }}</span>
            <img class="sortCoin noMargin" v-if="sortPrice === 0" src="https://cdn.jsdelivr.net/gh/defis-net/material2/pddex/sort_default.png" alt="">
            <img class="sortCoin noMargin" v-else-if="sortPrice === 1" src="https://cdn.jsdelivr.net/gh/defis-net/material2/pddex/sort_down.png" alt="">
            <img class="sortCoin noMargin" v-else src="https://cdn.jsdelivr.net/gh/defis-net/material2/pddex/sort_up.png" alt="">
          </span>
        </div>
        <div class="rateDiv">
          <span class="flexa" @click="handleSortRate">
            <span>{{ $t('pddex.rate') }}</span>
            <img class="sortCoin noMargin" v-if="sortRate === 0" src="https://cdn.jsdelivr.net/gh/defis-net/material2/pddex/sort_default.png" alt="">
            <img class="sortCoin noMargin" v-else-if="sortRate === 1" src="https://cdn.jsdelivr.net/gh/defis-net/material2/pddex/sort_down.png" alt="">
            <img class="sortCoin noMargin" v-else src="https://cdn.jsdelivr.net/gh/defis-net/material2/pddex/sort_up.png" alt="">
          </span>
        </div>
      </div>
      <van-pull-refresh
        v-model="isLoading"
        :success-text="$t('pddex.refreshSuccess')"
        @refresh="onRefresh"
      >
        <div class="rankList" v-if="active === 0">
          <div class="loading_p flexc" v-if="!getLike"><van-loading type="spinner" color="#29D4B0"/></div>
          <div class="noDate tip" v-if="!followList.length && getLike">
            <img class="noDataPng" src="https://cdn.jsdelivr.net/gh/defis-net/material/noData/noStar.png" alt="">
            <div>{{ $t('pddex.noFollow') }}</div>
            <div class="toFollow flexc" @click="active = 1">{{ $t('pddex.add') }}</div>
          </div>
          <div class="rankItem flexb dinReg" v-for="(v, index) in followList" :key="`${active}-${index}`" @click="handleToTrade(v)">
            <div class="name flexa">
              <img class="coinUrl" :src="v.sym1Data.imgUrl" :onerror="errorCoinImg">
              <div>
                <div>
                  <span>{{ v.symbol1 }}</span>
                  <span class="small">/{{ v.symbol0 }}</span>
                </div>
                <div class="tip smallTip">
                  <span v-if="sortPools">{{ $t('pddex.pools') }} {{ v.poolsNum }}</span>
                  <span v-else-if="sortApy">
                    <span>{{ $t('pddex.apys1') }} {{ v.countApy }}%</span>
                    <span class="green_p" @click.stop="handleShowApy(v)">详情＞</span>
                  </span>
                  <span v-else>{{ $t('pddex.amt1') }} {{ parseFloat(v.volume24H) }}</span>
                </div>
              </div>
            </div>
            <div class="priceDiv">
              <div>{{ v.price || '-' }}</div>
              <div class="tip smallTip" v-if="language === 'en'">
                <span>$</span>
                <span>{{ v.aboutPriceU }}</span>
              </div>
              <div class="tip smallTip" v-else>
                <span>¥</span>
                <span>{{ v.aboutPriceCNY }}</span>
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
          <div class="noDate tip" v-loading="unGetAllMarket" v-if="!cdAreaLists.length">
            <img class="noDataPng" src="https://cdn.jsdelivr.net/gh/defis-net/material/noData/noStar.png" alt="">
            <div>{{ $t('public.noData') }}</div>
          </div>
          <div class="rankItem flexb dinReg" v-for="(v, index) in cdAreaLists" :key="`${active}-${index}`" @click="handleToTrade(v)">
            <div class="name flexa">
              <img class="coinUrl" :src="v.sym1Data.imgUrl" :onerror="errorCoinImg">
              <div>
                <div>
                  <span>{{ v.symbol1 }}</span>
                  <span class="small">/{{ v.symbol0 }}</span>
                </div>
                <div class="tip smallTip">
                  <span v-if="sortPools">{{ $t('pddex.pools') }} {{ v.poolsNum }}</span>
                  <span v-else-if="sortApy">
                    <span>{{ $t('pddex.apys1') }} {{ v.countApy }}%</span>
                    <span class="green_p" @click.stop="handleShowApy(v)">详情＞</span>
                  </span>
                  <span v-else>{{ $t('pddex.amt1') }} {{ parseFloat(v.volume24H) }}</span>
                </div>
              </div>
            </div>
            <div class="priceDiv">
              <div>{{ v.price || '-' }}</div>
              <div class="tip smallTip" v-if="language === 'en'">
                <span>$</span>
                <span>{{ v.aboutPriceU }}</span>
              </div>
              <div class="tip smallTip" v-else>
                <span>¥</span>
                <span>{{ v.aboutPriceCNY }}</span>
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
      </van-pull-refresh>
    </div>
    <!-- 年化详情 -->
    <el-dialog
      class="myDialog apy"
      :visible.sync="showApyDetail">
      <MarketApy :countApy="countApy" :isActual="true"
                 :aprInfo="aprInfo"/>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { dealAreaArr } from '@/views/pddex/comp/appLogic';
import MarketApy from '@/views/market/popup/MarketApy'
// import moment from 'moment';

export default {
  name: 'pddexTab',
  components: {
    MarketApy,
  },
  data() {
    return {
      coinName: 'USDT',
      active: 0,
      followList: [], // 关注展示列表
      tradeRankList: [], // 成交量排行
      tradeList: [],
      rankList: [],
      likeArr: [], // 存放接口返回的关注数据
      swapTradeLists: {},
      errorCoinImg: 'this.src="https://ndi.340wan.com/eos/eosio.token-eos.png"',
      allMarket: localStorage.getItem('allMarket') ? JSON.parse(localStorage.getItem('allMarket')) :{},
      areaLists: ['USDT', 'USDC', 'EOS', 'DFS', 'TAG'],
      cdAreaLists: [],

      // 排序
      sortVol: 0,
      sortPools: 0,
      sortApy: 0,
      sortRate: 0,
      sortPrice: 0,

      // apyData
      countApy: '0.00',
      feesApr: '0.00',
      aprV3: '0.00',
      lpApy: {},
      tagLpApy: '0.00',
      aprInfo: {},
      showApyDetail: false,

      isLoading: false,
      unGetAllMarket: true,
      getLike: false,
    }
  },
  mounted() {
    this.handleDealArea()
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
      lpMid: state => state.config.lpMid,
    })
  },
  watch: {
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
    onRefresh() {
      this.handleGetMarkets()
      this.handleGetLikes();
      this.$emit('listenUpdate', true)
    },
    // 显示年化
    handleShowApy(v) {
      this.countApy = v.countApy;
      this.aprInfo = v;
      this.showApyDetail = true
    },
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
      this.sortPrice = t;
      this.sortPools = 0;
      this.sortVol = 0;
      this.sortApy = 0;
      this.sortRate = 0;
      this.handleDealSort()
    },

    // 获取关注列表
    async handleGetLikes() {
      if (!this.account.name) {
        return
      }
      const {status, result} = await this.$api.get_acc_follow();
      this.getLike = true;
      if (!status) {
        return
      }
      const rows = result.rows;
      if (!rows.length) {
        if (this.active === 0) {
          this.active = 1;
        }
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
      this.areaLists.forEach(key => {
        allMarket.push(...this.allMarket[key])
      })
      // this.$store.dispatch('setPddexMarketLists', allMarket)
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
        symbol = `${li.contract1}-${li.symbol1}-${li.contract0}-${li.symbol0}`
      }
      this.$router.push({
        name: 'kLine',
        params: {
          symbol
        }
      })
    },
    // 获取行情数据
    async handleGetMarkets() {
      const {status, result} = await this.$api.getPddexMarkets()
      this.isLoading = false;
      this.unGetAllMarket = false;
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
      localStorage.setItem('allMarket', JSON.stringify(this.allMarket))
      this.handleDealArea()
    },
    handleDealArea() {
      const coin = this.coinName;
      if (!this.allMarket[coin]) {
        return
      }
      this.cdAreaLists = this.allMarket[coin];
    },
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
      .green_p{
        margin-left: 10px;
      }
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
        background: #5AAF90;
      }
      &.red{
        background: #FF4D4D;
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
        max-width: 180px;
        min-width: 180px;
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
        font-size: 22px;
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

.myDialog{
  /deep/ .el-dialog{
    position: relative;
    margin: auto;
    width: 570px;
    border-radius: 20px;
    .el-dialog__body,
    .el-dialog__header{
      padding: 0;
    }
  }
  &.apy{
    /deep/ .el-dialog{
      width: 620px;
    }
  }
}
</style>
