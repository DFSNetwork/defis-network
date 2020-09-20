<template>
  <div class="rulesTip">
    <div class="title">投票规则</div>
    <div class="content">
      <div>1. 每个dss的用户可以投1～3个池子。最多投3个。</div>
      <div>2. 票数和权重， 和存款以及存款的pool有关，票数 = 存款数 * 权重 。</div>
      <ul class="subRules">
        <li>1月，加成 {{ handleApr(1) }}%</li>
        <li>3月，加成 {{ handleApr(2) }}%</li>
        <li>6月，加成 {{ handleApr(3) }}%</li>
        <li>1年，加成 {{ handleApr(4) }}%</li>
      </ul>
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
      padding-left: 40px;
    }
  }
}
</style>
