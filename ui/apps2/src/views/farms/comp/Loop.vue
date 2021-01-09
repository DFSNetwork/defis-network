<template>
  <div class="lists flexa" v-loading="loading">
    <div class="coinDiv flexc">
      <img class="coin" src="https://cdn.jsdelivr.net/gh/defis-net/material/coin/looptoken123-loop.png" alt="">
    </div>
    <div class="f1">
      <div class="projectName flexb">
        <span>LOOP葫芦</span>
        <span class="claim green" v-loading="claiming || allClaiming" @click.stop="handleClaim">领取</span>
      </div>
      <div class="reward">
        <span>收益：</span>
        <span>{{ allClaim }} LOOP</span>
      </div>
      <div class="about">
        <span>≈ {{ aboutEos }} EOS</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { EosModel } from '@/utils/eos';
import { toFixed, accAdd } from '@/utils/public';
import moment from 'moment';
export default {
  name: 'loop',
  props: {
    allClaiming: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      loading: true,
      loopBal: '0.00000000',
      weightList: [],
      accMine: [],
      timer: null,
      timerArr: [],
      claiming: false,
      mid: 424, // dfs: 39 | DMD: 326 | YFC: 329 | DBC: 346 | LOOP: 424
      marketData: {},
    }
  },
  mounted() {
    this.handleGetLoopBal()
    this.handleGetLoopWeight()
  },
  beforeDestroy() {
    clearTimeout(this.timer)
    this.timerArr.forEach(v => {
      clearInterval(v)
    })
  },
  computed: {
    ...mapState({
      scatter: state => state.app.scatter,
      poolsBal: state => state.sys.poolsBal,
      marketLists: state => state.sys.marketLists,
    }),
    allClaim() {
      if (!this.accMine.length) {
        return '0.00000000'
      }
      let all = 0;
      this.accMine.forEach(v => {
        all = accAdd(all, v.showReward || 0)
      })
      return all.toFixed(8)
    },
    aboutEos() {
      const price = parseFloat(this.marketData.reserve0) / parseFloat(this.marketData.reserve1) || 0;
      const num = price * this.allClaim;
      return toFixed(num, 4)
    },
  },
  watch: {
    marketLists: {
      handler: function ml(newVal) {
        this.marketData = newVal.find(v => v.mid === this.mid) || {}
      },
      deep: true,
      immediate: true,
    },
    scatter: {
      handler: function listen(newVal) {
        if (newVal.identity) {
          this.handleGetAccMineData()
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    handleClaim() {
      if (this.allClaiming || this.claiming) {
        return
      }
      const actions = this.handleGetActions()
      if (!actions.length) {
        return
      }
      this.claiming = true;
      const params = {
        actions,
      }
      EosModel.toTransaction(params, (res) => {
        this.claiming = false;
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
        setTimeout(() => {
          this.handleGetUnclaim()
        }, 1000);
      })
    },
    handleGetActions() {
      const actions = [];
      const formName = this.scatter.identity.accounts[0].name;
      const permission = this.scatter.identity.accounts[0].authority;
      this.accMine.forEach(v => {
        if (!v.showReward || !Number(v.showReward)) {
          return
        }
        const action = {
          account: 'loopminepool',
          name: 'picking',
          authorization: [{
            actor: formName, // 转账者
            permission,
          }],
          data: {
            user: formName,
            mid: v.mid,
            ifbonus: 0
          }
        }
        actions.push(action)
      })
      // console.log(actions)
      return actions;
    },
    // //mining_amount = 挖矿池HULU余额的十万分之一 * 做市资金占比 * 做市时间 * 菜地权重 * 暴击因子; 
    handleGetLoopBal() {
      const params = {
        "code":"looptoken123",
        "symbol":"LOOP",
        "account":"loopminepool"
      }
      EosModel.getCurrencyBalance(params, (res) => {
        let bal = toFixed('0.0000000000001', params.decimal);
        (!res || res.length === 0) ? bal : bal = res.split(' ')[0];
        this.loopBal = bal;
        // console.log(bal)
      })
    },
    handleGetLoopWeight() {
      const params ={
        "code":"loopminepool",
        "scope":"loopminepool",
        "table":"lands",
        "json":true,
        "limit":10
      }
      EosModel.getTableRows(params, (res) => {
        const rows = res.rows || []
        if (!rows.length) {
          return
        }
        this.weightList = rows;
        // console.log(rows)
        this.handleGetAccMineData()
      })
    },
    handleGetAccMineData() {
      if (!this.scatter || !this.scatter.identity || !this.weightList.length) {
        return
      }
      const formName = this.scatter.identity.accounts[0].name;
      this.weightList.forEach((v, index) => {
        const nt = moment().valueOf() / 1000;
        if (v.start > nt || v.end <= nt) {
          return
        }
        setTimeout(() => {
          // console.log(v, index)
          const params = {
            "code": "loopminepool",
            "json": true,
            "scope": v.mid,
            "table": "miners",
            "lower_bound": ` ${formName}`,
            "upper_bound": ` ${formName}`,
          }
          EosModel.getTableRows(params, (res) => {
            const rows = res.rows || []
            this.loading = false;
            if (!rows.length) {
              return
            }
            const index = this.accMine.findIndex(vv => vv.mid === v.mid)
            const newItem = Object.assign({}, rows[0], v)
            if (index !== -1) {
              this.accMine.splice(index, 1, newItem)
            } else {
              this.accMine.push(newItem)
            }
            this.handleDealReward();
          })
        }, index * 200)
      })
    },
    // 计算收益
    handleDealReward() {
      if (!this.weightList.length || !this.accMine.length || !this.loopBal || !this.poolsBal) {
        return
      }
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.handleDealReward();
      }, 1000);
      this.timerArr.forEach(v => {
        clearInterval(v)
      })
      this.accMine.forEach((v, index) => {
        const time = moment().valueOf() / 1000 - v.last_drip;
        const mineEos = v.liq_bal0.indexOf('EOS') !== -1 ? parseInt(v.liq_bal0) : parseInt(v.liq_bal1)
        const reward = (this.loopBal / 100000) * time * (mineEos/this.poolsBal) * Number(v.weight) * 0.97;
        clearInterval(this.timerArr[index]);
        let showReward = v.reward || 0;
        let tShowReward = Number(showReward);
        const t = (reward - showReward) / 20;
        this.$set(v, 'reward', reward);
        this.timerArr[index] = setInterval(() => {
          tShowReward = tShowReward + t;
          showReward = tShowReward
          if (Number(showReward) <= 0) {
            this.$set(v, 'showReward', 0)
            return
          }
          if (Number(showReward >= reward)) {
            showReward = reward;
          }
          this.$set(v, 'showReward', showReward)
        }, 50)
      })
    }
  },
}
</script>

<style lang="scss" scoped>
@import './comp.scss';
</style>
