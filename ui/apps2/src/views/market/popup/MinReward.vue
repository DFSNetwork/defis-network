<template>
  <div class="minReward">
    <div class="title">最小可领取</div>
    <div class="mb10">由于币种精度限制，领取小于{{ minReward }}的DFS将不会有奖励到账。</div>
    <div>奖励的小数掉后四位将被截取。</div>
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
