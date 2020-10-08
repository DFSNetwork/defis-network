<template>
  <div class="largeTrade">
    <div class="headInfo flexb">
      <div class="coinInfo flexa">
        <img class="coinImg" :src="checkedMarket.sym1Data.imgUrl" alt="">
        <div>
          <div class="coin flexa">
            <span>{{ checkedMarket.symbol1 }}/{{ checkedMarket.symbol0 }}</span>
            <img class="downCoin" src="@/assets/img/dex/down.svg">
          </div>
          <div class="contract tip">{{ checkedMarket.contract1 }}</div>
        </div>
      </div>
      <img class="filterCoin" src="@/assets/img/market/filter.svg" alt="">
    </div>

    <!-- 交易数据 -->
    <div class="poolsInfo flexb">
      <div class="priceDiv">
        <div class="price">{{ price }}</div>
        <div class="tip">当前价格</div>
      </div>
      <div class="data">
        <div class="deep" @click="showEosCount = !showEosCount">
          <span v-if="showEosCount">{{allEos}} {{ checkedMarket.symbol0 }}</span>
          <span v-else>{{allAnother}} {{ checkedMarket.symbol1 }}</span>
        </div>
        <div class="tip">总资产</div>
      </div>
    </div>
  </div>
</template>

<script>
import { accMul } from '@/utils/public';
export default {
  name: 'largeTrade',
  data() {
    return {
      mLists: [39, 329],
      checkLists: [],
      showEosCount: false,
      checkedMarket: {
        sym1Data: {},
      },
    }
  },
  props: {
    marketLists: {
      type: Array,
      default: function ml() {
        return {}
      }
    },
  },
  computed: {
    price() {
      const price = parseFloat(this.checkedMarket.reserve1) / parseFloat(this.checkedMarket.reserve0);
      return (price||0).toFixed(6);
    },
    allEos() {
      const eos = parseFloat(this.checkedMarket.reserve0)
      return accMul(eos, 2)
    },
    allAnother() {
      const eos = parseFloat(this.checkedMarket.reserve1)
      return accMul(eos, 2)
    }
  },
  watch: {
    marketLists: {
      handler: function ml(newVal) {
        if (!newVal.length) {
          return
        }
        const arr = [];
        this.mLists.forEach((v) => {
          const item = this.marketLists.find(vv => vv.mid == v);
          arr.push(item)
        });
        this.checkLists = arr;
        this.checkedMarket = arr[0];
        console.log(arr)
      },
      deep: true,
      immediate: true,
    }
  },
}
</script>

<style lang="scss" scoped>
.largeTrade{
  font-size: 30px;
  background: #f3f3f3;
  min-height: 100vh;
  .headInfo{
    color: #000;
    text-align: left;
    padding: 20px 30px 10px;
    background: #FFF;
    margin-bottom: 3px;
    .coinImg{
      width: 80px;
    }
    .coin{
      font-size: 36px;
      font-weight: 500;
      .downCoin{
        width: 30px;
        margin-left: 8px;;
      }
    }
    .contract{
      font-size: 27px;
    }
    .filterCoin{
      width: 60px;
    }
  }
  .poolsInfo{
    font-size: 24px;
    padding: 10px 30px 20px;
    background: #FFF;
    .priceDiv{
      text-align: left;
      .price{
        font-size: 45px;
        font-weight: 500;
      }
    }
    .data{
      text-align: right;
      .deep{
        font-size: 33px;
      }
    }
  }
}
</style>
