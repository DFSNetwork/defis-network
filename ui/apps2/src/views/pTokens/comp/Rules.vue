<template>
  <div class="rules">
    <div class="title">注意事项</div>
    <div class="mb26">1. 最小提币数量为：0.00005 BTC / 0.00000001 ETH</div>
    <div class="mb26 red_p">2. pNetwok当前只支持最后一条提现，请注意不要重复发起提现。等待上一笔提现到账后，再发起下一笔提现。</div>
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
