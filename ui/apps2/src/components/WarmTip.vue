<template>
  <div class="warmTip">
    <el-dialog
      class="dialog"
      top="20vh"
      :center="true"
      :show-close="false"
      :visible.sync="show">
      <div class="tipDiv">
        <div class="flex">
          <img class="coinImg" src="https://cdn.jsdelivr.net/gh/defis-net/material/svg/tips_poto.svg" alt="">
        </div>
        <div class="tip">{{ $t('public.warmTip') }}</div>
        <div><el-button class="btn" type="primary" @click="show = false">{{ $t('public.known') }}</el-button></div>
        <!-- <div class="flex"><el-button class="noTip" type="primary" @click="handleClose">{{ $t('public.noTip') }}</el-button></div> -->
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    showWarm: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    showWarm(val) {
      this.show = val;
    },
    show(val) {
      if (!val) {
        this.$emit('listenClose')
      }
    }
  },
  data() {
    return {
      close: false,
      show: false,
    }
  },
  mounted() {
    // this.handleRegClose();
  },
  methods: {
    handleRegClose() {
      const close = localStorage.getItem('WARMTIP') ? JSON.parse(localStorage.getItem('WARMTIP')) : false;
      this.close = close;
    },
    handleClose() {
      localStorage.setItem('WARMTIP', true);
      this.close = true;
      this.show = false;
    }
  },
}
</script>

<style lang="scss" scoped>
.warmTip{
  /deep/ .el-dialog{
    width: 564px;
    border-radius: 16px;
    .el-dialog__header{
      padding: 0;
    }
    .el-dialog__body{
      padding: 100px 66px 60px;
    }
  }
  .tipDiv{
    .flex{
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .coinImg{
      width: 220px;
    }
    .tip{
      color: #070707;
      font-size: 28px;
      text-align: left;
      font-weight: bold;
      margin: 60px 0;
    }
    .btn{
      width: 100%;
      background: #07D79B;
      border-color: transparent;
      margin-bottom: 26px;
      font-size: 30px;
      height:74px;
      border-radius:12px;
    }
    .noTip{
      margin: auto;
      background: transparent;
      font-size: 28px;
      color: #999999;
      border-color: transparent;
    }
  }
}
</style>
