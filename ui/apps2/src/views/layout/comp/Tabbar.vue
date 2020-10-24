<template>
  <div class="tabbarComp">
    <div class="nullDiv"></div>
    <div class="tabbar flexb">
      <div class="bar" :class="{'act': $route.name === 'index' || $route.name === 'market'}"
        @click="handleTo('index')">
        <img v-if="$route.name !== 'index' && $route.name !== 'market'" src="@/assets/navImg/swap_un.svg">
        <img v-else src="@/assets/navImg/swap_select.svg">
        <div>闪兑</div>
      </div>
      <div class="bar" @click="handleToPro('pddex')">
        <img src="@/assets/navImg/pddex_un.svg">
        <div>挂单</div>
      </div>
      <!-- <div class="bar" @click="showMore = true;">
        <img src="@/assets/navImg/more_un.svg">
        <div>更多</div>
      </div> -->
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
        location.href = 'https://pddex.defis.network/'
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
        // width: 45px;
        display: block;
        margin: auto;
        margin-bottom: 3px;
        height: 45px;
      }
      .sptImg{
        width: 50px;
      }
      &.act{
        color: #61c8bc;
      }
    }
  }
}
</style>
