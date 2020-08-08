<template>
  <div class="symbolData">
    <div class="myPools">
      <div class="title"><span class="act">我的挖矿</span></div>
      <div class="data">
        <div class="flexb">
          <span>收益：0.00000000 DFS <span class="addition">算力加成：50%</span></span>
          <span class="green">加入</span>
        </div>
        <div class="myMarket">
          <span>您的做市: </span>
          <span>238.9999 EOS / 10000.0000 DFS</span>
        </div>
        <div class="myMarket">
          <span>流动池数量: </span>
          <span>23800.9999 EOS / 1000000.0000 DFS</span>
        </div>
        <div class="symbol flexb">
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

    <div class="poolsLists">
      <div class="title"><span class="act">挖矿列表</span></div>
      <div class="list">
        <div class="flexb mb10">
          <span>tes******est</span>
          <span>收益：0.12340000 DFS</span>
        </div>
        <div class="flexb">
          <span>做市数量</span>
          <span>10.0000 EOS / 100.0000 DFS</span>
        </div>
      </div>
      <div class="list">
        <div class="flexb mb10">
          <span>tes******est</span>
          <span>收益：0.12340000 DFS</span>
        </div>
        <div class="flexb">
          <span>做市数量</span>
          <span>10.0000 EOS / 100.0000 DFS</span>
        </div>
      </div>
      <div class="list">
        <div class="flexb mb10">
          <span>tes******est</span>
          <span>收益：0.12340000 DFS</span>
        </div>
        <div class="flexb">
          <span>做市数量</span>
          <span>10.0000 EOS / 100.0000 DFS</span>
        </div>
      </div>
      <div class="list">
        <div class="flexb mb10">
          <span>tes******est</span>
          <span>收益：0.12340000 DFS</span>
        </div>
        <div class="flexb">
          <span>做市数量</span>
          <span>10.0000 EOS / 100.0000 DFS</span>
        </div>
      </div>
      <div class="list">
        <div class="flexb mb10">
          <span>tes******est</span>
          <span>收益：0.12340000 DFS</span>
        </div>
        <div class="flexb">
          <span>做市数量</span>
          <span>10.0000 EOS / 100.0000 DFS</span>
        </div>
      </div>
      <div class="list">
        <div class="flexb mb10">
          <span>tes******est</span>
          <span>收益：0.12340000 DFS</span>
        </div>
        <div class="flexb">
          <span>做市数量</span>
          <span>10.0000 EOS / 100.0000 DFS</span>
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
.green{
  color: #07D79B;
}

.symbolData{
  text-align: left;
  font-size: 28px;
  color: #000;
  .myPools{
    margin: 40px;
    .addition{
      font-size: 24px;
      color: #C05D5D;
    }
    .symbol{
      margin-top: 20px;
      padding: 20px;
      border: 1px solid #e0e0e0;
      border-radius: 20px;
      .coinInfo{
        text-align: left;
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
    .myMarket{
      margin-top: 20px;
    }
  }
  .poolsLists{
    margin: 40px;
    .list{
      margin-top: 20px;
      border: 1px solid #e0e0e0;
      border-radius: 20px;
      padding: 20px;
      .mb10{
        margin-bottom: 10px;
      }
    }
  }
}
</style>