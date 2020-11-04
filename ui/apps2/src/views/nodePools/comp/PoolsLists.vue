<template>
  <div class="poolsLists">
    <div class="title flexb">
      <span class="act">矿池列表</span>
    </div>
    <div class="list">
      <div class="poolInfo flexa">
        <img class="coinImg" src="https://apps.defis.network/static/coin/minedfstoken-dfs.png">
        <div class="bal">
          <div class="flexb">
            <span>DFS矿池收益</span>
            <span class="apy">年化：12.00%</span>
          </div>
          <div class="num din">0.12340000</div>
        </div>
      </div>
      <div class="reward">池子余额：2000.0000 DFS</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'poolsLists',
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
.poolsLists{
  margin: 32px;
  font-size: 28px;
  color: #333;
}
.title{
  font-size: 32px;
  text-align: left;
  margin: 0 0 20px;
  .act{
    color: #333;
    position: relative;
    padding-left: 28px;
    &::before{
      content: '';
      position: absolute;
      width: 8px;
      height: 30px;
      background:rgba(2,198,152,1);
      border-radius:4px;
      top: 50%;
      left: 0;
      transform: translateY(-45%);
    }
  }
}
.list{
  border: 1px solid #eee;
  padding: 20px 26px;
  border-radius: 12px;
  text-align: left;
  .poolInfo{
    margin-bottom: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
    .bal{
      flex: 1;
    }
    .coinImg{
      width: 100px;
      height: 100px;
      border-radius: 50%;
      margin-right: 10px;
    }
    .num{
      font-size: 50px;
    }
    .apy{
      color: #333;
    }
  }
}
</style>
