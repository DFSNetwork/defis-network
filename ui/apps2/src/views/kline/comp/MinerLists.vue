<template>
  <div class="minerLists">
    <div class="title flexb">
      <span>{{ $t('mine.minersList') }}</span>
      <span class="num">{{ $t('mine.totalMiners') }}：{{ allListsLen }}</span>
    </div>
    <div class="lists">
      <div class="list" v-for="(v, i) in showLists" :key="i">
        <div class="flexb mb12">
          <span class="acc">{{ v.miner }}</span>
          <span class="reward dinReg">{{ $t('mine.earnings') }}：{{ v.showReward || '0.0000' }} DFS</span>
        </div>
        <div class="flexb pools">
          <span>{{ $t('dex.pools') }}</span>
          <span class="dinReg">{{ v.liq1 }} {{ v.symbol1 }} / {{ v.liq0 }} {{ v.symbol0 }}</span>
        </div>
      </div>

      <van-pagination
        class="page"
        v-if="showPage"
        v-model="currentPage"
        :total-items="allListsLen"
        :items-per-page="20"
        :show-page-size="4"
        :force-ellipses="true"
        :prev-text="''"
        :next-text="''"
        @change="handlePage"
      />
    </div>
  </div>
</template>

<script>
import { dealRewardV3 } from '@/utils/logic';
import { dealMinerData } from '@/utils/public';
import { sellToken } from '@/utils/logic';

export default {
  props: {
    checkedMarket: {
      type: Object,
      default: function cmt() {
        return {}
      }
    }
  },
  data() {
    return {
      showPage: true,
      currentPage: 1,
      allLists: [],
      showLists: [],
      timerSec: null,
      timerRun: null,
    }
  },
  beforeDestroy() {
    clearTimeout(this.timerSec)
    clearInterval(this.timerRun)
  },
  computed: {
    allListsLen() {
      return this.allLists.length
    }
  },
  watch: {
    checkedMarket: {
      handler: function cmt() {
        this.handleGetMiners()
      },
      deep: true,
      immediate: true,
    }
  },
  methods: {
    async handleGetMiners() {
      if (!this.checkedMarket.mid) {
        return
      }
      const params = {
        "code": "miningpool11",
        "scope": this.checkedMarket.mid,
        "table": "miners2",
        limit: 3000,
        "json": true,
      }
      const {status, result} = await this.$api.get_table_rows(params);
      if (!status) {
        return
      }
      const rows = result.rows || [];
      let newArr = []
      const item = this.checkedMarket
      rows.forEach(v => {
        const inData = {
          poolSym0: item.reserve0.split(' ')[0],
          poolSym1: item.reserve1.split(' ')[0],
          poolToken: item.liquidity_token,
          sellToken: `${v.token}`
        }
        const nowMarket = sellToken(inData);
        let liq0 = parseFloat(nowMarket.getNum1).toFixed(item.decimal0);
        let liq1 = parseFloat(nowMarket.getNum2).toFixed(item.decimal1);
        let symbol0 = item.symbol0;
        let symbol1 = item.symbol1;
        v.symbol0 = symbol0;
        v.symbol1 = symbol1;
        v.liq0 = liq0;
        v.liq1 = liq1;
        newArr.push(v)
      });
      newArr.sort((a, b) => {
        return parseFloat(b.liq0) - parseFloat(a.liq0)
      })
      this.allLists = newArr;
      this.handlePage();
    },
    handlePage() {
      const start = (this.currentPage - 1) * 20;
      const end = (this.currentPage) * 20;
      this.showLists = this.allLists.slice(start, end);
      this.handleGetReward()
    },
    handleGetReward() {
      clearTimeout(this.timerSec)
      this.timerSec = setTimeout(() => {
        this.handleGetReward()
      }, 1000);
      this.showLists.forEach(v => {
        dealMinerData(v)
        const reward = dealRewardV3(v, this.checkedMarket.mid)
        this.$set(v, 'reward', reward)
      })
      this.handleRun()
    },
    handleRun() {
      clearInterval(this.timerRun)
      this.timerRun = setInterval(() => {
        this.showLists.forEach(v => {
          const reward = v.reward;
          let showReward = v.showReward || reward;
          let tReward = v.tReward || showReward;
          const t = (reward - showReward) / 20;

          tReward = Number(tReward) + Number(t);
          showReward = tReward.toFixed(8)
          this.$set(v, 'showReward', showReward)
          this.$set(v, 'tReward', tReward)
        })
      }, 50);
    }
  }
}
</script>

<style lang="scss" scoped>
.minerLists{
  color: #333;
  .title{
    background: #F5F5F5;
    font-size: 30px;
    height: 80px;
    padding: 0 28px;
    .num{
      font-size: 24px;
      color: #999;
    }
  }
}
.lists{
  padding: 28px;
  font-size: 24px;
  .list{
    border: 1px solid #EAEAEA;
    border-radius: 12px;
    padding: 18px 26px;
    box-sizing: border-box;
    margin-bottom: 20px;
    .acc{
      font-size: 28px;
    }
    .mb12{
      margin-bottom: 12px;
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
