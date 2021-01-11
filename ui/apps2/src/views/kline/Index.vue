<template>
  <div class="chartDiv" >
    <div class="headInfo flexb">
      <div class="coinInfo flexa">
        <img class="coinImg" :src="checkedMarket.sym1Data.imgUrl" :onerror="errorCoinImg">
        <div>
          <div class="coin flexa">
            <span>{{ checkedMarket.symbol1 }}/{{ checkedMarket.symbol0 }}</span>
            <!-- <img class="downCoin" src="@/assets/img/svg/down.svg"> -->
          </div>
          <div class="contract tip">{{ checkedMarket.contract1 }}</div>
        </div>
      </div>
    </div>
    <div class="poolsInfo">
      <div class="flexb">
        <div class="priceDiv">
          <div class="price">{{ price }}</div>
          <div class="tip">当前价格</div>
        </div>
        <div class="data flexc" v-if="checkedMarket.mid === 39 || checkedMarket.mid === 329">
          <div class="tip">
             <div>持有人数：</div>
             <div>Volum 24H：</div>
             <div>当前发行量：</div>
          </div>
          <div class="num">
             <div>{{ holders }}</div>
             <div>{{ parseInt(volume_24h) }}</div>
             <div>{{ parseInt(supply) || '-' }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="flexb">
      <ChardingView :checkedMarket="checkedMarket"/>
      <!-- 折线图 -->
      <!-- <div class="chart" id="main"></div> -->
    </div>

    <div class="subNav flexa">
      <span class="nav" :class="{'act': act === 1}" @click="act = 1">深度</span>
      <span class="nav" :class="{'act': act === 3}" @click="act = 3">委托订单</span>
      <span class="nav" :class="{'act': act === 2}" @click="act = 2">最新成交</span>
      <span class="nav" :class="{'act': act === 4}" @click="act = 4">简介</span>
    </div>
    <Deep v-show="act === 1" :checkedMarket="checkedMarket" :price="price"/>
    <LasterTrade v-show="act === 2" :checkedMarket="checkedMarket"/>
    <CurrentOrder v-show="act === 3" :checkedMarket="checkedMarket"/>
    <div v-if="act === 4" class="wait">敬请期待！</div>

    <div class="btnDiv flexb">
      <van-button class="btn" type="primary" @click="handleToTrade('buy')">买入</van-button>
      <van-button class="btn" type="danger" @click="handleToTrade('sell')">卖出</van-button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import ChardingView from './ChardingView';
import Deep from './comp/Deep'
import LasterTrade from './comp/LasterTrade'
import CurrentOrder from './comp/CurrentOrder'

export default {
  name: 'kLine',
  components: {
    ChardingView,
    Deep,
    LasterTrade,
    CurrentOrder,
  },
  data() {
    return {
      errorCoinImg: 'this.src="https://ndi.340wan.com/eos/eosio.token-eos.png"',
      chart: null,
      value: '1',
      arr: [],
      holders: 0,
      trx_24h: 0,
      volume_24h: 0,
      supply: 0,
      pageLists: [], // 最新成交记录
      checkedMarket: {
        symbol0: 'EOS',
        symbol1: 'DFS',
        sym1Data: {},
      },
      act: 1,
    }
  },
  mounted() {
    // this.arr = runPrice(2721)
    // console.log(this.arr)
    // this.handleSetChartFirst()
  },
  computed: {
    ...mapState({
      account: state => state.app.account,
      marketLists: state => state.sys.marketLists,
      tradeInfo: state => state.sys.tradeInfo,
      baseConfig: state => state.config.baseConfig,
    }),
    price() {
      if (!this.checkedMarket.reserve1) {
        return '-'
      }
      const t = this.checkedMarket;
      const price = (parseFloat(t.reserve0) / parseFloat(t.reserve1)) || 0
      return price.toFixed(6)
    }
  },
  watch: {
    marketLists: {
      handler: function ml() {
        this.handleGetMarket()
      },
      deep: true,
      immediate: true,
    },
    checkedMarket: {
      handler: function cm(newVal, oldVal) {
        if (oldVal && newVal.mid === oldVal.mid) {
          return
        }
        this.handleGetList();
      },
      deep: true,
      immediate: true,
    }
  },
  methods: {
    handleToTrade(type) {
      let symbol = 'eosio.token-eos-minedfstoken-dfs';
      const li = this.checkedMarket;
      if (li) {
        symbol = `${li.contract0}-${li.symbol0}-${li.contract1}-${li.symbol1}`
      }
      this.$router.push({
        name: 'trade',
        params: {
          symbol,
          type
        }
      })
    },
    handleGetMarket() {
      const params = this.$route.params;
      const arr = params.symbol.split('-')
      try {
        const checkedMarket = this.marketLists.find(v => {
          return v.symbol0 === arr[1].toUpperCase() && v.symbol1 === arr[3].toUpperCase()
              && v.contract0 === arr[0] && v.contract1 === arr[2] 
        })
        if (checkedMarket) {
          this.checkedMarket = checkedMarket;
        }
      } catch (error) {
        return
      }
    },
    // 获取交易对信息
    async handleGetList() {
      if (!this.checkedMarket.symbol1) {
        return
      }
      const params = {
        token: this.checkedMarket.symbol1.toLowerCase(),
        page: this.page,
        limit: this.size,
      }
      const {status, result} = await this.$api.transferLog(params)
      if (!status) {
        return
      }
      // this.listLoading = false;
      // this.changeLoading = false;
      const res = result;
      // this.total = res.total || 0;
      this.pageLists = res.data || [];
      this.holders = res.holders;
      this.trx_24h = res.trx_24h;
      this.volume_24h = res.volume_24h;
      this.supply = res.supply;
    },
  }
}
</script>

<style lang="scss" scoped>
.chartDiv{
  padding-bottom: 130px;
  // background: #07d79b;
  &.minScChartDiv{
    margin: 0 40px;
    padding: 0;
    overflow: hidden;
    border-radius: 20px;
    position: relative;
    .chart{
      height: 800px;
      margin-right: 0;
    }
  }

  .headInfo{
    color: #000;
    text-align: left;
    padding: 20px 30px 10px;
    background: #FFF;
    // margin-bottom: 3px;
    .coinImg{
      width: 80px;
      margin-right: 10px;
    }
    .coin{
      font-size: 36px;
      line-height: 36px;
      font-weight: 500;
      .downCoin{
        width: 30px;
        margin-left: 8px;;
      }
    }
    .contract{
      font-size: 24px;
      line-height: 24px;
      // margin-top: -10px;
    }
    .filterCoin{
      width: 60px;
    }
  }
  // 数据看板
  .poolsInfo{
    font-size: 24px;
    background: #FFF;
    color: #000;
    padding: 0 20px 20px;
    // box-shadow: 0px 10px 40px 0px rgba(220,220,220,0.5);
    // margin-bottom: 30px;
    // border-radius: 20px;
    .priceDiv{
      text-align: left;
      .price{
        font-size: 45px;
        font-weight: 500;
      }
    }
    .data{
      text-align: right;
      line-height: 34px;
      .num{
        text-align: left;
      }
    }
  }
}
.subNav{
  background: #f0f0f0;
  font-size: 30px;
  text-align: left;
  height: 66px;
  padding: 0 20px;
  .nav{
    margin-right: 20px;
  }
  .act{
    color: #000;
    font-weight: 500;
  }
}
.wait{
  padding: 50px 0;
  font-size: 36px;
  color: #999;
}
.btnDiv{
  z-index: 2;;
  position: fixed;
  bottom: 0px;
  width: 100%;
  max-width: 750px;
  font-size: 36px;
  background: #FFF;
  .btn{
    flex: 1;
    width: 100%;
    margin-right: 20px;
    &:last-child{
      margin-right: 0px;
    }
  }
}
</style>
