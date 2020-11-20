<template>
  <div class="accInfo">
    <img class="accBgImg" :src="accInfo.cover">
    <div class="info flexa">
      <div class="headDiv flexc">
        <img class="headImg" :src="accInfo.avatar">
      </div>
      <div style="flex: 1">
        <div class="name flexb">
          <div class="flexa">
            <span>{{ accInfo.nick || id }}</span>
            <img v-if="accInfo.sex == 0" class="sex" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/sex0.png" alt="">
            <img v-if="accInfo.sex == 1" class="sex" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/sex1.png" alt="">
          </div>
          <img class="set" @click="$router.push({name: 'setInfo'})"
            src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/set.png" alt="">
        </div>
        <div class="account flexa">
          <span
            v-clipboard:copy="id"
            v-clipboard:success="onCopy"
            v-clipboard:error="onError">ID: {{ id }}</span>
          <img class="copy"
            v-clipboard:copy="id"
            v-clipboard:success="onCopy"
            v-clipboard:error="onError"
            src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/copy.png" alt="">
        </div>
        <div class="intro" @click="showInfo = true">{{ accInfo.desc || '暂时没有简介' }}</div>
      </div>
    </div>
    <!-- 粉丝 & 资料编辑 -->
    <div class="flexb infoData">
      <div class="flexb numDiv">
        <div @click="$router.push({name: 'fans'})">
          <div class="num dinBold">{{ accFansInfo.fans || 0 }}</div>
          <div>粉丝</div>
        </div>
        <div @click="$router.push({name: 'follow'})">
          <div class="num dinBold">{{ accFansInfo.follow || 0 }}</div>
          <div>关注</div>
        </div>
        <div>
          <div class="num dinBold">{{ visitor_count }}</div>
          <div>访客</div>
        </div>
      </div>
      <!-- 编辑资料 -->
      <!-- <div class="setBtn flexc">编辑资料</div> -->

      <el-dialog
        class="mydialog"
        :show-close="false"
        :append-to-body="true"
        :visible.sync="showInfo">
        <DetailInfo :info="accInfo.desc || '暂时没有简介'"/>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import {get_acc_flow_info, get_acc_visit} from '@/utils/api';
import DetailInfo from '@/components/DetailInfo'

export default {
  name: 'accInfo',
  components: {
    DetailInfo
  },
  data() {
    return {
      id: '',
      accFansInfo: {},
      visitor_count: 0,
      showInfo: false,
    }
  },
  mounted() {
  },
  computed: {
    ...mapState({
      scatter: state => state.app.scatter,
      accInfo: state => state.app.accInfo,
    }),
  },
  watch: {
    scatter: {
      handler: function sc (newVal) {
        if (newVal.identity) {
          this.id = newVal.identity.accounts[0].name;
          this.handleGetInfo()
          this.handleGetVisitNum()
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    onCopy() {
      this.$message.success(this.$t('public.copySuccess'));
    },
    onError() {
      this.$message.error(this.$t('public.copyFail'));
    },
    async handleGetInfo() {
      const {status, result} = await get_acc_flow_info(this.id)
      if (!status) {
        return;
      }
      this.accFansInfo = result;
    },
    // 访客数量
    async handleGetVisitNum() {
      const user = this.id;
      const {status, result} = await get_acc_visit(user);
      if (!status) {
        return
      }
      this.visitor_count = result.visitor_count || 0;
    }
  }
}
</script>

<style lang="scss" scoped>
.accInfo{
  font-size: 24px;
  height: 408px;
  position: relative;
  .accBgImg{
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0%;
    top: 0%;
  }
  .info{
    position: relative;
    padding: 46px 28px 0;
    color: #FFF;
    text-align: left;
    .headDiv{
      background: #FFF;
      border-radius: 70px;
      width: 140px;
      min-width: 140px;
      height: 140px;
      margin-right: 28px;
    }
    .headImg{
      width: 84px;
      height: 84px;
      border-radius: 50px;
    }
    .name{
      font-size: 40px;
      font-weight: 500;
      .sex{
        width: 46px;
        margin-left: 10px;
      }
      .set{
        width: 44px;
      }
    }
    .account{
      margin-bottom: 8px;
      .copy{
        width: 24px;
        margin-left: 10px;
      }
    }
    .intro{
      height: 64px;
      line-height: 32px;
      text-align: left;
      position: relative;
      color: #FFF;
      overflow: hidden;
      text-overflow:ellipsis; //溢出用省略号显示
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }
  }
}
.infoData{
  margin-top: 30px;
  position: relative;
  z-index: 1;
  color: #FFF;
  font-size: 28px;
  padding: 0 28px;
  .num{
    font-size: 40px;
    margin-bottom: 8px;
  }
  .numDiv{
    flex: 1;
    &>div{
      flex: 1;
      text-align: center;
      // margin-right: 60px;
    }
  }
  .setBtn{
    height: 60px;
    border: 1px solid #FFF;
    border-radius: 30px;
    padding: 0 36px;
  }
}
</style>
