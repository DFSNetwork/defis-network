<template>
  <div class="claimRules">
    <div class="title">{{ $t('nodePools.mineRules') }}</div>
    <div class="constent">
      <div>{{ $t('nodePools.mineRules1') }}</div>
      <div>{{ $t('nodePools.mineRules2') }}</div>
      <div>{{ $t('nodePools.mineRules3') }}</div>
      <div>{{ $t('nodePools.mineRules4') }}</div>
      <div>{{ $t('nodePools.mineRules5') }}</div>
      <div>{{ $t('nodePools.mineRules6') }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'claimRules',
}
</script>

<style lang="scss" scoped>
.claimRules{
  padding: 26px;
  font-size: 24px;
  .title{
    font-size: 33px;
    font-weight: 500;
    margin-bottom: 20px;
  }
  .constent{
    text-align: left;
    &>div{
      margin-top: 10px;
    }
  }
}
</style>
