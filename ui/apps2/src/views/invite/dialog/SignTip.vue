<template>
  <div class="signRules">
    <img class="close" @click="handleClose(false)"
      src="https://cdn.jsdelivr.net/gh/defis-net/material/svg/sd_icon_btn.svg" alt="">
    <div class="title">{{ $t('invite.farmRules') }}</div>
    <div class="main">
      <div>{{ $t('invite.farmRules1') }}</div>
      <div>{{ $t('invite.farmRules2') }}</div>
      <div>{{ $t('invite.farmRules3') }}</div>
      <div>{{ $t('invite.farmRules4') }}</div>
      <div>{{ $t('invite.farmRules5') }}</div>
      <div>{{ $t('invite.farmRules6') }}</div>
      <div>{{ $t('invite.farmRules6_1') }}</div>
      <div>{{ $t('invite.farmRules7') }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'signTip',
}
</script>

<style lang="scss" scoped>
.signRules{
  padding: 30px;
  border-radius: 12px;
  font-size: 28px;
  color: #333;
  .close{
    position: absolute;
    top: 26px;
    right: 26px;
    width: 24px;
  }
  .title{
    font-size: 36px;
    font-weight: 500;
    margin-bottom: 10px;
    text-align: center;
  }
  .main{
    text-align: left;
    // padding-left: 18px;
    &>div{
      margin-top: 15px;
    }
  }
}
</style>
