<template>
  <div class="minReward">
    <div class="title">{{ $t('mine.minAbleReward') }}</div>
    <div v-if="$route.name !== 'dssForTag'">
      <div class="mb10">{{ $t('mine.minReward', {minReward: minReward}) }}</div>
      <div class="mb10">{{ $t('mine.rewardCut') }}</div>
      <div>{{ $t('mine.rewardPrice', {coin: 'DFS'}) }}</div>
    </div>
    <div v-else>
      <div>{{ $t('mine.rewardPrice', {coin: 'TAG'}) }}</div>
    </div>
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
  text-align: left;
  .title{
    color: #000;
    text-align: center;
    font-size: 30px;
    margin-bottom: 20px;
  }
}
</style>
