<template>
  <div class="signMain">
    <div class="title flexa">
      <span>{{ $t('invite.subTip2') }}</span>
      <img @click="showRules = true" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/tips_icon_btn.svg">
    </div>
    <div class="signTip">{{ $t('invite.signLimitNum') }}：${{ parseFloat(rewardInfo.limit || 0).toFixed(2) }}</div>
    <div class="coinTotal flexc">{{ $t('invite.lessBal') }}</div>
    <div class="percentDiv flexc">
      <span class="dinBold num">{{ rewardInfo.bal || '-' }}</span>
      <span class="small" v-if="rewardInfo.symbol">{{ rewardInfo.symbol }}</span>
    </div>

    <div class="signIn" v-if="!accInfo.isSigned || joinName !== dName">
      <div class="unSign">
        <div class="subTi">{{ $t('invite.todaySign') }}</div>
        <img src="https://cdn.jsdelivr.net/gh/defis-net/material2/farm/rewardIcon.png">
        <div class="tip">{{ rewardInfo.reward || '-' }}</div>
      </div>
      <div class="signInBtn flexc" v-if="joinName === dName"
        @click="handleSign">{{ $t('invite.signNow') }}</div>
      <div class="signInBtn flexc disabled" v-else>{{ $t('invite.unJoin') }}</div>
    </div>
    <div class="signIn" v-else-if="accInfo.joinNow">
      <div class="unSign">
        <div class="subTi">{{ $t('invite.todaySign') }}</div>
        <img src="https://cdn.jsdelivr.net/gh/defis-net/material2/farm/rewardIcon.png">
        <div class="tip">{{ rewardInfo.reward }}</div>
      </div>
      <div class="signInBtn flexc disabled">{{ $t('invite.wait') }}</div>
    </div>
    <div class="signIn" v-else>
      <div class="signed">
        <div class="subTi2">{{ $t('invite.signSuccess') }}</div>
        <div class="tip2">{{ $t('invite.getReward', {num: rewardInfo.reward}) }}</div>
        <img src="https://cdn.jsdelivr.net/gh/defis-net/material2/farm/signed.png">
      </div>
      <div class="signInBtn flexc disabled">{{ $t('invite.signed') }}</div>
    </div>

    <van-popup class="popup_p" v-model="showRules">
      <SignTip />
    </van-popup>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { DApp } from '@/utils/wallet';
import SignTip from '../dialog/SignTip';
import { toLocalTime, getMarketTimeLp } from '@/utils/public';
export default {
  name: 'signMain',
  props: {
    rewardInfo: {
      type: Object,
      default: function ri() {
        return {}
      }
    }
  },
  components: {
    SignTip
  },
  data() {
    return {
      isSigned: false,
      showRules: false,
      dName: '',
      joinName: "",
      accInfo: {},
    }
  },
  created() {
    this.dName = this.$route.params.name;
  },
  computed: {
    ...mapState({
      account: (state) => state.app.account,
    }),
  },
  watch: {
    account: {
      handler: function at(newVal) {
        if (!newVal.name) {
          return;
        }
        this.handleGetJoin();
        this.handleGetAccInfo()
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    // 获取用户已加入农场关系
    async handleGetJoin() {
      const name = this.account.name;
      const params = {
        json: true,
        limit: 10,
        code: "farms.tag",
        scope: "farms.tag",
        table: "relation",
        lower_bound: ` ${name}`,
        upper_bound: ` ${name}`,
      };
      const { status, result } = await this.$api.get_table_rows(params);
      if (!status) {
        this.joinName = "";
        return;
      }
      const rows = result.rows || [];
      if (!rows.length) {
        this.joinName = "";
        return;
      }
      this.joinName = rows[0].join_farm;
    },
    // 获取用户签到数据
    async handleGetAccInfo() {
      const name = this.account.name;
      const dName = this.$route.params.name;
      if (!name || !dName) {
        return
      }
      const params = {
        json: true,
        limit: 100,
        code: "farms.tag",
        scope: ` ${dName}`,
        table: "members",
        upper_bound: ` ${name}`,
        lower_bound: ` ${name}`,
      };
      const { status, result } = await this.$api.get_table_rows(params);
      if (!status || !result.rows.length) {
        return
      }
      const rows = result.rows || [];
      rows.forEach((v) => {
        const time = toLocalTime(`${v.update_time}.000+0000`)
        const times = getMarketTimeLp(time)
        // 已签到
        if (times.total < 3600 * 23 * 1000) {
          this.$set(v, 'isSigned', true)
          this.isSignNum += 1;
        }
        // 可签到
        if (times.total > 3600 * 23 * 1000) {
          this.$set(v, 'abledSign', true)
        }
        // 可代签
        if (times.total > 3600 * 27 * 1000) {
          this.$set(v, 'abledSignForOther', true)
        }
        // 可代签
        if (v.update_time === v.join_time) {
          this.$set(v, 'joinNow', true)
        }
      })
      this.accInfo = rows[0];
    },
    handleSign() {
      const name = this.account.name;
      if (!name) {
        return
      }
      const permission = this.account.permissions;
      const params = {
        actions: [{
          account: 'farms.tag',
          name: 'checkin',
          authorization: [{
            actor: name, // 转账者
            permission,
          }],
          data: {
            farmer: name,
            helper: name,
          }
        }]
      }
      DApp.toTransaction(params, (err) => {
        if (err && err.code === 402) {
          return;
        }
        if (err) {
          this.$toast({
            type: 'fail',
            message: err.message,
          })
          return;
        }
        this.$toast({
          type: 'success',
          message: 'Success'
        })
        this.$emit('listenUpdate', 'signSuccess')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.signMain{
  font-size: 32px;
  box-shadow: 0px 0px 8px 2px rgba(211,211,211,0.54);
  margin: 0 30px;
  background: #FFF;
  border-radius: 12px;
  position: relative;
  margin-top: -160px;
  padding: 28px 30px;
  text-align: left;
  .title{
    img{
      width: 32px;
      margin-left: 15px;
    }
  }
  .signTip{
    color: $color-tip;
    font-size: 28px;
    margin: 8px 0 28px;
  }
  .coinTotal{
    width: 160px;
    margin: auto;
    height: 64px;
    position: relative;
    background: #FE7A04;
    color: #FFF;
    font-size: 30px;
    border-radius: 8px;
    &::after{
      position: absolute;
      content: '';
      height: 20px;
      width: 20px;
      background: #FE7A04;
      left: 50%;
      bottom: 0;
      transform: translate(-50%, 50%) rotate(45deg);
    }
  }
  .percentDiv{
    margin-top: 38px;
    .num{
      font-size: 64px;
    }
    .small{
      font-size: 28px;
      color: #999;
      margin-left: 20px;
    }
  }
  .signIn{
    margin-top: 55px;
    text-align: center;
    .unSign{
      width: 300px;
      background: #FFF6DE;
      border-radius: 12px;
      margin: auto;
      padding: 30px;
      box-sizing: border-box;
      .subTi{
        font-size: 36px;
        color: #707073;
      }
      img{
        margin: 34px 0;
        width: 80px;
      }
    }
    .signInBtn{
      height: 96px;
      background: linear-gradient(137deg, #FFB722 0%, #FFAA00 100%);
      border-radius: 48px;
      color: #FFF;
      font-size: 36px;
      margin-top: 26px;
      &.disabled{
        color: #999;
        background: #EFEFEF;
      }
    }
    .signed{
      width: 300px;
      background: #FFAC00;
      border-radius: 12px;
      margin: auto;
      padding: 30px 0 0;
      box-sizing: border-box;
      text-align: right;
      .subTi2{
        text-align: center;
        color: #FFF;
      }
      .tip2{
        text-align: center;
        color: #FFF;
        font-weight: 300;
      }
      img{
        margin-top: 20px;
        position: relative;
        width: 220px;
      }
    }
  }
}
</style>
