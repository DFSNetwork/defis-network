<template>
  <div class="rules">
    <div class="title">注意事项</div>
    <div class="mb26">1. 最小提币数量为：0.00005 BTC / 0.00000001 ETH</div>
    <div class="mb26">2. 为了保障用户资金安全，提币由系统自动完成，超过一定时长将由人工审核</div>
    <div class="mb26 red_p">3. BTC资产的充值和提现因网络原因可能存在一定延迟 请耐心等待</div>
    <div class="red_p">4. 本功能由pNetwork实现，DFS提供定制化前端。</div>
  </div>
</template>

<script>
export default {
  name: 'ptokenRules',
}
</script>

<style lang="scss" scoped>
.rules{
  margin: 32px;
  font-size: 28px;
  color: #666;
  text-align: left;
  .title{
    font-size: 32px;
    font-weight: 500;
    color: #333;
    margin-bottom: 30px;
  }
  .mb26{
    margin-bottom: 26px;
  }
}
</style>
