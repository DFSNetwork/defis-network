<template>
  <div class="rewardTip">
    <div class="title">收益计算规则</div>
    <div class="content">
      <div class="mt10">利率是动态市场化，存满一年达到面板显示年化</div>
      <div class="mt10">时间加成 = 当前时间 - 最后一次操作时间</div>
      <div class="mt10">收益 = 理财本金 / YFC价格 * pow(每秒利率，时间加成)</div>
      <div class="mt10">最大收益 = 待分配池子余额</div>
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
