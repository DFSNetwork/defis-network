<template>
  <div class="dfsMinerLists">
    <div class="title flexb">
      <span>{{ $t('mine.poolsList') }}</span>
      <div class="totalNum">{{ $t('mine.totalMiners') }}：{{ allMinersList.length }}</div>
    </div>

    <div class="lists">
      <div class="list" v-for="(v, i) in minersArr" :key="i">
        <div class="flexb">
          <span class="name">{{ v.miner }}</span>
          <span class="reward din">{{ $t('mine.earnings') }}：{{ v.showReward || '0.00000000' }} DFS</span>
        </div>
        <div class="flexb liq">
          <span>{{ $t('dex.pools') }}</span>
          <span>{{ v.liq_bal0 }} / {{ v.liq_bal1 }}</span>
        </div>
      </div>
    </div>

    <van-pagination
        class="page"
        v-if="allMinersList.length"
        v-model="page"
        :total-items="allMinersList.length"
        :items-per-page="20"
        :show-page-size="4"
        :force-ellipses="true"
        :prev-text="'Last'"
        :next-text="'Next'"
        @change="handleCurrentChange"
      />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { sellToken } from '@/utils/logic';
import { toLocalTime, toFixed } from '@/utils/public';
import { getReward } from '../dfsMine'
import moment from 'moment';

export default {
  name: "dfsMinerLists",
  props: {
    swapBal: {
      type: Object,
      default: function sbl() {
        return {}
      }
    },
    allBal: {
      type: Object,
      default: function sbl() {
        return {}
      }
    },
  },
  data() {
    return {
      allMinersList: [],
      unDealArr: [],
      minersArr: [],
      page: 1,
      pageSize: 20,

      thisMarket: {
        symbol0: 'EOS',
        symbol1: 'DFS',
        decimal0: 4,
        decimal1: 4,
      },

      secTimer: null,
      runTimer: null,

      // 本地缓存
      dfsPoolsJson: localStorage.getItem('dfsPoolsJson') ? JSON.parse(localStorage.getItem('dfsPoolsJson')) : {},
    };
  },
  mounted() {
    this.handleGetMinersLists()
  },
  beforeDestroy() {
    clearTimeout(this.secTimer)
    clearInterval(this.runTimer)
  },
  computed: {
    ...mapState({
      marketLists: state => state.sys.marketLists,
    }),
  },
  watch: {
    marketLists: {
      handler: function mls(newVal) {
        if (!newVal.length) {
          return
        }
        const market = newVal.find(v => v.mid == this.$route.params.mid);
        if (this.thisMarket.mid === market.mid) {
          return
        }
        this.thisMarket = market || {};
        this.handleDealMiners()
      },
      deep: true,
      immediate: true
    },
    '$route': {
      handler: function rt(newVal) {
        if (newVal.params.mid == this.thisMarket.mid) {
          return
        }
        const market = this.marketLists.find(v => v.mid == this.$route.params.mid);
        if (this.thisMarket.mid === market.mid) {
          return
        }
        this.thisMarket = market || {};
        this.handleGetMinersLists()
      },
      deep: true,
      immediate: true
    },
  },
  methods: {
    handleDealLocal() {
      const mid = this.$route.params.mid;
      const lists = this.dfsPoolsJson[mid] || [];
      if (!lists.length) {
        return;
      }
      this.allMinersList = lists;
      this.handleCurrentChange();
    },
    async handleGetMinersLists() {
      let lists = [];
      let more = true;
      let key = "";
      while(more) {
        const params = {
          code: "miningpool11",
          scope: this.$route.params.mid,
          table: "miners2",
          limit: 200,
          json: true,
          lower_bound: key,
        };
        const {status, result} = await this.$api.get_table_rows(params)
        if (!status) {
          return
        }
        more = result.more;
        key = result.next_key;
        lists.push(...result.rows)
      }
      this.unDealArr = lists;
      this.handleDealMiners()
    },
    handleDealMiners() {
      if (!this.unDealArr.length || !this.thisMarket.mid) {
        return
      }
      const rows = this.unDealArr || []
      const newList = [];
      rows.forEach(item => {
        let v = item;
        const inData = {
          poolSym0: parseFloat(this.thisMarket.reserve0),
          poolSym1: parseFloat(this.thisMarket.reserve1),
          poolToken: this.thisMarket.liquidity_token,
          sellToken: v.token
        }
        const nowMarket = sellToken(inData);
        v.liq_bal0 = `${parseFloat(nowMarket.getNum1).toFixed(this.thisMarket.decimal0)} ${this.thisMarket.symbol0}`
        v.liq_bal1 = `${parseFloat(nowMarket.getNum2).toFixed(this.thisMarket.decimal1)} ${this.thisMarket.symbol1}`
        let lastTime = toLocalTime(`${v.last_drip}.000+0000`);
        v.lastTime = moment(lastTime).valueOf();

        newList.push(v)
      })
      const newListSort = newList.sort((a, b) => {
        return b.token - a.token;
      })
      this.dfsPoolsJson[`${this.$route.params.mid}`] = newListSort
      localStorage.setItem('dfsPoolsJson', JSON.stringify(this.dfsPoolsJson))
      this.allMinersList = newListSort;
      this.handleCurrentChange()
    },
    handleCurrentChange() {
      const start = (this.page - 1) * this.pageSize;
      const end = this.page * this.pageSize;
      this.minersArr = this.allMinersList.slice(start, end);
      this.handleRunReward()
    },
    // 秒级定时器
    handleRunReward() {
      clearTimeout(this.secTimer)
      this.secTimer = setTimeout(() => {
        this.handleRunReward()
      }, 1000);
      this.minersArr.forEach(v => {
        if (!v.token) {
          return
        }
        const market = this.thisMarket;
        let reward = 0
        if (market.contract0 === 'tethertether' || market.contract1 === 'tethertether') {
          const num = market.contract0 === 'tethertether' ? parseFloat(v.liq_bal0) : parseFloat(v.liq_bal1) 
          const reward0 = getReward({
            poolBal: this.allBal.usdtPoolsBal,
            swapBal: this.swapBal.usdtSwapBal
          }, {
            lastTime: v.lastTime,
            num
          })
          reward = parseFloat(reward || 0) + parseFloat(reward0 || 0);
        }
        if (market.contract0 === 'eosio.token' || market.contract1 === 'eosio.token') {
          const num = market.contract0 === 'eosio.token' ? parseFloat(v.liq_bal0) : parseFloat(v.liq_bal1) 
          const reward0 = getReward({
            poolBal: this.allBal.eosPoolsBal,
            swapBal: this.swapBal.eosSwapBal
          }, {
            lastTime: v.lastTime,
            num
          })
          reward = parseFloat(reward || 0) + parseFloat(reward0 || 0);
        }
        if (market.contract0 === 'minedfstoken' || market.contract1 === 'minedfstoken') {
          const num = market.contract0 === 'minedfstoken' ? parseFloat(v.liq_bal0) : parseFloat(v.liq_bal1) 
          const reward0 = getReward({
            poolBal: this.allBal.dfsPoolsBal,
            swapBal: this.swapBal.dfsSwapBal
          }, {
            lastTime: v.lastTime,
            num
          })
          reward = parseFloat(reward || 0) + parseFloat(reward0 || 0);
        }
        this.$set(v, 'reward', reward)
      })
      this.handleRun()
    },
    // 数据滚动效果
    handleRun() {
      clearInterval(this.runTimer)
      this.runTimer = setInterval(() => {
        this.minersArr.forEach(v => {
          if (!v.token || !parseFloat(v.reward)) {
            return
          }
          const reward = v.reward;
          let showReward = v.showReward || reward;
          let tReward = v.tReward || showReward;
          const t = (reward - showReward) / 20;

          tReward = Number(tReward) + Number(t);
          showReward = toFixed(tReward, 8)
          this.$set(v, 'showReward', showReward)
          this.$set(v, 'tReward', tReward)
        })
      }, 50);
    },
  },
};
</script>

<style lang="scss" scoped>
.dfsMinerLists {
  .title {
    font-size: 32px;
    & > span {
      position: relative;
      padding-left: 32px;
      font-weight: 500;
      &::before {
        position: absolute;
        content: "";
        height: 28px;
        width: 8px;
        border-radius: 4px;
        background: $color-main;
        top: 50%;
        left: 4px;
        transform: translate(0, -50%);
      }
    }
    .totalNum {
      font-size: 24px;
      color: #999;
      .tipImg {
        width: 28px;
        margin-right: 9px;
      }
    }
  }
  .list {
    margin: 20px 0;
    padding: 28px;
    border-radius: 12px;
    border: 1px solid #eaeaea;
    .name {
      font-size: 30px;
    }
    .reward {
      font-size: 26px;
    }
    .liq {
      font-size: 24px;
      margin-top: 12px;
    }
  }
}
.page{
  /deep/ .van-pagination__item{
    color: #333;
    &::after{
      border: 0px;
    }
    &:active{
      color: #fff;
      background: #29D4B0;
    }
  }
  /deep/ .van-pagination__item--active{
    color: #fff;
    background: #29D4B0;
  }
}
</style>
