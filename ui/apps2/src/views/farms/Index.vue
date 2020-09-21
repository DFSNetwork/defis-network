<template>
  <div class="farms">
    <div class="banner">
      <div class="title">农场大厅</div>
      <div class="subTip">每日农活，收益一目了然</div>
    </div>
    <div class="farmsTitle flexb">
      <span class="act">每日必做</span>
      <span class="right green">一键领取</span>
    </div>
    <div class="proLists">
      <div class="lists">
        <div class="projectName flexb">
          <span>DFS金库</span>
          <span class="claim green">领取</span>
        </div>
        <div class="reward">
          <span>收益：</span>
          <span>10.0000 DFS</span>
        </div>
      </div>
      <div class="lists">
        <div class="projectName flexb">
          <span>DFS矿池</span>
          <span class="claim green">领取</span>
        </div>
        <div class="reward">
          <span>收益：</span>
          <span>10.0000 DFS</span>
        </div>
      </div>
      <div class="lists">
        <div class="projectName flexb">
          <span>YFC鱼塘</span>
          <span class="claim green">领取</span>
        </div>
        <div class="reward">
          <span>收益：</span>
          <span>10.0000 DFS</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    
  }
</script>

<style lang="scss" scoped>
.farms{
  .green{
    color: #07D79B;
  }
  .banner{
    color: #FFF;
    background: #07d79b;
    padding: 80px 0 60px;
    .title{
      font-size: 60px;
      font-weight: 500;
    }
    .subTip{
      font-size: 33px;
    }
  }
  .farmsTitle{
    font-size: 32px;
    text-align: left;
    margin: 20px 40px 40px;
    &>span{
      margin-right: 60px;;
    }
    .act{
      color: $color-black;
      position: relative;
      &::before{
        content: '';
        position: absolute;
        width:60px;
        height:8px;
        background:rgba(2,198,152,1);
        border-radius:4px;
        bottom: -20px;
        left: 50%;
        transform: translateX(-45%);
      }
    }
    .right{
      margin-right: 0
    }
  }
  .proLists{
    padding: 0 40px 40px;
    font-size: 27px;
    .lists{
      text-align: left;
      border-radius: 15px;
      padding: 30px;
      margin-bottom: 30px;
      box-shadow: 0px 10px 40px 0px rgba(220,220,220,0.5);
      .projectName{
        font-size: 30px;
        font-weight: 500;
        margin-bottom: 10px;
        .claim{
          font-size: 27px;
          font-weight: 400;
        }
      }
    }
  }
}
</style>
