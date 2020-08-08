<template>
  <div class="pools">
    <div class="rules">
      <div class="title"><span class="act">挖矿规则</span></div>
      <div class="rule1">1. 挖矿规则挖矿规则挖矿规则挖矿规则挖矿规则</div>
      <div class="rule1">2. 挖矿规则挖矿规则挖矿规则挖矿规则挖矿规则挖矿规则挖矿规则挖矿规则挖矿规则挖矿规则</div>
      <div class="rule1">3. 挖矿规则挖矿规则挖矿规则挖矿规则挖矿规则挖矿规则挖矿规则挖矿规则挖矿规则挖矿规则挖矿规则挖矿规则挖矿规则挖矿规则挖矿规则</div>
      <div class="rule1">4. 挖矿规则挖矿规则挖矿规则挖矿规则挖矿规则</div>
    </div>
    <div class="poolsList">
      <div class="title"><span class="act">矿池列表</span></div>
      <div class="list">
        <div class="flexb">
          <span>收益：0.00000000 DFS <span class="addition">算力加成：50%</span></span>
          <span class="green">加入</span>
        </div>
        <div class="symbol flexa">
          <div class="coinInfo flex">
            <div class="coinImg"><img width="100%" src="https://ndi.340wan.com/eos/eosio.token-eos.png"></div>
            <div>
              <div class="coin">EOS</div>
              <div class="contract tip">eosio.token</div>
            </div>
          </div>
          <div class="add">+</div>
          <div class="coinInfo flex">
            <div class="coinImg"><img width="100%" src="https://ndi.340wan.com/eos/tethertether-usdt.png"></div>
            <div>
              <div class="coin">USDT</div>
              <div class="contract tip">tethertether</div>
            </div>
          </div>
        </div>
      </div>
      <div class="list">
        <div class="flexb">
          <span>收益：1.00000000 DFS <span class="addition">算力加成：10%</span></span>
          <span class="green">领取</span>
        </div>
        <div class="symbol flexa">
          <div class="coinInfo flex">
            <div class="coinImg"><img width="100%" src="https://ndi.340wan.com/eos/eosio.token-eos.png"></div>
            <div>
              <div class="coin">EOS</div>
              <div class="contract tip">eosio.token</div>
            </div>
          </div>
          <div class="add">+</div>
          <div class="coinInfo flex">
            <div class="coinImg"><img width="100%" src="https://ndi.340wan.com/eos/tethertether-usdt.png"></div>
            <div>
              <div class="coin">USDT</div>
              <div class="contract tip">tethertether</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { EosModel } from '@/utils/eos';
export default {
  name: 'poolsData',
  data() {
    return {
    }
  },
  mounted() {
    this.handleGetWeight();
  },
  methods: {
    handleGetWeight() {
      const params = {
        code: 'miningpool11',
        scope: 'miningpool11',
        table: 'weights',
        json: true,
        limit: 100
      }
      EosModel.getTableRows(params, (res) => {
        console.log(res)
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.green{
  color: #07D79B;
}
.pools{
  font-size: 28px;
  text-align: left;
  color: #000;
  .title{
    font-size: 32px;
    text-align: left;
    margin: 0 0 40px;
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
  }
  .rules{
    margin: 40px;
    .rule1{
      margin-top: 10px;
    }
  }
  .poolsList{
    margin: 40px;
    .list{
      margin-top: 20px;
      padding: 20px;
      border: 1px solid #e0e0e0;
      border-radius: 20px;
      .addition{
        font-size: 24px;
        color: #C05D5D;
      }
      .symbol{
        margin-top: 20px;
        .coinInfo{
          text-align: left;
          flex: 1;
          .coinImg{
            width: 60px;
            height: 60px;
            margin-right: 10px;
          }
          .coin{
            font-size: 28px;
            font-weight: 500;;
            line-height: 30px;
          }
          .contract{
            line-height: 30px;
          }
          .ableGet{
            color: #2F3F52;
          }
        }
        .add{
          width: 40px;
        }
      }
    }
  }
}
</style>
