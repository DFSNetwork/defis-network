<template>
  <div class="swapTrade">
    <div class="navTitle">
      <span class="title">{{ $t('tab.dex') }}</span>
      <span @click="handleToCreateMarket">{{ $t('dex.addMarket') }}></span>
    </div>
    <div class="trade" v-if="index === 1">
      <market-lists-com ref="marketListsCom" :marketLists="marketLists" :thisMarket0="thisMarket0" :thisMarket1="thisMarket1"
        @listenMarketChange="handleSelectThis" />
      <el-form ref="formBorrow" class="formDiv">
        <!-- 抵押数量 -->
        <el-form-item style="margin-bottom: 0">
          <div class="label">{{ $t('dex.pay') }}</div>
          <el-input v-model="payNum" type="number"
                    placeholder="0.0"
                    @input="handleInBy('pay')"
                    @focus="handleFocus('pay')"
                    @blur="handleBlur('pay')">
            <span v-if="!direction" slot="suffix" @click="handleShowMarList('start')" class="coinSpan">
              <span>{{ thisMarket0.symbol }}</span>
              <span class="iconfont icon-huaban29 select"></span>
            </span>
            <span v-else slot="suffix" @click="handleShowMarList('start')" class="coinSpan">{{ thisMarket1.symbol }}
              <span class="iconfont icon-huaban29 select"></span>
            </span>
          </el-input>
        </el-form-item>
        <el-divider>
          <span class="aniDiv" @click="handleExchange">
            <!-- <span class="iconfont icon-huaban29 topIcon" :class="{'changing': ani}"></span>
            <span class="iconfont icon-huaban29 bottomIcon" :class="{'changing': ani}"></span> -->
            <img class="topIcon" :class="{'changing': ani}" src="@/assets/img/top.png" alt="">
            <img class="bottomIcon" :class="{'changing': ani}" src="@/assets/img/bottom.png" alt="">
          </span>
          <!-- <img class="change" @click="handleExchange" :class="{'changing': ani}" src="@/assets/img/change.png" alt=""> -->
        </el-divider>
        <!-- 生成总额 -->
        <el-form-item>
          <div class="label">{{ $t('dex.obtain') }}</div>
          <el-input v-model="getNum" type="number"
                    placeholder="0.0"
                    @input="handleInBy('get')"
                    @focus="handleFocus('get')"
                    @blur="handleBlur('get')">
            <span v-if="!direction" slot="suffix" @click="handleShowMarList('end')" class="coinSpan">{{ thisMarket1.symbol }}
              <span class="iconfont icon-huaban29 select"></span>
            </span>
            <span v-else slot="suffix" @click="handleShowMarList('end')" class="coinSpan">{{ thisMarket0.symbol }}
              <span class="iconfont icon-huaban29 select"></span>
            </span>
          </el-input>
        </el-form-item>
      </el-form>

      <div class="infoDetail">
        <div class="tradeRate">
          <span>{{ $t('dex.rate') }}</span>
          <span v-if="direction">1 {{ thisMarket0.symbol }} = {{ tradeInfo.aboutPrice }} {{ thisMarket1.symbol }}</span>
          <span v-else>1 {{ thisMarket1.symbol }} = {{ tradeInfo.aboutPrice }} {{ thisMarket0.symbol }}</span>
        </div>
        <div class="slipPointDiv" v-if="showDetail">
          <div class="tradeRateTitle">
            <span>{{ $t('dex.slipPoint') }}</span>
            <span class="iconfont icon-huaban tip" @click="handleShowSlipTip"></span>
          </div>
          <div class="slipPoint">
            <span :class="{'checked': !isUserSet && slipPointUser === '1'}" @click="handleChangeSlip('1')">1%</span>
            <span :class="{'checked': !isUserSet && slipPointUser === '5'}" @click="handleChangeSlip('5')">5%</span>
            <span :class="{'checked': !isUserSet && slipPointUser === '10'}" @click="handleChangeSlip('10')">10%</span>
          </div>
          <div class="slipIpt">
            <el-input class="sIpt" v-model="isUserSetSlip" type="number"
              :placeholder="$t('public.useDefined')"
              :class="{'checked': isUserSet}"
              @focus="isUserSet = true"
              @blur="handleSlipIptBlur"
              @input="handleUserSetSlip">
              <span slot="suffix" class="slipIptPer">%</span>
            </el-input>
          </div>
        </div>
        <div class="more" @click="showDetail = !showDetail">
          <span class="iconfont icon-huaban29 moreIcon"
                :class="{'closeMore': showDetail}"></span>
        </div>
      </div>

      <!-- 余额 -->
      <div class="balance">
        <span>{{ $t('public.fee') }}：0.3%</span>
        <span v-if="!direction" @click="handleClickBalan">{{ $t('public.balance') }}：{{balanceSym0}} {{ thisMarket0.symbol }}</span>
        <span v-else @click="handleClickBalan">{{ $t('public.balance') }}：{{balanceSym1}} {{ thisMarket1.symbol }}</span>
      </div>

      <el-button class="btn" type="primary" :class="{'unabled': !Number(payNum)}"
        v-if="scatter.identity" plain @click="handleSwapTrade">{{ $t('dex.swapNow') }}</el-button>
      <el-button class="btn" type="primary" v-else @click="handleLogin">{{ $t('public.loginPls') }}</el-button>
    </div>

    <div v-else>
      <create-dex @listenLogin="handleLogin"
        @listenGetMarketsList="handleRowsMarket"
        :scatter="scatter" />
    </div>

    <slip-tip ref="slipTip"/>
  </div>
</template>

<script>
import { mapState } from 'vuex'
// import { dealTrade } from '@/utils/logic';
import { toFixed, accMul } from '@/utils/public';
import { EosModel } from '@/utils/eos';
import { SwapRouter } from '@/utils/swap_router';
import MarketListsCom from '@/views/index/components/MarketListsCom';
import SlipTip from '@/views/dex/components/SlipTip';

export default {
  name: 'trade',
  components: {
    MarketListsCom,
    SlipTip
  },
  data() {
    return {
      index: 1,
      payNum: '',
      getNum: '',
      direction: false,
      drawer: false,
      thisMarket0: {
        mid: 1,
        last_update: "2020-05-14T06:49:27",
        liquidity_token: 2509980,
        price_cumulative_last: "10524156827",
        price_last: "2.52539999999999987",
        contract: "eosio.token",
        decimal: "4",
        reserve: "157.9329 EOS",
        sym: "4,EOS",
        symbol: "EOS",
      }, // 当前选中的做市池子
      thisMarket1: {
        mid: 7,
        last_update: "2020-05-14T06:49:27",
        liquidity_token: 2509980,
        price_cumulative_last: 1513579653,
        price_last: "0.39589999999999997",
        contract: "bankofusddv1",
        decimal: "4",
        reserve: "398.7956 USDD",
        sym: "4,USDD",
        symbol: "USDD",
      },
      balanceSym0: '0.0000',
      balanceSym1: '0.0000',
      timer: null,
      tradeInfo: {}, // 交易详情
      slipPointUser: '1', // 默认 5%
      isUserSetSlip: '', // 用户自定义滑点保护
      showDetail: true,
      isUserSet: false,
      ani: false,
      aniTimer: null,
      swapRouterInit: false,
      coinList: [],
    }
  },
  props: {
    marketLists: {
      type: Array,
      default: function lists() {
        return []
      }
    }
  },
  watch: {
    marketLists: {
      handler: function marketList(newVal) {
        if (!newVal.length) {
          return
        }
        SwapRouter.init(newVal)
        const arr = this.handleDealSymArr(newVal)
        this.coinList = arr;
        if (!arr.length) {
          return;
        }
        const market0 = arr.find(v => v.contract === this.thisMarket0.contract && v.symbol === this.thisMarket0.symbol) || arr[0]
        this.thisMarket0 = market0;
        const market1 = arr.find(v => v.contract === this.thisMarket1.contract && v.symbol === this.thisMarket1.symbol) || arr[1]
        this.thisMarket1 = market1;
        this.handleInBy(this.tradeInfo.type, 'first')
      },
      immediate: true,
      deep: true
    },
    scatter: {
      handler: function listen(newVal) {
        if (newVal.identity) {
          this.handleBalanTimer();
        }
      },
      deep: true,
      immediate: true,
    },
    thisMarket0: {
      handler: function market0() {
        this.handleBalanTimer();
        this.handleInBy(this.tradeInfo.type, 'first')
      },
      deep: true
    },
    thisMarket1() {
      this.handleBalanTimer();
      this.handleInBy(this.tradeInfo.type, 'first')
    },
    // payNum(val) {
    //   if (val === toFixed(0, this.thisMarket0.decimal)) {
    //     this.payNum = '';
    //   }
    // },
    // getNum(val) {
    //   if (val === toFixed(0, this.thisMarket1.decimal)) {
    //     this.getNum = '';
    //   }
    // }
  },
  computed:{
    ...mapState({
      // 箭头函数可使代码更简练
      scatter: state => state.app.scatter,
      baseConfig: state => state.sys.baseConfig, // 基础配置 - 默认为{}
    })
  },
  mounted() {
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    // 处理所有币种
    handleDealSymArr(lists = []) {
      const resArr = [];
      lists.forEach((v) => {
        resArr.push(v.sym0Data, v.sym1Data)
      })
      // 删除重复项
      const newArr = resArr.filter((item, index, self) => {
        const i = self.findIndex(v => v.contract === item.contract && v.symbol === item.symbol);
        return self.indexOf(item) === i;
      })
      return newArr
    },
    // 点击余额
    handleClickBalan() {
      this.payNum = !this.direction ? this.balanceSym0 : this.balanceSym1;
      this.handleInBy('pay')
    },
    // 弹出提示
    handleShowSlipTip() {
      this.$refs.slipTip.showTip = true;
    },
    // 创建市场
    handleToCreateMarket() {
      this.$router.push({
        name: 'createMarket',
      })
    },
    // 显示筛选列表
    handleShowMarList(type) {
      this.$refs.marketListsCom.handleShowDrawer(type);
    },
    // 滑点保护设置
    minOutCoin(index) {
      const dir = this.direction;
      const type = this.tradeInfo.type === 'pay';
      if (index === 0) {
        const coin0 = (!dir && type) || (dir && !type) ? this.thisMarket0.symbol : this.thisMarket1.symbol;
        return coin0
      }
      const coin1 = (!dir && !type) || (dir && type) ? this.thisMarket0.symbol : this.thisMarket1.symbol;
      return coin1
    },
    // 滑点框失去焦点
    handleSlipIptBlur() {
      if (!Number(this.isUserSetSlip)) {
        this.isUserSet = false;
        this.slipPointUser = '5';
      }
    },
    // 设置滑点
    handleUserSetSlip(rate) {
      if (Number(rate) < 0) {
        this.slipPointUser = Math.abs(rate);
        this.isUserSetSlip = Math.abs(rate);
        return
      }
      this.isUserSet = true;
      this.isUserSetSlip = rate;
      this.slipPointUser = rate;
      this.handleInBy(this.tradeInfo.type)
    },
    // 切花滑点保护比例
    handleChangeSlip(rate) {
      if (Number(rate) < 0) {
        return
      }
      this.isUserSet = false;
      this.slipPointUser = rate;
      this.handleInBy(this.tradeInfo.type)
    },
    handleToFixed(n, l) {
      if (!isNaN(n)) {
        return toFixed(Number(n), l || 4)
      }
      return ''
    },
    handleRowsMarket() {
      this.$emit('listenGetMarketsList', true)
    },
    // 重启余额定时器
    handleBalanTimer() {
      clearInterval(this.timer);
      this.handleGetBalance();
      this.handleGetBalance('next');
      this.timer = setInterval(() => {
        this.handleGetBalance();
        this.handleGetBalance('next');
      }, 20000)
    },
    // 获取账户余额
    async handleGetBalance(next) {
      const params = {
        code: this.thisMarket0.contract,
        coin: this.thisMarket0.symbol,
        decimal: this.thisMarket0.decimal
      };
      if (next) {
        params.code = this.thisMarket1.contract;
        params.coin = this.thisMarket1.symbol;
        params.decimal = this.thisMarket1.decimal;
      }
      await EosModel.getCurrencyBalance(params, res => {
        let balance = toFixed('0.000000001', params.decimal);
        (!res || res.length === 0) ? balance : balance = res.split(' ')[0];
        if (next) {
          this.balanceSym1 = balance;
          return;
        }
        this.balanceSym0 = balance;
      })
    },
    handleShowDrawer() {
      this.drawer = true;
    },
    // 选择当前市场
    handleSelectThis(item, type) {
      if (type === 'start') {
        this.thisMarket0 = item;
      } else {
        this.thisMarket1 = item;
      }
      this.payNum = '';
      this.getNum = '';
      this.drawer = false;
    },
    handleLogin() {
      this.$emit('listenLogin', true)
    },
    handleInBy(type = 'pay', status) {
      const inData = {
        direction: this.direction,
        poolSym0: this.thisMarket0.reserve.split(' ')[0],
        poolSym1: this.thisMarket1.reserve.split(' ')[0],
        poolToken: this.thisMarket0.liquidity_token,
        type,
        slipPointUser: this.slipPointUser / 100, // 滑点保护
      }
      if (type === 'pay') {
        inData.payNum = this.payNum || `${toFixed(1, this.thisMarket0.decimal)}`;
      } else {
        inData.getNum = this.getNum || `${toFixed(1, this.thisMarket1.decimal)}`;
      }
      // console.log(inData)
      // const outData = dealTrade(inData);
      try {
        const outData = this.handleDealAmountOut(inData);
        // console.log(outData)
        // in & out 都是0，非焦点ipt置空
        if (!Number(outData.payNum) && !Number(outData.getNum)) {
          if (type === 'pay') {
            this.getNum = '';
          } else {
            this.payNum = '';
          }
          return;
        }
        this.tradeInfo = outData;
        // 第一次计算价格
        if (status === 'first') {
          return;
        }
        // 支付框输入为空 || 获取框输入为空，两个输入框直接清空
        if ((type === 'pay' && this.payNum === '') || (type !== 'pay' && this.getNum === '')) {
          this.payNum = '';
          this.getNum = '';
          return;
        }
        type === 'pay' ? this.getNum = toFixed(outData.getNum, this.thisMarket1.decimal) :
                                      this.payNum = toFixed(outData.payNum, this.thisMarket0.decimal);
      } catch (error) {
        // console.log(error)
        this.tradeInfo = {}
        this.tradeInfo.aboutPrice = toFixed(0, this.thisMarket0.decimal)
        // console.log(error)
      }
    },
    // 计算得到多少 - 正序 - 输入支付
    handleDealAmountOut(inData) {
      // 没有输入支付数量 & 得到数量时 - 返回默认配置
      if (!Number(inData.payNum) && !Number(inData.getNum)) {
        const outData = {
          type: inData.type,
        }
        return outData
      }
      const m0 = this.thisMarket0
      const m1 = this.thisMarket1
      const params0 = `${m0.contract}:${m0.symbol}`
      const params1 = `${m1.contract}:${m1.symbol}`
      const path = SwapRouter.get_paths(params0, params1)
      const params = [
        path,
        params0,
      ]
      if (inData.type === 'pay') {
        params.push(accMul(inData.payNum, 10 ** this.thisMarket0.decimal))
      } else {
        params.push(accMul(inData.getNum, 10 ** this.thisMarket1.decimal))
        params.push(inData.type)
      }
      const res = SwapRouter.get_amounts_out(...params)
      // console.log(res)

      const payNum = inData.type === 'pay' ? inData.payNum : res.quantity_out.split(' ')[0];
      const getNum = inData.type === 'pay' ? res.quantity_out.split(' ')[0] : inData.getNum;
      let minOut = 0;
      // if (inData.type === 'pay') {
      //   minOut = getNum * (1 - inData.slipPointUser);
      // } else {
      //   minOut = payNum * (1 + Number(inData.slipPointUser));
      // }
      minOut = res.price * (1 - inData.slipPointUser) * payNum;

      let aboutPrice = payNum / getNum;
          aboutPrice = toFixed(aboutPrice, this.thisMarket0.decimal)
      // console.log(inData)
      const obj = {
        payNum,
        getNum,
        aboutPrice,
        type: inData.type,
        minOut,
        price: res.price
      }
      // console.log(obj)
      return obj
    },
    handleExchange() {
      // this.direction = !this.direction;
      const t = this.thisMarket0;
      this.thisMarket0 = this.thisMarket1;
      this.thisMarket1 = t;
      this.payNum = '';
      this.getNum = '';
      this.tradeInfo = {};
      this.ani = true;
      clearTimeout(this.aniTimer)
      this.aniTimer = setTimeout(() => {
        this.ani = false;
      }, 300);
    },
    handleFocus(type = 'pay') {
      const num = type === 'pay' ? Number(this.payNum) : Number(this.getNum);
      if (!num) {
        type === 'pay' ? this.payNum = '' : this.getNum = '';
        return
      }
      type === 'pay' ? this.payNum = Number(this.payNum) : this.getNum = Number(this.getNum);
    },
    handleBlur(type = 'pay') {
      if (type === 'pay' && this.payNum === '') {
        return
      }
      if (type !== 'pay' && this.getNum === '') {
        return
      }
      type === 'pay' ? this.payNum = toFixed(Number(this.payNum), this.thisMarket0.decimal)
                     : this.getNum = toFixed(Number(this.getNum), this.thisMarket1.decimal);
    },
    handleReg() {
      if (!Number(this.payNum)) {
        return false;
      }
      const balance = !this.direction ? Number(this.balanceSym0) : Number(this.balanceSym1);
      if (Number(this.payNum) > balance) {
        this.$message({
          type: 'error',
          message: this.$t('public.balanLow')
        })
        return false;
      }
      return true
    },
    // swap交易
    handleSwapTrade() {
      if (!this.handleReg()) {
        return
      }
      const m0 = this.thisMarket0
      const m1 = this.thisMarket1
      const params0 = `${m0.contract}:${m0.symbol}`
      const params1 = `${m1.contract}:${m1.symbol}`
      const path = SwapRouter.get_paths(params0, params1)

      const tradeCoin = this.direction ? this.thisMarket1.symbol : this.thisMarket0.symbol;
      const minOutDecimal = this.direction ? this.thisMarket1.decimal : this.thisMarket0.decimal;
      const params = {
        code: this.direction ? this.thisMarket1.contract : this.thisMarket0.contract,
        toAccount: this.baseConfig.toAccountSwap,
        memo: `swap:${path}:${accMul(toFixed(this.tradeInfo.minOut, minOutDecimal), (10 ** minOutDecimal))}`,
        quantity: `${this.payNum} ${tradeCoin}`
      }
      // console.log(params)
      EosModel.transfer(params, (res) => {
        if(res.code && JSON.stringify(res.code) !== '{}') {
          this.$message({
            message: res.message,
            type: 'error'
          });
          return
        }
        this.handleBalanTimer();
        this.$message({
          message: this.$t('public.success'),
          type: 'success'
        });
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.swapTrade{
  padding: 20px 18px;
  .navTitle{
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    color: #C1C1C1;
    margin-bottom: 20px;
    .title{
      font-size: 28px;
      color: #070707;
      font-weight: 500;
    }
    .github{
      font-size: 14px;
      color: #C1C1C1;
      text-decoration: none;
    }
  }
  .formDiv{
    background: #F5F5F5;
    border-radius: 8px;
    padding: 5px 20px;
    margin-bottom: 12px;
    .label{
      font-size: 14px;
      text-align: left;
      font-weight: 500;
    }
    .coinSpan{
      display: flex;
      .select{
        margin-left: 5px;
        font-size: 12px;
        display: flex;
        transform: rotate(90deg);
      }
    }
    /deep/ .el-form-item{
      margin-bottom: 5px;
      &:last-child{
        margin-bottom: 0px;
      }
    }

    /deep/ .el-input{
      background-color: transparent;
      .el-input__inner{
        color: #070707;
        font-weight: 500;
        background-color: transparent;
        font-size: 24px;
        padding-left: 0px;
        outline: none;
        border: 1px solid transparent;
        &:focus{
          border-color: transparent;
        }
      }
      .el-input__suffix{
        color: #070707;
        font-weight: 500;
        font-size: 20px;
      }
    }
    /deep/ .el-divider--horizontal{
      margin: 10px 0;
      .el-divider__text{
        background: #F5F5F5;
      }
    }
    .aniDiv{
      width: 22px;
      height: 19px;;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      transition: .3s all;
      transform: scale(1);
      margin: 0 20px;
    }
    .topIcon{
      display: block;
      width: 100%;
      transition: .3s all;
      transform: translate(0);
      &.changing{
        transform: translate(0, -3px);
      }
    }
    .bottomIcon{
      display: block;
      width: 100%;
      transition: .3s all;
      transform: translate(0);
      &.changing{
        transform: translate(0, 3px);
      }
    }
    .change{
      width: 20px;
      transition: .3s all;
      transform: scale(1);
      &.changing{
        transform: scale(1.2)
      }
    }
  }
  .infoDetail{
    background: #f5f5f5;
    border-radius: 8px;
    padding: 15px 20px 8px;
    .tradeRate{
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      &>span:last-child{
        font-weight: 500;
      }
    }
    .more{
      height: 20px;
      position: relative;
      .moreIcon{
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%) rotate(90deg);
        &.closeMore{
          transform: translate(-50%, -50%) rotate(-90deg);
        }
      }
    }
    .slipPointDiv{
      margin-top: 10px;
      .tradeRateTitle{
        display: flex;
        align-items: center;
        font-size: 14px;
        margin-bottom: 10px;
        .tip{
          font-size: 16px;
          margin-left: 5px;
        }
      }
      .slipPoint{
        display: flex;
        align-items: center;
        justify-content: space-between;
        &>span{
          font-size: 14px;
          border: 1px solid #DADADA;
          border-radius: 13px;
          width: 80px;
          height: 26px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 500;

          &.checked{
            background: #FFF;
            border: 1px solid #42B48F;
            border-radius: 13px;
            color: #42B48F;
          }
        }
      }
      .slipIpt{
        margin-top: 10px;
        display: flex;
        align-items: center;
        .checked{
          /deep/ .el-input__inner{
            background: #FFF !important;
            border: 1px solid #42B48F;
            border-radius: 13px;
            color: #42B48F;
          }
        }
        /deep/ .el-input{
          width: 148px;
          .el-input__inner{
            height: 28px;;
            border-radius: 30px;
            font-size: 12px;
            line-height: 28px;
            background: transparent;
            &:focus{
              color: #42B48F;
              border: 1px solid #42B48F;
              background: #FFF;
            }
          }
          .el-input__suffix{
            padding-right: 8px;
            display: flex;
            align-items: center;
          }
        }
      }
    }
  }
  .balance{
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    margin: 10px 0 20px;
  }
  .btn{
    width: 100%;
    background: #42B48F;
    color: #fff;
    border-color: transparent;
    &.unabled{
      background: rgba(#42B48F, .5);
    }
  }
}
</style>
