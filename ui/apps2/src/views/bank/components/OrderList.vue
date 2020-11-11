<template>
  <div>
    <div class="title flexb">
      <span class="act">{{ $t('bank.record') }}</span>
      <div class="flexa usddTip" @click="showUsddTip = true">
        <img class="tipIcon" src="https://cdn.jsdelivr.net/gh/defis-net/material/dex/tip.svg" alt="">
        <span>{{ $t('public.warmPrompt') }}</span>
      </div>
    </div>
    <div class="lists">
      <div class="noData" v-if="!tableData.length">{{ $t('public.noData') }}</div>
      <div class="list" v-for="(item, index) in tableData" :key="index">
        <div class="time flexb">
          <span>{{ item.ctime }}</span>
          <span class="redeem" @click="handleRedeem(item)">{{ $t('bank.redeem') }}</span>
        </div>
        <div class="numData flexb">
          <div class="left">
            <div class="num">{{ item.pledge }}</div>
            <div>
              <span>{{ $t('bank.stakeNum') }}</span>
              <!-- <span>抵押物挖矿</span> -->
            </div>
          </div>
          <div class="right">
            <div class="num">{{ item.issue }}</div>
            <div>{{ $t('bank.borrowNum') }}</div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      class="mkListDia pcList"
      :show-close="true"
      :visible.sync="showUsddTip">
      <usdd-tip />
    </el-dialog>
  </div>
</template>

<script>
import { EosModel } from '@/utils/eos';
import { toLocalTime, toFixed } from '@/utils/public';
import { mapState } from 'vuex';
import moment from 'moment';
import UsddTip from '@/components/UsddTip';

export default {
  components: {
    UsddTip
  },
  data() {
    return {
      tableData: [],
      timer: null,
      balanceSym0: '0.0000',
      showUsddTip: false,
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
    scatter: {
      handler: function listen(newVal) {
        if (newVal.identity) {
          this.handleRowsMint()
        }
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
  },
  beforeDestroy() {
    clearTimeout(this.timer)
  },
  methods: {
    // 生成列表
    handleRowsMint() {
      clearTimeout(this.timer)
      this.handleGetBalance();
      const params = {
        code: this.baseConfig.toAccountJin,
        scope: this.baseConfig.toAccountJin,
        table: 'debts',
        limit: 1000,
        lower_bound: ` ${this.scatter.identity.accounts[0].name}`,
        upper_bound: ` ${this.scatter.identity.accounts[0].name}`,
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
        this.timer = setTimeout(() => {
          this.handleRowsMint();
        }, 20000);
      })
    },
    handleReg(item) {
      // console.log(item)
      if (!item.ableRedeem) {
        return;
      }
      const issue = item.issue.split(' ')[0]
      // console.log(issue, this.balanceSym0)
      if (Number(issue) > Number(this.balanceSym0)) {
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
    async handleGetBalance() {
      const params = {
        code: 'bankofusddv1',
        coin: 'USDD',
        decimal: 4
      };
      await EosModel.getCurrencyBalance(params, res => {
        let balance = toFixed('0.0000000000001', params.decimal);
        (!res || res.length === 0) ? balance : balance = res.split(' ')[0];
        this.balanceSym0 = balance;
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.title{
  font-size: 32px;
  text-align: left;
  margin: 0 0 40px;
  &>span{
    margin-right: 60px;;
  }
  .act{
    color: $color-black;
    position: relative;
    &::before{
      content: '';
      position: absolute;
      width:60px;
      height:8px;
      background:rgba(2,198,152,1);
      border-radius:4px;
      bottom: -20px;
      left: 50%;
      transform: translateX(-45%);
    }
  }
  .usddTip{
    color: #f5a623;
    font-size: 26px;
    .tipIcon{
      width: 32px;
      display: block;
      margin-right: 6px;
    }
  }
}
.lists{
  .noData{
    margin: 100px 0;
    color: #A6A6A6;
    font-size: 24px;
  }
  .list{
    margin-bottom: 20px;
    padding: 32px 28px;
    color: #111;
    font-size: 28px;
    background:rgba(255,255,255,1);
    border-radius:20px;
    border:2px solid rgba(224,224,224,1);
    .time{
      margin-bottom: 16px;
      .redeem{
        color: #42B48F;
      }
    }
    .numData{
      text-align: left;
      .num{
        font-size: 32px;
        font-weight: 500;
        margin-bottom: 8px;
      }
      .right{
        text-align: right;
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