<template>
  <div class="marketList">
    <div class="header">
      <span v-if="$route.name === 'fundation' || $route.name === 'createPool'">选择币种</span>
      <span v-else>{{ $t('pools.chooseMarket') }}</span>
      <span>
        <img class="closeSvg" @click="handleClose" src="https://cdn.jsdelivr.net/gh/defis-net/material/svg/sd_icon_btn.svg" alt="">
      </span>
    </div>
    <div class="iptSearch">
      <el-input v-model="search" clearable :placeholder="`${$t('pools.searchMarket')}..`"></el-input>
    </div>
    <div class="scroll" v-if="type === 'other' || type === 'kline'">
      <template v-for="(item, i) in searchArr">
        <div class="item flexb" :key="i" @click="handleSelectThis(item)">
          <div class="symbolInfo flexb">
            <div class="flexa">
              <img class="coinImg" :onerror="errorCoinImg" :src="item.sym0Data.imgUrl" alt="">
              <div>
                <div class="flexa">
                  <span>{{item.symbol0}}</span>
                </div>
                <div class="tip">{{item.contract0}}</div>
              </div>
            </div>
            <img class="addImg" src="https://cdn.jsdelivr.net/gh/defis-net/material/svg/add.svg">
            <div class="flexa">
              <img class="coinImg" :onerror="errorCoinImg" :src="item.sym1Data.imgUrl">
              <div>
                <div class="flexa">
                  <span>{{item.symbol1}}</span>
                </div>
                <div class="tip">{{item.contract1}}</div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <div v-if="!search && type === 'other'" class="searchMore flexc">更多代币请搜索查询</div>
    </div>
    <div class="scroll" v-else>
      <template v-for="(item, i) in searchArr">
        <div class="item flexb" @click="handleSelectThis(item)" v-if="handleShow(item)" :key="i">
          <div class="left flex">
            <img class="coinImg" :src="item.imgUrl" :onerror="errorCoinImg" alt="">
            <div>
              <div class="coin">{{ item.symbol }}</div>
              <div class="contract tip">{{ item.contract }}</div>
            </div>
          </div>
          <div class="balan">{{ item.balan }}</div>
        </div>
      </template>
      <!-- <div v-if="!search" class="searchMore flexc">更多代币请搜索查询</div> -->
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import {dealSymArr} from '@/utils/public';
export default {
  data() {
    return {
      search: '',
      searchArr: [],
      coinList: [],
      filterCoinList: [],
      errorCoinImg: 'this.src="https://ndi.340wan.com/eos/eosio.token-eos.png"',
    }
  },
  props: {
    marketLists: {
      type: Array,
      default: function market() {
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
  computed: {
    ...mapState({
      filterMkLists: state => state.sys.filterMkLists,
      accFollow: state => state.app.accFollow,
    }),
  },
  watch: {
    marketLists: {
      handler: function mlt(newVal, oldVal) {
        if (!newVal.length || (oldVal && oldVal.length === newVal.length)) {
          return;
        }
        console.log(this.type)
        // 筛选出所有币种
        this.coinList = [];
        this.filterCoinList = [];
        if (this.type === 'kline') {
          this.searchArr = this.marketLists;
        } else if (this.type === 'pools') {
          const arr = dealSymArr(newVal)
          arr.shift()
          this.coinList = arr;
          this.filterCoinList = arr;
        } else if (this.type !== 'other') {
          const arr = dealSymArr(newVal)
          this.coinList = arr;
          const arr2 = dealSymArr(this.filterMkLists)
          this.filterCoinList = arr2;
        } else {
          this.searchArr = this.filterMkLists;
        }
        this.handleSearch();
      },
      deep: true,
      immediate: true
    },
    search() {
      this.handleSearch();
    }
  },
  mounted() {
    console.log(this.type)
  },
  methods: {
    handleToCreate() {
      this.$router.push({name: 'createMarket'})
    },
    handleSearch() {
      const search = this.search.toUpperCase();
      if (this.type === 'kline') {
        const searchArr = this.marketLists.filter(v => v.symbol0.indexOf(search) !== -1 || v.symbol1.indexOf(search) !== -1)
        this.searchArr = searchArr;
        return
      }
      if (this.type === 'other') {
        if (!search) {
          this.searchArr = this.handleDealFGollow(this.filterMkLists);
          return
        }
        const searchArr = this.marketLists.filter(v => v.symbol0.indexOf(search) !== -1 || v.symbol1.indexOf(search) !== -1)
        this.searchArr = this.handleDealFGollow(searchArr);
        return
      }
      if (!search) {
        this.searchArr = this.filterCoinList;
        return
      }
      const searchArr = this.coinList.filter(v => v.symbol.indexOf(search) !== -1)
      this.searchArr = searchArr;
    },
    handleDealFGollow(arr) {
      const follow = [];
      const other = [];
      arr.forEach(v => {
        const isFollow = this.accFollow.find(vv => vv.mid === v.mid);
        if (isFollow) {
          follow.push(v)
          return
        }
        other.push(v)
      });
      return [...follow, ...other]
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
    font-size: 38px;
    margin-bottom: 42px;
    padding: 40px 40px 0;
    text-align: center;
    position: relative;
    font-weight: 500;
    color: #333333;
    .closeSvg{
      width: 24px;
      position: absolute;
      right: 40px;
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
    .searchMore{
      height: 115px;
      text-align: center;
      color: #999;
    }
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
  .symbolInfo{
    width: 100%;
    height: 150px;
    padding: 42px 14px;
    box-sizing: border-box;
    border-radius: 12px;
    &>div{
      flex: 3;
    }
    .addImg{
      margin: 0 46px 0 36px;
      width: 28px;
    }
    .coinImg{
      height: 60px;
      width: 60px;
      margin-right: 10px;
      border-radius: 60px;
      overflow: hidden;
      display: flex;
    }
    .tip{
      font-size: 24px;
      margin-top: -5px;
    }
  }
}
</style>
