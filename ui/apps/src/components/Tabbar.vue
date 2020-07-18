<template>
  <div class="tabbar">
    <div  @click="handleTo(1)">
      <div>
        <img v-if="checked !== 1" src="@/assets/img/dex.png" alt="">
        <img v-else src="@/assets/img/dex1.png" alt="">
      </div>
      <div :class="{'green': checked === 1}">{{ $t('tab.dex') }}</div>
    </div>
    <div  @click="handleTo(2)">
      <div>
        <img v-if="checked !== 2" src="@/assets/img/swap.png" alt="">
        <img v-else src="@/assets/img/swap1.png" alt="">
      </div>
      <div :class="{'green': checked === 2}">{{ $t('tab.pools') }}</div>
    </div>
    <div @click="handleTo(0)">
      <div>
        <img v-if="checked !== 0" src="@/assets/img/bank.png" alt="">
        <img v-else src="@/assets/img/bank1.png" alt="">
      </div>
      <div :class="{'green': checked === 0}">{{ $t('tab.bank') }}</div>
    </div>
    <div  @click="handleTo(3)" v-if="false">
      <div>
        <img v-if="checked !== 3" src="@/assets/img/hyk.png" alt="">
        <img v-else src="@/assets/img/hyk1.png" alt="">
      </div>
      <div :class="{'green': checked === 3}">{{ $t('tab.hyk') }}</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      checked: 1,
      routName: [
        'bank',
        'dex',
        'pools',
        'hyk'
      ]
    }
  },
  watch: {
    '$route': {
      handler: function r() {
        const index = this.routName.findIndex(v => v === this.$route.name)
        this.checked = index
      },
      deep: true,
      immediate: true,
    }
  },
  methods: {
    handleTo(index) {
      if (index === this.checked) {
        return;
      }
      this.checked = index;
      this.$router.push({
        name: this.routName[index],
      })
    }
  },
}
</script>

<style lang="scss" scoped>
/*iphone Xs Max*/
@media only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio:3){
  .tabbar{
    padding-bottom: 30px;
  }
}
/*iphoneX、iphoneXs*/
@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
  .tabbar{
    padding-bottom: 30px;
  }
}
.tabbar{
  display: flex;
  align-content: center;
  justify-content: space-between;
  box-shadow: 0 0 5px 3px #f0f0f0;
  font-size: 12px;
  font-weight: 500;
  &>div{
    flex: 1;
    img{
      display: block;
      width: 30px;
      margin: auto;
    }
    .green{
      color: #42B48F;
    }
  }
}
</style>
