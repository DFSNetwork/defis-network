<template>
  <div class="marketList">
    <div class="header flexb">
      <span>{{ $t('pools.chooseMarket') }}</span>
      <span>
        <span class="create" v-if="$route.name === 'market'" @click="handleToCreate">{{ $t('dex.addMarket') }}</span>
        <img class="closeSvg" @click="handleClose" src="@/assets/img/dialog/sd_icon_btn.svg" alt="">
      </span>
    </div>
    <div class="iptSearch" :class="{'other': type === 'other'}">
      <el-input v-model="search" clearable :placeholder="`${$t('pools.searchMarket')}..`"></el-input>
    </div>
    <div class="scroll" v-if="type === 'other'">
      <template v-for="(item, i) in searchArr">
        <div class="item flexb" :key="i" @click="handleSelectThis(item)">
          <div>
            <div class="coin">{{item.symbol0}} / {{item.symbol1}}</div>
            <div class="contract tip">{{item.contract0}} / {{item.contract1}}</div>
          </div>
        </div>
      </template>
    </div>
    <div class="scroll" v-else-if="type === 'bankStart' || type === 'bankEnd'">
      <template v-for="(item, i) in searchArr">
        <div class="item flexb" @click="handleSelectThis(item)" v-if="handleShowBank(item)" :key="i">
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
    <div class="scroll" v-else>
      <template v-for="(item, i) in searchArr">
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
      searchArr: [],
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
        if (!newVal.length) {
          return;
        }
        // 筛选出所有币种
        this.coinList = [];
        if (this.type === 'bankStart' || this.type === 'bankEnd') {
          this.coinList = newVal;
        } else if (this.type !== 'other') {
          const arr = this.handleDealSymArr(newVal)
          this.coinList = arr;
        } else {
          this.searchArr = newVal;
        }
        this.handleSearch();
        // console.log(this.coinList)
      },
      deep: true,
      immediate: true
    },
    search() {
      this.handleSearch();
    }
  },
  mounted() {
    // console.log(this.marketLists)
    // console.log(this.thisMarket0)
    // console.log(this.type)
  },
  methods: {
    handleToCreate() {
      this.$router.push({name: 'createMarket'})
    },
    handleSearch() {
      const search = this.search.toUpperCase();
      if (this.type === 'other') {
        const searchArr = this.marketLists.filter(v => v.symbol0.indexOf(search) !== -1 || v.symbol1.indexOf(search) !== -1)
        this.searchArr = searchArr;
        return
      }
      const searchArr = this.coinList.filter(v => v.symbol.indexOf(search) !== -1)
      this.searchArr = searchArr;
    },
    handleShowBank(item) {
      const type = this.type;
      if (type === 'bankEnd') {
        return !(item.contract === 'eosio.token' && item.symbol === 'EOS')
      }
      return true
    },
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
        // const imgUrl0 = `https://ndi.340wan.com/eos/${v.sym0Data.contract}-${v.sym0Data.symbol.toLowerCase()}.png`;
        // v.sym0Data.imgUrl = imgUrl0;
        // const imgUrl1 = `https://ndi.340wan.com/eos/${v.sym1Data.contract}-${v.sym1Data.symbol.toLowerCase()}.png`;
        // v.sym1Data.imgUrl = imgUrl1;
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
  text-align: left;
  font-size: 30px;
  box-sizing: border-box;
  .header{
    font-size: 32px;
    margin-bottom: 42px;
    padding: 40px 40px 0;
    .closeSvg{
      width: 24px;
    }
    .create{
      font-size: 26px;
      margin-right: 30px;
      height: 80px;
      min-width: 80px;
      background: $color-bgcolor;
      border-radius: 30px;
      box-shadow: 0px 20px 40px 0px rgba(220,220,220,0.5);
      box-sizing: border-box;
      padding: 12px 24px;
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
    &.other{
      /deep/ .el-input__inner{
        background:#fff;
        border: 1px solid #000;
      }
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
