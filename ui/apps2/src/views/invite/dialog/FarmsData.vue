<template>
  <div class="farmsData">
    <img class="close" @click="handleClose(false)"
      src="https://cdn.jsdelivr.net/gh/defis-net/material/svg/sd_icon_btn.svg" alt="">
    <div class="title">{{ $t('invite.farmsData') }}</div>
    <div class="main">
      <div>{{ $t('invite.farmDataTip1') }}</div>
      <div v-clipboard:copy="'fund.tag'"
          v-clipboard:success="onCopy"
          v-clipboard:error="onError">{{ $t('invite.farmDataTip2') }}（
          <span class="green_p">fund.tag</span>
          ）</div>
      <div>{{ $t('invite.farmDataTip3') }}</div>
      <div>{{ $t('invite.farmDataTip4') }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'farmsData',
  methods: {
    onCopy() {
      this.$toast.success(this.$t('public.copySuccess'));
    },
    onError() {
      this.$toast.fail(this.$t('public.copyFail'));
    },
  }
}
</script>

<style lang="scss" scoped>
.farmsData{
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
