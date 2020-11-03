<template>
  <div>
    <div>
      <div class="banner">
        <img class="bgImg" src="@/assets/img/poolspage/top_bg.svg" alt="">
        <div class="bannerTitle">DFS Mining</div>
        <div class="bannerSubTitle">No Founder. No Investor. No Pre-mine.</div>
        <div class="flexb floatDiv">
          <div class="left">
            <div>{{ lockEos }}</div>
            <div class="tip flexb bonus">
              <span> (EOS)</span>
            </div>
          </div>
          <div class="right">
            <div>{{ maxPerDayReward }}</div>
            <div class="tip bonus">
              <span>{{ $t('mine.wRewaed', {coin: 'EOS'}) }} (DFS)</span>
            </div>
          </div>
        </div>
      </div>
      <div class="miningInfo flexb" v-loading="loading">
        <div class="miningData">
          <div class="tip">{{ $t('mine.nextLess') }}</div>
          <div class="num">{{ nextLess }} DFS</div>
        </div>
        <div class="miningData">
          <div class="tip">{{ $t('mine.current') }}</div>
          <div class="num">{{ showCurrent }} DFS</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'nodePools',
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>

</style>
