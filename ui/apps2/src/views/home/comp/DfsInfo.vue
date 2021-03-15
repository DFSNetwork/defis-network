<template>
  <div class="dfsInfo">
    <div class="title flexa" @click="handleExchange">
      <span>{{ $t('home.asset') }}</span>
      <img class="exImg" v-if="exchange"
        src="https://cdn.jsdelivr.net/gh/defis-net/material2/icon/price_switch_icon_btn_left.svg">
      <img class="exImg" v-else
        src="https://cdn.jsdelivr.net/gh/defis-net/material2/icon/price_switch_icon_btn_right.svg">
    </div>
    <div class="main">
      <div class="flexb">
        <div class="item">
          <div class="subTitle">{{ $t('home.tvl') }} ({{ exchange ? 'USDT' : 'EOS' }})</div>
          <div class="num dinBold" v-if="exchange">{{ poolsUsdt | numeralFormat }}</div>
          <div class="num dinBold" v-else>{{ poolsEos | numeralFormat }}</div>
        </div>
        <div class="item">
          <div class="subTitle">{{ $t('home.vol') }} ({{ exchange ? 'USDT' : 'EOS' }})</div>
          <div class="num dinBold" v-if="exchange">{{ newDfsSwapData.total_volume_usdt ? newDfsSwapData.total_volume_usdt : "0.00" | numeralFormat }}</div>
          <div class="num dinBold" v-else>{{ newDfsSwapData.total_volume ? newDfsSwapData.total_volume : "0.00" | numeralFormat }}</div>
        </div>
      </div>
      <div class="flexb">
        <div class="item">
          <div class="subTitle">{{ $t('home.tradeNum') }}</div>
          <div class="num dinBold">{{ tradeUserNum }}</div>
        </div>
        <div class="item">
          <div class="subTitle">{{ $t('home.orderNum') }}</div>
          <div class="num dinBold">{{ newDfsSwapData.order_number ? newDfsSwapData.order_number : 0 }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'dfsInfo',
  props: {
    newDfsSwapData: {
      type: Object,
      default: function () {
        return {}
      }
    },
    poolsUsdt: {
      type: String,
      default: '0.0000'
    },
    poolsEos: {
      type: String,
      default: '0.0000'
    },
    tradeUserNum: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      exchange: true,
    }
  },
  methods: {
    handleExchange() {
      this.exchange = !this.exchange;
      this.$forceUpdate()
    }
  }
}
</script>

<style lang="scss" scoped>
.dfsInfo{
  margin: 28px;
  background: #FFF;
  border-radius: 16px;
  padding: 22px;
  font-size: 24px;
  text-align: left;
  .title{
    font-size: 32px;
    font-weight: 500;
    margin-bottom: 18px;
    .exImg{
      margin-left: 15px;
      width: 30px;
    }
  }
  .flexb{
    margin-top: 20px;
  }
  .item{
    flex: 1;
    margin-right: 30px;
    &:last-child{
      margin-right: 0px;
    }
    .subTitle{
      font-weight: 300;
      padding-left: 18px;
      position: relative;
      &::before{
        content: '';
        width: 4px;
        height: 18px;
        background: $color-main;
        position: absolute;
        top: 50%;
        left: 0;
        transform: translateY(-50%);
      }
    }
    .num{
      font-size: 36px;
      padding-left: 18px;
      margin: 9px 0 0;
    }
  }
}
</style>
