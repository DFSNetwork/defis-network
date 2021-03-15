<template>
  <div class="farmDetail">
    <div class="farmInfo">
      <img class="bgImg" :src="farmInfo.bg || 'https://cdn.jsdelivr.net/gh/defis-net/material2/dfs/farmDefaultBg.png'" />
      <div class="template">
        <div class="flexa">
          <img class="headImg" :src="farmInfo.avatar" />
          <div>
            <div class="name">{{ farmInfo.farm_name || dName }}</div>
            <div class="intro">{{ farmInfo.slogon || '-' }}</div>
          </div>
        </div>
        <!-- 农场主信息 -->
        <div class="accInfo flexb">
          <div class="flexa">
            <div class="subAccHead flexa">
              <img
                class="subAccHeadImg"
                v-for="(v, i) in showTop3"
                :key="`subImg${i}`"
                :src="v.avatar"
              />
            </div>
            <div>{{ farmInfo.farmers }}/50{{ $t('invite.people') }}</div>
          </div>
        </div>
        <div class="flexb">
          <div class="total">
            <div class="num din">${{ parseFloat(farmInfo.wealth).toFixed(4) }} </div>
            <div>{{ $t('invite.farmWealth') }}</div>
          </div>
          <!-- 操作按钮 -->
          <div class="btnDiv flexa">
            <div class="btn flexc"
              @click="handleTo('farmEdit')"
              v-if="account.name === dName">
              <img class="icon"
                src="https://cdn.jsdelivr.net/gh/defis-net/material2/dfs/edit.png" />
              <span>{{ $t('invite.edit') }}</span>
            </div>
            <div class="btn flexc" @click="showShare = true">
              <img class="icon"
                src="https://cdn.jsdelivr.net/gh/defis-net/material2/dfs/edit.png" />
              <span>{{ $t('invite.share') }}</span>
            </div>
            <div class="btn flexc" v-if="joinName !== dName && account.name !== dName" @click="handleAddFarm(farmInfo)">
              <span>{{ $t('invite.join') }}</span>
            </div>
            <div class="btn red flexc" v-if="joinName === dName" @click="showLeave = true">
              <span>{{ $t('invite.leave') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 倒计时 & 收益 -->
    <div class="rewardDiv">
      <div class="unClaim flexc" v-if="!standard" @click="showClaimTip = true">
        {{ $t('invite.errTip2') }}
      </div>
      <div class="cut">
        <div class="time flexa">
          <span>{{ $t('invite.endTime') }}：</span>
          <span class="timeNum din flexa">
            <span class="flexa">
              <span>{{ tTimes.days }}</span>
              <span class="sm">{{ $t('invite.days') }}</span>
            </span>
            <span class="flexa">
              <span>{{ tTimes.hours }}</span>
              <span class="sm">{{ $t('invite.hours') }}</span>
            </span>
            <span class="flexa">
              <span>{{ tTimes.minutes }}</span>
              <span class="sm">{{ $t('invite.minutes') }}</span>
            </span>
            <span class="flexa">
              <span>{{ tTimes.seconds }}</span>
              <span class="sm">{{ $t('invite.seconds') }}</span>
            </span>
          </span>
        </div>
        <div class="percent">
          <img class="percentImg" :style="`transform: translateX(${tTimes.percent}%);`"
            src="https://cdn.jsdelivr.net/gh/defis-net/material2/icon/percentImg.png"
          />
        </div>
        <div class="small green_p">{{ $t('invite.doing') }}</div>
      </div>
      <div class="about flexb">
        <div>
          <div class="tip flexa">
            <span>{{ $t('invite.aboutReward') }}</span>
            <img class="tipIcon" @click="showClaimTip = true"
              src="https://cdn.jsdelivr.net/gh/defis-net/material2/dfs/tipIcon.png"
            />
          </div>
          <div class="num dinBold">
            <span>{{ aboutReward }}</span> 
            <span class="tip ml">(${{ aboutRewardU }})</span>
          </div>
        </div>
        <div class="claimBtn flexc" v-if="account.name === dName" @click="handleClaim">{{ $t('invite.claim') }}</div>
      </div>
    </div>

    <div class="tabs flexb">
      <div class="tab" :class="{ act: act === 0 }" @click="act = 0">
        {{ $t('invite.farmUsers') }}
      </div>
      <div class="tab" :class="{ act: act === 1 }" @click="act = 1">
        {{ $t('invite.farmDesc') }}
      </div>
    </div>

    <FarmLists
      v-if="act === 0"
      :farmerInfo="farmerInfo"
      :subFarmers="subFarmers"
      :farmInfo="farmInfo"
    />
    <Intro v-else :intro="farmInfo.desc" />

    <van-popup v-model="showShare" class="popup_p">
      <InviteDia @listenClose="handleClose" />
    </van-popup>
    <van-popup v-model="showLeave" class="popup_p">
      <Leave @listenClose="handleClose" />
    </van-popup>
    <van-popup v-model="showClaimTip" class="popup_p">
      <ClaimTip @listenClose="handleClose" />
    </van-popup>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { DApp } from '@/utils/wallet';
import moment from 'moment'

import Intro from "../comp/Intro";
import FarmLists from "../comp/FarmLists";
import InviteDia from "../dialog/InviteDia";
import Leave from "../dialog/Leave";
import ClaimTip from "../dialog/ClaimTip";

import { get_acc_info } from "@/utils/api";
import { countdown } from '@/utils/public';

export default {
  name: "farmDetail",
  components: {
    Intro,
    FarmLists,
    InviteDia,
    Leave,
    ClaimTip,
  },
  data() {
    return {
      act: 0,
      showShare: false,
      showLeave: false,
      showClaimTip: false,
      dName: "",
      farmInfo: {},
      farmerInfo: {},
      joinName: "",
      subFarmers: [],
      showTop3: [],

      // 收益处理
      nextObj: {},
      timer: null,
      tTimes: {
        days: 0,
        hours: '00',
        minutes: '00',
        seconds: '00',
        total: 0
      },
    };
  },
  mounted() {
    this.dName = this.$route.params.name;
    this.handleGetFarmInfo();
    this.handleGetFarmerInfo();
    this.handleGetSubFarms();
    this.handleGetNext()
  },
  computed: {
    ...mapState({
      account: (state) => state.app.account,
      coinPrices: (state) => state.sys.coinPrices,
    }),
    standard() {
      if (parseFloat(this.farmInfo.wealth) > 10000) {
        return true
      }
      return false
    },
    ableClaim() {
      let accClaimTime = 0;
      if (this.farmInfo.last_drip) {
        accClaimTime = moment(`${this.farmInfo.last_drip}.000+0000`).valueOf()
      }
      const sysStartTime = this.nextObj.startTimes || 0;
      return accClaimTime < sysStartTime
    },
    aboutReward() {
      let u = parseFloat(this.nextObj.unit || 0) * parseFloat(this.farmInfo.wealth || 0)
      let r = parseFloat(u || 0)
      return parseFloat(r || 0).toFixed(8)
    },
    aboutRewardU() {
      let u = parseFloat(this.nextObj.unit || 0) * parseFloat(this.farmInfo.wealth || 0)
      const tagPrice = this.coinPrices.find(v => v.coin === 'TAG').price || 0;
      let r = parseFloat(u || 0) * parseFloat(tagPrice || 0)
      return parseFloat(r || 0).toFixed(4)
    }
  },
  watch: {
    account: {
      handler: function at(newVal) {
        if (!newVal.name) {
          return;
        }
        this.handleGetJoin();
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    // 领取收益
    handleClaim() {
      if (!this.ableClaim) {
        this.$toast.fail('您已领取过了')
        return
      }
      const name = this.account.name;
      const permission = this.account.permissions;
      const params = {
        actions: [{
          account: 'farms.tag',
          name: 'claim',
          authorization: [{
            actor: name, // 转账者
            permission,
          }],
          data: {
            farmer: name,
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
        setTimeout(() => {
          this.handleGetJoin()
          this.handleGetSubFarms()
          this.handleGetFarmInfo()
        }, 3000);
      })
    },
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
    // 获取农场信息
    async handleGetFarmInfo() {
      const params = {
        json: true,
        limit: 10,
        code: "farms.tag",
        scope: "farms.tag",
        table: "farms",
        lower_bound: ` ${this.dName}`,
        upper_bound: ` ${this.dName}`,
      };
      const { status, result } = await this.$api.get_table_rows(params);
      if (!status) {
        return;
      }
      const rows = result.rows || [];
      if (!rows.length) {
        return;
      }
      this.farmInfo = rows[0];
    },
    // 获取农场主信息
    async handleGetFarmerInfo() {
      const { status, result } = await get_acc_info(this.dName);
      if (!status) {
        return;
      }
      this.farmerInfo = result;
    },
    // 获取农场下成员列表
    async handleGetSubFarms() {
      const params = {
        json: true,
        limit: 1000,
        code: "farms.tag",
        scope: ` ${this.dName}`,
        table: "members",
      };
      const { status, result } = await this.$api.get_table_rows(params);
      if (!status) {
        return;
      }
      const rows = result.rows || [];
      rows.sort((a, b) => {
        return parseFloat(b.wealth || 0) - parseFloat(a.wealth || 0);
      });
      this.subFarmers = rows;
      this.handleGetSubFarmersInfo();
    },
    // 轮训获取farms信息
    async handleGetSubFarmersInfo() {
      let maxLen = this.subFarmers.length;
      let i = 0;
      const dArr = JSON.parse(JSON.stringify(this.subFarmers));
      while (i < maxLen) {
        const { status, result } = await get_acc_info(dArr[i].owner);
        i = i + 1;
        if (!status) {
          continue;
        }
        dArr[i - 1] = Object.assign({}, dArr[i - 1], result);
      }
      this.subFarmers = dArr;
      this.showTop3 = dArr.slice(0, 3);
    },
    // 获取下一次结算时间
    async handleGetNext() {
      const params = {
        json: true,
        limit: 1000,
        code: "fund.tag",
        scope: "fund.tag",
        table: "ages",
        reverse: true,
      };
      const {status, result} = await this.$api.get_table_rows(params);
      if (!status) {
        return
      }
      const rows = result.rows || [];
      if (!rows.length) {
        return
      }
      const row = rows[0]
      const times = moment(`${row.start_time}.000+0000`).valueOf();
      const endTimes = times + (1000 * 60 * 60 * 24 * 7);
      row.startTimes = times;
      row.endTimes = endTimes;
      this.nextObj = row;
      this.handleDealCut()
    },
    // 计算倒计时
    handleDealCut() {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.handleDealCut()
      }, 1000);
      const t = countdown((this.nextObj.endTimes / 1000), true)
      const percent = 100 - (t.total / (1000 * 60 * 60 * 24 * 7) * 100)
      t.percent = percent;
      this.tTimes = t;
      if (this.tTimes.total < 0) {
        this.handleGetNext()
      }
    },
    // 加入农场
    handleAddFarm(v) {
      if (this.joinName) {
        this.$toast.fail(this.$t('invite.errTip1'))
        return
      }
      const name = this.account.name;
      const permission = this.account.permissions;
      const params = {
        actions: [{
          account: 'farms.tag',
          name: 'join',
          authorization: [{
            actor: name, // 转账者
            permission,
          }],
          data: {
            farmer: name,
            farm: v.owner,
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
        setTimeout(() => {
          this.handleGetJoin()
          this.handleGetSubFarms()
          this.handleGetFarmInfo()
        }, 3000);
      })
    },
    // 关闭弹窗
    handleClose(type) {
      this.showShare = false;
      this.showLeave = false;
      this.showClaimTip = false;
      if (type) {
        setTimeout(() => {
          this.handleGetJoin()
          this.handleGetSubFarms()
          this.handleGetFarmInfo()
        }, 3000);
      }
    },
    // 路由跳转
    handleTo(name, params) {
      this.$router.push({
        name,
        params,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.farmDetail {
  .farmInfo {
    position: relative;
    height: 500px;
    width: 100%;
    overflow: hidden;
    .bgImg {
      position: relative;
      margin-left: -5%;
      width: 110%;
    }
    .template {
      position: absolute;
      z-index: 1;
      top: 0px;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.3);
      color: #fff;
      padding: 35px 28px 28px;
      font-size: 24px;
      text-align: left;
      .headImg {
        width: 100px;
        height: 100px;
        border-radius: 4px;
        // background: #f5f5f5;
        margin-right: 18px;
      }
      .name {
        font-size: 34px;
        font-weight: 500;
      }
      .intro {
        width: 300px;
        overflow: hidden;
        text-overflow: ellipsis; //溢出用省略号显示
        white-space: nowrap; //溢出不换行
      }
      .total{
        font-size: 24px;
        .num{
          margin-bottom: 8px;
          font-size: 32px;
        }
      }
      .btnDiv {
        // margin: 36px 0;
        .icon {
          width: 32px;
          margin-right: 16px;
        }
        .btn {
          margin-right: 20px;
          background: $color-main;
          color: #fff;
          font-size: 28px;
          width: 152px;
          height: 60px;
          border-radius: 8px;
          &.red {
            background: $color-red;
          }
          &:last-child{
            margin-right: 0;
          }
        }
      }
    }
    .accInfo {
      text-align: left;
      margin: 28px 0;
      min-height: 70px;
      .accHeadImg {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        overflow: hidden;
        margin-right: 20px;
        background: #fff;
      }
      .nick {
        font-size: 28px;
        margin-bottom: 8px;
      }
      .farmerImg {
        width: 68px;
      }
      .subAccHead {
        margin-right: 25px;
        .subAccHeadImg {
          width: 52px;
          height: 52px;
          border-radius: 30px;
          overflow: hidden;
          position: relative;
          margin-left: -5px;
          background: #fff;
          border: 1px solid $color-border;
          &:first-child {
            margin-left: 0px;
          }
        }
      }
    }
  }
  .rewardDiv {
    position: relative;
    z-index: 2;
    margin: -120px auto 20px;
    height: 300px;
    width: 690px;
    background-image: url("https://cdn.jsdelivr.net/gh/defis-net/material2/dfs/rewardBg.png");
    background-repeat: no-repeat;
    background-size: contain;
    padding: 20px 26px 34px;
    box-sizing: border-box;
    border-radius: 16px;
    overflow: hidden;
    .unClaim {
      position: absolute;
      z-index: 2;
      top: 5px;
      left: 5px;
      right: 10px;
      bottom: 0;
      font-size: 26px;
      color: #ff4d4d;
      background: rgba(#fff, 0.6);
    }
    .cut {
      border-bottom: 1px solid $color-border;
      text-align: left;
      .time {
        font-size: 24px;
        margin-bottom: 20px;
        .sm {
          font-size: 24px;
          line-height: 36px;
          margin: 2px 8px 0;
        }
        .timeNum {
          font-size: 30px;
        }
      }
      .percent {
        background: #f5f5f5;
        border-radius: 12px;
        height: 16px;
        overflow: hidden;
        .percentImg {
          width: 100%;
          display: block;
          position: relative;
          margin-left: -100%;
          transform: translateX(0%);
        }
      }
      .small {
        font-size: 24px;
        margin: 20px auto;
      }
    }
    .about {
      padding-top: 20px;
      font-size: 28px;
      text-align: left;
      .tipIcon {
        width: 28px;
        margin-left: 15px;
      }
      .num {
        font-size: 36px;
        margin-top: 4px;
        .ml{
          margin-left: 10px;
          font-size: 26px;
        }
      }
      .claimBtn {
        background: $color-main;
        color: #fff;
        border-radius: 8px;
        width: 140px;
        height: 64px;
      }
    }
  }
  .tabs {
    margin: 30px 80px 48px;
    .tab {
      flex: 1;
      text-align: center;
      font-size: 36px;
      font-weight: 600;
      position: relative;
      &.act {
        &::after {
          content: "";
          position: absolute;
          width: 112px;
          height: 16px;
          background: linear-gradient(142deg, #7fffd3 0%, #04c994 100%);
          left: 50%;
          top: 65%;
          transform: translateX(-50%);
          z-index: -1;
          border-radius: 3px;
        }
      }
    }
  }
}
.popup_p {
  max-width: 692px;
  width: 692px;
  border-radius: 20px;
}
</style>
