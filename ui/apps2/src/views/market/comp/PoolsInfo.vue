<template>
  <div>
    <div class="banner">
      <img class="bgImg" src="https://cdn.jsdelivr.net/gh/defis-net/material/banner/top_bg.svg" alt="">
      <div class="bannerTitle">DFS Mining</div>
      <div class="bannerSubTitle">No Founder. No Investor. No Pre-mine.</div>
      <div class="flexb floatDiv">
        <div class="left">
          <div>{{ lockEos }}</div>
          <div class="tip flexb bonus">
            <span>{{ $t('mine.lockFunds') }} (EOS)</span>
          </div>
        </div>
        <div class="right">
          <div>{{ maxPerDayReward }}</div>
          <div class="tip bonus">
            <span>{{ $t('mine.wRewaed', {coin: 'EOS'}) }} (DFS)</span>
          </div>
        </div>
      </div>
    </div>
    <div class="miningInfo flexb" v-loading="loading">
      <div class="miningData">
        <div class="tip">{{ $t('mine.nextLess') }}</div>
        <div class="num">{{ nextLess }} DFS</div>
      </div>
      <div class="miningData">
        <div class="tip">{{ $t('mine.current') }}</div>
        <div class="num">{{ showCurrent }} DFS</div>
      </div>
    </div>
  </div>
</template>

<script>
import { EosModel } from '@/utils/eos';
import { mapState } from 'vuex';
import { toFixed, accSub, accAdd, accMul } from '@/utils/public';
import { perDayRewardV3 } from '@/utils/logic'

export default {
  data() {
    return {
      runTimer: null, // 数据滚动定时器
      getTimer: null, // axios定时器
      current: '0.0000',
      showCurrent: '0.0000',
      loading: true,
      lockEos: '0.0000'
    }
  },
  props: {
    lists: {
      type: Array,
      default: function ls() {
        return []
      }
    },
  },
  computed: {
    ...mapState({
      // 箭头函数可使代码更简练
      baseConfig: state => state.sys.baseConfig, // 基础配置 - 默认为{}
    }),
    maxPerDayReward() {
      if (!this.lists.length) {
        return '0.0000'
      }
      const max = perDayRewardV3(this.lists[0].mid)
      return max
    },
    nextLess() {
      let n = Number(this.showCurrent) % 1000000;
      n = accSub(1000000, n)
      return toFixed(n, 4)
    }
  },
  watch: {
    lists: {
      handler: function lis() {
        // console.log(this.lists)
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.handleGetDfsCurrent();
    this.handleGetBalance()
    clearInterval(this.getTimer)
    this.getTimer = setInterval(() => {
      this.handleGetDfsCurrent();
      this.handleGetBalance()
    }, 5000);
  },
  beforeDestroy() {
    clearInterval(this.getTimer)
    clearInterval(this.runTimer)
  },
  methods: {
    // 获取账户余额
    async handleGetBalance() {
      const params = {
        code: 'eosio.token',
        coin: 'EOS',
        decimal: 4,
        account: 'defisswapcnt'
      };
      await EosModel.getCurrencyBalance(params, res => {
        let balance = toFixed('0.0000000000001', params.decimal);
        (!res || res.length === 0) ? balance : balance = res.split(' ')[0];
        this.lockEos = accMul(balance, 2).toFixed(4);
      })
    },
    // 获取DFS流通量 - 全局区一次
    async handleGetDfsCurrent() {
      const params = {
        code: 'minedfstoken',
        symbol: 'DFS'
      }
      const {status, result} = await this.$api.get_currency_stats(params);
      this.loading = false;
      if (!status) {
        return;
      }
      const res = result['DFS'];
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
  padding: 30px 40px 30px;
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
    margin-top: 30px;
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
