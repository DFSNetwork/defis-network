<template>
  <div class="rewardTip">
    <div class="title">{{ $t('financial.reRules') }}</div>
    <div class="content">
      <div class="mt10">{{ $t('financial.reRules1') }}</div>
      <div class="mt10">{{ $t('financial.reRules2') }}</div>
      <div class="mt10">{{ $t('financial.reRules3') }}</div>
      <div class="mt10">{{ $t('financial.reRules4') }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "rewardTip"
}
</script>

<style lang="scss" scoped>
.mt10{
  margin-top: 10px;
}
.rewardTip{
  padding: 28px;
  color: #333;
  font-size: 26px;
  .title{
    text-align: center;
    font-size: 32px;
    font-weight: 500;
    margin-bottom: 20px;
  }
}
</style>
