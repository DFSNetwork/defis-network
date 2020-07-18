<template>
  <div class="warmTip" v-if="!close">
    <el-dialog
      class="dialog"
      width="282px"
      top="20vh"
      :center="true"
      :show-close="false"
      :visible.sync="showWarm">
      <div class="tipDiv">
        <div class="flex">
          <img class="img" src="@/assets/img/warning.png" alt="">
        </div>
        <div class="tip">{{ $t('public.warmTip') }}</div>
        <div><el-button class="btn" type="primary" @click="showWarm = false">{{ $t('public.known') }}</el-button></div>
        <div class="flex"><el-button class="noTip" type="primary" @click="handleClose">{{ $t('public.noTip') }}</el-button></div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      close: false,
      showWarm: true,
    }
  },
  mounted() {
    this.handleRegClose();
  },
  methods: {
    handleRegClose() {
      const close = localStorage.getItem('WARMTIP') ? JSON.parse(localStorage.getItem('WARMTIP')) : false;
      this.close = close;
    },
    handleClose() {
      localStorage.setItem('WARMTIP', true);
      this.close = true;
    }
  },
}
</script>

<style lang="scss" scoped>
.warmTip{
  /deep/ .el-dialog{
    // height: 319px;
    border-radius: 8px;
    .el-dialog__header{
      padding: 0;
    }
    .el-dialog__body{
      padding-bottom: 10px;
    }
  }
  .tipDiv{
    padding: 16px 16px 0;
    .flex{
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .img{
      width: 96px;
    }
    .tip{
      text-align: left;
      font-weight: bold;
      font-size: 14px;
      margin-top: 38px;
      margin-bottom: 19px;
    }
    .btn{
      width: 100%;
      background: #42B48F;
      border-color: transparent;
      margin-bottom: 5px;
    }
    .noTip{
      margin: auto;
      background: transparent;
      font-size: 12px;
      color: #999999;
      border-color: transparent;
    }
  }
}
</style>
