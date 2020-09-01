<template>
  <div v-loading="loading">
    <div class="banner">
      <img class="bgImg" src="@/assets/img/poolspage/top_bg.svg" alt="">
      <div class="bannerTitle">DFS Saving System</div>
      <div class="bannerSubTitle">HOLD DFS Get More DFS</div>
      <div class="flexb floatDiv">
        <div class="left">
          <div>{{ lockDfs }}</div>
          <div class="tip flexb bonus">
            <span>{{ $t('mine.lockFunds') }} (DFS)</span>
          </div>
        </div>
        <div class="right">
          <div>{{ perDayReward }}</div>
          <div class="tip bonus">
            <span>{{ $t('mine.wRewaed', {coin: 'DFS'}) }} (DFS)</span>
          </div>
        </div>
      </div>
    </div>
    <div class="miningInfo flexb" v-loading="loading">
      <div class="miningData">
        <div class="tip">{{ $t('dsr.ableInve') }}</div>
        <div class="num">{{ ableUse }} DFS</div>
      </div>
      <div class="miningData">
        <div class="tip">{{ $t('dsr.claimPerDay') }}</div>
        <div class="num">{{ ableClaimNum }} DFS</div>
      </div>
    </div>
  </div>
</template>

<script>
// import axios from 'axios';
import { EosModel } from '@/utils/eos';
import { mapState } from 'vuex';
import { toFixed, accMul, accDiv } from '@/utils/public';

export default {
  data() {
    return {
      lockDfs: '0.0000',
      ableUse: '0.0000',
      ableClaimNum: '0.0000',
      timer: null,
      lockLoading: true,
      stockLoading: true,
      claimLoading: true,
    }
  },
  props: {
  },
  computed: {
    ...mapState({
      // 箭头函数可使代码更简练
      baseConfig: state => state.sys.baseConfig, // 基础配置 - 默认为{}
    }),
    perDayReward() {
      let wDfs = accMul(10000, 0.05);
      wDfs = accDiv(wDfs, 365);
      return toFixed(wDfs, 4)
    },
    loading() {
      return this.lockLoading && this.stockLoading && this.claimLoading;
    }
  },
  watch: {
  },
  mounted() {
    this.handleTimer()
  },
  beforeDestroy() {
    clearInterval(this.getTimer)
    clearInterval(this.runTimer)
  },
  methods: {
    handleTimer() {
      this.handleGetDfsBalance('lock')
      this.handleGetDfsBalance('stock')
      this.handleGetDfsBalance('claim')
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.handleTimer()
      }, 10000)
    },
    // 获取DFS锁定量
    handleGetDfsBalance(type) {
      const params = {
        code: 'minedfstoken',
        coin: 'DFS',
        decimal: 4,
      };
      if (type === 'lock') {
        params.account = 'dfsdsrsystem';
      }
      if (type === 'stock') {
        params.account = 'dfsavingpool';
      }
      if (type === 'claim') {
        params.account = 'dfsdsrbuffer';
      }
      EosModel.getCurrencyBalance(params, res => {
        let balance = toFixed('0.000000001', params.decimal);
        (!res || res.length === 0) ? balance : balance = res.split(' ')[0];
        if (type === 'lock') {
          this.lockLoading = false;
          this.lockDfs = balance;
        }
        if (type === 'stock') {
          this.stockLoading = false;
          this.ableUse = balance;
        }
        if (type === 'claim') {
          this.claimLoading = false;
          this.ableClaimNum = balance;
        }
      })
    },
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
