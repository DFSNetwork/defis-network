<template>
  <div class="createTip">
    <img class="close" @click="handleClose(false)"
      src="https://cdn.jsdelivr.net/gh/defis-net/material/svg/sd_icon_btn.svg" alt="">
    <div class="title">{{ $t('invite.rewardRules') }}</div>
    <div class="main">
      <div>{{ $t('invite.rewardRules1') }}</div>
      <div>{{ $t('invite.rewardRules2') }}</div>
      <div>{{ $t('invite.rewardRules3') }}</div>
      <div>{{ $t('invite.rewardRules4') }}</div>
      <div>{{ $t('invite.rewardRules5') }}</div>
      <div>{{ $t('invite.rewardRules6') }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'claimTip',
  methods: {
    handleClose() {
      this.$emit('listenClose', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.createTip{
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
    padding-left: 18px;
    &>div{
      margin-top: 15px;
    }
  }
}
</style>
