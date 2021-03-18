<template>
  <div>
    <div class="lists" v-loading="loading">
      <div class="list" v-for="(item, index) in lists" :key="`reply${index}`">
        <div class="flexa">
          <div class="headImg" @click.stop="handleTo(item.fromx)">
            <img width="100%" :src="item.accInfo ? item.accInfo.avatar || item.headImg : item.headImg"
              :onerror="errorCoinImg">
          </div>
          <div class="mainDiv">
            <div class="flexb">
              <div class="name">
                <div @click.stop="handleTo(item.fromx)">{{ item.accInfo ? item.accInfo.nick || item.fromx : item.fromx }}</div>
                <div class="tip funNum dinReg">{{ $t('fundation.transNum') }}: {{ item.quantity }} ({{ item.account }})</div>
              </div>
              <div class="likeDiv tip flexend" @click="handleShowLike(item)">
                <span>{{ item.likeNum }}</span>
                <img v-if="!item.like_status" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/newlike.png" alt="">
                <img v-else width="20px" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/newlike1.png" alt="">
              </div>
            </div>
          </div>
        </div>

        <div class="memo" @click="handleShowToFundation(item)">
          <span @click.stop="handleTo(item.replyto)">
            <span class="reply">{{ $t('fundation.reply') }}</span>
            <span class="green">{{ item.replyto }}</span>
          </span>
          <div v-html="item.codeData" v-if="item.codeData"></div>
          <span v-else>{{ item.memo }}</span>
          <div class="price flexs" v-if="item.audio && item.audio.length">
            <FunAudio :src="item.audio"/>
          </div>
          <div class="price flexs" v-if="item.video && item.video.length">
            <FunVideo :src="item.video"/>
          </div>
          <div class="price flexs" v-if="item.imgArr && item.imgArr.length">
            <FunImg :imgArr="item.imgArr"/>
          </div>
        </div>
        <div class="time tip flexa" @click="handleShowToFundation(item)">
          <span>{{ handleToLocalTime(item.dealTime) }}</span>
          <span class="reply">{{ $t('fundation.reply') }}</span>
        </div>
      </div>
    </div>
    <div class="showMore flexa" v-if="lists.length < subLen" @click="handleGetMore">
      <span>{{ $t('fundation.more') }}</span>
      <img src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/showMore.png" alt="">
    </div>
    <div class="closeMore flexa" v-else @click="handleCloseMore">
      <span>{{ $t('fundation.close') }}</span>
      <img src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/showMore.png" alt="">
    </div>
    <!-- 去捐款 -->
    <el-dialog
      class="mydialog"
      :show-close="false"
      :visible="showToFundation">
      <ToFundation v-if="showToFundation" :reply="reply" :replyItem="replyItem"
        @listenClose="handleClose"/>
    </el-dialog>
    <!-- 捐爱心 -->
    <el-dialog
      class="mydialog"
      :show-close="false"
      :visible="showToLike">
      <Like v-if="showToLike" :reply="reply" :replyItem="replyItem" @listenClose="handleClose"/>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import moment from 'moment';
import {getDateDiff, toLocalTime, getCoin, dealMedia, dealHtmlCode} from '@/utils/public'

import {get_reply_fundation, get_acc_info} from '@/utils/api'
import Like from '../dialog/Like';
import ToFundation from '../dialog/ToFundation';
import FunAudio from './FunAudio';
import FunVideo from './FunVideo';
import FunImg from './FunImg';

export default {
  name: 'replyLists',
  components: {
    Like,
    ToFundation,
    FunAudio,
    FunVideo,
    FunImg
  },
  props: {
    listsLen: { // 总计多少条回复
      type: Number,
      default: 0
    },
    reply: {
      type: Object,
      default: function rp() {
        return {}
      },
    },
  },
  data() {
    return {
      errorCoinImg: 'this.src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/pig.png"',
      pageSize: 10,
      page: 1,
      lists: [],
      showToLike: false,
      replyItem: {},
      showToFundation: false,
      subLen: 0,
      loading: true,
    }
  },
  mounted() {
    this.handleGetReplyFirst()
  },
  computed: {
    ...mapState({
      scatter: state => state.app.scatter,
    }),
  },
  methods: {
    handleTo(name) {
      this.$router.push({
        name: 'otherInfo',
        params: {
          id: name
        }
      })
    },
    handleToLocalTime(time) {
      let t = moment(`${time}`).valueOf()
      // t += 3600 * 8 * 1000;
      const oDate = getDateDiff(t)
      return oDate
    },
    handleShowToFundation(item) {
      this.replyItem = item;
      this.showToFundation = true;
    },
    handleShowLike(item) {
      this.replyItem = item;
      this.showToLike = true;
    },
    handleClose() {
      this.showToLike = false;
      this.showToFundation = false;
    },
    async handleGetReplyFirst(size = 3) {
      // 第一次展开 获取前3条 - mounted调用
      const params = {
        page: this.page,
        limit: size,
        id: this.reply.global_action_seq
      }
      if (this.scatter && this.scatter.identity) {
        params.user = this.scatter.identity.accounts[0].name;
      }
      const {status, result} = await get_reply_fundation(params)
      // console.log(status, result)
      this.loading = false;
      if (!status) {
        return
      }
      const lists = result.data || [];
      this.subLen = result.total;
      lists.forEach(v => {
        this.$set(v, 'headImg', getCoin(v.account, v.symbol))
        const t = toLocalTime(v.create_time).replace(/-/g, '/');
        const times = moment(t).valueOf() + 3600 * 8 * 1000;
        this.$set(v, 'dealTime', toLocalTime(times))
        const likeNum = v.like_count * 1000;
        this.$set(v, 'likeNum', likeNum.toFixed(0))

        const mediaData = dealMedia(v)
        // console.log(v)
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
      });
      this.lists = lists;
      this.handleGetAccInfo();
    },
    handleGetAccInfo() {
      this.lists.forEach((v, index) => {
        if (v.isGetInfo) {
          return
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
      console.log(this.lists)
    },
    // 点击展开更多时调用
    async handleGetMore() {
      const params = {
        page: this.page,
        limit: 10,
        id: this.reply.global_action_seq
      }
      const {status, result} = await get_reply_fundation(params)
      if (!status) {
        return
      }
      const lists = result.data || [];
      lists.forEach(v => {
        this.$set(v, 'headImg', getCoin(v.account, v.symbol))
        const t = toLocalTime(v.create_time).replace(/-/g, '/');
        const times = moment(t).valueOf() + 3600 * 8 * 1000;
        this.$set(v, 'dealTime', toLocalTime(times))
        const likeNum = v.like_count * 1000;
        this.$set(v, 'likeNum', likeNum.toFixed(0))
      });
      // 调用API获取前10条
      if (this.page === 1) { // 第一页时 - 直接覆盖之前数据
        this.lists = lists
      } else { // 下一页时，在后面插入
        this.lists.push(...lists)
      }
      this.page = this.page + 1;
      this.handleGetAccInfo();
    },
    // 收起弹窗
    handleCloseMore() {
      this.$emit('listenCloseSubLists', this.reply)
    }
  }
}
</script>

<style lang="scss" scoped>
.green{
  color: #29D4B0 !important;
}
.lists{
  .list{
    padding: 20px 0;
    .headImg{
      width: 52px;
      height: 52px;
      overflow: hidden;
      border-radius: 30px;
      margin-right: 8px;
    }
    .likeDiv{
      font-size: 22px;
      img{
        width: 32px;
        margin-left: 8px;
      }
    }
    .mainDiv{
      flex: 1;
      .funNum{
        margin-top: 4px;
        font-size: 22px;
      }
    }
    .memo{
      margin-top: 4px;
      .reply{
        margin: 0 8px 0 0;
      }
      .green{
        margin-right: 8px;
      }
      .price{
        margin-top: 10px;;
      }
    }
    .time{
      margin-top: 4px;
      font-size: 20px;
    }
    .reply{
      color: #999;
      font-size: 26px;
      margin-left: 8px;
      font-weight: 500;
    }
  }
}
.showMore{
  color: #29D4B0;
  margin-top: 8px;
  img{
    width: 20px;
    margin-left: 6px;
  }
}
.closeMore{
  color: #29D4B0;
  margin-top: 8px;
  &>span{
    margin-right: 6px;
  }
  img{
    width: 20px;
    transform: rotate(180deg);
  }
}
</style>
