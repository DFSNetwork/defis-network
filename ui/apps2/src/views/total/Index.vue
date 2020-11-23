<template>
  <div class="totalInfo">
    <div>
      <div class="title flexb">
        <span class="act">{{ $t('info.top10') }}</span>
        <!-- <span class="date">{{ nowDate }}</span> -->
        <span class="sort">
          <span>{{ $t('info.sort') }}：</span>
          <span>
            <el-select v-model="sortValue"
              class="select"
              :popper-class="'mySelectItem'"
              :popper-append-to-body="false">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </span>
        </span>
      </div>
      <div class="lists" v-loading="topLoading">
        <div class="noData" v-if="!showArr.length">{{ $t('public.noData') }}</div>
        <div class="list" v-for="(item, index) in showArr" :key="index" @click="handleToMarket(item.mid)">
          <div class="coin flexb">
            <span class="coinName">
              <img class="coinImg" :src="item.img" :onerror="errorCoinImg" alt="">
              <span>{{ item.symbol }}</span>
            </span>
            <span>{{ $t('apy.exchange24') }}: {{ item.countEos || '—' }}</span>
            <!-- <span class="green" @click="handleToMarket(item.mid)">{{ $t('invi.join') }}</span> -->
          </div>
          <div class="flexa percent">
            <div v-if="parseFloat(item.poolsApr)">
              <div class="num">{{ item.poolsApr || '—' }}</div>
              <div class="tip">{{ $t('info.markerFeesApr') }}</div>
            </div>
            <div v-if="parseFloat(item.value)">
              <div class="num">{{ parseFloat(item.value) ? item.value : '—' }}</div>
              <div class="tip">{{ $t('info.dfsMineApr') }}</div>
            </div>
            <div v-if="parseFloat(item.yfcApr)">
              <div class="num">{{ parseFloat(item.yfcApr) ? `${item.yfcApr}%` : '—' }}</div>
              <div class="tip">{{ $t('info.yfcApr') }}</div>
            </div>
            <div v-if="parseFloat(item.dmdRoi)">
              <div class="num">{{ parseFloat(item.dmdRoi) ? `${item.dmdRoi}%` : '—' }}</div>
              <div class="tip">{{ $t('apy.dmdApy') }}</div>
            </div>
            <div v-if="parseFloat(item.dbcApr)">
              <div class="num">{{ parseFloat(item.dbcApr) ? `${item.dbcApr}%` : '—' }}</div>
              <div class="tip">{{ $t('apy.dbcApy') }}</div>
            </div>
            <div v-if="parseFloat(item.pddApr)">
              <div class="num">{{ parseFloat(item.pddApr) ? `${item.pddApr}%` : '—' }}</div>
              <div class="tip">{{ $t('apy.pddApy') }}</div>
            </div>
            <div v-if="parseFloat(item.timeApy)">
              <div class="num">{{ parseFloat(item.timeApy) ? `${item.timeApy}%` : '—' }}</div>
              <div class="tip">{{ $t('apy.timeApy') }}</div>
            </div>
            <div v-if="parseFloat(item.tagLpApy)">
              <div class="num">{{ parseFloat(item.tagLpApy) ? `${item.tagLpApy}%` : '—' }}</div>
              <div class="tip">{{ $t('apy.tagLpApy') }}</div>
            </div>
          </div>
          <div class="flexb total">
            <span>{{ $t('info.totalApr') }}</span>
            <span class="num">{{ item.count }}%</span>
          </div>
          <div class="flexb liq">
            <div>{{ $t('dex.pools') }}: </div>
            <div>{{ item.reserve0 | numToShot }} / {{ item.reserve1 | numToShot }}</div>
          </div>
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
import { getYfcReward, accAdd, toLocalTime,
  getDmdMinerHourRoi, getTagLpApy } from '@/utils/public';
import { timeApy } from '@/utils/minerLogic';
import { perDayRewardV3 } from '@/utils/logic'

export default {
  name: 'total',
  data() {
    return {
      // loading: true,
      errorCoinImg: 'this.src="https://ndi.340wan.com/eos/eosio.token-eos.png"',
      topLoading: true,
      sortValue: '3', // 1 - 年化 ｜ 2 - 深度 ｜ 3 - 成交量
      options: [{
        value: '3',
        label: 'Volum'
      }, {
        value: '2',
        label: 'TVL'
      }, {
        value: '1',
        label: 'APY'
      }],
      tagLpBal: '0.0000'
    }
  },
  mounted() {
  },
  computed: {
    ...mapState({
      // 箭头函数可使代码更简练
      feesApr: state => state.sys.feesApr,
      list: state => state.sys.list,
      dfsPrice: state => state.sys.dfsPrice,
      dfsData: state => state.sys.dfsData,
      lpMid: state => state.config.lpMid,
      timeList: state => state.config.timeList,
      marketLists: state => state.sys.marketLists,
      baseConfig: state => state.sys.baseConfig,
    }),
    showArr() {
      if (!this.marketLists.length || !this.feesApr || !this.timeList.length) {
        return []
      }
      let arr = this.handleGetCheckRank()
      if (this.sortValue === '1') {
        arr = arr.sort((a, b) => {
          return b.count - a.count
        })
      }
      if (this.sortValue === '2') {
        arr = arr.sort((a, b) => {
          return parseFloat(b.reserve0) - parseFloat(a.reserve0)
        })
      }
      if (this.sortValue === '3') {
        arr = arr.sort((a, b) => {
          return b.allCount - a.allCount
        })
      }
      arr = arr.slice(0, 21)
      // console.log(arr)
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
  methods: {
    handleGetCheckRank() {
      const dmdPool = this.marketLists.find(v => v.mid === 326)
      const timePool = this.marketLists.find(v => v.mid === 530)
      let arr = [];
      this.handleTopLoading()
      const top10 = this.marketLists.slice(0, 30)
      // const top10 = this.marketLists

      top10.forEach(market => {
        if (market.contract0 !== 'eosio.token') {
          return
        }
        try {
          let count = 0;
          const reward = perDayRewardV3(market.mid);
          const apr = reward * this.dfsPrice / 20000 * 365 * 100;
          count = accAdd(count, apr.toFixed(2))

          const feesApr = this.feesApr.find(vv => vv.symbol === market.symbol1) || {};
          feesApr.value = `${apr.toFixed(2)}%`;
          feesApr.img = market.sym1Data.imgUrl;
          feesApr.mid = market.mid;
          feesApr.reserve0 = market.reserve0;
          feesApr.reserve1 = market.reserve1;
          if (!feesApr.symbol) {
            feesApr.symbol = market.symbol1;
          }
          count = accAdd(count, parseFloat(feesApr.poolsApr || 0))

          this.lpMid.forEach(lp => {
            const yfcReward = getYfcReward(market.mid, 'year', lp.symbol)
            const YfcPool = this.marketLists.find(vv => vv.mid === lp.mid);
            const price = parseFloat(YfcPool.reserve0) / parseFloat(YfcPool.reserve1)
            const apy = yfcReward * price / 20000 * 100;
            feesApr[`${lp.symbol.toLowerCase()}Apr`] = (apy || 0).toFixed(2);
            count = accAdd(count, (apy || 0).toFixed(2))
          })

          let dmdRoi = getDmdMinerHourRoi(market, 'year', dmdPool)
          if (Number(dmdRoi)) {
            feesApr.dmdRoi = dmdRoi;
            count = accAdd(count, dmdRoi)
          }

          // TIME 挖矿年化计算
          const midTimeApy = timeApy(market, 'year' ,timePool)
          if (Number(midTimeApy)) {
            feesApr.timeApy = midTimeApy;
            count = accAdd(count, midTimeApy)
          }

          if (market.mid === 602) {
            // TAG LP挖矿年化
            // console.log(market)
            const tagLpApy = getTagLpApy(market.mid)
            feesApr.tagLpApy = tagLpApy;
            count = accAdd(count, tagLpApy)
          }

          feesApr.count = count.toFixed(2);

          // 计算24H兑换量
          if (this.dfsData.tradingVolumeData) {
            const key = `mid-${market.mid}`;
            const countData = this.dfsData.tradingVolumeData[key];
            if (countData) {
              let countEos = (countData.amountIn.EOS || 0) + (countData.amountOut.EOS || 0);
              // let shortCountEos = countEos > 1000 ? `${(countEos / 1000).toFixed(2)}K` : countEos.toFixed(4);
              feesApr.countEos = countEos.toFixed(4);
              feesApr.allCount = countEos.toFixed(4);
            }
          }
          arr.push(feesApr)
        } catch (error) {
          console.log(error)
        }
      })
      return arr;
    },
    handleTopLoading() {
      this.topLoading = false;
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
  .sort{
    margin-right: 0;
    .select{
      height: 50px;
      border: 1px solid #e3e3e3;
      border-radius: 10px;
    }
    /deep/ .el-select{
      border-radius: 10px;
      .el-input__suffix-inner{
        display: flex;
        align-items: center;
        height: 50px;
      }
      .el-input__inner{
        border-radius: 10px;
        height: 50px;
        font-size: 26px;
        text-align: center;
        width: 130px;
        border: 0px;
        padding-right: 38px;
        &:focus{
          border-color: #07d79b;
        }
      }
    }
    /deep/ .el-scrollbar{
      .el-select-dropdown__item{
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 26px;
        font-weight: normal;
        &.selected{
          font-weight: bold;
          color: #07d79b;
        }
      }
    }
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
      flex-wrap: wrap;
      &:last-child{
        margin-top: 10px;
      }
      &>div{
        flex: 1;
        min-width: 30%;
        max-width: 197px;
        &:nth-child(3n+2){
          text-align: center;
        }
        &:nth-child(3n+3){
          text-align: right;
        }
      }
      &.border{
        border-bottom: 1px solid #eee;
        padding-bottom: 10px;
      }
    }
    .liq{
      font-size: 27px;
      // margin-top: 10px;
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
