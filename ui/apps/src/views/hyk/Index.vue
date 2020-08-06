<template>
  <div class="hyk">
    <!-- 方式1: 现价认购 -->
    <div class="type">
      <div class="navTitle">
        <span class="title">{{ $t('tab.hyk') }}</span>
        <span class="bonus" @click="handleShowBonus">{{ $t('hyk.stock') }}</span>
      </div>
      <el-form class="formDiv" ref="formBorrow">
        <el-form-item>
          <div class="label">
            <span>{{ $t('hyk.stockPrice') }}</span>
            <span>{{ 1/price | numberTofixed }} EOS/HYK</span>
          </div>
        </el-form-item>
        <el-form-item>
          <div class="label">
            <span>{{ $t('hyk.stockRate') }}</span>
            <span>{{ percentage }}%</span>
          </div>
          <div class="progress">
            <el-progress :text-inside="true" :stroke-width="10" color="#42B48F" :percentage="percentage"></el-progress>
          </div>
        </el-form-item>
        <div class="bgF5">
          <!-- 抵押数量 -->
          <el-form-item>
            <div class="label">{{ $t('hyk.buyCount') }}</div>
            <el-input v-model="payNum"
              @focus="handleIptFocus('stake')"
              @input="handleGetNum" @blur="handleInputBlur('stake')" type="number">
              <span slot="suffix">EOS</span>
            </el-input>
          </el-form-item>
          <!-- 生成总额 -->
          <el-form-item>
            <div class="label">{{ $t('hyk.buyNum') }}</div>
            <el-input v-model="getNum"
              @focus="handleIptFocus('mint')"
              @input="handleGetTransNum" @blur="handleInputBlur('mint')" type="number">
              <span slot="suffix">HYK</span>
            </el-input>
          </el-form-item>
        </div>

        <!-- 余额 -->
        <div class="balance">
          <span @click="handleClickBalan">{{ $t('public.balance') }}：{{balanceEos}} EOS</span>
        </div>
        <el-button class="btn" type="primary" :class="{'unabled': !Number(payNum)}"
          v-if="scatter.identity" plain @click="handleTransfer">{{ $t('tab.hyk') }}</el-button>
        <el-button class="btn" type="primary" v-else @click="handleLogin">{{ $t('public.loginPls') }}</el-button>
      </el-form>
    </div>
    <!-- 方式2: swap认购 -->
    <div class="type" v-if="false">
      <div class="title">{{ $t('hyk.swapBuy') }}</div>
      <el-form class="formDiv" ref="formBorrow" label-width="75px">
        <el-form-item :label="$t('hyk.buyCount')" style="margin-bottom: 0;">
          <el-input v-model="payNum2"
            @focus="handleIptFocus2('stake')"
            @input="handleGetTransNum2('pay')" @blur="handleInputBlur2('stake')" type="number" clearable>
            <span slot="suffix">EOS</span>
          </el-input>
          <!-- 余额 -->
          <div class="balance">
            <span>{{ $t('public.balance') }}：{{balanceEos}} EOS</span>
          </div>
        </el-form-item>
        <div class="changeDiv">
          <span class="iconfont icon-huaban22 change"></span>
        </div>
        <!-- 生成总额 -->
        <el-form-item :label="$t('hyk.buyNum')" style="margin-top: 5px">
          <el-input v-model="getNum2"
            @focus="handleIptFocus2('mint')"
            @input="handleGetTransNum2('get')" @blur="handleInputBlur2('mint')" type="number" clearable>
            <span slot="suffix">HYK</span>
          </el-input>
        </el-form-item>
        <el-button class="btn" type="primary" v-if="scatter.identity" plain @click="handleTransferSwap">{{ $t('hyk.buyHYK') }}</el-button>
        <el-button class="btn" type="primary" v-else @click="handleLogin">{{ $t('public.loginPls') }}</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { EosModel } from '@/utils/eos';
import { toFixed } from '@/utils/public';
import { dealTrade } from '@/utils/logic';
// import Bonus from '@/components/Bonus';

export default {
  name: 'buyHyk',
  components: {
    // Bonus
  },
  data() {
    return {
      payNum: '0.0000',
      getNum: '0.0000',
      payNum2: '0.0000',
      getNum2: '0.0000',
      balanceEos: '0.0000',
      HykAccountBalan: '300000.0000', // HYK账户剩余余额 HYK
      HykSellCount: '300000', // HYK限量 30W
      price: 10,
      timer: null,
      thisMarket: {
        contract0: "eosio.token",
        contract1: "jinbankoneo1",
        decimal0: "4",
        decimal1: "4",
        last_update: "2020-05-08T09:25:33",
        liquidity_token: 16355591,
        mid: 1,
        price0_cumulative_last: "6611699108",
        price0_last: "3.39009999999999989",
        price1_cumulative_last: "6611699108",
        price1_last: "0.29490000000000000",
        reserve0: "100.0000 EOS",
        reserve1: "1000.0000 HYK",
        sym0: "4,EOS",
        sym1: "4,JIN",
        symbol0: "EOS",
        symbol1: "JIN",
      },
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
  computed:{
    ...mapState({
      // 箭头函数可使代码更简练
      scatter: state => state.app.scatter,
      baseConfig: state => state.sys.baseConfig, // 基础配置 - 默认为{}
    }),
    percentage() {
      const rate = (this.HykSellCount - this.HykAccountBalan) * 100 / this.HykSellCount;
      return Number(toFixed(rate, 2));
    }
  },
  created() {
  },
  watch: {
    marketLists: {
      handler: function marketList(newVal) {
        const market = newVal.find(item => item.contract1 === this.baseConfig.hykContranct
                                        && item.contract0 === this.baseConfig.baseCoinContract) || {}
        this.thisMarket = market
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
    }
  },
  methods: {
    handleClickBalan() {
      this.payNum = this.balanceEos;
      this.handleGetNum();
    },
    handleShowBonus() {
      this.$emit('listenShowBonus', true)
      // this.$refs.bonus.showBonus = true;
    },
    handleLogin() {
      this.$emit('listenLogin', true);
    },
    // 重启余额定时器
    handleBalanTimer() {
      clearInterval(this.timer);
      this.handleGetBalance(this.baseConfig.toAccountByHyk)
      this.handleGetBalance();
      this.timer = setInterval(() => {
        this.handleGetBalance(this.baseConfig.toAccountByHyk)
        this.handleGetBalance();
      }, 20000)
    },
    // 获取账户余额
    async handleGetBalance(account) {
      let params = {
        code: this.baseConfig.baseCoinContract,
        coin: 'EOS',
        decimal: 4,
      };
      if (account) {
        params = {
          code: this.baseConfig.hykContranct,
          coin: 'HYK',
          decimal: 4,
          account
        }
      }
      await EosModel.getCurrencyBalance(params, res => {
        if (!res || res.length === 0) {
          return 0
        }
        if (account) {
          this.HykAccountBalan = res.split(' ')[0];
          return;
        }
        const balance = res.split(' ')[0];
        this.balanceEos = balance;
      })
    },
    // 计算生成总额度 - 当前价格
    handleGetNum() {
      const allPrice = this.price * this.payNum;
      this.getNum = toFixed(allPrice, 4);
    },
    // 计算生成总额度 - swap
    handleGetNum2() {
      const allPrice = this.price * this.payNum2;
      this.getNum2 = toFixed(allPrice, 4);
    },
    // 计算转账数量
    handleGetTransNum() {
      const payNum = this.getNum / this.price;
      this.payNum = toFixed(payNum, 4);
    },
    // 计算转账数量 - swap
    handleGetTransNum2(type) {
      const inData = {
        poolSym0: this.thisMarket.reserve0.split(' ')[0],
        poolSym1: this.thisMarket.reserve1.split(' ')[0],
        poolToken: this.thisMarket.liquidity_token,
      }
      if (type === 'pay') {
        inData.payNum = this.payNum2;
      } else {
        inData.getNum = this.getNum2;
      }
      const outData = dealTrade(inData);
      type === 'pay' ? this.getNum2 = toFixed(outData.getNum, 4) : this.payNum2 = toFixed(outData.payNum, 4);
    },
    handleReg() {
      if (!Number(this.payNum)) {
        return;
      }
      if (Number(this.payNum) > Number(this.balanceEos)) {
        this.$message({
          type: 'error',
          message: this.$t('public.balanLow')
        })
        return;
      }
      return true;
    },
    // 铸币
    handleTransfer() {
      if (!this.handleReg()) {
        return
      }
      const params = {
        code: this.baseConfig.baseCoinContract,
        toAccount: this.baseConfig.toAccountByHyk,
        memo: 'HYK swap',
        quantity: `${this.payNum} EOS`
      }
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
    },
    // 单向SWAP买币
    handleTransferSwap() {
      const params = {
        code: this.baseConfig.baseCoinContract,
        toAccount: this.baseConfig.toAccountByHyk,
        memo: `HYK swap`,
        quantity: `${this.payNum2} EOS`
      }
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
    },
    handleInputBlur(type) {
      if (type === 'stake') {
        this.payNum = toFixed(this.payNum, 4);
        return
      }
      this.getNum = toFixed(this.getNum, 4);
    },
    handleIptFocus(type) {
      const n = type === 'stake' ? Number(this.payNum) : Number(this.getNum);
      if (!n) {
        type === 'stake' ? this.payNum = '' : this.getNum = '';
        return
      }
      type === 'stake' ? this.payNum = Number(this.payNum) : this.getNum = Number(this.getNum);
    },
    handleInputBlur2(type) {
      if (type === 'stake') {
        this.payNum2 = toFixed(this.payNum2, 4);
        return
      }
      this.getNum2 = toFixed(this.getNum2, 4);
    },
    handleIptFocus2(type) {
      const n = type === 'stake' ? Number(this.payNum2) : Number(this.getNum2);
      if (!n) {
        type === 'stake' ? this.payNum2 = '' : this.getNum2 = '';
        return
      }
      type === 'stake' ? this.payNum2 = Number(this.payNum2) : this.getNum2 = Number(this.getNum2);
    },
  },
}
</script>

<style lang="scss" scoped>
.type{
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
    .bonus{
      font-size: 14px;
      color: #42B48F;
      font-weight: 500;
    }
  }
  .formDiv{
    color: #000;
    .label{
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-weight: 500;
    }
    .bgF5{
      background: #f5f5f5;
      padding: 10px 20px;
      border-radius: 8px;
    }
    .progress{
      margin-bottom: 20px;
      /deep/ .el-progress-bar__innerText{
        color: transparent;
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
  }
  .balance{
    margin: 10px 0 20px;
    text-align: right;
    font-size: 12px;
    color: #070707;
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
