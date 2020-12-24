<template>
  <div class="withdraw">
    <div class="title">提币地址</div>
    <div>
      <van-field class="ipt din flexa" v-model="address" placeholder="请输入提币地址" />
    </div>
    <div class="title flexb">
      <span>提币数量</span>
      <span class="bal tip">余额：{{ bal }} {{ action.token1 }}</span>
    </div>
    <div>
      <van-field class="ipt din flexa" v-model="amount" placeholder="请输入提币数量" />
    </div>
    <div class="percent_p flexb din">
      <span :class="{'act_p': percent === 0}" @click="handlePercent(0)">0%</span>
      <span :class="{'act_p': percent === 25}" @click="handlePercent(25)">25%</span>
      <span :class="{'act_p': percent === 50}" @click="handlePercent(50)">50%</span>
      <span :class="{'act_p': percent === 75}" @click="handlePercent(75)">75%</span>
      <span :class="{'act_p': percent === 100}" @click="handlePercent(100)">100%</span>
    </div>
    <div class="btn flexc" v-loading="loading" @click="handleReg">提币</div>

    <van-popup class="popup" v-model="show">
      <WithDrawSure :params="params" @listenSure="handleSure"/>
    </van-popup>
  </div>
</template>

<script>
import { EosModel } from '@/utils/eos';
import { mapState } from 'vuex';
import {get_balance} from '@/utils/api'
import {toFixed} from '@/utils/public'
import WithDrawSure from '../dialog/WithDrawSure'
export default {
  name: 'withdrawForPtoken',
  components: {
    WithDrawSure
  },
  props: {
    action: {
      type: Object,
      default: function atn() {
        return {}
      }
    }
  },
  data() {
    return {
      percent: 0,
      amount: '',
      address: '',
      bal: '0.00000000',
      show: false,
      params: {},
      loading: false,
    }
  },
  computed: {
    ...mapState({
      account: state => state.app.account,
    }),
  },
  watch: {
    account: {
      handler: function at(newVal) {
        if (!newVal.name) {
          return
        }
        this.handleGetBal();
      },
      deep: true,
      immediate: true
    },
    action() {
      this.handleGetBal()
    }
  },
  methods: {
    async handleGetBal() {
      if (!this.account.name) {
        return
      }
      const params = {
        code: this.action.contract1,
        symbol: this.action.token1,
        decimal: this.action.decimal1,
        account: this.account.name,
      }
      const {status, result} = await get_balance(params)
      if (!status) {
        return
      }
      this.bal = result.split(' ')[0]
    },
    handleReg() {
      if (!this.address.trim()) {
        this.$message.error('请输入提现地址')
        return
      }
      if (Number(this.amount || 0) < 0.00005 && this.action.token1 === 'PBTC') {
        this.$message.error('最少提现数量为0.00005 PBTC')
        return
      }
      if (Number(this.amount || 0) > Number(this.bal)) {
        this.$message.error('余额不足')
        return
      }
      this.params = {
        address: this.address,
        amount: `${toFixed(this.amount, this.action.decimal1)} ${this.action.token1}`,
        token: this.action.token1
      }
      this.show = true;
    },
    handleSure() {
      this.loading = true;
      const formName = this.account.name;
      const permission = this.account.permissions;
      const quantity = `${toFixed(this.amount, this.action.decimal1)} ${this.action.token1}`;
      const params = {
        actions: [{
          account: this.action.contract1,
          name: 'redeem',
          authorization: [{
            actor: formName, // 转账者
            permission,
          }],
          data: {
            memo: this.address.trim(),
            sender: formName,
            quantity,
          }
        }]
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
        this.show = false;
        this.$message({
          message: this.$t('public.success'),
          type: 'success'
        });
        setTimeout(() => {
        }, 800);
      })
    },
    handlePercent(n) {
      this.percent = n
      const amount = this.bal * n / 100;
      this.amount = amount.toFixed(this.action.decimal1)
    },
  }
}
</script>

<style lang="scss" scoped>
.withdraw{
  color: #333;
  font-size: 28px;
  text-align: left;
  margin: 20px 32px;
  .title{
    font-size: 24px;
    margin: 16px 0;
  }
  .ipt{
    height: 80px;
    padding: 0px 16px;
    box-sizing: border-box;
    width: 100%;
    border: 1px solid rgba(220,220,220,.3);
    border-radius: 4px;
    margin-bottom: 10px;
    font-size: 28px;
  }
  .percent_p{
    margin: 36px 0;
  }
  .btn{
    border-radius: 45px;
    height: 90px;
    font-size: 36px;
    color: #FFF;
    background: #29D4B0;
    margin-bottom: 50px;
  }
}
.popup{
  border-radius: 12px;
}
</style>
