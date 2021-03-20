<template>
  <div class="deposit">
    <img class="close" @click="handleClose(false)"
      src="https://cdn.jsdelivr.net/gh/defis-net/material/svg/sd_icon_btn.svg">
    <div class="title">{{ $t('financial.depositTitle') }}</div>
    <div class="content">
      <div>
        <div class="bal dinReg" @click="handleClickMax">{{ $t('public.balance') }}：{{ bal }} EOS</div>
        <div class="flexb">
          <div class="flexa coinInfo">
            <img class="coinImg" src="https://cdn.jsdelivr.net/gh/defis-net/material2/coin/eosio.token-eos.svg" alt="">
            <div>
              <div class="coinName">EOS</div>
              <div class="contract tip">eosio.token</div>
            </div>
          </div>
          <div class="iptDiv flexb">
            <van-field class="ipt dinBold" v-model="deposit" placeholder="0.0" />
            <span class="max" v-if="showMax" @click="handleClickMax">MAX</span>
          </div>
        </div>
      </div>
      <div class="flexb lockTime">
        <span class="tip">{{ $t('financial.depTime') }}</span>
        <span class="red">{{ $t('financial.depLock') }}</span>
      </div>
    </div>

    <!-- 按钮 -->
    <div class="btn flexc" :class="{'disabled': !regNum}"  @click="handleDeposit">
      <span v-if="regNum">{{ $t('public.confirm') }}</span>
      <span v-else>{{ $t(`financial.${regContent}`) }}</span>
    </div>
    <!-- 交易规则 -->
    <div class="rules">
      <TradeRules :showType="'dialog'"/>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { EosModel } from '@/utils/eos';
import { get_balance } from '@/utils/api'
import { toFixed } from '@/utils/public';

import TradeRules from '../comp/TradeRules';
export default {
  name: 'financialDeposit',
  components: {
    TradeRules
  },
  data() {
    return {
      deposit: '',
      bal: '0.0000',
      showMax: true,
      regContent: '',
      // 定时器
      balTimer: null,
    }
  },
  computed: {
    ...mapState({
      scatter: state => state.app.scatter,
    }),
    regNum() {
      if (!Number(this.deposit)) {
        this.regContent = 'iptNum'; // eslint-disable-line
        return false
      }
      if (Number(this.deposit) > Number(this.bal)) {
        this.regContent = 'banLow'; // eslint-disable-line
        return false
      }
      return true
    }
  },
  watch: {
    scatter: {
      handler: function acc(newVal) {
        if (newVal.identity) {
          this.handleGetBal();
        }
      },
      deep: true,
      immediate: true
    },
    deposit(newVal) {
      if (Number(newVal) === Number(this.bal)) {
        this.showMax = false;
        return
      }
      this.showMax = true;
    },
  },
  methods: {
    handleClose(type) {
      this.$emit('listenClose', type)
    },
    // 点击MAX
    handleClickMax() {
      this.deposit = this.bal;
    },
    // 查询用户余额
    async handleGetBal() {
      clearTimeout(this.balTimer)
      this.balTimer = setTimeout(() => {
        this.handleGetBal()
      }, 5000);
      const formName = this.scatter.identity.accounts[0].name;
      const params = {
        code: 'eosio.token',
        symbol: 'EOS',
        decimal: 4,
        account: formName,
      }
      const {status, result} = await get_balance(params);
      if (!status) {
        return
      }
      this.bal = result.split(' ')[0];
    },
    // 存入操作
    handleDeposit() {
      if (!this.regNum) {
        return
      }
      const params = {
        code: 'eosio.token',
        toAccount: 'yfcsteadyone',
        memo: `deposit`,
        quantity: `${toFixed(this.deposit, 4)} EOS`
      }
      EosModel.transfer(params, (res) => {
        this.loading = false;
        if(res.code && JSON.stringify(res.code) !== '{}') {
          this.$message({
            message: res.message,
            type: 'error'
          });
          return
        }
        this.handleClose(true)
        this.$message({
          message: this.$t('public.success'),
          type: 'success'
        });
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../css/dialog.scss';
</style>
