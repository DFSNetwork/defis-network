<template>
  <div class="order">
    <div class="item">
      <div class="num flex">
        <span>1.0000 EOS</span>
        <img class="iconImg" src="https://cdn.jsdelivr.net/gh/defis-net/material/dex/price_switch_icon_green_left.svg" alt="">
        <span>1.0000 EOS</span>
      </div>
      <div class="flexb">
        <span class="user flex">
          <img class="iconImg" src="https://cdn.jsdelivr.net/gh/defis-net/material/dex/user_icon.svg" alt="">
          <span>shenz****zhen</span>
        </span>
        <span class="tip">2020-07-23 15:45:47</span>
      </div>
    </div>

    <div class="item">
      <div class="num flex">
        <span>1.0000 EOS</span>
        <img class="iconImg" src="https://cdn.jsdelivr.net/gh/defis-net/material/dex/price_switch_icon_green_left.svg" alt="">
        <span>1.0000 EOS</span>
      </div>
      <div class="flexb">
        <span class="user flex">
          <img class="iconImg" src="https://cdn.jsdelivr.net/gh/defis-net/material/dex/user_icon.svg" alt="">
          <span>shenz****zhen</span>
        </span>
        <span class="tip">2020-07-23 15:45:47</span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    
  }
</script>

<style lang="scss" scoped>
.order{
  font-size: 24px;
  margin: 40px;
  color: $color-black;
  .item{
    padding: 32px 28px;
    margin-top: 40px;
    background:rgba(255,255,255,1);
    border-radius:20px;
    border:2px solid rgba(224,224,224,1);
    .num{
      font-size: 32px;
      margin-bottom: 20px;
      .iconImg{
        width: 36px;
        margin: 0 16px;;
      }
    }
    .user{
      font-size: 28px;
      .iconImg{
        width: 26px;
        margin-right: 20px;
      }
    }
  }
}
</style>
