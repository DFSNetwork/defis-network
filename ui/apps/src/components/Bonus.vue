<template>
  <el-dialog
    class="dialog"
    :class="{'unstakeAct': active === 3}"
    width="305px"
    :visible.sync="showBonus">
    <div class="bonus" v-if="showBonus">
      <div class="title" v-if="active !== 3">
        <!-- <span :class="{'green': active === 1}" @click="handleClickActive(1)">{{ $t('hyk.stock2') }}</span> -->
        <span :class="{'green': active === 2}"
          @click="handleClickActive(2)">{{ $t('bonus.stake') }}</span>
      </div>
      <div class="subTool" v-else>
        <span @click="handleClickActive(2)" class="iconfont icon-huaban29 back"></span>
        <span>{{ $t('bonus.redeemDetail') }}</span>
      </div>
      <bonus-total v-show="active === 1" @listenPerDfs="handlePerDfs"/>
      <!-- 我的红利 -->
      <div class="list" v-show="active === 2">
        <div class="next" v-if="false">
          <div class="item mt12">
            <span>{{ $t('bonus.myDividends') }}</span>
            <span class="green" @click="handleClaimNow">{{ $t('bonus.claim') }}</span>
          </div>
          <div class="bonusNum">
            <span>{{ ableClaim }} EOS</span>
          </div>
        </div>
        <div class="item">
          <span>{{ $t('bonus.ableStake') }}</span>
          <span>{{ balanceDfs }} DFS</span>
        </div>
        <div class="item inputItem mt15">
          <!-- <input type="number" v-model="stakeNum" @input="handleInput" :placeholder="`${$t('bonus.inStake')}`"> -->
          <el-input v-model="stakeNum" type="number" :placeholder="`${$t('bonus.inStake')}`"
                    @input="handleInput('stake')"
                    @focus="handleFocus('stake')"
                    @blur="handleBlur('stake')">
          </el-input>
          <span class="btn" @click="handleAccToStake">{{ $t('bonus.stake') }}</span>
        </div>
        <div class="item">
          <span>{{ $t('bonus.staked') }}</span>
          <span>{{ staked }} DFS</span>
        </div>
        <div class="item mt15">
          <span></span>
          <span class="small">{{ $t('bonus.ofPercent', {percent}) }}</span>
        </div>
        <div class="item">
          <span>{{ $t('bonus.redeemable') }}</span>
          <span>{{ staked }} DFS</span>
        </div>
        <div class="item inputItem mt15">
          <!-- <input type="number" v-model="refundNum" :placeholder="`${$t('bonus.inRedeem')}`"> -->
          <el-input v-model="refundNum" type="number" :placeholder="`${$t('bonus.inRedeem')}`"
                    @input="handleInput('refund')"
                    @focus="handleFocus('refund')"
                    @blur="handleBlur('refund')">
          </el-input>
          <span class="btn" @click="handleAccToRefund">{{ $t('bank.redeem') }}</span>
        </div>
        <div class="item">
          <span>{{ $t('bonus.redeeming') }}</span>
          <span @click="handleClickActive(3)">
            <span>{{ refunding }} DFS</span>
            <span class="iconfont icon-huaban29 right"></span>
          </span>
        </div>
      </div>

      <div v-show="active === 3" class="unstakeLists">
        <div class="unstakeList" v-for="(item, index) in refundingList" :key="index">
          <div>
            <span>{{ $t('bonus.redeemNum') }}</span>
            <span>{{ item.refund }}</span>
          </div>
          <div>
            <span>{{ $t('bonus.redeemTime') }}</span>
            <span v-if="!item.ableClaim">{{ `${item.timeJson.hours}:${item.timeJson.minutes}:${item.timeJson.seconds}` }}</span>
            <!-- <span>{{ $t('bonus.lastTime', {day: 11, hour: 23}) }}</span> -->
            <span v-else class="green" @click="handleAccGetRefund(item)">{{ $t('bonus.claim') }}</span>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import axios from 'axios';
import { mapState } from 'vuex';
import { EosModel } from '@/utils/eos';
import { toFixed, accAdd, accDiv, accMul, countdown, toLocalTime } from "@/utils/public";
import BonusTotal from './bonusChild/BonusTotal';

export default {
  name: 'bonus',
  components: {
    BonusTotal
  },
  data() {
    return {
      showBonus: false,
      active: 2, // 1 - 分红池 | 2 - 我的红利 | 3 - 赎回列表
      // ableClaim: '0.0000', // 可领取
      balanceDfs: '0.0000',
      staked: '0.0000',
      refunding: '0.0000',
      refundingList: [],
      timer: null,
      // input
      stakeNum: '',
      refundNum: '',
      perDfs: 0,
      supply: '0.0000'
    }
  },
  computed:{
     ...mapState({
      // 箭头函数可使代码更简练
      scatter: state => state.app.scatter,
      baseConfig: state => state.sys.baseConfig, // 基础配置 - 默认为{}
    }),
    percent() {
      if (!Number(this.supply) || !Number(this.staked)) {
        return '0.00'
      }
      let p = accDiv(this.staked, this.supply)
      p = accMul(p, 100);
      return toFixed(p, 4)
    },
    ableClaim() {
      let able = accMul(this.perDfs, this.staked)
      able = toFixed(able, 4)
      console.log(able)
      return able
    }
  },
  watch: {
    showBonus(newVal) {
      if(!newVal) {
        return;
      }
      this.handleClickActive(2)
    },
  },
  mounted() {
  },
  beforeDestroy() {
    clearTimeout(this.timer);
  },
  methods: {
    handlePerDfs(per) {
      this.perDfs = per;
    },
    handleInput(type) {
      if (type === 'stake') {
        const n = Number(this.stakeNum)
        this.stakeNum = n < 0 ? 0 : this.stakeNum;
        return
      }
      const n = Number(this.refundNum)
      this.refundNum = n < 0 ? 0 : this.refundNum;
    },
    handleFocus(type) {
      if (type === 'stake') {
        const n = Number(this.stakeNum)
        this.stakeNum = n ? n : '';
        return
      }
      const n = Number(this.refundNum)
      this.refundNum = n ? n : '';
    },
    handleBlur(type) {
      if (type === 'stake') {
        const n = Number(this.stakeNum)
        this.stakeNum = n ? toFixed(n, 4) : '';
        return
      }
      const n = Number(this.refundNum)
      this.refundNum = n ? toFixed(n, 4) : '';
    },
    handleToLocalEndTime(time) {
      const env = sessionStorage.getItem('ENV')
      let secAll = (env === 'production') ? 24 * 3600 * 1000 * 3 : 15000;
      const rqTime = Date.parse(`${time}.000+0000`)
      const endTime = accAdd(rqTime, secAll)
      return toLocalTime(endTime)
    },
    handleClickActive(type) {
      this.active = type;
      if (type === 2) {
        if (!this.scatter.identity) {
          return
        }
        this.handleGetBalance();
        this.handleGetAccStakes();
        this.handleGetAccRefunds();
        // this.handleGetAccBonus();
        this.handleGetDfsStats();
      }
    },
    // 获取账户抵押详情
    handleGetAccStakes() {
      const params = {
        code: 'defistakedfs',
        scope: 'defistakedfs',
        table: 'stakes',
        lower_bound: this.scatter.identity.accounts[0].name,
        upper_bound: this.scatter.identity.accounts[0].name,
        json: true
      }
      EosModel.getTableRows(params, (res) => {
        const bal = res.rows && res.rows.length ? res.rows[0].bal.split(' ')[0] : '0.0000';
        this.staked = bal;
        // this.ableClaim = this.staked * 
      })
    },
    // 获取账户分红数量详情
    handleGetAccBonus() {
      const params = {
        json: true,
        code: 'defidividend',
        scope: 'defidividend',
        table: 'claims',
        lower_bound: this.scatter.identity.accounts[0].name,
        upper_bound: this.scatter.identity.accounts[0].name,
      }
      EosModel.getTableRows(params, (res) => {
        const bal = res.rows && res.rows.length ? res.rows[0].amount.split(' ')[0] : '0.0000';
        this.ableClaim = bal;
      })
    },
    // 获取总发行量
    async handleGetDfsStats() {
      const https = this.baseConfig.node.url;
      const params = {
        code: 'minedfstoken',
        symbol: 'DFS'
      }
      const result = await axios.post(`${https}/v1/chain/get_currency_stats`, JSON.stringify(params))
      if (result.status !== 200) {
        return;
      }
      const res = result.data['DFS'];
      this.supply = res.supply.split(' ')[0];
    },
    // 获取账户赎回详情
    handleGetAccRefunds() {
      const params = {
        code: 'defistakedfs',
        scope: this.scatter.identity.accounts[0].name,
        table: 'refunds',
        json: true
      }
      EosModel.getTableRows(params, (res) => {
        const list = res.rows || [];
        let countRefund = 0;
        list.forEach((v) => {
          countRefund = toFixed(accAdd(v.refund.split(' ')[0], countRefund), 4)
          const endTime = this.handleToLocalEndTime(v.request_time)
          this.$set(v, 'endTime', endTime)
          const timeJson = countdown(endTime)
          this.$set(v, 'timeJson', timeJson)
          if (timeJson.total <= 0) {
            this.$set(v, 'ableClaim', true)
          } else {
            this.$set(v, 'ableClaim', false)
          }
        });
        this.refunding = countRefund;
        this.refundingList = list;
        this.handleStartTimer();
      })
    },
    handleStartTimer() {
      // 赎回列表定时器
      clearInterval(this.timer);
      this.timer = setInterval(() => {
        this.refundingList.forEach((v) => {
          const endTime = this.handleToLocalEndTime(v.request_time)
          this.$set(v, 'endTime', endTime)
          const timeJson = countdown(endTime)
          this.$set(v, 'timeJson', timeJson)
          if (timeJson.total <= 0) {
            this.$set(v, 'ableClaim', true)
          } else {
            this.$set(v, 'ableClaim', false)
          }
        });
        this.$forceUpdate();
      }, 1000)
    },
    // 账户转账参与抵押
    handleAccToStake() {
      if (!Number(this.stakeNum)) {
        return
      }
      if (Number(this.stakeNum) > Number(this.balanceDfs)) {
        this.$message({
          message: '可质押数量不足',
          type: 'error'
        });
        return;
      }
      const formName = this.$store.state.app.scatter.identity.accounts[0].name;
      const permission = this.$store.state.app.scatter.identity.accounts[0].authority;
      const params = {
        actions: [
          {
            account: 'minedfstoken',
            name: 'transfer',
            authorization: [{
              actor: formName, // 转账者
              permission,
            }],
            data: {
              from: formName,
              to: 'defistakedfs',
              quantity: `${this.stakeNum} DFS`,
              memo: `stake`
            }
          }
        ]
      }
      EosModel.toTransaction(params, (res) => {
        if(res.code && JSON.stringify(res.code) !== '{}') {
          this.$message({
            message: res.message,
            type: 'error'
          });
          return
        }
        this.handleGetBalance();
        this.handleGetAccStakes();
      })
    },
    // 账户赎回抵押
    handleAccToRefund() {
      if (!Number(this.refundNum)) {
        return
      }
      if (Number(this.refundNum) > Number(this.staked)) {
        this.$message({
          message: '可赎回数量不足',
          type: 'error'
        });
        return
      }
      const formName = this.$store.state.app.scatter.identity.accounts[0].name;
      const permission = this.$store.state.app.scatter.identity.accounts[0].authority;
      const params = {
        actions: [
          {
            account: 'defistakedfs',
            name: 'unstake',
            authorization: [{
              actor: formName, // 转账者
              permission,
            }],
            data: {
              user: formName,
              quantity: `${this.refundNum} DFS`,
            }
          }
        ]
      }
      EosModel.toTransaction(params, (res) => {
        if(res.code && JSON.stringify(res.code) !== '{}') {
          this.$message({
            message: res.message,
            type: 'error'
          });
          return
        }
        this.handleGetAccStakes();
        this.handleGetAccRefunds();
      })
    },
    // 用户领取已解抵押的DFS - 根据id领取
    handleAccGetRefund(item = {}) {
      const formName = this.$store.state.app.scatter.identity.accounts[0].name;
      const permission = this.$store.state.app.scatter.identity.accounts[0].authority;
      const params = {
        actions: [
          {
            account: 'defistakedfs',
            name: 'refund',
            authorization: [{
              actor: formName, // 转账者
              permission,
            }],
            data: {
              user: formName,
              id: item.id || 0,
            }
          }
        ]
      }
      EosModel.toTransaction(params, (res) => {
        if(res.code && JSON.stringify(res.code) !== '{}') {
          this.$message({
            message: res.message,
            type: 'error'
          });
          return
        }
        this.handleGetAccRefunds();
      })
    },
    // 获取账户余额
    async handleGetBalance() {
      const params = {
        code: 'minedfstoken',
        coin: 'DFS',
        decimal: 4
      };
      await EosModel.getCurrencyBalance(params, res => {
        let balance = '0.0000';
        (!res || res.length === 0) ? balance = '0.0000' : balance = res.split(' ')[0];
        this.balanceDfs = balance;
      })
    },
    // 账户领取当前红利
    handleClaimNow() {
      // if (!Number(this.ableClaim)) {
      //   return;
      // }
      const formName = this.$store.state.app.scatter.identity.accounts[0].name;
      const permission = this.$store.state.app.scatter.identity.accounts[0].authority;
      const params = {
        actions: [
          {
            account: 'defidividend',
            name: 'claim',
            authorization: [{
              actor: formName, // 转账者
              permission,
            }],
            data: {
              user: formName,
              sym: 'EOS',
            }
          }
        ]
      }
      EosModel.toTransaction(params, (res) => {
        if(res.code && JSON.stringify(res.code) !== '{}') {
          this.$message({
            message: res.message,
            type: 'error'
          });
          return
        }
        this.handleGetBalance();
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog{
  /deep/ .el-dialog{
    border-radius: 8px;
    .el-dialog__header{
      padding: 0;
    }
    .el-dialog__body{
      padding-bottom: 30px;
    }
    .el-dialog__headerbtn{
      z-index: 10;
    }
  }

  &.unstakeAct{
    /deep/ .el-dialog{
      .el-dialog__body{
        padding-top: 10px;
      }
      .el-dialog__headerbtn{
        display: none;
      }
    }
  }
}
.bonus{
  .green{
    color: #42B48F !important;
  }
  .title{
    color: #070707;
    font-size: 16px;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    &>span{
      flex: 1;
      text-align: center;
    }
  }
  .list{
    font-size: 14px;
    color: #070707;
    margin-top: 20px;
    .next{
      background: #f9f9f9;
      padding: 20px 15px;
      margin: 20px 0 18px;
    }
    .item{
      display: flex;
      align-items: center;
      justify-content: space-between;
      &.mt12{
        margin-bottom: 12px;
      }
      &.mt15{
        margin-bottom: 15px;
      }
      span{
        &:last-child{
          font-weight: 500;
        }
        &.small{
          font-size: 12px;
          // margin-top: 3px;
          font-weight: normal !important;
        }
      }
      .right{
        font-size: 12px;
        margin-left: 10px;
      }
    }
    .bonusNum{
      font-weight: 500;
      font-size: 16px;
      text-align: left;
    }
    .inputItem{
      background: #f9f9f9;
      height: 37px;
      margin-top: 5px;
      /deep/ .el-input {
        input{
          display: block;
          color: #070707;
          background: transparent;
          height: 100%;
          width: calc(100% - 70px);
          border: 0px;
          outline: none;
          font-size: 14px;
          padding-left: 10px;
        }
      }
      // input{
      //   background: transparent;
      //   height: 100%;
      //   width: calc(100% - 70px);
      //   border: 0px;
      //   outline: none;
      //   font-size: 14px;
      //   padding-left: 10px;
      // }
      .btn{
        font-size: 12px;
        font-weight: 500;
        height: 31px;
        width: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #42B48F;
        color: #f9f9f9;
        border-radius: 2px;
        margin-right: 10px;
      }
    }
  }
  .subTool{
    display: flex;
    align-items: center;
    justify-content: center;
    height: 44px;
    position: relative;
    color: #070707;
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 8px;
    // box-shadow: 0 2px 4px 0 rgba(0,0,0,0.08);
    .back{
      font-size: 16px;
      position: absolute;
      left: 10px;
      top: 50%;
      transform: translate(0%, -50%) rotate(180deg);
    }
  }
  .unstakeLists{
    height: 349px;
    overflow: auto;
    .unstakeList{
      background: #f9f9f9;
      color: #070707;
      font-size: 14px;
      padding: 20px 15px;
      margin-bottom: 10px;
      &:last-child{
        margin-bottom: 0px;
      }
      &>div{
        display: flex;
        align-items: center;
        justify-content: space-between;

        &:first-child{
          margin-bottom: 10px;
        }
      }
    }
  }
}
</style>
