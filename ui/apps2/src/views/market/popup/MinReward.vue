<template>
  <div class="minReward">
    <div class="title">{{ $t('mine.minAbleReward') }}</div>
    <div class="mb10">{{ $t('mine.minReward', {minReward: minReward}) }}</div>
    <div>{{ $t('mine.rewardCut') }}</div>
  </div>
</template>

<script>
export default {
  props: {
    minReward: {
      type: String,
      default: '0.0005'
    }
  }
}
</script>

<style lang="scss" scoped>
.minReward{
  padding: 40px;
  font-size: 28px;
  color: #333;
  .title{
    color: #000;
    text-align: center;
    font-size: 30px;
    margin-bottom: 20px;
  }
}
</style>
