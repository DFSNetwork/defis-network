<template>
  <div class="tradeReles" :class="{'noMargin': showType === 'dialog'}">
    <div class="title">规则</div>
    <div class="tip">存入、取回规则</div>
    <div class="step flexb" v-if="showType !== 'dialog'">
      <span class="item"></span>
      <span class="item"></span>
      <span class="item"></span>
    </div>
    <div class="stepSpan flexb" v-if="showType !== 'dialog'">
      <span>今日存入</span>
      <span>锁定4日</span>
      <span>到期取回</span>
    </div>
    <div class="ul">
      <div class="li">存入EOS，锁定4日，解锁前不可取出，</div>
      <div class="li">解锁时间由最后一次存入行为决定，</div>
      <div class="li">解锁后，资金可自行取回</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'tradeReles',
  props: {
    showType: {
      type: String,
      default: ''
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
    }
  }
}
</style>
