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
              :label="!item.value ? $t(`fundation.all`) : item.label"
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
      <div class="tab flexb">
        <div class="tabTitle">留言区</div>
        <div class="type tip">
          <span class="typeAct">最新</span>
          <span>最热</span>
          <span>最贵</span>
        </div>
      </div>
      <van-list
        v-model="loadingMore"
        :finished="finished"
        :loading-text="$t('public.loading')"
        :finished-text="$t('public.noMore')"
        @load="handleCurrentChange"
      >
        <div class="listOld flexs" v-for="(item, index) in pageLists" :key="index">
          <div class="headImg">
            <img width="100%" :src="item.headImg">
          </div>
          <div class="mainContent">
            <div class="flexb">
              <div class="name">
                <div>{{ (item.fromx) }}</div>
                <div class="price flexa tip">
                  <span class="">{{ $t('fundation.transNum') }}：</span>
                  <span class="flexc qua dinReg">{{ item.quantity }}({{ item.account }})</span>
                </div>
              </div>
              <div class="flexend tip likeDiv">
                <span>1000</span>
                <img src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/like.png" alt="">
                <!-- <img width="20px" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/like1.png" alt=""> -->
              </div>
            </div>
            <div class="price flexs">
              <span class="hideText">{{ item.memo }}</span>
            </div>
            <div class="tip time flexa">
              <span>{{ handleToLocalTime(item.create_time) }}</span>
              <span class="reply">回复</span>
            </div>
            <div class="showReply flexa" v-if="!item.showReply && item.reply">
              <span>展开11条回复</span>
              <img src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/showMore.png" alt="">
            </div>
            <div class="replyLists" v-else-if="item.showReply">
              <ReplyLists :listsLen="11" :target="item.global_action_seq"/>
            </div>
          </div>
        </div>
      </van-list>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import moment from 'moment';
import {toBrowser, getDateDiff} from '@/utils/public'
import ReplyLists from './ReplyLists';

export default {
  name: 'fundationLists',
  components: {
    ReplyLists
  },
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
        label: 'all'
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
        label: 'all'
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
        label: 'all'
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
      const oDate = getDateDiff(t)
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
  // margin: 30px;
  border-top: 20px solid #f6f6f6;
  color: #333;
  padding: 32px 30px;
  .tab{
    font-size: 28px;
    color: #333;
    .tabTitle{
      font-weight: 500;
    }
    .type{
      &>span{
        position: relative;
        padding: 8px 16px;
        &::after{
          content: '';
          position: absolute;
          width: 2px;
          height: 26px;
          background:#D0D0D0;
          border-radius:4px;
          right: 0%;
          top: 50%;
          transform: translateY(-45%);
        }
        &:last-child{
          padding-right: 0;
          &::after{
            display: none;
          }
        }
      }
      .typeAct{
        color: #333;
      }
    }
  }

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
    padding: 26px 0;
    border-bottom: 1px solid rgba(220,220,220,.3);
    .headImg{
      width: 80px;
      height: 80px;
      border-radius: 45px;
      overflow: hidden;
      margin-right: 15px;
    }
    .mainContent{
      text-align: left;
      flex: 1;
    }
    .hideText{
      font-size: 28px;
      overflow: hidden;
      word-break: break-all;
      white-space: pre-wrap;
    }
    .price{
      text-align: left;
      font-size: 24px;
      margin-top: 6px;
      font-weight: normal;
    }

    .name{
      font-size: 30px;
      font-weight: 500;
      &>span{
        text-align: left;
      }
    }
    .likeDiv{
      font-size: 22px;
      img{
        width: 32px;
        margin-left: 8px;
      }
    }
    .qua{
      font-size: 24px;
    }
    .time{
      margin-top: 4px;
      font-size: 20px;
      // font-weight: 300;
    }
    .reply{
      color: #999;
      font-size: 26px;
      margin-left: 8px;
      font-weight: 500;
    }
    .showReply{
      color: #29D4B0;
      margin-top: 8px;
      img{
        width: 20px;
        margin-left: 6px;
      }
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
