<template>
  <div class="layout" :class="{'mobile': $store.state.app.minScreen}">
    <transition name="fade" mode="out-in">
      <router-view class="content"/>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'layout',
  components: {
  },
  data() {
    return {
    }
  },
  computed:{
  },
  mounted() {
  },
  beforeDestroy() {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
/*iphone Xs Max*/
@media only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio:3){
  .layout{
    min-height: calc(100vh - 80px) !important;
  }
}
/*iphoneX、iphoneXs*/
@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
  .layout{
    min-height: calc(100vh - 80px) !important;
  }
}
.layout{
  width: 100%;
  min-width: 1200px;
  margin: auto;
  position: relative;
  box-sizing: border-box;
  &.mobile{
    min-width: 375px;
  }
}
</style>