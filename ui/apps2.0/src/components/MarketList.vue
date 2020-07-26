<template>
  <div class="marketList">
    <div class="header flexb">
      <span>选择市场</span>
      <img class="closeSvg" @click="handleClose" src="@/assets/img/dialog/sd_icon_btn.svg" alt="">
    </div>
    <div class="iptSearch">
      <el-input v-model="search" placeholder="搜索市场名称.."></el-input>
    </div>
    <div class="scroll">
      <template v-for="(item, i) in coinList">
        <div class="item flexb" @click="handleSelectThis(item)" v-if="handleShow(item)" :key="i">
          <div class="left flex">
            <img class="coinImg" :src="item.imgUrl || errUrl" :onerror="errorCoinImg" alt="">
            <div>
              <div class="coin">{{ item.symbol }}</div>
              <div class="contract tip">{{ item.contract }}</div>
            </div>
          </div>
          <div class="balan">{{ item.balan }}</div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import errUrl from '@/assets/img/eosio.token-eos.png'
export default {
  data() {
    return {
      search: '',
      coinList: [],
      errUrl,
      errorCoinImg: 'this.src="https://ndi.340wan.com/eos/eosio.token-eos.png"',
    }
  },
  props: {
    marketLists: {
      type: Array,
      defailt: function ml() {
        return []
      }
    },
    thisMarket0: {
      type: Object,
      default: function market() {
        return {}
      }
    },
    thisMarket1: {
      type: Object,
      default: function market() {
        return {}
      }
    },
    type: {
      type: String,
      default: 'other'
    }
  },
  watch: {
    marketLists: {
      handler: function mlt(newVal) {
        // 筛选出所有币种
        this.coinList = [];
        if (newVal.length > 0) {
          const arr = this.handleDealSymArr(newVal)
          this.coinList = arr;
        }
        console.log(this.coinList)
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    console.log(this.marketLists)
    console.log(this.thisMarket0)
    console.log(this.type)
  },
  methods: {
    handleShow(item) {
      const type = this.type;
      if (type === 'start') {
        return !(item.contract === this.thisMarket1.contract && item.symbol === this.thisMarket1.symbol)
      }
      return !(item.contract === this.thisMarket0.contract && item.symbol === this.thisMarket0.symbol)
    },
    handleClose() {
      this.$emit('listenClose', false)
    },
    handleDealSymArr(lists = []) {
      const resArr = [];
      lists.forEach((v) => {
        const imgUrl0 = `https://ndi.340wan.com/eos/${v.sym0Data.contract}-${v.sym0Data.symbol.toLowerCase()}.png`;
        v.sym0Data.imgUrl = imgUrl0;
        const imgUrl1 = `https://ndi.340wan.com/eos/${v.sym1Data.contract}-${v.sym1Data.symbol.toLowerCase()}.png`;
        v.sym1Data.imgUrl = imgUrl1;
        resArr.push(v.sym0Data, v.sym1Data)
      })
      // 删除重复项
      const newArr = resArr.filter((item, index, self) => {
        const i = self.findIndex(v => v.contract === item.contract && v.symbol === item.symbol);
        return self.indexOf(item) === i;
      })
      return newArr
    },
    // 选择当前市场
    handleSelectThis(item) {
      this.$emit('listenMarketChange', item, this.type)
    },
  },
}
</script>

<style lang="scss" scoped>
.marketList{
  // padding: 40px;
  font-size: 30px;
  box-sizing: border-box;
  .header{
    font-size: 32px;
    margin-bottom: 42px;
    padding: 40px 40px 0;
    .closeSvg{
      width: 24px;
    }
  }
  .iptSearch{
    padding: 0 40px;
    /deep/ .el-input__inner{
      font-size: 28px;
      height: 88px;
      border: 0px;
      background:rgba(250,250,250,1);
      border-radius:20px;
      outline: none;
      padding-left: 28px;
    }
  }
  .scroll{
    overflow: auto;
    height: 600px;
    margin-top: 10px;
    padding: 0px 40px;
    .item{
      color: $color-black;
      height: 115px;
      border-bottom: 1px solid #F3F3F3;
      &:last-child{
        border-bottom: 0px solid #F3F3F3;
      }
      .left{
        text-align: left;
        .coinImg{
          width: 60px;
          height: 60px;
          border-radius: 30px;
          margin-right: 20px;
        }
        // .coin{
        //   line-height: 28px;
        // }
        .contract{
          font-size: 24px;
          font-weight: 300;
        }
      }
    }
  }
}
</style>
