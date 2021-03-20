<template>
  <div class="steady">
    <div class="title flexa">
      <span class="name">{{ $t('financial.status1') }}</span>
      <span class="tip">{{ $t('financial.subTitle') }}</span>
    </div>
    <div class="lists">
      <div class="list" v-for="(item, index) in list" :key="index" @click="handleTo(item)">
        <div class="coin flexb">
          <div class="flexa">
            <img class="coinImg" :src="item.coinImg">
            <div class="coinInfo">
              <div class="coinName">{{ item.coin }}</div>
              <div class="contract tip">{{ item.contract }}</div>
            </div>
          </div>
          <div class="btn flexc">{{ $t('financial.manage') }}</div>
        </div>

        <div class="flexb info">
          <div class="percent">
            <div class="apy dinBold">{{ args.apy || '0.00' }}%</div>
            <div class="tip">{{ $t('financial.apy') }}</div>
          </div>
          <div class="dataInfo">
            <div class="time dinBold">{{ $t('financial.day', {days: item.lockTime}) }}</div>
            <div class="tip">{{ $t(`financial.${item.desc}`) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { gat_apys } from '../js/financial';

export default {
  name: 'steady',
  data() {
    return {
      list: [{
        coin: 'EOS',
        contract: 'eosio.token',
        coinImg: 'https://cdn.jsdelivr.net/gh/defis-net/material2/coin/eosio.token-eos.svg',
        apy: '0.00',
        lockTime: 4,
        desc: 'riskLow',
      }],
      args: {},
    }
  },
  mounted() {
    this.handleGetAprs()
  },
  methods: {
    handleTo() {
      const params = {
        type: 0, // 0 - 稳健型理财 ｜ 1 - 激进型理财
        coin: 'EOS',
      }
      this.$router.push({
        name: 'financialDetail',
        params,
      })
    },
    handleGetAprs() {
      gat_apys((res) => {
        this.args = res;
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../css/financial.scss';
</style>
