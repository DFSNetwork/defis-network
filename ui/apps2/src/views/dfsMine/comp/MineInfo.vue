<template>
  <div class="mineInfo">
    <div class="flexb lists">
      <div class="item">
        <div class="dinBold num">${{ tvl_usdt }}</div>
        <div class="small">{{ $t('mine.lockFunds') }}</div>
      </div>
      <div class="item mr0">
        <div class="dinBold num">{{ maxApy }}%</div>
        <div class="small">{{ $t('dsr.nowApy') }} </div>
      </div>
    </div>
    <div class="flexb lists">
      <div class="item">
        <div class="dinBold num">{{ nextLess }}</div>
        <div class="small">{{ $t('mine.nextLess') }}(DFS)</div>
      </div>
      <div class="item mr0">
        <div class="dinBold num">{{ showCurrent }}</div>
        <div class="small">{{ $t('mine.current') }}(DFS)</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { toFixed, accSub, accAdd } from '@/utils/public';
import { getApy } from '../dfsMine';

export default {
  name: 'mineInfo',
  props: {
    current: {
      type: String,
      default: '0.0000',
    },
    swapBal: {
      type: Object,
      default: function sbl() {
        return {}
      }
    },
    allBal: {
      type: Object,
      default: function sbl() {
        return {}
      }
    },
  },
  data() { 
    return {
      tvl_usdt: '0.0000',
      // current: '0.0000',
      showCurrent: '0.0000',
      runTimer: null, // 数据滚动定时器
    }
  },
  mounted() {
    this.handleGetTvl()
  },
  beforeDestroy() {
    clearInterval(this.runTimer)
  },
  computed: {
    ...mapState({
      coinPrices: (state) => state.sys.coinPrices,
    }),
    nextLess() {
      let n = Number(this.showCurrent) % 1000000;
      n = accSub(1000000, n)
      return toFixed(n, 4)
    },
    maxApy() {
      let dfsApy = getApy(this.allBal, this.swapBal,'dfs');
      let eosApy = getApy(this.allBal, this.swapBal,'eos');
      let usdtApy = getApy(this.allBal, this.swapBal,'usdt');
      let arr = [dfsApy, eosApy, usdtApy].sort((a, b) => parseFloat(b || 0) - parseFloat(a || 0))
      const apy = parseFloat(arr[0]) + parseFloat(arr[1])
      return (apy || 0).toFixed(2)
    }
  },
  watch: {
    current: {
      handler: function ct(newVal) {
        if (!parseFloat(newVal)) {
          return
        }
        this.handleRun(this.current)
      }
    },
  },
  methods: {
    async handleGetTvl() {
      const {status, result} = await this.$api.get_swap_counter();
      if (!status) {
        return;
      }
      this.tvl_usdt = parseInt(result.tvl_usdt) + '';
    },
    handleRun(current) {
      clearInterval(this.runTimer)
      if (!Number(this.showCurrent)) {
        this.showCurrent = this.current;
      }
      let tShowCurrent = this.showCurrent;
      let t = accSub(current, tShowCurrent) / 100;
      if (t < 0) {
        return
      }
      this.runTimer = setInterval(() => {
        tShowCurrent = accAdd(tShowCurrent, t);
        if (tShowCurrent > current) {
          clearInterval(this.runTimer)
          return
        }
        this.showCurrent = toFixed(tShowCurrent, 4);
      }, 50)
    }
  }
}
</script>

<style lang="scss" scoped>
.mineInfo{
  font-size: 24px;
  border-radius: 20px;
  margin-top: 10px;
  .lists{
    margin-top: 30px;
  }
  .item{
    padding: 28px 0;
    margin-right: 28px;
    border-radius: 20px;
    flex: 1;
    box-shadow: 4px 4px 10px 4px rgba(230,230,230,0.64);
    &.mr0{
      margin-right: 0;
    }
    .num{
      font-size: 36px;
      margin-bottom: 6px;
    }
  }
}
</style>