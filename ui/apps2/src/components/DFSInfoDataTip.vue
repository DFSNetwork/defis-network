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
        <div class="tip">24H 做市商手续费收入</div>
        <div class="fees-data-content" v-if="feesData">
          <el-table :data="feesTableData" style="width: 100%">
            <el-table-column prop="symbol" label="代币"> </el-table-column>
            <el-table-column prop="value" label="手续费"> </el-table-column>
          </el-table>
        </div>
        <div class="tip">24H 累计挖矿产出DFS</div>
        <div class="dfs-data-content">
          <el-table :data="dfsTableData" style="width: 100%">
            <el-table-column prop="des" label="说明"> </el-table-column>
            <el-table-column prop="value" label="数值"> </el-table-column>
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
      for (let [key, value] of Object.entries(this.feesData)) {
        result.push({
          symbol: key,
          value: value,
        });
      }
      return result;
    },
    dfsTableData() {
      return [
        {
          des: "总计",
          value:
            this.dfsInfoData && this.dfsInfoData.reward_dfs_total
              ? this.dfsInfoData.reward_dfs_total
              : 0,
        },
        {
          des: "流通",
          value:
            this.dfsInfoData && this.dfsInfoData.circulation_dfs_total
              ? this.dfsInfoData.circulation_dfs_total
              : 0,
        },
        {
          des: "DSR",
          value:
            this.dfsInfoData && this.dfsInfoData.dsr_dfs_total
              ? this.dfsInfoData.dsr_dfs_total
              : 0,
        },
      ];
    },
  },
  data() {
    return {};
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
      padding: 100px 66px 60px;
    }
  }
  .tipDiv {
    .flex {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .fees-data-content,
    .dfs-data-content {
      max-height: 15vh;
      overflow-y: auto;
      margin-bottom: 60px;
    }
    .coinImg {
      width: 220px;
    }
    .tip {
      color: #070707;
      font-size: 28px;
      text-align: left;
      font-weight: bold;
      margin: 0px 0 30px;
    }
    .btn {
      width: 100%;
      background: #07d79b;
      border-color: transparent;
      margin-bottom: 26px;
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
