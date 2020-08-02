<template>
  <div class="slipTip">
    <el-dialog
      class="dialog"
      width="282px"
      top="20vh"
      :center="true"
      :visible.sync="showTip">
      <div class="tipDiv">
        <div class="title">{{ $t('public.fee') }}</div>
        <div class="content">{{ $t('dex.createFeeTip') }}</div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showTip: false
    }
  }
}
</script>

<style lang="scss" scoped>
.slipTip{
  color: #070707;
  /deep/ .el-dialog{
    border-radius: 8px;
    .el-dialog__header{
      padding: 0;
    }
    .el-dialog__body{
      padding: 40px 60px;
    }
  }
  .dialog{
    .title{
      font-size: 32px;
      font-weight: 500;
      text-align: center;
      margin-bottom: 30px;
    }
    .content{
      font-size: 28px;
      font-weight: 500;
    }
  }
}
</style>
