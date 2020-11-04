<template>
  <div class="allClaim flexb flexs">
    <img class="bgImg" src="@/assets/navImg/myReward.png" alt="">
    <div>
      <div class="subTitle flexa tip">
        <span>{{ $t('mine.waitClaim') }}</span>
        <img class="tipIcon ml10" @click="showReWardTip = true" src="@/assets/img/dex/tips_icon_btn.svg" alt="">
      </div>
      <div class="claimNum dinBold">0.11111111 DFS</div>
      <div class="claimNum dinBold">0.22222222 EOS</div>
      <div class="claimNum dinBold">0.33333333 YFC</div>
      <div class="claimNum dinBold">0.44444444 PDD</div>
    </div>
    <div class="flexb">
      <div class="allClaimBtn" v-loading="claim" @click="handleClaimAll">{{ $t('bonus.claim') }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'claim',
  methods: {
    handleClaimAll() {
    }
  }
}
</script>

<style lang="scss" scoped>

.allClaim{
  position: relative;
  margin: 30px 32px;
  border-radius: 12px;
  color: #333;
  padding: 28px;
  box-sizing: border-box;
  box-shadow: 0px 4px 8px 4px rgba(220,220,220,0.5);
  .bgImg{
    position: absolute;
    left: -10px;
    top: -10;
    width: 103%;
    // height: 170px;
    z-index: -1;
  }
  .ml10{
    margin-left: 10px;
  }
  .subTitle{
    font-size: 26px;
  }
  .claimNum{
    font-size: 30px;
    font-weight: 500;
    margin-top: 8px;
  }
  .allClaimBtn{
    background: #29D4B0;
    border-radius: 30px;
    color: #FFF;
    font-size: 28px;
    padding: 10px 36px;
  }
}
</style>