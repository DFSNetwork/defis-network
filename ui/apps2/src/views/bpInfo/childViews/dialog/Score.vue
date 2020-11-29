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
    </div>
  </div>
</template>

<script>
export default {
  name: 'scoreAcc',
  data() {
    return {
      value: 0
    }
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
}
</style>
