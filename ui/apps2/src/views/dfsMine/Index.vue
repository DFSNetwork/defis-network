<template>
  <div class="dfsMine">
    <div class="banner">
      <img v-if="language === 'zh-CN'" src="https://cdn.jsdelivr.net/gh/defis-net/material2/dfs/dfs-mine.png">
      <img v-else src="https://cdn.jsdelivr.net/gh/defis-net/material2/dfs/dfs-mine-en.png">
    </div>

    <div class="mineView">
      <RewardInfo :total="total" @listenUpdate="handleUpdate"/>
      <MineInfo :current="current" :swapBal="swapBal" :allBal="allBal"/>
      <Pools :current="current" @listenAllBal="handleGetAllBal"/>

      <PoolsLits ref="poolsLists" :swapBal="swapBal" :allBal="allBal" @totalClaim="handleTotal"/>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import MineInfo from './comp/MineInfo';
import RewardInfo from './comp/RewardInfo';
import Pools from './comp/Pools';
import PoolsLits from './comp/PoolsLits';
import { toFixed } from '@/utils/public';

export default {
  name: 'dfsMine',
  components: {
    MineInfo, RewardInfo, Pools, PoolsLits,
  },
  data() {
    return {
      getTimer: null,
      current: null,
      allBal: {},
      swapBal: {},
      total: '0.00000000'
    }
  },
  mounted() {
    this.handleGetDfsCurrent()
    this.handleGetBal('dfs')
    this.handleGetBal('eos')
    this.handleGetBal('usdt')
    clearInterval(this.getTimer)
    this.getTimer = setInterval(() => {
      this.handleGetDfsCurrent();
      this.handleGetBal('dfs')
      this.handleGetBal('eos')
      this.handleGetBal('usdt')
    }, 5000);
  },
  beforeDestroy() {
    clearInterval(this.getTimer)
  },
  computed: {
    ...mapState({
      language: state => state.app.language,
    }),
  },
  methods: {
    handleUpdate() {
      this.$refs.poolsLists.handleClaim()
    },
    handleTotal(total) {
      this.total = toFixed(total, 4);
    },
    // 获取DFS流通量
    async handleGetDfsCurrent() {
      const params = {
        code: 'minedfstoken',
        symbol: 'DFS'
      }
      const {status, result} = await this.$api.get_currency_stats(params);
      this.loading = false;
      if (!status) {
        return;
      }
      const res = result['DFS'];
      const supply = res.supply.split(' ')[0];

      this.current = supply;
    },
    // 获取矿池余额
    handleGetAllBal(allBal) {
      this.allBal = allBal;
      // console.log(this.allBal)
    },
    // 获取swap做市余额
    async handleGetBal(type = "dfs") {
      const params = {
        code: 'minedfstoken',
        symbol: 'DFS',
        decimal: 4,
        account: 'defisswapcnt'
      }
      if (type === 'eos') {
        params.code = 'eosio.token'
        params.symbol = 'EOS'
      } else if (type === 'usdt') {
        params.code = 'tethertether'
        params.symbol = 'USDT'
      }
      const {status, result} = await this.$api.get_currency_balance(params);
      if (!status) {
        return
      }
      const bal = result;
      if (type === 'dfs') {
        this.$set(this.swapBal, 'dfsSwapBal', parseFloat(bal) + '')
      } else if (type === 'eos') {
        this.$set(this.swapBal, 'eosSwapBal', parseFloat(bal) + '')
      } else if (type === 'usdt') {
        this.$set(this.swapBal, 'usdtSwapBal', parseFloat(bal) + '')
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.dfsMine{
  // padding: 0 28px;
  font-size: 28px;
  .banner{
    height: 400px;
    img{
      width: 100%;
    }
  }
  .mineView{
    position: relative;
    background: #FFF;
    margin-top: -38px;
    padding: 38px 30px;
    border-radius: 40px 40px 0 0;
  }
}
</style>
