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
          <div class="followDiv">
            <span class="fans flexc" v-if="!isFollow" @click="handleFollow">关注</span>
            <span class="follow flexc" v-else @click="showCancel = true">已关注</span>
          </div>
          <!-- <img class="set" @click="$router.push({name: 'setInfo'})"
            src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/set.png" alt=""> -->
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
      </div>
    </div>
    <div class="intro flexa" @click="showInfo = true">{{ accInfo.desc || '暂时没有简介' }}</div>
    <!-- 粉丝 & 资料编辑 -->
    <div class="flexb infoData">
      <div class="flexb numDiv">
        <div @click="handleTo('otherFans')">
          <div class="num dinBold">{{ accFansInfo.fans || 0 }}</div>
          <div>粉丝</div>
        </div>
        <div @click="handleTo('otherFollow')">
          <div class="num dinBold">{{ accFansInfo.follow || 0 }}</div>
          <div>关注</div>
        </div>
        <div>
          <div class="num dinBold">{{visitor_count}}</div>
          <div>访客</div>
        </div>
      </div>
      <!-- 编辑资料 -->
      <!-- <div class="setBtn flexc">编辑资料</div> -->
    </div>
    <el-dialog
      class="mydialog"
      :show-close="false"
      :visible.sync="showCancel">
      <CancelFollow v-if="showCancel" :checkItem="{owner: id}"
        @listenClose="handleClose"/>
    </el-dialog>

    <el-dialog
      class="mydialog"
      :show-close="false"
      :visible.sync="showInfo">
      <DetailInfo :info="accInfo.desc || '暂时没有简介'"/>
    </el-dialog>
  </div>
</template>

<script>
import Bus from '@/utils/bus';
import { mapState } from 'vuex';
import { EosModel } from '@/utils/eos';

import {get_acc_flow_info, get_acc_info, get_acc_lists,
  get_acc_visit, acc_visit_other} from '@/utils/api';
import CancelFollow from '@/views/my/dialog/CancelFollow';
import DetailInfo from '@/components/DetailInfo'

export default {
  name: 'otherAccInfo',
  components: {
    CancelFollow,
    DetailInfo,
  },
  data() {
    return {
      id: '',
      accFansInfo: {},
      accInfo: {
        avatar: "https://cdn.jsdelivr.net/gh/defis-net/material2/coin/tagtokenmain-tag.png",
        cover: "https://cdn.jsdelivr.net/gh/defis-net/material/accBanner/banner0.png",
        desc: "",
        nick: "",
        sex: 2,
      },
      isFollow: false, // 是否关注
      visitor_count: 0,
      showCancel: false,
      showInfo: false,
      isSend: false,
    }
  },
  mounted() {
    this.handleMounted()
  },
  computed: {
    ...mapState({
      scatter: state => state.app.scatter,
    }),
  },
  watch: {
    scatter: {
      handler: function sc (newVal) {
        if (newVal.identity) {
          this.handleGetFollowStatus()
          this.handleAccVisit()
        }
      },
      deep: true,
      immediate: true
    },
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
      this.id = this.$route.params.id;
      this.accInfo = {
        avatar: "https://cdn.jsdelivr.net/gh/defis-net/material2/coin/tagtokenmain-tag.png",
        cover: "https://cdn.jsdelivr.net/gh/defis-net/material/accBanner/banner0.png",
        desc: "",
        nick: "",
        sex: 2,
      },
      this.handleGetInfo()
      this.handleGetAccInfo()
      this.handleGetVisitNum()
      this.handleAccVisit()
    },
    handleClose(type) {
      this.showCancel = false;
      if (type) {
        this.isFollow = false;
      }
    },
    handleTo(name) {
      this.$router.push({
        name,
        params: {
          id: this.id
        }
      })
    },
    onCopy() {
      this.$message.success(this.$t('public.copySuccess'));
    },
    onError() {
      this.$message.error(this.$t('public.copyFail'));
    },
    // 查询我是否关注
    async handleGetFollowStatus() {
      const formName = this.scatter.identity.accounts[0].name;
      const {status, result} = await get_acc_lists(formName, 'followers', this.id);
      if (!status) {
        return;
      }
      const rows = result.rows || [];
      const has = rows.find(v => v.owner === this.id)
      this.isFollow = !!has;
    },
    // 查询他人账户信息
    async handleGetAccInfo() {
      const {status, result} = await get_acc_info(this.id)
      if (!status) {
        return;
      }
      if (!result.owner) {
        return;
      }
      this.accInfo = result;
      Bus.$emit('busForAccInfo', this.accInfo);
    },
    // 查询 他的粉丝 关注数
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
    },
    // 静默接口
    async handleAccVisit() {
      if (!this.scatter || !this.scatter.identity || !this.id || this.isSend) {
        return
      }
      this.isSend = true
      const user = this.id;
      const formName = this.scatter.identity.accounts[0].name;
      await acc_visit_other(formName, user);
    },
    handleFollow() {
      const formName = this.scatter.identity.accounts[0].name;
      const permission = this.scatter.identity.accounts[0].authority;
      
      const params = {
        actions: [{
          account: 'dfscommunity',
          name: 'follow',
          authorization: [{
            actor: formName,
            permission,
          }],
          data: {
            user: formName,
            who: this.id
          },
        }]
      }
      EosModel.toTransaction(params, (res) => {
        if(res.code && JSON.stringify(res.code) !== '{}') {
          this.$message({
            message: res.message,
            type: 'error'
          });
          return
        }
        this.isFollow = true
        this.$message({
          message: '关注成功',
          type: 'success'
        });
      })
    },
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
    padding: 30px 28px 0;
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

    .follow{
      font-size: 28px;
      color: #FFF;
      border: 1px solid #CBCBCB;
      width: 140px;
      height: 56px;
      border-radius: 30px;
    }
    .fans{
      font-size: 28px;
      width: 140px;
      height: 56px;
      border-radius: 30px;
      color: #29D4B0;
      background: #FFF;
    }
  }
  .intro{
    height: 64px;
    line-height: 32px;
    text-align: left;
    position: relative;
    color: #FFF;
    margin: 12px 28px;
    overflow: hidden;
    text-overflow:ellipsis; //溢出用省略号显示
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
}
.infoData{
  margin-top: 20px;
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
