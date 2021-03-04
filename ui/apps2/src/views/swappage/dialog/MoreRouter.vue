<template>
  <div class="routePath">
    <img class="close" @click="handleClose"
      src="https://cdn.jsdelivr.net/gh/defis-net/material/svg/sd_icon_btn.svg" alt="">
    <div class="title">{{ $t('dex.moreRoute') }}</div>
    <div class="content">
      <div class="subTitle">本次路径兑换</div>
      <div class="flexw">
        <span v-for="(item, i) in routePath" :key="i" class="flexc coin">
          <img class="coinUrl" :onerror="errorCoinImg"
            :src="handleDealRouteImg(item)">
          <span>{{ item.split(':')[1] }}</span>
          <span v-if="routePath.length - 1 !== i" class="el-icon-arrow-right"></span>
        </span>
      </div>
    </div>
    <div class="tip">
      *通过多以上多路径可为您提供更好的兑换价格，在扣除多笔手续费后，依然能兑换获得更多代币
    </div>
    <div class="tip">
      *多路径兑换，将支付多笔手续费
    </div>
  </div>
</template>

<script>
import { getCoin } from '@/utils/public';

export default {
  name: 'moreRouter',
  props: {
    routePath: {
      type: Array,
      default: function rt() {
        return []
      }
    }
  },
  data() {
    return {
      errorCoinImg: 'this.src="https://ndi.340wan.com/eos/eosio.token-eos.png"',
    }
  },
  methods: {
    handleDealRouteImg(item) {
      const inData = item.toLowerCase().split(':')
      return getCoin(...inData)
    },
    handleClose() {
      this.$emit('listenClose', false)
    }
  }
}
</script>

<style lang="scss" scoped>

.routePath{
  padding: 32px 46px;
  text-align: left;
  color: #333;
  font-size: 26px;
  .close{
    width: 24px;
    position: absolute;
    right: 30px;
    top: 30px;
  }
  .title{
    font-weight: 500;
    margin-bottom: 20px;
    font-size: 36px;
    text-align: center;
  }
  .content{
    font-size: 28px;
    text-align: left;
    border-radius: 12px;
    // border:2px solid rgba(224,224,224,1);
  }
  .bankTip{
    margin-top: 10px;
    font-size: 24px;
  }
  .subTitle{
    font-size: 30px;
  }
  .flexw{
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    border: 1px solid $color-border;
    margin: 30px 0;
    border-radius: 20px;
    padding: 25px 15px;
    .coin{
      font-size: 24px;
      min-width: 30%;
      margin-right: 10px;
      justify-content: flex-start;
      &:last-child{
        margin-right: 0;
      }
    }
  }
  .coinUrl{
    width: 60px;
    height: 60px;
    margin-right: 10px;
    border-radius: 60px;
    overflow: hidden;
  }
  .tip{
    margin-top: 20px;
  }
}
</style>
