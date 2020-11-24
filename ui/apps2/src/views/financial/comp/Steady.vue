<template>
  <div class="steady">
    <div class="title flexa">
      <span class="name">稳健型</span>
      <span class="tip">收益稳，历史100%兑付本金</span>
    </div>
    <div class="lists">
      <div class="list">
        <div class="coin flexb">
          <div class="flexa">
            <img class="coinImg" src="https://cdn.jsdelivr.net/gh/defis-net/material/coin/eosio.token-eos.svg">
            <div class="coinInfo">
              <div class="coinName">EOS</div>
              <div class="contract tip">eosio.token</div>
            </div>
          </div>
          <div class="btn flexc">管理</div>
        </div>

        <div class="flexb info">
          <div class="percent">
            <div class="apy">1234.56%</div>
            <div class="tip">实时年化</div>
          </div>
          <div class="dataInfo">
            <div class="time">4天</div>
            <div class="tip">稳健型 中低风险</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'steady',
}
</script>

<style lang="scss" scoped>
.steady{
  padding: 32px 36px;
  font-size: 28px;
  color: #333;
  .title{
    .name{
      margin-right: 20px;
      font-size: 40px;
      font-weight: 500;
    }
    .tip{
      font-weight: normal;
    }
  }
  .lists{
    margin: 32px 0;
    background: #FFF;
    border-radius: 8px;
    text-align: left;
    .list{
      padding: 24px 30px;
    }
  }
}
.coin{
  .coinImg{
    width: 64px;
    height: 64px;
    border-radius: 50%;
    margin-right: 10px;
  }
  .coinName{
    font-weight: 500;
    font-size: 28px;
    color: #000;
  }
  .contract{
    font-size: 22px;
  }
  .btn{
    font-size: 24px;
    background: #29D4B0;
    border-radius: 30px;
    height: 60px;
    padding: 0 36px;
    color: #fff;
  }
}
.info{
  margin-top: 26px;
  .percent{
    flex: 2;
    .apy{
      line-height: 44px;
      font-size: 44px;
      color: #E62C3B;
      margin-bottom: 8px;
    }
  }
  .dataInfo{
    flex: 3;
    .time{
      line-height: 44px;
      font-size: 32px;
      margin-bottom: 8px;
    }
  }
  .tip{
    font-size: 24px;
  }
}
</style>
