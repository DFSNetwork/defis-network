<template>
  <div class="weight">
    <div class="noPools" v-if="showAddPools">
      <div class="flexb">
        <div class="flexa">
          <img width="20px" src="@/assets/img/market/pow.jpg" alt="">
          <span>当前权重： {{ weight }}</span>
        </div>
        <div class="green" v-if="Number(token) && !Number(minnerData.liq)" @click="handleJoin">加入</div>
      </div>
      <div class="tip" style="margin-top: 10px">当前交易对可以进行流动性挖矿。预计每万EOS每天收益 {{perDayReward}} DFS</div>
    </div>
    
    <div class="hasPools flexb" v-else>
      <div>收益： {{ changeReWard }} DFS</div>
      <div class="green" @click="handleClaim">领取</div>
    </div>
  </div>
</template>

<script>
import { EosModel } from '@/utils/eos';
import moment from 'moment';
import { mapState } from 'vuex';
import { toFixed, toLocalTime } from '@/utils/public';

export default {
  data() {
    return {
      weight: 1.10000000000000009,
      price: '0.2427',
      minnerData: {},
      cliamNum: '0.00000000',
      reward: '0.0000',
      perDayReward: '0.0000',
      changeReWard: '0.0000',
      dealTimer: null, // 定时器 - 每秒重新计算收益
      addTimer: null, // 定时器 - 收益数字滚动累加
      priceTimer: null, // 价格定时器 - 5分钟执行一次
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
    }),
    showAddPools() {
      if (!Number(this.token) || !Number(this.minnerData.liq)) {
        return true;
      }
      return false
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
      immediate: true,
    },
    weightList: {
      handler: function wl(newVal) {
        if (!newVal) {
          return;
        }
        this.handleGetData();
      },
      immediate: true,
      deep: true,
    },
    thisMarket: {
      handler: function tm(newVal) {
        if (!newVal) {
          return;
        }
        this.handleGetData();
      },
      immediate: true,
      deep: true,
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
    handleGetData() {
      const weightData = this.weightList.find(v => v.mid === this.thisMarket.mid) || {};
      this.weight = weightData.pool_weight || 0;
      if (!Number(this.token)) {
        this.handleGetMiners(this.thisMarket.mid);
      }
    },
    handleStartAdd(reward) {
      // console.log(reward)
      this.changeReWard = toFixed(this.reward, 8);
      this.reward = reward;
      clearInterval(this.addTimer)
      const t = (this.reward - this.changeReWard) / 20;
      this.addTimer = setInterval(() => {
        const changeReWard = Number(this.changeReWard) + t;
        // console.log(changeReWard)
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
        lower_bound: ` ${formName}`,
        upper_bound: ` ${formName}`,
        json: true,
      }
      EosModel.getTableRows(params, (res) => {
        const rows = res.rows || []
        if (!rows.length) {
          this.minnerData = {};
          clearInterval(this.addTimer)
          clearInterval(this.dealTimer)
          return
        }
        const minnerData = rows[0];
        let lastTime = toLocalTime(`${minnerData.last_drip}.000+0000`);
        lastTime = moment(lastTime).valueOf();
        minnerData.lastTime = lastTime;
        const liq = this.thisMarket.symbol0 === 'EOS' ? minnerData.liq_bal0.split(' ')[0] : minnerData.liq_bal1.split(' ')[0];
        minnerData.liq = liq;
        this.minnerData = minnerData;
        clearInterval(this.dealTimer)
        this.dealTimer = setInterval(() => {
          this.handleGetMinNum()
        }, 1000);
      })
    },
    // 计算挖矿数量
    handleGetMinNum() {
      try {
        const type = this.minnerData.lastTime < this.aprs.lastTime; // 用户时间 < 系统时间
        let minNum = 0;
        if (type) {
          let t = moment().valueOf() - this.aprs.lastTime;
          t = t / 1000;
          minNum = this.minnerData.liq * this.aprs.aprs_accumulator * Math.pow(this.aprs.aprs, t)
        } else {
          let t = moment().valueOf() - this.minnerData.lastTime;
          t = t / 1000;
          minNum = this.minnerData.liq * Math.pow(this.aprs.aprs, t)
        }
        minNum = minNum - this.minnerData.liq;
        let reward = minNum / (this.price * this.damping * this.weight)
        reward *= 0.8
        reward = toFixed(reward, 8)
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
      })
    },
    handleJoin() {
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
        this.loading = false
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
        this.loading = false
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
  padding: 40px;
  margin-top: 40px;
  border: 1px solid #e0e0e0;
  border-radius: 20px;

  .green{
    color: #07D79B;
  }
}
</style>