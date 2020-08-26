<template>
  <div class="thanks">
    <div class="title">鸣谢</div>
    <div class="list">
      <div class="cc rowup">
        <div class="item flexb">
          <span>Newdex Seed</span>
          <!-- <span class="trx">Trxid:1a087b0ebfca24a18162fc5de1be389ed3d32fd0e01f027f04c5a6755cf7d88d</span> -->
        </div>
        <div class="item flexb">
          <span>Hoo Seed</span>
          <!-- <span class="trx">Trxid:1a087b0ebfca24a18162fc5de1be389ed3d32fd0e01f027f04c5a6755cf7d88d</span> -->
        </div>
        <div class="item flexb">
          <span>Hoo广告</span>
          <!-- <span class="trx">Trxid:1a087b0ebfca24a18162fc5de1be389ed3d32fd0e01f027f04c5a6755cf7d88d</span> -->
        </div>
        <div class="item flexb">
          <span>胖哥广告</span>
          <!-- <span class="trx">Trxid:1a087b0ebfca24a18162fc5de1be389ed3d32fd0e01f027f04c5a6755cf7d88d</span> -->
        </div>
        <div class="item flexb">
          <span>Tp审计赞助</span>
          <!-- <span class="trx">Trxid:1a087b0ebfca24a18162fc5de1be389ed3d32fd0e01f027f04c5a6755cf7d88d</span> -->
        </div>
        <div class="item flexb">
          <span>胜权开发api</span>
          <!-- <span class="trx">Trxid:1a087b0ebfca24a18162fc5de1be389ed3d32fd0e01f027f04c5a6755cf7d88d</span> -->
        </div>
        <!-- 备份展示 -->
        <div class="item flexb">
          <span>Newdex Seed</span>
          <!-- <span class="trx">Trxid:1a087b0ebfca24a18162fc5de1be389ed3d32fd0e01f027f04c5a6755cf7d88d</span> -->
        </div>
        <div class="item flexb">
          <span>Hoo Seed</span>
          <!-- <span class="trx">Trxid:1a087b0ebfca24a18162fc5de1be389ed3d32fd0e01f027f04c5a6755cf7d88d</span> -->
        </div>
        <div class="item flexb">
          <span>Hoo广告</span>
          <!-- <span class="trx">Trxid:1a087b0ebfca24a18162fc5de1be389ed3d32fd0e01f027f04c5a6755cf7d88d</span> -->
        </div>
        <div class="item flexb">
          <span>胖哥广告</span>
          <!-- <span class="trx">Trxid:1a087b0ebfca24a18162fc5de1be389ed3d32fd0e01f027f04c5a6755cf7d88d</span> -->
        </div>
        <div class="item flexb">
          <span>Tp审计赞助</span>
          <!-- <span class="trx">Trxid:1a087b0ebfca24a18162fc5de1be389ed3d32fd0e01f027f04c5a6755cf7d88d</span> -->
        </div>
        <div class="item flexb">
          <span>胜权开发api</span>
          <!-- <span class="trx">Trxid:1a087b0ebfca24a18162fc5de1be389ed3d32fd0e01f027f04c5a6755cf7d88d</span> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
@keyframes rowup {
  0% {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
  100% {
    -webkit-transform: translate3d(0, -50%, 0);
    transform: translate3d(0, -50%, 0);
  }
}
.thanks{
  padding: 40px;
  .title{
    text-align: center;
    font-size: 32px;
    margin-bottom: 10px;;
  }
}
.list{
  position: relative;
  height: 350px;
  overflow: hidden;
  font-size: 28px;
  padding: 10px 0;
  &::before{
    content: '';
    position: absolute;
    width: 100%;
    height: 30px;
    top: 0px;
    left: 0px;
    background: linear-gradient(rgba(255, 255, 255, 1), rgba(255, 255, 255, 0));
    z-index: 1;
  }
  &::after{
    content: '';
    position: absolute;
    width: 100%;
    height: 30px;
    bottom: 0px;
    left: 0px;
    background: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 1));
    z-index: 1;
  }
  .item{
    height: 60px;
    flex: 1;
    justify-content: center;
    .trx{
      width: 250px;
      display: inline-block;
      overflow: hidden;
      word-break: normal;
      text-overflow: ellipsis;
    }
  }
}

.list .rowup{
  -webkit-animation: 10s rowup linear infinite normal;
  animation: 10s rowup linear infinite normal;
  position: relative;
}
</style>
