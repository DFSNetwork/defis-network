<template>
  <div class="marketLists" :class="{'page': $route.name === 'myMarketList'}">
    <div class="title flexb" v-if="$route.name === 'myMarketList'">
      <span class="act">{{ $t('market.myMarkets') }}</span>
      <span class="green_p mkhis" @click="handleTo('MarketHis')">{{ $t('more.mkHis') }}></span>
    </div>
    <div>
      <div class="noData" v-loading="loading" v-if="!dealLists.length">{{ $t('public.noData') }}</div>
      <div v-for="(item, index) in dealLists" :key="index">
        <MarketData v-if="item.mid !== thisMarket.mid"
          :thisMarket="item" :token="item.token" :capital="item.capital" :isList="true"
          :startTime="item.startTime"
          @listenToMarket="handleToMarket"
          @listenShowRemove="handleShowRemove"
          @listenShowAdd="handleShowAdd"/>
      </div>
    </div>

    <!-- 加入做市 -->
    <el-dialog
      class="mkListDia"
      :show-close="false"
      :visible.sync="showAdd">
      <AddMarket v-if="showAdd"
        :thisMarket="menageMarket"
        @listenClose="handleClose"/>
    </el-dialog>
    <!-- 取回做市 -->
    <el-dialog
      class="mkListDia"
      :show-close="false"
      :visible.sync="showRemove">
      <Withdraw v-if="showRemove"
        :thisMarket="menageMarket"
        @listenClose="handleClose"/>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment';
import { mapState } from 'vuex';
import { EosModel } from '@/utils/eos';
import { toFixed, accDiv } from '@/utils/public';
import { sellToken } from '@/utils/logic';
import MarketData from './MarketData';
import AddMarket from '../popup/AddMarket'
import Withdraw from './Withdraw'
export default {
  components: {
    MarketData,
    AddMarket,
    Withdraw,
  },
  props: {
    thisMarket: {
      type: Object,
      default: function tmt() {
        return {}
      }
    },
  },
  data() {
    return {
      loading: true,
      getToken: false,
      getCapital: false,
      showAdd: false,
      showRemove: false,
      lists: [],
      menageMarket: {}
    }
  },
  watch: {
    marketLists: {
      handler: function mlt() {
        if (!this.getToken) {
          this.handleGetToken()
          return
        }
        this.handleDealLists();
      },
      deep: true,
      immediate: true
    },
    scatter: {
      handler: function mlt() {
        if (!this.getToken) {
          this.handleGetToken()
          return
        }
        this.handleDealLists();
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    ...mapState({
      minScreen: state => state.app.minScreen,
      scatter: state => state.app.scatter,
      slipPoint: state => state.app.slipPoint,
      baseConfig: state => state.sys.baseConfig,
      marketLists: state => state.sys.marketLists,
    }),
    dealLists() {
      let dealLists = [];
      this.lists.forEach(v => {
        const curr = this.handleGetNowMarket(v)
        const newV = v;
        newV.token = `${newV.token}`
        newV.nowMarket = curr;
        const reserve0 = v.reserve0.split(' ')[0];
        const reserve1 = v.reserve1.split(' ')[0];
        newV.sym0Rate = toFixed(accDiv(reserve1, reserve0), v.decimal1)
        newV.sym1Rate = toFixed(accDiv(reserve0, reserve1), v.decimal0)
        dealLists.push(newV)
      })
      dealLists = dealLists.sort((a, b) => {
        return parseFloat(b.reserve0) - parseFloat(a.reserve0)
      })
      return [...dealLists]
    }
  },
  methods: {
    handleTo(name) {
      const mid = this.dealLists.length ? this.dealLists[0].mid : 39;
      this.$router.push({
        name,
        params: {
          mid
        }
      })
    },
    handleClose() {
      this.showAdd = false;
      this.showRemove = false;
    },
    handleShowAdd(item) {
      this.menageMarket = item;
      this.showAdd = true;
    },
    handleShowRemove(item) {
      this.menageMarket = item;
      this.showRemove = true;
    },
    handleToMarket(mid) {
      this.$emit('listenToMarket', mid)
    },
    async handleGetToken() {
      if (!this.scatter || !this.scatter.identity || !this.marketLists.length) {
        return
      }
      this.getToken = true;
      this.lists = []
      const params = {
        "code":"defislogsone",
        "scope": this.scatter.identity.accounts[0].name,
        "table":"liqs2",
        "json":true,
        limit: 1000,
      }
      EosModel.getTableRows(params, (res) => {
        const list = res.rows || [];
        this.loading = false;
        list.forEach((v) => {
          const item = this.marketLists.find(vv => vv.mid == v.mid)
          const symbol0 = v.bal0.split(' ');
          const symbol1 = v.bal1.split(' ');
          const newArr = [
            symbol0[0],
            symbol1[0]
          ]
          if (symbol0[1] === item.symbol0) {
            newArr[0] = symbol0[0];
            newArr[1] = symbol1[0];
          } else if (symbol1[1] === item.symbol0) {
            newArr[0] = symbol1[0];
            newArr[1] = symbol0[0];
          }
          this.lists.push(Object.assign(item, {
            token: v.token,
            capital: newArr,
            startTime: `${moment(`${v.start}.000+0000`).valueOf() / 1000 - 8 * 3600}`
          }))
        })
      })
    },
    handleGetNowMarket(item) {
      const inData = {
        poolSym0: item.reserve0.split(' ')[0],
        poolSym1: item.reserve1.split(' ')[0],
        poolToken: item.liquidity_token,
        sellToken: `${item.token}`
      }
      const nowMarket = sellToken(inData);
      nowMarket.getNum1 = toFixed(nowMarket.getNum1, 4)
      nowMarket.getNum2 = toFixed(nowMarket.getNum2, 4)
      return nowMarket;
    },
    handleDealLists() {
      this.lists.forEach(v => {
        const newMkt = this.marketLists.find(vv => vv.mid === v.mid) || {}
        this.$set(v, 'reserve0', newMkt.reserve0)
        this.$set(v, 'reserve1', newMkt.reserve1)
        this.$set(v, 'liquidity_token', newMkt.liquidity_token)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.marketLists{
  margin: 0 0 40px;
  &.page{
    margin: 0 40px 40px;
  }
}
.title{
  font-size: 32px;
  text-align: left;
  margin: 0 0 40px;
  &>span{
    margin-right: 60px;;
  }
  .act{
    color: $color-black;
    position: relative;
    &::before{
      content: '';
      position: absolute;
      width:60px;
      height:8px;
      background:rgba(2,198,152,1);
      border-radius:4px;
      bottom: -20px;
      left: 50%;
      transform: translateX(-45%);
    }
  }
  .mkhis{
    margin-right: 0px;
    font-size: 26px;
  }
}
.noData{
  text-align: center;
  margin: 100px 0;
  color: #A6A6A6;
  font-size: 24px;
}
.mkListDia{
  // animation: none;
  /deep/ .el-dialog{
    border-radius:12px 12px 0px 0px;
    position: relative;
    margin: auto;
    width: 690px;
    border-radius:12px;
    .el-dialog__body,
    .el-dialog__header{
      padding: 0;
    }
  }
}
</style>
