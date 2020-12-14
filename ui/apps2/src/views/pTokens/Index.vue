<template>
  <div>
    pTokens 跨链兑换
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
export default {
  name: 'pTokens',
  data() {
    return {
      uuid: ''
    }
  },
  mounted() {
    this.handleGetAddress()
  },
  methods: {
    async handleGetAddress() {
      this.uuid = uuidv4()
      const params = {
        "id": this.uuid,
        "jsonrpc": "2.0",
        "method": "app_getNativeDepositAddress",
        "params": ["iq3rwbsfcqlv"]
      }
      const {status, result} = await this.$api.ptoken_get_address(params)
      console.log(result)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
