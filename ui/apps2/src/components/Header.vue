<template>
  <div class="header flexb">
    <div><img class="logo" src="@/assets/img/dex/logo.svg"></div>
    <div class="tools flexb">
      <span class="create" @click="handleToCreate">{{ $t('dex.addMarket') }}</span>
      <span class="flexc" @click="listenShowTools"><img class="svgIcon" src="@/assets/img/dex/setup_icon.svg" alt=""></span>
      <span class="flexc" @click="handleShowNav"><img class="svgIcon" src="@/assets/img/dex/menu_icon.svg" alt=""></span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'headerTools',
  methods: {
    handleShowNav() {
      this.$emit('listenShowNav', false)
    },
    listenShowTools() {
      this.$emit('listenShowTools', false)
    },
    handleToCreate() {
      this.$router.push({name: 'createMarket'})
    }
  },
}
</script>

<style lang="scss" scoped>
.header{
  background: $color-bgcolor;
  height: 120px;
  padding: 0 40px;
  font-size: 28px;
  color: $color-tip;
  .logo{
    width: 196px;
  }
  img{
    display: block;
  }
  .tools{
    span{
      margin-left: 20px;
      height: 80px;
      min-width: 80px;
      background: $color-bgcolor;
      border-radius: 30px;
      box-shadow: 0px 20px 40px 0px rgba(220,220,220,0.5);
    }
    .create{
      box-sizing: border-box;
      padding: 24px;
    }
    .svgIcon{
      width: 30px;
    }
  }
}
</style>