<template>
  <div class="totalInfo">
    <div>
      <div class="title">
        <span class="act">{{ $t('info.top10') }}</span>
        <span class="date">{{ nowDate }}</span>
      </div>
      <div class="lists" v-loading="topLoading">
        <div class="noData" v-if="!showArr.length">{{ $t('public.noData') }}</div>
        <div class="list" v-for="(item, index) in showArr" :key="index" @click="handleToMarket(item.mid)">
          <div class="coin flexb">
            <span class="coinName">
              <img class="coinImg" :src="item.img" alt="">
              <span>{{ item.symbol }}</span>
            </span>
            <span>{{ $t('apy.exchange24') }}: {{ item.countEos || '—' }}</span>
            <!-- <span class="green" @click="handleToMarket(item.mid)">{{ $t('invi.join') }}</span> -->
          </div>
          <div class="flexb percent">
            <div>
              <div class="num">{{ item.poolsApr || '—' }}</div>
              <div class="tip">{{ $t('info.markerFeesApr') }}</div>
            </div>
            <div>
              <div class="num">{{ parseFloat(item.value) ? item.value : '—' }}</div>
              <div class="tip">{{ $t('info.dfsMineApr') }}</div>
            </div>
            <div>
              <div class="num">{{ parseFloat(item.yfcApr) ? `${item.yfcApr}%` : '—' }}</div>
              <div class="tip">{{ $t('info.yfcApr') }}</div>
            </div>
          </div>
          <div class="flexb percent">
            <div>
              <div class="num">{{ parseFloat(item.dmdRoi) ? `${item.dmdRoi}%` : '—' }}</div>
              <div class="tip">{{ $t('apy.dmdApy') }}</div>
            </div>
            <div>
              <div class="num">{{ parseFloat(item.dbcApr) ? `${item.dbcApr}%` : '—' }}</div>
              <div class="tip">{{ $t('apy.dbcApy') }}</div>
            </div>
            <div class="total">
              <div class="num">{{ item.count }}%</div>
              <div class="tip">{{ $t('info.totalApr') }}</div>
            </div>
          </div>
          <div class="flexb liq">
            <div>{{ $t('dex.pools') }}: </div>
            <div>{{ item.reserve0 }} / {{ item.reserve1 }}</div>
          </div>
          <!-- <div class="flexb total">
            <span>{{ $t('info.totalApr') }}</span>
            <span class="num">{{ item.count }}%</span>
          </div> -->
        </div>
      </div>
    </div>

    <div>
      <div class="title">
        <span class="act">{{ $t('footer.mineDfsNum') }}(24H)</span>
      </div>
      <div class="lists dfsMine" v-loading="loading">
        <div class="list">
          <div class="flexb percent">
            <div>
              <div class="num">{{ dfsTableData[1].value }}</div>
              <div class="tip">{{ $t('footer.circulation') }}</div>
            </div>
            <div>
              <div class="num">{{ dfsTableData[2].value }}</div>
              <div class="tip">DSS</div>
            </div>
            <div>
              <div class="num">{{ dfsTableData[0].value }}</div>
              <div class="tip">{{ $t('footer.total') }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { perDayReward, getYfcReward, accAdd, toLocalTime, getDmdMinerHourRoi, getDbcReward } from '@/utils/public';
export default {
  name: 'total',
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
      feesApr: state => state.sys.feesApr,
      eggargs: state => state.sys.eggargs,
      weightList: state => state.sys.weightList, // 交易对权重列表
      list: state => state.sys.list,
      dfsPrice: state => state.sys.dfsPrice,
      dfsData: state => state.sys.dfsData,
    }),
    showArr() {
      if (!this.marketLists.length || !this.feesApr) {
        return []
      }
      let arr = [];
      const YfcPool = this.marketLists.find(vv => vv.mid === 329);
      const DbcPool = this.marketLists.find(vv => vv.mid === 346);
      this.handleTopLoading()
      const top10 = this.marketLists.slice(0, 10)
      top10.forEach(market => {
        try {
          let count = 0;
          // const v = this.eggargs.find(vv => vv.mid === market.mid);
          const wlist = this.weightList.find(vv => vv.mid === market.mid) || {}
          const weight = wlist.pool_weight || 0;
          const reward = perDayReward(weight);
          const apr = reward * this.dfsPrice / 20000 * 365 * 100;
          count = accAdd(count, apr.toFixed(2))

          const feesApr = this.feesApr.find(vv => vv.symbol === market.symbol1) || {};
          feesApr.value = `${apr.toFixed(2)}%`;
          feesApr.img = market.sym1Data.imgUrl;
          feesApr.mid = market.mid;
          feesApr.reserve0 = market.reserve0;
          feesApr.reserve1 = market.reserve1;
          count = accAdd(count, parseFloat(feesApr.poolsApr))
          const yfcReward = getYfcReward(market.mid, 'year')
          if (Number(yfcReward)) {
            const price = parseFloat(YfcPool.reserve0) / parseFloat(YfcPool.reserve1)
            const apy = yfcReward * price / 20000 * 100;
            feesApr.yfcApr = apy.toFixed(2);
            count = accAdd(count, apy.toFixed(2))
          }
          const dbcReward = getDbcReward(market.mid, 'year')
          if (Number(dbcReward)) {
            const price = parseFloat(DbcPool.reserve0) / parseFloat(DbcPool.reserve1)
            const apy = dbcReward * price / 20000 * 100;
            feesApr.dbcApr = apy.toFixed(2);
            count = accAdd(count, apy.toFixed(2))
          }
          let dmdRoi = getDmdMinerHourRoi(market, 'year')
          if (Number(dmdRoi)) {
            feesApr.dmdRoi = dmdRoi;
            count = accAdd(count, dmdRoi)
          }
          feesApr.count = count.toFixed(2);

          // 计算24H兑换量
          if (this.dfsData.tradingVolumeData) {
            const key = `mid-${market.mid}`;
            const countData = this.dfsData.tradingVolumeData[key] || {};
            let countEos = (countData.amountIn.EOS || 0) + (countData.amountOut.EOS || 0);
            countEos = countEos > 1000 ? `${(countEos / 1000).toFixed(2)}K` : countEos;
            feesApr.countEos = countEos;
          }
          arr.push(feesApr)
        } catch (error) {
          console.log(error)
        }
      })
      arr = arr.sort((a, b) => {
        return b.count - a.count
      })
      return arr;
    },
    dfsTableData() {
      return [
        {
          des: this.$t('footer.total'),
          value:
            this.dfsData && this.dfsData.reward_dfs_total
              ? this.dfsData.reward_dfs_total.split(' ')[0]
              : '0.0000',
        },
        {
          des: this.$t('footer.circulation'),
          value:
            this.dfsData && this.dfsData.circulation_dfs_total
              ? this.dfsData.circulation_dfs_total.split(' ')[0]
              : '0.0000',
        },
        {
          des: this.$t('footer.dsr'),
          value:
            this.dfsData && this.dfsData.dsr_dfs_total
              ? this.dfsData.dsr_dfs_total.split(' ')[0]
              : '0.0000',
        },
      ];
    },
    nowDate() {
      const now = new Date()
      return toLocalTime(now).substr(0, 10)
    },
    loading() {
      if (this.dfsData && this.dfsData.reward_dfs_total ||
          this.dfsData && this.dfsData.circulation_dfs_total ||
          this.dfsData && this.dfsData.dsr_dfs_total) {
        return false;
      }
      return true
    },
  },
  watch: {
  },
  data() {
    return {
      // loading: true,
      topLoading: true,
    }
  },
  methods: {
    handleTopLoading() {
      this.topLoading = false;
    },
    handleSetAllRes() {
      const allResult = [];
      const feesDataKeys = Object.keys(this.feesData)
      const coinArr = this.handleDealSymArr(this.marketLists);
      feesDataKeys.forEach((key) => {
        const isShowToken = coinArr.find(v => v.symbol === key);
        const value = this.feesData[key];
        const sym1Liq = isShowToken.reserve.split(' ')[0];
        const poolsApr = value / (sym1Liq - value) * 365 * 100;
        allResult.push({
          symbol: isShowToken.symbol,
          poolsApr: `${poolsApr.toFixed(3)}%`
        });
      })
      this.$store.dispatch('setFeesApr', allResult);
    },
    handleToMarket(mid) {
      this.$router.push({
        name: 'market',
        params: {
          mid
        }
      })
    },
    handleDealSymArr(lists = []) {
      const resArr = [];
      lists.forEach((v) => {
        resArr.push(v.sym0Data, v.sym1Data)
      })
      // 删除重复项
      const newArr = resArr.filter((item, index, self) => {
        const i = self.findIndex(v => v.contract === item.contract && v.symbol === item.symbol);
        return self.indexOf(item) === i;
      })
      return newArr
    },
  },
}
</script>

<style lang="scss" scoped>
.green{
  color: rgba(2,198,152,1);
}
.title{
  font-size: 32px;
  text-align: left;
  margin: 0 0 40px;
  position: relative;
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
      left: 30px;
      // transform: translateX(-45%);
    }
  }
  .date{
    position: absolute;
    right: 0px;
    top: 50%;
    margin-right: 0;
    font-size: 28px;
    color: #a6a6a6;
    transform: translateY(-50%);
  }
}
.lists{
  text-align: left;
  &:first-child{
    padding-top: 0;
  }
  .noData{
    text-align: center;
    margin: 100px 0;
    color: #A6A6A6;
    font-size: 24px;
  }
  .list{
    margin-bottom: 40px;
    font-size: 28px;
    color: #000;
    padding: 40px;
    border-radius: 20px;
    box-shadow: 0px 20px 40px 0px rgba(220,220,220,0.5);
    .coin{
      margin-bottom: 10px;
      .coinName{
        font-size: 40px;
        font-weight: 500;
        // color: rgba(2,198,152,1);
        display: flex;
        align-items: center;
        .coinImg{
          width: 50px;
          height: 50px;
          margin-right: 10px;
        }
      }
    }
    .percent{
      margin-top: 20px;
      &:last-child{
        margin-top: 10px;
      }
      &>div{
        flex: 1;
        &:nth-child(2){
          text-align: center;
        }
        &:last-child{
          text-align: right;
        }
      }
    }
    .liq{
      font-size: 27px;
      margin-top: 10px;
      border-top: 1px solid #eee;
      padding-top: 10px;
      align-items: flex-start;
      line-height: 40px;
      &>div{
        &:first-child{
          width: 90px;
          min-width: 90px;
        }
        &:last-child{
          text-align: right;
        }
      }
    }
    .num{
      font-size: 32px;
      font-weight: 500;
    }
    .tip{
      color: #a6a6a6;;
      font-size: 24px;
    }
    .total{
      padding-top: 10px;
    }
  }
}
.dfsMine{
  .percent{
    padding-bottom: 0 !important;
    border: 0 !important;
  }
}
.totalInfo{
  margin: 40px;
}
</style>
