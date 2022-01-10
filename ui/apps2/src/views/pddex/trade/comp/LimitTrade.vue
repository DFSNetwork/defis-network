<template>
  <div class="limitTrade">
    <!-- <div class="stop flexc" v-if="!market.pid">
      <div>
        <div>{{ $t('pddex.unOpenTip1') }}</div>
        <div>{{ $t('pddex.unOpenTip2') }}</div>
      </div>
    </div> -->
    <!-- 挂单价格 -->
    <div class="price dinReg">
      <van-stepper type="number" v-model="price" min='0' step="0.0001" @blur="priceIptBlur"/>
    </div>
    <!-- 挂单数量 -->
    <div class="num dinBold">
      <van-cell-group>
        <van-field class="numIpt" type="number" v-model="num" 
          :placeholder="$t('pddex.iptNumTip')" 
          @blur="numIptBlur"
          @focus="numIptFocus"
          @input="handleDealNum">
          <template #extra>
            <span class="din">{{ market.symbol1 }}</span>
          </template>
        </van-field>
      </van-cell-group>
    </div>
    <!-- 可用EOS -->
    <div class="flexb bal dinReg">
      <span class="tip">{{ $t('public.balance') }}:</span>
      <span v-if="direction !== 'sell'">{{ bal0 }} {{ market.symbol0 }}</span>
      <span v-else>{{ bal1 }} {{ market.symbol1 }}</span>
    </div>
    <!-- 百分比 -->
    <div class="slider" :class="{'sellSlider': direction !== 'buy'}">
      <van-slider v-model="slider" show-stops @input="onChange"
        :active-color="direction === 'buy' ? '#29D4B0' : '#FE3B37'">
      </van-slider>
    </div>
    <div class="flexb tip percent dinReg">
      <span @click="handleChange(0)">0%</span>
      <span @click="handleChange(50)" class="toCenter">50%</span>
      <span @click="handleChange(100)">100%</span>
    </div>
    <div class="flexa aboutNum dinReg">
      <span class="tip">{{ $t('pddex.tradeAmt') }}：</span>
      <span>≈ {{ aboutNum }} {{ market.symbol0 }}</span>
    </div>
    <!-- 交易按钮 -->
    <div class="btnDiv" @click="handleRegPrice">
      <van-button class="btn" v-if="direction === 'buy'" type="primary">{{ $t('pddex.buyIn') }}{{ market.symbol1 }}</van-button>
      <van-button class="btn" v-else type="danger">{{ $t('pddex.sellOut') }}{{ market.symbol1 }}</van-button>
    </div>

    <van-popup v-model="showBig" class="popup">
      <BigTrade :tradeData="tradeData"
        @handleClose="handleClose"
        @hanldeSuccess="hanldeSuccess"/>
    </van-popup>

    <van-popup v-model="showPrice" class="popup">
      <PriceMore :tradeData="tradeData" :price="price" :direction="direction"
        @handleClose="handleClose"
        @hanldeSuccess="handleRegLarge"/>
    </van-popup>
  </div>
</template>

<script>
import Bus from '@/utils/bus';
import { mapState } from 'vuex';
import { DApp } from '@/utils/wallet';
import { toFixed, dealPrice, accMul } from '@/utils/public';
import { SwapRouter } from '@/utils/swap_router';

import BigTrade from "../popup/BigTrade";
import PriceMore from "../popup/PriceMore";

export default {
  name: 'limit', // 限价交易
  components: {
    BigTrade,
    PriceMore
  },
  props: {
    direction: {
      type: String,
      default: 'buy',
    },
    bal0: {
      type: String,
      default: '0.0000',
    },
    bal1: {
      type: String,
      default: '0.0000',
    },
    type: {
      type: Number,
      default: 1,
    },
    market: {
      type: Object,
      default: function mt() {
        return {}
      }
    },
  },
  data() {
    return {
      price: '',
      num: '',
      aboutNum: '0.0000',
      slider: 0,
      // change Type
      sliderChange: false,
      // timer
      sliderTimer: null,
      // dialog
      showBig: false,
      showPrice: false,
      tradeData: {},
    }
  },
  computed: {
    ...mapState({
      account: state => state.app.account,
      baseConfig: state => state.sys.baseConfig,
      tradeInfo: state => state.sys.tradeInfo,
    }),
  },
  watch: {
    'market.mid': {
      handler: function smid(newVal, oldVal) {
        if (newVal === oldVal || !this.market.price) {
          return
        }
        this.price = dealPrice(this.market.price || '0.0000');
        this.num = '';
        this.aboutNum = '0.0000';
        this.slider = 0;
        this.handleSetTradeInfo({})
      },
      deep: true,
      immediate: true,
    },
    price() {
      this.handleDealNum(this.num)
    },
    direction: {
      handler: function dt() {
        this.handleChangeDirection()
      }
    },
  },
  mounted() {
    Bus.$on('clickPrice', (val) => {
      // console.log(val)
      this.price = val.price;
    });
  },
  beforeDestroy() {
    this.handleChangeDirection()
    clearTimeout(this.sliderTimer)
  },
  methods: {
    handleClose() {
      this.showBig = false;
      this.showPrice = false;
    },
    hanldeSuccess() {
      this.handleClose()
      this.handleLimitTrade()
    },
    handleChange(num) {
      this.slider = num;
      this.onChange(num)
    },
    priceIptBlur() {
      this.price = dealPrice(this.price)
    },
    numIptBlur() {
      const num = Number(this.num || 0);
      !num ? this.num = '' : this.num = toFixed(num, this.market.decimal1)
    },
    numIptFocus() {
      const num = Number(this.num || 0);
      !num ? this.num = '' : this.num = num;
    },
    // 切换买入 ｜ 卖出
    handleChangeDirection(type) {
      if (this.direction === type) {
        return
      }
      this.num = '';
      this.aboutNum = '0.0000';
      this.slider = 0;
      this.handleSetTradeInfo({})
    },
    // 保存交易信息
    handleSetTradeInfo(info) {
      const dealInfo = info;
      this.$store.dispatch('setTradeInfo', dealInfo)
    },
    handleDealNum(num) {
      if (this.sliderChange) {
        return
      }
      if (!Number(this.price)) {
        this.aboutNum = '0.0000';
        return
      }
      const isBuy = this.direction === 'buy';
      let aboutNum = 0
      isBuy ? aboutNum = this.price * num / 0.997 : aboutNum = this.price * num * 0.997;
      this.aboutNum = toFixed(aboutNum, this.market.decimal0);

      const minGet = isBuy ? toFixed(num, this.market.decimal1) : toFixed(this.aboutNum, this.market.decimal0);
      const info = {
        payNum: isBuy ? this.aboutNum : num,
        price: this.price,
        minGet,
        direction: this.direction,
      }
      this.handleSetTradeInfo(info)

      this.handleDealSlider();
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
      const isBuy = this.direction === 'buy';
      const bal = isBuy ? this.bal0 : this.bal1;
      if (isBuy) {
        const aboutNum = bal * value / 100;
        this.aboutNum = toFixed(aboutNum, this.market.decimal0)
        // 计算num
        if (!Number(this.price)) {
          this.num = '';
          this.handleSetTradeInfo({})
          return
        }
        let num = aboutNum * 0.997 / this.price;
        this.num = toFixed(num, this.market.decimal1)
      } else {
        this.num = toFixed(bal * value / 100, this.market.decimal1);
        // 计算num
        if (!Number(this.price)) {
          this.aboutNum = '0.0000';
          this.handleSetTradeInfo({})
          return
        }
        let aboutNum = this.num * 0.997 * this.price;
        this.aboutNum = toFixed(aboutNum, this.market.decimal0)
      }

      const minGet = isBuy ? toFixed(this.num, this.market.decimal1) : toFixed(this.aboutNum, this.market.decimal0);
      const info = {
        payNum: isBuy ? this.aboutNum : this.num,
        price: this.price,
        minGet,
        direction: this.direction,
      }
      this.handleSetTradeInfo(info)
    },
    // 溢价订单确认
    handleRegPrice() {
      if (!this.handleReg()) {
        return
      }
      const price = dealPrice(this.market.price || '0.0000')
      if (Number(price)) {
        let rate;
        if (this.direction === 'buy') {
          rate = (Number(this.price) - Number(price)) /  Number(price) * 100;
        } else {
          rate = (Number(price) - Number(this.price)) /  Number(price) * 100;
        }
        if (rate >= 10) {
          this.showPrice = true;
          this.tradeData = {
            price: this.price,
            num: `${this.num} ${this.market.symbol1}`,
            total: `${this.aboutNum} ${this.market.symbol0}`,
            rate: rate.toFixed(2),
            direction: this.direction
          }
          return
        }
      }
      this.handleRegLarge()
    },
    // 大额订单确认
    handleRegLarge() {
      this.handleClose()
      const m0 = this.market
      const params0 = this.direction === 'buy' ? `${m0.contract0}:${m0.symbol0}` : `${m0.contract1}:${m0.symbol1}`
      const params1 = this.direction !== 'buy' ? `${m0.contract0}:${m0.symbol0}` : `${m0.contract1}:${m0.symbol1}`
      const inData = {
        type: this.direction === 'sell' ? 'pay' : 'get'
      }
      const path = SwapRouter.get_paths(params0, params1, inData.type)
      // console.log(path, params0, params1, inData.type)
      const params = [
        path,
        inData.type === 'pay' ? params0 : params1,
      ]
       params.push(accMul(this.num, 10 ** this.market.decimal1))
      if (this.direction !== 'sell') {
        params.push(inData.type)
      }
      try {
        const res = SwapRouter.get_amounts_out(...params)
        const slip = (res.price - res.swapInPrice) / res.price * 100;
        if (slip > 1) {
          this.showBig = true;
          this.tradeData = {
            price: this.price,
            num: `${this.num} ${this.market.symbol1}`,
            total: `${this.aboutNum} ${this.market.symbol0}`,
          }
          return
        }
      } catch (error) {
        console.log(error)
      }
      this.showBig = false;
      this.handleLimitTrade()
    },
    // 交易确认
    handleReg() {
      const isBuy = this.direction === 'buy';
      if (!Number(this.num) || !Number(this.aboutNum)) {
        return false
      }
      if (isBuy) { // 转账 sym0
        if (Number(this.aboutNum) > Number(this.bal0)) {
          this.$message({
            type: 'error',
            message: `${this.market.symbol0}余额不足`,
          })
          return false;
        }
      } else { // 卖出 - 转账sym1
        if (Number(this.num) > Number(this.bal1)) {
          this.$message({
            type: 'error',
            message: `${this.market.symbol1}余额不足`,
          })
          return false;
        }
      }
      return true;
    },
    // 限价交易 
    handleLimitTrade() {
      const isBuy = this.direction === 'buy';
      const decimalPay = isBuy ? this.market.decimal0 : this.market.decimal1;
      const decimalGet = !isBuy ? this.market.decimal0 : this.market.decimal1;
      const coinPay = isBuy ? this.market.symbol0 : this.market.symbol1;

      const minOut = parseInt(this.tradeInfo.minGet * 10 ** decimalGet);
      // const minOut = 0;

      const memoPrice = parseInt(1000000 * this.price)
      const quantity = isBuy ? `${toFixed(this.aboutNum, decimalPay)} ${coinPay}` : `${toFixed(this.num, decimalPay)} ${coinPay}`;

      // "pending:39:1:1" 
      let memo = `pending:${this.market.mid}:${minOut}:${memoPrice}`;
      const params = {
        code: isBuy ? this.market.contract0 : this.market.contract1,
        toAccount: this.baseConfig.pddex,
        quantity,
        memo,
      }
      DApp.transfer(params, (err) => {
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
        this.num = '';
        this.aboutNum = '0.0000';
        this.slider = 0;
        this.handleSetTradeInfo({})
        this.$emit('listenUpdate', true)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import './content.scss';
.limitTrade{
  position: relative;
  .stop{
    text-align: center;
    position: absolute;
    background: rgba(255,255,255, .8);
    top: 0px;
    bottom: 0px;
    left: -20px;
    right: -20px;
    z-index: 10;
  }
}
.popup{
  width: 90%;
  border-radius: 15px;
}
</style>
