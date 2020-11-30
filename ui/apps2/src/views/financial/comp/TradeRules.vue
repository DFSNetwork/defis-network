<template>
  <div class="tradeReles" :class="{'noMargin': showType === 'dialog'}">
    <div class="title">{{ $t('financial.rules') }}</div>
    <div class="tip">{{ $t('financial.rules1') }}</div>
    <div class="step flexb" v-if="showType !== 'dialog'">
      <span class="item"></span>
      <span class="item"></span>
      <span class="item"></span>
    </div>
    <div class="stepSpan flexb" v-if="showType !== 'dialog'">
      <span>{{ $t('financial.rules2') }}</span>
      <span>{{ $t('financial.rules3') }}</span>
      <span>{{ $t('financial.rules4') }}</span>
    </div>
    <div class="ul">
      <div class="li">{{ $t('financial.rules5') }}</div>
      <div class="li flexa">
        <span>{{ $t('financial.rules6') }}</span>
        <img @click="showTip = true" class="tipImg" src="https://cdn.jsdelivr.net/gh/defis-net/material/dex/tips_icon_btn.svg" alt="">
      </div>
      <div class="li">{{ $t('financial.rules7') }}</div>
      <div class="li">{{ $t('financial.rules8') }}</div>
      <div class="li">{{ $t('financial.rules9') }}</div>
    </div>

    <el-dialog
      class="mydialog"
      :append-to-body="true"
      :show-close="false"
      :visible.sync="showTip">
      <RewardTip v-if="showTip" />
    </el-dialog>
  </div>
</template>

<script>
import RewardTip from '../dialog/RewardTip';

export default {
  name: 'tradeReles',
  components: {
    RewardTip
  },
  props: {
    showType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      showTip: false,
    }
  }
}
</script>

<style lang="scss" scoped>
.tradeReles{
  color: #333;
  font-size: 28px;
  margin: 30px 32px;
  &.noMargin{
    margin: 30px 0;
  }
  .title{
    font-size: 32px;
    font-weight: 500;
    margin-bottom: 8px;
  }
  .tip{
    font-size: 24px;
  }
  .step{
    margin-top: 30px;
    box-sizing: border-box;
    width: 100%;
    position: relative;
    &::after{
      content: '';
      width: 99%;
      height: 4px;
      background: rgba(41, 212, 176, 0.2);
      position: absolute;
      z-index: -1;
    }
    .item{
      position: relative;
      z-index: 10;
      width: 20px;
      height: 20px;
      box-sizing: border-box;
      border: 5px solid #29D4B0;
      border-radius: 50%;
      background: #FFF;
    }
  }
  .stepSpan{
    margin-top: 20px;
    &>span{
      flex: 1;
      &:first-child{
        text-align: left;
      }
      &:nth-child(2){
        text-align: center;
      }
      &:last-child{
        text-align: right;
      }
    }
  }
  .ul{
    margin: 22px 0;
    .li{
      padding-left: 20px;
      color: #999;
      margin-bottom: 20px;
      position: relative;

      &::before{
        content: '';
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #29D4B0;
        position: absolute;
        left: 0px;
        top: 20px;
        transform: translate(-50%, -50%);
      }
      .tipImg{
        width: 32px;
        margin-left: 10px;
      }
    }
  }
}
.mydialog{
  /deep/ .el-dialog{
    width: 700px;
  }
}
</style>
