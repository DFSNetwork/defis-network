<template>
  <div class="timeRank">
    <div class="lists flexc">
      <div class="coinDiv flexc">
        <img class="coin" src="https://apps.defis.network/static/coin/lootglobcore-loot.png?v=2" alt="">
      </div>
      <div class="f1">
        <div class="projectName flexb">
          <span>TIME/EOS抢座位</span>
          <span class="claim green" @click.stop="handleDealToken">一键抢占</span>
        </div>
        <div class="reward">
          <span>当前排名：{{rank}}</span>
          <span></span>
        </div>
        <div class="about">
          <span>我的Token：{{ userMine['444'] ? parseInt(userMine['444'].liq_bal0) : 0 }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { EosModel } from '@/utils/eos';
import { toFixed } from '@/utils/public';
import { dealToken, sellToken } from '@/utils/logic';
export default {
  name: 'toolsLootRank',
  data() {
    return {
      rank: 0,
      userMine: {},
      rankList: [],
    }
  },
  props: {
    marketLists: {
      type: Array,
      default: function mlt() {
        return []
      }
    },
  },
  mounted() {
    this.handleGetTimePoolMiners()
  },
  watch: {
    scatter: {
      handler: function listen(newVal) {
        if (newVal.identity) {
          this.handleGetUser();
          this.handleGetRank();
        }
      },
      deep: true,
      immediate: true,
    },
  },
  computed: {
    ...mapState({
      scatter: state => state.app.scatter,
      timeList: state => state.config.timeList,
      baseConfig: state => state.sys.baseConfig,
    }),
  },
  methods: {
    handleGetRank() {
      if (!this.rankList.length || !this.scatter.identity.accounts[0].name) {
        return
      }
      const rankIndex = this.rankList.findIndex(v => v.miner === this.scatter.identity.accounts[0].name);
      if (rankIndex !== -1) {
        this.rank = rankIndex + 1;
      } else {
        this.rank = '100+'
      }
    },
    // 获取排名
    handleGetTimePoolMiners() {
      const params = {
        "json":true,
        "code":"loottimemine",
        "scope": 444,
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
        this.rankList = rows;
        this.handleGetRank();
      })
    },
    // 获取用户当前做市数据
    handleGetUser() {
      const name = this.scatter.identity.accounts[0].name;
      const params = {
        "json":true,
        "code":"loottimemine",
        "scope": 444,
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
        this.userMine[`444`] = rows[0];
        // console.log(rows[0])
      })
    },
    // 计算相差多少
    handleDealToken() {
      if (!this.rankList.length || !this.marketLists.length) {
        return 
      }
      const market = this.marketLists.find(v => v.mid === 444)
      const rank75 = this.rankList[50];
      const uLp = this.userMine['444'] || {};
      const tToken = parseInt(rank75.liq_bal0) - parseInt(uLp.liq_bal0 || 0)
      // console.log(tToken)
      if (tToken < 0) {
        this.handleSell(market, Math.abs(tToken))
        return
      }
      const inData = {
        poolSym0: market.reserve0.split(' ')[0],
        poolSym1: market.reserve1.split(' ')[0],
        poolToken: market.liquidity_token,
        sellToken: Math.abs(tToken)
      }
      const out = sellToken(inData)
      // console.log(out)
      const pay0 = toFixed(out.getNum1, market.decimal0)
      const pay1 = toFixed(out.getNum2, market.decimal1)
      this.handleDeposit(market, pay0, pay1)
    },
    // 存款
    handleDeposit(obj, pay0, pay1) {
      const formName = this.scatter.identity.accounts[0].name;
      const permission = this.scatter.identity.accounts[0].authority;
      const params = {
        actions: [
          {
            account: this.baseConfig.toAccountSwap,
            name: 'deposit',
            authorization: [{
              actor: formName, // 转账者
              permission,
            }],
            data: {
              user: formName,
              mid: obj.mid
            }
          },
          {
            account: obj.contract0,
            name: 'transfer',
            authorization: [{
              actor: formName, // 转账者
              permission,
            }],
            data: {
              from: formName,
              to: this.baseConfig.toAccountSwap,
              quantity: `${pay0} ${obj.symbol0}`,
              memo: `deposit`
            }
          },
          {
            account: obj.contract1,
            name: 'transfer',
            authorization: [{
              actor: formName, // 转账者
              permission,
            }],
            data: {
              from: formName,
              to: this.baseConfig.toAccountSwap,
              quantity: `${pay1} ${obj.symbol1}`,
              memo: `deposit`
            }
          }
        ]
      }
      EosModel.toTransaction(params, (res) => {
        if(res.code && JSON.stringify(res.code) !== '{}') {
          this.$message({
            message: res.message,
            type: 'error'
          });
          return
        }
        setTimeout(() => {
          this.handleGetTimePoolMiners();
          this.handleGetUser();
        }, 1000);
        setTimeout(() => {
          this.handleGetTimePoolMiners();
          this.handleGetUser();
        }, 3000);
        this.$message({
          message: this.$t('public.success'),
          type: 'success'
        });
      })
    },
    handleSell(obj, sellToken) {
      const formName = this.$store.state.app.scatter.identity.accounts[0].name;
      const permission = this.$store.state.app.scatter.identity.accounts[0].authority;
      const params = {
        actions: [
          {
            account: this.baseConfig.toAccountSwap,
            name: 'withdraw',
            authorization: [{
              actor: formName, // 转账者
              permission,
            }],
            data: {
              user: formName,
              mid: obj.mid,
              amount: sellToken
            }
          },
        ]
      }
      EosModel.toTransaction(params, (res) => {
        if(res.code && JSON.stringify(res.code) !== '{}') {
          this.$message({
            message: res.message,
            type: 'error'
          });
          return
        }
        setTimeout(() => {
          this.handleGetTimePoolMiners();
          this.handleGetUser();
        }, 1000);
        setTimeout(() => {
          this.handleGetTimePoolMiners();
          this.handleGetUser();
        }, 3000);
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
@import '../comp/comp.scss';
</style>
