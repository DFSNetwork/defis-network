<template>
  <div class="symbols">
    <div class="minW">
      <div class="title">
        <span>Pairs</span>
      </div>
      <div class="tables">
        <div class="listHeard flexb">
          <span>Name</span>
          <span>Liquidity </span>
          <span>Volume (24hrs)</span>
          <span>Volume (7d) </span>
          <span>Fees (24hr) </span>
          <span></span>
        </div>
        <div class="list flexb">
          <span>EOS-DFS</span>
          <span>$1000000</span>
          <span>$1000000</span>
          <span>$1000000</span>
          <span>$1000000</span>
          <span>
            <span class="add">Add Liquidity</span>
            <span class="trade">Trade</span>
          </span>
        </div>
        <div class="list flexb">
          <span>EOS-DFS</span>
          <span>$1000000</span>
          <span>$1000000</span>
          <span>$1000000</span>
          <span>$1000000</span>
          <span>
            <span class="add">Add Liquidity</span>
            <span class="trade">Trade</span>
          </span>
        </div>
        <div class="list flexb">
          <span>EOS-DFS</span>
          <span>$1000000</span>
          <span>$1000000</span>
          <span>$1000000</span>
          <span>$1000000</span>
          <span>
            <span class="add">Add Liquidity</span>
            <span class="trade">Trade</span>
          </span>
        </div>
        <div class="list flexb">
          <span>EOS-DFS</span>
          <span>$1000000</span>
          <span>$1000000</span>
          <span>$1000000</span>
          <span>$1000000</span>
          <span>
            <span class="add">Add Liquidity</span>
            <span class="trade">Trade</span>
          </span>
        </div>
        <div class="list flexb">
          <span>EOS-DFS</span>
          <span>$1000000</span>
          <span>$1000000</span>
          <span>$1000000</span>
          <span>$1000000</span>
          <span>
            <span class="add">Add Liquidity</span>
            <span class="trade">Trade</span>
          </span>
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
