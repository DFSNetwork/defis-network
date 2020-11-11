<template>
  <div class="tabbarComp">
    <div class="nullDiv"></div>
    <div class="tabbar flexb">
      <div class="bar" :class="{'act': $route.name === 'index' || $route.name === 'market'}"
        @click="handleTo('index')">
        <span class="myCoin flexc">
          <img v-if="$route.name !== 'index' && $route.name !== 'market'" src="https://cdn.jsdelivr.net/gh/defis-net/material/svg/swap_un.svg">
          <img v-else src="https://cdn.jsdelivr.net/gh/defis-net/material/svg/swap_select.svg">
        </span>
        <div>{{ $t('tabbar.swap') }}</div>
      </div>
      <div class="bar" @click="handleToPro('pddex')">
        <span class="myCoin flexc">
          <img src="https://cdn.jsdelivr.net/gh/defis-net/material/svg/pddex_un.svg">
        </span>
        <div>{{ $t('tabbar.order') }}</div>
      </div>
      <div class="bar" :class="{'act': $route.name === 'myCenter'}"
        @click="handleTo('myCenter')">
        <span class="myCoin">
          <img class="myCoinImg" v-if="$route.name !== 'myCenter'" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/my.png">
          <img class="myCoinImg" v-else src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/my-checked.png">
        </span>
        <div>我的</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'tabbar',
  data() {
    return {
      showMore: false,
    }
  },
  methods: {
    handleTo(name) {
      if (name === this.$route.name) {
        return
      }
      this.$router.push({
        name
      })
    },
    handleToPro(pro) {
      if(pro === 'pddex') {
        // location.href = 'https://pddex.defis.network/'
        location.href = 'https://pddex.gitee.io/'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/*iphone Xs Max*/
@media only screen and (device-width: 414px) and (device-height: 896px) {
  .tabbar{
    padding-bottom: 30px !important;
  }
}
/*iphoneX、iphoneXs*/
@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
  .tabbar{
    padding-bottom: 30px !important;
  }
}
.tabbarComp{
  position: relative;
  .nullDiv{
    height: 100px;
    width: 100%;
    padding: 5px 0;
  }
  .tabbar{
    z-index: 1002;
    position: fixed;
    bottom: 0px;
    width: 100%;
    max-width: 750px;
    background: #FFF;
    font-size: 18px;
    padding: 5px 0;
    border-top: 1px solid #eee;
    height: 100px;
    &>div{
      flex: 1;
      text-align: center;
      img{
        display: block;
        // margin: auto;
        margin-bottom: 3px;
        height: 45px;
      }
      .sptImg{
        width: 50px;
      }
      &.act{
        color: #61c8bc;
      }
      .myCoin{
        height: 64px;
        margin-bottom: 0px;
        .myCoinImg{
          margin: auto;
          height: 64px;
        }
      }
    }
  }
}
</style>
