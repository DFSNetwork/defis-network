<template>
  <div class="leave">
    <img class="close" @click="handleClose"
      src="https://cdn.jsdelivr.net/gh/defis-net/material/svg/sd_icon_btn.svg">
    <div class="title">{{ $t('invite.leave') }}</div>
    <div class="tips">
      <div>{{ $t('invite.leaveRules1') }}</div>
      <div>{{ $t('invite.leaveRules2') }}</div>
      <div>{{ $t('invite.leaveRules3') }}</div>
    </div>
    <div class="btn flexc" @click="handleLeaveFarm">{{ $t('invite.sureLeave') }}</div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { DApp } from '@/utils/wallet';

export default {
  name: 'leave',
  computed: {
    ...mapState({
      account: (state) => state.app.account,
    }),
  },
  methods: {
    handleClose() {
      this.$emit('listenClose', false)
    },
    // 退出农场
    handleLeaveFarm() {
      const name = this.account.name;
      const permission = this.account.permissions;
      const params = {
        actions: [{
          account: 'farms.tag',
          name: 'leave',
          authorization: [{
            actor: name, // 转账者
            permission,
          }],
          data: {
            farmer: name,
          }
        }]
      }
      DApp.toTransaction(params, (err) => {
        if (err && err.code === 402) {
          return;
        }
        if (err) {
          this.$toast({
            type: 'fail',
            message: err.message,
          })
          return;
        }
        this.$toast({
          type: 'success',
          message: 'Success'
        })
        this.$emit('listenClose', true)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.leave{
  position: relative;
  padding: 30px;
  font-size: 28px;
  text-align: left;
  .close{
    position: absolute;
    top: 30px;
    right: 30px;
    width: 28px;
  }
  .title{
    font-size: 36px;
    font-weight: 500;
    text-align: center;
    margin-bottom: 30px;
  }
  .tips{
    padding-left: 20px;
    &>div{
      margin-bottom: 20px;
    }
  }
  .btn{
    height: 90px;
    font-size: 32px;
    color: #fff;
    border-radius: 45px;
    background: $color-red;
    margin-top: 30px;
  }
}
</style>
