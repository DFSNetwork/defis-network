<template>
  <div class="createTop">
    <img class="bg" src="https://cdn.jsdelivr.net/gh/defis-net/material2/dfs/farmInfoBg.png">
    <div class="info">
      <img class="infoImg" src="https://cdn.jsdelivr.net/gh/defis-net/material2/dfs/farmInfo.png">

      <div class="item flexs">
        <div class="disc1"></div>
        <div class="subTip">
          <div class="title">对农场拥有至高无上的管理权</div>
          <div class="tip">作为农场创建者，整个农场的管理权都在你的手上</div>
        </div>
      </div>
      <div class="item flexs">
        <div class="disc1"></div>
        <div class="subTip">
          <div class="title">挖矿丰厚福利支持</div>
          <div class="tip">定期组织农场挖矿讨论，引导成员彼此分享，提升农场活跃</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'createTop',
}
</script>

<style lang="scss" scoped>
.bg{
  width: 100%;
}
.info{
  background: #FFF;
  border-radius: 16px;
  font-size: 28px;
  padding: 0 32px 48px;
  margin: 0 28px;
  text-align: left;
  margin-top: -200px;
  z-index: 1;
  position: relative;
  .infoImg{
    width: 216px;
    margin: auto;
    display: block;
    margin-bottom: 30px;
  }
  .item{
    margin-bottom: 25px;
    &:last-child{
      margin-bottom: 0;
    }
  }
  .disc1{
    border-radius: 30px;
    height: 30px;
    width: 30px;
    border: 4px solid $color-main;
    box-sizing: border-box;
    margin-right: 20px;
    margin-top: 10px;
  }
  .subTip{
    flex: 1;
    font-size: 24px;
    .title{
      font-weight: 500;
      font-size: 28px;
      margin-bottom: 8px;
    }
  }
}
</style>
