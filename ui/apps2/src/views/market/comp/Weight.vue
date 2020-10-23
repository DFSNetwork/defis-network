<template>
  <div :class="`weight ${handleGetClass(thisMarket.mid)}` ">
    <div class="noPools" @click="handleToSymbolPools">
      <div class="hasPools flexb mb10">
        <div class="flexa">
          <span>{{ $t('mine.earnings') }}： {{ changeReWard || '0.00000000' }} DFS</span>
          <img class="tipIcom" src="@/assets/img/dex/tips_icon_btn.svg" @click.stop="handleShowReWard">
        </div>
        <div v-if="getMinerData && Number(reward)" v-loading="claimLoading"
          class="green" @click.stop="handleClaim">{{ $t('bonus.claim') }}</div>
      </div>

      <div class="tip allApr">
        <span>{{ $t('apy.title') }}: <b>{{ countApy }}%</b></span>
        <span class="green" @click.stop="showApyDetail = true">{{ $t('public.detail') }}></span>
      </div>
      <div class="tip minePerDay">
        <span>{{ $t('mine.poolsMine2', {perDayReward}) }}</span>
        <span>(V3: {{perDayRewardV3}} DFS)</span>
      </div>
    </div>

    <el-dialog
      class="myDialog"
      :visible.sync="showReWardTip">
      <MinReward :minReward="minReward"/>
    </el-dialog>
    <el-dialog
      class="myDialog apy"
      :visible.sync="showApyDetail">
      <MarketApy :countApy="countApy" :feesApr="feesApr" :isActual="true"
                 :apr="apr" :aprV3="aprV3" :lpApy="lpApy" :dmdApy="dmdApy" :timeApy="timeApy"/>
    </el-dialog>
  </div>
</template>

<script>
import { EosModel } from '@/utils/eos';
import { mapState } from 'vuex';
import { toFixed, accAdd, accDiv, dealMinerData, dealReward,
perDayReward, getYfcReward, getDmdMinerHourRoi } from '@/utils/public';
import MinReward from '../popup/MinReward'
import MarketApy from '../popup/MarketApy'
import { timeApy } from '@/utils/minerLogic';
import { perDayRewardV3, getV3PoolsClass } from '@/utils/logic';

export default {
  name: 'Weight',
  components: {
    MinReward,
    MarketApy,
  },
  data() {
    return {
      rankData: null,
      price: '0.0001',
      getMinerData: false,
      minnerData: {},
      cliamNum: '0.00000000',
      reward: '0.0000',
      perDayReward: '0.0000',
      perDayRewardV3: '0.0000',
      changeReWard: '0.00000000',
      dealTimer: null, // 定时器 - 每秒重新计算收益
      addTimer: null, // 定时器 - 收益数字滚动累加
      priceTimer: null, // 价格定时器 - 5分钟执行一次
      joinLoading: false,
      claimLoading: false,
      showReWardTip: false,
      showApyDetail: false,
      lpApy: {},
    }
  },
  props: {
    token: {
      type: String,
      default: '0'
    },
    thisMarket: {
      type: Object,
      default: function tmt() {
        return {}
      }
    },
  },
  computed: {
    ...mapState({
      // 箭头函数可使代码更简练
      // baseConfig: state => state.sys.baseConfig, // 基础配置 - 默认为{}
      rankInfo: state => state.sys.rankInfo, // 交易对权重列表
      damping: state => state.sys.damping,
      scatter: state => state.app.scatter,
      dfsPrice: state => state.sys.dfsPrice,
      storeFeesApr: state => state.sys.feesApr,
      lpMid: state => state.config.lpMid,
      rankInfoV3: state => state.sys.rankInfoV3,
      marketLists: state => state.sys.marketLists,
    }),
    minReward() {
      let min = accDiv(0.0001, this.price)
      if (Number(toFixed(min, 4)) < min) {
        min = accAdd(min, 0.0001)
      }
      return toFixed(min, 4)
    },
    apr() {
      const apr = this.perDayReward * this.dfsPrice / 20000 * 365 * 100;
      return apr.toFixed(2)
    },
    aprV3() {
      const apr = this.perDayRewardV3 * this.dfsPrice / 20000 * 365 * 100;
      return apr.toFixed(2)
    },
    feesApr() {
      const feesApr = this.storeFeesApr.find(v => v.symbol === this.thisMarket.symbol1) || {};
      return parseFloat(feesApr.poolsApr)
    },
    dmdApy() {
      const dmdPool = this.marketLists.find(v => v.mid === 326)
      let dmdRoi = getDmdMinerHourRoi(this.thisMarket, 'year', dmdPool)
      if (Number(dmdRoi)) {
        return dmdRoi;
      }
      return '0.000';
    },
    timeApy() {
      const pool = this.marketLists.find(v => v.mid === 530)
      let apy = timeApy(this.thisMarket, 'year', pool)
      if (Number(apy)) {
        return apy;
      }
      return '0.000';
    },
    countApy() {
      let all = accAdd(parseFloat(this.apr), parseFloat(this.feesApr))
      if (this.dmdApy) {
        all = accAdd(all, parseFloat(this.dmdApy))
      }
      if (this.timeApy) {
        all = accAdd(all, parseFloat(this.timeApy))
      }
      this.lpMid.forEach(v => {
        const apy = this.handleDealApy(v.mid, v.symbol);
        this.lpApy[`${v.symbol.toLowerCase()}Apy`] = apy;
        if (apy) {
          all = accAdd(all, Number(apy))
        }
      })
      if (isNaN(all)) {
        return '—'
      }
      return all.toFixed(2)
    }
  },
  watch: {
    scatter: {
      handler: function listen(newVal) {
        if (newVal.identity) {
          this.handleGetData();
        }
      },
      deep: true,
    },
    token() {
      this.handleGetData();
    },
    rankInfo: {
      handler: function wl(newVal) {
        if (!newVal) {
          return;
        }
        this.handleGetData();
      },
      deep: true,
    },
    rankInfoV3: {
      handler: function wl(newVal) {
        if (!newVal) {
          return;
        }
        this.handleGetData();
      },
      deep: true,
    },
    thisMarket: {
      handler: function tm(newVal, oldVal = {}) {
        if (newVal.mid === oldVal.mid) {
          return;
        }
        this.getMinerData = false;
        clearInterval(this.addTimer)
        setTimeout(() => {
          this.changeReWard = '0.00000000';
          this.reward = '0.0000'
        }, 110)
        this.reward = '0.0000'
        this.changeReWard = '0.00000000';
        this.handleGetData();
      },
      immediate: true,
      deep: true,
    }
  },
  mounted() {
    clearInterval(this.priceTimer)
    this.handleGetPrice()
    this.priceTimer = setInterval(() => {
      this.handleGetPrice()
    }, 300000);
  },
  beforeDestroy() {
    clearInterval(this.addTimer)
    clearInterval(this.dealTimer)
    clearInterval(this.priceTimer)
  },
  methods: {
    handleDealApy(mid = 329, project) {
      let yfcReward = getYfcReward(this.thisMarket.mid, 'year', project);
      if (Number(yfcReward)) {
        const YfcPool = this.marketLists.find(vv => vv.mid === mid);
        const price = parseFloat(YfcPool.reserve0 || 0) / parseFloat(YfcPool.reserve1 || 1)
        yfcReward = yfcReward * price / 20000 * 100;
        yfcReward = yfcReward.toFixed(2);
      }
      return yfcReward || '0.00';
    },
    handleGetClass(mid) {
      return getV3PoolsClass(mid)
    },
    handleToSymbolPools() {
      this.$router.push({
        name: 'poolsMarket',
        params: {
          mid: this.thisMarket.mid
        }
      })
    },
    handleShowReWard() {
      this.showReWardTip = true;
    },
    handleClose() {
      this.showReWardTip = false;
    },
    handleGetData() {
      const rankData = this.rankInfo.find(v => v.mid === this.thisMarket.mid);
      this.rankData = rankData
      if (!this.rankData || !Number(this.price)) {
        return
      }
      this.handleGetMinNum('perDay')
      this.handleGetMiners(this.thisMarket.mid);
    },
    handleStartAdd(reward) {
      this.changeReWard = toFixed(this.reward, 8);
      this.reward = reward;
      clearInterval(this.addTimer)
      const t = (this.reward - this.changeReWard) / 20;
      let changeReWard = this.changeReWard
      this.addTimer = setInterval(() => {
        changeReWard = Number(changeReWard) + t;
        if (changeReWard > Number(this.reward)) {
          this.changeReWard = toFixed(this.reward, 8);
          clearInterval(this.addTimer)
          return
        }
        this.changeReWard = toFixed(changeReWard, 8);
      }, 50);
    },
    // 获取账户做市数据
    handleGetMiners(id = 39) {
      if (!this.$store.state.app.scatter || !this.$store.state.app.scatter.identity) {
        return;
      }
      const formName = this.$store.state.app.scatter.identity.accounts[0].name;
      const params = {
        code: 'miningpool11',
        scope: id,
        table: 'miners',
        // lower_bound: ` dfsdeveloper`,
        // upper_bound: ` dfsdeveloper`,
        lower_bound: ` ${formName}`,
        upper_bound: ` ${formName}`,
        json: true,
      }
      EosModel.getTableRows(params, (res) => {
        this.getMinerData = true;
        const rows = res.rows || []
        if (!rows.length) {
          this.changeReWard = '0.00000000';
          this.reward = '0.0000'
          this.minnerData = {};
          clearInterval(this.addTimer)
          clearInterval(this.dealTimer)
          this.handleGetMinNum('perDay')
          return
        }
        const minnerData = dealMinerData(rows[0], this.thisMarket)
        this.minnerData = minnerData;
        this.handleGetMinNum()
        clearInterval(this.dealTimer)
        this.dealTimer = setInterval(() => {
          this.handleGetMinNum()
        }, 1000);
      })
    },
    // 计算挖矿数量
    handleGetMinNum(status) {
      try {
        if (status === 'perDay') {
          // 每万EOS一天 
          const reward = perDayReward(this.thisMarket.mid)
          this.perDayReward = reward;
          const rewardV3 = perDayRewardV3(this.thisMarket.mid)
          this.perDayRewardV3 = rewardV3
          return
        }
        // 用户实际数据计算
        const reward = dealReward(this.minnerData, this.thisMarket.mid)
        this.handleStartAdd(reward)
      } catch (error) {
        console.log(error)
      }
    },
    // DFS价格 - 5分钟一次
    handleGetPrice() {
      const params = {
        "code": "defislinkeos",
        "scope": "39",
        "table": "avgprices",
        "limit": 3,
        "json": true,
      }
      EosModel.getTableRows(params, (res) => {
        const rows = res.rows || [];
        if (!rows.length) {
          return
        }
        const price = rows.find(v => v.key === 300) || {};
        this.price = price.price1_avg_price / 10000 || 0;
        this.handleGetData();
      })
    },
    handleJoin() {
      this.joinLoading = true;
      const formName = this.$store.state.app.scatter.identity.accounts[0].name;
      const permission = this.$store.state.app.scatter.identity.accounts[0].authority;
      const params = {
        actions: [
          {
            account: 'miningpool11',
            name: 'join',
            authorization: [{
              actor: formName, // 转账者
              permission,
            }],
            data: {
              user: formName,
              mid: this.thisMarket.mid,
            }
          },
        ]
      }
      EosModel.toTransaction(params, (res) => {
        this.joinLoading = false
        if(res.code && JSON.stringify(res.code) !== '{}') {
          this.$message({
            message: res.message,
            type: 'error'
          });
          return
        }
        this.$message({
          message: this.$t('public.success'),
          type: 'success'
        });
      })
    },
    handleClaim() {
      if (Number(this.reward) < Number(this.minReward)) {
        this.showReWardTip = true;
        return
      }
      this.claimLoading = true;
      const formName = this.$store.state.app.scatter.identity.accounts[0].name;
      const permission = this.$store.state.app.scatter.identity.accounts[0].authority;
      const params = {
        actions: [
          {
            account: 'miningpool11',
            name: 'claim',
            authorization: [{
              actor: formName, // 转账者
              permission,
            }],
            data: {
              user: formName,
              mid: this.thisMarket.mid,
            }
          },
        ]
      }
      EosModel.toTransaction(params, (res) => {
        this.claimLoading = false
        if(res.code && JSON.stringify(res.code) !== '{}') {
          this.$message({
            message: res.message,
            type: 'error'
          });
          return
        }
        this.changeReWard = toFixed(0, 8);
        this.reward = 0;
        this.handleGetMiners(this.thisMarket.mid);
        this.$message({
          message: this.$t('public.success'),
          type: 'success'
        });
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.weight{
  background: #FFF;
  padding: 20px;
  margin-top: 40px;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  .allApr{
    color: #000;
  }
  .minePerDay{
    margin-top: 10px;
  }

  .tipIcom{
    width: 30px;
    margin-left: 10px;
  }

  .mb10{
    margin-bottom: 10px;
  }

  .red{
    color: #E9574F;
    margin-left: 4px;
  }

  .green{
    margin-left: 20px;
    color: #07D79B;
  }
  .buffImg{
    width: 30px;
    margin-right: 0px;
  }
}
.myDialog{
  /deep/ .el-dialog{
    position: relative;
    margin: auto;
    width: 570px;
    border-radius: 20px;
    .el-dialog__body,
    .el-dialog__header{
      padding: 0;
    }
  }
  &.apy{
    /deep/ .el-dialog{
      width: 620px;
    }
  }
}
</style>