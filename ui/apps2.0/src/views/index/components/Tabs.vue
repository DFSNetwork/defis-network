<template>
  <div class="tabs tip flexb">
    <span :class="{'tabAct': act === 1}" @click="handleChangeAct(1)">兑换</span>
    <span :class="{'tabAct': act === 2}" @click="handleChangeAct(2)">做市</span>
    <span :class="{'tabAct': act === 3}" @click="handleChangeAct(3)">金库</span>
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
  },
  methods: {
    handleChangeAct(num = 1) {
      this.act = num
    }
  },
}
</script>

<style lang="scss" scoped>
.tabs{
  font-size: 36px;
  margin: 0 60px 30px;
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