<template>
  <div class="bank">
    <div class="tabView">
      <div class="tabC">
        <tabs />
        <div class="sym0Data pdb10 mrb20" :class="{'focus': payIptFocus}">
          <div class="info flexb">
            <span class="ableGet" @click="handleClickBalan('pay')">{{ $t('public.balance') }}: {{ balanceSym0 }} {{ thisMarket0.symbol }}</span>
            <span class="type">{{ $t('bank.stake') }}</span>
          </div>
          <div class="iptDiv flexb">
            <div class="coinInfo flex" @click="listenShowDrawer('bankStart')">
              <div class="coinImg"><img width="100%" :src="thisMarket0.imgUrl" :onerror="errorCoinImg" alt=""></div>
              <div>
                <div class="coin">{{ thisMarket0.symbol }} <i class="el-icon-arrow-down"></i></div>
                <div class="contract tip">{{ thisMarket0.contract }}</div>
              </div>
            </div>
            <div class="inputDiv">
              <el-input class="elIpt" type="number" v-model="payNum" placeholder="0.0"
                @input="handleGetNum()"
                @focus="handleFocus('pay')"
                @blur="handleBlur('pay')"></el-input>
            </div>
          </div>
        </div>
        <div class="sym0Data pdb10" :class="{'focus': getIptFocus}">
          <div class="info flexb">
            <span class="ableGet" @click="handleClickBalan('get')">{{ $t('public.balance') }}: {{ balanceSym1 }} {{ thisMarket1.symbol }}</span>
            <span class="type">{{ $t('bank.borrow') }}</span>
          </div>
          <div class="iptDiv flexb">
            <div class="coinInfo flex" @click="listenShowDrawer('bankEnd')">
              <div class="coinImg"><img width="100%" :src="thisMarket1.imgUrl" :onerror="errorCoinImg" alt=""></div>
              <div>
                <div class="coin">{{ thisMarket1.symbol }} <i class="el-icon-arrow-down"></i></div>
                <div class="contract tip">{{ thisMarket1.contract }}</div>
              </div>
            </div>
            <div class="inputDiv">
              <el-input class="elIpt" type="number" v-model="getNum" placeholder="0.0"
                @input="handleGetTransNum()"
                @focus="handleFocus('get')"
                @blur="handleBlur('get')"></el-input>
            </div>
          </div>
        </div>

        <div class="rate flexb">
          <span class="tip">{{ $t('public.fee') }}</span>
          <span>{{ fees }}%</span>
        </div>
        <div class="rate flexb" v-if="thisMarket1.symbol === 'USDD' && thisMarket1.contract === 'bankofusddv1'">
          <span class="tip">{{ $t('mine.mineBonus') }}</span>
          <span>{{ reward }} DFS</span>
        </div>
        <div class="rate flexb" v-if="false">
          <span class="tip">生成比率</span>
          <span class="flex">
            <span v-if="!exRate">1{{ thisMarket1.symbol }} = {{ tradeInfo.aboutPrice || '-' }}{{ thisMarket0.symbol }}</span>
            <span v-else>1{{ thisMarket0.symbol }} = {{ tradeInfo.aboutPriceSym0 || '-' }}{{ thisMarket1.symbol }}</span>
            <span @click="exRate =!exRate">
              <img class="iconImg" v-if="!exRate" src="https://cdn.jsdelivr.net/gh/defis-net/material2/icon/price_switch_icon_btn_left.svg" alt="">
              <img class="iconImg" v-else src="https://cdn.jsdelivr.net/gh/defis-net/material2/icon/price_switch_icon_btn_right.svg" alt="">
            </span>
          </span>
        </div>
      </div>
    </div>

    <div class="btnDiv">
      <div class="btn flexc" v-loading="loading" @click="handleTransfer">{{ $t('bank.borrow') }}</div>
    </div>

    <order-list ref="orderList"/>

    <!-- 弹窗组件 -->
    <!-- <el-dialog
      class="mkListDia pcList"
      :show-close="false"
      :visible.sync="showMarketList">
      <market-list :marketLists="bankList" :type="type"
        @listenMarketChange="handleMarketChange"
        @listenClose="handleClose"/>
    </el-dialog> -->
    <van-popup
      class="newMarket"
      v-model="showMarketList"
      position="left">
      <MarketArea v-if="showMarketList"
        :marketLists="bankList" :type="type"
        @listenMarketChange="handleMarketChange"
        @listenClose="handleClose"/>
    </van-popup>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { EosModel } from '@/utils/eos';
import { toFixed, getPrice, accMul, accDiv } from '@/utils/public';
import MarketArea from '@/components/MarketArea';
import Tabs from '../index/components/Tabs';
import OrderList from './components/OrderList';
export default {
  components: {
    Tabs,
    OrderList,
    MarketArea
  },
  data() {
    return {
      discount: 0.2, // 配置项 - 后期从合约拿
      errorCoinImg: 'this.src="https://ndi.340wan.com/eos/eosio.token-eos.png"',
      payNum: '',
      getNum: '',
      payIptFocus: false,
      getIptFocus: false,
      balanceSym0: '0.0000',
      balanceSym1: '0.0000',
      toAccountUsdtBalan: '0.0000',
      type: 'bankStart',
      thisMarket0: {
        symbol: 'USDT',
        contract: 'tethertether',
        imgUrl: 'https://ndi.340wan.com/eos/tethertether-usdt.png',
        decimal: 4
      },
      thisMarket1: {
        symbol: 'USDD',
        contract: 'bankofusddv1',
        imgUrl: '/static/coin/bankofusddv1-usdd.svg',
        decimal: 4,
      },
      exRate: false,
      tradeInfo: {},
      priceTimer: null,
      price: 2.7,
      fees: 0.3,
      showMarketList: false,
      loading: false,
      bankList: [
        // {
        //   symbol: 'EOS',
        //   contract: 'eosio.token',
        //   imgUrl: '/static/coin/eosio.token-eos.svg',
        //   decimal: 4
        // },
        {
          symbol: 'USDD',
          contract: 'bankofusddv1',
          imgUrl: 'https://apps.defis.network/static/coin/bankofusddv1-usdd.svg',
          decimal: 4
        },
        {
          symbol: 'USDT',
          contract: 'tethertether',
          imgUrl: 'https://ndi.340wan.com/eos/tethertether-usdt.png',
          decimal: 4
        },
      ]
    }
  },
  computed:{
     ...mapState({
      // 箭头函数可使代码更简练
      scatter: state => state.app.scatter,
      baseConfig: state => state.sys.baseConfig, // 基础配置 - 默认为{}
      dfsPrice: state => state.sys.dfsPrice,
      damping: state => state.sys.damping,
    }),
    reward() {
      if (this.thisMarket1.symbol !== 'USDD' || this.thisMarket1.contract !== 'bankofusddv1') {
        return '0'
      }
      let amount = accMul(this.getNum, 3);
      amount = accDiv(amount, 1000);
      amount = accDiv(amount, this.price);
      // console.log(amount, this.dfsPrice , this.discount , this.damping)
      let reward = amount / this.dfsPrice * this.discount * this.damping;
      reward = accMul(reward, 0.8)
      return toFixed(reward, 4)
    }
  },
  watch: {
    payNum(newVal, oldVal) {
      if (Number(newVal) < 0) {
        this.payNum = oldVal;
      }
    },
  },
  mounted() {
    this.handleGetPrice()
    this.handleBalanTimer();
    clearInterval(this.priceTimer)
    this.priceTimer = setInterval(() => {
      this.handleGetPrice()
    }, 60000)
  },
  beforeDestroy() {
    clearInterval(this.priceTimer)
    clearInterval(this.timer);
  },
  methods: {
    handleDealMine() {
      if (this.thisMarket0.symbol !== 'EOS' || this.thisMarket0.contract !== 'eosio.token') {
        return '0'
      }
      let amount = accMul(this.payNum, 3);
      amount = accDiv(this.payNum, 1000);
      amount = accDiv(this.payNum, this.price);
      let reward = amount / this.dfsPrice * this.discount * this.damping;
      reward = accMul(reward, 0.8)
      return toFixed(reward, 4)
    },
    handleClose() {
      this.showMarketList = false;
    },
    listenShowDrawer(type) {
      this.type = type;
      this.showMarketList = true;
    },
    handleFocus(type = 'pay') {
      type === 'pay' ? this.payIptFocus = true : this.getIptFocus = true
      const num = type === 'pay' ? Number(this.payNum) : Number(this.getNum);
      if (!num) {
        type === 'pay' ? this.payNum = '' : this.getNum = '';
        return
      }
      type === 'pay' ? this.payNum = Number(this.payNum) : this.getNum = Number(this.getNum);
    },
    handleBlur(type = 'pay') {
      type === 'pay' ? this.payIptFocus = false : this.getIptFocus = false
      if (type === 'pay' && this.payNum === '') {
        return
      }
      if (type !== 'pay' && this.getNum === '') {
        return
      }
      type === 'pay' ? this.payNum = toFixed(Number(this.payNum), this.thisMarket0.decimal)
                     : this.getNum = toFixed(Number(this.getNum), this.thisMarket1.decimal);
    },
    // 获取60秒均价
    handleGetPrice() {
      getPrice((price) => {
        this.price = price;
      })
    },
    // 铸币验证
    handleRegMint() {
      if (!Number(this.payNum)) {
        return false
      }
      if (Number(this.payNum) < 1) {
        this.$message({
          type: 'error',
          message: this.$t('bank.mininum')
        })
        return false
      }
      if (Number(this.payNum) > Number(this.balanceEos)) {
        this.$message({
          type: 'error',
          message: this.$t('public.balanLow')
        })
        return false;
      }
      if (this.thisMarket1.contract === 'tethertether' && this.thisMarket1.symbol === 'USDT') {
        if (Number(this.payNum) > Number(this.toAccountUsdtBalan)) {
          this.$message({
            type: 'error',
            message: this.$t('bank.usdtLower')
          })
          return false;
        }
      }
      return true;
    },
    // 铸币
    handleTransfer() {
      if (this.loading) {
        return
      }
      if (!this.handleRegMint()) {
        return
      }
      this.loading = true;
      const memo = this.thisMarket0.symbol === 'USDD' ? 'burn' : 'mint';
      const params = {
        code: this.thisMarket0.contract,
        toAccount: this.baseConfig.toAccountJin,
        memo,
        quantity: `${this.payNum} ${this.thisMarket0.symbol}`
      }
      EosModel.transfer(params, (res) => {
        this.loading = false;
        if(res.code && JSON.stringify(res.code) !== '{}') {
          this.$message({
            message: res.message,
            type: 'error'
          });
          return
        }
        setTimeout(() => {
          this.handleBalanTimer();
        }, 1000);
        this.$message({
          message: this.$t('public.success'),
          type: 'success'
        });
      })
    },
    // 计算生成总额度 - 固定300%质押率
    handleGetNum() {
      if (this.thisMarket0.symbol === 'EOS') {
        const allPrice = this.price * this.payNum * (1 - this.fees / 100)
        const getNum = allPrice / 3;
        this.getNum = this.dealIpt0(getNum, this.thisMarket1.decimal);
        return
      }
      if (this.thisMarket0.symbol === 'USDT') {
        const getNum = this.payNum;
        this.getNum = this.dealIpt0(getNum, this.thisMarket1.decimal);
        return
      }
      if (this.thisMarket0.symbol === 'USDD') {
        const getNum = this.payNum * (1 - this.fees / 100)
        this.getNum = this.dealIpt0(getNum, this.thisMarket1.decimal);
      }
    },
    dealIpt0(n, l) {
      if (Number(n)) {
        return toFixed(n, l)
      }
      return ''
    },
    // 计算转账数量
    handleGetTransNum() {
      if (this.thisMarket0.symbol === 'EOS') {
        const allPrice = this.getNum * 3;
        let payNum = allPrice / this.price;
        payNum = payNum / (1 - this.fees / 100);
        this.payNum = this.dealIpt0(payNum, this.thisMarket0.decimal);
        return
      }
      if (this.thisMarket0.symbol === 'USDT') {
        this.payNum = this.dealIpt0(this.getNum, this.thisMarket0.decimal);
        return
      }
      if (this.thisMarket0.symbol === 'USDD') {
        const payNum = this.getNum / (1 - this.fees / 100);
        this.payNum = this.dealIpt0(payNum, this.thisMarket0.decimal);
      }
    },
    handleMarketChange(item, type) {
      this.handleClose()
      this.getNum = '';
      this.payNum = '';
      if (type === 'bankStart') {
        this.thisMarket0 = item;
        if (item.symbol === 'EOS') {
          this.thisMarket1 = this.bankList.find(v => v.symbol === 'USDD')
          this.fees = 0.3;
        } else if (item.symbol === 'USDD') {
          this.thisMarket1 = this.bankList.find(v => v.symbol === 'USDT')
          this.fees = 0.3;
        } else if (item.symbol === 'USDT') {
          this.thisMarket1 = this.bankList.find(v => v.symbol === 'USDD')
          this.fees = 0;
        }
        this.handleBalanTimer();
        return
      }
      this.thisMarket1 = item;
      if (item.symbol === 'USDT') {
        this.thisMarket0 = this.bankList.find(v => v.symbol === 'USDD')
        this.fees = 0.3;
      } else if (item.symbol === 'USDD') {
        this.thisMarket0 = this.bankList.find(v => v.symbol === 'USDT')
        this.fees = 0;
      }
      this.handleBalanTimer();
    },
    // 重启余额定时器
    handleBalanTimer() {
      clearInterval(this.timer);
      this.handleGetBalance();
      this.handleGetBalance('next');
      this.handleGetBalance('usdt');
      this.timer = setInterval(() => {
        this.handleGetBalance();
        this.handleGetBalance('next');
        this.handleGetBalance('usdt');
      }, 20000)
    },
    // 获取账户余额
    async handleGetBalance(next) {
      const params = {
        code: this.thisMarket0.contract,
        coin: this.thisMarket0.symbol,
        decimal: this.thisMarket0.decimal
      };
      if (next === 'next') {
        params.code = this.thisMarket1.contract;
        params.coin = this.thisMarket1.symbol;
        params.decimal = this.thisMarket1.decimal;
      }
      if (next === 'usdt') {
        params.code = 'tethertether';
        params.coin = 'USDT';
        params.decimal = 4;
        params.account = this.baseConfig.toAccountJin;
      }
      await EosModel.getCurrencyBalance(params, res => {
        let balance = toFixed('0.0000000000001', params.decimal);
        (!res || res.length === 0) ? balance : balance = res.split(' ')[0];
        if (next === 'next') {
          this.balanceSym1 = balance;
          return;
        }
        if (next === 'usdt') {
          this.toAccountUsdtBalan = balance;
          return;
        }
        this.balanceSym0 = balance;
      })
    },
    handleGetOrder() {
      this.$refs.orderList.handleRowsMint()
    },
    handleClickBalan(type) {
      if (type === 'pay') {
        this.payNum = this.balanceSym0;
        this.handleGetNum()
        return
      }
      this.getNum = this.balanceSym1;
      this.handleGetTransNum()
    }
  },
}
</script>

<style lang="scss" scoped>
.bank{
  padding: 0 40px;
}
.tabView{
  background: #FAFAFA;
  border-radius:30px;
  font-size: 24px;;
  .tabC{
    background:rgba(255,255,255,1);
    border-radius:30px;
    border:2px solid rgba(224,224,224,1);
    padding: 32px 20px;
  }
  .sym0Data{
    padding: 26px 40px 52px;
    border-radius:30px;
    border: 1px solid #F3F3F3;
    &.focus{
      border:1px solid rgba(7,215,155,1);
    }
    &.pdb10{
      padding-bottom: 28px;
    }
    &.mrb20{
      margin-bottom: 20px;
    }
    .info{
      font-size: 24px;
      margin-bottom: 24px;
      .type{
        font-size: 28px;
      }
    }
    .iptDiv{
      .coinInfo{
        text-align: left;
        flex: 1;
        .coinImg{
          width: 60px;
          height: 60px;
          margin-right: 10px;
        }
        .coin{
          font-size: 28px;
          font-weight: 500;;
          line-height: 30px;
        }
        .contract{
          line-height: 30px;
        }
        .ableGet{
          color: #2F3F52;
        }
      }
      .inputDiv{
        flex: 2;;
        .elIpt{
          /deep/ .el-input__inner{
            color: $color-black;
            border: 0px;text-align: right;
            font-size: 52px;
            padding: 0 0 0 20px;
            height: 62px;
          }
        }
      }
    }
  }
  .rate{
    color: $color-black;
    padding: 0 20px;
    margin-top: 28px;
    font-size: 28px;
    .iconImg{
      width: 36px;
      margin-left: 12px;
    }
  }
}
.btnDiv{
  margin: 40px 0;
  .btn{
    font-size: 32px;
    color: #FFF;
    height:88px;
    background:rgba(7,215,155,1);
    border-radius:30px;
    &:active{
      background:rgba(2,198,152,1);
    }
  }
}
.mkListDia{
  // animation: none;
  /deep/ .el-dialog{
    position: absolute;
    bottom: 0px;
    margin: 0px;
    width: 100%;
    border-radius:30px 30px 0px 0px;
    .el-dialog__body,
    .el-dialog__header{
      padding: 0;
    }
  }
  &.pcList{
    /deep/ .el-dialog{
      position: relative;
      margin: auto;
      width: 670px;
      border-radius:30px;
    }
  }
}
</style>
