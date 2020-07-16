<template>
  <el-dialog
    class="dialog"
    width="320px"
    :visible.sync="showBonus">
    <div class="bonus" v-if="showBonus">
      <div class="title">{{ $t('hyk.stock') }}</div>
      <div class="list">
        <div>
          <span>{{ $t('hyk.bonusAcc') }}</span>
          <span class="num" @click="handleToBrowser">{{ baseConfig.bonusAccount }}</span>
        </div>
        <div class='bonusTotal'>
          <span>{{ $t('hyk.totalBonus') }}</span>
          <span class="num">{{ balanceEos }} EOS</span>
        </div>
        <div class="balan">
          <span></span>
          <span class="num">{{ balanceJin }} JIN</span>
        </div>
        <div class="totalValue">
          <span>{{ $t('hyk.totalVal') }}</span>
          <span class="num">{{ totalValue }} USD</span>
        </div>
        <div>
          <span>{{ $t('hyk.holdings') }}</span>
          <span class="num">{{ totalHykBonus }} HYK</span>
        </div>
        <div>
          <span>{{ $t('hyk.perBonus') }}</span>
          <span class="num green">{{ perBonus }} USD</span>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import axios from 'axios';
import { mapState } from 'vuex';
import { EosModel } from '@/utils/eos';
import { crazyCurryingHelper, toFixed, getPrice, toBrowser } from "@/utils/public";

export default {
  name: 'bonus',
  data() {
    return {
      showBonus: false,
      balanceEos: '0.0000',
      balanceJin: '0.0000',
      totalValue: '0.0000', // JIN = USD  |  EOS = USD * price
      sellHykAccBalan: '0.0000', // 限量卖HYK账户
      swapHykAccBalan: '0.0000', // swap合约内 HYK余额
      jinFundsBalan: '0.0000', // 资金账户
      totalHykBonus: '0.0000', // 参与分红的HYK数量
      supply: '0.0000', // 流通量
      perBonus: '0.0000',
      price: '0.0001',
      timer: null,
      
      // 柯里化函数变量
      valueCurrying: null, // 计算总估值的柯里化函数
      hykCurrying: null, // 计算参与分红数量的柯里化函数
      perCurrying: null, // 计算每份分红的柯里化函数
    }
  },
  computed:{
     ...mapState({
      // 箭头函数可使代码更简练
      scatter: state => state.app.scatter,
      baseConfig: state => state.sys.baseConfig, // 基础配置 - 默认为{}
    }),
  },
  watch: {
    showBonus(newVal) {
      if(!newVal) {
        return;
      }
      this.handleStartGetBalan();
      this.handleStartTotalHyk()
    }
  },
  mounted() {
    this.handleStartGetBalan();
    this.handleStartTotalHyk()
  },
  beforeDestroy() {
    clearTimeout(this.timer);
  },
  methods: {
    handleToBrowser() {
      toBrowser(this.baseConfig.bonusAccount, 'eos', 'account');
    },
    handleInitCurrying() {
      this.valueCurrying = crazyCurryingHelper(this.handleTotalValue);
      this.hykCurrying = crazyCurryingHelper(this.handleBonusCount);
      this.perCurrying = crazyCurryingHelper(this.handlePerBonus);
    },
    handleStartTotalHyk() {
      this.handleGetHykStats();
      this.handleGetBalance('HYK');
      this.handleGetBalance('HYK Swap')
      this.handleGetBalance('HYK Funds');
    },
    handleStartGetBalan() {
      clearTimeout(this.timer);
      this.handleInitCurrying();
      this.handleGetBalance();
      this.handleGetBalance('next')
      this.handleGetPrice();
      // this.timer = setTimeout(() => {
      //   this.handleGetBalance();
      //   this.handleGetBalance('next')
      //   this.handleGetPrice();
      // }, 10000);
    },
    // 获取账户余额
    async handleGetBalance(type) {
      let params = {
        code: this.baseConfig.baseCoinContract,
        coin: 'EOS',
        decimal: 4,
        account: this.baseConfig.bonusAccount,
      }
      if (type === 'next') {
        params = {
          code: this.baseConfig.toAccountJin,
          coin: 'JIN',
          decimal: 4,
          account: this.baseConfig.bonusAccount,
        }
      }
      if (type === 'HYK') {
        params = { // 限量交易的HYK余额
          code: this.baseConfig.hykContranct,
          coin: 'HYK',
          decimal: 4,
          account: this.baseConfig.toAccountByHyk,
        }
      }
      if (type === 'HYK Swap') {
        params = { // swap 合约中 HYK余额
          code: this.baseConfig.hykContranct,
          coin: 'HYK',
          decimal: 4,
          account: this.baseConfig.toAccountSwap,
        }
      }
      if (type === 'HYK Funds') {
        params = { // swap 合约中 HYK余额
          code: this.baseConfig.hykContranct,
          coin: 'HYK',
          decimal: 4,
          account: this.baseConfig.teamFunds,
        }
      }
      await EosModel.getCurrencyBalance(params, res => {
        let balance = '0.0000'
        if (!res || res.length === 0) {
          balance = '0.0000';
        } else {
          balance = res.split(' ')[0];
        }
        if (type === 'HYK') {
          this.sellHykAccBalan = balance;
          this.hykCurrying = this.hykCurrying('', balance);
          return;
        }
        if (type === 'HYK Swap') {
          this.swapHykAccBalan = balance;
          this.hykCurrying = this.hykCurrying('', '', balance);
          return;
        }
        if (type === 'HYK Funds') {
          this.jinFundsBalan = balance;
          this.hykCurrying = this.hykCurrying('', '', '', balance);
          return
        }
        if (type === 'next') {
          this.balanceJin = balance;
          this.valueCurrying = this.valueCurrying('', balance);
          return;
        }
        this.balanceEos = balance;
        this.valueCurrying = this.valueCurrying(balance);
      })
    },
    // 获取总发行量
    async handleGetHykStats() {
      const https = this.baseConfig.node.url;
      const params = {
        code: this.baseConfig.hykContranct,
        symbol: 'HYK'
      }
      const result = await axios.post(`${https}/v1/chain/get_currency_stats`, JSON.stringify(params))
      if (result.status !== 200) {
        return;
      }
      const res = result.data['HYK'];
      this.supply = res.supply.split(' ')[0];
      this.hykCurrying = this.hykCurrying(this.supply);
    },
    // 获取jiage
    handleGetPrice() {
      getPrice((price) => {
        this.price = price;
        this.valueCurrying = this.valueCurrying('', '', this.price);    
      })
    },
    // 计算参与股份
    handleBonusCount(supply, sellHykAccBalan, swapHykAccBalan, jinFundsBalan) {
      const totalHykBonus = supply - sellHykAccBalan - swapHykAccBalan - jinFundsBalan;
      this.totalHykBonus = toFixed(totalHykBonus, 4);
      this.perCurrying = this.perCurrying('', this.totalHykBonus);
    },
    // 计算分红总估值
    handleTotalValue(balanEos, balanJin, price) {
      let total = balanEos * price + balanJin * 1;
      this.totalValue = toFixed(total, 4);
      this.perCurrying = this.perCurrying(this.totalValue);
    },
    // 计算每股分红
    handlePerBonus(totalValue, totalHykBonus) {
      let perBonus = totalValue / (totalHykBonus / 10000);
      this.perBonus = toFixed(perBonus, 4);
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog{
  /deep/ .el-dialog{
    border-radius: 8px;
    .el-dialog__header{
      padding: 0;
    }
    .el-dialog__body{
      padding-bottom: 20px;
    }
  }
}
.bonus{
  .title{
    color: #070707;
    font-size: 16px;
    font-weight: 500;
  }
  .list{
    color: #070707;
    margin-top: 20px;
    font-size: 14px;
    font-weight: 500;
    &>div{
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 40px;
      &.bonusTotal{
        margin-top: 10px;
      }
      &.balan{
        margin-top: 5px;
        margin-bottom: 10px;
      }
      &.bonusTotal,
      &.balan{
        height: auto;
      }
      &.totalValue{
        padding-bottom: 15px;
        border-bottom: 1px solid #d5d5d5;
        margin-bottom: 15px;
      }
      &:last-child{
        margin-bottom: 0px;
      }
      .num{
        font-weight: 500;
        &.green{
          color: #42B48F
        }
      }
    }
  }
}
</style>
