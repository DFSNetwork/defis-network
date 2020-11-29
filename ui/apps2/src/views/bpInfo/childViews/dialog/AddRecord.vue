<template>
  <div class="scoreDiv">
    <img class="close" src="https://cdn.jsdelivr.net/gh/defis-net/material/svg/sd_icon_btn.svg" alt="">
    <div class="title">编辑</div>
    <div class="content">
      <div class="addTitle flexb">
        <span>标题</span>
        <span class="flexa">
          <van-field class="tleIpt" v-model="title" placeholder="请输入标题"/>
          <img class="right" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/itemRight.png" alt="">
        </span>
      </div>
      <div class="accMsg">
        <van-field
            class="input"
            v-model="memo"
            rows="1"
            autosize
            type="textarea"
            :placeholder="$t('fundation.iptTip')"
          />
          <div class="iptlen">{{sizeof}}/256</div>
      </div>
    </div>
    <div class="btn flexc">确定</div>
  </div>
</template>

<script>
export default {
  name: 'scoreAcc',
  data() {
    return {
      value: 0,
      memo: '',
    }
  },
  computed: {
    sizeof(){
      const str = this.memo;
      let total = 0,
          charCode,
          i,
          len;
      for(i = 0, len = str.length; i < len; i++){
          charCode = str.charCodeAt(i);
          if(charCode <= 0x007f) {
              total += 1;
          }else if(charCode <= 0x07ff){
              total += 2;
          }else if(charCode <= 0xffff){
              total += 3;
          }else{
              total += 4;
          }
      }
      return total;
    },
  }
}
</script>

<style lang="scss" scoped>
.scoreDiv{
  position: relative;
  padding: 28px;
  color: #333;
  font-size: 28px;
  text-align: left;
  .close{
    position: absolute;
    top: 20px;
    right: 20px;
    width: 26px;
  }
  .title{
    font-size: 32px;
    font-weight: 500;
    margin-bottom: 15px;
    text-align: center;
  }
  .addTitle{
    font-size: 32px;
    border-bottom: 1px solid rgba(220, 220, 220, .3);
    .tleIpt{
      /deep/ .van-field__control{
        text-align: right;
      }
    }
    /deep/ .van-cell::after{
      border: 0;
    }
    .right{
      width: 12px;
    }
  }
  .accMsg{
    background: #F5F5F5;
    border-radius: 12px;
    padding: 22px;
    margin: 40px 0;
    .input{
      padding: 0;
      border: 0px;
      font-size: 30px;
      background: #F5F5F5;
      min-height: 350px;
    }
    .iptlen{
      text-align: right;
      font-size: 24px;
      color: #666;
      right: 0px;
      bottom: 5px;
    }
  }
}
.btn{
  margin: 40px 0 10px;
  height: 88px;
  // background:rgba(7,215,155,1);
  background: #29D4B0;
  border-radius: 48px;
  color: #fff;
  font-size: 32px;
  font-weight: 500;
  &:active{
    background:rgba(2,198,152,1);
  }
}
</style>
