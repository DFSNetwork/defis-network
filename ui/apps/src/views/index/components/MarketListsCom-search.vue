<template>
  <div class="selectMarket">
    <!-- 选择市场 -->
    <el-form ref="formBorrow" v-if="show">
      <el-form-item style="margin-bottom: 0">
        <div class="selectDiv" @click="handleShowDrawer()">
          <span>{{ thisMarket.symbol0 }} / {{ thisMarket.symbol1 }}</span>
          <span class="iconfont icon-huaban29 select"></span>
        </div>
      </el-form-item>
    </el-form>

    <el-drawer
      class="drawerModel"
      :visible.sync="drawer"
      :with-header="false"
      direction="btt">
      <div class="drawer" ref="drawer">
        <span class="iconfont icon-huaban7 closeIcon" @click="drawer = false"></span>
        <div class="title">
          <span>{{ $t('pools.chooseMarket') }}</span>
          <span class="close">
            <el-input v-if="showSearch" ref="iptCls" v-model="search"
              class="iptCls"
              placeholder="EOS" type="text"></el-input>
            <span @click="showSearch = !showSearch" class="iconfont icon-sousuo search"></span>
          </span>
        </div>
        <!-- <div class="searchDiv">放搜索框</div> -->
        <div class="lists" v-if="type === 'other'">
          <div class="list" v-for="(item, index) in marketLists" :key="index">
            <div @click="handleSelectThis(item)">
              <div>
                <div class="symbol">{{ item.symbol0 }} / {{ item.symbol1 }}</div>
                <div class="contract">{{ item.contract0 }} / {{ item.contract1 }}</div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="lists">
          <template v-for="(item, index) in coinList">
            <div class="list" v-if="handleShow(item)" :key="index">
              <div @click="handleSelectThis(item)">
                <div class="">
                  <img :src="item.imgUrl || errUrl" :onerror="errorCoinImg" alt="">
                </div>
                <div>
                  <div class="symbol">{{ item.symbol }}</div>
                  <div class="contract">{{ item.contract }}</div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import errUrl from '@/assets/img/eosio.token-eos.png'
export default {
  name: 'marketListsCom',
  data() {
    return {
      search: '',
      showSearch: false,
      drawer: false,
      type: 'other',
      coinList: [],
      coinListSearch: [],
      marketListsSearch: [],
      errUrl,
      errorCoinImg: 'this.src="https://ndi.340wan.com/eos/eosio.token-eos.png"',
    }
  },
  watch: {
    marketLists: {
      handler: function marketLists(newVal) {
        // 筛选出所有币种
        this.coinList = [];
        if (newVal.length > 0) {
          const arr = this.handleDealSymArr(newVal)
          this.coinList = arr;
        }
      },
      immediate: true
    }
  },
  props: {
    thisMarket: {
      type: Object,
      default: function market() {
        return {}
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
    marketLists: {
      type: Array,
      default: function lists() {
        return []
      }
    },
    show: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    handleSearch() {
      if (this.type === 'other') { // search marketLists

      } else { //search coinList

      }
    },
    handleShow(item) {
      const type = this.type;
      if (type === 'start') {
        return !(item.contract === this.thisMarket1.contract && item.symbol === this.thisMarket1.symbol)
      }
      return !(item.contract === this.thisMarket0.contract && item.symbol === this.thisMarket0.symbol)
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
    handleShowDrawer(type) {
      this.drawer = true;
      this.type = type || 'other';
      this.$refs.drawer.blur();
      this.$refs.iptCls.blur();
      // setTimeout(() => {
      //   this.$refs.iptCls.blur();
      // }, 0);
    },
    // 选择当前市场
    handleSelectThis(item) {
      this.$emit('listenMarketChange', item, this.type)
      this.drawer = false;
    },
  },
}
</script>

<style lang="scss" scoped>
.selectMarket{
  .selectDiv{
    // border: 1px solid #DCDFE6;
    border-radius: 5px;
    position: relative;
    color: #333;
    font-size: 20px;
    font-weight: bold;
    .select{
      position: absolute;
      transform: rotate(90deg);
      font-size: 14px;
      color: #999;
      margin-left: 10px;
    }
  }
}
.drawerModel{
  /deep/ .el-drawer{
    height: auto !important;
    overflow: visible;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    outline: none;
  }
  .drawer{
    padding: 0 18px;
    position: relative;
    .closeIcon{
      position: absolute;
      font-size: 14px;
      top: -40px;right: 20px;
      color: rgba(#fff, .8);
    }
    .iptCls{
      width: 50px;
    }
    .search{
      font-size: 16px;
    }
    .title{
      margin-top: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 40px;
      font-weight: 500;
    }
    .lists{
      max-height: 300px;
      overflow: auto;
    }
    .list{
      height: 60px;
      display: flex;
      align-items: center;
      text-align: left;
      // justify-content: center;
      border-bottom: 1px solid #ebeef5;
      box-sizing: border-box;
      &>div{
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        img{
          width: 40px;
          margin-right: 8px;
        }
      }
      .symbol{
        font-weight: 500;
      }
      .contract{
        color: #999;
        font-size: 14px;
      }
    }
  }
}
</style>
