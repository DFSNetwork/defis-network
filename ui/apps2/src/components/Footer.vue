<template>
  <div class="footer">
    <div class="tip">24H兑换量：23610.17 EOS 4000比订单</div>
    <div class="safe">
      <span>DFS智能合约由</span>
      <span class="who" @click="handleToShowReport">慢雾</span>
      <span>提供安全审计</span>
    </div>

    <el-dialog
      class="dialog"
      :visible.sync="showImg">
      <img width="100%" src="https://tva1.sinaimg.cn/large/007S8ZIlgy1gh00tvkd0dj30ku112tbw.jpg" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showImg: false,
    }
  },
  methods: {
    handleToShowReport() {
      this.showImg = true;
    }
  },
}
</script>

<style lang="scss" scoped>
.dialog{
  /deep/ .el-dialog{
    margin-top: 10vh !important;
    width: 600px;
    .el-dialog__header,
    .el-dialog__body{
      padding: 0;
    }
  }
  img{
    display: block;
  }
}
.footer{
  font-size: 28px;
  margin-top: 30px;
  .safe{
    margin: 12px 0 80px;
    font-size: 24px;
    font-weight: 300;
  }
  .who{
    font-weight: 500;
    color: $color-black;
  }
}
</style>
