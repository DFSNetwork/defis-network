<template>
  <div class="replyLists">
    <img class="close" @click="handleClose(false)"
      src="https://cdn.jsdelivr.net/gh/defis-net/material/svg/sd_icon_btn.svg">
    <div class="title">TA的动态</div>
    <div class="mainContent">
      <div class="list flexs">
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
            <span class="flexa" @click="handleMainLike">
              <img src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/newlike.png" alt="">
              <span>{{ item.likeNum }}</span>
            </span>
            <span class="flexa right" @click="handleMainReply">
              <img src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/reply.png" alt="">
              <span>{{ item.replyNum }}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="lists">
      <div class="subTitle">全部回复</div>

      <div class="noDate tip" v-if="!lists.length">
        <img src="https://cdn.jsdelivr.net/gh/defis-net/material/noData/noData1.png" alt="">
        <div>暂时没有评论哦</div>
      </div>

      <div class="reList" v-for="(item, index) in lists" :key="`reply${index}`">
        <div class="flexs">
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

            <div class="memo" @click="handleShowToFundation(item)">
              <span @click.stop="handleTo(item.replyto)">
                <span class="reply">{{ $t('fundation.reply') }}</span>
                <span class="green">{{ item.replyto }}</span>
              </span>
              <span>{{ item.memo }}</span>
              <div class="content" v-if="item.audio"><FunAudio :src="item.audio"/></div>
              <div class="content" v-if="item.video"><FunVideo :src="item.video"/></div>
            </div>
            <div class="time tip flexa" @click="handleShowToFundation(item)">
              <span>{{ handleToLocalTime(item.dealTime) }}</span>
              <span class="reply">{{ $t('fundation.reply') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 回复弹窗 & 点赞弹窗 -->
    <!-- 去捐款 -->
    <van-popup
      class="popup"
      v-model="showToFundation">
      <ToFundation v-if="showToFundation" :reply="item" :replyItem="replyItem"
        @listenClose="handleClose"/>
    </van-popup>
    <!-- 捐爱心 -->
    <van-popup
      class="popup"
      v-model="showToLike">
      <Like v-if="showToLike" :reply="item" :replyItem="replyItem" @listenClose="handleClose"/>
    </van-popup>
  </div>
</template>

<script>
import moment from 'moment';
import {getDateDiff, getCoin, toLocalTime, dealMedia, dealHtmlCode} from '@/utils/public'
import {get_reply_fundation, get_acc_info} from '@/utils/api'
import Like from '@/views/fundation/dialog/Like';
import ToFundation from '@/views/fundation/dialog/ToFundation';
import FunAudio from '@/views/fundation/comp/FunAudio';
import FunVideo from '@/views/fundation/comp/FunVideo';
import FunImg from '@/views/fundation/comp/FunImg';

export default {
  name: 'otherRpyLists',
  components: {
    Like,
    ToFundation,
    FunAudio,
    FunVideo,
    FunImg,
  },
  props: {
    item: {
      type: Object,
      default: function it() {
        return {}
      }
    },
    accInfo: {
      type: Object,
      default: function it() {
        return {}
      }
    }
  },
  data() {
    return {
      errorCoinImg: 'this.src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/pig.png"',
      lists: [],
      showToLike: false,
      showToFundation: false,
      reply: {},
      replyItem: {},
    }
  },
  mounted() {
    this.handleGetMore()
  },
  methods: {
    handleClose() {
      this.showToLike = false;
      this.showToFundation = false;
    },
    handleTo(name) {
      this.$router.push({
        name: 'otherInfo',
        params: {
          id: name
        }
      })
    },
    handleMainLike() {
      this.replyItem = {};
      this.showToLike = true;
    },
    handleMainReply() {
      this.replyItem = {};
      this.showToFundation = true;
    },
    handleShowToFundation(item) {
      this.replyItem = item;
      this.showToFundation = true;
    },
    handleShowLike(item) {
      this.replyItem = item;
      this.showToLike = true;
    },
    handleToLocalTime(time) {
      let t = moment(`${time}`).valueOf()
      const oDate = getDateDiff(t)
      return oDate
    },
    async handleGetMore() {
      const params = {
        page: this.page,
        limit: 10,
        id: this.item.global_action_seq
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
      });
      // 调用API获取前10条
      if (this.page === 1) { // 第一页时 - 直接覆盖之前数据
        this.lists = lists
      } else { // 下一页时，在后面插入
        this.lists.push(...lists)
      }
      // console.log(this.lists)
      this.page = this.page + 1;
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
          console.log(result)
          this.$set(v, 'accInfo', result)
        }, index * 300);
      })
      // console.log(this.lists)
    },
  }
}
</script>

<style lang="scss" scoped>
.replyLists{
  position: relative;
  padding: 28px 0;
  color: #333;
  font-size: 28px;
  .close{
    position: absolute;
    top: 32px;
    right: 32px;
    width: 26px;
  }
  .title{
    text-align: center;
    font-size: 40px;
    font-weight: 500;
  }
  .mainContent{
    padding: 28px;
    border-bottom: 20px solid #f6f6f6;
  }
  .list{
    // padding: 20px 0px;
    // border-bottom: 1px solid rgba(220, 220, 220, .3);
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

  .lists{
    padding: 28px;
    .subTitle{
      font-weight: 500;
    }
    .noDate{
      text-align: center;
      img{
        width: 400px;
      }
    }
    .green{
      color: #29D4B0 !important;
    }
    .reList{
      padding: 20px 0;
      .headImg{
        width: 80px;
        height: 80px;
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
}
.popup{
  width: 690px;
  border-radius: 12px ;
}
</style>