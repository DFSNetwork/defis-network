<template>
  <div class="rank">
    <van-tabs v-model="coinName"
      animated
      class="subTab"
      title-inactive-color="#999"
      title-active-color="#29D4B0"
      color="#29D4B0">
      <van-tab name="up" :title="$t('home.rankUp')"></van-tab>
      <van-tab name="vol" :title="$t('home.rankVol')"></van-tab>
    </van-tabs>

    <div class="lists">
      <div class="tools tip flexb">
        <span>{{ $t('home.symbol') }}</span>
        <span>{{ $t('home.newPrice') }}</span>
        <span v-if="coinName === 'up'">{{ $t('home.rate24') }}</span>
        <span v-else>{{ $t('home.vol24') }}</span>
      </div>
      <div class="list flexb" v-for="(v, i) in rankArr" :key="`rank-${i}`">
        <div class="symName din">
          <span>{{ v.symbol1 }}</span>
          <span class="small tip">/{{ v.symbol0 }}</span>
        </div>
        <div class="num dinBold"
          >{{ v.price }}</div>
        <div v-if="coinName === 'up'">
          <span class="changeBtn din"
          :class="{
            'red_p': parseFloat(v.priceRate) < 0,
          }">{{ v.priceRate }}</span>
        </div>
        <div v-else>
          <span class="changeVol din"
          :class="{
            'red_p': parseFloat(v.priceRate) < 0,
          }">${{ parseFloat(v.volume24HToUsdt).toFixed(0) }}</span>
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
      coinName: 'up',
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
      if (this.coinName === 'up') {
        nMarkets.sort((a, b) => {
          return parseFloat(b.priceRate) - parseFloat(a.priceRate)
        })
      } else {
        nMarkets = this.dealArr(nMarkets);
        nMarkets.sort((a, b) => {
          return parseFloat(b.volume24HToUsdt || 0) - parseFloat(a.volume24HToUsdt || 0)
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
    }
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
        width: 50%;
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
        &:last-child{
          text-align: right;
        }
        &:first-child{
          text-align: left;
        }
      }
    }
    .list{
      height: 70px;
      &>div{
        flex: 1;
        &:last-child{
          text-align: right;
        }
        &:first-child{
          text-align: left;
        }
      }
      .symName{
        font-size: 30px;
        .small{
          font-size: 24px;
        }
      }
      .changeVol,
      .changeBtn{
        background: #ECF6F5;
        padding: 12px 18px;
        font-size: 24px;
        color: #36B394;
        border-radius: 4px;
        &.red_p{
          background: rgba(#FF4D4D, .1);
          color: #FF4D4D;
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
