<template>
  <div class="accInfo">
    <img class="accBgImg" src="https://cdn.jsdelivr.net/gh/defis-net/material/accBanner/banner0.png" alt="">
    <div class="info flexa">
      <div class="headDiv flexc">
        <img class="headImg" src="https://cdn.jsdelivr.net/gh/defis-net/material/coin/dbctokenmain-dbc.png" alt="">
      </div>
      <div>
        <div class="name">开始溺亡的</div>
        <div class="account flexb">
          <span>ID: testtesttest</span>
          <img class="copy" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/copy.png" alt="">
        </div>
        <div class="intro">暂时没有简介</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'accInfo',
}
</script>

<style lang="scss" scoped>
.accInfo{
  font-size: 24px;
  height: 296px;
  position: relative;
  .accBgImg{
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0%;
    top: 0%;
  }
  .info{
    position: relative;
    padding: 46px 28px 0;
    color: #FFF;
    text-align: left;
    .headDiv{
      background: #FFF;
      border-radius: 70px;
      width: 140px;
      height: 140px;
      margin-right: 28px;
    }
    .headImg{
      width: 84px;
      height: 84px;
      border-radius: 50px;
    }
    .name{
      font-size: 40px;
      font-weight: 500;
    }
    .account{
      margin-bottom: 8px;
      .copy{
        width: 24px;
      }
    }
  }
}
</style>
