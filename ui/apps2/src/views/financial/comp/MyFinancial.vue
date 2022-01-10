<template>
  <div class="myFinancial" v-if="accDepInfo.miner">
    <div class="title flexb">
      <span>{{ $t('financial.myDeposit') }}</span>
      <!-- <span class="green">一键领取</span> -->
    </div>
    <div class="lists">
      <div class="list">
        <div class="flexb coinInfo">
          <div class="flexa">
            <img src="https://cdn.jsdelivr.net/gh/defis-net/material2/coin/eosio.token-eos.svg" alt="">
            <span class="coinName">EOS</span>
          </div>
          <div class="btnDiv flexb">
            <div class="btn flexc" @click="handleClaim">{{ $t('financial.reward') }}</div>
            <div class="btn flexc withdraw" @click="showWithdraw = true">{{ $t('financial.withdraw') }}</div>
          </div>
        </div>
        <div class="flexa li dinReg">{{ $t('financial.finPrice') }}：{{ accDepInfo.bal }}</div>
        <div class="flexa li dinReg">
          <span>{{ $t('financial.finReward') }}：</span>
          <span class="green">{{ accDepInfo.showReward || '0.00000000' }} YFC</span>
        </div>
        <div class="flexa li dinReg">
          <span>{{ $t('financial.finTime') }}：
            {{ $t('market.timer', {days: finTime.days, hours: finTime.hours, mins: finTime.minutes, secs: finTime.seconds}) }}
            <!-- {{ finTime.days }}天{{ finTime.hours }}时{{ finTime.minutes }}分{{ finTime.seconds }}秒 -->
          </span>
        </div>
      </div>
    </div>

    <el-dialog
      class="mydialog"
      :show-close="false"
      :visible.sync="showWithdraw">
      <Withdraw  v-if="showWithdraw" @listenClose="handleClose"/>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { EosModel } from '@/utils/eos';
import Withdraw from '../dialog/Withdraw';
import { get_balance } from '@/utils/api'
import { toLocalTime, getMarketTime, toFixed } from '@/utils/public';

export default {
  name: 'myFinancial',
  components: {
    Withdraw,
  },
  props: {
    args: {
      type: Object,
      default: function ag() {
        return {}
      }
    }
  },
  data() {
    return {
      showWithdraw: false,
      accDepInfo: {},
      finTime: {},
      maxReward: '0.00000000',
    }
  },
  beforeDestroy() {
    clearTimeout(this.timer)
    clearInterval(this.runTimer)
  },
  mounted() {
    this.handleGetMaxReward();
  },
  computed: {
    ...mapState({
      scatter: state => state.app.scatter,
      filterMkLists: state => state.sys.filterMkLists,
    }),
  },
  watch: {
    scatter: {
      handler: function st() {
        this.handleGetAccDepInfo()
      },
      immediate: true,
      deep: true
    },
    filterMkLists: {
      handler: function fm(newVal) {
        if (!newVal.length) {
          return
        }
        const market = newVal.find(v => v.mid === 329)
        this.price = parseFloat(market.reserve0) / parseFloat(market.reserve1)
        // console.log(this.price);
        this.handleDealReward();
      },
      deep: true,
      immediate: true,
    },
    args: {
      handler: function fm() {
        this.handleDealReward();
      },
      deep: true,
      immediate: true,
    }
  },
  methods: {
    async handleGetMaxReward() {
      const params = {
        code: 'yfctokenmain',
        symbol: 'YFC',
        decimal: 8,
        account: 'yfcpayoutone',
      }
      const {status, result} = await get_balance(params)
      if (!status) {
        return
      }
      this.maxReward = result.split(' ')[0];
      // console.log(this.maxReward)
    },
    handleClose(type) {
      this.showWithdraw = false;
      if (type) {
        setTimeout(() => {
          this.handleGetAccDepInfo()
        }, 1500);
      }
    },
    // 获取用户理财详情
    async handleGetAccDepInfo() {
      const formName = this.scatter.identity.accounts[0].name;
      const params = {
        "code":"yfcpayoutone",
        "scope":"EOS",
        "table":"miners",
        "json":true,
        "lower_bound": ` ${formName}`,
        "upper_bound": ` ${formName}`,
      }
      const { status, result } = await this.$api.get_table_rows(params);
      if (!status) {
        return
      }
      const rows = result.rows || [];
      if (!rows.length) {
        this.$emit('listenNoDeposit', true);
        return
      }
      this.$emit('listenNoDeposit', false);
      rows.forEach(v => {
        const beginTime = toLocalTime(`${v.join_time}.000+0000`)
        this.$set(v, 'beginTime', beginTime)
        const lastTime = toLocalTime(`${v.last_drip}.000+0000`)
        this.$set(v, 'lastTime', lastTime)
      });
      this.accDepInfo = rows[0];
      this.handleTimer()
    },
    handleTimer() {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.handleTimer();
      }, 1000);
      const long = getMarketTime(this.accDepInfo.beginTime, 'tamp')
      // console.log(long)
      this.finTime = long;
      this.handleDealReward()
    },
    // 计算理财收益
    handleDealReward() {
      if (!Number(this.args.aprs) || !Number(this.finTime.total) || !Number(this.price)) {
        return
      }
      const lastTime = getMarketTime(this.accDepInfo.lastTime, 'tamp')
      const apyAcc = Math.pow(this.args.aprs, lastTime.total / 1000) - 1;
      const yfcPrice = this.price;
      const yfcNum = parseFloat(this.accDepInfo.bal || 0) / yfcPrice;
      let reward = yfcNum * apyAcc;
      if (Number(reward) > Number(this.maxReward)) {
        reward = this.maxReward;
      }
      this.$set(this.accDepInfo, 'reward', toFixed(reward, 8))
      this.handleRewardRun()
    },
    // 数据滚动
    handleRewardRun() {
      if (!Number(this.accDepInfo.reward)) {
        return
      }
      clearInterval(this.runTimer)
      const reward = Number(this.accDepInfo.reward);
      const showReward = this.accDepInfo.showReward || reward;
      let tReward = showReward;
      const t = (Number(reward) - Number(showReward)) / 50;

      this.runTimer = setInterval(() => {
        tReward = Number(t) + Number(tReward)
        if (tReward < 0) {
          this.$set(this.accDepInfo, 'showReward', '0.00000000')
        }
        if (tReward <= reward) {
          this.$set(this.accDepInfo, 'showReward', toFixed(tReward, 8))
        }
        // console.log(tReward)
      }, 20);
    },
    // 领取收益
    handleClaim() {
      const permission = this.scatter.identity.accounts[0].authority;
      const formName = this.scatter.identity.accounts[0].name;
      const params = {
        actions: [{
          account: 'yfcpayoutone',
          name: 'claim',
          authorization: [{
            actor: formName, // 转账者
            permission,
          }],
          data: {
            user: formName,
            sym: 'EOS',
          },
        }],
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
        setTimeout(() => {
          this.handleGetAccDepInfo()
        }, 1500);
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
.myFinancial{
  padding: 44px 32px;
  font-size: 28px;
  color: #333;
  border-bottom: 25px solid #f5f5f5;
  .title{
    font-size: 32px;
  }
  .red{
    color: #FE3B37;
  }
  .green{
    color: #29D4B0;
  }
  .list{
    margin: 42px 0;
    padding: 22px 20px;
    border: 1px solid rgba(220,220,220,0.3);
    border-radius: 20px;
    box-shadow: 0px 20px 40px 0px rgba(220,220,220,0.5);
    &:last-child{
      margin-bottom: 0;
    }
    .coinInfo{
      img{
        width: 52px;
        height: 52px;
        border-radius: 30px;
        margin-right: 15px;
      }
      .coinName{
        color: #000;
        font-weight: 500;;
      }
    }
    .btnDiv{
      .btn{
        padding: 10px 36px;
        margin-right: 18px;
        background: #29D4B0;
        border-radius: 40px;
        color: #FFF;
        font-size: 24px;
        &.withdraw{
          margin-right: 0;
          background: #FE3B37;
        }
      }
    }
    .li{
      margin: 12px 0;
    }
  }
}
</style>
