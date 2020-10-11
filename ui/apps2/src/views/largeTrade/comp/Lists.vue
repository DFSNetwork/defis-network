<template>
  <div>
    <div class="tradeLists">
      <div class="title flexb">
        <span class="act">大额订单</span>
        <span class="sort">
          <span>过滤：</span>
          <el-select v-model="filter"
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
      </div>
      <div class="lists">
        <div class="list flexb subTitle">
          <span>时间</span>
          <span>发起者</span>
          <span>接收者</span>
          <span>交易额({{checkedMarket.symbol1}})</span>
        </div>
        <div class="list flexb" v-for="(item, index) in pageLists" :key="index">
          <span>{{ handleToLocalDate(item.create_time) }}</span>
          <span>{{ item.fromx }}</span>
          <span>{{ item.tox }}</span>
          <span>{{ item.amount }}</span>
        </div>
      </div>
      <el-pagination
        class="pagination"
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :current-page.sync="page"
        :page-size="size"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { toLocalTime } from '@/utils/public';
import axios from 'axios';
export default {
  name: 'tradeLists',
  props: {
    checkedMarket: {
      type: Object,
      default: function cm() {
        return {}
      }
    }
  },
  data() {
    return {
      page: 1,
      size: 15,
      total: 0,
      allLists: [],
      pageLists: [],
      filter: '',
      // 100 500 1000 5000 10000
      // 1 5 10 50 100
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
  mounted() {
  },
  methods: {
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
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.tradeLists{
  background: #FFF;
  padding: 0 30px 50px;
}
.title{
  font-size: 32px;
  text-align: left;
  margin: 0 0 30px;
  position: relative;
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
.lists{
  padding: 0px 0 20px;
  background: #FFF;
  .list{
    font-size: 27px;
    height: 60px;
    color: #000;
    &:nth-child(2n + 1) {
      background: #fafafa;
    }
    &>span{
      flex: 2;
      margin-right: 20px;
      &:first-child{
        text-align: left;
        flex: 1;
      }
      &:last-child{
        text-align: right;
        margin-right: 0;
      }
    }
  }
  .subTitle{
    color: #444;
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
