<template>
  <div class="claimRules">
    <div class="title">{{ $t('nodePools.claimRules') }}</div>
    <div class="constent">
      <div>{{ $t('nodePools.claimRules1') }}</div>
      <div>{{ $t('nodePools.claimRules2') }}</div>
      <div>{{ $t('nodePools.claimRules3') }}</div>
      <div>{{ $t('nodePools.claimRules4') }}</div>
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
