<template>
  <div class="detail">
    <div class="title flexb">
      <span class="back flexa">
        <img src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/back.png" alt="">
      </span>
      <span>产品详情</span>
      <span class="back"></span>
    </div>
    <!-- 币种 -->
    <div class="coinData flexa">
      <img class="coinImg" src="https://cdn.jsdelivr.net/gh/defis-net/material/coin/eosio.token-eos.svg" alt="">
      <div class="coinInfo">
        <div class="coinName">EOS</div>
        <div class="contract tip">eosio.token</div>
      </div>
    </div>
    <!-- 产品信息 -->
    <div class="detailInfo">
      <div class="info flexs">
        <div class="apyInfo">
          <div class="tip subTitle">实时年化增长</div>
          <div class="num dinBold">4.4210%</div>
          <div class="type flexa tip">
            <img src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/kline.png" alt="">
            <span>稳健型</span>
          </div>
        </div>
        <div class="time">
          <div class="tip subTitle flexa">
            <span>产品期限</span>
            <img src="https://cdn.jsdelivr.net/gh/defis-net/material/dex/tips_icon_btn.svg" alt="">
          </div>
          <div class="date dinBold">4天</div>
          <div class="count tip">累计存入327笔</div>
        </div>
      </div>
      <div class="desc tip">
        EOS是区块链奇才BM（Daniel LEOS是区块链奇才BM（Daniel LEOS是区块链奇才BM（Daniel L
        EOS是区块链奇才BM（Daniel LEOS是区块链奇才BM（Daniel LEOS是区块链奇才BM（Daniel L
      </div>
    </div>

    <!-- 交易规则 -->
    <TradeRules v-if="false"/>
    <!-- 我的理财 -->
    <MyFinancial />
  </div>
</template>

<script>
import TradeRules from '../comp/TradeRules';
import MyFinancial from '../comp/MyFinancial';

export default {
  name: 'financialDetail',
  components: {
    TradeRules,
    MyFinancial,
  },
}
</script>

<style lang="scss" scoped>
.detail{
  text-align: left;
  font-size: 24px;
  color: #333;
  .title{
    font-size: 36px;
    height: 80px;
    padding: 0 28px;
    font-weight: 500;
    .back{
      width: 50px;
      height: 50px;
      img{
        display: block;
        width: 18px;
      }
    }
  }
  .coinData{
    margin: 0 32px;
    padding: 24px 0;
    border-bottom: 1px solid rgba(220,220,220, .3);
    .coinImg{
      width: 72px;
      height: 72px;
      border-radius: 50%;
      margin-right: 20px;
    }
    .coinInfo{
      .coinName{
        font-size: 28px;
        font-weight: 500;
      }
      .contract{
        font-size: 22px;
      }
    }
  }
  .detailInfo{
    padding: 28px;
    border-bottom: 26px solid #f5f5f5;
  }
  .info{
    &>div{
      flex: 1;
    }
    .subTitle{
      font-size: 30px;
      margin-bottom: 20px;
    }
    .num{
      font-size: 56px;
      line-height: 64px;
      color: #E62C3B;
    }
    .date{
      font-size: 48px;
      line-height: 64px;
    }
    .type{
      margin-top: 24px;
      background: #F7F8FA;
      border-radius: 5px;
      width: 140px;
      img{
        width: 44px;
        margin-right: 8px;
      }
    }
    .count{
      line-height: 40px;
      margin-top: 24px;
    }
  }
  .desc{
    padding: 20px;
    margin: 40px 0 0;
    background: #F7F8FA;
    font-size: 26px;
    border-radius: 12px;
  }
}
</style>
