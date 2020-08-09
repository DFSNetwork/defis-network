<template>
  <div class="pools">
    <div class="rules">
      <div class="title"><span class="act">挖矿规则</span></div>
      <div class="rule1">1. 挖矿规则挖矿规则挖矿规则挖矿规则挖矿规则</div>
      <div class="rule1">2. 挖矿规则挖矿规则挖矿规则挖矿规则挖矿规则挖矿规则挖矿规则挖矿规则挖矿规则挖矿规则</div>
      <div class="rule1">3. 挖矿规则挖矿规则挖矿规则挖矿规则挖矿规则挖矿规则挖矿规则挖矿规则挖矿规则挖矿规则挖矿规则挖矿规则挖矿规则挖矿规则挖矿规则</div>
      <div class="rule1">4. 挖矿规则挖矿规则挖矿规则挖矿规则挖矿规则</div>
    </div>
    <div class="poolsList">
      <div class="title"><span class="act">矿池列表</span></div>
      <div class="list" v-for="(item, index) in lists" :key="index">
        <div class="flexb">
          <span>
            <span>收益：</span>
            <span v-if="!item.minnerData || !Number(item.minnerData.liq)">0.00000000 DFS </span>
            <span v-else>1.00000000 DFS </span>
            <span class="addition" v-if="Number(handleGetBuff(item))">算力加成：{{ handleGetBuff(item) }}%</span>
          </span>
          <span class="green" v-if="item.minnerData && !Number(item.minnerData.liq)" @click="handleJoin(item)">加入</span>
          <span class="green" v-if="item.minnerData && Number(item.minnerData.liq)" @click="handleClaim(item)">领取</span>
        </div>
        <div class="symbol flexa">
          <div class="coinInfo flex">
            <div class="coinImg"><img width="100%" :src="item.sym0Data.imgUrl"></div>
            <div>
              <div class="coin">{{ item.symbol0 }}</div>
              <div class="contract tip">{{ item.contract0 }}</div>
            </div>
          </div>
          <div class="add">+</div>
          <div class="coinInfo flex">
            <div class="coinImg"><img width="100%" :src="item.sym1Data.imgUrl"></div>
            <div>
              <div class="coin">{{ item.symbol1 }}</div>
              <div class="contract tip">{{ item.contract1 }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { EosModel } from '@/utils/eos';
import moment from 'moment';
import { toFixed, toLocalTime, accSub, accAdd, accMul, accDiv, accPow } from '@/utils/public';

export default {
  name: 'poolsData',
  data() {
    return {
      lists: [],
      firstGet: false,
      priceTimer: null,
      price: '0',
    }
  },
  props: {
    marketLists: {
      type: Array,
      default: function lists() {
        return []
      }
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
    minReward() {
      if (!Number(this.price)) {
        return '0.0005'
      }
      let min = accDiv(0.0001, this.price)
      if (Number(toFixed(min, 4)) < min) {
        min = accAdd(min, 0.0001)
      }
      return toFixed(min, 4)
    }
  },
  watch: {
    marketLists: {
      handler: function ml(newVal) {
        if (!newVal.length || !this.weightList.length || this.firstGet) {
          return
        }
        const weightList = this.weightList;
        const lists = [];
        const keys = [];
        weightList.sort((a, b) => {
          return b.pool_weight - a.pool_weight
        })
        weightList.forEach(v => {
          const item = newVal.find(vv => vv.mid === v.mid)
          item.pool_weight = v.pool_weight;
          lists.push(item)
        });
        this.lists = lists;
        this.firstGet = true;
        this.handleGetMiners()
      },
      deep: true,
      immediate: true
    },
  },
  mounted() {
    clearInterval(this.priceTimer)
    this.handleGetPrice()
    this.priceTimer = setInterval(() => {
      this.handleGetPrice()
    }, 300000);
  },
  methods: {
    handleJoin(item) {
      this.$router.push({
        name: 'market',
        params: {
          mid: item.mid
        }
      })
    },
    handleGetMiners() {
      if (!this.$store.state.app.scatter || !this.$store.state.app.scatter.identity) {
        return;
      }
      const formName = this.$store.state.app.scatter.identity.accounts[0].name;
      this.lists.forEach((v) => {
        const params = {
          code: 'miningpool11',
          scope: v.mid,
          table: 'miners',
          lower_bound: ` ${formName}`,
          upper_bound: ` ${formName}`,
          json: true,
        }
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
          const liq = v.symbol0 === 'EOS' ? minnerData.liq_bal0.split(' ')[0] : minnerData.liq_bal1.split(' ')[0];
          minnerData.liq = liq;
          this.$set(v, 'minnerData', minnerData)
        })
      })
    },
    handleGetBuff(item) {
      let t = accSub(item.pool_weight, 1);
      t = accMul(t, 100);
      if (Number(t) < 0) {
        return '0'
      }
      return t.toFixed(0)
    },
    handleClaim(item) {
      // if (Number(this.reward) < Number(this.minReward)) {
      //   this.showReWardTip = true;
      //   return
      // }
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
              mid: item.mid,
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
        // this.changeReWard = toFixed(0, 8);
        // this.reward = 0;
        this.handleGetMiners();
        this.$message({
          message: this.$t('public.success'),
          type: 'success'
        });
      })
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
    handleGetWeight() {
      const params = {
        code: 'miningpool11',
        scope: 'miningpool11',
        table: 'weights',
        json: true,
        limit: 100
      }
      EosModel.getTableRows(params, (res) => {
        console.log(res)
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.green{
  color: #07D79B;
}
.pools{
  font-size: 28px;
  text-align: left;
  color: #000;
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
  }
  .rules{
    margin: 40px;
    .rule1{
      margin-top: 10px;
    }
  }
  .poolsList{
    margin: 40px;
    .list{
      margin-top: 20px;
      padding: 20px;
      border: 1px solid #e0e0e0;
      border-radius: 20px;
      .addition{
        font-size: 24px;
        color: #C05D5D;
      }
      .symbol{
        margin-top: 20px;
        .coinInfo{
          text-align: left;
          flex: 1;
          .coinImg{
            width: 60px;
            height: 60px;
            margin-right: 10px;
          }
          .coin{
            font-size: 28px;
            font-weight: 500;;
            line-height: 30px;
          }
          .contract{
            line-height: 30px;
          }
          .ableGet{
            color: #2F3F52;
          }
        }
        .add{
          width: 40px;
        }
      }
    }
  }
}
</style>
