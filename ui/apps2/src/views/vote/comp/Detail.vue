<template>
  <div>
    <div class="title">
      <span class="act"></span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'voteDetail',
  data() {
    return {
      symbol: '',
    }
  },
  created() {
    console.log(this.$route.params.symbol)
    this.symbol = this.$route.params.symbol;
  },
}
</script>

<style lang="scss" scoped>

</style>