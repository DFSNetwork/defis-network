<template>
  <div class="addVote">
    <div class="rules">
      <div class="tip flexb">
        <span>{{ $t('nodePools.rexInfo') }}</span>
        <span class="green_p" @click="handleToRex">{{ $t('nodePools.detail') }}></span>
      </div>
      <div>{{ $t('nodePools.rexTip1') }}</div>
      <div>{{ $t('nodePools.rexTip2') }}</div>
      <div>{{ $t('nodePools.rexTip3') }}</div>
    </div>
    <div class="iptDiv">
      <div class="subTitle">{{ $t('nodePools.buyRex') }}</div>
      <div class="flexend">
        <input class="ipt dinBold" v-model="buy" type="number">
        <span class="coin">EOS</span>
      </div>
      <div class="info flexb">
        <div class="bal" @click="handleIn(1)">{{ $t('public.balance') }}: {{ bal }} EOS</div>
        <div class="about tip">≈ {{ aboutRexNum }}REX</div>
      </div>
      <div class="percent flexb dingBold">
        <span @click="handleIn(0)">0%</span>
        <span @click="handleIn(0.25)">25%</span>
        <span @click="handleIn(0.5)">50%</span>
        <span @click="handleIn(0.75)">75%</span>
        <span @click="handleIn(1)">MAX</span>
      </div>
    </div>
    <div class="btnDiv">
      <div class="btn flexc" v-loading="loading" @click="handleReg">{{ $t('public.confirm') }}</div>
    </div>

    <el-dialog
      class="myDialog"
      :append-to-body="true"
      :show-close="false"
      :visible.sync="showTip">
      <TipClaim v-if="showTip"
        @listenType="listenType"/>
      <!-- <Remove /> -->
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { EosModel } from '@/utils/eos';

import { toFixed } from '@/utils/public';
import { getRexActions, getClaimActions } from '../js/nodePools'


import TipClaim from './TipClaim'

export default {
  name: 'addVote',
  components: {
    TipClaim
  },
  props: {
    rexPrice: {
      type: Number,
      default: 0.0001,
    },
    accVoteData: {
      type: Object,
      default: function avd() {
        return {}
      }
    }
  },
  data() {
    return {
      buy: '',
      bal: '0.0000',
      loading: false,
      showTip: false,
    }
  },
  computed: {
    ...mapState({
      scatter: state => state.app.scatter,
    }),
    aboutRexNum() {
      const num = this.buy / this.rexPrice;
      return num.toFixed(4)
    }
  },
  watch: {
    scatter: {
      handler: function listen(newVal) {
        if (newVal.identity) {
          this.handleGetBal();
        }
      },
      deep: true,
      immediate: true,
    }
  },
  methods: {
    listenType(type) {
      console.log(type)
      if (type === 'next') {
        this.handleRexAction()
        return
      }
      this.handleClaim();
    },
    handleToRex() {
      location.href = 'https://dfscommunity.baklib.com/newbie/f036'
    },
    // 获取账户余额
    handleGetBal() {
      const params = {
        code: 'eosio.token',
        coin: 'EOS',
        decimal: 4,
      }
      EosModel.getCurrencyBalance(params, res => {
        let balance = toFixed('0.0000000000001', params.decimal);
        (!res || res.length === 0) ? balance : balance = res.split(' ')[0];
        this.bal = balance;
      })
    },
    // 点击百分比
    handleIn(rate) {
      const t = this.bal * rate;
      this.buy = t.toFixed(4)
    },
    handleReg() {
      if (!Number(this.buy)) {
        return;
      }
      if (Number(this.buy) > Number(this.bal)) {
        this.$message({
          message: this.$t('public.balanLow'),
          type: 'error'
        });
        return
      }
      this.handleRexAction()
    },
    // 买入REX
    handleRexAction() {
      this.loading = true;
      const params = getRexActions(this.accVoteData, {
        amount: `${toFixed(this.buy, 4)} EOS`,
        type: 'buyRex'
      })
      EosModel.toTransaction(params, (res) => {
        this.loading = false;
        if(res.code && JSON.stringify(res.code) !== '{}') {
          this.$message({
            message: res.message,
            type: 'error'
          });
          return
        }
        this.$message({
          message: '操作成功，请重新加入矿池',
          type: 'success'
        });
        this.showTip = false;
        this.$emit('listenUpdata', 'acc')
      })
    },
    // 领取
    handleClaim() {
      const params = getClaimActions(this.accVoteData)
      EosModel.toTransaction(params, (res) => {
        this.loading = false;
        if(res.code && JSON.stringify(res.code) !== '{}') {
          this.$message({
            message: res.message,
            type: 'error'
          });
          return
        }
        this.$message({
          message: '领取成功，即将执行REX操作',
          type: 'success'
        });
        this.showTip = false;
        setTimeout(() => {
          this.handleRexAction()
        }, 1000);
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.addVote{
  .rules{
    margin: 26px 0 ;
    padding: 26px;
    background: #fafafa;
    border-radius: 12px;
  }
  .iptDiv{
    .subTitle{
      font-size: 30px;
      font-weight: 500;
    }
    .ipt{
      height: 65px;
      font-size: 40px;
      width: 100%;
      outline: none;
      border: 0px;
      border-bottom: 1px solid #eeeeee;
    }
    .coin{
      width: 100px;
      font-size: 30px;
      text-align: right;
    }
    .info{
      margin: 20px 0;
    }
    .percent{
      &>span{
        width: 100px;
        font-size: 30px;
        text-align: center;
        background: rgba(41,212,176,.2);
        color: #29d4b0;
        padding: 10px 0 12px;
        border-radius: 5px;
      }
    }
  }
  .btnDiv{
    margin: 30px 0 10px;
    .btn{
      height: 80px;
      width: 100%;
      background: #29d4b0;
      color: #fff;
      border-radius: 40px;
      font-size: 30px;
    }
  }
}

.myDialog{
  // animation: none;
  /deep/ .el-dialog{
    width: 700px;
    border-radius:12px;
    .el-dialog__body,
    .el-dialog__header{
      padding: 0;
    }
  }
}
</style>
