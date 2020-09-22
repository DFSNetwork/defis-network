<template>
  <div class="num">
    {{allReward}}
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { EosModel } from '@/utils/eos';
import moment from 'moment';
import { toFixed, toLocalTime, accSub, accAdd, accDiv, dealReward } from '@/utils/public';
export default {
  name: 'dfsMiner',
  props: {
    marketLists: {
      type: Array,
      default: function lists() {
        return []
      }
    }
  },
  data() {
    return {
      lists: [],
      firstGet: false,
      showReward: '0.00000000',
      listsTimer: null,
      timerArr: [],
    }
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
      sortClass: state => state.sys.sortClass,
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
    }
  },
  watch: {
    marketLists: {
      handler: function ml(newVal) {
        if (!newVal.length || !this.weightList.length || this.firstGet) {
          return
        }
        const weightList = this.weightList;
        let lists = [];
        let gold = [], silver = [], bronze = [];
        weightList.sort((a, b) => {
          return b.pool_weight - a.pool_weight
        })
        weightList.forEach(v => {
          const item = newVal.find(vv => vv.mid === v.mid)
          const weight = Number(v.pool_weight).toFixed(4)
          item.pool_weight = weight;
          if (weight === '4.1903') {
            gold.push(item)
          } else if (weight === '2.5468') {
            silver.push(item)
          } else if (weight === '1.4790') {
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
        console.log(this.lists)
      },
      deep: true,
      immediate: true
    },
  },
  beforeDestroy() {
    clearInterval(this.listsTimer)
    this.timerArr.forEach(v => {
      clearInterval(v)
    })
  },
  methods: {
    handleGetMiners() {
      if (!this.$store.state.app.scatter || !this.$store.state.app.scatter.identity) {
        return;
      }
      const formName = this.$store.state.app.scatter.identity.accounts[0].name;
      this.lists.forEach((v, index) => {
        const params = {
          code: 'miningpool11',
          scope: v.mid,
          table: 'miners',
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
            const liq = minnerData.liq_bal0.split(' ')[1] === 'EOS' ? minnerData.liq_bal0.split(' ')[0] : minnerData.liq_bal1.split(' ')[0];
            minnerData.liq = liq;
            this.$set(v, 'minnerData', minnerData)
          })
          this.handleRunReward()
        }, index * 100);
      })
    },
    handleRunReward() {
      clearInterval(this.listsTimer)
      this.listsTimer = setInterval(() => {
        this.lists.forEach((v, index) => {
          if (this.timerArr[index]) {
            clearInterval(this.timerArr[index]);
          }
          if (!v.minnerData || !Number(v.minnerData.liq)) {
            this.timerArr[index] = null;
            return
          }
          const reward = dealReward(v.minnerData, v.pool_weight)
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
      }, 1000);
    },
    handleDealMineNum(minnerData, weight) {
      // 用户实际数据计算
      let minNum = '0';
      const type = minnerData.lastTime < this.aprs.lastTime; // 用户时间 < 系统时间
      if (type) {
        let t = moment().valueOf() - this.aprs.lastTime;
        t = t / 1000;
        minNum = minnerData.liq * this.aprs.aprs_accumulator * Math.pow(this.aprs.aprs, t)
      } else {
        let t = moment().valueOf() - minnerData.lastTime;
        t = t / 1000;
        minNum = minnerData.liq * Math.pow(this.aprs.aprs, t)
      }
      minNum = minNum - minnerData.liq;
      let reward = minNum / this.dfsPrice * this.damping * weight
      reward *= 0.8
      reward = toFixed(reward, 8)
      return reward
    },
  },
}
</script>

<style lang="scss" scoped>
.num{
  display: inline-block;
}
</style>
