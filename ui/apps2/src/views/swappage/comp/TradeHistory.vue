<template>
  <div class="history">
    <div class="title flexb">
      <span class="flexc">
        <span class="act" @click="showMarketList = true">{{ thisMarket.symbol0 }}-{{ thisMarket.symbol1 }}</span>
        <img class="iconImg" src="https://cdn.jsdelivr.net/gh/defis-net/material/dex/down.svg" alt="">
      </span>
    </div>
    <!-- <div class="tip noData">链上数据重新同步中。一天后恢复查询。</div> -->
    <div class="lists" >
      <van-list
        v-model="loadingMore"
        :finished="finished"
        :loading-text="$t('public.loading')"
        :finished-text="$t('public.noMore')"
        @load="handleCurrentChange"
      >
        <div class="list" v-for="(item, index) in pageList" :key="index">
          <div class="flexa">
            <span class="tradeType green_p" v-if="item.isBuy">{{ $t('more.buy') }}</span>
            <span class="tradeType red_p" v-else>{{ $t('more.sell') }}</span>
            <span class="flexc">
              <span>{{ thisMarket.symbol1 }}</span>/<span>{{ thisMarket.symbol0 }}</span>
            </span>
            <span class="tip time">（{{ item.time }}）</span>
          </div>
          <div class="flexb dataInfo tip">
            <div>
              <div>{{ $t('more.amt') }}({{ thisMarket.symbol0 }})</div>
              <div class="num">{{ item.amt }}</div>
            </div>
            <div>
              <div>{{ $t('more.price') }}({{ thisMarket.symbol0 }})</div>
              <div class="num">{{ item.price }}</div>
            </div>
            <div>
              <div>{{ $t('more.vol') }}({{ thisMarket.symbol1 }})</div>
              <div class="num">{{ item.buyNum }}</div>
            </div>
          </div>
        </div>
      </van-list>
      <!-- <div class="noData tip" v-if="!hisList.length">{{ $t('public.noData') }}</div> -->
    </div>

    <van-popup
      class="newMarket"
      v-model="showMarketList"
      position="left">
      <market-list :marketLists="marketLists"
        @listenMarketChange="handleMarketChange"
        @listenClose="handleClose"/>
    </van-popup>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import moment from 'moment';
import MarketList from '@/components/MarketArea';
import {toLocalTime, dealPrice} from '@/utils/public'
export default {
  name: 'tradeHistory',
  components: {
    MarketList,
  },
  computed: {
    ...mapState({
      scatter: state => state.app.scatter,
      marketLists: state => state.sys.marketLists,
    }),
    reward() {
      let t = this.totalSell - this.totalBuy;
      t = t.toFixed(4)
      if (t > 0) {
        t = `+${t}`
      }
      return t
    }
  },
  data() {
    return {
      loading: false,
      loadingMore: false,
      finished: false,
      exRate: false,
      showMarketList: false,
      hisList: [],
      pageList: [],
      thisMarket: {
        mid: 39,
        symbol0: 'EOS',
        symbol1: 'DFS',
      },
      // 统计
      totalBuy: 0,
      totalGetBuy: 0,
      totalSell: 0,
      totalGetSell: 0,
      pageSize: 20,
      page: 1,
    }
  },
  watch: {
    '$route': {
      handler: function rt() {
        this.page = 1;
        this.loadingMore = true;
        this.pageList = []
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
    handleCurrentChange() {
      this.handlerGetMarket();
    },
    handleExchange(index) {
      this.$set(this.hisList[index], 'exRate', !this.hisList[index].exRate);
    },
    handlerGetMarket() {
      if (!this.marketLists.length || !this.scatter || !this.scatter.identity || this.loading) {
        return
      }
      const mid = this.$route.params.mid || 39;
      this.thisMarket = this.marketLists.find(v => v.mid == mid) || {};
      this.handleGetHistory(mid)
    },
    async handleGetHistory(mid) {
      this.loading = true;
      const user = this.scatter.identity.accounts[0].name;
      const params = {
        user,
        mid,
        page: this.page,
        limit: this.pageSize,
      }
      const {status, result} = await this.$api.tradelog(params);
      this.loading = false;
      if (!status) {
        this.hisList = [];
        this.pageList = [];
        // this.handleCurrentChange();
        return
      }
      const list = result.data || [];
      list.forEach(v => {
        let t = toLocalTime(v.create_time).replace(/-/g, '/');
        t = moment(t).valueOf() + 8 * 3600 * 1000;
        const time = toLocalTime(t)
        this.$set(v, 'time', time);
        const isBuy = v.bal0.split(' ')[1] === this.thisMarket.symbol0;
        this.$set(v, 'isBuy', isBuy);
        const amt = isBuy ? v.bal0.split(' ')[0] : v.bal1.split(' ')[0];
        this.$set(v, 'amt', amt);
        const buyNum = isBuy ? v.bal1.split(' ')[0] : v.bal0.split(' ')[0];
        this.$set(v, 'buyNum', buyNum);
        const price = parseFloat(amt) / parseFloat(buyNum); // 成交均价
        this.$set(v, 'price', dealPrice(price));
      })
      this.hisList = list;
      if (this.page === 1) {
        this.pageList = list;
      } else {
        this.pageList.push(...list)
      }
      this.loadingMore = false;
      this.page += 1;
      // 数据全部加载完成
      if (list.length < this.pageSize) {
        this.finished = true;
      }
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
    margin: 0px 0 30px;
    padding: 0 0 0 40px;
    color: #000;
    &>span{
      margin-right: 60px;;
    }
    .rulesTip{
      font-size: 21px;
      margin-right: 40px;
      text-align: right;
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
  .total{
    padding: 0 40px;
    font-size: 21px;
    line-height: 28px;
    // justify-content: flex-end;
    .totalNum>div{
      margin-left: 10px;
      &:first-child{
        margin-left: 0px;
      }
    }
  }

  .noData{
    padding: 50px 0;
    font-size: 30px;
  }

  .lists{
    .list{
      margin: 30px 40px;
      padding: 30px;
      border-radius: 15px;
      font-size: 30px;
      box-shadow: 0px 8px 40px 0px rgba(220,220,220,0.5);
      &>div{
        margin-top: 10px;
        &:first-child{
          margin-top: 0;
        }
      }
      .tradeType{
        font-size: 30px;
        font-weight: 500;
        margin-right: 10px;
      }
      .time{
        margin-left: -8px;
      }
      .dataInfo{
        font-size: 24px;
        text-align: center;
        &>div{
          flex: 1;
          &:first-child{
            text-align: left;
          }
          &:last-child{
            text-align: right;
          }
        }
        .num{
          font-size: 30px;
          color: #333;
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

.pagination{
  text-align: right;
  margin-top: 20px;
  margin-bottom: 30px;
  font-size: 26px;
  padding-right: 30px;
  /deep/ .el-pager{
    li.active{
      color: #07D79B;
    }
    li:hover{
      color: #07D79B;
    }
    li{
      font-size: 26px;
    }
  }
  /deep/ .btn-prev, /deep/ .btn-next{
    &:hover {
      color: #07D79B;
    }
    .el-icon-arrow-left, .el-icon-arrow-right{
      font-size: 26px;
    }
  }
}
</style>
