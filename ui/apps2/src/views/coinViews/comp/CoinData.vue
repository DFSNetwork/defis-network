<template>
  <div class="mainDiv">
    <!-- 交易数据 -->
    <div class="title flexb">
      <div class="flexc" @click="showMarketList = true">
        <span class="act">DFS-EOS</span>
        <img class="iconImg" src="@/assets/img/dex/down.svg" alt="">
      </div>
    </div>
    <div class="poolsInfo">
      <div class="flexb">
        <div class="priceDiv">
          <div class="price">1.950001</div>
          <div class="tip">当前价格</div>
        </div>
        <div class="data">
          <div class="flexe">
            <span class="tip">持有人数：</span>
            <span>{{ holders }}</span>
          </div>
          <div class="flexe">
            <span class="tip">24H笔数：</span>
            <span>{{ trx_24h }}</span>
          </div>
          <div class="flexe">
            <span class="tip">24H总量：</span>
            <span>{{ volume_24h }}</span>
          </div>
        </div>
      </div>
      <div class="flexa">
        <span class="tip">当前发行量：</span>
        <span>{{ supply }}</span>
      </div>
    </div>

    <div class="poolsInfo kLine">
      <KLine />
      <div class="hideDiv"></div>
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

    <div class="">
      <Lists :pageLists="pageLists" :checkedMarket="checkedMarket" />

      <el-pagination
        class="pagination"
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :current-page.sync="page"
        :page-size="size"
        :total="total">
      </el-pagination>
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
import MarketList from '@/components/MarketList';
import { toLocalTime } from '@/utils/public';
import axios from 'axios';
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
      holders: 0,
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
      showMarketList: false,
      option: [{
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
      }
    }
  },
  watch: {
    checkedMarket: {
      handler: function cmt(newVal) {
        if (!newVal.symbol1) {
          return
        }
        this.option = this.config[newVal.symbol1] || []
        if (!this.filter) {
          this.filter = this.option[2].value;
          return
        }
      },
      deep: true,
      immediate: true,
    },
    option: {
      handler: function opt(newVal) {
        if (!newVal.length) {
          return
        }
        this.handleGetList()
      },
      deep: true,
      immediate: true,
    },
    filter() {
      this.handleGetList()
    }
  },
  methods: {
    handleMarketChange() {},
    handleClose() {
      this.showMarketList = false;
    },
    handleToLocalDate(t) {
      return toLocalTime(t).substr(10, 16)
    },
    handleCurrentChange() {
      this.handleGetList();
    },
    handleGetList() {
      if (!this.checkedMarket.symbol1 || !this.filter) {
        return
      }
      const params = {
        token: this.checkedMarket.symbol1.toLowerCase(),
        page: this.page,
        limit: this.size,
        min: this.filter,
      }
      axios.get('https://api.defis.network/history/transfer', {
        params
      }).then(result => {
        console.log(result)
        const res = result.data;
        this.total = res.total || 0;
        this.pageLists = res.data || [];
        this.holders = res.holders;
        this.trx_24h = res.trx_24h;
        this.volume_24h = res.volume_24h;
        this.supply = res.supply;
      })
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
    &::before{
      content: '';
      position: absolute;
      width:60px;
      height:8px;
      background:rgba(2,198,152,1);
      border-radius:4px;
      bottom: -20px;
      left: 30px;
      // transform: translateX(-45%);
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
      font-size: 45px;
      font-weight: 500;
    }
  }
  .data{
    text-align: right;
  }
}
// K line
.kLine{
  position: relative;
  .hideDiv{
    position: absolute;
    width: 180px;
    height: 100%;
    top: 0px;
    right: 0px;
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
  font-size: 26px;
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
