<template>
  <div class="dynamic">
    <div class="title">
      <span class="act">动态</span>
    </div>
    <div class="lists">
      <van-list
          v-model="loadingMore"
          :finished="finished"
          :loading-text="$t('public.loading')"
          :finished-text="$t('public.noMore')"
          @load="handleCurrentChange"
        >
        <div class="list flexs" v-for="(item, index) in lists" :key="index" @click="handleShowReply(item)">
          <img class="headImg" :src="accInfo.avatar || item.headImg" :onerror="errorCoinImg">
          <div class="mainData">
            <div class="name">{{accInfo.nick || item.fromx}}</div>
            <div class="num tip dinReg">捐赠数量: {{ item.quantity }} ({{item.account}})</div>
            <div class="content" v-if="item.audio && item.audio.length"><FunAudio :src="item.audio"/></div>
            <div class="content" v-if="item.video && item.video.length"><FunVideo :src="item.video"/></div>
            <div class="content" v-if="item.imgArr && item.imgArr.length">
              <FunImg :imgArr="item.imgArr"/>
            </div>
            <div class="content" v-html="item.codeData" v-if="item.codeData"></div>
            <div class="content" v-else>{{ item.memo }}</div>
            <div class="time tip">{{handleToLocalTime(item.dealTime)}}</div>
            <div class="flexa replyDiv tip">
              <span class="flexa">
                <img src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/newlike.png" alt="">
                <span>{{ item.likeNum }}</span>
              </span>
              <span class="flexa right">
                <img src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/reply.png" alt="">
                <span>{{ item.replyNum }}</span>
              </span>
            </div>
          </div>
        </div>
      </van-list>
    </div>

    <van-popup v-model="showRly" 
      class="popup"
      position="bottom">
      <ReplyLists v-if="showRly" :item="checkItem" :accInfo="accInfo"/>
    </van-popup>
  </div>
</template>

<script>
import Bus from '@/utils/bus';
import moment from 'moment';

import {getDateDiff, getCoin, toLocalTime, dealMedia, dealHtmlCode} from '@/utils/public'
import {get_acc_fund_lists} from '@/utils/api'
import ReplyLists from '../dialog/ReplyLists'
import FunAudio from '@/views/fundation/comp/FunAudio';
import FunVideo from '@/views/fundation/comp/FunVideo';
import FunImg from '@/views/fundation/comp/FunImg';

export default {
  name: 'dynamic',
  components: {
    ReplyLists,
    FunAudio,
    FunVideo,
    FunImg,
  },
  data() {
    return {
      errorCoinImg: 'this.src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/pig.png"',
      id: '',
      loadingMore: false,
      finished: false,
      page: 1,
      pagesize: 20,
      lists: [],
      accInfo: {
        avatar: "https://cdn.jsdelivr.net/gh/defis-net/material2/coin/tagtokenmain-tag.png",
        cover: "https://cdn.jsdelivr.net/gh/defis-net/material/accBanner/banner0.png",
        desc: "",
        nick: "",
        sex: 2,
      },
      showRly: false,
      checkItem: {},
    }
  },
  mounted() {
    Bus.$on('busForAccInfo', (val) => {
      this.accInfo = val;
      // console.log(this.accInfo)
    });
    this.handleMounted()
  },
  watch: {
    '$route': {
      handler: function sc () {
        this.handleMounted()
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    handleMounted() {
      this.showRly = false;
      this.id = this.$route.params.id;
      this.lists = []
      this.page = 1;
      this.finished = false;
      document.documentElement.scrollTop = 9999;
    },
    handleShowReply(item) {
      this.checkItem = item;
      this.showRly = true;
    },
    handleCurrentChange() {
      this.handleGetLists()
    },
    handleToLocalTime(time) {
      let t = moment(`${time}`).valueOf()
      const oDate = getDateDiff(t)
      return oDate
    },
    async handleGetLists() {
      const params = {
        page: this.page,
        limit: this.pagesize,
        user: this.id
      }
      const {status, result} = await get_acc_fund_lists(params)
      if (!status) {
        return
      }
      const rows = result.data || [];
      rows.forEach(v => {
        this.$set(v, 'headImg', getCoin(v.account, v.symbol))
        const replyNum = (v.reply_count || 0)
        this.$set(v, 'replyNum', replyNum)
        const t = toLocalTime(v.create_time).replace(/-/g, '/');
        const times = moment(t).valueOf() + 3600 * 8 * 1000;
        this.$set(v, 'dealTime', toLocalTime(times))
        const likeNum = v.like_count * 1000;
        this.$set(v, 'likeNum', likeNum.toFixed(0))
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
      })
      if (this.page === 1) {
        this.lists = rows;
      } else {
        this.lists.push(...rows)
      }
      this.page += 1;
      this.loadingMore = false;
      if (this.lists.length >= result.total || !rows.length) {
        this.finished = true;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.dynamic{
  font-size: 28px;
  text-align: left;
  background: #FFF;
  position: relative;
  margin-top: -30px;
  // border-radius: 30px;
  overflow: hidden;
  padding: 28px;
  .title{
    font-size: 32px;
    text-align: left;
    margin-bottom: 10px;
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
  .list{
    padding: 20px 0px;
    border-bottom: 1px solid rgba(220, 220, 220, .3);
    .headImg{
      width: 80px;
      height: 80px;
      min-width: 80px;
      border-radius: 40px;
      overflow: hidden;
      margin-right: 15px;
    }
    .name{
      font-size: 30px;
      font-weight: 500;
    }
    .num{
      text-align: left;
      font-size: 24px;
      margin-top: 6px;
      font-weight: normal;
    }
    .content{
      margin: 8px 0 4px;
      overflow: hidden;
      word-break: break-all;
      white-space: pre-wrap;
    }
    .time{
      margin-top: 4px;
      font-size: 20px;
    }
    .replyDiv{
      margin-top: 18px;
      font-size: 22px;
      img{
        width: 32px;
        margin-right: 10px;
      }
      &>span{
        width: 120px;
      }
      .right{
        margin-left: 20px;
      }
    }
  }
}
.popup{
  height: 80%;
  border-radius: 30px 30px 0 0 ;
}
</style>
