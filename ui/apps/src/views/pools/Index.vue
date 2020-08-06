<template>
  <div class="pools">
    <div class="navTitle">
      <span class="title">{{ $t('tab.pools') }}</span>
    </div>
    <div class="mainDiv">
      <div class="topDiv">
        <div class="title">
          <span :class="{'checkedIn': index === 1}" @click="index = 1">{{ $t('pools.deposit') }}</span>
          <span :class="{'checkedOut': index === 2}" @click="index = 2">{{ $t('pools.withdrawal') }}</span>
        </div>
      </div>
      <div class="swap" v-if="index === 1">
        <el-form ref="formBorrow">
          <!-- 抵押数量 -->
          <el-form-item>
            <el-input v-model="payNum1" type="number"
                      placeholder="0.0"
                      @focus="handleIptFocus('pay')"
                      @blur="handleIptBlur('pay')"
                      @input="handleInBy('pay')">
              <span slot="suffix" class="coin" @click="handleShowMarList">{{ thisMarket.symbol0 }}
                <span class="iconfont icon-huaban29 select"></span>
              </span>
            </el-input>
            <el-divider><span class="and">&</span></el-divider>
            <el-input v-model="payNum2" type="number"
                      placeholder="0.0"
                      @focus="handleIptFocus('get')"
                      @blur="handleIptBlur('get')"
                      @input="handleInBy('get')">
              <span slot="suffix" class="coin" @click="handleShowMarList">{{ thisMarket.symbol1 }}
                <span class="iconfont icon-huaban29 select"></span>
              </span>
            </el-input>
          </el-form-item>
        </el-form>
      </div>

      <div class="swap" v-else>
        <market-lists-com :thisMarket="thisMarket" :marketLists="marketLists"
          @listenMarketChange="handleSelectThis" :show='true'/>
        <el-form ref="formBorrow">
          <!-- 生成总额 -->
          <el-form-item>
            <div class="label">
              <span>{{ $t('pools.token') }}</span>
              <span @click="handleClickToken">（{{ $t('pools.ableToken') }} {{token}}）</span>
            </div>
            <el-input v-model="sellToken" type="number"
                      placeholder="0"
                      @focus="handleIptFocus()"
                      @blur="handleIptBlur()"
                      @input="handleSellToken">
            </el-input>
          </el-form-item>
          <div class="getData">
            <span>{{ $t('pools.withdrawal') }}</span>
            <span class="num">{{ `${getNum1} ${thisMarket.symbol0}+${getNum2} ${thisMarket.symbol1}` }}</span>
          </div>
         </el-form>
      </div>
    </div>

    <!-- 存入详情 -->
    <div class="detailIn" v-if="index === 1">
      <div class="info">
        <div class="data">
          <div>
            <span>{{ $t('pools.depositRate') }}</span>
            <span class="num">1 {{ thisMarket.symbol0 }} : {{ rate }} {{ thisMarket.symbol1 }}</span>
          </div>
          <div>
            <span>{{ $t('pools.poolsNum') }}</span>
            <span class="num">{{ `${thisMarket.reserve0}+${thisMarket.reserve1}` }}</span>
          </div>
        </div>
        <div class="get">
          <span>{{ $t('pools.getToken') }}</span>
          <span class="num">{{ getToken }}</span>
        </div>
      </div>
      <div class="balance">
        <span>{{ $t('public.balance') }}：</span>
        <span class="num">
          <span @click="handleClickBalan('sym0')">{{balanceSym0}} {{ thisMarket.symbol0 }}</span>
          <span> / </span>
          <span @click="handleClickBalan('sym1')">{{balanceSym1}} {{ thisMarket.symbol1 }}</span>
        </span>
      </div>
    </div>

    <div class="btnDiv">
      <el-button class="btn" type="primary" :class="{'unabled': !Number(payNum1) || !Number(payNum2)}"
        v-if="scatter.identity && index === 1" plain @click="handleAddToken">{{ $t('pools.deposit') }}</el-button>
      <el-button class="btn out" type="danger" :class="{'unabledOut': !Number(sellToken)}"
        v-else-if="scatter.identity && index !== 1" @click="handleToSell" plain>{{ $t('pools.withdrawal') }}</el-button>
      <el-button class="btn" type="primary" v-else @click="handleLogin">{{ $t('public.loginPls') }}</el-button>
    </div>

    <market-lists-com ref="marketListsCom" :thisMarket="thisMarket" :marketLists="marketLists"
      @listenMarketChange="handleSelectThis" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { dealToken, sellToken } from '@/utils/logic';
import { EosModel } from '@/utils/eos';
import { toFixed } from '@/utils/public';
import MarketListsCom from '@/views/index/components/MarketListsCom';

export default {
  name: 'swap',
  components: {
    MarketListsCom
  },
  data() {
    return {
      payNum1: '',
      payNum2: '',
      getToken: '0',
      sellToken: '',
      getNum1: '0.0000',
      getNum2: '0.0000',
      index: 1, // 1 - 存入 | 2 - 取回
      token: '0',

      thisMarket: {}, // 当前选中的做市池子
      balanceSym0: '0.0000',
      balanceSym1: '0.0000',
      timer: null,
      rate: '0.0000',
      dealType: 'pay', // 当前输入方式
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
    index() {
      this.payNum1 = '0.0000';
      this.payNum2 = '0.0000';
      this.getToken = '0';
      this.getNum1 = '0.0000';
      this.getNum2 = '0.0000';
      this.sellToken = '';
    },
    marketLists: {
      handler: function marketList(newVal) {
        if (!newVal.length) {
          return;
        }
        if (!this.thisMarket.mid) {
          // this.thisMarket = newVal[0];
          const item = newVal.find(v => v.mid === 7);
          this.thisMarket = item
          return;
        }
        this.thisMarket = newVal.find(v => v.mid === this.thisMarket.mid)
      },
      immediate: true,
      deep: true
    },
    scatter: {
      handler: function listen(newVal) {
        if (newVal.identity) {
          this.handleGetAccToken();
          this.handleBalanTimer();
        }
      },
      deep: true,
      immediate: true,
    },
    thisMarket() {
      this.handleBalanTimer();
      this.handleGetAccToken();
      this.handleInBy(this.dealType)
    },
    payNum1(val) {
      if (val === toFixed(0, this.thisMarket.decimal0)) {
        this.payNum1 = ''
      }
    },
    payNum2(val) {
      if (val === toFixed(0, this.thisMarket.decimal1)) {
        this.payNum2 = ''
      }
    },
    sellToken(val) {
      if (!Number(val)) {
        this.sellToken = ''
      }
    }
  },
  computed:{
     ...mapState({
      // 箭头函数可使代码更简练
      scatter: state => state.app.scatter,
      baseConfig: state => state.sys.baseConfig, // 基础配置 - 默认为{}
    })
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    handleShowMarList() {
      this.$refs.marketListsCom.handleShowDrawer();
    },
    regInit() {
      if (this.scatter.identity && this.marketLists.length) {
        return true;
      }
      return false;
    },
    handleLogin() {
      this.$emit('listenLogin', true)
    },
    // 重启余额定时器
    handleBalanTimer() {
      clearInterval(this.timer);
      if (!this.regInit()) {
        return;
      }
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
        code: this.thisMarket.contract0,
        coin: this.thisMarket.symbol0,
        decimal: this.thisMarket.decimal0
      };
      if (next) {
        params.code = this.thisMarket.contract1;
        params.coin = this.thisMarket.symbol1;
        params.decimal = this.thisMarket.decimal1;
      }
      await EosModel.getCurrencyBalance(params, res => {
        let balance = '0.0000';
        (!res || res.length === 0) ? balance = '0.0000' : balance = res.split(' ')[0];
        if (next) {
          this.balanceSym1 = balance;
          return;
        }
        this.balanceSym0 = balance;
      })
    },
    // 选择当前市场
    handleSelectThis(item) {
      this.thisMarket = item;
    },
    handleIptFocus(type = 'pay') {
      if (this.index !== 1) {
        const n = Number(this.sellToken);
        if (!n) {
          this.sellToken = '';
          return
        }
        this.sellToken = n;
        return
      }
      const n = type === 'pay' ? Number(this.payNum1) : Number(this.payNum2);
      if (!n) {
        type === 'pay' ? this.payNum1 = '' : this.payNum2 = '';
        return
      }
      type === 'pay' ? this.payNum1 = Number(this.payNum1) : this.payNum2 = Number(this.payNum2);
    },
    handleIptBlur(type = 'pay') {
      if (this.index !== 1) {
        this.sellToken = parseInt(this.sellToken);
        return
      }
      type === 'pay' ? this.payNum1 = toFixed(this.payNum1, this.thisMarket.decimal0)
                     : this.payNum2 = toFixed(this.payNum2, this.thisMarket.decimal1);
    },
    // 获取账户当前交易对凭证数量
    handleGetAccToken() {
      if (!this.regInit()) {
        return;
      }
      const params = {
        code: this.baseConfig.toAccountSwap,
        scope: this.thisMarket.mid,
        table: 'liquidity',
        lower_bound: this.scatter.identity.accounts[0].name,
        upper_bound: this.scatter.identity.accounts[0].name,
        json: true
      }
      EosModel.getTableRows(params, (res) => {
        const list = res.rows || [];
        !list[0] ? this.token = 0 : this.token = list[0].token;
      })
    },
    // 计算存币获取凭证
    handleInBy(type = 'pay') {
      this.dealType = type
      const inData = {
        poolSym0: this.thisMarket.reserve0.split(' ')[0],
        poolSym1: this.thisMarket.reserve1.split(' ')[0],
        poolToken: this.thisMarket.liquidity_token
      }
      if (type === 'pay') {
        inData.payNum1 = this.payNum1;
      } else {
        inData.payNum2 = this.payNum2;
      }
      if (!this.thisMarket.liquidity_token) {
        inData.payNum1 = this.payNum1;
        inData.payNum2 = this.payNum2;
        inData.decimal0 = this.thisMarket.decimal0;
        inData.decimal1 = this.thisMarket.decimal1
      }
      const outData = dealToken(inData)
      this.rate = toFixed(outData.rate, this.thisMarket.decimal1);
      if (!this.thisMarket.liquidity_token && (!Number(this.payNum1) || !Number(this.payNum2))) {
        return;
      }
      type === 'pay' ? this.payNum2 = toFixed(outData.payNum2, this.thisMarket.decimal1) :
                       this.payNum1 = toFixed(outData.payNum1, this.thisMarket.decimal0);
      this.getToken = outData.getToken;
    },
    handleClickBalan(type = 'sym0') {
      if (type === 'sym0') {
        this.payNum1 = this.balanceSym0;
        this.handleInBy('pay')
        return
      }
      this.payNum2 = this.balanceSym1;
      this.handleInBy('get')
    },
    handleRegAdd() {
      if (!Number(this.payNum1) || !Number(this.payNum2)) {
        return false;
      }
      if (!Number(this.getToken)) {
        return false;
      }
      if (Number(this.payNum1) > Number(this.balanceSym0) || Number(this.payNum2) > Number(this.balanceSym1)) {
        this.$message({
          type: 'error',
          message: this.$t('public.balanLow')
        })
        return false
      }
      return true
    },
    // 存币做市
    handleAddToken() {
      if (!this.handleRegAdd()) {
        return
      }
      const obj = this.thisMarket;
      const formName = this.$store.state.app.scatter.identity.accounts[0].name;
      const permission = this.$store.state.app.scatter.identity.accounts[0].authority;
      const params = {
        actions: [
          {
            account: this.baseConfig.toAccountSwap,
            name: 'deposit',
            authorization: [{
              actor: formName, // 转账者
              permission,
            }],
            data: {
              user: formName,
              mid: obj.mid
            }
          },
          {
            account: obj.contract0,
            name: 'transfer',
            authorization: [{
              actor: formName, // 转账者
              permission,
            }],
            data: {
              from: formName,
              to: this.baseConfig.toAccountSwap,
              quantity: `${this.payNum1} ${obj.symbol0}`,
              memo: `deposit`
            }
          },
          {
            account: obj.contract1,
            name: 'transfer',
            authorization: [{
              actor: formName, // 转账者
              permission,
            }],
            data: {
              from: formName,
              to: this.baseConfig.toAccountSwap,
              quantity: `${this.payNum2} ${obj.symbol1}`,
              memo: `deposit`
            }
          }
        ]
      }
      EosModel.toTransaction(params, (res) => {
        if(res.code && JSON.stringify(res.code) !== '{}') {
          this.$message({
            message: res.message,
            type: 'error'
          });
          return
        }
        this.handleGetAccToken();
        this.$message({
          message: this.$t('public.success'),
          type: 'success'
        });
      })
    },
    // 计算卖出凭证
    handleSellToken() {
      const inData = {
        poolSym0: this.thisMarket.reserve0.split(' ')[0],
        poolSym1: this.thisMarket.reserve1.split(' ')[0],
        poolToken: this.thisMarket.liquidity_token,
        sellToken: this.sellToken
      }
      const outData = sellToken(inData);
      this.getNum1 = toFixed(outData.getNum1, this.thisMarket.decimal0);
      this.getNum2 = toFixed(outData.getNum2, this.thisMarket.decimal1);
    },
    handleClickToken() {
      this.sellToken = this.token;
      this.handleSellToken();
    },
    handleRegSell() {
      if (!Number(this.sellToken)) {
        return false;
      }
      if (Number(this.sellToken) > Number(this.token)) {
        this.$message({
          type: 'error',
          message: this.$t('public.tokenLow')
        })
        return false;
      }
      return true;
    },
    handleToSell() {
      if (!this.handleRegSell()) {
        return
      }
      const obj = this.thisMarket;
      const formName = this.$store.state.app.scatter.identity.accounts[0].name;
      const permission = this.$store.state.app.scatter.identity.accounts[0].authority;
      const params = {
        actions: [
          {
            account: this.baseConfig.toAccountSwap,
            name: 'withdraw',
            authorization: [{
              actor: formName, // 转账者
              permission,
            }],
            data: {
              user: formName,
              mid: obj.mid,
              amount: this.sellToken
            }
          },
        ]
      }
      EosModel.toTransaction(params, (res) => {
        if(res.code && JSON.stringify(res.code) !== '{}') {
          this.$message({
            message: res.message,
            type: 'error'
          });
          return
        }
        this.handleGetAccToken();
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
.pools{
  color: #070707;
  padding: 20px 18px;
  .navTitle{
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    color: #C1C1C1;
    margin-bottom: 20px;
    .title{
      font-weight: 500;
      font-size: 28px;
      color: #070707;
    }
  }
  .mainDiv{
    background: #f5f5f5;
    border-radius: 8px;
    padding: 19px 13px 10px;
    .topDiv{
      border: 1px solid #e7e7e7;
      height: 44px;
      border-radius: 25px;
      .title{
        height: 44px;
        display: flex;
        align-items: center;
        &>span{
          flex: 1;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: 500;
          &.checkedIn,&.checkedOut{
            background: #FFF;
            border-radius: 25px;
          }
          &.checkedIn{
            color: #42B48F;
          }
          &.checkedOut{
            color: #C05D5D;
          }
        }
      }
    }
    .swap{
      margin-top: 15px;
      .label{
        display: flex;
        align-items: center;
        justify-content: space-between;
        &>span{
          &:first-child{
            font-size: 14px;
            font-weight: 500;
          }
          &:last-child{
            font-size: 12px;
            color: #999;
          }
        }
      }
      /deep/ .el-form-item{
        margin-bottom: 0px;
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
          font-size: 16px;
        }
      }
      /deep/ .el-divider--horizontal{
        margin: 10px 0;
        .el-divider__text{
          background: #F5F5F5;
        }
      }
      .and{
        font-size: 14px;
        font-weight: 500;
        padding: 0 20px;
      }
      .coin{
        font-size: 20px;
        font-weight: 500;
        display: flex;
        .select{
          margin-left: 5px;
          font-size: 12px;
          display: flex;
          transform: rotate(90deg);
        }
      }
      .getData{
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20px 0px 0px;
        border-top: 1px solid #dadada;
        .num{
          font-weight: 500;
        }
      }
    }
  }
  .detailIn{
    margin-top: 10px;
    font-size: 14px;
    .info{
      border-radius: 8px;
      background: #f5f5f5;
      padding: 15px 20px;
    }
    .data{
      border-bottom: 1px solid #dadada;
    }
    .data>div,.get{
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 9px;
      .num{
        font-weight: 500;
      }
    }
    .get{
      margin-top: 9px;
      margin-bottom: 0px;
    }
    .balance{
      display: flex;
      align-items: center;
      justify-content: flex-end;
      margin: 9px 0 20px;
    }
  }
  .btnDiv{
    margin-top: 24px;
  }
  .btn{
    width: 100%;
    background: #42B48F;
    color: #fff;
    border-color: transparent;
    &.out{
      background: #C05D5D;
      &.unabledOut{
        background: rgba(#C05D5D, .5) !important;
      }
    }
    &.unabled{
      background: rgba(#42B48F, .5);
    }
  }
}
</style>
