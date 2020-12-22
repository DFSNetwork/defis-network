<template>
  <div class="sureTip">
    <div class="title">提现</div>
    <div class="content">
      <div class="flexa">
        <span>提现地址：</span>
        <span class="yellow">123456788</span>
      </div>
      <div class="flexa">
        <span>提现数量：</span>
        <span>1.00000000</span>
      </div>
    </div>
    <div class="btn flexc">确认提现</div>
  </div>
</template>

<script>
export default {
  name: 'withdrawSure',
}
</script>

<style lang="scss" scoped>
.sureTip{
  width: 600px;
  padding: 28px;
  border-radius: 12px;
  font-size: 28px;
  color: #333;
  .title{
    font-size: 32px;
    text-align: center;
    margin-bottom: 18px;
  }
  .content{
    padding-left: 50px;
    &>div{
      margin-bottom: 10px;
    }
    .yellow{
      color: #FFBD23;
    }
  }
  .btn{
    height: 90px;
    border-radius: 45px;
    background: #29D4B0;
    color: #FFF;
    margin-top: 30px;
  }
}
</style>
