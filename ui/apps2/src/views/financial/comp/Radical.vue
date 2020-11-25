<template>
  <div class="steady">
    <div class="title flexa">
      <span class="name">激进型</span>
      <span class="tip">波动适长，长期追求更高收益</span>
    </div>
    <div class="lists">
      <div class="list" v-for="(item, index) in list" :key="index">
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
        coin: 'EOS',
        contract: 'eosio.token',
        coinImg: 'https://cdn.jsdelivr.net/gh/defis-net/material/coin/eosio.token-eos.svg',
        apy: '0.00',
        lockTime: 4,
        desc: '稳健型 中低风险',
      }],
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../css/financial.scss';
</style>
