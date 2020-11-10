<template>
  <div class="accWallet">
    <div class="flexb title">
      <span>我的钱包</span>
      <span class="flexa green_p">
        <span>立即做市</span>
        <img class="rightIcon" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/right.png" alt="">
      </span>
    </div>
    <div class="wallet flexb">
      <div class="has">
        <div class="subTitle">资产</div>
        <div>
          <span class="num dinBold">100.0000</span>
          <span class="small">DFS</span>
        </div>
      </div>
      <div class="has unClaim">
        <div class="subTitle">待领取</div>
        <div>
          <span class="num dinBold">100.0000</span>
          <span class="small">DFS</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'accWallet',
}
</script>

<style lang="scss" scoped>
.accWallet{
  color: #333;
  position: relative;
  font-size: 24px;
  background: #FFF;
  border-radius: 12px;
  margin: -60px 28px 34px;
  // padding: 24px 28px;
  box-shadow: 0px 4px 8px 0px rgba(226,226,226,0.5);
  overflow: hidden;
  .title{
    font-size: 40px;
    font-weight: 500;
    padding: 24px 28px;
    border-bottom: 1px solid #eee;
    .green_p{
      font-size: 27px;
      font-weight: normal;
    }
    .rightIcon{
      width: 10px;
      margin-left: 8px;
    }
  }
  .wallet{
    padding: 16px 0;
    text-align: left;
    .has{
      flex: 1;
      padding: 26px 28px;
      &:first-child{
        border-right: 1px solid rgba(220, 220, 220, .3);
      }
      .subTitle{
        font-weight: 500;
        margin-bottom: 12px;
      }
    }
    .num{
      font-size: 40px;
    }
    .small{
      font-size: 22px;
      font-weight: 300;
      margin-left: 10px;
    }
  }
}
</style>