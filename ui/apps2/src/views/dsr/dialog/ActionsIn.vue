<template>
  <div class="inset">
    <div class="title">存款</div>
    <div class="content">
      <div class="item">
        <div class="info flexb">
          <span @click="handleClickBalan('pay')">{{ $t('public.balance') }}: {{ balance }} {{ thisMarket.symbol }}</span>
          <span class="type">存款</span>
        </div>
        <div class="iptDiv flexb">
          <div class="coinInfo flex">
            <div class="coinImg"><img width="100%" :src="thisMarket.imgUrl" :onerror="errorCoinImg" alt=""></div>
            <div>
              <div class="coin">{{ thisMarket.symbol }}</div>
              <div class="contract tip">{{ thisMarket.contract }}</div>
            </div>
          </div>
          <div class="inputDiv">
            <el-input class="elIpt" type="number" v-model="payNum" placeholder="0.0"
              @input="handleInBy('pay')"
              @focus="handleFocus('pay')"
              @blur="handleBlur('pay')"></el-input>
          </div>
        </div>
        <div class="time flexb">
          <span>存款时间</span>
          <el-select
            class="select"
            v-model="value" placeholder="请选择"
            :popper-append-to-body="false"
            :popper-class="'mySelectItem'">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="about tip">
        预计年化收益: {{aboutNum}} DFS
      </div>
    </div>
    <div class="btnDiv">
      <div class="btn flexc" @click="handleShowSure">确认</div>
    </div>

    <div class="rules">
      <div class="subTitle">存款规则</div>
      <div class="rules">
        <div>存款时，可以选择存款时间，目前有以下五档可供选择</div>
        <ul class="subRules">
          <li>随存随取，年化{{handleApr(0)}}%</li>
          <li>1月，年化 {{handleApr(1)}}%</li>
          <li>3月，年化 {{handleApr(2)}}%</li>
          <li>6月，年化 {{handleApr(3)}}%</li>
          <li>1年，年化 {{handleApr(4)}}%</li>
        </ul>
      </div>
      <div class="spcRules rules">*注：已有存款时只能选择同期或者更长的存款时间，且到期时间以最后一次存款时间计算。</div>
    </div>
    <el-dialog
      class="myDialog"
      append-to-body
      :show-close="false"
      :visible="showSure">
      <ActionsInSure :params="sureData" @listenClose="handleClose" @listenSure="handleTransfer"/>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { EosModel } from '@/utils/eos';
import { toFixed, accMul, accAdd, accDiv, toLocalTime } from '@/utils/public';
import ActionsInSure from './ActionsInSure';

export default {
  components: {
    ActionsInSure
  },
  data() {
    return {
      errorCoinImg: 'this.src="https://ndi.340wan.com/eos/eosio.token-eos.png"',
      payNum: '',
      balance: '0.0000',
      apr: 5,
      showSure: false,
      thisMarket: {
        symbol: 'DFS',
        contract: 'minedfstoken',
        decimal: 4,
        imgUrl: 'https://ndi.340wan.com/eos/minedfstoken-dfs.png'
      },
      options: [{
        value: '0',
        label: '随存随取',
        day: '0',
      }, {
        value: '1',
        label: '1月',
        day: '30',
      }, {
        value: '2',
        label: '3月',
        day: '90',
      }, {
        value: '3',
        label: '6月',
        day: '180',
      }, {
        value: '4',
        label: '1年',
        day: '365',
      }],
      value: '0',
      sureData: {},
      aboutReleasrDate: '',
    }
  },
  props: {
    myDepositInfo: {
      type: Object,
      default: function mdi() {
        return {}
      }
    },
    yearApr: {
      type: String,
      default: '5.00'
    }
  },
  computed: {
    ...mapState({
      scatter: state => state.app.scatter,
    }),
    timeApr() {
      return this.handleApr(this.value);
    },
    aboutNum() {
      let about = accMul(this.timeApr, Number(this.payNum));
      about = accDiv(about, 100)
      return toFixed(about, 4)
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
    value: {
      handler: function listen() {
        this.handleDealDate()
      },
      deep: true,
      immediate: true,
    }
  },
  methods: {
    handleDealDate() {
      if (this.value === '0') {
        this.aboutReleasrDate = '';
        return
      }
      const curDate = (new Date()).getTime();
      let addTime = this.options[Number(this.value)].day;
      addTime = addTime * 24 * 3600 * 1000;
      const threeMonths = curDate + addTime;
      this.aboutReleasrDate = toLocalTime(threeMonths);
    },
    handleApr(value) {
      if (!Number(value)) {
        return this.yearApr;
      }
      const buff = [0, 0.05, 0.1, 0.2, 0.5]
      let newApr = accMul(this.yearApr, buff[Number(value)]);
      newApr = accAdd(newApr, this.yearApr)
      return toFixed(newApr, 2)
    },
    handleClose() {
      this.showSure = false;
    },
    handleShowSure() {
      this.showSure = true;
      let total = accAdd(parseFloat(this.myDepositInfo.bal), this.payNum);
      total = `${toFixed(total, 4)}`;
      this.sureData = {
        payNum: this.payNum,
        dateLong: this.options[Number(this.value)].label,
        hasNum: this.myDepositInfo.bal,
        total,
        endDate: this.aboutReleasrDate.substr(0, 10),
      }
    },
    handleInBy() {
    },
    handleFocus() {
      const n = Number(this.payNum);
      n > 0 ? this.payNum = n : this.payNum = '';
    },
    handleBlur() {
      const n = Number(this.payNum);
      n > 0 ? this.payNum = toFixed(n, 4) : this.payNum = '';
    },
    handleClickBalan() {
      this.payNum = this.balance;
    },
    // 铸币
    handleTransfer() {
      this.loading = true;
      const memo = `deposit:${Number(this.value)}`;
      const params = {
        code: 'minedfstoken',
        toAccount: 'dfsdsrsystem',
        memo,
        quantity: `${this.payNum} DFS`
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
        this.payNum = '';
        this.handleBalanTimer();
        this.showSure = false;
        this.$message({
          message: this.$t('public.success'),
          type: 'success'
        });
      })
    },
    // 重启余额定时器
    handleBalanTimer() {
      clearInterval(this.timer);
      this.handleGetBalance();
      this.timer = setInterval(() => {
        this.handleGetBalance();
      }, 20000)
    },
    // 获取账户余额
    async handleGetBalance() {
      const params = {
        code: this.thisMarket.contract,
        coin: this.thisMarket.symbol,
        decimal: this.thisMarket.decimal
      };
      await EosModel.getCurrencyBalance(params, res => {
        let balance = toFixed('0.000000001', params.decimal);
        (!res || res.length === 0) ? balance : balance = res.split(' ')[0];
        this.balance = balance;
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.inset{
  padding: 40px;
  .title{
    font-size: 32px;
    color: rgba(7,215,155,1);
    margin-bottom: 20px;
  }
  .item{
    padding: 20px;
    border: 1px solid #f3f3f3;
    border-radius: 30px;
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
        flex: 3;
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
        flex: 4;
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
    .time{
      margin: 20px 0 0;
      font-size: 26px;
      .select{
        height: 60px
      }
      /deep/ .el-select{
        .el-input__suffix-inner{
          display: flex;
          align-items: center;
          height: 60px;
        }
        .el-input__inner{
          height: 60px;
          font-size: 26px;
          text-align: right;
          width: 160px;
          border: 0px;
          padding-right: 38px;
          &:focus{
            border-color: #07d79b;
          }
        }
      }
      /deep/ .el-scrollbar{
        .el-select-dropdown__item{
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 26px;
          font-weight: normal;
          &.selected{
            font-weight: bold;
            color: #07d79b;
          }
        }
      }
    }
  }
  .about{
    font-size: 26px;
    margin: 20px;
    text-align: left;
  }
}
.btnDiv{
  margin: 40px 0;
  font-size: 32px;
  font-weight: 500;
  .btn{
    height: 88px;
    background:rgba(7,215,155,1);
    border-radius:30px;
    color: #fff;
    &:active{
      background:rgba(2,198,152,1);
    }
  }
}
.rules{
  text-align: left;
  font-size: 26px;
  .subTitle{
    font-size: 28px;
    font-weight: bold;
    color: #000;
  }
  .rules{
    padding: 5px 0;
    &:last-child{
      padding-bottom: 0;
    }
    .subRules{
      padding: 5px 0 5px 40px;
    }
  }
  .spcRules{
    color: #f5a623;;
  }
}
.myDialog{
  /deep/ .el-dialog{
    position: relative;
    margin: auto;
    width: 650px;
    border-radius: 20px;
    .el-dialog__body,
    .el-dialog__header{
      padding: 0;
    }
  }
}
</style>
