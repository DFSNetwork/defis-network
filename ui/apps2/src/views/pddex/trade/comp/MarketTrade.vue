<template>
  <div>
    <!-- 挂单价格 -->
    <div class="price">
      <div class="marketPrice">{{ $t('pddex.tradeTip') }}</div>
    </div>
    <!-- 挂单数量 -->
    <div class="num dinBold">
      <van-cell-group>
        <van-field class="numIpt" type="number" v-model="num"
          :placeholder="$t('pddex.iptNumTip')" 
          @focus="numIptFocus"
          @blur="numIptBlur"
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
    <div class="btnDiv" @click="handleTrade()">
      <van-button class="btn" v-if="direction === 'buy'" type="primary">{{ $t('pddex.buyIn') }}{{ market.symbol1 }}</van-button>
      <van-button class="btn" v-else type="danger">{{ $t('pddex.sellOut') }}{{ market.symbol1 }}</van-button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { SwapRouter, SwapRouterFilter } from '@/utils/swap_router';
import { toFixed, accMul } from '@/utils/public';
import { DApp } from '@/utils/wallet';
export default {
  name: 'marketTrade',
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
      num: '',
      aboutNum: '0.0000',
      slider: 0,
      // change Type
      sliderChange: false,
      // timer
      sliderTimer: null,
      tradeMids: '',
    }
  },
  computed: {
    ...mapState({
      account: state => state.app.account,
      baseConfig: state => state.sys.baseConfig,
      sliderPonit: state => state.app.slipPoint,
      tradeInfo: state => state.sys.tradeInfo,
    }),
  },
  watch: {
    'market.mid': {
      handler: function smid(newVal, oldVal) {
        if (newVal === oldVal) {
          return
        }
        this.num = '';
        this.aboutNum = '0.0000';
        this.slider = 0;
        this.handleSetTradeInfo({})
      },
      deep: true,
      immediate: true,
    },
    direction: {
      handler: function dt() {
        this.handleChangeDirection()
      }
    },
    sliderPonit: {
      handler: function ml() {
        this.handleSetTradeInfo(this.tradeInfo)
      },
      deep: true,
      immediate: true,
    }
  },
  beforeDestroy() {
    this.handleChangeDirection()
    clearTimeout(this.sliderTimer)
  },
  methods: {
    handleChange(num) {
      this.slider = num;
      this.onChange(num)
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

      const sliPitNum = Number(this.sliderPonit);
      let minGet = (dealInfo.payNum || 0) * 0.997 * dealInfo.price * (100 - sliPitNum) / 100;
      const decimalMinGet = this.direction !== 'buy' ? this.market.decimal0 : this.market.decimal1;
      minGet = toFixed(minGet, decimalMinGet)
      dealInfo.minGet = minGet;
      dealInfo.direction = this.direction;
      // console.log(dealInfo, dealInfo.payNum, dealInfo.price, sliPitNum)

      this.$store.dispatch('setTradeInfo', dealInfo)
    },
    handleDealNum(num) {
      if (this.sliderChange) {
        return
      }
      const m0 = this.market
      const params0 = this.direction === 'buy' ? `${m0.contract0}:${m0.symbol0}` : `${m0.contract1}:${m0.symbol1}`
      const params1 = this.direction !== 'buy' ? `${m0.contract0}:${m0.symbol0}` : `${m0.contract1}:${m0.symbol1}`
      const inData = {
        type: this.direction === 'sell' ? 'pay' : 'get'
      }
      let path = SwapRouterFilter.get_paths(params0, params1, inData.type)
      if (!path.length) {
        path = SwapRouter.get_paths(params0, params1, inData.type)
      }
      // console.log(path)
      const params = [
        path,
        inData.type === 'pay' ? params0 : params1,
      ]
      params.push(accMul(num, 10 ** this.market.decimal1))
      if (this.direction !== 'sell') {
        params.push(inData.type)
      }
      try {
        let res = SwapRouterFilter.get_amounts_out(...params)
        if (!res.mid) {
          res = SwapRouter.get_amounts_out(...params)
        }
        let aboutNum = res.amount_in / 10 ** this.market.decimal0;
        this.aboutNum = toFixed(aboutNum, this.market.decimal0);
        this.direction === 'buy' ? res.payNum = this.aboutNum : res.payNum = num
        this.tradeMids = inData.type === 'pay' ? res.mid : res.mid.split('-').reverse().join('-');
        this.handleSetTradeInfo(res)
      } catch (error) {
        this.aboutNum = 0
        this.handleSetTradeInfo({})
      }
      this.handleDealSlider()
    },
    // 输入框改变 -> 处理滑动条
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
      const bal = this.direction === 'buy' ? this.bal0 : this.bal1;
      const dealNum = value / 100 * bal;
      if (this.direction === 'buy') {
        this.aboutNum = dealNum.toFixed(4)
      } else {
        this.num = dealNum.toFixed(4)
      }
      this.handleGetOtherNum();
    },
    handleGetOtherNum() {
      const isBuy = this.direction === 'buy';
      const pay = isBuy ? this.aboutNum : this.num;
      const decimal = isBuy ? this.market.decimal0 : this.market.decimal1;
      const getDecimal = isBuy ? this.market.decimal1 : this.market.decimal0;
      const m0 = this.market
      const params0 = isBuy ? `${m0.contract0}:${m0.symbol0}` : `${m0.contract1}:${m0.symbol1}`;
      const params1 = isBuy ? `${m0.contract1}:${m0.symbol1}` : `${m0.contract0}:${m0.symbol0}`;
      const inData = {
        type: 'pay'
      }
      let path = SwapRouterFilter.get_paths(params0, params1, inData.type)
      if (!path.length) {
        path = SwapRouter.get_paths(params0, params1, inData.type)
      }
      const params = [
        path,
        inData.type === 'pay' ? params0 : params1,
      ]
      params.push(accMul(pay, 10 ** decimal))
      try {
        let res = SwapRouterFilter.get_amounts_out(...params)
        if (!res.mid) {
          res = SwapRouter.get_amounts_out(...params)
        }
        isBuy ? this.num = toFixed(parseFloat(res.quantity_out), getDecimal)
              : this.aboutNum = toFixed(parseFloat(res.quantity_out), getDecimal)
        res.payNum = pay;
        res.direction = this.direction;
        this.tradeMids = inData.type === 'pay' ? res.mid : res.mid.split('-').reverse().join('-');
        this.handleSetTradeInfo(res)
      } catch (error) {
        console.log(error)
        this.handleSetTradeInfo({})
      }
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
    // 交易
    handleTrade() {
      if (!this.handleReg()) {
        return
      }

      const isBuy = this.direction === 'buy';
      const decimal = isBuy ? this.market.decimal0 : this.market.decimal1;
      const decimalSell = !isBuy ? this.market.decimal0 : this.market.decimal1;
      const coin = isBuy ? this.market.symbol0 : this.market.symbol1;
      const num = isBuy ? toFixed(this.aboutNum, decimal) : toFixed(this.num, decimal)

      const minOut = parseInt(this.tradeInfo.minGet * 10 ** decimalSell);

      // const hasPid = !!this.market.pid;
      // const id = hasPid ? this.market.pid : this.market.mid;
      const hasPid = false;
      const id = this.tradeMids;
      let memo = `swap:${id}:${minOut}`;
      hasPid ? memo : memo = `${memo}:2`
      const params = {
        code: isBuy ? this.market.contract0 : this.market.contract1,
        toAccount: hasPid ? this.baseConfig.pddex : this.baseConfig.swap,
        quantity: `${num} ${coin}`,
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
      })
    },
  }
}
</script>

<style lang="scss" scoped>
@import './content.scss';
</style>
