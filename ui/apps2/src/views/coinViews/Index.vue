<template>
  <div>
    <div class="banner flexc">
      <div>
        <div class="bannerTitle">代币观察</div>
        <div class="bannerTip">币价走势，大额转账</div>
      </div>
    </div>
    <CoinData :marketLists="showList"/>
    <!-- <LargeTrade :marketLists="marketLists"/> -->
  </div>
</template>

<script>
// import LargeTrade from '@/views/largeTrade/Index';
import CoinData from './comp/CoinData';
export default {
  name: 'coinViews', // 币种窗口
  components: {
    // LargeTrade,
    CoinData,
  },
  data() {
    return {
      hasMids: [39, 329], // 支持币种
      showList: [],
    }
  },
  props: {
    marketLists: {
      type: Array,
      default: function mls() {
        return []
      }
    },
  },
  watch: {
    marketLists: {
      handler: function flt() {
        this.handleFilter();
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    handleFilter() {
      const arr = [];
      this.hasMids.forEach(v => {
        const item = this.marketLists.find(vv => vv.mid === v);
        if (!item) {
          return
        }
        arr.push(item)
      })
      this.showList = arr;
    }
  }
}
</script>

<style lang="scss" scoped>
.banner{
  font-size: 56px;
  font-weight: 500;
  text-align: center;
  color: #FFF;
  background: #07d79b;
  height: 320px;
  .bannerTip{
    font-weight: normal;
    font-size: 30px;
  }
}
</style>
