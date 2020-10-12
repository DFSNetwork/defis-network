<template>
  <div>
    <div class="banner flexc">
      <div>
        <div class="bannerTitle">币种信息</div>
        <div class="bannerTip">币种信息，大额交易</div>
      </div>
    </div>
    <CoinData :marketLists="marketLists"/>
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
    CoinData
  },
  data() {
    return {}
  },
  props: {
    marketLists: {
      type: Array,
      default: function mls() {
        return []
      }
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
