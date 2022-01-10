<template>
  <div class="trade">
    <div class="mg40">
      <Tabs />
      <div>
        <div class="symbolInfo flexb">
          <div class="flexa">
            <img class="coinImg" :src="market.sym1Data.imgUrl" :onerror="errorCoinImg">
            <!-- <img class="coinImg" src="@/assets/logo.png" alt=""> -->
            <div @click="showLists = true">
              <div class="name">
                <span>{{ market.symbol1 }}/{{ market.symbol0 }}</span>
                <van-icon name="arrow-down"/>
              </div>
              <div class="contract tip">{{ market.contract1 }}/{{ market.contract0 }}</div>
            </div>
          </div>
          <div class="flexa">
            <div class="star flexc" v-if="!isLike"
              @click="handleAddLike"><img src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/star-un.png" alt=""></div>
            <div class="star flexc" v-else
              @click="handleCancelLike"><img src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/star-is.png" alt=""></div>
            <div class="kline flexc" @click="handleToKline"><img src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/pddkline.png" alt=""></div>
            <div class="tools flexc" @click="showSet = true"><img src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/setting.png" alt=""></div>
          </div>
        </div>
        <div class="flexb content">
          <Left :market="market" @listenUpdate="hanldeSuccess()"/>
          <Right :market="market"/>
        </div>
      </div>
    </div>

    <div class="tradeInfo flexb">
      <div>
        <div class="tradeNum dinReg">{{ showTradeinfo.minGet || '0.0000' }}</div>
        <div class="tip">{{ $t('pddex.minGet') }}({{ showTradeinfo.getCoin }})</div>
      </div>
      <div>
        <div class="tradeNum dinReg" :class="{'green': Number(showTradeinfo.rate) > 0,
                      'yellow': Number(showTradeinfo.rate) >= 5,
                      'red': Number(showTradeinfo.rate) >= 10}">
          {{ showTradeinfo.rate || '0.00' }}%
        </div>
        <div class="tip">{{ $t('pddex.slip') }}</div>
      </div>
      <div>
        <div class="tradeNum dinReg">{{ showTradeinfo.fees || '0.0000' }}</div>
        <div class="tip">{{ $t('public.fee') }}({{ showTradeinfo.feesCoin }})</div>
      </div>
    </div>
    <!-- 订单信息 -->
    <div class="orders">
      <div class="allOrder flexa" @click="handleTo('pddexOrder')">
        <img class="allImg" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/allOrder.png" alt="">
        <span>{{ $t('pddex.allOrder') }}</span>
      </div>
      <van-tabs class="myTabs" sticky v-model="active" color="#29D4B0">
        <van-tab :title="$t('pddex.curOrder')">
          <div class="noData tip" v-if="!orderList.length">
            <img class="noDataPng" src="https://cdn.jsdelivr.net/gh/defis-net/material/noData/noOrder.png" alt="">
            <div>{{ $t('public.noData') }}</div>
          </div>
          <div class="list" v-for="(v, i) in orderList" :key="`order-${i}`">
            <div class="liTitle flexb">
              <div class="symbol">
                <span v-if="v.isBuy" class="green">{{ $t('pddex.buy') }} </span>
                <span v-else class="red">{{ $t('pddex.sell') }} </span>
                <span>{{ market.symbol1 }}/{{ market.symbol0 }}</span>
                <span class="tip"> ({{ v.oDate.substr(5, 18) }})</span>
              </div>
              <div><van-button plain type="danger" @click="handleCancel(v, i)">撤单</van-button></div>
            </div>
            <div class="flexb liTitle">
              <div>
                <div class="num">{{ v.orderNum }}</div>
                <div class="subTitle tip">{{ $t('pddex.orderVol') }}({{ market.symbol1 }})</div>
              </div>
              <div>
                <div class="num">{{ v.orderPrice }}</div>
                <div class="subTitle tip">{{ $t('pddex.orderPrice') }}({{ market.symbol0 }})</div>
              </div>
              <div>
                <div class="num">{{ v.amt }}</div>
                <div class="subTitle tip">{{ $t('pddex.orderAmt') }}({{ market.symbol0 }})</div>
              </div>
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </div>

    <van-popup class="newMarket" v-model="showLists" position="left">
      <market-lists-comp
        :marketLists="marketLists"
        v-if="showLists"
        @listenClose="handleClose"
        @listenMarketChange="handleChange"/>
    </van-popup>

    <van-popup class="popup popupSet" position="top" v-model="showSet">
      <PointSlider
        v-if="showSet"
        @handleClose="handleClose"/>
    </van-popup>

    <van-popup v-model="showCancel">
      <cancel-sure :item="cancelItem" :itemIndex="cancelIndex"
        @handleClose="handleClose"
        @cancelSuccess="hanldeSuccess"/>
    </van-popup>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { DApp } from '@/utils/wallet';
import { toFixed, toLocalTime, dealPrice } from '@/utils/public';
import Left from './comp/Left';
import Right from './comp/Right';
import MarketListsComp from '@/components/MarketArea';
import PointSlider from './popup/PointSlider'
import CancelSure from "@/views/pddex/order/comp/CancelSure";
import Tabs from '@/views/index/components/Tabs';
export default {
  name: 'trade',
  components: {
    Tabs,
    Left,
    Right,
    MarketListsComp,
    PointSlider,
    CancelSure,
  },
  data() {
    return {
      errorCoinImg: 'this.src="https://ndi.340wan.com/eos/eosio.token-eos.png"',
      active: 0,
      showLists: false,
      showSet: false,
      showCancel: false,
      market: {
        // mid: 17,
        symbol0: 'EOS',
        contract0: 'eosio.token',
        symbol1: 'USDT',
        contract1: 'tethertether',
        sym0Data:{
          imgUrl: 'https://cdn.jsdelivr.net/gh/defis-net/material2/coin/eosio.token-eos.svg'
        },
        sym1Data:{
          imgUrl: 'https://ndi.340wan.com/eos/tethertether-usdt.png'
        }
      },
      showTradeinfo: {},
      getOrder: false,
      orderList: [],
      cancelItem: {},
      cancelIndex: 0,
      orderLength: 0,

      likeArr: [],
    }
  },
  mounted() {
  },
  watch: {
    marketLists: {
      handler: function ml() {
        this.handleGetMarket()
        if (!this.getOrder) {
          this.handleGetOrderList()
        }
      },
      deep: true,
      immediate: true,
    },
    tradeInfo: {
      handler: function ml() {
        this.handleDealTradeInfo()
      },
      deep: true,
      immediate: true,
    },
    account: {
      handler: function acc(newVal) {
        if (!newVal.name) {
          return
        }
        this.handleGetLikes();
        this.handleGetOrderList()
      },
      deep: true,
      immediate: true,
    },
  },
  computed: {
    ...mapState({
      account: state => state.app.account,
      marketLists: state => state.config.marketLists,
      tradeInfo: state => state.sys.tradeInfo,
      baseConfig: state => state.sys.baseConfig,
    }),
    isLike() {
      const has = this.likeArr.find(v => v.mid === this.market.mid)
      return !!has;
    }
  },
  beforeDestroy() {
    this.handleBeforeDestroy()
  },
  methods: {
    handleBeforeDestroy() {
      const swapMarkets = {
        thisMarket0: this.market.sym1Data,
        thisMarket1: this.market.sym0Data,
        thisCoinsPath: '',
        thisMidsPath: `${this.market.mid}`,
      }
      localStorage.setItem('swapMarkets', JSON.stringify(swapMarkets))
    },
    async handleGetLikes() {
      if (!this.account.name) {
        return
      }
      const {status, result} = await this.$api.get_acc_follow();
      if (!status) {
        return
      }
      const rows = result.rows;
      if (!rows.length) {
        this.likeArr = [];
        return
      }
      this.likeArr = rows;
    },
    handleCancelLike() {
      console.log(this.account)
      if (!this.account.name) {
        return
      }
      const formName = this.account.name;
      const permission = this.account.permissions;
      const params = {
        actions: [{
          account: 'dfsusersinfo',
          name: 'unlike',
          authorization: [{
            actor: formName, // 转账者
            permission,
          }],
          data: {
            user: formName,
            mid: this.market.mid
          }
        }]
      }
      DApp.toTransaction(params, (err) => {
        if (err && err.code === 402) {
          return;
        }
        if (err) {
          this.$message({
            type: 'error',
            message: err.message,
          })
          return;
        }
        this.$message({
          type: 'success',
          message: '操作成功'
        })
        setTimeout(() => {
          this.handleGetLikes()
        }, 1000);
      })
    },
    handleAddLike() {
      if (!this.account.name) {
        return
      }
      const formName = this.account.name;
      const permission = this.account.permissions;
      const params = {
        actions: [{
          account: 'dfsusersinfo',
          name: 'like',
          authorization: [{
            actor: formName, // 转账者
            permission,
          }],
          data: {
            user: formName,
            mid: this.market.mid
          }
        }]
      }
      DApp.toTransaction(params, (err) => {
        if (err && err.code === 402) {
          return;
        }
        if (err) {
          this.$message({
            type: 'error',
            message: err.message,
          })
          return;
        }
        this.$message({
          type: 'success',
          message: '操作成功'
        })
        setTimeout(() => {
          this.handleGetLikes()
        }, 1000);
      })
    },
    handleTo(name) {
      this.$router.push({
        name
      })
    },
    handleToKline() {
      this.$router.push({
        name: 'kLine',
        params: {
          symbol: this.$route.params.symbol
        }
      })
    },
    hanldeSuccess(index) {
      this.showCancel = false;
      if (index !== undefined) {
        this.orderList.splice(index, 1)
        return
      }
      this.handleGetOrderList(this.orderList.length)
    },
    handleDealTradeInfo() {
      if (typeof this.tradeInfo !== 'object' || !this.tradeInfo.price) {
        this.showTradeinfo = {}
        return
      }
      const isBuy = this.tradeInfo.direction === 'buy'
      const decimal = isBuy ? this.market.decimal0 : this.market.decimal1;
      const showTradeinfo = JSON.parse(JSON.stringify(this.tradeInfo)) || {};
      let fees = (showTradeinfo.payNum || 0) * 3 / 1000;
      if (fees < 1 / 10 ** decimal) {
        fees = 0;
      }
      showTradeinfo.fees = fees.toFixed(decimal);
      let rate = 0
      if (showTradeinfo.swapInPrice) {
        rate = (showTradeinfo.price - showTradeinfo.swapInPrice) / showTradeinfo.price * 100;
      }
      rate = Math.abs(rate);
      showTradeinfo.rate = rate.toFixed(2);
      const getCoin = isBuy ? this.market.symbol1 : this.market.symbol0;
      const feesCoin = !isBuy ? this.market.symbol1 : this.market.symbol0;
      showTradeinfo.getCoin = getCoin;
      showTradeinfo.feesCoin = feesCoin;
      this.showTradeinfo = showTradeinfo;
    },
    handleGetMarket() {
      const params = this.$route.params;
      const arr = params.symbol.split('-')
      try {
        const market = this.marketLists.find(v => {
          return v.symbol1 === arr[1].toUpperCase() && v.symbol0 === arr[3].toUpperCase()
              && v.contract1 === arr[0] && v.contract0 === arr[2] 
        })
        if (market) {
          this.market = market;
        }
      } catch (error) {
        return
      }
    },
    handleCancel(item, index){
      this.cancelItem = item;
      this.cancelIndex = index;
      this.showCancel = true;
    },
    handleClose() {
      this.showLists = false;
      this.showSet = false;
      this.showCancel = false;
    },
    handleChange(item) {
      this.handleClose();
      this.market = item;
      this.orderList = [];
      this.handleGetOrderList()
      this.$router.push({
        name: 'pddexTrade',
        params: {
          symbol: `${item.contract1}-${item.symbol1}-${item.contract0}-${item.symbol0}`
        }
      })
    },
    // 查询交易对订单
    async handleGetOrderList(length) {
      if (!this.market.mid) {
        return;
      }
      if (!this.account.name) {
        return
      }
      this.getOrder = true;
      const params = {
        code: this.baseConfig.pddex,
        scope: this.market.mid,
        table: 'orders2',
        json: true,
        limit: 1000,
        index_position: 3,
        key_type: "i64",
        lower_bound: ` ${this.account.name}`,
        upper_bound: ` ${this.account.name}`,
      }
      const {status, result} = await this.$api.get_table_rows(params);
      if (!status) {
        return
      }
      const lists = result.rows || [];
      lists.forEach(v => {
        v.mid = this.market.mid;
        const arr = v.quantity.split(' ');
        if (arr[1] === this.market.symbol0) {
          this.$set(v, 'isBuy', true)
          const amt = arr[0]
          this.$set(v, 'amt', amt)
          const oDate = toLocalTime(`${v.time}.000+0000`)
          this.$set(v, 'oDate', oDate)
          const orderNum = v.min_out / 10 ** this.market.decimal1;
          this.$set(v, 'orderNum', toFixed(orderNum, this.market.decimal1))
          const orderPrice = dealPrice( v.price / 1000000);
          this.$set(v, 'orderPrice', orderPrice)
        } else {
          this.$set(v, 'isBuy', false)
          const orderNum = arr[0]
          this.$set(v, 'orderNum', orderNum)
          const orderPrice = dealPrice( v.price / 1000000);
          this.$set(v, 'orderPrice', orderPrice)
          const oDate = toLocalTime(`${v.time}.000+0000`)
          this.$set(v, 'oDate', oDate)
          const amt = v.min_out / 10 ** this.market.decimal0
          this.$set(v, 'amt', toFixed(amt, this.market.decimal0))
        }
      });
      this.orderList = lists;
      if (length !== undefined && length === lists.length) {
        setTimeout(() => {
          this.handleGetOrderList(length)
        }, 1000);
      }
      // console.log(lists)
      this.$forceUpdate()
    }
  }
}
</script>

<style lang="scss" scoped>
.trade{
  font-size: 24px;
  text-align: left;
  color: #000;
  // padding: 0 20px;
  // background: #FFF;
  .mg40{
    margin: 0 30px 32px;
    border-radius: 12px;
    border: 1px solid rgba(224,224,224,1);
    overflow: hidden;
    padding-bottom: 20px;
  }
  .symbolInfo{
    padding: 0 20px;
    background: #fff;
    height: 90px;
    position: sticky;
    top: 0;
    z-index: 12;
    .coinImg{
      width: 50px;
      height: 50px;
      margin-right: 10px;
      border-radius: 50px;
    }
    .name{
      font-weight: 500;
      font-size: 28px;
      line-height: 38px;
      .van-icon{
        margin-left: 8px;
        font-size: 28px;
        line-height: 33px;
      }
    }
    .contract{
      font-size: 22px;
      line-height: 24px;
    }
    .star,
    .kline,
    .tools{
      width: 32px;
      height: 32px;
      border-radius: 10px;
      margin-left: 32px;
      img{
        width: 100%;
      }
      // box-shadow: 0px 20px 50px 0px rgba(100,101,102,0.12);
    }
    .star{
      width: 42px;
      height: 42px;
    }
    .kline{
      border-radius: 10px;
      // box-shadow: 0px 20px 50px 0px rgba(100,101,102,0.12);
      width: 52px;
      height: 52px;
      margin-left: 32px;
      img{
        width: 60%;
      }
    }
  }
  .green{
    color: #29D4B0;
  }
  .yellow{
    color: #f29949;
  }
  .red{
    color: #FE3B37;
  }
  .content{
    padding: 0 20px;
    background: #fff;
    align-items: flex-start;
    padding-bottom: 12px;
  }
  .tradeInfo{
    background: #f4f4f4;
    padding: 20px 30px;
    font-size: 24px;
    &>div{
      flex: 1;
    }
    &>div:nth-child(2){
      text-align: center;
    }
    &>div:last-child{
      text-align: right;
    }
    .tradeNum{
      margin-bottom: 10px;
      font-size: 28px;
    }
  }
  .orders{
    padding: 0 20px;
    background: #fff;
    position: relative;
    .allOrder{
      position: absolute;
      z-index: 10;
      top: 26px;
      right: 30px;
      color: #999;
      .allImg{
        width: 24px;
        margin-right: 14px;
      }
    }
    .myTabs{
      .noData{
        padding: 20px 0;
        text-align: center;
        .noDataPng{
          height: 400px;
        }
      }
      /deep/ .van-tabs__wrap{
        width: 200px;
        .van-tab--active{
          padding-left: 20px;
        }
        .van-tab{
          justify-content: flex-start;
        }
        .van-tabs__line{
          position: absolute;
          left: 0%;
          bottom: 50%;
          transform: translate(0, 0) !important;
          width: 8px;
          height: 28px;
        }
      }
    }
    .list{
      // height: 300px;
      padding: 20px;
      margin: 20px 0;
      background: #FFF;
      border-radius: 15px;;
      box-shadow: 0px 10px 20px 0px rgba(220,220,220,0.5);
      .symbol{
        font-size: 30px;
        font-weight: 500;
      }
      .van-button{
        height: 60px;
      }
      .liTitle{
        margin-bottom: 20px;
      }
      .subTitle{
        font-size: 24px;
      }
      .num{
        font-size: 30px;
      }
    }
  }
}
.popup{
  width: 90%;
  border-radius: 15px;

  &.popupSet{
    top: 110px;
    left: 50%;
    transform: translate(-50%, 0);
  }
}
</style>
