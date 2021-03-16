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
            <div v-if="parseFloat(item.feesApr)">
              <div class="num">{{ item.feesApr || '—' }}</div>
              <div class="tip">{{ $t('info.markerFeesApr') }}</div>
            </div>
            <div v-if="parseFloat(item.aprV3)">
              <div class="num">{{ `${item.aprV3}%` }}</div>
              <div class="tip">{{ $t('info.dfsMineApr') }}</div>
            </div>
            <div v-if="parseFloat(item.pddApr)">
              <div class="num">{{ `${item.pddApr}%` }}</div>
              <div class="tip">{{ $t('apy.pddApy') }}</div>
            </div>
            <div v-if="parseFloat(item.tagLpApy)">
              <div class="num">{{ `${item.tagLpApy}%` }}</div>
              <div class="tip">{{ $t('apy.tagLpApy') }}</div>
            </div>
            <div v-if="parseFloat(item.usdcApr)">
              <div class="num">{{ `${item.usdcApr}%` }}</div>
              <div class="tip">{{ $t('apy.usdcLpApy') }}</div>
            </div>
          </div>
          <div class="flexb total">
            <span>{{ $t('info.totalApr') }}</span>
            <span class="num">{{ item.countApy }}%</span>
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
import { toLocalTime } from '@/utils/public';
import { dealApy } from '@/views/pddex/comp/appLogic.js'

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
      marketLists: state => state.sys.marketLists,
      baseConfig: state => state.sys.baseConfig,
    }),
    showArr() {
      if (!this.marketLists.length || !this.feesApr) {
        return []
      }
      let arr = this.handleGetCheckRank()
      if (this.sortValue === '1') {
        arr = arr.sort((a, b) => {
          return b.countApy - a.countApy
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
      let arr = [];
      this.handleTopLoading()
      const top10 = this.marketLists.slice(0, 30)

      top10.forEach(market => {
        if (market.contract0 !== 'eosio.token') {
          return
        }
        try {
          const topItem = {}
          topItem.img = market.sym1Data.imgUrl;
          topItem.mid = market.mid;
          topItem.reserve0 = market.reserve0;
          topItem.reserve1 = market.reserve1;
          topItem.symbol = market.symbol1;
          
          const aprInfo = dealApy(market)
          topItem.feesApr = parseFloat(aprInfo.feesApr || 0).toFixed(2);
          topItem.aprV3 = parseFloat(aprInfo.aprV3 || 0).toFixed(2);
          topItem.tagLpApy = parseFloat(aprInfo.tagLpApy || 0).toFixed(2);
          topItem.usdcApr = parseFloat(aprInfo.usdcApr || 0).toFixed(2);
          topItem.countApy = parseFloat(aprInfo.countApy || 0).toFixed(2);
          const keys = Object.keys(topItem.lpApy || {});
          keys.forEach(key => {
            topItem[key] = parseFloat(topItem.lpApy[key] || 0).toFixed(2);
          })

          // 计算24H兑换量
          if (this.dfsData.trading_volume_in && this.dfsData.trading_volume_out) {
            const inNum = this.dfsData.trading_volume_in.find(v => v.mid === market.mid && v.sym === 'EOS') || {}
            const outNum = this.dfsData.trading_volume_out.find(v => v.mid === market.mid && v.sym === 'EOS') || {}
            if (inNum || outNum) {
              let countEos = (inNum.total || 0) + (outNum.total || 0);
              topItem.countEos = countEos.toFixed(4);
              topItem.allCount = countEos.toFixed(4);
            }
          }
          arr.push(topItem)
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
