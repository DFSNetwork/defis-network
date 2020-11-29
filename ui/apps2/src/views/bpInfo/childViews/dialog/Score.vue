<template>
  <div class="scoreDiv">
    <img class="close" src="https://cdn.jsdelivr.net/gh/defis-net/material/svg/sd_icon_btn.svg" alt="">
    <div class="title">评分</div>
    <div class="content">
      <div>亲，给个评分吧～</div>
      <div class="score">
        <van-rate v-model="value" allow-half
          void-icon="star" void-color="#DBDBDB" color="#FFC300"/>
        <div class="type">
          <span v-if="value >= 4.5">推荐赞👍爆了</span>
          <span v-else-if="value >= 4">推荐大家用</span>
          <span v-else-if="value >= 3">一般般</span>
          <span v-else-if="value >= 2 ">差</span>
          <span v-else-if="value > 0">非常差</span>
        </div>
      </div>
      <div>写点评论</div>
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
  .score{
    margin: 15px 0;
    text-align: center;
    .type{
      margin-top: 15px;
      color: #FFBE00;
    }
    /deep/ .van-rate__icon{
      font-size: 60px;
      margin-right: 30px;
    }
  }
  .accMsg{
    background: #F5F5F5;
    border-radius: 12px;
    padding: 22px;
    margin: 15px 0;
    .input{
      padding: 0;
      border: 0px;
      font-size: 30px;
      background: #F5F5F5;
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
