<template>
  <div class="withdraw">
    <img class="close" @click="handleClose(false)"
      src="https://cdn.jsdelivr.net/gh/defis-net/material/svg/sd_icon_btn.svg">
    <div class="title">{{ $t('financial.withTitle') }}</div>
    <div class="content">
      <div>
        <div class="bal dinReg" @click="handlePercent(1)">{{ $t('public.balance') }}：{{ depositBal }} EOS</div>
        <div class="flexb">
          <div class="flexa coinInfo">
            <img class="coinImg" src="https://cdn.jsdelivr.net/gh/defis-net/material2/coin/eosio.token-eos.svg" alt="">
            <div>
              <div class="coinName">EOS</div>
              <div class="contract tip">eosio.token</div>
            </div>
          </div>
          <div class="iptDiv flexb">
            <van-field class="ipt dinBold" v-model="withdraw" placeholder="0.0" />
            <span class="max" v-if="showMax" @click="handlePercent(1)">MAX</span>
          </div>
        </div>
      </div>
      <div class="percent_p flexb din">
        <span :class="{'act_p': percent === 0}" @click="handlePercent(0)">0%</span>
        <span :class="{'act_p': percent === 0.25}" @click="handlePercent(0.25)">25%</span>
        <span :class="{'act_p': percent === 0.5}" @click="handlePercent(0.5)">50%</span>
        <span :class="{'act_p': percent === 0.75}" @click="handlePercent(0.75)">75%</span>
        <!-- <span>100%</span> -->
      </div>
    </div>
    <div class="btn flexc" :class="{'disabled': !regNum || down.total > 0}" @click="handleWithdraw">
      <span v-if="down.total <= 0">
        <span v-if="regNum">{{ $t('public.confirm') }}</span>
        <span v-else>{{ $t(`financial.${regContent}`) }}</span>
      </span>
      <span v-else>{{ $t('financial.timeUnlock', {time: `${down.hours}:${down.minutes}:${down.seconds}`}) }}</span>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { EosModel } from '@/utils/eos';
import { toFixed, toLocalTime, countdown } from '@/utils/public';

export default {
  name: 'financialWithdraw',
  data() {
    return {
      withdraw: '',
      percent: -1,
      depositBal: '0.0000',
      releaseTime: null,
      down: { // 倒计时
        total: 0,
        days: 0,
        hours: '00',
        minutes: '00',
        seconds: '00'
      },
      showMax: true,

      // 按钮处理
      regContent: '',
    }
  },
  beforeDestroy() {
    clearTimeout(this.timer)
  },
  computed: {
    ...mapState({
      scatter: state => state.app.scatter,
    }),
    regNum() {
      if (!Number(this.withdraw)) {
        this.regContent = 'iptNum'; // eslint-disable-line
        return false
      }
      if (Number(this.withdraw) > Number(this.depositBal)) {
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
          this.handleGetDepositData();
        }
      },
      deep: true,
      immediate: true
    },
    withdraw(newVal) {
      if (Number(newVal) === Number(this.depositBal)) {
        this.showMax = false;
        return
      }
      this.showMax = true;
    },
  },
  methods: {
    handlePercent(rate) {
      this.percent = rate;
      const n = Number(this.depositBal) * rate;
      this.withdraw = toFixed(n, 4)
    },
    handleClose(type) {
      this.$emit('listenClose', type)
    },
    async handleGetDepositData() {
      const formName = this.scatter.identity.accounts[0].name;
      const params = {
        "code":"yfcsteadyone",
        "scope":"EOS",
        "table":"bullets",
        "json":true,
        "lower_bound": ` ${formName}`,
        "upper_bound": ` ${formName}`,
      }
      const {status, result} = await this.$api.get_table_rows(params)
      if (!status) {
        return
      }
      const rows = result.rows || [];
      if (!rows.length) {
        this.depositBal = '0.0000';
        return
      }
      const t = rows[0].lpt / 10000;
      this.depositBal = toFixed(t, 4);
      this.releaseTime = toLocalTime(`${rows[0].rex_maturity_time}.000+0000`)
      this.handleDown()
    },
    // 倒计时处理
    handleDown() {
      const down = countdown(this.releaseTime, false, 'hours')
      this.down = down;
      if (down.total > 0) {
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.handleDown()
        }, 1000);
      }
    },
    // 取回操作
    handleWithdraw() {
      if (!this.regNum) {
        return
      }
      if (this.down.total > 0) {
        return
      }
      const permission = this.scatter.identity.accounts[0].authority;
      const formName = this.scatter.identity.accounts[0].name;
      let amount = Number(this.withdraw || 0) * 10000
      amount = parseInt(amount)
      const params = {
        actions: [{
          account: 'yfcsteadyone',
          name: 'withdraw',
          authorization: [{
            actor: formName, // 转账者
            permission,
          }],
          data: {
            user: formName,
            sym: 'EOS',
            amount
          },
        }],
      }
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
          message: this.$t('public.success'),
          type: 'success'
        });
        this.handleClose(true)
      })
    },
  }
}
</script>

<style lang="scss" scoped>
@import '../css/dialog.scss';
.percent_p{
  margin: 20px 0 0;
}
</style>
