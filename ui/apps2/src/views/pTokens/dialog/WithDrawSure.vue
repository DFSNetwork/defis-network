<template>
  <div class="sureTip">
    <div class="title">提现</div>
    <div class="content">
      <div class="flexs">
        <span>提现地址：</span>
        <span class="yellow">{{ params.address }}</span>
      </div>
      <div class="flexa">
        <span>提现数量：</span>
        <span class="din">{{ params.amount }}</span>
      </div>
    </div>
    <div class="btn flexc" @click="handleSure">确认提现</div>
  </div>
</template>

<script>
export default {
  name: 'withdrawSure',
  props: {
    params: {
      type: Object,
      default: function ps() {
        return {}
      }
    }
  },
  methods: {
    handleSure() {
      this.$emit('listenSure', true)
    }
  }
}
</script>

<style lang="scss" scoped>
.sureTip{
  width: 620px;
  padding: 38px;
  border-radius: 12px;
  box-sizing: border-box;
  font-size: 28px;
  color: #333;
  .title{
    font-size: 32px;
    text-align: center;
    margin-bottom: 18px;
  }
  .content{
    // padding-left: 50px;
    &>div{
      margin-bottom: 10px;
      line-height: 40px;
    }
    .yellow{
      max-width: 400px;
      width: 400px;
      color: #FFBD23;
      word-break: break-all;
    }
  }
  .btn{
    height: 90px;
    border-radius: 45px;
    background: #29D4B0;
    color: #FFF;
    margin-top: 30px;
    font-size: 32px;
  }
}
</style>
