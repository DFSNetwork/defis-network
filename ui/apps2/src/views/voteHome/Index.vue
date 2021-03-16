<template>
  <div class="voteLayout">
    <div class="layout">
      <div class="tabs tip flexc">
        <span class="flexc" :class="{'act': act === 0}" @click="handleCheckAct(0)">{{ $t('tab.poolVote') }}</span>
        <span class="flexc" :class="{'act': act === 1}" @click="handleCheckAct(1)">{{ $t('tab.otherVote') }}</span>
      </div>
      <div class="subTabs flexa dinReg" v-if="act === 0">
        <span :class="{'subAct': subAct === 0}" @click="handleTo('vote')">{{ $t('sys.coinPool', {coin: 'DFS'}) }}</span>
        <span :class="{'subAct': subAct === 1}" @click="handleTo('voteForTag')">{{ $t('sys.coinPool', {coin: 'TAG'}) }}</span>
        <span :class="{'subAct': subAct === 2}" @click="handleToProject('usdx')">{{ $t('sys.coinPool', {coin: 'USDX'}) }}</span>
      </div>
      <div class="subTabs flexa dinReg" v-else>
        <span :class="{'subAct': subAct === 0}" @click="handleTo('nodeVote')">{{ $t('sys.nodePool') }}</span>
        <span :class="{'subAct': subAct === 1}" @click="handleTo('sysParams')">{{ $t('sys.paramsVote') }}</span>
        <span :class="{'subAct': subAct === 2}" @click="handleToProject('dcap')">{{ $t('sys.traderVote') }}</span>
      </div>
    </div>
    <transition name="fade" mode="out-in">
      <router-view class="spt_mt"/>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'voteHome',
  data() {
    return {
      act: 0, // 0 - 矿池 ｜ 1 - 其他
      subAct: 0,
    }
  },
  watch: {
    '$route': {
      handler: function rt(newVal) {
        if (newVal.name === 'vote') {
          this.subAct = 0;
          this.act = 0;
        } else if (newVal.name === 'voteForTag') {
          this.subAct = 1;
          this.act = 0;
        } else if (newVal.name === 'nodeVote') {
          this.subAct = 0;
          this.act = 1;
        } else if (newVal.name === 'sysParams') {
          this.subAct = 1;
          this.act = 1;
        }
        this.$forceUpdate()
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    handleTo(name) {
      this.$router.replace({
        name
      })
    },
    handleCheckAct(index) {
      if (index === this.act) {
        return
      }
      this.act = index;
      if (index === 0 ) {
        this.handleTo('vote')
        return
      }
      this.handleTo('nodeVote')
    },
    handleToProject(name) {
      if (name === 'usdx') {
        location.href = 'https://usdx.gitee.io/govern/usdc'
        return
      }
      if (name === 'dcap') {
        location.href = 'https://dtoken.gitee.io/govern/traders'
        // return
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.layout{
  height: 324px;
  background: $color-main;
  color: #fff;
  font-size: 28px;
  padding: 48px 30px;
  box-sizing: border-box;
  .tabs{
    height: 100px;
    background: #FFF;
    border-radius: 8px;
    padding: 8px;
    box-sizing: border-box;
    // margin-bottom: 42px;
    &>span{
      flex: 1;
      height: 100%;
      border-radius: 4px;
      font-size: 32px;
    }
    .act{
      background: $color-main;
      color: #FFF;
    }
  }
  .subTabs{
    text-align: left;
    height: 136px;
    &>span{
      margin-right: 30px;
      position: relative;
      color: rgba(#FFF, .8);
    }
    .subAct{
      color: #FFF;
      &::after{
        content: '';
        border: 3px solid #FFF;
        background: #FFF;
        width: 40px;
        position: absolute;
        bottom: -15px;
        left: 50%;
        transform: translateX(-50%);
        border-radius: 4px;
      }
    }
  }
  .spt_mt{
    margin-top: -40px;
  }
}
</style>
