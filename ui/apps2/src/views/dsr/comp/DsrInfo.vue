<template>
  <div>
    <div class="banner">
      <img class="bgImg" src="@/assets/img/poolspage/top_bg.svg" alt="">
      <div class="bannerTitle">DFS DSR</div>
      <div class="bannerSubTitle">No Founder. No Investor. No Pre-mine.</div>
      <div class="flexb floatDiv">
        <div class="left">
          <div>{{ lockDfs }}</div>
          <div class="tip flexb bonus">
            <span>{{ $t('mine.lockFunds') }} (DFS)</span>
          </div>
        </div>
        <div class="right">
          <div>{{ maxPerDayReward }}</div>
          <div class="tip bonus">
            <span>{{ $t('mine.wRewaed') }} (DFS)</span>
          </div>
        </div>
      </div>
    </div>
    <div class="miningInfo flexb" v-loading="loading">
      <div class="miningData">
        <div class="tip">可用库存</div>
        <div class="num">{{ ableUse }} DFS</div>
      </div>
      <div class="miningData">
        <div class="tip">每天可领取</div>
        <div class="num">{{ ableClaimNum }} DFS</div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { mapState } from 'vuex';
import { toFixed, accSub, accAdd } from '@/utils/public';

export default {
  data() {
    return {
      lockDfs: '0.0000',
      maxPerDayReward: '0.0000',
      ableUse: '0.0000',
      ableClaimNum: '0.0000',

      runTimer: null, // 数据滚动定时器
      getTimer: null, // axios定时器
      current: '0.0000',
      showCurrent: '0.0000',
      loading: false,
    }
  },
  props: {
  },
  computed: {
    ...mapState({
      // 箭头函数可使代码更简练
      baseConfig: state => state.sys.baseConfig, // 基础配置 - 默认为{}
    }),
  },
  watch: {
  },
  mounted() {
  },
  beforeDestroy() {
    clearInterval(this.getTimer)
    clearInterval(this.runTimer)
  },
  methods: {
    // 获取DFS流通量 - 全局区一次
    async handleGetDfsCurrent() {
      const https = this.baseConfig.node.url;
      const params = {
        code: 'minedfstoken',
        symbol: 'DFS'
      }
      const result = await axios.post(`${https}/v1/chain/get_currency_stats`, JSON.stringify(params))
      this.loading = false;
      if (result.status !== 200) {
        return;
      }
      const res = result.data['DFS'];
      const supply = res.supply.split(' ')[0];

      this.current = supply;
      this.handleRun(this.current)
    },
    handleRun(current) {
      clearInterval(this.runTimer)
      if (!Number(this.showCurrent)) {
        this.showCurrent = current;
      }
      let tShowCurrent = this.showCurrent;
      let t = accSub(current, tShowCurrent) / 100;
      if (t < 0) {
        return
      }
      this.runTimer = setInterval(() => {
        tShowCurrent = accAdd(tShowCurrent, t);
        if (tShowCurrent > current) {
          clearInterval(this.runTimer)
          return
        }
        this.showCurrent = toFixed(tShowCurrent, 4);
      }, 50)
    }
  },
}
</script>

<style lang="scss" scoped>
.banner{
  position: relative;
  background: #07D79B;
  padding: 80px 40px 30px;
  color: #FFF;
  text-align: center;
  overflow: hidden;
  .bgImg{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 0;
  }
  .bannerTitle{
    position: relative;
    font-size: 36px;
    font-weight: 500;
    z-index: 1;
  }
  .bannerSubTitle{
    position: relative;
    z-index: 1;
    margin-top: 15px;
    margin-bottom: 30px;
    font-size: 30px;
    font-weight: 300;
  }
  .floatDiv{
    margin-top: 60px;
    z-index: 1;
    position: relative;
    text-align: left;
    font-size: 32px;
    color: #000;
    &>div{
      flex: 1;
      background: #FFF;
      padding: 40px 20px;
      border-radius: 20px;
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
.miningInfo{
  background: #FFF;
  padding: 40px;
  font-size: 28px;
  text-align: left;
  &>div{
    flex: 1;
    &:first-child{
      margin-right: 30px;
    }
    .num{
      font-size: 32px;
      margin-top: 10px;
    }
  }
}
</style>
