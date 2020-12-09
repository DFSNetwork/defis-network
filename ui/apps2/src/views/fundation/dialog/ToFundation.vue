<template>
  <div class="toFundation">
    <img class="close" @click="handleClose()" src="https://cdn.jsdelivr.net/gh/defis-net/material/svg/sd_icon_btn.svg">
    <div class="title">
      <span v-if="$route.name !== 'nodePools'">{{ $t('fundation.funTran') }}</span>
      <span v-else>乐捐助力</span>
    </div>
    <!-- 乐捐弹窗操作 -->
    <div class="symData">
      <div class="info flexb">
        <span @click="handlePercent(1)">{{ $t('public.balance') }}: {{ bal }} {{ thisMarket0.symbol }}</span>
        <span class="type">{{ $t('fundation.funTran') }}</span>
      </div>
      <div class="iptDiv flexb">
        <div class="coinInfo flex" @click="listenShowDrawer()">
          <div class="coinImg"><img width="100%" :src="thisMarket0.imgUrl" :onerror="errorCoinImg" alt=""></div>
          <div>
            <div class="coin">{{ thisMarket0.symbol }} <i class="el-icon-arrow-down"></i></div>
            <div class="contract tip">{{ thisMarket0.contract }}</div>
          </div>
        </div>
        <div class="inputDiv flexb dinBold">
          <el-input class="elIpt" type="number" v-model="payNum" placeholder="0.0"
            @focus="handleFocus()"
            @blur="handleBlur()"></el-input>
        </div>
      </div>
      <!-- 百分比 -->
      <div class="percent flexb din">
        <span :class="{'act': percent === 0}" @click="handlePercent(0)">0%</span>
        <span :class="{'act': percent === 0.25}" @click="handlePercent(0.25)">25%</span>
        <span :class="{'act': percent === 0.5}" @click="handlePercent(0.5)">50%</span>
        <span :class="{'act': percent === 0.75}" @click="handlePercent(0.75)">75%</span>
        <span :class="{'act': percent === 1}" @click="handlePercent(1)">MAX</span>
      </div>

      <!-- memo -->
      <div class="memoDiv">
        <div class="info flexb">
          <span>{{ $t('fundation.memoshort') }}</span>
          <span class="randomSpan flexa" @click="handleRandom">
            <img src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/refresh.png">
            <span>{{ $t('fundation.random') }}</span>
          </span>
        </div>
        <div class="iptDiv">
          <van-field
            class="input"
            v-model="memo"
            rows="1"
            autosize
            type="textarea"
            :placeholder="reply.global_action_seq ? `${$t('fundation.reply')} ${replyto}` : $t('fundation.iptTip')"
          />
          <div class="iptlen">{{sizeof}}/256</div>
        </div>
      </div>
    </div>
    <!-- 按钮 -->
    <div class="btn flexc" @click="handleFundation">{{ $t('public.confirm') }}</div>

    <!-- 弹窗组件 -->
    <el-dialog
      custom-class="mkListDia"
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
  props: {
    reply: { // 主楼
      type: Object,
      default: function rp() {
        return {}
      },
    },
    replyItem: { // 主楼下的回复
      type: Object,
      default: function rp() {
        return {}
      },
    },
    setCoin: {
      type: Object,
      default: function rp() {
        return {}
      },
    }
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
      percent: 0,
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
    sizeof(){
      const str = this.memo;
      let total = 0,
          charCode,
          i,
          len;
      for(i = 0, len = str.length; i < len; i++){
          charCode = str.charCodeAt(i);
          if(charCode <= 0x007f) {
              total += 1;
          }else if(charCode <= 0x07ff){
              total += 2;
          }else if(charCode <= 0xffff){
              total += 3;
          }else{
              total += 4;
          }
      }
      return total;
    },
    replyto() {
      if (this.replyItem.fromx) {
        return this.replyItem.fromx
      }
      return this.reply.fromx;
    }
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
    memo(newVal, oldVal) {
      if (this.sizeof > 256) {
        this.memo = oldVal
      }
    },
    setCoin: {
      handler: function listen(newVal) {
        if (!newVal.mid) {
          return
        }
        this.thisMarket0 = {
          contract: newVal.contract,
          decimal: newVal.decimal,
          symbol: newVal.sym,
          imgUrl: newVal.imgUrl,
        }
      },
      deep: true,
      immediate: true,
    }
  },
  methods: {
    handleRandom() {
      let random = (Math.random() * 9999) % memes.length;
      random = parseInt(random);
      let picked_meme = memes[random];
      if(picked_meme.length > 100) {
        this.handleRandom()
        return
      }
      this.memo = picked_meme;
    },
    handleClose(type) {
      this.$emit('listenClose', type || false)
    },
    handlePercent(num) {
      this.percent = num;
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
      const formName = this.scatter.identity.accounts[0].name;
      const permission = this.scatter.identity.accounts[0].authority;

      const quantity = `${this.payNum} ${this.thisMarket0.symbol}`;
      const transfer = {
        account: this.thisMarket0.contract,
        name: 'transfer',
        authorization: [{
          actor: formName, // 转账者
          permission,
        }],
        data: {
          from: formName,
          to: 'dfsfundation',
          memo: this.memo,
          quantity,
        }
      }
      const params = {
        actions: [transfer],
      }
      if (this.reply.fromx) {
        const replyAction = {
          account: 'dfscommunity',
          name: 'submit',
          authorization: [{
            actor: formName, // 转账者
            permission,
          }],
          data: {
            user: formName,
            author: this.replyto,
            target0: this.replyItem.global_action_seq || this.reply.global_action_seq,
            target1: this.reply.global_action_seq,
            memo: this.memo,
            code: this.thisMarket0.contract,
            quantity,
            type: 'reply'
          }
        }
        params.actions.unshift(replyAction)
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
  padding: 28px;
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
    text-align: center;
  }
  .percent{
    margin-top: 20px;
    color: #333;
    font-size: 27px;
    &>span{
      padding: 12px 24px;
      border: 1px solid rgba(#333, .1);
      border-radius: 6px;
      &.act{
        background: rgba(41,212,176,.2);
        color: rgba(41,212,176,1);
        border: 1px solid rgba(#11AE8D, .2);
      }
    }
  }
  .memoDiv{
    margin-top: 35px;
    text-align: left;
    font-size: 28px;
    .info{
      margin-bottom: 18px;
      .randomSpan{
        padding: 4px 8px;
        border-radius: 3px;
        // font-size: 21px;
        color: #ff3100;
        // border: 1px solid #ff3100;
        img{
          width: 32px;
          margin-right: 8px;
        }
      }
    }
    .iptDiv{
      font-size: 30px;
      outline: none;
      background: #F5F5F5;
      border-radius: 8px;
      margin-bottom: 38px;
      // border-bottom: 1px solid #eee;
      padding: 20px;
      /deep/ .van-cell::after{
        border: 0;
      }
      .input{
        padding: 0;
        border: 0px;
        font-size: 30px;
        background: #F5F5F5;
      }
      .iptlen{
        text-align: right;
        font-size: 24px;
        color: #666;
        right: 0px;
        bottom: 5px;
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
  // padding: 16px 30px;
  border-radius: 12px;
  // border: 1px solid #F3F3F3;
  &.focus{
    border:1px solid rgba(7,215,155,1);
  }
  .info{
    font-size: 24px;
    margin-bottom: 24px;
    // .type{
    //   font-size: 28px;
    // }
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
  z-index: 10000 !important;
  /deep/ .el-dialog{
    z-index: 10000;
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
