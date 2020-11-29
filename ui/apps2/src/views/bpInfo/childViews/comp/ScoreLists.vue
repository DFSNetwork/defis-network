<template>
  <div class="scoreLists">
    <div class="title">用户评价</div>
    <div class="lists">
      <div class="list flexs">
        <img class="headImg" src="https://cdn.jsdelivr.net/gh/defis-net/material/coin/eosio.token-eos.svg" alt="">
        <div class="main">
          <div class="flexb">
            <div class="accInfo">
              <div class="name">昵称</div>
              <div class="time tip dinReg">11-12</div>
            </div>
            <div class="scoreType">
              <div class="tip">
                <span v-if="value >= 4.5">推荐赞👍爆了</span>
                <span v-else-if="value <= 4">推荐大家用</span>
                <span v-else-if="value >= 3">一般般</span>
                <span v-else-if="value >= 2 ">差</span>
                <span v-else>非常差</span>
              </div>
              <div>
                <van-rate v-model="value" readonly allow-half
                  void-icon="star" void-color="#DBDBDB" color="#FFC300"/>
              </div>
            </div>
          </div>
          <div class="content">i了i了 赞到家！！！</div>
        </div>
      </div>
      <div class="list flexs">
        <img class="headImg" src="https://cdn.jsdelivr.net/gh/defis-net/material/coin/eosio.token-eos.svg" alt="">
        <div class="main">
          <div class="flexb">
            <div class="accInfo">
              <div class="name">昵称</div>
              <div class="time tip dinReg">11-12</div>
            </div>
            <div class="scoreType">
              <div class="tip">
                <span v-if="value >= 4.5">推荐赞👍爆了</span>
                <span v-else-if="value >= 4">推荐大家用</span>
                <span v-else-if="value >= 3">一般般</span>
                <span v-else-if="value >= 2 ">差</span>
                <span v-else>非常差</span>
              </div>
              <div>
                <van-rate v-model="value" readonly allow-half
                  void-icon="star" void-color="#DBDBDB" color="#FFC300"/>
              </div>
            </div>
          </div>
          <div class="content">i了i了 赞到家！！！</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {
      value: 3,
    }
  }
}
</script>

<style lang="scss" scoped>
.scoreLists{
  text-align: left;
  font-size: 28px;
  padding: 28px 32px;
  .title{
    font-size: 32px;
    font-weight: 500;
    padding-left: 28px;
    position: relative;
    margin-bottom: 20px;
    &::before{
      content: '';
      position: absolute;
      height: 26px;
      width: 8px;
      top: 50%;
      left: 0px;
      transform: translate(0, -45%);
      background: #29D4B0;
      border-radius: 4px;
    }
  }
  .list{
    padding: 26px 0;
    border-bottom: 1px solid rgba(220,220,220, .3);
    &:last-child{
      border-bottom: 0;
    }
    .headImg{
      width: 80px;
      height: 80px;
      border-radius: 50%;
      margin-right: 10px;
    }
    .main{
      flex: 1;
    }
    .name{
      font-size: 30px;
      font-weight: 500;
    }
    .time{
      font-size: 22px;
    }
    .scoreType{
      font-size: 22px;
      /deep/ .van-rate__icon{
        font-size: 20px;
      }
    }
    .content{
      margin-top: 14px;
    }
  }
}
</style>
