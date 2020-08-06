<template>
  <div class="borrow">
    <div class="navTitle">
      <span class="title">{{ $t('tab.bank') }}</span>
    </div>
    <!-- 生成 -->
    <el-form  v-if="index === 1" class="formDiv" ref="formBorrow" label-width="0px">
      <!-- 抵押数量 -->
      <el-form-item>
        <div class="label">{{ $t('bank.stake') }}</div>
        <el-input v-model="stakeNum"
          placeholder="0.0"
          @focus="handleIptFocus('stake')"
          @input="handleGetNum" @blur="handleInputBlur('stake')" type="number">
          <span slot="suffix">{{ baseConfig.baseCoin }}</span>
        </el-input>
      </el-form-item>
      <!-- 生成总额 -->
      <el-form-item>
        <div class="label">{{ $t('bank.borrow') }}</div>
        <el-input v-model="generateNum"
          placeholder="0.0"
          @focus="handleIptFocus('mint')"
          @input="handleGetTransNum" @blur="handleInputBlur('mint')" type="number">
          <span slot="suffix">USDD</span>
        </el-input>
      </el-form-item>
    </el-form>

    <!-- 余额 -->
    <div class="balance">
      <span>{{ $t('bank.genFee') }}：0.3%</span>
      <span @click="handleClickBalan">{{ $t('public.balance') }}：{{balanceEos}} {{ baseConfig.baseCoin }}</span>
    </div>
    <el-button class="btn" type="primary" :class="{'unabled': !Number(stakeNum)}"
      v-if="scatter.identity" plain @click="handleTransfer">{{ $t('bank.borrowBtn') }}</el-button>
    <el-button class="btn" type="primary" v-else @click="handleLogin">{{ $t('public.loginPls') }}</el-button>

    <!-- 列表 -->
    <div class="tableList">
      <div class="title">
        <span>{{ $t('bank.record') }}</span>
        <span class="right">{{ $t('public.balance') }}: {{ balanceJin }} USDD</span>
      </div>
      <div class="lists">
        <div class="noDate" v-if="!tableData.length">{{ $t('public.noData') }}</div>
        <div class="list" v-for="(item, index) in tableData" :key="index">
          <div class="left">
            <div>{{ item.ctime }}</div>
            <div>
              <span class="redeem" :class="{'unRedeem': !item.ableRedeem}" @click="handleRedeem(item)">{{ $t('bank.redeem') }}</span>
            </div>
          </div>
          <div class="right">
            <div>
              <div class="subTitle">
                <span>{{ $t('bank.stakeNum') }}</span>
                <!-- <span class="stake" v-if="!item.staked" @click="handleStake(item)">{{ $t('bank.mineStake') }}</span>
                <span class="stakeing" v-else>{{ $t('bank.mining') }}</span> -->
              </div>
              <div class="num">{{ item.pledge }}</div>
            </div>
            <div class="txtRight">
              <div class="subTitle">{{ $t('bank.borrowNum') }}</div>
              <div class="num">{{ item.issue }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 赎回详情 -->
    
    <mining :dateTime="showTime" ref="mining"/>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { EosModel } from '@/utils/eos';
import moment from 'moment';
import { toFixed, toLocalTime, getPrice } from '@/utils/public';
import Mining from './components/Mining';

export default {
  name: 'borrow',
  components: {
    Mining
  },
  data() {
    return {
      stakeNum: '', // 抵押数量 - 4位小数
      rangeValue: 150, // 滑动条数值
      inputRang: '150.00', // 滑动条输入框数值
      generateNum: '', // 生成USN数量
      maxGenerateNum: '0.0000', // 最大可生成
      firstOpen: true, // 账户还未开仓
      showAddStake: false, // 开仓账户勾选增加抵押量 - 默认不勾选
      inputStakeFocus: false, // 新增抵押数量选中
      inputRangFocus: false, // 抵押比率输入框选中 - 默认未选中
      inputGenerateFocus: false, // 生成数量输入框选中 - 默认未选中
      afterActionData: {}, // 操作后数据
      first: true,
      timer: null,
      rangFocus: false,
      loading: false,
      userData: {},
      userOpenStatusVo: { // 用户开仓状态
      },
      price: 2.7600, // 价格
      priceTimer: null, // 价格定时器
      index: 1, // 1 - 生成 | 2 - 偿还
      balanceEos: '0.0000',
      balanceJin: '0.0000',
      tableData: [], // 生成记录
      showTime: '',
    }
  },
  computed:{
     ...mapState({
      // 箭头函数可使代码更简练
      scatter: state => state.app.scatter,
      baseConfig: state => state.sys.baseConfig, // 基础配置 - 默认为{}
    })
  },
  props: {
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
    generateNum(val) {
      if (val === '0.0000') {
        this.generateNum = '';
      }
    },
    stakeNum(val) {
      if (val === '0.0000') {
        this.stakeNum = '';
      }
    },
  },
  mounted() {
    this.handleGetPrice();
    clearInterval(this.priceTimer);
    this.priceTimer = setInterval(() => {
      this.handleGetPrice();
    }, 10000)
  },
  beforeDestroy() {
    clearInterval(this.timer);
    clearInterval(this.priceTimer);
  },
  methods: {
    // 重启余额定时器
    handleBalanTimer() {
      clearInterval(this.timer);
      this.handleRowsMint();
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
        code: this.baseConfig.baseCoinContract,
        coin: this.baseConfig.baseCoin,
        decimal: 4
      };
      if (next) {
        params.code = this.baseConfig.toAccountJin;
        params.coin = 'USDD';
      }
      await EosModel.getCurrencyBalance(params, res => {
        let balance = '0.0000';
        if (!res || res.length === 0) {
          balance = '0.0000'
        } else {
          balance = res.split(' ')[0];
        }
        if (next) {
          this.balanceJin = balance;
          return;
        }
        this.balanceEos = balance;
      })
    },
    // 获取60秒均价
    handleGetPrice() {
      getPrice((price) => {
        this.price = price;
      })
    },
    // 生成列表
    handleRowsMint() {
      const params = {
        code: this.baseConfig.toAccountJin,
        scope: this.baseConfig.toAccountJin,
        table: 'debts',
        limit: 1000,
        lower_bound: this.scatter.identity.accounts[0].name,
        upper_bound: this.scatter.identity.accounts[0].name,
        key_type: 'i64',
        index_position: 2,
        table_key: 'byname',
        json: true
      }
      EosModel.getTableRows(params, (res) => {
        const rows = res.rows || [];
        const list = rows.filter(v => v.owner === this.scatter.identity.accounts[0].name)
        list.forEach((v) => {
          v.ctime = toLocalTime(`${v.create_time}.000+0000`);
          v.staked = !!Number(v.rex_received.split(' ')[0]);
          v.ableRedeemDate = toLocalTime(`${v.rex_maturity}.000+0000`);
          const redeemTime = moment(v.ableRedeemDate).valueOf(); // 解锁时间
          const nowTime = moment().valueOf(); // 当前时间
          v.ableRedeem = redeemTime <= nowTime;
        });
        this.tableData = list.reverse();
      })
    },
    handleReg(item) {
      if (!item.ableRedeem) {
        this.showTime = item.ableRedeemDate;
        this.$refs.mining.showTime = true;
        return;
      }
      const issue = item.issue.split(' ')[0]
      if (Number(issue) > Number(this.balanceJin)) {
        this.$message({
          message: this.$t('public.balanLow'),
          type: 'error'
        })
        return false;
      }
      return true
    },
    // 赎回
    handleRedeem(item) {
      if (!this.handleReg(item)) {
        return
      }
      const params = {
        code: this.baseConfig.toAccountJin,
        toAccount: this.baseConfig.toAccountJin,
        memo: `redeem: ${item.id}`,
        quantity: item.issue
      }
      EosModel.transfer(params, (res) => {
        if(res.code && JSON.stringify(res.code) !== '{}') {
          this.$message({
            message: res.message,
            type: 'error'
          });
          return
        }
        setTimeout(() => {
          this.handleBalanTimer();
          this.handleRowsMint()
        }, 1000);
        this.$message({
          message: this.$t('public.success'),
          type: 'success'
        });
      })
    },
    // 挖矿
    handleStake(item) {
      const params = {
        id: item.id,
      }
      EosModel.stake(params, (res) => {
        if(res.code && JSON.stringify(res.code) !== '{}') {
          this.$message({
            message: res.message,
            type: 'error'
          });
          return
        }
        setTimeout(() => {
          this.handleBalanTimer();
          this.handleRowsMint()
        }, 1000);
        this.$message({
          message: this.$t('public.success'),
          type: 'success'
        });
      });
    },
    // 百分比显示
    formatTooltip(val) {
      return `${val}%`;
    },
    handleLogin() {
      this.$emit('listenLogin', true)
    },
    handleClickBalan() {
      this.stakeNum = this.balanceEos;
      this.handleGetNum();
    },
    // 铸币验证
    handleRegMint() {
      if (!Number(this.stakeNum)) {
        return false
      }
      if (Number(this.stakeNum) < 1) {
        this.$message({
          type: 'error',
          message: this.$t('bank.mininum')
        })
        return false
      }
      if (Number(this.stakeNum) > Number(this.balanceEos)) {
        this.$message({
          type: 'error',
          message: this.$t('public.balanLow')
        })
        return false;
      }
      return true;
    },
    // 铸币
    handleTransfer() {
      if (!this.handleRegMint()) {
        return
      }
      const params = {
        code: this.baseConfig.baseCoinContract,
        toAccount: this.baseConfig.toAccountJin,
        memo: 'mint',
        quantity: `${this.stakeNum} ${this.baseConfig.baseCoin}`
      }
      EosModel.transfer(params, (res) => {
        if(res.code && JSON.stringify(res.code) !== '{}') {
          this.$message({
            message: res.message,
            type: 'error'
          });
          return
        }
        setTimeout(() => {
          this.handleBalanTimer();
          this.handleRowsMint()
        }, 1000);
        this.$message({
          message: this.$t('public.success'),
          type: 'success'
        });
      })
    },
    // 计算生成总额度 - 固定300%质押率
    handleGetNum() {
      const allPrice = this.price * this.stakeNum;
      const getNum = allPrice / 3;
      this.generateNum = toFixed(getNum, 4);
    },
    // 计算转账数量
    handleGetTransNum() {
      const allPrice = this.generateNum * 3;
      const stakeNum = allPrice / this.price;
      this.stakeNum = toFixed(stakeNum, 4);
    },
    handleInputBlur(type) {
      if (type === 'stake') {
        this.stakeNum = toFixed(this.stakeNum, 4);
        return
      }
      this.generateNum = toFixed(this.generateNum, 4);
    },
    handleIptFocus(type) {
      const n = type === 'stake' ? Number(this.stakeNum) : Number(this.generateNum);
      if (!n) {
        type === 'stake' ? this.stakeNum = '' : this.generateNum = '';
        return
      }
      type === 'stake' ? this.stakeNum = Number(this.stakeNum) : this.generateNum = Number(this.generateNum);
    }
  }
}
</script>

<style lang="scss" scoped>
.borrow{
  padding: 20px 18px 0;
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
        font-size: 16px;
      }
    }
  }
  .balance{
    font-size: 12px;
    color: #111111;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
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
  .tableList{
    margin-top: 15px;
    font-size: 14px;
    .title{
      height: 40px;
      display: flex;
      font-size: 16px;
      align-items: center;
      font-weight: 500;
      justify-content: space-between;
      .right{
        font-size: 12px;
        font-weight: normal;
        color: #070707;
      }
    }
    .noDate{
      border-top: 1px solid #DEDEDE;
      color: #999;
      padding-top: 45px;
    }
    .list{
      border-top: 1px solid #DEDEDE;
      padding: 20px 0;
      .left{
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 12px;
        .redeem{
          color: #42B48F;

          &.unRedeem{
            color: #999;
          }
        }
      }
      .right{
        display: flex;
        align-items: center;
        justify-content: space-between;
        text-align: left;
        .subTitle{
          margin-bottom: 5px;
        }
        .stake{
          margin-left: 10px;
          font-size: 12px;
          color: #C16C00;
        }
        .stakeing{
          margin-left: 10px;
          background: #FFEED5;
          border: 1px solid #D29B1B;
          border-radius: 4px;
          font-size: 12px;
          color: #C16C00;
          padding: 2px 14px;
        }
        .num{
          font-size: 16px;
          color: #111111;
        }
        .txtRight{
          text-align: right;
        }
      }
    }
  }
}
</style>
