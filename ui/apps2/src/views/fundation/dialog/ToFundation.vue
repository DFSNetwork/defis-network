<template>
  <div class="toFundation">
    <img class="close" @click="handleClose()" src="@/assets/img/dialog/sd_icon_btn.svg">
    <div class="title">乐捐款</div>
    <!-- 乐捐弹窗操作 -->
    <div class="symData">
      <div class="info flexb">
        <span @click="handlePercent(1)">{{ $t('public.balance') }}: {{ bal }} {{ thisMarket0.symbol }}</span>
        <span class="type">乐捐款</span>
      </div>
      <div class="iptDiv flexb">
        <div class="coinInfo flex" @click="listenShowDrawer()">
          <div class="coinImg"><img width="100%" :src="thisMarket0.imgUrl" :onerror="errorCoinImg" alt=""></div>
          <div>
            <div class="coin">{{ thisMarket0.symbol }} <i class="el-icon-arrow-down"></i></div>
            <div class="contract tip">{{ thisMarket0.contract }}</div>
          </div>
        </div>
        <div class="inputDiv flexb">
          <el-input class="elIpt" type="number" v-model="payNum" placeholder="0.0"
            @focus="handleFocus()"
            @blur="handleBlur()"></el-input>
        </div>
      </div>
      <!-- 百分比 -->
      <div class="percent flexb">
        <span @click="handlePercent(0)">0%</span>
        <span @click="handlePercent(0.25)">25%</span>
        <span @click="handlePercent(0.5)">50%</span>
        <span @click="handlePercent(0.75)">75%</span>
        <span @click="handlePercent(1)">MAX</span>
      </div>

      <!-- memo -->
      <div class="memoDiv">
        <div class="info">留言</div>
        <div class="iptDiv flexb">
          <input class="input" type="text" v-model="memo" placeholder="请输入留言">
          <span class="randomSpan" @click="handleRandom">随机</span>
        </div>
      </div>
    </div>
    <!-- 按钮 -->
    <div class="btn flexc" @click="handleFundation">确认</div>

    <!-- 弹窗组件 -->
    <el-dialog
      class="mkListDia pcList"
      :append-to-body="true"
      :show-close="false"
      :visible.sync="showMarketList">
      <market-list :marketLists="marketLists" :thisMarket0="thisMarket0"
        :type="'pay'"
        @listenMarketChange="handleMarketChange"
        @listenClose="showMarketList = false"/>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { EosModel } from '@/utils/eos';
import { toFixed } from '@/utils/public';

import MarketList from '@/components/MarketList';

import memes from '@/views/konami/js/memes.js';

export default {
  name: 'toFundation',
  components: {
    MarketList
  },
  data() {
    return {
      errorCoinImg: 'this.src="https://ndi.340wan.com/eos/eosio.token-eos.png"',
      bal: '0',
      payNum: '',
      memo: '',
      thisMarket0: {
        contract: "eosio.token",
        decimal: "4",
        symbol: "EOS",
        imgUrl: 'https://apps.defis.network/static/coin/eosio.token-eos.svg'
      },
      timer: null,
      showMarketList: false,
    }
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  computed: {
    ...mapState({
      scatter: state => state.app.scatter,
      filterMkLists: state => state.sys.filterMkLists,
      marketLists: state => state.sys.marketLists,
    }),
  },
  watch: {
    scatter: {
      handler: function listen(newVal) {
        if (newVal.identity) {
          this.handleBalanTimer();
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    handleRandom() {
      let random = (Math.random() * 9999) % memes.length;
      random = parseInt(random);
      let picked_meme = memes[random];
      this.memo = picked_meme;
    },
    handleClose(type) {
      this.$emit('listenClose', type || false)
    },
    handlePercent(num) {
      const payNum = this.bal * num;
      this.payNum = payNum.toFixed(this.thisMarket0.decimal)
    },
    handleMarketChange(item) {
      this.thisMarket0 = item;
      this.payNum = '';
      this.showMarketList = false;
      this.handleBalanTimer();
    },
    listenShowDrawer() {
      this.showMarketList = true;
    },
    handleFocus() {
      const num = Number(this.payNum);
      if (!num) {
        this.payNum = '';
        return
      }
      this.payNum = Number(this.payNum);
    },
    handleBlur() {
      if (this.payNum === '') {
        return
      }
      this.payNum = toFixed(Number(this.payNum), this.thisMarket0.decimal)
    },
    // 重启余额定时器
    handleBalanTimer() {
      clearInterval(this.timer);
      this.handleGetBalance();
      this.timer = setInterval(() => {
        this.handleGetBalance();
      }, 5000)
    },
    // 获取账户余额
    async handleGetBalance() {
      const params = {
        code: this.thisMarket0.contract,
        coin: this.thisMarket0.symbol,
        decimal: this.thisMarket0.decimal
      };
      await EosModel.getCurrencyBalance(params, res => {
        let balance = toFixed('0.0000000000001', params.decimal);
        (!res || res.length === 0) ? balance : balance = res.split(' ')[0];
        if (params.coin !== this.thisMarket0.symbol || params.code !== this.thisMarket0.contract) {
          this.handleGetBalance()
          return
        }
        this.bal = balance;
      })
    },
    // 去捐款
    handleFundation() {
      if (!Number(this.payNum)) {
        return
      }
      if (Number(this.bal) < Number(this.payNum)) {
        this.$message({
          type: 'error',
          message: this.$t('public.balanLow')
        })
        return 
      }
      this.loading = true;
      const params = {
        code: this.thisMarket0.contract,
        toAccount: 'dfsfundation',
        memo: this.memo,
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
        this.handleClose(true);
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
.toFundation{
  position: relative;
  padding: 20px;
  .close{
    position: absolute;
    right: 20px;
    top: 20px;
    width: 25px;
  }
  .title{
    font-size: 33px;
    color: #333;
    margin: auto;
    margin-bottom: 20px;
    width: 300px;
  }
  .percent{
    margin-top: 20px;
    color: rgba(41,212,176,1);
    font-size: 27px;
    &>span{
      padding: 12px 24px;
      background: #000;
      background: rgba(41,212,176,.2);
      border-radius: 6px;
    }
  }
  .memoDiv{
    margin-top: 20px;
    text-align: left;
    .info{
      margin-bottom: 10px;
    }
    .iptDiv{
      font-size: 30px;
      outline: none;
      border-bottom: 1px solid #eee;
      padding-bottom: 8px;
      .input{
        border: 0px;
        font-size: 30px;
        height: 38px;
        width: 450px;
      }
      .randomSpan{
        padding: 4px 8px;
        border-radius: 3px;
        font-size: 21px;
        color: #ff3100;
        border: 1px solid #ff3100;
      }
    }
  }
  .btn{
    margin: 20px 0 10px;
    height: 88px;
    // background:rgba(7,215,155,1);
    background: #29D4B0;
    border-radius: 48px;
    color: #fff;
    font-size: 32px;
    font-weight: 500;
    &:active{
      background:rgba(2,198,152,1);
    }
  }
}
.symData{
  padding: 16px 30px;
  border-radius: 12px;
  border: 1px solid #F3F3F3;
  &.focus{
    border:1px solid rgba(7,215,155,1);
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
      flex: 2;
      .coinImg{
        width: 60px;
        height: 60px;
        margin-right: 10px;
        border-radius: 60px;
        overflow: hidden;
        display: flex;
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
      flex: 3;
      .elIpt{
        /deep/ .el-input__inner{
          color: $color-black;
          border: 0px;text-align: right;
          font-size: 52px;
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
}

.mkListDia{
  // animation: none;
  /deep/ .el-dialog{
    position: absolute;
    bottom: 0px;
    margin: 0px;
    width: 100%;
    border-radius:12px 12px 0px 0px;
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
      border-radius:12px;
    }
  }
}
</style>
