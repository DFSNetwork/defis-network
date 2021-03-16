<template>
  <div class="marketApy">
    <div class="title">{{ $t('apy.title') }}</div>
    <div class="table">
      <div class="flexa">
        <span>{{ $t('info.markerFeesApr') }}：</span>
        <span>{{ `${parseFloat(aprInfo.feesApr || 0).toFixed(2)}%` }}</span>
      </div>
      <div class="flexa" v-if="parseFloat(aprInfo.aprV3 || 0)">
        <span>{{ $t('info.dfsMineApr') }}：</span>
        <span>{{ `${parseFloat(aprInfo.aprV3 || 0).toFixed(2)}%` }}</span>
      </div>
      <div class="flexa" v-if="aprInfo.lpApy && parseFloat(aprInfo.lpApy.pddApy)">
        <span>{{ $t('apy.pddApy') }}：</span>
        <span>{{ `${parseFloat(aprInfo.lpApy.pddApy || 0).toFixed(2)}%` }}</span>
      </div>
      <div class="flexa" v-if="parseFloat(aprInfo.tagLpApy)">
        <span>{{ $t('apy.tagLpApy') }}：</span>
        <span>{{ `${parseFloat(aprInfo.tagLpApy).toFixed(2)}%` }}</span>
      </div>
      <div class="flexa" v-if="parseFloat(aprInfo.usdcApr)">
        <span>{{ $t('apy.usdcLpApy') }}：</span>
        <span>{{ `${parseFloat(aprInfo.usdcApr).toFixed(2)}%` }}</span>
      </div>
      <div class="flexa total">
        <span>{{ $t('info.totalApr') }}：</span>
        <span>{{ countApy }}%</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    countApy: {
      type: String,
      default: '0.00'
    },
    feesApr: {
      type: Number,
      default: 0
    },
    isActual: {
      type: Boolean,
      default: false
    },
    aprV3: {
      type: String,
      default: '0.00'
    },
    lpApy: {
      type: Object,
      default: function la() {
        return {}
      }
    },
    tagLpApy: {
      type: String,
      default: '0.00'
    },
    aprInfo: {
      type: Object,
      default: function la() {
        return {}
      }
    }
  },
  watch: {
    aprInfo: {
      handler: function lp() {
        console.log(this.aprInfo)
      },
      immediate: true
    }
  },
}
</script>

<style lang="scss" scoped>
.marketApy{
  padding: 40px 30px;
  color: #000;
  font-size: 27px;
}
.title{
  font-size: 30px;
  text-align: center;
  margin-bottom: 20px;
}
.table{
  &>div{
    line-height: 50px;
    &>span{
      flex: 1;
      text-align: left;
      &:first-child{
        text-align: right;
      }
    }
  }
  .total{
    color: #000;
    font-weight: 500;
  }
}
</style>