<template>
  <div>

  </div>
</template>

<script>
import { EosModel } from '@/utils/eos';
export default {
  name: 'poolsData',
  data() {
    return {
    }
  },
  mounted() {
    this.handleGetWeight();
  },
  methods: {
    handleGetWeight() {
      const params = {
        code: 'miningpool11',
        scope: 'miningpool11',
        table: 'weights',
        json: true,
        limit: 100
      }
      EosModel.getTableRows(params, (res) => {
        console.log(res)
      })
    }
  },
}
</script>

<style lang="scss" scoped>

</style>
