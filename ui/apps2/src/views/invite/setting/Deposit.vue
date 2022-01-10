<template>
  <div class="farmDeposit">
    <img class="close" @click="handleClose(false)"
      src="https://cdn.jsdelivr.net/gh/defis-net/material/svg/sd_icon_btn.svg" alt="">
    <div class="title">{{ $t('invite.deposit') }}</div>

    <div class="coinInfo">
      <div class="bal" @click="handleMax">{{ $t('public.balance') }}：{{bal}}</div>
      <div class="flexb">
        <div class="flexa">
          <img class="coinImg" :src="info.coinImg || $errorImg" :onerror="$errorImg">
          <div>
            <div class="coinName">{{ info.symbol }}</div>
            <div class="contract tip">{{ info.cnt }}</div>
          </div>
        </div>
        <div class="flexb">
          <van-field class="dinBold ipt"
            @focus="handleFocus"
            @blur="handleBlur"
            v-model="num" type="number" placeholder="0.0" />
          <div class="max" @click="handleMax" v-if="showMax">MAX</div>
        </div>
      </div>
    </div>

    <div class="btn flexc" @click="handleDeposit">{{ $t('public.confirm') }}</div>

    <div class="rules">
      <div class="rTitle">{{ $t('invite.depositRules') }}</div>
      <div class="tip subTip">{{ $t('invite.depositRules1') }}</div>
      <ul class="ul">
        <li><span>{{ $t('invite.depositRules2') }}</span></li>
        <li><span>{{ $t('invite.depositRules3') }}</span></li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { DApp } from '@/utils/wallet';
export default {
  name: 'farmDeposit',
  props: {
    info: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data() {
    return {
      bal: '0.0000 EOS',
      num: ''
    }
  },
  mounted() {
    this.bal = `0.0000 ${this.info.symbol}`
  },
  computed: {
    ...mapState({
      account: (state) => state.app.account,
    }),
    showMax() {
      return parseFloat(this.bal || 0) !== parseFloat(this.num || 0)
    }
  },
  watch: {
    account: {
      handler: function at(newVal) {
        if (!newVal.name) {
          return
        }
        this.handleGetBal()
      },
      deep: true,
      immediate: true,
    }
  },
  methods: {
    handleClose(type) {
      this.$emit('listenClose', type)
    },
    async handleGetBal() {
      if (!this.info.cnt) {
        return
      }
      const name = this.account.name;
      const params = {
        code: this.info.cnt,
        symbol: this.info.symbol,
        decimal: this.info.decimal,
        account: `${name}`
      }
      const {status, result} = await this.$api.get_currency_balance(params);
      if (!status) {
        return
      }
      const bal = result;
      this.bal = bal;
    },
    // ipt action
    handleFocus() {
      let num = parseFloat(this.num || 0);
      if (!num) {
        this.num = ''
        return
      }
      this.num = num;
    },
    handleBlur() {
      let num = parseFloat(this.num || 0);
      const decimal = this.info.decimal || 4;
      this.num = parseFloat(num).toFixed(decimal)
    },
    handleMax() {
      this.num = this.bal.split(' ')[0]
    },
    handleReg() {
      if (!parseFloat(this.num || 0)) {
        this.$toast({
          type: 'fail',
          message: '请输入充值数量',
        })
        return
      }
      if (parseFloat(this.num || 0) > parseFloat(this.bal)) {
        this.$toast({
          type: 'fail',
          message: '余额不足',
        })
        return
      }
      return true
    },
    handleDeposit() {
      const name = this.account.name;
      if (!name) {
        return
      }
      if (!this.handleReg()) {
        return
      }
      const quantity = `${this.num} ${this.info.symbol}`;
      const params = {
        code: this.info.cnt,
        toAccount: 'farms.tag',
        quantity,
        memo: 'deposit',
      }
      DApp.transfer(params, (err) => {
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
        this.$emit('listenClose', true)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.farmDeposit{
  text-align: left;
  padding: 30px;
  border-radius: 12px;
  font-size: 28px;
  color: #333;
  .close{
    position: absolute;
    top: 26px;
    right: 26px;
    width: 24px;
  }
  .title{
    font-size: 36px;
    font-weight: 500;
    margin-bottom: 10px;
    text-align: center;
  }
  .coinInfo{
    border: 1px solid $color-border;
    padding: 30px;
    font-size: 24px;
    border-radius: 12px;
    .bal{
      margin-bottom: 15px;
    }
    .coinImg{
      width: 60px;
      height: 60px;
      margin-right: 15px;
    }
    .coinName{
      font-size: 28px;
    }
    .ipt{
      font-size: 52px;
      padding: 0px 0px 0px 24px;
      &::after{
        display: none;
      }
      /deep/ .van-field__control{
        text-align: right;
      }
    }
    .max{
      color: $color-main;
      background: rgba($color-main, .2);
      padding: 8px 8px;
      border-radius: 8px;
      margin-left: 15px;
      display: block;
      margin-bottom: -1px;
    }
  }
  .btn{
    margin: 30px 0;
    background: $color-main;
    color: #FFF;
    border-radius: 50px;
    height: 96px;
    font-size: 32px;
  }
  .rules{
    .rTitle{
      font-size: 32px;
    }
    .subTip{
      margin-bottom: 15px;
      font-size: 24px;
    }
    .ul{
      font-size: 28px;
      color: $color-main;
      padding-left: 40px;
      list-style: disc;
      li{
        margin: 8px 0;
        span{
          color: #666;
        }
      }
    }
  }
}
</style>
