<template>
  <div class="farmDetail">
    <div class="farmInfo">
      <img class="bgImg" :src="farmInfo.bg || 'https://cdn.jsdelivr.net/gh/defis-net/material2/dfs/farmDefaultBg.png'" />
      <div class="template">
        <div class="flexb">
          <div class="flexa topDiv">
            <img class="headImg" :src="farmInfo.avatar || $defaultAccImg" :onerror="$defaultAccImg" />
            <div>
              <div class="name">{{ farmInfo.farm_name || dName }}</div>
              <div class="intro">{{ farmInfo.slogon || '-' }}</div>
            </div>
          </div>
          <div class="flexa tools">
            <img @click="showShare = true" src="https://cdn.jsdelivr.net/gh/defis-net/material2/farm/invite.png" alt="">
            <van-popover v-model="showPopover"
              v-if="joinName === dName || account.name === dName"
              placement="bottom-end"
              trigger="click">
              <div class="setPopover">
                <div class="nav flexc" v-if="account.name === dName"
                  @click="handleTo('farmEdit')">{{ $t('invite.farmInfoSet') }}</div>
                <div class="nav flexc" v-if="account.name === dName"
                  @click="handleTo('setSign')">{{ $t('invite.signSet') }}</div>
                <div class="nav flexc red" v-if="joinName === dName"
                  @click="showLeave = true">{{ $t('invite.leave') }}</div>
              </div>
              <template #reference>
                <img class="settingImg" src="https://cdn.jsdelivr.net/gh/defis-net/material2/farm/setting1.png" alt="">
              </template>
            </van-popover>
          </div>
        </div>
        <!-- 联系 & 签到 -->
        <div class="flexb signDiv">
          <div class="linkDiv">
            <img v-if="farmInfo.wx" class="linkImg"
              v-clipboard:copy="farmInfo.wx"
              v-clipboard:success="onCopy"
              v-clipboard:error="onError" src="https://cdn.jsdelivr.net/gh/defis-net/material2/farm/wx.png">
            <img v-if="farmInfo.tg" class="linkImg"
              v-clipboard:copy="farmInfo.tg"
              v-clipboard:success="onCopy"
              v-clipboard:error="onError" src="https://cdn.jsdelivr.net/gh/defis-net/material2/farm/tg.png">
            <img v-if="farmInfo.qq" class="linkImg"
              v-clipboard:copy="farmInfo.qq"
              v-clipboard:success="onCopy"
              v-clipboard:error="onError" src="https://cdn.jsdelivr.net/gh/defis-net/material2/farm/qq.png">
          </div>
          <div class="signBtn flexa" @click="handleTo('signIn')">
            <img src="https://cdn.jsdelivr.net/gh/defis-net/material2/farm/rewardIcon.png">
            <span>{{ $t('invite.signReward') }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 农场数据 -->
    <div class="totalData flexb">
      <div class="flexc">
        <img src="https://cdn.jsdelivr.net/gh/defis-net/material2/farm/wealth.png">
        <div>
          <div class="num din">${{ parseFloat(farmInfo.wealth).toFixed(4) }}</div>
          <div class="tip">{{ $t('invite.farmWealth') }}</div>
        </div>
      </div>
      <div class="flexc">
        <img src="https://cdn.jsdelivr.net/gh/defis-net/material2/farm/farmsNum.png">
        <div>
          <div class="num din">{{ farmInfo.farmers }}</div>
          <div class="tip">{{ $t('invite.farmersNum') }}</div>
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
      <div class="about flexb" v-if="!accSnapshoots.owner || accSnapshoots.is_claim">
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
        <div class="claimBtn flexc"
          v-if="account.name === dName" @click="handleClaim">{{ $t('invite.claim') }}</div>
      </div>
      <div class="albeClaim about flexb" v-else>
        <div>
          <div class="tip flexa">
            <span>{{ $t('invite.ableClaim') }}</span>
            <img class="tipIcon" @click="showClaimTip = true"
              src="https://cdn.jsdelivr.net/gh/defis-net/material2/dfs/tipIcon.png"
            />
          </div>
          <div class="num dinBold">
            <span>{{ abledReward }}</span> 
            <span class="tip ml">(${{ abledRewardU }})</span>
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

    <div class="btn flexc" v-if="joinName !== dName"
      @click="handleAddFarm(farmerInfo)">{{ $t('invite.join') }}</div>

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
import { countdown, toFixed } from '@/utils/public';
import { sellToken } from '@/utils/logic';


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
      showPopover: false,
      act: 0,
      max: 100,
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
      rate: 0.1, // 基金占比
      nextObj: {},
      timer: null,
      tTimes: {
        days: 0,
        hours: '00',
        minutes: '00',
        seconds: '00',
        total: 0
      },
      // 用户快照情况
      accSnapshoots: {},
      nowMarket: {},
      defaultImg: 'https://ndi.340wan.com/eos/eosio.token-eos.png',
      errorImg: 'this.src="https://ndi.340wan.com/eos/eosio.token-eos.png"',
    };
  },
  mounted() {
    this.dName = this.$route.params.name;
    this.handleGetFarmInfo();
    this.handleGetFarmerInfo();
    this.handleGetSubFarms();
    this.handleGetNext()
    this.handleGetAccSnapshoots()
    this.handleGetMidsTotalPrice()
    this.handleGetRewardRate()
  },
  computed: {
    ...mapState({
      account: (state) => state.app.account,
      coinPrices: (state) => state.sys.coinPrices,
      marketLists: state => state.sys.marketLists,
      dfsData: state => state.sys.dfsData,
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
    dealUnit() { // 预估每W USDT 获得多少 TAG
      // 做市总价值 * 0.1 / 总锁仓
      const tagNum = this.nowMarket.getNum0 * this.rate;
      const tvl = parseFloat(this.dfsData.tvl_usdt || 0);
      if (!tvl) {
        return 0
      }
      const unit = tagNum / tvl;
      return parseFloat(unit || 0)
    },
    aboutReward() {
      let u = parseFloat(this.dealUnit || 0) * parseFloat(this.farmInfo.wealth || 0)
      let r = parseFloat(u || 0)
      return parseFloat(r || 0).toFixed(8)
    },
    aboutRewardU() {
      let u = parseFloat(this.dealUnit || 0) * parseFloat(this.farmInfo.wealth || 0)
      let tagPrice = this.coinPrices.find(v => v.coin === 'TAG') || {}
      tagPrice = tagPrice.price || 0;
      let r = parseFloat(u || 0) * parseFloat(tagPrice || 0)
      return parseFloat(r || 0).toFixed(4)
    },
    abledReward() {
      let u = parseFloat(this.nextObj.unit || 0) * parseFloat(this.accSnapshoots.wealth || 0)
      let r = parseFloat(u || 0)
      return parseFloat(r || 0).toFixed(8)
    },
    abledRewardU() {
      let u = parseFloat(this.nextObj.unit || 0) * parseFloat(this.accSnapshoots.wealth || 0)
      let tagPrice = this.coinPrices.find(v => v.coin === 'TAG') || {}
      tagPrice = tagPrice.price || 0;
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
    onCopy() {
      this.$toast.success(this.$t('public.copySuccess'));
    },
    onError() {
      this.$toast.fail(this.$t('public.copyFail'));
    },
    // 领取收益
    handleClaim() {
      // if (!this.accSnapshoots.owner || this.accSnapshoots.is_claim) {
      //   return
      // }
      if (!this.ableClaim) {
        this.$toast.fail(this.$t('invite.errTip5'))
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
        limit: 3,
        code: "farms.tag",
        scope: ` ${this.dName}`,
        table: "members",
        index_position: 2,
        key_type: "i64",
        reverse: true
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
      let maxLen = this.subFarmers.length > 30 ? 30 : this.subFarmers.length;
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
    handleAddFarm() {
      if (this.joinName) {
        this.$toast.fail(this.$t('invite.errTip1'))
        return
      }
      // if (this.max <= v.farmers) {
      //   this.$toast.fail(this.$t('invite.errTip3'))
      //   return
      // }
      // console.log(v)
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
            farm: this.dName,
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
    // 获取用户收益快照数据
    async handleGetAccSnapshoots() {
      const params = {
        json: true,
        limit: 100,
        code: "farms.tag",
        scope: "farms.tag",
        table: "snapshoots",
        lower_bound: ` ${this.dName}`,
        upper_bound: ` ${this.dName}`,
      }
      const {status, result} = await this.$api.get_table_rows(params);
      if (!status) {
        return
      }
      const rows = result.rows || []
      if (!rows.length) {
        return
      }
      this.accSnapshoots = rows[0];
    },
    // 获取 fund.tag 账户下 737 交易对总估值（USDT价值）
    async handleGetMidsTotalPrice() {
      const params = {
        code: "defisswapcnt",
        json: true,
        lower_bound: " fund.tag",
        scope: 737,
        table: "liquidity",
        upper_bound: " fund.tag",
      }
      const {status, result} = await this.$api.get_table_rows(params);
      if (!status) {
        return
      }
      const rows = result.rows || []
      if (!rows.length) {
        return
      }
      this.handleGetNowMarket(rows[0])
    },
    // 计算实时的双边数量
    handleGetNowMarket(data) {
      try {
        const market = this.marketLists.find(v => v.mid === 737)
        const inData = {
          poolSym0: market.reserve0.split(' ')[0],
          poolSym1: market.reserve1.split(' ')[0],
          poolToken: market.liquidity_token,
          sellToken: data.token
        }
        const nowMarket = sellToken(inData);
        this.nowMarket = {
          getNum0: toFixed(nowMarket.getNum1, 4),
          getNum1: toFixed(nowMarket.getNum2, 4),
          sym0: market.symbol0,
          sym1: market.symbol1,
          contract0: market.contract0,
          contract1: market.contract1,
        };
      } catch(error) {
        setTimeout(() => {
          this.handleGetNowMarket(data)
        }, 200);
      }
    },
    // 获取奖励份额
    async handleGetRewardRate() {
      const params = {
        json: true,
        limit: 10,
        code: "fund.tag",
        scope: "fund.tag",
        table: "configs",
      }
      const {status, result} = await this.$api.get_table_rows(params);
      if (!status) {
        return
      }
      const conf = result.rows.find(v => v.id === 1);
      const rate = parseFloat(conf.reward_ratio || 0.1).toFixed(4)
      this.rate = rate;
    }
  },
};
</script>

<style lang="scss" scoped>
.farmDetail {
  .topDiv{
    height: 100px;
  }
  .farmInfo {
    position: relative;
    // height: 480px;
    width: 100%;
    overflow: hidden;
    .bgImg {
      position: relative;
      // margin-left: -5%;
      width: 100%;
    }
    .template {
      position: absolute;
      z-index: 1;
      top: 0px;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0);
      color: #fff;
      padding: 35px 28px 28px;
      font-size: 24px;
      text-align: left;
      box-sizing: border-box;
      .tools{
        /deep/ .van-popover__wrapper{
          .settingImg{
            width: 52px;
            margin-left: 50px;
          }
        }
        img{
          width: 52px;
          margin-left: 50px;
          &:first-child{
            margin-left: 0;
          }
        }
      }
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
        overflow: hidden;
        word-break: break-all;
        white-space: pre-wrap;
      }
      .total{
        font-size: 24px;
        .num{
          margin-bottom: 8px;
          font-size: 32px;
        }
      }
    }
    .signDiv{
      margin-top: 35px;
      .linkDiv{
        img{
          margin-right: 40px;
          width: 60px;
        }
      }
      .signBtn{
        background: #FFF;
        border-radius: 40px;
        height: 76px;
        border: 1px solid #FFBA29;
        padding: 0 18px;
        box-sizing: border-box;
        color: #FFBA29;
        font-weight: 300;
        font-size: 28px;
        img{
          margin-right: 15px;
          width: 60px;
        }
      }
    }
  }
  .totalData{
    margin: -120px auto 36px;
    z-index: 2;
    position: relative;
    background: #FFF;
    border-radius: 16px;
    box-shadow: 0px 4px 8px 4px rgba(234,234,234,0.54);
    width: 690px;
    font-size: 28px;
    padding: 34px 0;
    text-align: left;
    &>div{
      flex: 1;
    }
    img{
      width: 60px;
      margin-right: 15px;
    }
    .num{
      font-size: 32px;
      margin-bottom: 4px;
    }
  }
  .rewardDiv {
    position: relative;
    z-index: 2;
    margin: 20px auto 20px;
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
        &.disable{
          background: #999;
        }
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
.setPopover{
  font-size: 28px;
  padding: 8px 26px;
  .nav{
    height: 80px;
    border-bottom: 1px solid rgba(220,220,220, .3);
    &:last-child{
      border-bottom: 0;
    }
    &.red{
      color: #ff6871;
    }
  }
}
.btn{
  position: fixed;
  bottom: 50px;
  width: 95%;
  max-width: 690px;
  background: $color-main;
  color: #FFF;
  font-size: 32px;
  height: 96px;
  border-radius: 8px;
  margin: 0 30px;
  font-weight: 500;
}
</style>
