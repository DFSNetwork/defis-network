<template>
  <div class="nodePools">
    <div class="banner">
      <img class="bannerImg" src="@/assets/navImg/dssBanner.png" alt="">
    </div>
    <div class="dataInfo">
      <div class="flexb floatDiv">
        <div class="left">
          <div class="dinBold">{{ totalVote }}</div>
          <div class="tip bonus">
            <span>总票数（EOS）</span>
          </div>
        </div>
        <div class="right">
          <div class="dinBold">{{ yearApr }}%</div>
          <div class="tip bonus">
            <span>{{ $t('dsr.nowApy') }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 票数管理 -->
    <VoteNum />
    <!-- 待领取收益 -->
    <MyClaim />
    <!-- 矿池列表 -->
    <PoolsLists />
  </div>
</template>

<script>
import PoolsLists from './comp/PoolsLists';
import VoteNum from './comp/VoteNum';
import MyClaim from './comp/Claim';

export default {
  name: 'nodePools',
  components: {
    PoolsLists,
    VoteNum,
    MyClaim,
  },
  data() {
    return {
      totalVote: '100000',
      showReWardTip: false,
      claim: false,
    }
  },
  computed: {
    yearApr() {
      return '18.00'
    }
  },
  methods: {
    handleClaimAll() {
    }
  }
}
</script>

<style lang="scss" scoped>
.banner{
  position: relative;
  color: #FFF;
  text-align: left;
  overflow: hidden;
  .bannerImg{
    display: block;
    height: 334px;
    width: 100%;
  }
}
.dataInfo{
  box-shadow: 0px 4px 8px 4px rgba(227,227,227,0.5);
  border-radius: 20px 20px 0px 0px;
  padding: 28px 28px;
  margin: -70px 32px 20px;
  background: #FFF;
  position: relative;
  color: #333;
  .dinBold{
    font-size: 33px !important;
    margin-bottom: 9px;
  }
  .floatDiv{
    z-index: 1;
    position: relative;
    text-align: left;
    font-size: 32px;
    color: #333;
    &>div{
      flex: 1;
      background: #FFF;
      // padding: 40px 20px;
      border-radius: 20px;
      text-align: left;
      &:first-child{
        margin-right: 30px;
      }
    }
    .bonus{
      font-size: 26px;
      margin-top: 10px;
    }
  }
}
</style>
