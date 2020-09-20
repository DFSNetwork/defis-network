<template>
  <div class="rulesTip">
    <div class="title">投票规则</div>
    <div class="content">
      <div>1. 做市DFS或存入DSS即可获得投票票数.</div>
      <div>2. 更改做市、存取DSS会自动重新投票</div>
      <div>3. 投票结果实时反馈最新排行</div>
      <div>4. 每个账号最多选择3个投票选项</div>
      <div>5. 随时可以修改重新投票</div>
      <ul class="subRules">
        <li>做市: 1DFS = 0.5 票</li>
        <li>随存随取： 1 DFS = 1票</li>
        <li>定存1个月、3个月: 1DFS = 1.5票</li>
        <li>定存6个月: 1 DFS = 2票</li>
        <li>定存1年: 1 DFS = 3 票</li>
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
      margin-left: 20px;
      padding-left: 30px;
    }
  }
}
</style>
