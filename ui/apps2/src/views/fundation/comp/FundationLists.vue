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
              :label="!Number(item.value || 0) ? $t(`fundation.all`) : item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </span>
      </span>
    </div>

    <div class="lists">
      <div class="tab flexb">
        <div class="tabTitle">{{ $t('fundation.memoArea') }}</div>
        <div class="type tip">
          <span :class="{'typeAct': typeAct === 0}" @click="handleChangeAct(0)">{{ $t('fundation.new') }}</span>
          <span :class="{'typeAct': typeAct === 1}" @click="handleChangeAct(1)">{{ $t('fundation.hot') }}</span>
          <span :class="{'typeAct': typeAct === 2}" @click="handleChangeAct(2)">{{ $t('fundation.mvd') }}</span>
        </div>
      </div>
      <van-list
        v-model="loadingMore"
        :finished="finished"
        :loading-text="$t('public.loading')"
        :finished-text="$t('public.noMore')"
        @load="handleCurrentChange"
      >
        <template v-if="typeAct === 0">
          <div class="listOld flexs" v-for="(item, index) in top3Arr" :key="`top-${index}`">
            <div class="headImg" @click="handleTo(item)">
              <img width="100%" :src="item.accInfo ? item.accInfo.avatar || item.headImg : item.headImg"
                :onerror="errorCoinImg">
            </div>
            <div class="mainContent">
              <div class="flexb">
                <div class="name"  @click="handleTo(item)">
                  <div class="flexa">
                    <span>{{ (item.accInfo ? item.accInfo.nick || item.fromx : item.fromx) }}</span>
                    <img class="hotImg" width="20px" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/hot.png" alt="">
                  </div>
                  <div class="price flexa tip">
                    <span class="">{{ $t('fundation.transNum') }}：</span>
                    <span class="flexc qua dinReg">{{ item.quantity }}({{ item.account }})</span>
                  </div>
                </div>
                <div class="flexa tip likeDiv" @click="handleShowLike(item)">
                  <span>{{ item.likeNum || 0 }}</span>
                  <img v-if="item.like_status === 0" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/newlike.png" alt="">
                  <img v-else width="20px" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/newlike1.png" alt="">
                </div>
              </div>
              <div @click="handleReply(item)">
                <div class="price flexs" v-if="item.audio && item.audio.length">
                  <FunAudio :src="item.audio"/>
                </div>
                <div class="price flexs" v-if="item.video && item.video.length">
                  <FunVideo :src="item.video"/>
                </div>
                <div class="price flexs" v-html="item.codeData" v-if="item.codeData"></div>
                <div class="price flexs" v-else>
                  <span class="hideText">{{ item.memo }}</span>
                </div>
                <div class="price flexs" v-if="item.imgArr && item.imgArr.length">
                  <FunImg :imgArr="item.imgArr"/>
                </div>
                <div class="tip time flexa">
                  <span>{{ handleToLocalTime(item.dealTime) }}</span>
                  <span class="reply">{{ $t('fundation.reply') }}</span>
                </div>
              </div>
              <div class="showReply flexa" v-if="!item.showReply && item.replyNum"
                @click="handleShowItemReply(item)">
                <span>{{ $t('fundation.openSubReply', {len: item.replyNum}) }}</span>
                <img src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/showMore.png" alt="">
              </div>
              <div class="replyLists" v-else-if="item.showReply">
                <ReplyLists :listsLen="item.replyNum" :reply="item"
                  @listenCloseSubLists="handleCloseItemReply"/>
              </div>
            </div>
          </div>
        </template>
        <template v-for="(item, index) in pageLists">
          <div class="listOld flexs" :key="index" v-if="!item.isHot">
            <div class="headImg" @click="handleTo(item)">
              <img width="100%" :src="item.accInfo ? item.accInfo.avatar || item.headImg : item.headImg"
                :onerror="errorCoinImg">
            </div>
            <div class="mainContent">
              <div class="flexb">
                <div class="name"  @click="handleTo(item)">
                  <div>{{ (item.accInfo ? item.accInfo.nick || item.fromx : item.fromx) }}</div>
                  <div class="price flexa tip">
                    <span class="">{{ $t('fundation.transNum') }}：</span>
                    <span class="flexc qua dinReg">{{ item.quantity }}({{ item.account }})</span>
                  </div>
                </div>
                <div class="flexa tip likeDiv" @click="handleShowLike(item)">
                  <span>{{ item.likeNum || 0 }}</span>
                  <img v-if="item.like_status === 0" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/newlike.png" alt="">
                  <img v-else width="20px" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/newlike1.png" alt="">
                </div>
              </div>
              <div @click="handleReply(item)">
                <div class="price flexs" v-if="item.audio  && item.audio.length">
                  <FunAudio :src="item.audio"/>
                </div>
                <div class="price flexs" v-if="item.video  && item.video.length">
                  <FunVideo :src="item.video"/>
                </div>
                <div class="price flexs" v-html="item.codeData" v-if="item.codeData"></div>
                <div class="price flexs" v-else>
                  <span class="hideText">{{ item.memo }}</span>
                </div>
                <div class="price flexs" v-if="item.imgArr && item.imgArr.length">
                  <FunImg :imgArr="item.imgArr"/>
                </div>
                <div class="tip time flexa">
                  <span>{{ handleToLocalTime(item.dealTime) }}</span>
                  <span class="reply">{{ $t('fundation.reply') }}</span>
                </div>
              </div>
              <div class="showReply flexa" v-if="!item.showReply && item.replyNum"
                @click="handleShowItemReply(item)">
                <span>{{ $t('fundation.openSubReply', {len: item.replyNum}) }}</span>
                <img src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/showMore.png" alt="">
              </div>
              <div class="replyLists" v-else-if="item.showReply">
                <ReplyLists :listsLen="item.replyNum" :reply="item"
                  @listenCloseSubLists="handleCloseItemReply"/>
              </div>
            </div>
          </div>
        </template>
      </van-list>
    </div>

    <!-- 去捐款 -->
    <el-dialog
      class="mydialog"
      :show-close="false"
      :visible="showToFundation">
      <ToFundation v-if="showToFundation" :reply="reply" @listenClose="handleClose"/>
    </el-dialog>
    <!-- 捐爱心 -->
    <el-dialog
      class="mydialog"
      :show-close="false"
      :visible="showToLike">
      <Like v-if="showToLike" :reply="reply" @listenClose="handleClose"/>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import moment from 'moment';
import {toBrowser, getDateDiff, getCoin, toLocalTime, dealMedia, dealHtmlCode} from '@/utils/public'

import {get_acc_info, get_top3_fundation} from '@/utils/api';
import ReplyLists from './ReplyLists';
import ToFundation from '../dialog/ToFundation';
import Like from '../dialog/Like';
import FunAudio from './FunAudio';
import FunVideo from './FunVideo';
import FunImg from './FunImg';

export default {
  name: 'fundationLists',
  components: {
    ReplyLists,
    ToFundation,
    Like,
    FunAudio,
    FunVideo,
    FunImg,
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
      errorCoinImg: 'this.src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/pig.png"',
      
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
      }],
      showToFundation: false,
      showToLike: false,
      reply: {},
      typeAct: 0,
      top3Arr: [],
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
        this.handleGetAccInfo()
      }
    },
    myFilter(newVal) {
      this.$emit('listenFilter', newVal)
    },
    minFilter(newVal) {
      this.$emit('listenFilterMin', newVal)
    },
    typeAct: {
      handler: function tA() {
        this.handleGetTop3()
      },
      deep: true,
      immediate: true
    },
  },
  methods: {
    async handleGetTop3 () {
      if (this.typeAct) {
        return
      }
      const params = {};
      if (this.scatter && this.scatter.identity) {
        params.user = this.scatter.identity.accounts[0].name;
      }
      const {status, result} = await get_top3_fundation();
      if (!status) {
        return
      }
      const list = result.data || [];
      list.forEach(v => {
        this.$set(v, 'headImg', getCoin(v.account, v.symbol))
        const replyNum = (v.reply_count || 0)
        this.$set(v, 'replyNum', replyNum)
        const t = toLocalTime(v.create_time).replace(/-/g, '/');
        const times = moment(t).valueOf() + 3600 * 8 * 1000;
        this.$set(v, 'dealTime', toLocalTime(times))
        const likeNum = v.like_count * 1000;
        this.$set(v, 'likeNum', likeNum.toFixed(0))
      })
      list.sort((a,b) => {
        return b.eosvalue - a.eosvalue;
      })
      this.top3Arr = list;
      this.handleGetTopAccInfo()
    },
    handleGetAccInfo() {
      // console.log(this.top3Arr)
      // console.log(this.pageLists)
      this.pageLists.forEach((v, index) => {
        let isHot = this.top3Arr.find(vv => vv.id === v.id);
        this.$set(v, 'isHot', !!isHot)
        if (v.isGetInfo) {
          return
        }
        const mediaData = dealMedia(v)
        if (mediaData) {
          this.$set(v, 'memo', mediaData.memo)
          this.$set(v, 'audio', mediaData.audio)
          this.$set(v, 'video', mediaData.video)
          this.$set(v, 'imgArr', mediaData.imgArr || [])
        }
        const codeData = dealHtmlCode(v)
        if (codeData) {
          this.$set(v, 'codeData', codeData.memo)
        }
        this.$set(v, 'isGetInfo', true)
        // console.log(v)
        setTimeout(async () => {
          const {status, result} = await get_acc_info(v.fromx)
          if (!status || !result.owner) {
            return
          }
          this.$set(v, 'accInfo', result)
        }, index * 300);
      })
      // console.log(this.pageLists)
    },
    handleGetTopAccInfo() {
      this.top3Arr.forEach((v, index) => {
        if (v.isGetInfo) {
          return
        }
        const mediaData = dealMedia(v)
        if (mediaData) {
          this.$set(v, 'memo', mediaData.memo)
          this.$set(v, 'audio', mediaData.audio)
          this.$set(v, 'video', mediaData.video)
          this.$set(v, 'imgArr', mediaData.imgArr || [])
        }
        const codeData = dealHtmlCode(v)
        if (codeData) {
          this.$set(v, 'codeData', codeData.memo)
        }
        this.$set(v, 'isGetInfo', true)
        // console.log(v)
        setTimeout(async () => {
          const {status, result} = await get_acc_info(v.fromx)
          if (!status || !result.owner) {
            return
          }
          this.$set(v, 'accInfo', result)
        }, index * 300);
      })
    },
    handleTo(item) {
      this.$router.push({
        name: 'otherInfo',
        params: {
          id: item.fromx
        }
      })
    },
    // 切换类型
    handleChangeAct(index) {
      this.typeAct = index;
      this.$emit('listenActChange', index)
    },
    // 展开更多
    handleShowItemReply(item) {
      this.$set(item, 'showReply', true);
    },
    // 收起更多
    handleCloseItemReply(item) {
      this.$set(item, 'showReply', false);
    },
    // 显示点赞弹窗
    handleShowLike(item) {
      this.reply = item;
      this.showToLike = true
    },
    // 显示回复弹窗
    handleReply(item) {
      this.reply = item;
      this.showToFundation = true
    },
    // 关闭弹窗
    handleClose(type) {
      this.showToFundation = false;
      this.showToLike = false;
      if (type === 'likeSuccess') {
        console.log(type)
      }
    },
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
      background:#29D4B0;
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
      .hotImg{
        width: 34px;
        margin-left: 10px;
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
