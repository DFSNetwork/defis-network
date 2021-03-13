<template>
  <div class="notice">
    <van-notice-bar v-if="voices.length"
      class="noticeBar"
      color="#333"
      :scrollable="false"
      background="#FFF">
        <template v-slot:left-icon>
          <img class="nImg" src="https://cdn.jsdelivr.net/gh/defis-net/material2/dfs/notice_icon.png">
        </template>
        <van-swipe
          vertical
          class="notice-swipe"
          :autoplay="3000"
          :show-indicators="false"
        >
          <van-swipe-item v-for="(item, i) in voices" :key="i">{{item.title}}</van-swipe-item>
        </van-swipe>
    </van-notice-bar>

    <div class="flexb lists">
      <div class="symInfo" v-for="(v, i) in top3" :key="`sym-${i}`">
        <div class="coin din">
          <span>{{ v.symbol1 }}/{{ v.symbol0 }}</span>
          <span class="smallChange dinReg"
            :class="{
              'green_p': parseFloat(v.priceRate) >= 0,
              'red_p': parseFloat(v.priceRate) < 0,
            }">
            <span>{{ v.priceRate }}</span>
          </span>
        </div>
        <div class="num dinBold"
          :class="{
            'green_p': parseFloat(v.priceRate) >= 0,
            'red_p': parseFloat(v.priceRate) < 0,
          }">
          <span>{{ parseFloat(v.price).toFixed(4) }}</span>
        </div>
        <div class="aboutPrice tip" v-if="language === 'en'">
          <span>$</span>
          <span>{{ v.aboutPriceU }}</span>
        </div>
        <div class="aboutPrice tip" v-else>
          <span>¥</span>
          <span>{{ v.aboutPriceCNY }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'homeNotice',
  data() {
    return {
      voices: [{
        title: this.$t('home.homeUi'),
      }],
      top3: [{}, {}, {}],
      hotArr: [451, 722, 17]
    }
  },
  computed: {
    ...mapState({
      language: state => state.app.language,
      marketLists: state => state.config.marketLists,
      hotLists: state => state.config.hotLists, // 生产环境
    })
  },
  watch: {
    marketLists: {
      handler: function mls(newVal) {
        if (!newVal.length) {
          return
        }
        const hot = [];
        this.hotArr.forEach(mid => {
          const has = newVal.filter(v => v.mid == mid && v.symbol0 === 'USDT');
          hot.push(...has)
        });
        this.top3 = hot;
      },
      deep: true,
      immediate: true,
    }
  },
}
</script>

<style lang="scss" scoped>
.notice{
  margin: 28px;
  // border: 1px solid $color-border;
  border-radius: 8px;
  background: #FFF;
  .noticeBar{
    padding: 0 20px;
    border-bottom: 1px solid $color-border;
    font-size: 24px;
    .nImg{
      width: 32px;
      margin-right: 10px;
    }
    .notice-swipe {
      height: 32px;
      line-height: 32px;
    }
  }
  .lists{
    font-size: 24px;
    padding: 20px;
    text-align: left;
    .symInfo{
      padding-right: 10px;
      max-width: 35%;
      position: relative;
      flex: 1;
      &:last-child{
        padding-right: 0;
      }
      .smallChange{
        // position: absolute;
        font-size: 20px;
        margin-left: 8px;
        // right: 10px;
      }
      .num{
        font-size: 40px;
        margin: 8px 0 6px;
      }
      .aboutPrice{
        font-size: 26px;
      }
    }
  }
}
</style>
