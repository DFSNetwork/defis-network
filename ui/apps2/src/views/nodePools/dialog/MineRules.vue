<template>
  <div class="claimRules">
    <!-- <div class="title">{{ $t('nodePools.mineRules') }}</div> -->
    <div class="constent" v-if="status === 'rex'">
      <div class="subTitle">IDO平台自助开启矿池规则</div>
      <div>1. 在DFS Swap中创建代币/EOS交易对。人人都可以自主创建或帮忙创建</div>
      <div>2. 在DFS Swap拥有不小于100 EOS的流动性</div>
      <div>3. 乐捐账号中，该代币余额的价值排名前三。</div>
      <div>满足以上3个条件的代币，系统实时、自动开启挖矿。将乐捐的代币分发给投票系统的用户。</div>

      <div class="subTitle">REX {{ $t('nodePools.mineRules') }}</div>
      <div>{{ $t('nodePools.mineRules1') }}</div>
      <div>{{ $t('nodePools.mineRules2') }}</div>
      <div>{{ $t('nodePools.mineRules3') }}</div>
      <div>{{ $t('nodePools.mineRules4') }}</div>
      <div>{{ $t('nodePools.mineRules5') }}</div>
      <div>{{ $t('nodePools.mineRules6') }}</div>
    </div>
    <div class="constent" v-else>
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
  props: {
    status:{
      type: String,
      default: ''
    }
  }
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
