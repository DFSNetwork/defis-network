<template>
  <div class="rank">
    <van-tabs v-model="coinName"
      animated
      class="subTab"
      title-inactive-color="#999"
      title-active-color="#29D4B0"
      color="#29D4B0">
      <van-tab name="vol" :title="$t('home.rankVol')"></van-tab>
      <van-tab name="deep" :title="$t('home.rankDeep')"></van-tab>
      <van-tab name="apy" :title="$t('home.rankApy')"></van-tab>
    </van-tabs>

    <div class="lists">
      <div class="tools tip flexb">
        <span>{{ $t('home.symbol') }}</span>
        <span>{{ $t('home.newPrice') }}</span>
        <span>{{ $t('home.rate24') }}</span>
      </div>
      <div class="list flexb" v-for="(v, i) in rankArr" :key="`rank-${i}`"
        @click="handleToTrade(v)">
        <div class="flexa dinReg">
          <img class="symCoin" :src="v.imgUrl1">
          <div>
            <div class="symName din">
              <span>{{ v.symbol1 }}</span>
              <span class="small tip">/{{ v.symbol0 }}</span>
            </div>
            <div v-if="coinName === 'deep'" class="symPools tip">{{ $t('pddex.pools') }} {{ (v.poolsNum) }}</div>
            <div v-else-if="coinName === 'apy'" class="symPools tip">{{ $t('pddex.apys1') }} {{ v.countApy }}%</div>
            <div v-else class="symPools tip">{{ $t('pddex.amt1') }} ${{ parseInt(v.volume24HToUsdt) }}</div>
          </div>
        </div>
        <div class="dinReg">
          <div class="num "
            >{{ v.price }}</div>
          <div>
            <div class="tip smallTip" v-if="language === 'en'">
              <span>$</span>
              <span>{{ v.aboutPriceU }}</span>
            </div>
            <div class="tip smallTip" v-else>
              <span>¥</span>
              <span>{{ v.aboutPriceCNY }}</span>
            </div>
          </div>
        </div>
        <div>
          <span class="changeBtn din"
          :class="{
            'red_p': parseFloat(v.priceRate) < 0,
          }">{{ v.priceRate }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'homeRank',
  data() {
    return {
      coinName: 'vol',
      rankArr: [],
    }
  },
  computed: {
    ...mapState({
      language: state => state.app.language,
      marketLists: state => state.config.marketLists,
    })
  },
  watch: {
    marketLists: {
      handler: function mls(newVal) {
        if (!newVal.length) {
          return
        }
        this.handleDealRank();
      },
      deep: true,
      immediate: true,
    },
    coinName() {
      this.handleDealRank();
    }
  },
  methods: {
    handleDealRank() {
      let nMarkets = JSON.parse(JSON.stringify(this.marketLists))
      if (this.coinName === 'deep') {
        nMarkets = this.dealArr(nMarkets);
        nMarkets.sort((a, b) => {
          return parseFloat(b.usdt_value || 0) - parseFloat(a.usdt_value || 0)
        })
      } else if (this.coinName === 'vol') {
        nMarkets = this.dealArr(nMarkets);
        nMarkets.sort((a, b) => {
          return parseFloat(b.volume24HToUsdt || 0) - parseFloat(a.volume24HToUsdt || 0)
        })
      } else {
        nMarkets = this.dealArr(nMarkets);
        nMarkets.sort((a, b) => {
          return parseFloat(b.countApy || 0) - parseFloat(a.countApy || 0)
        })
      }
      const rankArr = nMarkets.slice(0, 10);
      this.rankArr = rankArr;
    },
    dealArr(arr) {
      let tArr = [];
      arr.forEach(v => {
        const has = tArr.find(vv => vv.mid === v.mid);
        if (has) {
          return
        }
        tArr.push(v)
      });
      return tArr
    },
    // 交易页面跳转
    handleToTrade(li) {
      let symbol = 'eosio.token-eos-minedfstoken-dfs';
      if (li) {
        symbol = `${li.contract1}-${li.symbol1}-${li.contract0}-${li.symbol0}`
      }
      this.$router.push({
        name: 'kLine',
        params: {
          symbol
        }
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.rank{
  font-size: 28px;
  margin: 28px;
  border-radius: 8px;
  background: #FFF;
  // border: 1px solid $color-border;
  .subTab{
    border-bottom: 1px solid $color-border;
    box-sizing: border-box;
    /deep/ .van-tabs__nav{
      padding-bottom: 0;
      .van-tab{
        font-size: 32px;
      }
      .van-tabs__line{
        height: 4px;
        width: 33.33%;
        bottom: 0;
      }
      font-size: 26px;
    }
  }
  .lists{
    padding: 0 18px 10px;
    .tools{
      height: 60px;
      font-size: 20px;
      &>span{
        flex: 1;
        text-align: right;
        max-width: 150px;
        min-width: 150px;
        &:first-child{
          flex: 2;
          text-align: left;
          max-width: 500px;
        }
      }
    }
    .list{
      height: 90px;
      .symCoin{
        width: 44px;
        height: 44px;
        border-radius: 30px;
        margin-right: 15px;
      }
      &>div{
        flex: 1;
        text-align: right;
        max-width: 150px;
        min-width: 150px;
        &:first-child{
          flex: 2;
          text-align: left;
          max-width: 500px;
        }
      }
      .symName{
        font-size: 26px;
        .small{
          font-size: 24px;
        }
      }
      .symPools,
      .smallTip{
        font-size: 20px;
        margin-top: 4px;
      }
      .changeVol,
      .changeBtn{
        background: #5AAF90;
        padding: 12px 18px;
        font-size: 24px;
        color: #FFF;
        border-radius: 4px;
        &.red_p{
          background:#FF4D4D;
          // color: #FF4D4D;
          color: #FFF !important;
        }
      }
      .changeVol{
        background: #FFF;
        &.red_p{
          background: #FFF;
        }
      }
    }
  }
}
</style>
