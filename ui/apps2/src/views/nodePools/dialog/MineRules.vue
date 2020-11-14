<template>
  <div class="claimRules">
    <!-- <div class="title">{{ $t('nodePools.mineRules') }}</div> -->
    <div class="constent">
      <div class="subTitle">REX {{ $t('nodePools.mineRules') }}</div>
      <div>{{ $t('nodePools.mineRules1') }}</div>
      <div>{{ $t('nodePools.mineRules2') }}</div>
      <div>{{ $t('nodePools.mineRules3') }}</div>
      <div>{{ $t('nodePools.mineRules4') }}</div>
      <div>{{ $t('nodePools.mineRules5') }}</div>
      <div>{{ $t('nodePools.mineRules6') }}</div>
      <div class="subTitle">LP {{ $t('nodePools.mineRules') }}</div>
      <div>{{ $t('nodePools.lpMineRelus1') }}</div>
      <div>{{ $t('nodePools.lpMineRelus2') }}</div>
      <div class="lp">{{ $t('nodePools.lpMineRelus3') }}</div>
      <div class="lp">{{ $t('nodePools.lpMineRelus4') }}</div>
      <div class="lp">{{ $t('nodePools.lpMineRelus5') }}</div>
      <div class="lp">{{ $t('nodePools.lpMineRelus6') }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'claimRules',
}
</script>

<style lang="scss" scoped>
.claimRules{
  padding: 26px;
  font-size: 24px;
  .title{
    font-size: 33px;
    font-weight: 500;
    margin-bottom: 20px;
  }
  .constent{
    text-align: left;
    &>div{
      margin-top: 10px;
    }
    .subTitle{
      color: #333;
      font-size: 28px;
      text-align: center;
    }
    .lp{
      padding-left: 30px;
    }
  }
}
</style>
