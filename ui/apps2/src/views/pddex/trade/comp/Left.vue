<template>
  <div class="tradeLeft">
    <!-- 买入/卖出 -->
    <div class="direction flexb">
      <div class="flexc" :class="{'buy': direction === 'buy'}"
        @click="handleChangeDirection('buy')">{{ $t('pddex.buyIn') }}</div>
      <div class="flexc" :class="{'sell': direction === 'sell'}"
        @click="handleChangeDirection('sell')">{{ $t('pddex.sellOut') }}</div>
    </div>
    <van-popover v-model="showPop" trigger="click">
      <div class="myPopover">
        <div class="item flexc" v-for="(v, i) in option1" :key="i"
          @click="handleCheck(v.value)">{{ v.text }}</div>
      </div>
      <template #reference>
        <div class="typeDiv flexb">
          <span>{{ option1[type].text }}</span>
          <van-icon name="arrow-down"/>
        </div>
      </template>
    </van-popover>
    <MarketTrade v-if="type === 1"
      :type="type" :direction="direction" :market="market"
      :bal0="bal0" :bal1="bal1"/>
    <LimitTrade v-else :type="type" :direction="direction" :market="market"
      :bal0="bal0" :bal1="bal1" @listenUpdate="handleUpdate"/>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { SwapRouter, SwapRouterFilter } from '@/utils/swap_router';
import { toFixed, accMul, dealRouterArr } from '@/utils/public';
import { DApp } from '@/utils/wallet';
import LimitTrade from './LimitTrade';
import MarketTrade from './MarketTrade';
export default {
  name: 'tradeLeft',
  components: {
    MarketTrade,
    LimitTrade,
  },
  props: {
    market: {
      type: Object,
      default: function mk() {
        return {}
      }
    }
  },
  data() {
    return {
      showPop: false,
      direction: 'buy',
      type: 0, // 0 - 限价 ｜ 1 - 市价
      option1: [
        { text: this.$t('pddex.limit'), value: 0 },
        { text: this.$t('pddex.market'), value: 1 },
      ],
      price: '',
      getPrice: false,
      num: '',
      bal0: '0.0000', // DFS
      bal1: '0.0000', // EOS
      slider: 0,
      aboutNum: '0.0000',

      // change Type
      sliderChange: false,
      // timer
      sliderTimer: null,
      balTimer: null,
    }
  },
  watch: {
    'market.mid': {
      handler: function smid(newVal, oldVal) {
        if (newVal === oldVal && !this.market.price && this.getPrice) {
          return
        }
        this.getPrice = true;
        this.price = this.market.price || '0.0000';
        this.handleStartBalTimer()
      },
      deep: true,
      immediate: true,
    },
    marketLists: {
      handler: function ml(newArr) {
        if (!newArr.length) {
          return
        }
        // SwapRouter.init(newArr, this)
      },
      deep: true,
      immediate: true,
    },
    account: {
      handler: function acc() {
        this.handleStartBalTimer()
      },
      deep: true,
      immediate: true,
    },
    market: {
      handler: function mt(newVal) {
        const tArr = dealRouterArr(this.marketLists, newVal.sym1Data, newVal.sym0Data)
        SwapRouter.init(tArr, this, newVal.sym1Data, newVal.sym0Data)

        const tArr2 = dealRouterArr(this.filterMkLists, newVal.sym1Data, newVal.sym0Data)
        SwapRouterFilter.init(tArr2, this, newVal.sym1Data, newVal.sym0Data)
      },
      deep: true,
      immediate: true,
    }
  },
  computed: {
    ...mapState({
      account: state => state.app.account,
      marketLists: state => state.sys.marketLists,
      filterMkLists: state => state.sys.filterMkLists,
    }),
  },
  mounted() {
    if (this.$route.params.type) {
      this.direction = this.$route.params.type;
    }
  },
  beforeDestroy() {
    clearInterval(this.balTimer);
    clearTimeout(this.sliderTimer)
  },
  methods: {
    handleCheck(type) {
      this.type = type;
      this.showPop = false;
    },
    handleUpdate() {
      this.$emit('listenUpdate', true)
    },
    handleStartBalTimer() {
      if (!this.account.name) {
        return
      }
      clearInterval(this.balTimer);
      this.handleGetAccBal()
      this.handleGetAccBal('sym1')
      this.balTimer = setInterval(() => {
        this.handleStartBalTimer();
      }, 10000);
    },
    handleChangeDirection(type) {
      if (this.direction === type) {
        return
      }
      this.direction = type;
      this.num = '';
      this.aboutNum = '0.0000';
      this.slider = 0;
    },
    handleDealNum(num) {
      if (this.sliderChange) {
        return
      }
      if (this.type === 1) { // 市价交易
        this.handleDealMarketNum(num)
        return
      }
      if (!Number(this.price)) {
        this.aboutNum = '0.0000';
        return
      }
      const aboutNum = this.price * num;
      this.aboutNum = toFixed(aboutNum, this.market.decimal0);
      this.handleDealSlider();
    },
    // 市价交易
    handleDealMarketNum(num) {
      const m0 = this.market
      const params0 = this.direction === 'buy' ? `${m0.contract0}:${m0.symbol0}` : `${m0.contract1}:${m0.symbol1}`
      const params1 = this.direction !== 'buy' ? `${m0.contract0}:${m0.symbol0}` : `${m0.contract1}:${m0.symbol1}`
      const inData = {
        type: this.direction === 'sell' ? 'pay' : 'get'
      }
      const path = SwapRouter.get_paths(params0, params1, inData.type)
      const params = [
        path,
        inData.type === 'pay' ? params0 : params1,
      ]
      params.push(accMul(num, 10 ** this.market.decimal1))
      if (this.direction !== 'sell') {
        params.push(inData.type)
      }
      try {
        const res = SwapRouter.get_amounts_out(...params)
        let aboutNum = res.amount_in / 10 ** this.market.decimal0;
        this.aboutNum = toFixed(aboutNum, this.market.decimal0);
      } catch (error) {
        this.aboutNum = 0
      }
      this.handleDealSlider()
    },
    handleDealSlider() {
      const bal = this.direction === 'buy' ? this.bal0 : this.bal1;
      const dealNum = this.direction === 'buy' ? this.aboutNum : this.num;
      let slider = dealNum / bal * 100;
      if (slider < 0) {
        slider = 0;
      } else if (slider > 100) {
        slider = 100;
      }
      this.slider = parseInt(slider)
    },
    onChange(value) {
      this.sliderChange = true;
      clearTimeout(this.sliderTimer)
      this.sliderTimer = setTimeout(() => {
        this.sliderChange = false;
      }, 500);
      if (this.type === 1) { // 市价交易
        this.onChangeMarket(value)
        return
      }
      const bal = this.direction === 'buy' ? this.bal0 : this.bal1;
      const aboutNum = bal * value / 100;
      this.aboutNum = toFixed(aboutNum, this.market.decimal1)
      // 计算num
      if (!Number(this.price)) {
        this.num = '';
        return
      }
      let num = aboutNum / this.price;
      this.num = toFixed(num, this.market.decimal0)
    },
    // 市价时滑点滑动条
    onChangeMarket(value) {
      const bal = this.direction === 'buy' ? this.bal0 : this.bal1;
      const dealNum = value / 100 * bal;
      if (this.direction === 'buy') {
        this.aboutNum = dealNum.toFixed(4)
      } else {
        this.num = dealNum.toFixed(4)
      }
    },
    handleChange(num) {
      this.slider = num;
      this.onChange(num)
    },
    // 获取用户余额
    handleGetAccBal(type) {
      let params = {
        code: this.market.contract0,
        coin: this.market.symbol0,
      }
      const isSym0 = type !== 'sym1';
      if (!isSym0) {
        params = {
          code: this.market.contract1,
          coin: this.market.symbol1,
        }
      }
      DApp.getCurrencyBalance(params, (res) => {
        const coin = res.split(' ')[1];
        if (coin !== this.market.symbol0 && coin !== this.market.symbol1) {
          return;
        }
        const decimal = isSym0 ? this.market.decimal0 : this.market.decimal1;
        let bal = parseFloat(res || 0).toFixed(decimal);
        isSym0 ? this.bal0 = bal : this.bal1 = bal;
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.tradeLeft{
  width: 60%;
  max-width: 60%;
  color: #000;
  padding: 0 10px 0 0;
  margin-top: 10px;
  /deep/ .van-popover__wrapper{
    display: block;
  }
  .direction{
    // box-shadow: 0px 20px 50px 0px rgba(100,101,102,0.08);
    border: 1px solid rgba(220,220,220,.3);
    border-radius: 40px;
    margin-bottom: 20px;
    &>div{
      flex: 1;
      height: 70px;
      font-size: 30px;
      border-radius: 40px;
      &.buy{
        color: #FFF;
        background: #29D4B0;;
      }
      &.sell{
        color: #FFF;
        background: #FE3B37;
      }
    }
  }
  .typeDiv{
    position: relative;
    z-index: 11;
    margin: 24px 0;
    font-size: 28px;
    height: 65px;
    box-shadow: none;
    border-radius: 35px;
    border: 1px solid rgba(220,220,220,.3);
    padding: 0 30px;
  }
}

.myPopover{
  font-size: 28px;
  padding: 8px 26px;
  box-sizing: border-box;
  width: 360px;
  .item{
    height: 70px;
    border-bottom: 1px solid rgba(220,220,220, .3);
    &:last-child{
      border-bottom: 0;
    }
  }
}
</style>
