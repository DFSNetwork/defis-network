<template>
  <div class="weight">
    <div class="noPools flexb">
      <div>当前权重： 1。5</div>
      <div @click="handleJoin">加入</div>
    </div>
    <div class="hasPools flexb">
      <div>收益： 1.2325556 DFS</div>
      <div @click="handleClaim">领取</div>
    </div>
  </div>
</template>

<script>
import { EosModel } from '@/utils/eos';
import moment from 'moment';
import { toFixed, toLocalTime } from '@/utils/public';

export default {
  data() {
    return {
      weight: 1.10000000000000009,
      damping: 0.75,
      price: '0.2427',
      minnerData: {},
      aprs: {},
      cliamNum: '0.00000000',
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
    this.handleGetAprs();
    // this.handleGetMiners(39)
  },
  methods: {
    handleGetData() {
      if (Number(this.token)) {
        this.handleGetMiners();
      }
    },
    // 获取交易对权重 - 全局取一次
    handleGetWeight() {
      const params = {
        "code": "miningpool11",
        "scope": "miningpool11",
        "table": "weights",
        "json": true,
      }
      EosModel.getTableRows(params, (res) => {
        const rows = res.rows || [];
        if (!rows.length) {
          return
        }
        const weightData = rows.find(v => v.mid === this.thisMarket.mid) || {};
        this.weight = weightData.pool_weight || 0;
      })
    },
    // 获取账户做市数据
    handleGetMiners(id = 39) {
      const params = {
        "code": "miningpool11",
        "scope": id,
        "table": "miners",
        "lower_bound": " dfsdeveloper",
        "upper_bound": " dfsdeveloper",
        "json": true,
      }
      EosModel.getTableRows(params, (res) => {
        const rows = res.rows || []
        if (!rows.length) {
          this.minnerData = {};
          return
        }
        const minnerData = rows[0];
        // v.ableRedeemDate = toLocalTime(`${v.rex_maturity}.000+0000`);
        // const redeemTime = moment(v.ableRedeemDate).valueOf(); // 解锁时间
        // const nowTime = moment().valueOf(); // 当前时间
        let lastTime = toLocalTime(`${minnerData.last_drip}.000+0000`);
        lastTime = moment(lastTime).valueOf();
        minnerData.lastTime = lastTime;
        console.log(this.thisMarket)
        // const liq = this.thisMarket.symbol0 === 'EOS' ? minnerData.liq_bal0.split(' ')[0] : minnerData.liq_bal1.split(' ')[0];
        const liq = minnerData.liq_bal0.split(' ')[0];
        minnerData.liq = liq;
        this.minnerData = minnerData;
        console.log(minnerData)
        this.handleGetMinNum()
      })
    },
    // 获取aprs - 全局一次
    handleGetAprs() {
      const params = {
        "code": "miningpool11",
        "scope": "EOS",
        "table": "args",
        "json": true,
      }
      EosModel.getTableRows(params, (res) => {
        const rows = res.rows || [];
        if (!rows.length) {
          return
        }
        const aprs = rows[0];
        let lastTime = toLocalTime(`${aprs.last_drip}.000+0000`);
        lastTime = moment(lastTime).valueOf();
        aprs.lastTime = lastTime;
        this.aprs = aprs;
        console.log(aprs)

        this.handleGetMiners(39)
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
          console.log('系统时间 - ', t)
          minNum = this.minnerData.liq * this.aprs.aprs_accumulator * Math.pow(this.aprs.aprs, t)
          // console.log(minNum)
        } else {
          let t = moment().valueOf() - this.minnerData.lastTime;
          t = t / 1000;
          t = 1000
          console.log('用户时间 - ', t)
          console.log('this.aprs.aprs', this.aprs.aprs)
          console.log('this.minnerData.liq ', this.minnerData.liq)
          minNum = this.minnerData.liq * Math.pow(this.aprs.aprs, t)
          // console.log(minNum)
        }
        minNum = minNum - this.minnerData.liq;
        console.log('minNum', minNum)
        console.log(this.price * this.damping * this.weight)
        // dfs_price * damping * pool_weight
        let reward = minNum / (this.price * this.damping * this.weight)
        reward *= 0.8
        console.log(reward)
      } catch (error) {
        console.log(error)
      }
    },
    // 获取DFS流通量 - 全局区一次
    handleGetDfsCurrent() {
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
  padding: 40px
}
</style>