<template>
  <div class="ogxTip">
    <div class="title">成交价格</div>
    <div class="content">
       该币种交易的成交价格以预言机提供的价格成交，
       具体成交价格会以成交时间距离最近一次的预言机的报价为准，
       当更新时间与当前时间间隔较长时进行交易会产生一定误差。 
    </div>
  </div>
</template>

<script>
  export default {
    
  }
</script>

<style lang="scss" scoped>
.ogxTip{
  padding: 28px;
  font-size: 28px;
  text-align: left;
  color: #333;
  .title{
    text-align: center;
    font-size: 30px;
    font-weight: 500;
    margin-bottom: 20px;
  }
}
</style>