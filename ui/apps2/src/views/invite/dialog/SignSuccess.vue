<template>
  <div class="signSuccess">
    <img class="bg" src="https://cdn.jsdelivr.net/gh/defis-net/material2/farm/signSuccess.png" >
    <div class="main">
      <div class="title">{{ $t('invite.helpSignSuccess') }}</div>
      <div class="get flexa">{{ $t('invite.hasGetReward') }}</div>
      <ul class="ul">
        <li>· {{ $t('invite.helpSignRules1') }}</li>
        <li>· {{ $t('invite.helpSignRules2') }}</li>
        <li>· {{ $t('invite.helpSignRules3') }}</li>
      </ul>
      <div class="btn flexc" @click="handleToBrowser">{{ $t('invite.look') }}</div>
    </div>
    <img class="close" @click="handleClose"
      src="https://cdn.jsdelivr.net/gh/defis-net/material2/dfs/close-white.png" >
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { toBrowser } from '@/utils/public';

export default {
  name: 'signSuccess',
  computed: {
    ...mapState({
      account: (state) => state.app.account,
    }),
  },
  methods: {
    handleToBrowser() {
      if (!this.account.name) {
        return
      }
      toBrowser(this.account.name, 'account')
    },
    handleClose() {
      this.$emit('listenClose', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.signSuccess{
  position: relative;
  padding: 40px;
  .bg{
    width: 100%;
  }
  .main{
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    padding: 100px 80px;
    .title{
      font-size: 40px;
      font-weight: 600;
      text-align: center;
      margin-top: 60px;
    }
    .get{
      color: #FF5F00;
      font-size: 30px;
      margin-top: 65px;
      padding-right: 100px;
      height: 50px;
      justify-content: flex-end;
    }
    .ul{
      font-size: 26px;
      margin-top: 150px;
      color: #FFF;
      padding-left: 50px;
      line-height: 42px;
      height: 172px;
      overflow: auto;
    }
    .btn{
      font-size: 36px;
      font-weight: 500;
      color: #FFF;
      margin-top: 40px;
      text-align: center;
      height: 90px;
    }
  }
  .close{
    position: relative;
    display: block;
    width: 30px;
    margin: auto;
    z-index: 1;
  }
}
</style>
