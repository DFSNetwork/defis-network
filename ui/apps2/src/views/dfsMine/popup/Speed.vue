<template>
  <div class="speedTip">
    <div class="title">{{ $t('dfsMine.speedRules') }}</div>
    <div class="rls">{{ $t('dfsMine.speedRules1') }}</div>
    <div class="rls">{{ $t('dfsMine.speedRules2') }}</div>
    <div class="rls">{{ $t('dfsMine.speedRules3') }}{{ parseFloat(damping).toFixed(4) }}</div>
    <div class="rls">{{ $t('dfsMine.speedRules4') }}</div>
    <div class="rls">{{ $t('dfsMine.speedRules5_1', {supply}) }}</div>
    <div class="rls">{{ $t('dfsMine.speedRules5', {speed}) }}</div>
<!-- 
    <div class="rls"><strong>{{ $t('dfsMine.speedRules6') }}</strong></div>
    <ul class="ul">
      <li>{{ $t('dfsMine.speedRules7') }}</li>
      <li>{{ $t('dfsMine.speedRules8') }}</li>
      <li>{{ $t('dfsMine.speedRules9') }}</li>
      <li>{{ $t('dfsMine.speedRules10') }}</li>
    </ul> -->
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'speedDfs',
  props: {
    speed: {
      type: String,
      default: '0.0000'
    }
  },
  computed: {
    // damping
    ...mapState({
      damping: (state) => state.sys.damping,
    }),
    supply() {
      const supply = this.damping * 3600;
      return parseFloat(supply || 0).toFixed(4)
    }
  },
}
</script>

<style lang="scss" scoped>
.speedTip{
  padding: 40px;
  text-align: left;
  .title{
    text-align: center;
    font-size: 36px;
    font-weight: 500;
    margin-bottom: 20px;
  }
  div{
    margin: 5px 0;
  }
  .ul{
    padding-left: 40px;
    list-style-type: disc;
    li{
      margin: 5px 0;
    }
  }
}
</style>
