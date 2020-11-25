<template>
  <div class="myFinancial">
    <div class="title flexb">
      <span>我的理财</span>
      <span class="green">一键领取</span>
    </div>
    <div class="lists">
      <div class="list">
        <div class="flexb coinInfo">
          <div class="flexa">
            <img src="https://cdn.jsdelivr.net/gh/defis-net/material/coin/eosio.token-eos.svg" alt="">
            <span class="coinName">EOS</span>
          </div>
          <div class="btnDiv flexb">
            <div class="btn flexc">领取</div>
            <div class="btn flexc withdraw">取回</div>
          </div>
        </div>
        <div class="flexa li dinReg">存入本金：9.0298 DFS</div>
        <div class="flexa li dinReg">
          <span>存入奖励：</span>
          <span class="green">0.0886 DFS</span>
        </div>
        <div class="flexa li dinReg">
          <span>做市时长：12天01时28分31秒(盈亏: </span>
          <span class="red">-2.71</span>
          <span>%)</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'myFinancial',
}
</script>

<style lang="scss" scoped>
.myFinancial{
  padding: 44px 32px;
  font-size: 28px;
  color: #333;
  .title{
    font-size: 32px;
  }
  .red{
    color: #FE3B37;
  }
  .green{
    color: #29D4B0;
  }
  .list{
    margin: 42px 0;
    padding: 22px 20px;
    border: 1px solid rgba(220,220,220,0.3);
    border-radius: 20px;
    box-shadow: 0px 20px 40px 0px rgba(220,220,220,0.5);
    .coinInfo{
      img{
        width: 52px;
        height: 52px;
        border-radius: 30px;
        margin-right: 15px;
      }
      .coinName{
        color: #000;
        font-weight: 500;;
      }
    }
    .btnDiv{
      .btn{
        padding: 10px 36px;
        margin-right: 18px;
        background: #29D4B0;
        border-radius: 40px;
        color: #FFF;
        font-size: 24px;
        &.withdraw{
          margin-right: 0;
          background: #FE3B37;
        }
      }
    }
    .li{
      margin: 12px 0;
    }
  }
}
</style>
