<template>
  <div class="scoreLists">
    <div class="title">{{ $t('bpInfo.accRpy') }}</div>
    <div class="lists">
      <van-list
        v-model="loadingMore"
        :finished="finished"
        :loading-text="$t('public.loading')"
        :finished-text="$t('public.noMore')"
        @load="handleCurrentChange"
      >
        <div class="list flexs" v-for="(v, i) in lists" :key="i" @click="handleToShowRpy(v)">
          <img class="headImg" @click.stop="handleTo(v.user)"
            :src="v.accInfo ? v.accInfo.avatar || v.headImg : v.headImg" :onerror="errImg">
          <div class="main">
            <div class="flexb">
              <div class="accInfo"  @click.stop="handleTo(v.user)">
                <div class="name">{{ (v.accInfo ? v.accInfo.nick || v.user : v.user) }}</div>
                <div class="time tip dinReg">{{ v.dealTime }}</div>
              </div>
              <div class="scoreType">
                <div class="tip">
                  <span v-if="v.targetDeal >= 4.5">{{ $t('bpInfo.starType1') }}</span>
                  <span v-else-if="v.targetDeal >= 4">{{ $t('bpInfo.starType2') }}</span>
                  <span v-else-if="v.targetDeal >= 2">{{ $t('bpInfo.starType3') }}</span>
                  <span v-else-if="v.targetDeal >= 1 ">{{ $t('bpInfo.starType4') }}</span>
                  <span v-else>{{ $t('bpInfo.starType5') }}</span>
                </div>
                <div>
                  <van-rate v-model="v.targetDeal" readonly allow-half
                    void-icon="star" void-color="#DBDBDB" color="#FFC300"/>
                </div>
              </div>
            </div>
            <div class="content">{{ v.memo }}</div>
            <div class="flexa replyDiv tip">
              <span class="flexa">
                <img src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/newlike.png" alt="">
                <span>{{ v.likeNum }}</span>
              </span>
              <span class="flexa right">
                <img src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/reply.png" alt="">
                <span>{{ v.replyNum }}</span>
              </span>
            </div>
          </div>
        </div>
      </van-list>
    </div>

    <van-popup v-model="showRly" 
      class="popup"
      position="bottom">
      <ReplyLists v-if="showRly" :item="item" :accInfo="accInfo"/>
    </van-popup>
  </div>
</template>

<script>
import Bus from '@/utils/bus';
import {getCoin, toLocalTime} from '@/utils/public'
import { get_bp_scores, get_acc_info } from '@/utils/api'
import ReplyLists from '@/views/otherInfo/dialog/ReplyLists';
import moment from 'moment';
export default {
  components: {
    ReplyLists,
  },
  name: '',
  data() {
    return {
      errImg: 'this.src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/pig.png"',
      value: 3,
      bpname: '',
      loadingMore: false,
      finished: false,
      lists: [],
      page: 1,
      pageSize: 20,
      showRly: false,
      item: {},
      accInfo: {},
    }
  },
  mounted() {
    this.bpname = this.$route.params.bpname;
  },
  methods: {
    handleToShowRpy(item) {
      this.item = item;
      this.accInfo = item.accInfo;
      this.showRly = true;
    },
    handleTo(name) {
      this.$router.push({
        name: 'otherInfo',
        params: {
          id: name
        }
      })
    },
    handleCurrentChange() {
      this.handleGetScoreLists()
    },
    async handleGetScoreLists() {
      const params = {
        bp: this.bpname,
        page: this.page,
        limit: this.pageSize
      }
      const {status, result} = await get_bp_scores(params);
      if (!status) {
        return
      }
      Bus.$emit('busStars', result.stars);

      this.loadingMore = false;
      const list = result.data || [];
      list.forEach(v => {
        this.$set(v, 'headImg', getCoin(v.account, v.symbol))
        const replyNum = (v.reply_count || 0)
        this.$set(v, 'replyNum', replyNum)
        const t = toLocalTime(v.create_time).replace(/-/g, '/');
        const times = moment(t).valueOf() + 3600 * 8 * 1000;
        this.$set(v, 'dealTime', toLocalTime(times))
        const targetDeal = v.target0 / 2;
        this.$set(v, 'targetDeal', targetDeal)
        const likeNum = v.like_count * 1000;
        this.$set(v, 'likeNum', likeNum.toFixed(0))
        this.$set(v, 'fromx', v.user)
      })

      if (this.page === 1) {
        this.lists = list;
      } else {
        this.lists.push(...list)
      }
      this.page += 1;
      if (this.lists.length >= result.total || !list.length) {
        this.finished = true;
      }
      this.handleGetTopAccInfo()
    },
    handleGetTopAccInfo() {
      this.lists.forEach((v, index) => {
        if (v.isGetInfo) {
          return
        }
        this.$set(v, 'isGetInfo', true)
        setTimeout(async () => {
          const {status, result} = await get_acc_info(v.user)
          if (!status || !result.owner) {
            return
          }
          this.$set(v, 'accInfo', result)
        }, index * 300);
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.scoreLists{
  text-align: left;
  font-size: 28px;
  padding: 28px 32px;
  .title{
    font-size: 32px;
    font-weight: 500;
    padding-left: 28px;
    position: relative;
    margin-bottom: 20px;
    &::before{
      content: '';
      position: absolute;
      height: 26px;
      width: 8px;
      top: 50%;
      left: 0px;
      transform: translate(0, -45%);
      background: #29D4B0;
      border-radius: 4px;
    }
  }
  .list{
    padding: 26px 0;
    border-bottom: 1px solid rgba(220,220,220, .3);
    &:last-child{
      border-bottom: 0;
    }
    .headImg{
      width: 80px;
      height: 80px;
      border-radius: 50%;
      margin-right: 10px;
    }
    .main{
      flex: 1;
    }
    .name{
      font-size: 30px;
      font-weight: 500;
    }
    .time{
      font-size: 22px;
    }
    .scoreType{
      font-size: 22px;
      /deep/ .van-rate__icon{
        font-size: 20px;
      }
    }
    .content{
      margin-top: 14px;
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
</style>
