<template>
  <div class="slipTip">
    <el-dialog
      class="dialog"
      width="282px"
      top="20vh"
      :center="true"
      :visible.sync="showTip">
      <div class="tipDiv">
        <div class="title">{{ $t('dex.slipPoint') }}</div>
        <div class="content">{{ $t('dex.slipTip') }}</div>
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
      padding: 40px 30px;
    }
  }
  .dialog{
    .title{
      font-size: 16px;
      font-weight: 500;
      text-align: center;
      margin-bottom: 30px;
    }
    .content{
      font-size: 14px;
      font-weight: 500;
      .green{
        color: #42B48F;
        margin-right: 10px;
      }
    }
  }
}
</style>
