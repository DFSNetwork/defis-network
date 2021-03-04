<template>
  <div class="marketTip">
    <!-- <div>{{ $t('market.marketTip') }}</div> -->
    <div>当前做市盈亏支持</div>
    <ul class="ul">
      <li>TokenA本位：TokenA盈亏 + TokenB盈亏 * TokenB价格</li>
      <li>TokenB本位：TokenA盈亏 / TokenB价格 + TokenB盈亏</li>
      <li>双币本位：TokenA盈亏 & TokenB盈亏</li>
    </ul>
    <div class="tip">* 盈亏 = 当前做市 - 做市本金</div>
  </div>
</template>

<script>
export default {
  name: 'marketTip'
}
</script>

<style lang="scss" scoped>
.marketTip{
  padding: 40px;
  font-size: 26px;
  color: #000;
  .ul{
    text-align: left;
    list-style: disc outside;
    margin-left: 2em;
    color: #070707;
    font-size: 24px;
    margin-bottom: 10px;
    li{
      padding-top: 5px;
    }
  }
  .tip{
    text-align: left;
    padding-left: 30px;
  }
}
</style>
