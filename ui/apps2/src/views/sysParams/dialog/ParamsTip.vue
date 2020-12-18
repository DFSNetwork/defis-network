<template>
  <div class="paramsTip">
    <div class="content">
      <div>TAG为每秒释放0.01个的代币。获取方式有3种</div>
      <ul class="subRules">
        <li>参加投票挖矿从乐捐系统中获得TAG</li>
        <li>通过做市挖矿获得TAG</li>
        <li>在DSS中存入TAG获得TAG</li>
      </ul>
      <div>分配给乐捐账户的比例，委托给DFS社区投票决定</div>
      <div>分配的LP做市挖矿的部分，等于80% - 投票选出的乐捐比例</div>
      <div>分配的DSS的部分固定为剩下的20%</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'paramsTip',
}
</script>

<style lang="scss" scoped>
.paramsTip{
  border-radius: 8px;
  padding: 26px;
  position: relative;
  font-size: 28px;
  color: #333;
  .content{
    font-size: 27px;
    text-align: left;
    &>div{
      margin-bottom: 10px;
    }
    .subRules>li{
      padding-left: 40px;
      margin: 10px 0;
      position: relative;

      &::before{
        content: '';
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #29D4B0;
        position: absolute;
        left: 20px;
        top: 20px;
        transform: translate(-50%, -50%);
      }
    }
  }
}
</style>
