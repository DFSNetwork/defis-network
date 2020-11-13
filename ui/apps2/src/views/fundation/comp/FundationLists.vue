<template>
  <div>
    <!-- 币种统计 -->
    <div class="title flexb">
      <span class="act">{{ $t('fundation.his') }}</span>
      <span class="sort">
        <span>{{ $t('fundation.fileter') }}：</span>
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
        <span>
          <el-select v-model="minFilter"
            class="select mr0"
            :popper-class="'mySelectItem'"
            :popper-append-to-body="false">
            <el-option
              v-for="item in minOption"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </span>
      </span>
    </div>

    <div class="lists">
      <van-list
        v-model="loadingMore"
        :finished="finished"
        :loading-text="$t('public.loading')"
        :finished-text="$t('public.noMore')"
        @load="handleCurrentChange"
      >
        <!-- <div class="noData tip" v-if="!pageLists.length">{{ $t('public.noData') }}</div> -->
        <div class="listOld" v-for="(item, index) in pageLists" :key="index" @click="handleToBrowser(item.trx_id)">
          <div class="flexb name">
            <span>{{ (item.fromx) }}</span>
            <span class="tip time">{{ handleToLocalTime(item.create_time) }}</span>
          </div>
          <div class="price flexa">
            <span class="tip">{{ $t('fundation.transNum') }}：</span>
            <span class="flexc qua din">{{ item.quantity }}</span>
          </div>
          <div class="price flexs">
            <span class="tip">{{ $t('fundation.memo') }}：</span>
            <span class="hideText">{{ item.memo }}</span>
          </div>
        </div>
      </van-list>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import moment from 'moment';
import {toLocalTime, toBrowser} from '@/utils/public'
export default {
  name: 'fundationLists',
  props: {
    pageLists: {
      type: Array,
      default: function lists() {
        return []
      }
    },
    finished: {
      type: Boolean,
      default: false
    },
    summaryLists: {
      type: Array,
      default: function lists() {
        return []
      }
    }
  },
  data() {
    return {
      loadingMore: false,
      toTx: true,
      myFilter: '',
      minFilter: '0.1',
      minOption: [{
        value: '0',
        label: 'All'
      }, {
        value: '0.01',
        label: '0.01'
      }, {
        value: '0.1',
        label: '0.1'
      }, {
        value: '1',
        label: '1'
      }, {
        value: '10',
        label: '10'
      }, {
        value: '100',
        label: '100'
      }]
    }
  },
  computed: {
    ...mapState({
      filterMkLists: state => state.sys.filterMkLists,
    }),
    option() {
      const newOp = [{
        value: '',
        label: '全部'
      }]
      this.summaryLists.forEach(v => {
        const hasMarket = this.filterMkLists.find(vv => {
          return (vv.contract0 === v.account && vv.symbol0 === v.symbol)
              || (vv.contract1 === v.account && vv.symbol1 === v.symbol)
        })
        if (!hasMarket) {
          return;
        }
        const op = {
          value: `${v.account}:${v.symbol}`,
          label: v.symbol
        }
        newOp.push(op)
      });
      return newOp;
    }
  },
  watch: {
    pageLists: {
      handler: function pls() {
        this.loadingMore = false;
      }
    },
    myFilter(newVal) {
      this.$emit('listenFilter', newVal)
    },
    minFilter(newVal) {
      this.$emit('listenFilterMin', newVal)
    },
  },
  methods: {
    handleDealOption(newVal) {
      const newOp = [{
        value: '',
        label: '全部'
      }]
      newVal.forEach(v => {
        const op = {
          value: v.account,
          label: v.symbol
        }
        newOp.push(op)
      });
      this.option = newOp;
    },
    handleToLocalTime(time) {
      let t = moment(`${time}`).valueOf()
      t += 3600 * 8 * 1000;
      const oDate = toLocalTime(t)
      return oDate
    },
    handleToBrowser(id, type = 'tx') {
      if (!this.toTx) {
        return
      }
      toBrowser(id, type)
    },
    handleCurrentChange() {
      this.$emit('listenCurrentChange', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.title{
  font-size: 32px;
  text-align: left;
  margin: 10px 32px 30px;
  &>span{
    padding-left: 20px;
  }
  .act{
    color: $color-black;
    position: relative;
    &::before{
      content: '';
      position: absolute;
      width: 8px;
      height: 30px;
      background:#02C698;
      border-radius:4px;
      left: 0%;
      top: 50%;
      transform: translateY(-45%);
    }
  }
  .right{
    margin-right: 0
  }
}
.lists{
  margin: 30px;
  color: #333;
  .exchange{
    margin: 0 8px;
    width: 30px;
  }
  .noData{
    padding: 50px 0;
    font-size: 30px;
  }
  .subTitle{
    color: #444;
  }
  .listOld{
    font-size: 26px;
    margin: 20px 0 24px;
    padding: 26px;
    border-radius: 10px;
    border: 1px solid #eee;
    // box-shadow: 0px 8px 40px 0px rgba(220,220,220,0.5);
    &>div{
      margin-top: 10px;
      &:first-child{
        margin-top: 0;
      }
    }
    .hideText{
      font-size: 24px;
      max-width: 500px;
      overflow: hidden;
      word-break: break-all;
      white-space: pre-wrap;
      // text-overflow: ellipsis; //溢出用省略号显示
      // white-space: nowrap; //溢出不换行
      // display:-webkit-box;
      // -webkit-box-orient:vertical;
      // -webkit-line-clamp:2;
    }
    .price{
      text-align: left;
      font-size: 24px;
    }

    .name{
      font-size: 30px;
      &>span{
        text-align: left;
      }
      .time{
        font-size: 24px;
      }
    }
    .num{
      font-size: 26px;
    }
    .qua{
      font-size: 26px;
      font-weight: 500;
    }
  }
}
.sort{
  margin-right: 0;
  font-size: 27px;
  .select{
    height: 50px;
    border: 1px solid #e3e3e3;
    border-radius: 10px;
    margin-right: 10px;
  }
  .mr0{
    margin-right: 0px;
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
      width: 120px;
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
</style>
