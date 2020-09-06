<template>
  <div class="totalInfo">
    <div>
      <div class="title">
        <span class="act">{{ $t('footer.marketsFee') }}(24H)</span>
      </div>
      <div class="fees-data-content" v-if="feesData">
        <el-table :data="feesTableData" style="width: 100%">
          <el-table-column prop="symbol" :label="$t('footer.token')"> </el-table-column>
          <el-table-column prop="value" :label="$t('footer.mineApr')"> </el-table-column>
          <el-table-column prop="poolsApr" :label="$t('footer.marketApr')"> </el-table-column>
        </el-table>
      </div>
    </div>
    <div>
      <div class="title">
        <span class="act">{{ $t('footer.mineDfsNum') }}(24H)</span>
      </div>
      <div class="dfs-data-content">
        <el-table :data="dfsTableData" style="width: 100%">
          <el-table-column prop="des" :label="$t('footer.label')"> </el-table-column>
          <el-table-column prop="value" :label="$t('footer.num')"> </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'total',
  props: {},
  computed: {
    ...mapState({
      // 箭头函数可使代码更简练
      minScreen: state => state.app.minScreen,
      baseConfig: state => state.sys.baseConfig, // 基础配置 - 默认为{}
      testConfig: state => state.sys.testConfig, // 测试网环境
      devConfig: state => state.sys.devConfig, // 开发环境
      proConfig: state => state.sys.proConfig, // 生产环境
    }),
  },
  data() {
    return {
    }
  },
  methods: {
    handleSetAllRes() {
      const allResult = [];
      const feesDataKeys = Object.keys(this.feesData)
      const coinArr = this.handleDealSymArr(this.marketLists);
      feesDataKeys.forEach((key) => {
        const isShowToken = coinArr.find(v => v.symbol === key);
        const value = this.feesData[key];
        const sym1Liq = isShowToken.reserve.split(' ')[0];
        const poolsApr = value / (sym1Liq - value) * 365 * 100;
        allResult.push({
          symbol: isShowToken.symbol,
          poolsApr: `${poolsApr.toFixed(3)}%`
        });
      })
      this.$store.dispatch('setFeesApr', allResult);
    },
    handleDealSymArr(lists = []) {
      const resArr = [];
      lists.forEach((v) => {
        resArr.push(v.sym0Data, v.sym1Data)
      })
      // 删除重复项
      const newArr = resArr.filter((item, index, self) => {
        const i = self.findIndex(v => v.contract === item.contract && v.symbol === item.symbol);
        return self.indexOf(item) === i;
      })
      return newArr
    },
  },
}
</script>

<style lang="scss" scoped>
.title{
  font-size: 32px;
  text-align: left;
  margin: 0 0 40px;
  &>span{
    margin-right: 60px;;
  }
  .act{
    color: $color-black;
    position: relative;
    &::before{
      content: '';
      position: absolute;
      width:60px;
      height:8px;
      background:rgba(2,198,152,1);
      border-radius:4px;
      bottom: -20px;
      left: 30px;
      // transform: translateX(-45%);
    }
  }
}
.totalInfo{
  margin: 40px;
  .flex {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .fees-data-content,
  .dfs-data-content {
    max-height: 320px;
    overflow-y: auto;
    margin-bottom: 40px;
  }
  /deep/ .el-table {
    .el-table__row, .el-table__header {
      .cell {
        font-size: 24px;
        line-height: 28px;
      }
    }
  }
  .coinImg {
    width: 220px;
  }
  .tip {
    color: #070707;
    font-size: 28px;
    text-align: left;
    font-weight: bold;
    margin: 0px 0 20px;
  }
  .btn {
    width: 100%;
    background: #07d79b;
    border-color: transparent;
    font-size: 30px;
    height: 74px;
    border-radius: 12px;
  }
  .noTip {
    margin: auto;
    background: transparent;
    font-size: 28px;
    color: #999999;
    border-color: transparent;
  }
}
</style>
