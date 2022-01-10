<template>
  <div class="mainDiv">
    <!-- 交易数据 -->
    <div class="title flexb">
      <div class="flexc" @click="showMarketList = true">
        <span class="act">{{ checkedMarket.symbol1 }}-{{ checkedMarket.symbol0 }}</span>
        <img class="iconImg" src="https://cdn.jsdelivr.net/gh/defis-net/material/dex/down.svg" alt="">
      </div>
    </div>
    <div class="poolsInfo" v-loading="listLoading && changeLoading">
      <div class="flexb">
        <div class="priceDiv">
          <div class="price">{{ price }}</div>
          <div class="tip">当前价格</div>
        </div>
        <div class="data flexc">
          <div class="tip">
             <div>当前发行量：</div>
             <div>最大发行量：</div>
          </div>
          <div class="num">
             <div>{{ parseInt(supply) || '-' }}</div>
             <div>10000000</div>
          </div>
        </div>
      </div>
    </div>

    <div class="poolsInfo kLine">
      <KLine :checkedMarket="checkedMarket" :price="price"/>
      <div class="hideDiv"></div>
      <div class="hide2Div"></div>
    </div>

    <div class="title flexb">
      <span class="act">转账记录</span>
      <span class="sort">
        <span>过滤：</span>
        <span>
          <el-select v-model="myFilter"
            class="select"
            :popper-class="'mySelectItem'"
            :popper-append-to-body="false">
            <el-option
              v-for="item in option"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </span>
      </span>
    </div>

    <div v-loading="listLoading">
      <van-list
        v-model="loadMore"
        :finished="finished"
        :loading-text="$t('public.loading')"
        :finished-text="$t('public.noMore')"
        @load="handleCurrentChange"
      >
        <Lists :pageLists="pageLists" :checkedMarket="checkedMarket" />
      </van-list>
    </div>

    <el-dialog
      class="mkListDia pcList"
      :show-close="false"
      :visible.sync="showMarketList">
      <market-list :marketLists="marketLists"
        :type="`kline`"
        v-if="showMarketList"
        @listenMarketChange="handleMarketChange"
        @listenClose="handleClose"/>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import MarketList from '@/components/MarketList';
import { toLocalTime } from '@/utils/public';
import KLine from '../kline/KLine';
import Lists from './Lists';

export default {
  name: 'coinData',
  components: {
    KLine,
    Lists,
    MarketList,
  },
  props: {
    marketLists: {
      type: Array,
      default: function mls() {
        return []
      }
    }
  },
  data() {
    return {
      trx_24h: 0,
      volume_24h: 0,
      supply: '-',
      checkedMarket: {
        symbol1: 'DFS',
        sym1Data: {},
      },
      myFilter: '',
      page: 1,
      size: 15,
      total: 0,
      pageLists: [],
      listLoading: true,
      changeLoading: true,
      showMarketList: false,
      timer: null,
      option: [{
        value: '0',
        label: '0 YFC'
      }, {
        value: '1',
        label: '1 YFC'
      }, {
        value: '5',
        label: '5 YFC'
      }, {
        value: '10',
        label: '10 YFC'
      }, {
        value: '50',
        label: '50 YFC'
      }, {
        value: '100',
        label: '100 YFC'
      }],
      config: {
        YFC: [{
          value: '0',
          label: '0 YFC'
        }, {
          value: '1',
          label: '1 YFC'
        }, {
          value: '5',
          label: '5 YFC'
        }, {
          value: '10',
          label: '10 YFC'
        }, {
          value: '50',
          label: '50 YFC'
        }, {
          value: '100',
          label: '100 YFC'
        }],
        DFS: [{
          value: '0',
          label: '0 DFS'
        }, {
          value: '100',
          label: '100 DFS'
        }, {
          value: '500',
          label: '500 DFS'
        }, {
          value: '1000',
          label: '1000 DFS'
        }, {
          value: '5000',
          label: '5000 DFS'
        }, {
          value: '10000',
          label: '10000 DFS'
        }]
      },
      finished: false,
      loadMore: false,
    }
  },
  beforeDestroy() {
    clearTimeout(this.timer)
  },
  computed: {
    ...mapState({
      // 箭头函数可使代码更简练
      baseConfig: state => state.sys.baseConfig, // 基础配置 - 默认为{}
    }),
    price() {
      if (!this.checkedMarket.reserve1) {
        return '-'
      }
      const t = this.checkedMarket;
      const price = (parseFloat(t.reserve0) / parseFloat(t.reserve1)) || 0
      return price.toFixed(6)
    }
  },
  watch: {
    option: {
      handler: function opt(newVal) {
        if (!newVal.length) {
          return
        }
        this.listLoading = true;
        this.page = 1
        this.handleCurrentChange()
      },
      deep: true,
      immediate: true,
    },
    myFilter() {
      // this.pageLists = [];
      this.page = 1
      this.listLoading = true;
      this.handleCurrentChange()
    },
    '$route': {
      handler: function rt() {
        this.handleGetMids()
      },
      deep: true,
      immediate: true,
    },
    marketLists: {
      handler: function opt(newVal) {
        if (!newVal.length) {
          return
        }
        this.handleGetMids()
        this.handleGetSupply()
      },
      deep: true,
      immediate: true,
    }
  },
  methods: {
    handleGetMids() {
      if (!this.marketLists.length) {
        return;
      }
      this.mid = Number(this.$route.params.mid)
      this.checkedMarket = this.marketLists.find(v => v.mid === this.mid) || {};
      this.handleDealFilter()
    },
    handleDealFilter() {
      const newVal = this.checkedMarket;
      this.option = this.config[newVal.symbol1] || []
      if (!this.myFilter) {
        this.myFilter = this.option[1].value;
        return
      }
    },
    handleMarketChange(data) {
      if (data.mid === this.checkedMarket.mid) {
        return
      }
      this.myFilter = '';
      this.changeLoading = true;
      this.checkedMarket = data;
      this.showMarketList = false;
      this.$router.push({
        name: 'coinViews',
        params: {
          mid: this.checkedMarket.mid,
        }
      })
      this.handleDealFilter()
    },
    handleClose() {
      this.showMarketList = false;
    },
    handleToLocalDate(t) {
      return toLocalTime(t).substr(10, 16)
    },
    handleCurrentChange() {
      this.handleGetList();
    },
    async handleGetList() {
      clearTimeout(this.timer)
      if (!this.checkedMarket.symbol1 || !this.myFilter) {
        return
      }
      this.timer = setTimeout(() => {
        this.handleGetList()
      }, 50000);
      const params = {
        token: this.checkedMarket.symbol1.toLowerCase(),
        page: this.page,
        limit: this.size,
        min: this.myFilter,
      }
      const {status, result } = await this.$api.transferLog(params)
      if (!status) {
        return
      }
      this.listLoading = false;
      this.changeLoading = false;
      const res = result;
      const data = res.data || [];
      data.forEach(v => {
        let transType = -1; // 0 - 卖出 ｜ 1 - 买入 ｜ 2 - 做市
        if (v.tox === 'defisswapcnt' && v.memo === 'deposit') {
          transType = 2;
        } else if (v.tox === 'defisswapcnt' && v.memo.indexOf('swap') === 0) {
          transType = 0;
        } else if (v.fromx === 'defisswapcnt' && v.memo === 'swap success') {
          transType = 1
        } else if (v.fromx === 'defisswapcnt' && (v.memo === 'withdraw token1 liquidity' || v.memo === 'withdraw token0 liquidity') ) {
          transType = 3;
        } else if (v.tox === 'dfsdsrsystem') {
          transType = 4;
        } else if (v.fromx === 'dfsdsrsystem') {
          transType = 5;
        }
        this.$set(v, 'transType', transType)
      });

      if (params.page === 1) {
        this.pageLists = data;
        this.page = 1
      } else {
        this.pageLists.push(...data);
      }
      this.loadMore = false;
      this.page += 1;
      if (data.length < this.size) {
        this.finished = true;
      }
    },
    async handleGetSupply() {
      const params = {
        code: this.checkedMarket.contract1,
        symbol: this.checkedMarket.symbol1,
      }
      const {status, result} = await this.$api.get_currency_stats(params)
      if (!status) {
        return;
      }
      const res = result[this.checkedMarket.symbol1];
      const supply = res.supply.split(' ')[0];
      this.supply = supply;
    }
  },
}
</script>

<style lang="scss" scoped>
.mainDiv{
  padding: 20px 30px;
}
.title{
  font-size: 32px;
  text-align: left;
  margin: 0 0 40px;
  position: relative;
  &>span{
    margin-right: 60px;;
  }
  .iconImg{
    width: 30px;
    margin: 0 0 0 8px;
  }
  .act{
    color: $color-black;
    position: relative;
    padding-left: 28px;
    &::before{
      content: '';
      position: absolute;
      width: 8px;
      height: 30px;
      background:rgba(2,198,152,1);
      border-radius:4px;
      top: 50%;
      left: 0;
      transform: translateY(-45%);
    }
  }
  .date{
    position: absolute;
    right: 0px;
    top: 50%;
    margin-right: 0;
    font-size: 28px;
    color: #a6a6a6;
    transform: translateY(-50%);
  }
  .sort{
    margin-right: 0;
    font-size: 27px;
    .select{
      height: 50px;
      border: 1px solid #e3e3e3;
      border-radius: 10px;
    }
    /deep/ .el-select{
      border-radius: 10px;
      .el-input__suffix-inner{
        display: flex;
        align-items: center;
        height: 50px;
      }
      .el-input__inner{
        border-radius: 10px;
        height: 50px;
        font-size: 26px;
        text-align: center;
        width: 180px;
        border: 0px;
        padding-right: 38px;
        &:focus{
          border-color: #07d79b;
        }
      }
    }
    /deep/ .el-scrollbar{
      .el-select-dropdown__item{
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 26px;
        font-weight: normal;
        &.selected{
          font-weight: bold;
          color: #07d79b;
        }
      }
    }
  }
}
// 数据看板
.poolsInfo{
  font-size: 24px;
  background: #FFF;
  color: #000;
  padding: 20px;
  box-shadow: 0px 10px 40px 0px rgba(220,220,220,0.5);
  margin-bottom: 30px;
  border-radius: 20px;
  .priceDiv{
    text-align: left;
    .price{
      font-size: 48px;
      font-weight: 500;
    }
  }
  .data{
    text-align: right;
    .tip{
      line-height: 35px;
    }
    .num{
      text-align: left;
      // min-width: 80px;
      // display: inline-block;
      // border: 1px solid #000;
      line-height: 35px;
    }
  }
}
// K line
.kLine{
  position: relative;
  .hideDiv{
    position: absolute;
    width: 180px;
    height: calc(100% - 100px);
    top: 100px;
    right: 0px;
  }
  .hide2Div{
    position: absolute;
    width: 280px;
    height: 200px;
    bottom: 80px;
    left: 0;
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
