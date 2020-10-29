<template>
  <div class="lists">
    <div class="list flexa" v-for="(item, index) in lists" :key="index"
      @click="isChecked = !isChecked">
      <div class="main">
        <div class="flexa">
          <span v-if="act !== 1" class="rank flexc">{{ index+1 }}</span>
          <span class="nodeName">eonodeeonode</span>
        </div>
        <div class="tip data flexb">
          <div class="flexa">
            <van-icon class="coin rotate" name="coupon-o" />
            <span>20000 EOS</span>
          </div>
          <div class="flexa">
            <img class="coin" src="@/assets/navImg/earth.svg">
            <a class="tip websize" href="https://1233333" target="_blank" rel="noopener noreferrer">
              https://1233333
            </a>
          </div>
        </div>
      </div>
      <div class="checkBoxDiv flexc">
        <div class="checkBox flexc" :class="{'isChecked': isChecked}">
          <van-icon v-if="isChecked" name="checked"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'nodeLists',
  props: {
    act: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      isChecked: false,
      lists: [1,1,1,1,1]
    }
  }
}
</script>

<style lang="scss" scoped>
.lists{
  .list{
    height: 130px;
    border-top: 1px solid #EEE;
    &:last-child{
      border-bottom: 0px solid #EEE;
    }
    .main{
      flex: 1;
    }
    .checkBoxDiv{
      width: 50px;
      height: 50px;
      margin-left: 20px;
      .checkBox{
        box-sizing: border-box;
        height: 42px;
        width: 42px;
        border: 1px solid #eee;
        font-size: 45px;
        border-radius: 50%;;
        color: #07d79b;
        &.isChecked{
          border: 0px solid #eee;
        }
      }
    }
    .rank{
      background: #337352;
      color: #fFF;
      width: 50px;
      height: 35px;
      border-radius: 8px;
      font-size: 21px;
      margin-right: 10px;
    }
    .nodeName{
      font-weight: 500;
      color: #000;
      font-size: 30px;
    }
    .data{
      margin-top: 15px;
      .coin{
        font-size: 32px;
        max-width: 32px;
        margin-right: 10px;
      }
      .rotate{
        transform: rotate(-45deg);
      }
      .websize{
        max-width: 200px;
        overflow: hidden;
        text-overflow:ellipsis; //溢出用省略号显示
        white-space:nowrap; //溢出不换行
      }
    }
  }
}
</style>