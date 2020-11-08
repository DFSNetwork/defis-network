<template>
  <div class="detail">
    <div class="title">
      <span class="act">EOS矿池</span>
    </div>
    <div class="list" >
      <div class="poolInfo flexa">
        <img src="https://apps.defis.network/static/coin/minedfstoken-dfs.png" class="coinImg">
        <div class="bal">
          <div class="flexb">
            <span>{{ $t('nodePools.poolsReward', {token: 'EOS'}) }}</span>
            <span class="apy">{{ $t('nodePools.apyShort') }}：{{ '0.00' }}%</span>
          </div>
          <div class="num din">{{ '0.00000000' }}</div>
        </div>
      </div>
      <div class="reward">{{ $t('nodePools.poolsBal') }}：{{ `0.0000 ` }}</div>
    </div>

    <div class="title">
      <span class="act">矿工列表</span>
    </div>
    <div class="lists">
      <template v-for="(item, index) in lists">
        <div class="mineList" :class="{'page1': page === 1}" :key="index">
          <div class="flexb mb10">
            <span>{{ testtesttest }}</span>
            <span>{{ $t('mine.earnings') }}：{{ '0.00000000' }} DFS</span>
          </div>
          <div class="flexb">
            <span>{{ $t('dex.pools') }}</span>
            <span>{{ '0.0000' }} EOS</span>
          </div>
          <label class="rankImg" v-if="page === 1 && index < 3"><img :src="`https://apps.defis.network/static/rank/rank${index + 1}.png`" alt=""></label>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'mineLists',
  data() {
    return {
      lists: [{}],
      type: 'rex', // rex ｜ lp
      sym: 'eosio.token-eos', // 合约-Token ｜ mid
    }
  },
  mounted() {
    this.type = this.$route.params.type;
    this.sym = this.$route.params.sym;
  },
  computed: {
    ...mapState({
      scatter: state => state.app.scatter,
      baseConfig: state => state.sys.baseConfig,
    })
  }
}
</script>

<style lang="scss" scoped>
.detail{
  padding: 0 26px;
  font-size: 27px;
}
.title{
  font-size: 32px;
  text-align: left;
  margin: 0 0 20px;
  .act{
    color: #333;
    position: relative;
    padding-left: 28px;
    &::before{
      content: '';
      position: absolute;
      width: 8px;
      height: 30px;
      background:rgba(2,198,152,1);
      border-radius:4px;
      top: 50%;
      left: 0;
      transform: translateY(-45%);
    }
  }
}
.list{
  font-size: 27px;
  position: relative;
  z-index: 1;
  background: #FFF;
  border: 1px solid #eee;
  padding: 20px 26px;
  border-radius: 12px;
  text-align: left;
  margin-bottom: 20px;
  .poolInfo{
    margin-bottom: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
    .bal{
      flex: 1;
    }
    .coinImg{
      width: 100px;
      height: 100px;
      border-radius: 50%;
      margin-right: 10px;
    }
    .num{
      font-size: 50px;
    }
    .buffImg{
      width: 25px;
    }
    .apy{
      color: #333;
    }
  }
}

.mineList{
  margin-top: 25px;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  // padding: 20px;
  position: relative;
  &.page1{
    &:nth-child(2) {
      border: 1px solid rgb(238, 198, 4);
      box-shadow: 0 0 5px 0px rgba(238, 198, 4, .5);
    }
    &:nth-child(3) {
      border: 1px solid #b1dcff;
      box-shadow: 0 0 5px 0px rgba(#b1dcff, .5);
    }
    &:nth-child(4) {
      border: 1px solid #8C7853;
      box-shadow: 0 0 5px 0px rgba(#8C7853, .5);
    }
    .rankImg{
      position: absolute;
      top: -0px;
      left: -0px;
      width: 72px;
      transform: translate(-47%, -47%) rotate(-45deg);
      img{
        width: 100%;
      }
    }
  }
  &>div{
    padding: 20px;
    position: relative;
    z-index: 1;
    background: #FFF;
    border-radius: 30px;

    &:nth-child(1) {
      padding-bottom: 0;;
    }
    &:nth-child(2) {
      padding-top: 0;;
    }
  }
  .mb10{
    margin-bottom: 10px;
  }
}
</style>
