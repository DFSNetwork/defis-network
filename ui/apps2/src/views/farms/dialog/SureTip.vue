<template>
  <div class="moreTip">
    <div class="title">抢座预览</div>
    <div class="content">
      <!-- 存入预览 -->
      <div v-if="params.token >= 0">
        <div class="flexs">
          <span>预约排名：</span>
          <span>{{ params.planRank || 0 }}</span>
        </div>
        <div class="flexs">
          <span>预计存入：</span>
          <div>
            <div>{{ `${params.pay0} ${params.market.symbol0}` }}</div>
            <div>{{ `${params.pay1} ${params.market.symbol1}` }}</div>
          </div>
        </div>
        <div class="flexs">
          <span>我的余额：</span>
          <div>
            <div>{{ `${params.bal0} ${params.market.symbol0}` }}</div>
            <div>{{ `${params.bal1} ${params.market.symbol1}` }}</div>
          </div>
        </div>
      </div>
      <div v-else>
        <div class="flexs">
          <span>预约排名：</span>
          <span>{{ params.planRank || 0 }}</span>
        </div>
        <div class="flexs">
          <span>预计取出：</span>
          <div>
            <div>{{ `${params.pay0} ${params.market.symbol0}` }}</div>
            <div>{{ `${params.pay1} ${params.market.symbol1}` }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="flexb">
      <div class="btn cancel flexc" @click="handleClose()">取消</div>
      <div class="btn flexc" v-loading="loading" @click="handleSure">确认抢座</div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { EosModel } from '@/utils/eos';

export default {
  name: 'rankTip',
  props: {
    params: {
      type: Object,
      default: function ps() {
        return {}
      }
    }
  },
  data() {
    return {
      loading: false,
    }
  },
  computed: {
    ...mapState({
      scatter: state => state.app.scatter,
      baseConfig: state => state.sys.baseConfig,
    }),
  },
  methods: {
    handleSure() {
      this.$emit('handleSure', true)
      if (!this.handleReg()) {
        return
      }
      const params = this.params;
      const market = this.params.market;
      this.loading = true;
      if (params.token < 0) {
        this.handleSell(market, Math.abs(params.token))
        return
      }
      this.handleDeposit(market, params.pay0, params.pay1)
    },
    handleClose() {
      this.$emit('handleClose', true)
    },

    handleReg() {
      const params = this.params;
      const token = params.token;
      const market = this.params.market;
      const pay0 = params.pay0;
      const pay1 = params.pay1;
      if (token > 0) {
        const bal0 = params.bal0;
        const bal1 = params.bal1;
        if (Number(pay0) > Number(bal0) || Number(pay1) > Number(bal1)) {
          this.$message({
            message: '余额不足',
            type: 'error'
          });
          return false
        }
        if (!Number(pay0)) {
          const min = 1 / 10 ** market.decimal0;
          this.$message({
            message: `至少${min.toFixed(market.decimal0)} EOS`,
            type: 'error'
          });
          return false
        }
        if (!Number(pay1)) {
          const min = 1 / 10 ** market.decimal1;
          this.$message({
            message: `至少${min.toFixed(market.decimal1)} ${market.symbol1}`,
            type: 'error'
          });
          return false
        }
      }
      if (token < 0) {
        if (!Number(pay0)) {
          const min = 1 / 10 ** market.decimal0;
          this.$message({
            message: `至少${min.toFixed(market.decimal0)} EOS`,
            type: 'error'
          });
          return false
        }
        if (!Number(pay1)) {
          const min = 1 / 10 ** market.decimal1;
          this.$message({
            message: `至少${min.toFixed(market.decimal1)} ${market.symbol1}`,
            type: 'error'
          });
          return false
        }
      }
      return true;
    },
    // 存款
    handleDeposit(obj, pay0, pay1) {
      const formName = this.scatter.identity.accounts[0].name;
      const permission = this.scatter.identity.accounts[0].authority;
      const params = {
        actions: [
          {
            account: this.baseConfig.toAccountSwap,
            name: 'deposit',
            authorization: [{
              actor: formName, // 转账者
              permission,
            }],
            data: {
              user: formName,
              mid: obj.mid
            }
          },
          {
            account: obj.contract0,
            name: 'transfer',
            authorization: [{
              actor: formName, // 转账者
              permission,
            }],
            data: {
              from: formName,
              to: this.baseConfig.toAccountSwap,
              quantity: `${pay0} ${obj.symbol0}`,
              memo: `deposit`
            }
          },
          {
            account: obj.contract1,
            name: 'transfer',
            authorization: [{
              actor: formName, // 转账者
              permission,
            }],
            data: {
              from: formName,
              to: this.baseConfig.toAccountSwap,
              quantity: `${pay1} ${obj.symbol1}`,
              memo: `deposit`
            }
          }
        ]
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
        this.$emit('handleSure', true)
        this.$message({
          message: this.$t('public.success'),
          type: 'success'
        });
      })
    },
    handleSell(obj, sellToken) {
      const formName = this.$store.state.app.scatter.identity.accounts[0].name;
      const permission = this.$store.state.app.scatter.identity.accounts[0].authority;
      const params = {
        actions: [
          {
            account: this.baseConfig.toAccountSwap,
            name: 'withdraw',
            authorization: [{
              actor: formName, // 转账者
              permission,
            }],
            data: {
              user: formName,
              mid: obj.mid,
              amount: sellToken
            }
          },
        ]
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
        this.$emit('handleSure', true)
        this.$message({
          message: this.$t('public.success'),
          type: 'success'
        });
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.moreTip{
  font-size: 27px;
  padding: 40px;
  text-align: left;
  color: #000;
  .title{
    text-align: center;
    font-size: 33px;
    margin-bottom: 20px;
    color: #f5a623;
  }
  .content{
    line-height: 38px;
    padding-left: 50px;
  }
  .btn{
    flex: 1;
    margin-top: 20px;
    font-size: 27px;
    background:rgba(7,215,155,1);
    border-radius: 30px;
    color: #fff;
    padding: 14px 25px;
    &:active{
      background:rgba(2,198,152,1);
    }
    &.backBtn{
      background:rgba(192,93,93,1);
      margin-left: 15px;
      &:active{
        background:rgba(185,78,90,1);
      }
    }
    &.cancel{
      background: rgba(7,215,155,1);
      margin-right: 20px;
      color: #999;
      background:#fafafa;
      border: 1px solid #eee;
    }
  }
}
</style>
