<template>
  <div class="tabs tip flexb">
    <span :class="{'tabAct': act === 1}" @click="handleChangeAct(1)">{{ $t('tab.dex') }}</span>
    <span :class="{'tabAct': act === 2}" @click="handleChangeAct(2)">{{ $t('tab.pools') }}</span>
    <!-- <span :class="{'tabAct': act === 3}" @click="handleChangeAct(3)">{{ $t('tab.bank') }}</span> -->
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
  font-size: 36px;
  margin: 0 60px 30px;
  &>span{
    flex: 1;
    text-align: center;
  }
  .tabAct{
    color: $color-black;
    font-weight: 500;
    position: relative;
    &::before{
      content: '';
      position: absolute;
      width:72px;
      height:12px;
      background:rgba(7,215,155,1);
      border-radius:0px 0px 6px 6px;
      top: -32px;
      left: 50%;
      transform: translateX(-45%);
    }
  }
}
</style>