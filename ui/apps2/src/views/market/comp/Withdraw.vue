<template>
  <div class="removeMarket">
    <div class="title">
      <span>{{ $t('more.remove') }}</span>
      <img class="closeSvg" @click="handleClose" src="https://cdn.jsdelivr.net/gh/defis-net/material/svg/sd_icon_btn.svg" alt="">
    </div>
    <!-- 输入数据 -->
    <div class="iptDiv">
      <div class="token">
        <div class="flexb">
          <span class="name">{{ $t('pools.token') }}</span>
          <span class="green">{{ $t('pools.ableToken') }}：{{ token }}</span>
        </div>
        <div>
          <el-input class="ipt dinBold" v-model="sToken" placeholder="0"
            @input="handleSellToken"
            @focus="handleFocus()"
            @blur="handleBlur()"></el-input>
        </div>
      </div>
      <div class="percent flexb green dinBold">
        <span class="flexc" @click="handlePercent(0)">0%</span>
        <span class="flexc" @click="handlePercent(0.25)">25%</span>
        <span class="flexc" @click="handlePercent(0.5)">50%</span>
        <span class="flexc" @click="handlePercent(0.75)">75%</span>
        <span class="flexc" @click="handlePercent(1)">MAX</span>
      </div>
    </div>
    <!-- 用户操作数据 -->
    <div class="dataDiv">
      <div class="myMarket">
        <div class="tip">{{ $t('mine.accPools') }}</div>
        <div class="num din">{{ toFixed(accPools.getNum1, thisMarket.decimal0) }} {{thisMarket.symbol0}}
          / {{ toFixed(accPools.getNum2, thisMarket.decimal1) }} {{thisMarket.symbol1}}</div>
      </div>
      <div class="myMarket">
        <div class="tip">{{ $t('more.wdAssets') }}</div>
        <div class="coinData flexb">
          <div class="flexa">
            <img class="coinImg" :onerror="errorCoinImg" :src="thisMarket.sym0Data.imgUrl" >
            <span>{{ thisMarket.symbol0 }}</span>
          </div>
          <div class="din">{{ getNum1 }} {{ thisMarket.symbol0 }}</div>
        </div>
        <div class="coinData flexb">
          <div class="flexa">
            <img class="coinImg" :onerror="errorCoinImg" :src="thisMarket.sym1Data.imgUrl" >
            <span>{{ thisMarket.symbol1 }}</span>
          </div>
          <div class="din">{{ getNum2 }} {{ thisMarket.symbol1 }}</div>
        </div>
      </div>
    </div>

    <!-- 按钮 -->
    <div class="btnDiv" v-loading="loading">
      <div class="btn flexc" @click="handleToSell">{{ $t('public.confirm') }}</div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { EosModel } from '@/utils/eos';

import { toFixed, accDiv, accMul } from '@/utils/public';
import { sellToken } from '@/utils/logic';

export default {
  name: 'withdraw',
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
      sToken: '',
      token: 0,
      // thisMarket: {
      //   mid: 17,
      //   symbol0: 'EOS',
      //   contract0: 'eosio.token',
      //   symbol1: 'USDT',
      //   contract1: 'tethertether',
      //   sym0Data:{
      //     imgUrl: 'https://apps.defis.network/static/coin/eosio.token-eos.svg'
      //   },
      //   sym1Data:{
      //     imgUrl: 'https://apps.defis.network/static/coin/tethertether-usdt.svg'
      //   }
      // },
      getNum1: '0.0000',
      getNum2: '0.0000',
      loading: false,
    }
  },
  computed: {
    ...mapState({
      scatter: state => state.app.scatter,
      baseConfig: state => state.sys.baseConfig,
      marketLists: state => state.sys.marketLists,
    }),
    accPools() {
      if (!this.thisMarket.reserve0 || !this.thisMarket.reserve1) {
        return {}
      }
      const inData = {
        poolSym0: this.thisMarket.reserve0.split(' ')[0],
        poolSym1: this.thisMarket.reserve1.split(' ')[0],
        poolToken: this.thisMarket.liquidity_token,
        sellToken: this.token
      }
      const outData = sellToken(inData);
      return outData
    },
  },
  watch: {
    marketLists: {
      handler: function ml(newVal) {
        if (!newVal.length) {
          return
        }
        // this.thisMarket.mid = this.$route.params.mid || 39;
        const thisMarket = newVal.find(v => v.mid === Number(this.thisMarket.mid)) || newVal[0];
        // const thisMarket = newVal[0];
        const reserve0 = thisMarket.reserve0.split(' ')[0];
        const reserve1 = thisMarket.reserve1.split(' ')[0];
        this.thisMarket.sym0Rate = toFixed(accDiv(reserve1, reserve0), thisMarket.decimal1)
        this.thisMarket.sym1Rate = toFixed(accDiv(reserve0, reserve1), thisMarket.decimal0)
        // this.thisMarket = thisMarket;
        this.handleGetAccToken();
      },
      deep: true,
      immediate: true
    },
    scatter: {
      handler: function listen(newVal) {
        if (newVal.identity) {
          this.handleGetAccToken();
        }
      },
      deep: true,
      immediate: true,
    },
    sToken(val) {
      if (!Number(val)) {
        this.sToken = ''
      }
    },
  },
  methods: {
    handleClose() {
      this.$emit('listenClose', false)
    },
    handlePercent(num) {
      const n = accMul(this.token, num);
      this.sToken = n.toFixed(0)
      this.handleSellToken()
    },
    // 计算卖出凭证
    handleSellToken() {
      const inData = {
        poolSym0: this.thisMarket.reserve0.split(' ')[0],
        poolSym1: this.thisMarket.reserve1.split(' ')[0],
        poolToken: this.thisMarket.liquidity_token,
        sellToken: this.sToken
      }
      const outData = sellToken(inData);
      this.getNum1 = toFixed(outData.getNum1, this.thisMarket.decimal0);
      this.getNum2 = toFixed(outData.getNum2, this.thisMarket.decimal1);
    },
    handleFocus() {
      const n = Number(this.sToken);
      if (!n) {
        this.sToken = '';
        return
      }
      this.sToken = n;
    },
    handleBlur() {
      this.sToken = parseInt(this.sToken);
    },
    toFixed(n, l) {
      return toFixed(n, l)
    },
    regInit() {
      if (this.scatter.identity && this.marketLists.length) {
        return true;
      }
      return false;
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
      })
    },
    handleRegSell() {
      if (!Number(this.sToken)) {
        return false;
      }
      if (Number(this.sToken) > Number(this.token)) {
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
      const formName = this.scatter.identity.accounts[0].name;
      const permission = this.scatter.identity.accounts[0].authority;
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
              amount: this.sToken
            }
          },
        ]
      }
      EosModel.toTransaction(params, (res) => {
        this.loading = false
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
          this.handleGetAccToken();
        }, 1000);
        this.$message({
          message: this.$t('public.success'),
          type: 'success'
        });
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.removeMarket{
  padding: 30px 26px;
}
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
.iptDiv{
  margin: 30px 0;
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 26px;
  font-size: 26px;
  .token{
    border-bottom: 1px solid #eee;
    margin-bottom: 25px;
    .name{
      font-size: 30px;
      font-weight: 500;
    }
    .ipt{
      height: 90px;
      /deep/ .el-input__inner{
        color: $color-black;
        border: 0px;
        font-size: 32px;
        padding: 0;
        height: 90px;
      }
    }
  }
  .percent{
    &>span{
      height: 56px;
      background: rgba(#29D4B0, .2);
      border-radius: 5px;
      width: 92px;
      font-size: 28px;
    }
  }
  .green{
    color: #29D4B0;
  }
}
.dataDiv{
  padding: 0 0px 30px;
  font-size: 26px;
  color: #333;
  text-align: left;
  .myMarket{
    margin-bottom: 16px;
    .tip{
      margin-bottom: 4px;
    }
    .coinData{
      height: 100px;
      border-bottom: 1px solid #eee;
    }
    .coinImg{
      width: 48px;
      // height: 48px;
      display: block;
      margin-right: 10px;
    }
  }
}
.btnDiv{
  // margin: 30px;
  .btn{
    height:88px;
    background:#29D4B0;
    border-radius: 48px;
    font-size:32px;
    color: #FFF;

    &:active{
      background:rgba(2,198,152,1);
    }
    &.disabled{
      background:rgba(#29D4B0, .5);
    }
  }
}
</style>
