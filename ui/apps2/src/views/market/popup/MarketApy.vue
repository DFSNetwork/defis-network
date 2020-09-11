<template>
  <div class="marketApy">
    <div class="title">{{ $t('apy.title') }}</div>
    <div class="table">
      <div class="flexa">
        <span>{{ $t('info.markerFeesApr') }}：</span>
        <span>{{ feesApr || '—' }}</span>
      </div>
      <div class="flexa">
        <span>{{ $t('info.dfsMineApr') }}：</span>
        <span>{{ parseFloat(apr) ? apr : '—' }}</span>
      </div>
      <div class="flexa">
        <span>{{ $t('info.yfcApr') }}：</span>
        <span>{{ parseFloat(lpApy.yfcApy) ? `${lpApy.yfcApy}%` : '—' }}</span>
      </div>
      <div class="flexa">
        <span>{{ $t('apy.dmdApy') }}：</span>
        <span>{{ parseFloat(dmdApy) ? `${dmdApy}%` : '—' }}</span>
      </div>
      <div class="flexa">
        <span>{{ $t('apy.dbcApy') }}：</span>
        <span>{{ parseFloat(lpApy.dbcApy) ? `${lpApy.dbcApy}%` : '—' }}</span>
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
    apr: {
      type: String,
      default: '0.00'
    },
    dmdApy: {
      type: String,
      default: '0.00'
    },
    lpApy: {
      type: Object,
      default: function la() {
        return {}
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.marketApy{
  padding: 40px;
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