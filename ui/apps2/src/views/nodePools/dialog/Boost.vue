<template>
  <div class="diaBoost">
    <img class="close" @click="handleClose()" src="https://cdn.jsdelivr.net/gh/defis-net/material/svg/sd_icon_btn.svg">
    <div class="imgDiv flexc">
      <img class="logo" :src="boostData.imgUrl" :onerror="errorCoinImg">
    </div>
    <div class="coinName">{{ boostData.sym }}</div>
    <div class="content">
      <div class="flexc bal dinBold">
        <span>池子余额：</span>
        <span>{{ boostData.poolbal.split(' ')[0] }}</span>
      </div>
      <div class="liqTip flexc" v-if="parseFloat(boostData.eosbal) < 100">底池数量不足100EOS</div>
    </div>
    <div class="btnDiv flexb">
      <div class="btn flexc" @click="handleTo('market')">
        <img src="https://cdn.jsdelivr.net/gh/defis-net/material/svg/market.svg" alt="">
        <span>去做市</span>
      </div>
      <div class="btn flexc red" @click="handleTo('fundation')">
        <img src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/newlike1.png" alt="">
        <span>去乐捐</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'diaBoost',
  data() {
    return {
      errorCoinImg: 'this.src="https://ndi.340wan.com/eos/eosio.token-eos.png"',
    }
  },
  props: {
    boostData: {
      type: Object,
      default: function bd() {
        return {}
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('handleClose', false)
    },
    handleTo(name) {
      this.$emit('handleClose', name)
      // this.$router.push({
      //   name,
      //   params: {
      //     mid: this.boostData.mid
      //   }
      // })
    }
  }
}
</script>

<style lang="scss" scoped>
.diaBoost{
  padding: 28px 28px 0;
  box-sizing: border-box;
  color: #333;
  font-size: 28px;
  background: #fff;
  position: relative;
  border-radius: 20px;
  width: 570px;
  .close{
    position: absolute;
    top: 40px;
    right: 40px;
    width: 24px;
  }
  .imgDiv{
    width: 180px;
    height: 180px;
    margin: auto;
    position: relative;
    background: #FFF;
    border-radius: 90px;
    margin-top: -90px;
    // top: -150px;;
  }
  .logo{
    width: 120px;
    height: 120px;
  }
  .coinName{
    font-size: 48px;
    font-weight: 500;
  }
  .content{
    margin: 28px 0;
    // padding-left: 80px;
    text-align: center;
    line-height: 44px;
    .bal{
      font-size: 32px;
    }
    .liqTip{
      margin-top: 24px;
      font-size: 24px;
      color: #FE3B37;
    }
  }
  .btnDiv{
    border-top: 1px solid rgba(220, 220, 220, .3);
    .btn{
      height: 104px;
      flex: 1;
      color: #29D4B0;
      &:last-child{
        border-left: 1px solid rgba(220, 220, 220, .3);
      }
      img{
        width: 36px;
        margin-right: 18px;
      }
      &.red{
        color: #FE3B37;
      }
    }
  }
}
</style>
