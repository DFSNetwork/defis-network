<template>
  <div class="steady">
    <div class="title flexa">
      <span class="name">激进型</span>
      <span class="tip">开发中</span>
    </div>
    <div class="lists">
      <div class="list" v-for="(item, index) in list" :key="index">
        <div class="loading flexc">敬请期待</div>
        <div class="coin flexb">
          <div class="flexa">
            <img class="coinImg" :src="item.coinImg">
            <div class="coinInfo">
              <div class="coinName">{{ item.coin }}</div>
              <div class="contract tip">{{ item.contract }}</div>
            </div>
          </div>
          <div class="btn flexc">管理</div>
        </div>

        <div class="flexb info">
          <div class="percent">
            <div class="apy dinBold">{{ item.apy }}%</div>
            <div class="tip">实时年化</div>
          </div>
          <div class="dataInfo">
            <div class="time dinBold">{{ item.lockTime }}天</div>
            <div class="tip">{{ item.desc }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'radical',
  data() {
    return {
      list: [{
        coin: 'OGX',
        contract: 'core.ogx',
        coinImg: 'https://ndi.340wan.com/eos/core.ogx-ogx.png',
        apy: '0.00',
        lockTime: 3,
        desc: '中低风险',
      }],
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../css/financial.scss';
.loading{
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  background: rgba(#fff, .9);
  color: #333;
}
</style>
