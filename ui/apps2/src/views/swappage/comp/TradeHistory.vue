<template>
  <div class="history">
    <div class="title flexb">
      <span class="flexc">
        <span class="act" @click="showMarketList = true">{{ thisMarket.symbol0 }}-{{ thisMarket.symbol1 }}</span>
        <img class="iconImg" src="@/assets/img/dex/down.svg" alt="">
      </span>
      <span class="tip rulesTip">{{ $t('dex.nearSeven') }}</span>
    </div>
    <div class="lists" v-loading="loading">
      <div class="noData tip" v-if="!hisList.length">{{ $t('public.noData') }}</div>
      <div class="list" v-for="(item, index) in hisList" :key="index">
        <div class="flexb">
          <span class="flexc num">
            <span>{{ item.amountIn }}</span>
            <img class="exchange" src="@/assets/img/dex/exchange.svg" alt="">
            <span>{{ item.amountOut }}</span>
          </span>
        </div>
        <div class="price flexb">
          <span class="tip">{{ $t('dex.exchangePrice') }}</span>
          <span class="flexc">
            <span v-if="item.exRate">1{{ item.sym1 }} = {{ item.price0 }} {{ item.sym0 }}</span>
            <span v-else>1{{ item.sym0 }} = {{ item.price1 }} {{ item.sym1 }}</span>
            <span class="flexa" @click="handleExchange(index)">
              <img class="iconImg small" v-if="!item.exRate" src="@/assets/img/dex/price_switch_icon_btn_left.svg" alt="">
              <img class="iconImg small" v-else src="@/assets/img/dex/price_switch_icon_btn_right.svg" alt="">
            </span>
          </span>
        </div>
        <div class="price flexb tip">
          <span>{{ $t('dex.exchangeTime') }}</span>
          <span>{{ item.time }}</span>
        </div>
      </div>
    </div>

    <el-dialog
      class="mkListDia pcList"
      :show-close="false"
      :visible.sync="showMarketList">
      <market-list :marketLists="marketLists"
        @listenMarketChange="handleMarketChange"
        @listenClose="handleClose"/>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import axios from "axios";
import MarketList from '@/components/MarketList';
import {toLocalTime} from '@/utils/public'
export default {
  name: 'tradeHistory',
  components: {
    MarketList,
  },
  props: {
    marketLists: {
      type: Array,
      default: function lists() {
        return []
      }
    }
  },
  computed: {
    ...mapState({
      scatter: state => state.app.scatter,
    }),
  },
  data() {
    return {
      loading: false,
      exRate: false,
      showMarketList: false,
      hisList: [],
      thisMarket: {
        mid: 39,
        symbol0: 'EOS',
        symbol1: 'DFS',
      },
    }
  },
  watch: {
    '$route': {
      handler: function rt() {
        this.handlerGetMarket()
      },
      deep: true,
      immediate: true,
    },
    marketLists: {
      handler: function rt(newVal, oldVal) {
        if (!newVal.length || (oldVal && oldVal.length > 0)) {
          return
        }
        this.handlerGetMarket()
      },
      deep: true,
      immediate: true,
    },
    scatter: {
      handler: function listen(newVal) {
        if (newVal.identity) {
          this.handlerGetMarket();
        }
      },
      deep: true,
      immediate: true,
    }
  },
  methods: {
    handleExchange(index) {
      this.$set(this.hisList[index], 'exRate', !this.hisList[index].exRate);
    },
    handlerGetMarket() {
      if (!this.marketLists.length) {
        return
      }
      const mid = this.$route.params.mid || 39;
      this.thisMarket = this.marketLists.find(v => v.mid == mid) || {};
      console.log(mid)
      this.handleGetHistory(mid)
    },
    async handleGetHistory(mid) {
      this.loading = true;
      if (!this.scatter || !this.scatter.identity) {
        return
      }
      const user = this.scatter.identity.accounts[0].name;
      const result = await axios.get(`https://dfsinfoapi.sgxiang.com/dapi/trademining?mid=${mid}&user=${user}`);
      if (result.status !== 200) {
        this.hisList = [];
        return;
      }
      this.loading = false;
      const list = result.data || [];
      let totalBuy = 0;
      let totalGetBuy = 0;
      let totalSell = 0;
      let totalGetSell = 0;
      list.forEach(v => {
        const t = Number(v.utcTime + '000') + 8 * 3600 * 1000;
        const time = toLocalTime(t)
        this.$set(v, 'time', time);
        const price0 = parseFloat(v.amountIn) / parseFloat(v.amountOut);
        const price1 = parseFloat(v.amountOut) / parseFloat(v.amountIn);
        this.$set(v, 'price0', price0.toFixed(6));
        this.$set(v, 'price1', price1.toFixed(6));
        this.$set(v, 'exRate', false);
        this.$set(v, 'sym0', v.amountIn.split(' ')[1]);
        this.$set(v, 'sym1', v.amountOut.split(' ')[1]);

        if (this.thisMarket.symbol0 === v.amountIn.split(' ')[1]) {
          totalBuy += parseFloat(v.amountIn)
          totalGetBuy += parseFloat(v.amountOut)
        } else {
          totalSell += parseFloat(v.amountOut)
          totalGetSell += parseFloat(v.amountIn)
        }
      })
      console.log('买入消耗EOS = ', totalBuy.toFixed(4), '获得TIME = ', totalGetBuy.toFixed(8))
      console.log('卖出获得EOS = ', totalSell.toFixed(4), '转出TIME = ', totalGetSell.toFixed(8))
      this.hisList = list;
    },
    handleClose() {
      this.showMarketList = false;
    },
    handleMarketChange(item) {
      this.thisMarket = item;
      this.handleClose();
      this.$router.push({
        name: 'history',
        params: {
          mid: item.mid
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.history{
  font-size: 27px;
  .title{
    font-size: 32px;
    text-align: left;
    margin: 40px 0 40px;
    padding: 0 0 0 40px;
    color: #000;
    &>span{
      margin-right: 60px;;
    }
    .rulesTip{
      font-size: 30px;
      margin-right: 40px;
      .tipIcon{
        margin-left: 8px;
      }
    }
    .act{
      color: $color-black;
      position: relative;
      cursor: pointer;
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
  }

  .lists{
    .noData{
      padding: 50px 0;
      font-size: 30px;
    }
    .list{
      margin: 40px;
      padding: 30px;
      border-radius: 15px;
      box-shadow: 0px 8px 40px 0px rgba(220,220,220,0.5);
      &>div{
        margin-top: 10px;
        &:first-child{
          margin-top: 0;
        }
      }
      .num{
        font-size: 33px;
        .exchange{
          margin: 0 8px;
          width: 30px;
        }
      }
    }
  }

  .iconImg{
    width: 30px;
    margin: 0 0 0 8px;
  }
}

.mkListDia{
  // animation: none;
  /deep/ .el-dialog{
    position: absolute;
    bottom: 0px;
    margin: 0px;
    width: 100%;
    border-radius:30px 30px 0px 0px;
    .el-dialog__body,
    .el-dialog__header{
      padding: 0;
    }
  }
  &.pcList{
    /deep/ .el-dialog{
      position: relative;
      margin: auto;
      width: 670px;
      border-radius:30px;
    }
  }
}
</style>
