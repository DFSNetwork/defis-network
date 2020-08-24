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
            <el-table-column prop="value" :label="$t('footer.apr')"> </el-table-column>
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
    feesData() {
      return this.dfsInfoData && this.dfsInfoData.feesData;
    },
    feesTableData() {
      let result = [];
      if (!this.feesData) {
        return result;
      }
      // const showTokens = ['DFS', 'KEY', 'OGX', 'USDT'];
      for (let [key, value] of Object.entries(this.feesData)) {
        const isShowToken = this.showTokens.findIndex(v => v === key);
        if(isShowToken !== -1) {
          const market = this.marketLists.find(v => v.symbol1 === key)
          if (market) {
            const sym1Liq = market.reserve1.split(' ')[0];
            let apr = value / (sym1Liq - value) * 365 * 100;
            result.push({
              symbol: key,
              value: `${apr.toFixed(2)}%`,
            });
          }
        }
      }
      result = result.sort((a, b) => {
        return parseInt(b.value) - parseInt(a.value)
      })
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
      max-height: 255px;
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
