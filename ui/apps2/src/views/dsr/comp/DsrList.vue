<template>
  <div class="dsrList">
    <div class="flexb">
      <div>币种</div>
      <div>我的存款(DFS)</div>
      <div>存款占比</div>
    </div>
    <div class="flexb">
      <div class="flexa">
        <img class="coinImg" src="https://ndi.340wan.com/eos/minedfstoken-dfs.png" />
        <span>DFS</span>
      </div>
      <div>
        10000.0000
      </div>
      <div>
        1.00%
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'dsrList',
  computed: {
    ...mapState({
      // 箭头函数可使代码更简练
      // baseConfig: state => state.sys.baseConfig, // 基础配置 - 默认为{}
      weightList: state => state.sys.weightList, // 交易对权重列表
      aprs: state => state.sys.aprs,
      damping: state => state.sys.damping,
      scatter: state => state.app.scatter,
      dfsPrice: state => state.sys.dfsPrice,
    }),
  },
}
</script>

<style lang="scss" scoped>
.dsrList{
  font-size: 28px;
  .coinImg{
    width: 80px;
  }
}
</style>
