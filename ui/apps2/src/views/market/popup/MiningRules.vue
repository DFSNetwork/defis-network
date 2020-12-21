<template>
  <div class="rules">
    <div class="title"><span class="act">{{ $t('miningRules.rules') }}</span></div>
      <div class="ruleDiv">
        <div class="subTitle">{{ $t('miningRules.tradeRules') }}</div>
        <ul class="ul">
          <li class="rule1">{{ $t('miningRules.tradeRule1') }}</li>
          <li class="rule1">{{ $t('miningRules.tradeRule2') }}</li>
        </ul>
      </div>
      <!-- <div class="ruleDiv">
        <div class="subTitle">{{ $t('miningRules.bankRules') }}</div>
        <ul class="ul">
          <li class="rule1">{{ $t('miningRules.bankRule1') }}</li>
          <li class="rule1">{{ $t('miningRules.tradeRule2') }}</li>
        </ul>
      </div> -->
      <div class="ruleDiv">
        <div class="subTitle">{{ $t('miningRules.marketRules') }}</div>
        <ul class="ul">
          <li class="rule1">{{ $t('miningRules.marketRule1') }}</li>
          <li class="rule1">
            <div>{{ $t('miningRules.marketRule2') }}:</div>
            <div class="subRule">
              <div class="rule2">1. {{ $t('miningRules.marketRule2_1') }}</div>
              <div class="rule2">2. {{ $t('miningRules.marketRule2_2') }}</div>
              <div class="rule2">3. {{ $t('miningRules.marketRule2_3') }}</div>
            </div>
          </li>
          <li class="rule1">{{ $t('mine.minReward', {minReward: minReward}) }}{{ $t('mine.rewardCut') }}</li>
          <li class="rule1">{{ $t('mine.rewardPrice', {coin: 'DFS'}) }}</li>
        </ul>
      </div>
  </div>
</template>

<script>
export default {
  props: {
    minReward: {
      type: String,
      default: '0.0005'
    }
  }
}
</script>

<style lang="scss" scoped>
.rules{
  padding: 40px;
  color: #000;
  text-align: left;
  .title{
    text-align: center;
    font-size: 32px;
  }
  .rule1{
    margin-top: 5px;
  }
  .subTitle{
    margin-top: 20px;
    font-size: 30px;
    color: #42b48f;
  }
  .ul{
    list-style: disc outside;
    margin-left: 2em;
    color: #070707;
    font-size: 28px;
  }
}
</style>
