<template>
  <div class="redeemTime">
    <el-dialog
      class="dialog"
      width="282px"
      :center="true"
      :visible.sync="showTime"
      top="20vh">
      <div class="title">{{ $t('bank.stakeInMining') }}</div>
      <div class="content">
        <span class="green">{{ dateTime }}</span>
        <span>{{ $t('bank.canRedeem') }}</span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showTime: false,
    }
  },
  props: {
    dateTime: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.redeemTime{
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
