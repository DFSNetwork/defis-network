<template>
  <div class="usdd">
    <div class="title">{{ $t('public.warmPrompt') }}</div>
    <div>{{ this.$t('bank.bankUpdata') }}</div>
    <!-- <div class="mt10">{{ $t('public.usddTip') }}</div> -->
  </div>
</template>

<script>
export default {
}
</script>

<style lang="scss" scoped>
.usdd{
  text-align: left;
  padding: 40px;
  color: #000;
  font-size: 28px;
  .mt10{
    margin-top: 10px;
  }
  .title{
    text-align: center;
    font-size: 30px;
    font-weight: 500;
    color: #f5a623;
    margin-bottom: 20px;
  }
}
</style>
