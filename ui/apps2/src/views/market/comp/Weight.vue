<template>
  <div :class="`weight ${handleGetClass(thisMarket.mid)}` ">
    <div class="noPools" @click="handleToSymbolPools">
      <div class="flexb mb10" v-if="Number(buff) && showAddPools">
        <div class="green" v-loading="joinLoading" v-if="showAddPools" @click.stop="handleJoin">{{ $t('mine.joinNow') }}</div>
      </div>
      <div class="hasPools flexb mb10">
        <div class="flexa">
          <span>{{ $t('mine.earnings') }}： {{ changeReWard || '0.00000000' }} DFS</span>
          <span class="flexa red" v-if="handleGetClass(thisMarket.mid) === '' && Number(buff)">
            <img class="buffImg" src="@/assets/img/poolspage/buff2.svg">
            <span>{{ buff }}%</span>
          </span>
          <img class="tipIcom" src="@/assets/img/dex/tips_icon_btn.svg" @click.stop="handleShowReWard">
        </div>
        <div v-if="getMinerData && Number(reward)" v-loading="claimLoading"
          class="green" @click.stop="handleClaim">{{ $t('bonus.claim') }}</div>
      </div>

      <div class="tip allApr">{{ $t('info.totalApr') }}}: <b>{{ countApy }}%</b></div>
      <div class="tip">
        <span>{{ $t('mine.poolsMine2', {perDayReward}) }}</span>
        <!-- <span>预估挖矿年化收益: {{ apr }}%</span> -->
        <span class="green" v-if="!Number(buff) && showAddPools">{{ $t('mine.joinNow') }}></span>
      </div>
      <div class="tip">{{ $t('mine.mineApr') }}: {{ apr }}%</div>
      <div class="tip" v-if="!isActual && Number(feesApr)">{{ $t('mine.marketFeesApr') }}: {{ feesApr }} %</div>
      <div class="tip" v-if="isActual && Number(feesApr)">{{ $t('mine.marketApr24H') }}: {{ feesApr }} %</div>
      <div class="tip">{{ $t('info.yfcApr') }}}: {{ yfcApy }}%</div>
    </div>

    <el-dialog
      class="myDialog"
      :visible.sync="showReWardTip">
      <MinReward :minReward="minReward"/>
    </el-dialog>
  </div>
</template>

<script>
import { EosModel } from '@/utils/eos';
import { mapState } from 'vuex';
import { toFixed, accSub, accAdd, accMul, accDiv, dealMinerData, dealReward, perDayReward, getPoolApr, getClass, getYfcReward } from '@/utils/public';
import MinReward from '../popup/MinReward'

export default {
  name: 'Weight',
  components: {
    MinReward
  },
  data() {
    return {
      weight: 1,
      price: '0.0001',
      getMinerData: false,
      minnerData: {},
      cliamNum: '0.00000000',
      reward: '0.0000',
      perDayReward: '0.0000',
      changeReWard: '0.00000000',
      dealTimer: null, // 定时器 - 每秒重新计算收益
      addTimer: null, // 定时器 - 收益数字滚动累加
      priceTimer: null, // 价格定时器 - 5分钟执行一次
      joinLoading: false,
      claimLoading: false,
      showReWardTip: false,
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
    marketLists: {
      type: Array,
      default: function tmt() {
        return []
      }
    },
  },
  computed: {
    ...mapState({
      // 箭头函数可使代码更简练
      // baseConfig: state => state.sys.baseConfig, // 基础配置 - 默认为{}
      weightList: state => state.sys.weightList, // 交易对权重列表
      aprs: state => state.sys.aprs,
      damping: state => state.sys.damping,
      scatter: state => state.app.scatter,
      dfsPrice: state => state.sys.dfsPrice,
      storeFeesApr: state => state.sys.feesApr,
    }),
    showAddPools() {
      if (Number(this.token) && !Number(this.minnerData.liq) && this.getMinerData) {
        return true;
      }
      return false
    },
    buff() {
      let t = accSub(this.weight, 1);
      t = accMul(t, 100);
      if (Number(t) < 0) {
        return '0'
      }
      return t.toFixed(0)
    },
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
    feesApr() {
      const feesApr = this.storeFeesApr.find(v => v.symbol === this.thisMarket.symbol1) || {};
      const thisPoolApr = getPoolApr(this.thisMarket)
      return parseFloat(feesApr.poolsApr) > parseFloat(thisPoolApr) ? parseFloat(feesApr.poolsApr) : parseFloat(thisPoolApr)
    },
    isActual() {
      const feesApr = this.storeFeesApr.find(v => v.symbol === this.thisMarket.symbol1) || {}
      const thisPoolApr = getPoolApr(this.thisMarket)
      return parseFloat(feesApr.poolsApr) > parseFloat(thisPoolApr)
    },
    yfcApy() {
      const feesApr = this.storeFeesApr.find(v => v.symbol === this.thisMarket.symbol1) || {}
      const YfcPool = this.marketLists.find(vv => vv.mid === 329);
      const yfcReward = getYfcReward(this.thisMarket.mid, 'year')
      if (Number(yfcReward)) {
        const price = parseFloat(YfcPool.reserve0) / parseFloat(YfcPool.reserve1)
        const apy = yfcReward * price / 20000 * 100;
        feesApr.yfcApr = apy.toFixed(2);
      }
      return feesApr.yfcApr || '0.00';
    },
    countApy() {
      let all = accAdd(parseFloat(this.apr), parseFloat(this.feesApr))
      if (this.yfcApy) {
        all = accAdd(all, parseFloat(this.yfcApy))
      }
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
    weightList: {
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
    handleGetClass(mid) {
      return getClass(mid)
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
      const weightData = this.weightList.find(v => v.mid === this.thisMarket.mid) || {};
      this.weight = weightData.pool_weight || 0;
      if (!Number(this.weight) || !Number(this.price)) {
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
          const reward = perDayReward(this.weight)
          this.perDayReward = reward;
          return
        }
        // 用户实际数据计算
        const reward = dealReward(this.minnerData, this.weight)
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
  padding: 20px 40px;
  margin-top: 40px;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  .allApr{
    color: #000;
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
}
</style>