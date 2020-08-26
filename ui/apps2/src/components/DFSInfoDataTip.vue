<template>
  <div class="dfsInfoDataTip">
    <el-dialog
      class="dialog"
      top="20vh"
      :center="true"
      :show-close="false"
      :visible="!close"
    >
      <div class="tipDiv">
        <div class="tip">{{ $t('footer.marketsFee') }}(24H)</div>
        <div class="fees-data-content" v-if="feesData">
          <el-table :data="feesTableData" style="width: 100%">
            <el-table-column prop="symbol" :label="$t('footer.token')"> </el-table-column>
            <el-table-column prop="value" :label="$t('footer.mineApr')"> </el-table-column>
            <el-table-column prop="poolsApr" :label="$t('footer.marketApr')"> </el-table-column>
          </el-table>
        </div>
        <div class="tip">{{ $t('footer.mineDfsNum') }}(24H)</div>
        <div class="dfs-data-content">
          <el-table :data="dfsTableData" style="width: 100%">
            <el-table-column prop="des" :label="$t('footer.label')"> </el-table-column>
            <el-table-column prop="value" :label="$t('footer.num')"> </el-table-column>
          </el-table>
        </div>
        <div>
          <el-button class="btn" type="primary" @click="clickOnConfirm">{{
            $t("public.confirm")
          }}</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { perDayReward } from '@/utils/public';
export default {
  data() {
    return {
      showTokens: ['DFS', 'KEY', 'OGX', 'USDT'],
    }
  },
  props: {
    dfsInfoData: {
      type: Object,
      default: () => {
        return {};
      },
    },
    close: {
      type: Boolean,
      default: true,
    },
    onConfirm: {
      type: Function,
      default: () => {},
    },
    marketLists: {
      type: Array,
      default: function lists() {
        return []
      }
    }
  },
  watch: {},
  computed: {
    ...mapState({
      // 箭头函数可使代码更简练
      weightList: state => state.sys.weightList, // 交易对权重列表
      eggargs: state => state.sys.eggargs,
      dfsPrice: state => state.sys.dfsPrice,
    }),
    feesData() {
      return this.dfsInfoData && this.dfsInfoData.feesData;
    },
    feesTableData() {
      let result = [];
      if (!this.marketLists.length || !this.feesData) {
        return
      }
      this.eggargs.forEach((item) => {
        const isShowToken = this.marketLists.find(v => v.mid === item.mid);
        const weight = this.weightList.find(v => v.mid === item.mid).pool_weight;
        const reward = perDayReward(weight);
        const apr = reward * this.dfsPrice / 20000 * 365 * 100;
        const feesDataKeys = Object.keys(this.feesData)
        const key = feesDataKeys.find(v => v === isShowToken.symbol1)
        let poolsApr = '0.00%';
        if (key) {
          const value = this.feesData[key];
          const sym1Liq = isShowToken.reserve1.split(' ')[0];
          poolsApr = value / (sym1Liq - value) * 365 * 100;
        }
        // const poolsAprM = getPoolApr(isShowToken)
        result.push({
          symbol: isShowToken.symbol1,
          value: `${apr.toFixed(2)}%`,
          poolsApr: `${poolsApr.toFixed(3)}%`
        });
      });
      result = result.sort((a, b) => {
        return parseInt(b.poolsApr) - parseInt(a.poolsApr)
      })
      this.$store.dispatch('setFeesApr', result);
      return result;
    },
    dfsTableData() {
      return [
        {
          des: this.$t('footer.total'),
          value:
            this.dfsInfoData && this.dfsInfoData.reward_dfs_total
              ? this.dfsInfoData.reward_dfs_total
              : 0,
        },
        {
          des: this.$t('footer.circulation'),
          value:
            this.dfsInfoData && this.dfsInfoData.circulation_dfs_total
              ? this.dfsInfoData.circulation_dfs_total
              : 0,
        },
        {
          des: this.$t('footer.dsr'),
          value:
            this.dfsInfoData && this.dfsInfoData.dsr_dfs_total
              ? this.dfsInfoData.dsr_dfs_total
              : 0,
        },
      ];
    },
  },
  mounted() {},
  methods: {
    clickOnConfirm() {
      this.$emit("onConfirm");
    },
  },
};
</script>

<style lang="scss" scoped>
.dfsInfoDataTip {
  /deep/ .el-dialog {
    width: 564px;
    border-radius: 16px;
    .el-dialog__header {
      padding: 0;
    }
    .el-dialog__body {
      padding: 0px;
    }
  }
  .tipDiv {
    padding: 40px;
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
}
</style>
