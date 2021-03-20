<template>
  <div class="lists flexa" v-loading="loading">
    <div class="coinDiv flexc">
      <img class="coin" src="https://cdn.jsdelivr.net/gh/defis-net/material2/coin/minedfstoken-dfs.png" alt="">
    </div>
    <div class="f1">
      <div class="projectName flexb">
        <span>DFS矿池</span>
        <span class="claim green" v-loading="claiming || allClaiming" @click.stop="handleClaim">领取</span>
      </div>
      <div class="reward">
        <span>收益：</span>
        <span>{{ allReward }} DFS</span>
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
import moment from 'moment';
import { toFixed, toLocalTime, accSub, accAdd, accDiv } from '@/utils/public';
import { dealRewardV3 } from '@/utils/logic';
export default {
  name: 'dfsMiner',
  props: {
    allClaiming: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      lists: [],
      firstGet: false,
      showReward: '0.00000000',
      listsTimer: null,
      timerArr: [],
      claiming: false,
      loading: true,
      minReward: '0.0001',
      mid: 39, // dfs: 39 | DMD: 326 | YFC: 329 | DBC: 346 | LOOP: 424
      marketData: {},
    }
  },
  computed: {
    ...mapState({
      // 箭头函数可使代码更简练
      // baseConfig: state => state.sys.baseConfig, // 基础配置 - 默认为{}
      rankInfoV3: state => state.sys.rankInfoV3, // 交易对权重列表
      damping: state => state.sys.damping,
      scatter: state => state.app.scatter,
      dfsPrice: state => state.sys.dfsPrice,
      marketLists: state => state.sys.marketLists,
    }),
    allReward() {
      if (!this.lists.length) {
        return '0.00000000'
      }
      let all = '0.00000000';
      this.lists.forEach(v => {
        if (!v.showReward) {
          return
        }
        all = accAdd(Number(v.showReward), all)
      })
      return toFixed(all, 8)
    },
    aboutEos() {
      const price = parseFloat(this.marketData.reserve0) / parseFloat(this.marketData.reserve1) || 0;
      const num = price * this.allReward;
      return toFixed(num, 4)
    },
  },
  watch: {
    marketLists: {
      handler: function ml(newVal) {
        this.marketData = newVal.find(v => v.mid === this.mid) || {}
        if (!newVal.length || !this.rankInfoV3.length || this.firstGet) {
          return
        }
        const rankInfoV3 = this.rankInfoV3;
        let lists = [];
        let gold = [], silver = [], bronze = [];
        rankInfoV3.forEach(v => {
          const item = newVal.find(vv => vv.mid === v.mid)
          if (v.rank <= 2) {
            gold.push(item)
          } else if (v.rank <= 5) {
            silver.push(item)
          } else if (v.rank <= 10) {
            bronze.push(item)
          } else {
            lists.push(item)
          }
        });
        gold = gold.sort((a, b) => {
          return parseFloat(b.reserve0) - parseFloat(a.reserve0)
        })
        silver = silver.sort((a, b) => {
          return parseFloat(b.reserve0) - parseFloat(a.reserve0)
        })
        bronze = bronze.sort((a, b) => {
          return parseFloat(b.reserve0) - parseFloat(a.reserve0)
        })
        lists = lists.sort((a, b) => {
          return parseFloat(b.reserve0) - parseFloat(a.reserve0)
        })
        this.lists = [...gold, ...silver, ...bronze, ...lists];
        this.firstGet = true;
        this.handleGetMiners()
        // console.log(this.lists)
      },
      deep: true,
      immediate: true
    },
  },
  beforeDestroy() {
    clearTimeout(this.listsTimer)
    this.timerArr.forEach(v => {
      clearInterval(v)
    })
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
        this.claiming = false
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
      this.lists.forEach(v => {
        if (!v.showReward || Number(this.minReward) > Number(v.showReward)) {
          return
        }
        const action = {
          account: 'miningpool11',
          name: 'claim',
          authorization: [{
            actor: formName, // 转账者
            permission,
          }],
          data: {
            user: formName,
            mid: v.mid,
          }
        }
        actions.push(action)
      })
      return actions;
    },
    handleGetMiners() {
      if (!this.$store.state.app.scatter || !this.$store.state.app.scatter.identity) {
        return;
      }
      const formName = this.$store.state.app.scatter.identity.accounts[0].name;
      this.lists.forEach((v, index) => {
        const params = {
          code: 'miningpool11',
          scope: v.mid,
          table: 'miners2',
          lower_bound: ` ${formName}`,
          upper_bound: ` ${formName}`,
          json: true,
        }
        setTimeout(() => {
          EosModel.getTableRows(params, (res) => {
            const rows = res.rows || []
            if (!rows.length) {
              this.$set(v, 'minnerData', {})
              return
            }
            const minnerData = rows[0];
            let lastTime = toLocalTime(`${minnerData.last_drip}.000+0000`);
            lastTime = moment(lastTime).valueOf();
            minnerData.lastTime = lastTime;
            const liq = this.getLiq(minnerData);
            minnerData.liq = liq;
            this.$set(v, 'minnerData', minnerData)
          })
          this.handleRunReward()
        }, index * 100);
      })
    },
    getLiq(minnerData) {
      const liq0 = minnerData.liq_bal0.split(' ');
      if (liq0[1] === 'EOS') {
        return liq0[0]
      }
      const liq1 = minnerData.liq_bal1.split(' ');
      if (liq1[1] === 'EOS') {
        return liq1[0]
      }
      let EosPrice = this.marketLists.find(v => v.mid === 17)
      EosPrice = EosPrice.price;
      if (liq0[1] === 'USDT') {
        return liq0[0] * EosPrice
      }
      if (liq1[1] === 'USDT') {
        return liq1[0] * EosPrice
      }
      return 0
    },
    handleRunReward() {
      this.loading = false;
      clearTimeout(this.listsTimer)
      this.listsTimer = setTimeout(() => {
        this.handleRunReward()
      }, 1000);
      this.lists.forEach((v, index) => {
        if (this.timerArr[index]) {
          clearInterval(this.timerArr[index]);
        }
        if (!v.minnerData || !Number(v.minnerData.liq)) {
          this.timerArr[index] = null;
          return
        }
        const reward = dealRewardV3(v.minnerData, v.mid)
        let showReward = v.reward || '0.00000000';
        let countReward = showReward;
        if (!v.showReward) {
          this.$set(v, 'showReward', reward)
          showReward = reward;
          countReward = reward;
        }
        this.$set(v, 'reward', reward)
        let t = accSub(reward, showReward);
        t = accDiv(t, 20)
        this.timerArr[index] = setInterval(() => {
          countReward = accAdd(countReward, t)
          if (countReward > Number(reward)) {
            showReward = toFixed(reward, 8);
            clearInterval(this.timerArr[index])
          } else {
            showReward = toFixed(countReward, 8);
          }
          this.$set(v, 'showReward', showReward);
        }, 50);
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import './comp.scss';
</style>
