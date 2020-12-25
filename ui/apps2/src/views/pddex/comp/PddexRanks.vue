<template>
  <div class="">
    <div class="pddexTab flexb">
      <span class="flexc" :class="{'act': active === 0}" @click="active = 0">自选榜</span>
      <span class="flexc" :class="{'act': active === 1}" @click="active = 1">成交榜</span>
      <span class="flexc" :class="{'act': active === 2}" @click="active = 2">深度榜</span>
    </div>
    <van-tabs v-model="active" type="card"
      class="rankTabs"
      sticky animated
      title-inactive-color="#999"
      color="#29D4B0">
      <van-tab class="rankList">
        <div class="subTitle flexb">
          <div>交易对</div>
          <div>最新价(EOS)</div>
          <div>成交量(EOS)</div>
        </div>
        <div class="noDate tip" v-if="!followList.length">
          <img class="noDataPng" src="https://cdn.jsdelivr.net/gh/defis-net/material/noData/noStar.png" alt="">
          <div>快去添加你感兴趣的交易对吧</div>
          <div class="toFollow flexc" @click="active = 1">添加</div>
        </div>
        <div class="rankItem flexb dinReg" v-for="(v, index) in followList" :key="`${active}-${index}`" @click="handleToTrade(v)">
          <div class="name flexa">
            <img class="coinUrl" :src="v.sym1Data.imgUrl" :onerror="errorCoinImg">
            <span>{{ v.symbol1 }}</span>
            <span class="small">/{{ v.symbol0 }}</span>
            <img class="toTop" v-if="v.isTop" src="https://cdn.jsdelivr.net/gh/defis-net/material/svg/top.svg">
          </div>
          <div>{{ v.price || '-' }}</div>
          <div>{{ v.count || '-' }}</div>
        </div>
      </van-tab>
      <van-tab class="rankList">
        <div class="subTitle flexb">
          <div>交易对</div>
          <div>最新价(EOS)</div>
          <div>成交量(EOS)</div>
        </div>
        <div class="rankItem flexb dinReg" v-for="(v, index) in tradeRankList" :key="`${active}-${index}`" @click="handleToTrade(v)">
          <div class="name flexa">
            <img class="coinUrl" :src="v.sym1Data.imgUrl" :onerror="errorCoinImg">
            <span>{{ v.symbol1 }}</span>
            <span class="small">/{{ v.symbol0 }}</span>
            <img class="toTop" v-if="v.isTop" src="https://cdn.jsdelivr.net/gh/defis-net/material/svg/top.svg">
          </div>
          <div>{{ v.price || '-' }}</div>
          <div>{{ v.count || '-' }}</div>
        </div>
      </van-tab>
      <van-tab class="rankList">
        <div class="subTitle flexb">
          <div>交易对</div>
          <div>最新价(EOS)</div>
          <div>深度(EOS)</div>
        </div>
        <div class="rankItem flexb dinReg" v-for="(v, index) in rankList" :key="`${active}-${index}`" @click="handleToTrade(v)">
          <div class="name flexa">
            <img class="coinUrl" :src="v.sym1Data.imgUrl" :onerror="errorCoinImg">
            <span>{{ v.symbol1 }}</span>
            <span class="small">/{{ v.symbol0 }}</span>
            <img class="toTop" v-if="v.isTop" src="https://cdn.jsdelivr.net/gh/defis-net/material/svg/top.svg">
          </div>
          <div>{{ v.price || '-' }}</div>
          <div>{{ v.reserve0.split(' ')[0] }}</div>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'pddexTab',
  data() {
    return {
      active: 1,
      followList: [], // 关注展示列表
      tradeRankList: [], // 成交量排行
      tradeList: [],
      rankList: [],
      likeArr: [], // 存放接口返回的关注数据
      swapTradeLists: {},
      errorCoinImg: 'this.src="https://ndi.340wan.com/eos/eosio.token-eos.png"',
    }
  },
  mounted() {
    this.handleGetFees()
  },
  computed: {
    ...mapState({
      account: state => state.app.account,
      marketLists: state => state.config.marketLists,
      hotLists: state => state.config.hotLists, // 生产环境
    })
  },
  watch: {
    marketLists: {
      handler: function ml(newVal) {
        if (!newVal.length) {
          return
        }
        this.handleDealTradeRankLogic()
        this.handleRankList()
        this.handleDealLike()
      },
      immediate: true,
      deep: true,
    },
    active() {
      this.handleRankList()
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
    }
  },
  methods: {
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
    handleDealLike() {
      if (!this.likeArr.length || !this.marketLists.length) {
        return
      }
      const dealArr = [];
      this.likeArr.forEach(v => {
        const item = this.marketLists.find(vv => vv.mid === v.mid)
        if (!item) {
          return
        }
        dealArr.push(item)
      })
      this.followList = dealArr;
    },
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
  margin: 15px 30px 15px;
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
  .rankList{
    background: #FFF;
    border-radius: 15px;
    overflow: hidden;
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
    .subTitle{
      height: 60px !important;
      color: #999 !important;
      border-top: 0px solid #e3e3e3 !important;
    }
    .rankItem,.subTitle{
      height: 90px;
      background: #FFF;
      margin: 0 30px;
      color: #333;
      // border-top: 1px solid #eee;
      &>div{
        flex: 1;
        &:first-child{
          text-align: left;
        }
        &:nth-child(2){
          text-align: right;
        }
        &:last-child{
          text-align: right;
        }
        .coinUrl{
          width: 52px;
          height: 52px;
          border-radius: 30px;
          margin-right: 8px;
        }
      }
      .name{
        font-size: 30px;
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
}
</style>
