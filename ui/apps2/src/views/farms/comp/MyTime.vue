<template>
  <div class="lists flexa" v-loading="loading">
    <div class="coinDiv flexc">
      <img class="coin" src="https://apps.defis.network/static/coin/xpettimecore-time.png?v=2" alt="">
    </div>
    <div class="f1">
      <div class="projectName flexb">
        <span>TIME时砂</span>
        <span class="claim green" v-loading="claiming || allClaiming" @click.stop="handleClaim">领取</span>
      </div>
      <div class="reward">
        <span>收益：</span>
        <span>{{ allClaim }} TIME</span>
      </div>
      <div class="about">
        <span>≈ {{ aboutEos }} EOS</span>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import { mapState } from 'vuex';
import { toFixed, toLocalTime, accAdd, accSub, accDiv } from '@/utils/public';
import { EosModel } from '@/utils/eos';
import { timeNum, timeDssNum } from '@/utils/minerLogic';
export default {
  name: 'lootTime',
  props: {
    marketLists: {
      type: Array,
      default: function mlt() {
        return []
      }
    },
    allClaiming: {
      type: Boolean,
      default: false,
    }
  },
  computed: {
    ...mapState({
      scatter: state => state.app.scatter,
      timeList: state => state.config.timeList,
    }),
    allClaim() {
      let all = '0.0000000000';
      all = accAdd(all, this.allLpClaim || 0)
      all = accAdd(all, this.allDssClaim || 0)
      return toFixed(all, 8)
    },
    allLpClaim() {
      let all = '0.0000000000';
      this.newLists.forEach(v => {
        all = accAdd(all, v.showReward || 0)
      })
      return toFixed(all, 8)
    },
    allDssClaim() {
      let all = '0.0000000000';
      this.newDssLists.forEach(v => {
        all = accAdd(all, v.showReward || 0)
      })
      return toFixed(all, 8)
    },
    aboutEos() {
      const price = parseFloat(this.marketData.reserve0) / parseFloat(this.marketData.reserve1) || 0;
      const num = price * this.allClaim;
      return toFixed(num, 4)
    },
  },
  data() {
    return {
      loading: true,
      pondsList: [], // 池子数据 - 未处理
      dealArr: [], // 池子数据 - 已处理
      showReward: '0.00000000',
      hasGet: false,
      timerArr: [],
      newLists: [],
      claiming: false,
      mid: 530, // dfs: 39 | DMD: 326 | YFC: 329 | DBC: 346 | LOOP: 424
      marketData: {},
      rankWeight: {}, // 排名权重
      userMine: {}, // 用户token
      // dss 挖矿
      dssLists: [], // dss Lp配置
      dssUserRank: {}, // 用户DSS排名
      userDssMine: {}, // 用户dss token
      newDssLists: [], // dss 数据
      timerDss: null,
      timerArrDss: [],
    }
  },
  watch: {
    marketLists: {
      handler: function ml(newVal, oldVal) {
        this.marketData = newVal.find(v => v.mid === this.mid) || {}
        if (!newVal.length || JSON.stringify(newVal) === JSON.stringify(oldVal)) {
          return
        }
        this.handleDealList();
      },
      deep: true,
      immediate: true,
    },
    scatter: {
      handler: function listen(newVal) {
        if (newVal.identity) {
          this.handleDealList();
          this.handleGetDssConfig();
        }
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
    this.handleGetDssAllStaked()
  },
  beforeDestroy() {
    clearTimeout(this.timer)
    clearTimeout(this.timerDss)
    this.timerArr.forEach((v, index)=> {
      clearInterval(this.timerArr[index])
    })
    this.timerArrDss.forEach((v, index)=> {
      clearInterval(this.timerArr[index])
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
      this.newLists.forEach(v => {
        if (!v.showReward || !Number(v.showReward)) {
          return
        }
        const action = {
          account: 'loottimemine',
          name: 'mining',
          authorization: [{
            actor: formName, // 转账者
            permission,
          }],
          data: {
            acc: formName,
            id: v.id
          }
        }
        actions.push(action)
      })
      this.newDssLists.forEach(v => {
        if (!v.showReward || !Number(v.showReward)) {
          return
        }
        const action = {
          account: 'lootdfssmine',
          name: 'mining',
          authorization: [{
            actor: formName, // 转账者
            permission,
          }],
          data: {
            acc: formName,
            id: v.id
          }
        }
        actions.push(action)
      })
      return actions;
    },
    handleDealList() {
      if (!this.timeList.length || !this.marketLists.length) {
        return;
      }
      this.loading = false
      this.timeList.forEach(pond => {
        let list = JSON.stringify(this.marketLists.find(vv => vv.mid === pond.id) || {});
        list = JSON.parse(list)
        if (!list.mid) {
          return
        }
        this.handleGetUserToken(list.mid)
      })
    },
    // 获取账户挖矿token
    handleGetUserToken(mid) {
      const name = this.scatter.identity.accounts[0].name;
      const params = {
        "json":true,
        "code":"loottimemine",
        "scope": mid,
        "table":"miners",
        "lower_bound": ` ${name}`,
        "upper_bound": ` ${name}`,
        "limit":1,
        "reverse":true,
        "show_payer":false
      }
      EosModel.getTableRows(params, (res) => {
        const rows = res.rows || []
        if (!rows.length) {
          return
        }
        const item = rows[0];
        item.beginTime = moment(`${item.last_drip}.000+0000`).valueOf() / 1000;
        this.userMine[`${mid}`] = item
        this.handleGetPoolRank(mid)
      })
    },
    // 获取排名权重
    handleGetPoolRank(mid) {
      const params = {
        "json":true,
        "code":"loottimemine",
        "scope": mid,
        "table":"miners",
        "index_position":"2",
        "key_type":"i64",
        "limit":100,
        "reverse":true,
        "show_payer":false
      }
      EosModel.getTableRows(params, (res) => {
        const rows = res.rows || []
        if (!rows.length) {
          return
        }
        const rankIndex = rows.findIndex(v => v.miner === this.scatter.identity.accounts[0].name);
        if (rankIndex === -1) {
          this.rankWeight[`${mid}`] = {
            rate: 3,
            constant: 0.6
          };
        } else if (rankIndex < 50) {
          this.rankWeight[`${mid}`] = {
            rate: 1,
            constant: 0.2
          };
        } else {
          this.rankWeight[`${mid}`] = {
            rate: 5,
            constant: 1
          };
        }
        this.handleGetMarketList();
      })
    },

    handleGetMarketList() {
      const userLpKeys = Object.keys(this.userMine)
      const arr = []
      userLpKeys.forEach(key => {
        if (!this.rankWeight[key]) {
          return
        }
        const market = this.marketLists.find(v => v.mid == key) || {};
        const uLp = this.userMine[key];
        // const num = timeNum(market, uLp, this.rankWeight[key])
        const oldItem = this.dealArr.find(v => v.mid == key) || {};
        const item = Object.assign(oldItem, {
          id: market.mid,
          mid: market.mid,
          params: [market, uLp, this.rankWeight[key]],
        })
        arr.push(item)
      })
      this.dealArr = arr;
      this.handleRunReward()
    },

    handleRunReward() {
      if (!this.dealArr.length) {
        return
      }
      clearTimeout(this.timer)
      this.handleRunMyReward()
      this.timer = setTimeout(() => {
        this.handleRunReward()
      }, 1000);
    },
    handleRunMyReward() {
      this.newLists = this.dealArr;
      this.newLists.forEach((v, index) => {
        if (this.timerArr[index]) {
          clearInterval(this.timerArr[index])
        }
        if (!v.params) {
          return
        }
        const reward = timeNum(...v.params);
        let showReward = v.showReward || 0;
        let countReward = showReward;
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
    // 获取DSS Lp
    handleGetDssConfig() {
      const params = {
        "code":"lootdfssmine",
        "scope":"lootdfssmine",
        "table":"ponds",
        "json":true,
        "limit":10
      }
      EosModel.getTableRows(params, (res) => {
        const rows = res.rows || []
        if (!rows.length) {
          return
        }
        rows.forEach(v => {
          if (v.id === 3) {
            this.$set(v, 'mid', 329)
          } else if (v.id === 4) {
            this.$set(v, 'mid', 39)
          }
          if (v.start) {
            let beginTime = toLocalTime(`${v.start}.000+0000`);
            beginTime = moment(beginTime).valueOf();
            this.$set(v, 'beginTime', beginTime / 1000);
          }
          if (v.end) {
            let endTime = toLocalTime(`${v.end}.000+0000`);
            endTime = moment(endTime).valueOf();
            this.$set(v, 'endTime', endTime / 1000);
          }
          this.handleGetUserDss(v.id);
        })
        this.dssLists = rows;
      })
    },
    // 获取DSS总抵押
    handleGetDssAllStaked() {
      const params = {
        "json":true,
        "code":"lootdfssmine",
        "scope":"lootdfssmine",
        "table":"assetpool",
        "limit":10,
        "reverse":false,
        "show_payer":false
      }
      EosModel.getTableRows(params, (res) => {
        const rows = res.rows || []
        if (!rows.length) {
          return
        }
        this.dssAllStaked = rows;
        this.handleDealDssReward()
      })
    },
    // 获取用户DSS数据
    handleGetUserDss(id) {
      const name = this.scatter.identity.accounts[0].name;
      const params = {
        "json":true,
        "code":"lootdfssmine",
        "scope": id,
        "table":"miners",
        "lower_bound": ` ${name}`,
        "upper_bound": ` ${name}`,
        "limit":1,
        "reverse":false,
        "show_payer":false
      }
      EosModel.getTableRows(params, (res) => {
        const rows = res.rows || []
        if (!rows.length) {
          return
        }
        const item = rows[0];
        item.beginTime = moment(`${item.last_drip}.000+0000`).valueOf() / 1000;
        this.userDssMine[`${id}`] = item;
        this.handleGetUserDssRank(id)
      })
    },
    // 获取用户Dss排名
    handleGetUserDssRank(id) {
      const params = {
        "json":true,
        "code":"lootdfssmine",
        "scope": id,
        "table":"miners",
        "index_position":"2",
        "key_type":"i64",
        "limit":100,
        "reverse":true,
        "show_payer":false
      }
      EosModel.getTableRows(params, (res) => {
        const rows = res.rows || []
        if (!rows.length) {
          return
        }
        const rankIndex = rows.findIndex(v => v.miner === this.scatter.identity.accounts[0].name);
        if (rankIndex === -1) {
          this.dssUserRank[`${id}`] = {
            rate: 3,
            constant: 0.6
          };
        } else if (rankIndex < 50) {
          this.dssUserRank[`${id}`] = {
            rate: 1,
            constant: 0.2
          };
        } else {
          this.dssUserRank[`${id}`] = {
            rate: 5,
            constant: 1
          };
        }
        // 计算DSS LP 收益
        this.handleDealDssReward()
      })
    },
    handleDealDssReward() {
      const keys = Object.keys(this.dssUserRank);
      if (!this.dssAllStaked.length || !keys.length) {
        return
      }
      const arr = [];
      keys.forEach(key => {
        const allStaked = this.dssAllStaked.find(v => v.id == key)
        const config = this.dssLists.find(v => v.id == key)
        const uLp = this.userDssMine[key];
        const rank = this.dssUserRank[key];
        const oldItem = this.newDssLists.find(v => v.id == key) || {};
        const params = [config, uLp, rank, allStaked]
        const item = Object.assign(oldItem, {
          id: key,
          mid: config.mid,
          params,
        })
        arr.push(item)
      })
      this.newDssLists = arr;
      this.handleRunDssReward()
    },
    handleRunDssReward() {
      if (!this.newDssLists.length) {
        return
      }
      clearTimeout(this.timerDss)
      this.handleRunMyRewardDss()
      this.timerDss = setTimeout(() => {
        this.handleRunDssReward()
      }, 1000);
    },
    handleRunMyRewardDss() {
      this.newDssLists.forEach((v, index) => {
        if (this.timerArrDss[index]) {
          clearInterval(this.timerArrDss[index])
        }
        if (!v.params) {
          return
        }
        const reward = timeDssNum(...v.params);
        let showReward = v.showReward || 0;
        let countReward = showReward;
        let t = accSub(reward, showReward);
        t = accDiv(t, 20)
        this.timerArrDss[index] = setInterval(() => {
          countReward = accAdd(countReward, t)
          if (countReward > Number(reward)) {
            showReward = toFixed(reward, 8);
            clearInterval(this.timerArrDss[index])
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
