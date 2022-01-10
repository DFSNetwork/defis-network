<template>
  <div class="rulesTip">
    <div class="title">{{ $t('vote.voteRules') }}</div>
    <div class="content">
      <div>{{ $t('voteRules.rules1') }}</div>
      <div>{{ $t('voteRules.rules2') }}</div>
      <div>{{ $t('voteRules.rules3') }}</div>
      <div>{{ $t('voteRules.rules4') }}</div>
      <div>{{ $t('voteRules.rules5') }}</div>
      <ul class="subRules">
        <li>{{ $t('voteRules.rules6') }}</li>
        <li>{{ $t('voteRules.rules7') }}</li>
        <li>{{ $t('voteRules.rules8') }}</li>
        <li>{{ $t('voteRules.rules9') }}</li>
        <li>{{ $t('voteRules.rules10') }}</li>
      </ul>
      <div class="warm">6. {{ $t('nodePools.tagVoteRules') }}</div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { accSub, accMul } from '@/utils/public'
export default {
  computed: {
    ...mapState({
      dsrPools: state => state.sys.dsrPools,
    }),
  },
  methods: {
    handleApr(id) {
      const t = this.dsrPools.find(v => v.id == id)
      let r = accSub(t.bonus, 1)
      r = accMul(r, 100)
      return r.toFixed(2)
    }
  },
}
</script>

<style lang="scss" scoped>
.rulesTip{
  width: 100%;
  padding: 40px;
  box-sizing: border-box;
  .title{
    font-size: 36px;
    font-weight: 500;
    margin-bottom: 20px;
  }
  .content{
    font-size: 27px;
    text-align: left;
    .subRules{
      margin-left: 20px;
      padding-left: 30px;
    }
  }
}
</style>
