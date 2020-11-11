<template>
  <div class="tabs tip flexb">
    <span class="" :class="{'tabAct': act === 1}" @click="handleChangeAct(1)">
      <span class="tabName flexc">{{ $t('tab.dex') }}</span>
    </span>
    <span class="" :class="{'tabAct': act === 2}" @click="handleChangeAct(2)">
      <span class="tabName flexc">{{ $t('tab.pools') }}</span>
    </span>
  </div>
</template>

<script>
export default {
  name: 'tabs',
  data() {
    return {
      act: 1,
    }
  },
  mounted() {
    const routeName = this.$route.name || 'index';
    if (routeName === 'index') {
      this.act = 1;
    } else if (routeName === 'market') {
      this.act = 2;
    } else {
      this.act = 3;
    }
  },
  methods: {
    handleChangeAct(num = 1) {
      if (this.act === num) {
        return
      }
      this.act = num;
      if (this.act === 1) {
        this.$router.push({name: 'index'})
      } else if (this.act === 2) {
        const localData = localStorage.getItem('swapMarkets') ? JSON.parse(localStorage.getItem('swapMarkets')) : null;
        let mid = 17;
        if (localData) {
          const MidsLength = localData.thisMidsPath.split('-').length;
          MidsLength === 1 ? mid = localData.thisMidsPath : null;
        }
        this.$router.push({name: 'market', params: {mid}})
      } else {
        this.$router.push({name: 'bank'})
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.tabs{
  font-size: 33px;
  height: 110px;
  &>span{
    flex: 1;
    height: 100%;
    text-align: center;
    color: #333333;
    &:first-child{
      background-image: url('https://cdn.jsdelivr.net/gh/defis-net/material/svg/swap_tab_un.svg');
      background-size: cover;
      background-repeat: no-repeat;
    }
    &:last-child{
      background-image: url('https://cdn.jsdelivr.net/gh/defis-net/material/svg/market_un.svg');
      background-size: cover;
      background-repeat: no-repeat;
    }
    .tabName{
      height: 96px;
    }
  }
  .tabAct{
    color: #29D4B0;
    font-weight: 500;
    position: relative;
    background-image: none !important;
    &::before{
      content: '';
      background-image: url('https://cdn.jsdelivr.net/gh/defis-net/material/svg/checked.svg');
      background-repeat: no-repeat;
      background-size: cover;
      position: absolute;
      width:68px;
      height:12px;
      border-radius:0px 0px 6px 6px;
      bottom: 16px;
      left: 50%;
      transform: translateX(-50%);
    }
  }
}
</style>