<template>
  <div class="footer">
    <div class="tip" @click="clickOnDFSInfoData">
      24H兑换量：{{ dfsInfoData.eos_volume ? dfsInfoData.eos_volume : "0.00" }}
      {{ dfsInfoData.order_number ? dfsInfoData.order_number : 0 }}笔订单
    </div>
    <div class="safe">
      <span>{{ $t("public.safeRecord1") }}</span>
      <span class="who" @click="handleToShowReport('slotMist')">
        {{ $t("public.safeRecord2") }}</span
      >
      &
      <span class="who" @click="handleToShowReport('peckshield')"
        >{{ $t("public.safeRecord4") }}
      </span>
      <span>{{ $t("public.safeRecord3") }}</span>
    </div>

    <el-dialog class="dialog" :visible.sync="showImg">
      <img
        width="100%"
        src="https://tva1.sinaimg.cn/large/007S8ZIlgy1gh00tvkd0dj30ku112tbw.jpg"
      />
    </el-dialog>
    <el-dialog class="dialog" :visible.sync="showImg2">
      <img width="100%" src="@/assets/img/footer/peckshield.jpeg" />
    </el-dialog>

    <el-dialog class="dialog" :visible.sync="showImg">
      <img
        width="100%"
        src="https://tva1.sinaimg.cn/large/007S8ZIlgy1gh00tvkd0dj30ku112tbw.jpg"
      />
    </el-dialog>
    <dfs-info-data-tip
      :dfsInfoData="dfsInfoData"
      :close="closeDFSInfoDataTip"
      @onConfirm="
        () => {
          this.closeDFSInfoDataTip = true;
        }
      "
    />
  </div>
</template>

<script>
import axios from "axios";
import DfsInfoDataTip from "@/components/DFSInfoDataTip";
export default {
  data() {
    return {
      showImg: false,
      showImg2: false,
      dfsInfoData: {},
      timer: null,
      closeDFSInfoDataTip: true,
    };
  },
  components: {
    DfsInfoDataTip,
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  mounted() {
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.handleGetDfsInfoData();
    }, 1000 * 10);
    this.handleGetDfsInfoData();
  },
  methods: {
    clickOnDFSInfoData() {
      this.closeDFSInfoDataTip = false;
    },
    handleToShowReport(name) {
      if (name === "peckshield") {
        this.showImg2 = true;
        return;
      }
      this.showImg = true;
    },
    // 获取总发行量
    async handleGetDfsInfoData() {
      const result = await axios.get(
        "http://dfsinfoapi.sgxiang.com/dapi/dfsdata"
      );
      if (result.status !== 200) {
        return;
      }
      this.dfsInfoData = result.data;
    },
  },
};
</script>

<style lang="scss" scoped>
.dialog {
  /deep/ .el-dialog {
    margin-top: 10vh !important;
    width: 600px;
    .el-dialog__header,
    .el-dialog__body {
      padding: 0;
    }
  }
  img {
    display: block;
  }
}
.footer {
  font-size: 28px;
  margin-top: 30px;
  .safe {
    margin: 12px 0 80px;
    font-size: 24px;
    font-weight: 300;
  }
  .who {
    font-weight: bold;
    color: $color-black;
  }
}
</style>
