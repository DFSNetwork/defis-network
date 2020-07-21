<template>
  <div>
    <input v-model="sym0.num" type="text">
    <input v-model="sym1.num" type="text">
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { EosModel } from '@/utils/eos';
import { toFixed, accMul } from '@/utils/public';
export default {
  data: 'usdt',
  computed:{
     ...mapState({
      // 箭头函数可使代码更简练
      scatter: state => state.app.scatter,
      baseConfig: state => state.sys.baseConfig, // 基础配置 - 默认为{}
    })
  },
  data() {
    return {
      sym0: {
        decimal: 4,
        contract: 'tethertether',
        coin: 'USDT',
        num: '',
      },
      sym1: {
        decimal: 4,
        contract: 'bankofusddv1',
        coin: 'USDD',
        num: ''
      },
      direction: false,
    }
  },
  methods: {
    handleSend() {
      const params = {
        code: this.sym0.contract,
        toAccount: this.baseConfig.toAccountJin,
        memo: `redeem: ${item.id}`,
        quantity: item.issue
      }
    }
  },
}
</script>

<style lang="scss" scoped>

</style>
