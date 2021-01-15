<template>
  <div class="order">
    <div class="title flexb tip">
      <span>
        <span class="green">买</span>
        <span>数量({{ checkedMarket.symbol1 }})</span>
      </span>
      <span>价格({{ checkedMarket.symbol0 }})</span>
      <span>
        <span>数量({{ checkedMarket.symbol1 }})</span>
        <span class="red">卖</span>
      </span>
    </div>
    <div class="flexs">
      <!-- 买单列表 -->
      <div class="buy">
        <div class="list flexb" v-for="(item, i) in arrBuy" :key="`buy_${i}`">
          <span>{{ item.num }}</span>
          <span class="mr10 green">{{ item.tPrice }}</span>
          <div class="bg" :style="`width: ${handleGetBgWidth(item)}`"></div>
        </div>
      </div>
      <!-- 卖单列表 -->
      <div class="sell">
        <div class="list flexb" v-for="(item, i) in arrSell" :key="`sell_${i}`">
          <span class="ml10 red">{{ item.tPrice }}</span>
          <span>{{ item.num }}</span>
          <div class="bg" :style="`width: ${handleGetBgWidth(item)}`"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { accAdd, accDiv, accMul, dealPrice } from '@/utils/public';
export default {
  name: 'currentOrders',
  props: {
    checkedMarket: {
      type: Object,
      default: function cmt(){
        return {}
      }
    },
  },
  data() {
    return {
      allOrders: [], // 全部订单
      pidOrders: [], // 当前PID的订单
      arrBuy: [],
      arrSell: [],
      buyCount: 0,
      sellCount: 0,
    }
  },
  mounted() {
    this.handleGetOrderList()
  },
  watch: {
    checkedMarket: {
      handler: function cm(newVal, oldVal) {
        if (!oldVal || newVal.mid === oldVal.mid) {
          return;
        }
        this.handleGetPidOrder()
      },
      deep: true,
      immediate: false
    }
  },
  methods: {
    // 获取支持box的交易对id
    async handleGetOrderList() {
      const {status, result} = await this.$api.boxMidsAndOrder();
      if (!status) {
        return
      }
      this.allOrders = result.orders || [];
      this.handleGetPidOrder()
    },
    handleGetBgWidth(item) {
      const all = item.code === this.checkedMarket.contract0 ? this.buyCount : this.sellCount;
      let width = accDiv(item.num, all)
      width = width * 100;
      return `${width}%`
    },
    handleGetPidOrder() {
      if (!this.checkedMarket.pid || !this.allOrders.length) {
        return
      }
      let arrBuy = [];
      let arrSell = [];
      let buyCount = 0;
      let sellCount = 0;
      this.allOrders.forEach(v => {
        if (v.pid !== this.checkedMarket.pid) {
          return
        }
        const tPrice = accDiv(v.price, 1000000);
        this.$set(v, 'tPrice', dealPrice(tPrice))
        if (v.code === this.checkedMarket.contract0) {
          let num = accDiv(parseFloat(v.quantity), parseFloat(tPrice))
          num = accMul(num, 0.997)
          num = num.toFixed(this.checkedMarket.decimal1)
          this.$set(v, 'num', num)
          buyCount = accAdd(buyCount, num)
          arrBuy.push(v)
          return
        }
        let num = parseFloat(v.quantity)
        num = num.toFixed(this.checkedMarket.decimal1)
        this.$set(v, 'num', num)
        sellCount = accAdd(sellCount, num)
        arrSell.push(v)
      })
      arrBuy.sort((a, b) => {
        return b.price - a.price
      })
      arrSell.sort((a, b) => {
        return a.price - b.price
      })
      this.arrBuy = arrBuy;
      this.arrSell = arrSell;
      this.buyCount = buyCount;
      this.sellCount = sellCount;
    }
  }
}
</script>

<style lang="scss" scoped>
.green{
  color: #00be66;
}
.red{
  color: #ea573c;
}
.order{
  font-size: 26px;
  padding: 0 20px;
  .buy,.sell{
    flex: 1;
  }
  .sell{
    .list>.bg{
      right: none;
      left: 0px;
      background: rgba(#ea573c, .1);
    }
  }
  .list{
    height: 60px;
    position: relative;
    color: #000;
    font-weight: 500;
    .mr10{
      margin-right: 10px;
    }
    .ml10{
      margin-left: 10px;
    }
    .bg{
      position: absolute;
      right: 0px;
      height: 80%;
      background: rgba(#00be66, .1);
      border-radius: 2px;
    }
  }
}
</style>
