<template>
  <div class="reward flexb">
    <div>
      <div>{{ $t('mine.mineBonus') }}</div>
      <div class="flexa green">
        <span class="dinBold rdNum">{{ parseFloat(total || 0).toFixed(4) }}</span>
        <span class="coin dinReg">DFS</span>
      </div>
      <div class="tip dinReg">≈${{ aboutPrice }} </div>
    </div>
    <div class="claim flexa">
      <!-- <img class="tipImg" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/tips_icon_btn.svg"> -->
      <div class="btn flexc" @click="handleClaimAll">{{ $t('mine.claimAll') }}</div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
// import { DApp } from '@/utils/wallet';
export default {
  name: 'rewardInfo',
  props: {
    total: {
      type: String,
      default: '0.0000'
    }
  },
  computed: {
    ...mapState({
      account: state => state.app.account,
      coinPrices: (state) => state.sys.coinPrices,
    }),
    aboutPrice() {
      const dfsPriceObj = this.coinPrices.find(v => v.coin === 'DFS');
      const dfsPrice = dfsPriceObj.price;
      const about = parseFloat(this.total || 0) * parseFloat(dfsPrice || 0);
      return parseFloat(about || 0).toFixed(2)
    },
  },
  methods: {
    handleClaimAll() {
      this.$emit('listenUpdate', true)
    },
  }
}
</script>

<style lang="scss" scoped>
.reward{
  text-align: left;
  font-size: 32px;
  border-radius: 20px;
  padding: 32px 26px;
  box-shadow: 4px 4px 10px 4px rgba(230,230,230,0.64);
  .green{
    color: $color-main;
    font-size: 40px;
  }
  .rdNum{
    font-size: 60px;
    margin-right: 10px;
  }
  .coin{
    padding-top: 5px;
  }
  .claim{
    .tipImg{
      width: 32px;
      margin-right: 15px;
    }
    .btn{
      color: #FFF;
      background: $color-main;
      border-radius: 9px;
      height: 92px;
      width: 200px;
    }
  }
}
</style>
