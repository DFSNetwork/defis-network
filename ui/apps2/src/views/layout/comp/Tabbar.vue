<template>
  <div class="tabbarComp">
    <div class="nullDiv"></div>
    <div class="tabbar flexb">
      <div class="bar" :class="{'act': $route.name === 'home'}"
        @click="handleTo('home')">
        <span class="myCoin flexc">
          <img v-if="$route.name !== 'home'" src="https://cdn.jsdelivr.net/gh/defis-net/material2/dfs/home2-un.png?v=1">
          <img v-else src="https://cdn.jsdelivr.net/gh/defis-net/material2/dfs/home2.png">
        </span>
        <div>{{ $t('home.home') }}</div>
      </div>
      <div class="bar" :class="{'act': $route.name === 'pddex'}"
        @click="handleTo('pddex')">
        <span class="myCoin flexc">
          <img v-if="$route.name !== 'pddex'" src="https://cdn.jsdelivr.net/gh/defis-net/material2/dfs/market3-un.png">
          <img v-else src="https://cdn.jsdelivr.net/gh/defis-net/material2/dfs/market3.png">
        </span>
        <div>{{ $t('tabbar.order') }}</div>
      </div>
      <div class="bar" :class="{'act': $route.name === 'index' || $route.name === 'market'}"
        @click="handleTo('index')">
        <span class="myCoin flexc">
          <img v-if="$route.name !== 'index' && $route.name !== 'market'" src="https://cdn.jsdelivr.net/gh/defis-net/material2/dfs/swap2-un.png">
          <img v-else src="https://cdn.jsdelivr.net/gh/defis-net/material2/dfs/swap2.png?v=1">
        </span>
        <div>{{ $t('tabbar.trade') }}</div>
      </div>
      <div class="bar" :class="{'act': $route.name === 'fundation'}"
        @click="handleTo('fundation')">
        <span class="myCoin flexc">
          <img class="myCoinImg" v-if="$route.name !== 'fundation'" src="https://cdn.jsdelivr.net/gh/defis-net/material2/dfs/fun2-un.png">
          <img class="myCoinImg" v-else src="https://cdn.jsdelivr.net/gh/defis-net/material2/dfs/fun2.png">
        </span>
        <div>{{ $t('home.community') }}</div>
      </div>
      <!-- <div class="bar" :class="{'act': $route.name === 'financial'}"
        @click="handleTo('financial')">
        <span class="myCoin flexc">
          <img class="myCoinImg" v-if="$route.name !== 'financial'" src="https://cdn.jsdelivr.net/gh/defis-net/material/tabbar/money-un.png">
          <img class="myCoinImg" v-else src="https://cdn.jsdelivr.net/gh/defis-net/material/tabbar/money.png">
        </span>
        <div>{{ $t('financial.tab') }}</div>
      </div> -->
      <div class="bar" :class="{'act': $route.name === 'myCenter'}"
        @click="handleTo('myCenter')">
        <span class="myCoin flexc">
          <img class="myCoinImg" v-if="$route.name !== 'myCenter'" src="https://cdn.jsdelivr.net/gh/defis-net/material2/dfs/my2-un.png">
          <img class="myCoinImg" v-else src="https://cdn.jsdelivr.net/gh/defis-net/material2/dfs/my2.png">
        </span>
        <div>{{ $t('tab.my') }}</div>
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
    color: #999;
    font-weight: 500;
    &>div{
      flex: 1;
      text-align: center;
      img{
        display: block;
        // margin: auto;
        margin-bottom: 3px;
        height: 64px;
      }
      .sptImg{
        width: 64px;
      }
      &.act{
        color: #61c8bc;
      }
      .myCoin{
        height: 64px;
        margin-bottom: 0px;
        // .myCoinImg{
        //   margin: auto;
        //   height: 64px;
        // }
      }
    }
  }
}
</style>
