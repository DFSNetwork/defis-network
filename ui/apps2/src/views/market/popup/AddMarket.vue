<template>
  <div class="addMarket">
    <div class="title">
      <span v-if="$route.name !== 'nodePools'">{{ $t('more.addMarket') }}</span>
      <span v-else>做市助力</span>
      <img class="closeSvg" @click="handleClose" src="https://cdn.jsdelivr.net/gh/defis-net/material/svg/sd_icon_btn.svg" alt="">
    </div>
    <div class="content">
      <!-- 币种1 -->
      <div class="symInfo flexb">
        <div>
          <div class="bal" @click="handleClickBalan('payNum1')">{{ $t('public.balance') }}：{{ balanceSym0 }} {{ thisMarket.symbol0 }}</div>
          <div class="coinInfo flexa">
            <img class="coinImg" :src="thisMarket.sym0Data.imgUrl" :onerror="errorCoinImg">
            <div class="coin">
              <div class="coinName">{{ thisMarket.symbol0 }}</div>
              <div class="coinContract tip">{{ thisMarket.contract0 }}</div>
            </div>
          </div>
        </div>
        <div class="iptDiv flexb">
          <el-input class="elIpt dinBold" v-model="payNum1" type="number"
            @input="handleInBy('sym0')"
            @focus="handleFocus('sym0')"
            @blur="handleBlur('sym0')"
            placeholder="0.0"></el-input>
          <span v-if="showMax0" @click="handleClickBalan('payNum1')" class="max flexc">Max</span>
        </div>
      </div>
      <!-- + 号 -->
      <div class="addDiv"><img src="https://cdn.jsdelivr.net/gh/defis-net/material/svg/add.svg" alt=""></div>
      <!-- 币种2 -->
      <div class="symInfo flexb">
        <div>
          <div class="bal" @click="handleClickBalan('payNum2')">{{ $t('public.balance') }}：{{ balanceSym1 }} {{ thisMarket.symbol1 }}</div>
          <div class="coinInfo flexa">
            <img class="coinImg" :src="thisMarket.sym1Data.imgUrl" :onerror="errorCoinImg">
            <div class="coin">
              <div class="coinName">{{ thisMarket.symbol1 }}</div>
              <div class="coinContract tip">{{ thisMarket.contract1 }}</div>
            </div>
          </div>
        </div>
        <div class="iptDiv flexb">
          <el-input class="elIpt dinBold" v-model="payNum2" type="number"
            @input="handleInBy('sym1')"
            @focus="handleFocus('sym1')"
            @blur="handleBlur('sym1')"
            placeholder="0.0"></el-input>
          <span v-if="showMax1" @click="handleClickBalan('payNum2')" class="max flexc">Max</span>
        </div>
      </div>
    </div>
    <!-- 其他信息 -->
    <div class="otherTip">
      <div class="tip">{{ $t('dex.exchangePrice') }}</div>
      <div class="flexa num din" @click="exRate =!exRate">
        <span v-if="!exRate">1{{ thisMarket.symbol0 }} = {{ thisMarket.sym0Rate || '-' }}{{ thisMarket.symbol1 }}</span>
        <span v-else>1{{ thisMarket.symbol1 }} = {{ thisMarket.sym1Rate || '-' }}{{ thisMarket.symbol0 }}</span>
        <img class="iconImg" v-if="!exRate" src="https://cdn.jsdelivr.net/gh/defis-net/material2/icon/price_switch_icon_btn_left.svg" alt="">
        <img class="iconImg" v-else src="https://cdn.jsdelivr.net/gh/defis-net/material2/icon/price_switch_icon_btn_right.svg" alt="">
      </div>
      <div class="tip">{{ $t('dex.poolNum') }}</div>
      <div class="num din">{{ thisMarket.reserve0 }} / {{ thisMarket.reserve1 }}</div>
      <div class="tip">{{ $t('pools.accRate', {rate: thisRate}) }}</div>
      <div class="num din">{{ toFixed(accPools.getNum1, thisMarket.decimal0) }} {{thisMarket.symbol0}}
          / {{ toFixed(accPools.getNum2, thisMarket.decimal1) }} {{thisMarket.symbol1}}</div>
      <div class="tip">*{{ $t('more.exitMarket') }}</div>
    </div>
    <!-- 按钮 -->
    <div class="btnDiv" v-loading="loading">
      <div class="btn flexc" v-if="btnReg.type"
        @click="handleAddToken">{{ $t('pools.deposit') }}</div>
      <div v-else class="btn flexc disabled">{{ btnReg.msg }}</div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { EosModel } from '@/utils/eos';
import { toFixed, accAdd, accDiv, accMul } from '@/utils/public';
import { dealToken, sellToken } from '@/utils/logic';

export default {
  name: 'addMarket',
  props: {
    thisMarket: {
      type: Object,
      default: function tm() {
        return {}
      }
    }
  },
  data() {
    return {
      errorCoinImg: 'this.src="https://ndi.340wan.com/eos/eosio.token-eos.png"',
      balanceSym0: '0.0000',
      balanceSym1: '0.0000',
      payNum1: '',
      payNum2: '',
      exRate: true,
      loading: false,
      
      getToken: 0,
      token: 0,
    }
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  computed: {
    ...mapState({
      minScreen: state => state.app.minScreen,
      scatter: state => state.app.scatter,
      slipPoint: state => state.app.slipPoint,
      baseConfig: state => state.sys.baseConfig,
      marketLists: state => state.sys.marketLists,
    }),
    showMax0() {
      return Number(this.payNum1) !== Number(this.balanceSym0)
    },
    showMax1() {
      return Number(this.payNum2) !== Number(this.balanceSym1)
    },
    btnReg() {
      // 验证输入
      if (!Number(this.payNum1) || !Number(this.payNum2)) {
        return {
          type: false,
          msg: this.$t('pools.deposit')
        };
      }
      // 验证sym0余额
      if (Number(this.payNum1) > Number(this.balanceSym0)) {
        return {
          type: false,
          msg: this.$t('more.lowBal', {sym: this.thisMarket.symbol0})
        }
      }
      // 验证sym1余额
      if (Number(this.payNum2) > Number(this.balanceSym1)) {
        return {
          type: false,
          msg: this.$t('more.lowBal', {sym: this.thisMarket.symbol1})
        }
      }
      // 验证存入获取的Token
      if (!Number(this.getToken)) {
        return {
          type: false,
          msg: this.$t('public.marketTip'),
        };
      }
      return {type: true}
    },
    // 获取用户做市
    accPools() {
      if (!this.thisMarket.reserve0 || !this.thisMarket.reserve1) {
        return {}
      }
      const inData = {
        poolSym0: this.thisMarket.reserve0.split(' ')[0],
        poolSym1: this.thisMarket.reserve1.split(' ')[0],
        poolToken: this.thisMarket.liquidity_token,
        sellToken: accAdd(this.token, this.getToken)
      }
      const outData = sellToken(inData);
      return outData
    },
    rate() {
      if (!parseFloat(this.thisMarket.reserve0)) {
        return '0.00'
      }
      const rate = parseFloat(this.accPools.getNum1) / parseFloat(this.thisMarket.reserve0)
      return rate
    },
    thisRate() {
      if (!this.thisMarket.liquidity_token) {
        return '0.00'
      }
      const accToken = accAdd(this.token, this.getToken)
      let rate = accAdd(this.thisMarket.liquidity_token, this.getToken)
      rate = accDiv(accToken, rate);
      rate = accMul(rate, 100)
      return toFixed(rate, 2)
    }
  },
  watch: {
    scatter: {
      handler: function listen(newVal) {
        if (newVal.identity) {
          this.handleBalanTimer();
          this.handleGetAccToken()
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    handleClose() {
      this.$emit('listenClose', false)
    },
    toFixed(n, l) {
      return toFixed(n, l)
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
        lower_bound: ` ${this.scatter.identity.accounts[0].name}`,
        upper_bound: ` ${this.scatter.identity.accounts[0].name}`,
        json: true
      }
      EosModel.getTableRows(params, (res) => {
        const list = res.rows || [];
        !list[0] ? this.token = '0' : this.token = `${list[0].token}`;
        console.log(this.token)
      })
    },
    // 存币做市
    handleAddToken() {
      if (this.loading) {
        return
      }
      if (!this.btnReg.type) {
        return
      }
      this.loading = true;
      const obj = this.thisMarket;
      const formName = this.scatter.identity.accounts[0].name;
      const permission = this.scatter.identity.accounts[0].authority;
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
        this.loading = false;
        if(res.code && JSON.stringify(res.code) !== '{}') {
          this.$message({
            message: res.message,
            type: 'error'
          });
          return
        }
        this.handleClose()
        setTimeout(() => {
          this.handleBalanTimer();
        }, 1000);
        this.$message({
          message: this.$t('public.success'),
          type: 'success'
        });
      })
    },
    // 计算存币获取凭证
    handleInBy(type = 'sym0') {
      this.dealType = type;
      const inData = {
        poolSym0: this.thisMarket.reserve0.split(' ')[0],
        poolSym1: this.thisMarket.reserve1.split(' ')[0],
        poolToken: this.thisMarket.liquidity_token
      }
      if (type === 'sym0') {
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
      // console.log(outData)
      if ((!Number(this.payNum1) && !Number(this.payNum2))) {
        return
      }
      if (!this.thisMarket.liquidity_token && (!Number(this.payNum1) || !Number(this.payNum2))) {
        return;
      }
      type === 'sym0' ? this.payNum2 = toFixed(outData.payNum2, this.thisMarket.decimal1) :
                       this.payNum1 = toFixed(outData.payNum1, this.thisMarket.decimal0);
      this.getToken = outData.getToken;
    },
    handleFocus(type = 'sym0') {
      // type === 'sym0' ? this.ipt1Focus = true : this.ipt2Focus = true;
      const n = type === 'sym0' ? Number(this.payNum1) : Number(this.payNum2);
      if (!n) {
        type === 'sym0' ? this.payNum1 = '' : this.payNum2 = '';
        return
      }
      type === 'sym0' ? this.payNum1 = Number(this.payNum1) : this.payNum2 = Number(this.payNum2);
    },
    handleBlur(type = 'sym0') {
      // type === 'sym0' ? this.ipt1Focus = false : this.ipt2Focus = false;
      type === 'sym0' ? this.payNum1 = toFixed(this.payNum1, this.thisMarket.decimal0)
                      : this.payNum2 = toFixed(this.payNum2, this.thisMarket.decimal1);
    },
    handleClickBalan(type) {
      if (type === 'payNum1') {
        this.payNum1 = this.balanceSym0;
        this.handleInBy('sym0');
        return
      }
      this.payNum2 = this.balanceSym1;
      this.handleInBy('sym1')
    },
    regInit() {
      if (this.scatter.identity && this.marketLists.length) {
        return true;
      }
      return false;
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
      }, 10000)
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
  }
}
</script>

<style lang="scss" scoped>
.addMarket{
  padding: 30px 26px;
  .title{
    font-size: 38px;
    font-weight: 500;
    color: #333;
    text-align: center;
    position: relative;
    margin-bottom: 40px;
    .closeSvg{
      position: absolute;
      width: 24px;
      right: 0;
    }
  }
  .content{
    .symInfo{
      padding: 30px;
      border: 1px solid #eee;
      border-radius: 12px;
      .bal{
        font-size: 21px;
        margin-bottom: 5px;
      }
      .coinInfo{
        text-align: left;
        .coinImg{
          height: 60px;
          width: 60px;
          margin-right: 10px;
          border-radius: 60px;
          overflow: hidden;
        }
        .coinName{
          font-size: 30px;
          font-weight: 500;
          color: #333;
        }
        .coinContract{
          font-size: 21px;
          margin-top: -5px;
        }
      }
      .iptDiv{
        flex: 2;;
        .elIpt{
          /deep/ .el-input__inner{
            color: $color-black;
            border: 0px;text-align: right;
            font-size: 50px;
            padding: 0 0 0 20px;
            height: 62px;
          }
        }
        .max{
          height: 54px;
          width: 86px;
          background: rgba(#29D4B0, .2);
          font-size: 26px;
          border-radius: 2px;
          color: #29D4B0;
          margin-left: 10px;
        }
      }
    }
    .addDiv{
      width: 28px;
      margin: 14px auto;
      img{
        display: block;
        width: 28px;
      }
    }
  }
  .otherTip{
    text-align: left;
    font-size: 26px;
    margin-top: 26px;
    .tip{
      margin-top: 20px;
    }
    .num{
      margin-top: 5px;
      color: #333;
    }
    .iconImg{
      width: 30px;
      margin-left: 10px;
    }
  }
  .btnDiv{
    margin: 30px 0 0;
    .btn{
      height:88px;
      background:#29D4B0;
      border-radius: 48px;
      font-size:32px;
      color: #FFF;

      &:active{
        background:rgba(2,198,152,1);
      }
      &.backBtn{
        background:rgba(192,93,93,1);
        &:active{
          background:rgba(185,78,90,1);
        }
      }
      &.disabled{
        background: #EAEAEA;
        color: #999;
      }
    }
  }
}
</style>
