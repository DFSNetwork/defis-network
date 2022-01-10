<template>
  <div class="createTip">
    <img class="close" @click="handleClose(false)"
      src="https://cdn.jsdelivr.net/gh/defis-net/material/svg/sd_icon_btn.svg" alt="">
    <div class="title">{{ $t('invite.create') }}</div>
    <div class="main">
      <div>{{ $t('invite.createRules1') }}</div>
      <div>{{ $t('invite.createRules2') }}</div>
      <div>{{ $t('invite.createRules3') }}</div>
      <div>{{ $t('invite.createRules4') }}</div>
      <div>{{ $t('invite.createRules5') }}</div>
      <div>{{ $t('invite.createRules6') }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'createTip',
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
