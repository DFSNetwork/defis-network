<template>
  <div class="dfsFarmsInfo">
    <div class="bg">
      <div>{{ $t('invite.dfsFarms') }}</div>
    </div>
    <div class="mainData">
      <div class="title flexa">
        <span>{{ $t('invite.farmsData') }}</span>
        <img class="tipIcon" @click="showTip = true"
          src="https://cdn.jsdelivr.net/gh/defis-net/material2/icon/tip.png">
      </div>
      <div class="flexb li">
        <div>
          <div class="num dinBold">${{ countWealth }} </div>
          <div class="tip subTitle">{{ $t('invite.farmWealth') }}</div>
        </div>
        <div>
          <div class="num dinBold">${{ fundNum }}</div>
          <div class="tip subTitle">{{ $t('invite.fund') }}</div>
        </div>
      </div>
      <div class="flexb li">
        <div>
          <div class="num dinBold">{{ lists.length }}</div>
          <div class="tip subTitle">{{ $t('invite.farmsNum') }}</div>
        </div>
        <div>
          <div class="num dinBold">{{ countNum }}</div>
          <div class="tip subTitle">{{ $t('invite.farmersNum') }}</div>
        </div>
      </div>
    </div>
    <van-popup v-model="showTip" class="popup_p">
      <FarmsData />
    </van-popup>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { toFixed } from '@/utils/public';
import { sellToken } from '@/utils/logic';
import FarmsData from '../dialog/FarmsData';
export default {
  name: 'dfsFarmsInfo',
  components: {
    FarmsData,
  },
  props: {
    lists: {
      type: Array,
      default: function ls() {
        return []
      }
    }
  },
  data() {
    return {
      showTip: false,
      nowMarket: {},
    }
  },
  mounted() {
    this.handleGetFarmFund()
  },
  computed: {
    ...mapState({
      coinPrices: (state) => state.sys.coinPrices,
      marketLists: state => state.sys.marketLists,
    }),
    countNum() {
      let t = 0;
      this.lists.forEach(v => {
        t = t + v.farmers;
      })
      return t
    },
    countWealth() {
      let t = 0;
      this.lists.forEach(v => {
        t = t + parseFloat(v.wealth || 0);
      })
      return t.toFixed(2)
    },
    fundNum() {
      const tagPrice = this.coinPrices.find(v => v.coin === 'TAG').price || 0;
      let r = parseFloat(this.nowMarket.getNum0 || 0) * parseFloat(tagPrice || 0) * 2
      return parseFloat(r || 0).toFixed(4)
    },
  },
  methods: {
    // 获取农场基金
    async handleGetFarmFund() {
      // 获取 fund.tag 账户下 737 交易对总估值（USDT价值）
      const params = {
        code: "defisswapcnt",
        json: true,
        lower_bound: " fund.tag",
        scope: 737,
        table: "liquidity",
        upper_bound: " fund.tag",
      }
      const {status, result} = await this.$api.get_table_rows(params);
      if (!status) {
        return
      }
      const rows = result.rows || []
      if (!rows.length) {
        return
      }
      this.handleGetNowMarket(rows[0])
    },
    // 计算实时的双边数量
    handleGetNowMarket(data) {
      try {
        const market = this.marketLists.find(v => v.mid === 737)
        const inData = {
          poolSym0: market.reserve0.split(' ')[0],
          poolSym1: market.reserve1.split(' ')[0],
          poolToken: market.liquidity_token,
          sellToken: data.token
        }
        const nowMarket = sellToken(inData);
        this.nowMarket = {
          getNum0: toFixed(nowMarket.getNum1, 4),
          getNum1: toFixed(nowMarket.getNum2, 4),
          sym0: market.symbol0,
          sym1: market.symbol1,
          contract0: market.contract0,
          contract1: market.contract1,
        };
      } catch(error) {
        console.log(error)
        setTimeout(() => {
          this.handleGetNowMarket(data)
        }, 200);
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.dfsFarmsInfo{
  font-size: 28px;
  color: #333;
  .bg{
    background: $color-main;
    height: 300px;
    padding-top: 32px;
    box-sizing: border-box;
    font-size: 44px;
    color: #FFF;
  }
  .mainData{
    text-align: left;
    margin: -170px 28px 30px;
    background: #FFF;
    border-radius: 16px;
    padding: 30px 26px;
    box-shadow: 0px 4px 8px 4px rgba(237,237,237,0.5);
  }
  .title{
    font-size: 32px;
    margin-bottom: 15px;
    .tipIcon{
      width: 32px;
      margin-left: 15px;
    }
  }
  .li{
    margin-top: 26px;
    &>div{
      flex: 1;
    }
    .num{
      font-size: 36px;
      margin-bottom: 7px;
    }
  }
}
</style>
