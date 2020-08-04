<template>
  <div class="tabView">
    <div class="marketData">
      <tabs />
      <div class="direction flexb">
        <span class="flexc" :class="{'act': act === 1}" @click="handleChange(1)">{{ $t('pools.deposit') }}</span>
        <span class="flexc" :class="{'act actBack': act === 2}" @click="handleChange(2)">{{ $t('pools.withdrawal') }}</span>
      </div>
      <div v-if="act === 1">
        <div class="sym0Data" :class="{'focus': ipt1Focus}">
          <div class="info flexb">
            <span @click="handleClickBalan('payNum1')">{{ $t('public.balance') }}: {{ balanceSym0 }} {{ thisMarket.symbol0 }}</span>
            <span class="type"></span>
          </div>
          <div class="iptDiv flexb">
            <div class="coinInfo flex" @click="listenShowDrawer()">
              <div class="coinImg"><img width="100%" :src="handleGetCoinImg('sym0')" :onerror="errorCoinImg" alt=""></div>
              <div>
                <div class="coin">{{ thisMarket.symbol0 }} <i class="el-icon-arrow-down"></i></div>
                <div class="contract tip">{{ thisMarket.contract0 }}</div>
              </div>
            </div>
            <div class="inputDiv">
              <el-input class="elIpt" type="number" v-model="payNum1" placeholder="0.0"
                @input="handleInBy('sym0')"
                @focus="handleFocus('sym0')"
                @blur="handleBlur('sym0')"></el-input>
            </div>
          </div>
        </div>
        <div class="exchange">
          <div class="border flexc" :class="{'payFocus': ipt1Focus, 'getFocus': ipt2Focus}">
            <img class="iconImg" src="@/assets/img/market/switch_add.svg">
          </div>
        </div>
        <div class="sym0Data pdb10" :class="{'focus': ipt2Focus}">
          <div class="info flexb">
            <span class="ableGet" @click="handleClickBalan('payNum2')">{{ $t('public.balance') }}: {{ balanceSym1 }} {{ thisMarket.symbol1 }}</span>
            <span class="type"></span>
          </div>
          <div class="iptDiv flexb">
            <div class="coinInfo flex" @click="listenShowDrawer()">
              <div class="coinImg"><img width="100%" :src="handleGetCoinImg('sym1')" :onerror="errorCoinImg" alt=""></div>
              <div>
                <div class="coin">{{ thisMarket.symbol1 }} <i class="el-icon-arrow-down"></i></div>
                <div class="contract tip">{{ thisMarket.contract1 }}</div>
              </div>
            </div>
            <div class="inputDiv">
              <el-input class="elIpt" type="number" v-model="payNum2" placeholder="0.0"
                @input="handleInBy('sym1')"
                @focus="handleFocus('sym1')"
                @blur="handleBlur('sym1')"></el-input>
            </div>
          </div>
        </div>
        <div class="rate flexb">
          <span class="tip">{{ $t('dex.rate') }}</span>
          <span class="flex">
            <span v-if="!exRate">1{{ thisMarket.symbol0 }} = {{ thisMarket.sym0Rate || '-' }}{{ thisMarket.symbol1 }}</span>
            <span v-else>1{{ thisMarket.symbol1 }} = {{ thisMarket.sym1Rate || '-' }}{{ thisMarket.symbol0 }}</span>
            <span @click="exRate =!exRate">
              <img class="iconImg" v-if="!exRate" src="@/assets/img/dex/price_switch_icon_btn_left.svg" alt="">
              <img class="iconImg" v-else src="@/assets/img/dex/price_switch_icon_btn_right.svg" alt="">
            </span>
          </span>
        </div>
      </div>

      <div v-else>
        <div class="marketChecked flexb" @click="listenShowDrawer()">
          <div class="checkedData">
            <div class="symbols">{{ thisMarket.symbol0 }} / {{ thisMarket.symbol1 }}</div>
            <div class="contracts tip">{{ thisMarket.contract0 }} / {{ thisMarket.contract1 }}</div>
          </div>
          <div class="flexc">
            <span class="el-icon-arrow-down more"></span>
          </div>
        </div>
        <div class="backData" :class="{'focus': tokenFocus}">
          <div class="flexb token">
            <span>{{ $t('pools.token') }}</span>
            <span @click="handleClickBalan('token')">{{ $t('pools.ableToken') }}: {{ token }}</span>
          </div>
          <div class="inputDiv">
            <el-input class="elIpt" type="number" v-model="sellToken" placeholder="0"
              @input="handleSellToken()"
              @focus="handleFocus()"
              @blur="handleBlur()"></el-input>
          </div>
        </div>
        <div class="backNum flex">
          <span class="tip">{{ $t('pools.withdrawal') }}</span>
          <span>{{ getNum1 }} {{thisMarket.symbol0}} + {{ getNum2 }} {{ thisMarket.symbol1 }}</span>
        </div>
      </div>
    </div>

    <div class="liquidity" v-if="act === 1">
      <div class="subTitle">{{ $t('dex.poolNum') }}</div>
      <div class="num">{{ thisMarket.reserve0 }} / {{ thisMarket.reserve1 }}</div>
      <div class="subTitle">{{ $t('pools.accRate', {rate}) }}</div>
      <div class="num">{{ toFixed(payNum1, thisMarket.decimal0) }} {{thisMarket.symbol0}}  /  {{ toFixed(payNum2, thisMarket.decimal1) }} {{thisMarket.symbol1}}</div>
      <div class="subTitle">{{ $t('pools.getToken') }}</div>
      <div class="num">{{ getToken }}</div>
    </div>

    <div class="btnDiv" v-loading="loading">
      <div v-if="act === 1" class="btn flexc" @click="handleAddToken">{{ $t('pools.deposit') }}</div>
      <div v-else class="btn flexc backBtn" @click="handleToSell">{{ $t('pools.withdrawal') }}</div>
    </div>

    <!-- 弹窗组件 -->
    <el-dialog
      class="mkListDia"
      :show-close="false"
      :visible.sync="showMarketList">
      <market-list :marketLists="marketLists"
        @listenMarketChange="handleMarketChange"
        @listenClose="handleClose"/>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { EosModel } from '@/utils/eos';
import MarketList from '@/components/MarketList';
import { toFixed, accAdd, accDiv, accMul } from '@/utils/public';
import { dealToken, sellToken } from '@/utils/logic';
import Tabs from '../index/components/Tabs';
export default {
  components: {
    Tabs,
    MarketList,
  },
  data() {
    return {
      errorCoinImg: 'this.src="https://ndi.340wan.com/eos/eosio.token-eos.png"',
      act: 1,
      ipt1Focus: false,
      ipt2Focus: false,
      payNum1: '',
      payNum2: '',
      getToken: '0',
      rate: '0.00',
      balanceSym0: '0.0000',
      balanceSym1: '0.0000',
      exRate: false,
      tokenFocus: false,
      timer: null,
      thisMarket: {mid: 7,symbol0: 'EOS', symbol1: 'USDD'},
      sellToken: '',
      getNum1: '0.0000',
      getNum2: '0.0000',
      token: '0',
      showMarketList: false,
      first: true,
      loading: false,
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
  computed: {
    ...mapState({
      scatter: state => state.app.scatter,
      slipPoint: state => state.app.slipPoint,
      baseConfig: state => state.sys.baseConfig,
    }),
  },
  watch: {
    marketLists: {
      handler: function ml(newVal) {
        if (!newVal.length) {
          return
        }
        if (this.first) {
          this.thisMarket.mid = this.$route.params.mid || 7;
        }
        this.first = false;
        const thisMarket = newVal.find(v => v.mid === this.thisMarket.mid) || newVal[0];
        const reserve0 = thisMarket.reserve0.split(' ')[0];
        const reserve1 = thisMarket.reserve1.split(' ')[0];
        thisMarket.sym0Rate = toFixed(accDiv(reserve1, reserve0), thisMarket.decimal0)
        thisMarket.sym1Rate = toFixed(accDiv(reserve0, reserve1), thisMarket.decimal1)
        this.thisMarket = thisMarket;
        this.handleInBy(this.dealType)
      },
      deep: true,
      immediate: true
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
      this.handleGetAccToken();
      this.handleBalanTimer()
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
  mounted() {
    // console.log(this.$route)
  },
  methods: {
    handleChange(act) {
      this.act = act;
      this.loading = false;
      this.payNum1 = '';
      this.payNum2 = '';
      this.sellToken = '';
    },
    handleClose() {
      this.showMarketList = false
    },
    listenShowDrawer() {
      // this.$emit('listenShowDrawer', false)
      this.showMarketList = true
    },
    handleMarketChange(data) {
      this.thisMarket = data;
      this.showMarketList = false;
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
      if ((!Number(this.payNum1) && !Number(this.payNum2))) {
        return
      }
      if (!this.thisMarket.liquidity_token && (!Number(this.payNum1) || !Number(this.payNum2))) {
        return;
      }
      type === 'sym0' ? this.payNum2 = toFixed(outData.payNum2, this.thisMarket.decimal1) :
                       this.payNum1 = toFixed(outData.payNum1, this.thisMarket.decimal0);
      this.getToken = outData.getToken;
      let rate = accAdd(this.thisMarket.liquidity_token, this.getToken)
      rate = accDiv(this.getToken, rate);
      rate = accMul(rate, 100)
      this.rate = toFixed(rate, 2)
    },
    handleFocus(type = 'sym0') {
      if (this.act !== 1) {
        this.tokenFocus = true;
        const n = Number(this.sellToken);
        if (!n) {
          this.sellToken = '';
          return
        }
        this.sellToken = n;
        return
      }
      type === 'sym0' ? this.ipt1Focus = true : this.ipt2Focus = true;
      const n = type === 'sym0' ? Number(this.payNum1) : Number(this.payNum2);
      if (!n) {
        type === 'sym0' ? this.payNum1 = '' : this.payNum2 = '';
        return
      }
      type === 'sym0' ? this.payNum1 = Number(this.payNum1) : this.payNum2 = Number(this.payNum2);
    },
    handleBlur(type = 'sym0') {
      if (this.act !== 1) {
        this.tokenFocus = false;
        this.sellToken = parseInt(this.sellToken);
        return
      }
      type === 'sym0' ? this.ipt1Focus = false : this.ipt2Focus = false;
      type === 'sym0' ? this.payNum1 = toFixed(this.payNum1, this.thisMarket.decimal0)
                      : this.payNum2 = toFixed(this.payNum2, this.thisMarket.decimal1);
    },
    handleGetCoinImg(type = 'sym0') {
      const market = this.thisMarket;
      if (type === 'sym0') {
        return `https://ndi.340wan.com/eos/${market.contract0}-${market.symbol0.toLowerCase()}.png`
      }
      return `https://ndi.340wan.com/eos/${market.contract1}-${market.symbol1.toLowerCase()}.png`
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
      if (this.loading) {
        return
      }
      if (!this.handleRegAdd()) {
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
        if(res.code) {
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
    // 卖出Token
    handleToSell() {
      if (this.loading) {
        return
      }
      if (!this.handleRegSell()) {
        return
      }
      this.loading = true;
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
        this.loading = false
        if(res.code) {
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
    toFixed(n, l) {
      return toFixed(n, l)
    },
    handleClickBalan(type) {
      if (type === 'token') {
        this.sellToken = this.token;
        this.handleSellToken();
        return
      }
      if (type === 'payNum1') {
        this.payNum1 = this.balanceSym0;
        this.handleInBy('sym0');
        return
      }
      this.payNum2 = this.balanceSym1;
      this.handleInBy('sym1')
    }
  },
}
</script>

<style lang="scss" scoped>
.tabView{
  background: #FFF;
  // font-size: 24px;
  text-align: left;
  position: relative;
  color: #000;
  font-family: 'Sarasa';
  .direction{
    font-size: 28px;
    height: 84px;
    box-sizing: border-box;
    box-shadow: 0 0 1px 1px #F3F3F3;
    // border: 1px solid #F3F3F3;
    border-radius: 30px;
    margin-bottom: 32px;

    &>span{
      height: 100%;
      flex: 1;
      border: 1px solid transparent;
      border-radius: 30px;
      font-weight: 500;
    }

    .act{
      border: 1px solid #07D79B;
      color: #07D79B;
    }
    .actBack{
      border: 1px solid #C05D5D;
      color: #C05D5D;
    }
  }

  .marketData{
    border-radius:30px;
    border: 1px solid rgba(224,224,224,1);
    background: #FFF;
    border-radius: 25px;
    position: relative;
    padding: 32px 20px 28px;
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
  .exchange{
    height: 20px;
    position: relative;
    .border{
      width: 100px;
      height: 100px;
      border-radius: 50px;
      // border: 1px solid #07D79B;
      position: absolute;
      background: $color-bgcolor;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-image: url('../../assets/img/dex/enter_solid_default.svg');
      background-repeat: no-repeat;
      background-size: cover;
      &.payFocus{
        background-image: url('../../assets/img/dex/enter_solid_up.svg');
        background-repeat: no-repeat;
        background-size: cover;
      }
      &.getFocus{
        background-image: url('../../assets/img/dex/enter_solid_down.svg');
        background-repeat: no-repeat;
        background-size: cover;
      }
      .iconImg{
        width: 72px;
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
  .marketChecked{
    margin: 20px 0;
    padding: 20px 40px;
    border-radius:30px;
    border:2px solid rgba(243,243,243,1);
    .symbols{
      font-size:36px;
      font-weight: 500;
    }
    .contracts{
      margin-top: 6px;
      font-size: 24px;
      // font-weight: 300;
    }
    .more{
      font-weight: bold;
      font-size: 32px;
    }
  }
  .backData{
    padding: 42px 36px 28px;
    border-radius:30px;
    border: 1px solid rgba(243,243,243,1);
    &.focus{
      border: 1px solid rgba(192,93,93,1);
    }
    .token{
      font-size: 24px;
      margin-bottom: 32px;
    }
    .inputDiv{
      flex: 2;
      .elIpt{
        /deep/ .el-input__inner{
          color: $color-black;
          border: 0px;text-align: right;
          font-size: 52px;
          padding: 0 20px 0 0px;
          height: 62px;
          text-align: left;
        }
      }
    }
  }
  .backNum{
    font-size: 28px;
    margin: 28px 20px 0;
    align-items: center;
    .tip{
      margin-right: 20px;
      line-height: 32px;
    }
  }

  .liquidity{
    margin-top: 40px;
    padding: 20px 40px 0;
    font-size: 28px;
    text-align: left;
    border-radius:20px;
    background: #FFF;
    border: 1px solid rgba(224,224,224,1);
    .subTitle{
      color:rgba(166,166,166,1);
      line-height:34px;
    }
    .num{
      margin: 10px 0 20px;
    }
  }

  .btnDiv{
    margin-top: 40px;
    .btn{
      height:88px;
      background:rgba(7,215,155,1);
      border-radius:30px;
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
