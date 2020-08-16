<template>
  <div class="symbols">
    <div class="minW">
      <div class="title">
        <span>Transactions</span>
      </div>
      <div class="tables">
        <div class="listHeard flexb">
          <span>Market</span>
          <span>Total Value</span>
          <span>Token Amount</span>
          <span>Token Amount</span>
          <span>Account</span>
          <span>Time</span>
        </div>
        <div class="list flexb">
          <span>EOS-DFS</span>
          <span>$1000000</span>
          <span>100EOS</span>
          <span>200DFS</span>
          <span>testtesttest</span>
          <span>2020-08-15 22:11</span>
        </div>
        <div class="list flexb">
          <span>EOS-DFS</span>
          <span>$1000000</span>
          <span>100EOS</span>
          <span>200DFS</span>
          <span>testtesttest</span>
          <span>2020-08-15 22:11</span>
        </div>
        <div class="list flexb">
          <span>EOS-DFS</span>
          <span>$1000000</span>
          <span>100EOS</span>
          <span>200DFS</span>
          <span>testtesttest</span>
          <span>2020-08-15 22:11</span>
        </div>
        <div class="list flexb">
          <span>EOS-DFS</span>
          <span>$1000000</span>
          <span>100EOS</span>
          <span>200DFS</span>
          <span>testtesttest</span>
          <span>2020-08-15 22:11</span>
        </div>
        <div class="list flexb">
          <span>EOS-DFS</span>
          <span>$1000000</span>
          <span>100EOS</span>
          <span>200DFS</span>
          <span>testtesttest</span>
          <span>2020-08-15 22:11</span>
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
.symbols{
  margin: 20px 0;
  text-align: left;
  .minW{
    max-width: 1240px;
    margin: auto;
  }
  .title{
    font-size: 26px;
    font-weight: bold;
  }
  .tables{
    font-size: 16px;
    box-shadow: 0 0 5px 1px rgba(200, 200, 200, .3);
    padding: 0px 20px;
    border-radius: 10px;
    margin-top: 10px;
    .listHeard,.list{
      height: 50px;
      &>span{
        flex: 1;
      }
    }
    .list{
      height: 60px;
      border-top: 1px solid #eee;;
      .trade{
        padding: 4px 15px;
        border-radius: 20px;
        background: #07d79b;
        color: #FFF;
        margin-left: 10px;
      }
      .add{
        color: #07d79b;
      }
    }
  }
}
</style>
