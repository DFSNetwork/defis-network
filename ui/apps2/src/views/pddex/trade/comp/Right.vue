<template>
  <div class="tradeRight">
    <div class="tools flexb tip">
      <span class="flexa">
        <span>{{ $t('pddex.price') }}</span>
        <span class="deepNum" @click="deepMerge = true">{{ $t('pddex.price') }}{{ mergeNum * 100 }}%</span>
      </span>
      <span>{{ $t('more.num') }}</span>
    </div>
    <div class="sellOrder dinReg">
      <template v-if="sellArr.length < 6">
        <div class="flexb list red" v-for="i in 6" :key="`null-${i}`">
          <span class="bgLeng"></span>
          <span>—</span>
          <span>—</span>
        </div>
      </template>
      <div class="flexb list red" v-for="(v, i) in sellArr" :key="`sell-${i}`"
        @click="handleClickPrice(v)">
        <span class="bgLeng" :style="`width: ${v.rate}%`"></span>
        <span>{{v.price}}</span>
        <span>{{ v.num }}</span>
      </div>
    </div>
    <div class="currentPrice flexa dinBold">{{ market.price || '-.----' }}</div>
    <div class="buyOrder dinReg">
      <div class="flexb list green" v-for="(v, i) in buyArr" :key="`buy-${i}`"
        @click="handleClickPrice(v)">
        <span class="bgLeng" :style="`width: ${v.rate}%`"></span>
        <span>{{v.price}}</span>
        <span>{{ v.num }}</span>
      </div>
      <template v-if="buyArr.length < 6">
        <div class="flexb list red" v-for="i in 6" :key="`null-buy-${i}`">
          <span class="bgLeng"></span>
          <span>—</span>
          <span>—</span>
        </div>
      </template>
    </div>

    <van-popup v-model="deepMerge" position="bottom" @click="deepMerge = false">
      <div class="deepList">
        <div class="deepMerge" @click="handleChangeDeep(0.001)">0.1%</div>
        <div class="deepMerge" @click="handleChangeDeep(0.01)">1%</div>
        <div class="deepMerge" @click="handleChangeDeep(0.05)">5%</div>
        <div class="deepMerge" @click="handleChangeDeep(0.1)">10%</div>
        <div class="deepMerge" @click="handleChangeDeep(0.25)">25%</div>
        <div class="deepMerge" @click="handleChangeDeep(0.5)">50%</div>
        <div class="deepMerge" @click="handleChangeDeep(1)">100%</div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import Bus from '@/utils/bus';
import { mapState } from 'vuex';
import {runPrice} from '@/utils/deal.js'
export default {
  name: 'tradeRight',
  props: {
    market: {
      type: Object,
      defailt: function ml() {
        return {}
      }
    },
  },
  data() {
    return {
      buyArr: [],
      sellArr: [],
      deepMerge: false,
      mergeNum: 0.01,
    }
  },
  computed: {
    ...mapState({
      account: state => state.app.account,
    }),
  },
  watch: {
    market: {
      handler: function mt(newVal) {
        if (!parseFloat(newVal.reserve0)) {
          return
        }
        this.handlerGetArr()
      },
      immediate: true,
      deep: true,
    }
  },
  mounted() {
  },
  methods: {
    handleClickPrice(item) {
      item.random = Math.random();
      Bus.$emit('clickPrice', item);
    },
    handlerGetArr() {
      let obj = runPrice(this.market, this.market.price, this.mergeNum)
      let sellArr = obj.sellArr || [];
      if (sellArr.length > 100) {
        sellArr = sellArr.slice(0, 50)
      }
      sellArr = this.handlerDealArr(sellArr)
      sellArr = sellArr.reverse()
      this.sellArr = sellArr;

      let buyArr = obj.buyArr || [];
      if (buyArr.length > 100) {
        buyArr = buyArr.slice(0, 50)
      }
      buyArr = this.handlerDealArr(buyArr)
      this.buyArr = buyArr;
      setTimeout(() => {
        if (document.getElementsByClassName('sellOrder').length > 0) {
          document.getElementsByClassName('sellOrder')[0].scrollTop = 10000;
        }
      }, 200);
    },
    handleChangeDeep(num) {
      this.mergeNum = num || 0.001;
      this.handlerGetArr()
    },
    handlerDealArr(arr) {
      // console.log(' ------------- ')
      let count = arr[arr.length - 1].y;
      // console.log(count)
      const decimal = Number(this.market.decimal1)
      arr.forEach((v, index) => {
        let num = v.y
        if (index !== 0) {
          num = Number(v.y || 0) - Number(arr[index - 1].y || 0);
        }
        const rate = num / count * 100;
        const newNum = this.handleDealBigNum(num, decimal)
        this.$set(v, 'rate', rate)
        this.$set(v, 'num', newNum)
      })
      return arr
    },
    handleDealBigNum(num, decimal) {
      if (Number(num) >= 1000) {
        const t = num / 1000
        return `${t.toFixed(2)}K`
      }
      return Number(num).toFixed(decimal);
    }
  }
}
</script>

<style lang="scss" scoped>
.tradeRight{
  width: 40%;
  max-width: 40%;
  color: #000;
  margin-left: 15px;
  margin-top: 10px;
  box-sizing: border-box;
  font-size: 22px;
  // .tools{
  //   padding: 0 15px;
  // }
  .deepNum{
    border: 1px solid #eee;
    padding: 4px 12px;
    margin-left: 10px;
    border-radius: 8px;
  }

  .buyOrder,
  .sellOrder{
    padding: 0 15px 0 0;
    height: 270px;
    overflow: auto;
    .list{
      position: relative;
      height: 45px;
      .bgLeng{
        position: absolute;
        width: 60%;
        height: 100%;
        right: -15px;
        background: rgba(#FE3B37, .1);
      }
    }
  }
  .buyOrder{
    .bgLeng{
      background: rgba(#29D4B0, .1) !important;
    }
  }
  .currentPrice{
    font-weight: 500;
    font-size: 26px;
    height: 60px;
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
  }
  .red{
    color: #FE3B37;
  }
  .green{
    color: #29D4B0;
  }
}
.deepList{
  background: #FFF;
  padding-bottom: 50px;
  .deepMerge{
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
