<template>
  <div class="preview">
    <div class="title">{{ $t('dsr.depositView') }}</div>
    <div class="content">
      <div class="item">
        <span>{{ $t('dsr.depositNum') }}：</span>
        <span>{{ params.payNum || '0.0000' }} TAG</span>
      </div>
      <div class="item">
        <span>{{ $t('dsr.depositTime') }}：</span>
        <span>{{ $t(`dsr.${params.dateLong}`) || '3个月' }}</span>
      </div>
      <div class="item">
        <span>{{ $t('dsr.allDeposit') }}：</span>
        <span>{{ params.hasNum || '0.0000' }}</span>
      </div>
      <div class="item">
        <span>{{ $t('dsr.value') }}：</span>
        <span>{{ params.total || '0.0000' }} TAG</span>
      </div>
      <div class="item warn" v-if="params.endDate">
        <span>{{ $t('dsr.abtEndDate') }}：</span>
        <span>{{ params.endDate }}</span>
      </div>
    </div>
    <div class="btnDiv flexb">
      <div class="btn flexc cancel" @click="handleClose">{{ $t('public.cancel') }}</div>
      <div class="btn flexc sure" v-loading="loading" @click="handleShowTip">{{ $t('public.confirm') }}</div>
    </div>

    <el-dialog
      class="myDialog"
      append-to-body
      :show-close="false"
      :visible="showTimeTip">
      <div class="timeTip">
        <div class="title">{{ $t('public.warmPrompt') }}</div>
        <div>
          <span>{{ $t('dsr.warmTip1') }}</span>
          <span class="warn">{{ params.endDate }}</span>
          <span>{{ $t('dsr.warmTip2') }}</span>
        </div>
        <div class="btnDiv flexb">
          <div class="btn flexc cancel" @click="handleCancel">{{ $t('public.cancel') }}</div>
          <div class="btn flexc sure" @click="handleSure">{{ $t('public.confirm') }}</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showTimeTip: false,
      loading: false,
    }
  },
  props: {
    params: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('listenClose')
    },
    handleSure() {
      this.showTimeTip = false;
      this.$emit('listenSure', true)
    },
    handleCancel() {
      this.showTimeTip = false;
      this.loading = false;
    },
    handleShowTip() {
      if (this.loading) {
        return
      }
      this.loading = true;
      if (this.params.endDate) {
        this.showTimeTip = true;
        return
      }
      this.handleSure()
    }
  },
}
</script>

<style lang="scss" scoped>
.red{
  color: #c05d5d;
}
.warn{
  color: #f5a623;
}
.preview{
  padding: 40px;
  color: #000;
  .title{
    text-align: center;
    font-size: 32px;
    color: rgba(7,215,155,1);
    margin-bottom: 20px;
  }
  .content{
    padding: 20px 30px;
    border-radius: 30px;
    border: 1px solid #f3f3f3;
    font-size: 28px;
    .item{
      display: flex;
      align-items: center;
      justify-content: center;

      &>span{
        flex: 1;
        max-width: 50%;
        height: 50px;
        display: flex;
        align-items: center;
        &:first-child{
          justify-content: flex-end;
        }
      }
    }
  }
}

.btnDiv{
  margin: 40px 0 0;
  font-size: 32px;
  // font-weight: 500;
  .btn{
    flex: 1;
    height: 88px;
    background:rgba(7,215,155,1);
    border-radius:30px;
    color: #fff;
    &:first-child{
      margin-right: 8px;
      background: #FFF;
      color: $color-tip;
      border: 1px solid #e3e3e3;
      &:active{
        background: linear-gradient(#eee, #ededed);
      }
    }
    &:active{
      background:rgba(2,198,152,1);
    }
  }
}
.myDialog{
  /deep/ .el-dialog{
    position: relative;
    margin: auto;
    width: 650px;
    border-radius: 20px;
    .el-dialog__body,
    .el-dialog__header{
      padding: 0;
    }
  }
  .timeTip{
    font-size: 28px;
    padding: 40px;
    .title{
      text-align: center;
      font-size: 32px;
      color: #f5a623;
      margin-bottom: 20px;
    }
  }
}
</style>
