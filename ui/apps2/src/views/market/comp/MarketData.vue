<template>
  <div>
    <div :class="`tipDiv marketReward ${handleGetClass(thisMarket.mid)}`" v-if="Number(token)"
     @click="handleTo('poolsMarket')">
      <div class="flexb">
        <div class="flexa symbolInfo">
          <img class="imgCoin" :src="thisMarket.sym0Data.imgUrl" :onerror="errorCoinImg"/>
          <span>{{ thisMarket.symbol0 }}</span>
          <span class="and"><img src="https://cdn.jsdelivr.net/gh/defis-net/material/svg/add.svg" alt=""></span>
          <img class="imgCoin" :src="thisMarket.sym1Data.imgUrl" :onerror="errorCoinImg"/>
          <span>{{ thisMarket.symbol1 }}</span>
        </div>
        <div class="flexa">
          <div class="btn flexc" @click.stop="handleShowAdd">{{ $t('more.add') }}</div>
          <div class="btn backBtn flexc" @click.stop="handleShowRemove">{{ $t('more.remove') }}</div>
        </div>
      </div>
      <div class="flex">
        <span>{{ $t('mine.accPools') }}: </span>
        <span class="">{{ nowMarket.getNum1 || `0.0000` }} {{thisMarket.symbol0}} / {{ nowMarket.getNum2 || `0.0000`}} {{thisMarket.symbol1}}</span>
      </div>
      <div class="flex">
        <span>{{ $t('market.capital') }}: </span>
        <span v-if="!marketData.length || !Number(marketData[0])" class="tip maxW">
          <span>{{ $t('market.anthorOne') }}</span>
        </span>
        <span v-else>{{ `${marketData[0]} ${thisMarket.symbol0}` }} / {{ `${marketData[1]} ${thisMarket.symbol1}` }}</span>
      </div>
      <div class="flexa">
        <span>{{ $t('market.marketReward') }}: </span>
        <span v-if="rewardType === 0">
          <span :class="{'green': sym0AndSy1 ? parseFloat(marketRewardSym0) > 0 : parseFloat(marketRewardSym1) > 0,
                        'red': sym0AndSy1 ? parseFloat(marketRewardSym0) < 0 : parseFloat(marketRewardSym1) < 0}">
            {{ sym0AndSy1 ? marketRewardSym0 : marketRewardSym1 }}
          </span>
          <span :class="{'green':  sym0AndSy1 ? parseFloat(marketRewardSym1) > 0 : parseFloat(marketRewardSym0) > 0,
                        'red':  sym0AndSy1 ? parseFloat(marketRewardSym1) < 0 : parseFloat(marketRewardSym0) < 0}">
            ({{ sym0AndSy1 ? marketRewardSym1 : marketRewardSym0 }})
          </span>
        </span>
        <span v-else-if="rewardType === 1">
          <span :class="{'green': parseFloat(sym0Reward1) > 0,
                         'red': parseFloat(sym0Reward1) < 0}"
            >{{ sym0Reward1 }}</span>
        </span>
        <span v-else>
          <span :class="{'green': parseFloat(sym1Reward1) > 0,
                         'red': parseFloat(sym1Reward1) < 0}"
            >{{ sym1Reward1 }}</span>
        </span>
        <img  @click.stop="handleChangeRewardType" class="qusTip" src="https://cdn.jsdelivr.net/gh/defis-net/material/dex/price_switch_icon_green_left.svg" alt="">
        <img class="qusTip" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/tips_icon_btn.svg" @click.stop="showMarketTip = !showMarketTip">
      </div>
      <div class="flexa">
        <span>{{ $t('market.marketTime') }}: </span>
        <span>{{ $t('market.timer', {
            days: marketTime.days,
            hours: marketTime.hours,
            mins: marketTime.minutes,
            secs: marketTime.seconds
          }) }}</span>
        <!-- <span class="tip" v-if="rewardType === 0">({{ $t('market.pl') }}: 
          <span :class="{'green': Number(percent) > 0, 'red': Number(percent < 0)}">
            {{ percent }}%
          </span>)
        </span> -->
        <!-- <span>{{ JSON.stringify(marketTime) }}</span> -->
      </div>
    </div>

    <el-dialog
      class="myDialog"
      :visible.sync="showMarketTip">
      <MarketTip v-if="showMarketTip"/>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment';
import { mapState } from 'vuex';
import { EosModel } from '@/utils/eos';
import { toFixed, accSub, accMul, accDiv, getMarketTime } from '@/utils/public';
import { sellToken, getV3PoolsClass } from '@/utils/logic';
import MarketTip from '../popup/MarketTip';
export default {
  components: {
    MarketTip
  },
  props: {
    token: {
      type: String,
      default: '0'
    },
    thisMarket: {
      type: Object,
      default: function tmt() {
        return {}
      }
    },
    capital: {
      type: Array,
      default: function cp() {
        return []
      }
    },
    isList: {
      type: Boolean,
      default: false,
    },
    startTime: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      errorCoinImg: 'this.src="https://ndi.340wan.com/eos/eosio.token-eos.png"',
      nowMarket: {},
      marketData: [],
      direction: true,
      sTime: '0',
      timer: null,
      marketTime: {
        days: 0,
        hours: '00',
        minutes: '00',
        seconds: '00'
      },
      rewardType: 0, // 0 - 两个币种盈亏 ｜ 1 - sym0本位盈亏 ｜ 2 - sym1本位盈亏
      showMarketTip: false
    }
  },
  mounted() {
    this.handleGetTime()
  },
  beforeDestroy() {
    clearTimeout(this.timer)
  },
  watch: {
    startTime: {
      handler: function st() {
        this.sTime = this.startTime;
      },
      immediate: true
    },
    sTime() {
      this.handleGetTime()
    },
    token: {
      handler: function tk() {
        this.handleGetNowMarket();
      },
      immediate: true
    },
    thisMarket: {
      handler: function tm() {
        if (this.capital.length) {
          this.marketData = this.capital;
          return
        }
        this.handleGetMarketDataByChain();
        this.handleGetNowMarket();
      },
      immediate: true
    }
  },
  computed: {
    ...mapState({
      // 箭头函数可使代码更简练
      baseConfig: state => state.sys.baseConfig, // 基础配置 - 默认为{}
      scatter: state => state.app.scatter,
    }),
    marketReward() {
      if (!this.marketData.length || !Number(this.marketData[0])  || !this.nowMarket.getNum1) {
        return '0.0000';
      }
      const sym0 = accSub(parseFloat(this.nowMarket.getNum1), this.marketData[0]);
      const sym1 = accSub(parseFloat(this.nowMarket.getNum2), this.marketData[1]);
      const price = accDiv(parseFloat(this.nowMarket.getNum2), parseFloat(this.nowMarket.getNum1));
      if (this.direction) {
        const reward = sym1 + sym0 * price;
        return toFixed(reward, this.thisMarket.decimal1)
      }
      const reward = sym0 + sym1 / price;
      return toFixed(reward, this.thisMarket.decimal0)
    },
    marketRewardSym0() {
      return this.handleDealReward('sym0')
    },
    marketRewardSym1() {
      return this.handleDealReward('sym1')
    },
    sym0AndSy1() {
      return parseFloat(this.marketRewardSym0) > parseFloat(this.marketRewardSym1)
    },
    sym0Reward1() {
      const price = accDiv(parseFloat(this.nowMarket.getNum1), parseFloat(this.nowMarket.getNum2));
      let reward = parseFloat(this.marketRewardSym0) + price * parseFloat(this.marketRewardSym1)
      const decimal = this.thisMarket.decimal0 > 4 ? 4 : this.thisMarket.decimal0 ;
      reward = toFixed(reward, decimal)
      if (Number(reward) > 0) {
        reward = `+${reward}`
      }
      return `${reward} ${this.thisMarket.symbol0}`
    },
    sym1Reward1() {
      const price = accDiv(parseFloat(this.nowMarket.getNum1), parseFloat(this.nowMarket.getNum2));
      let reward = parseFloat(this.marketRewardSym0) / price + parseFloat(this.marketRewardSym1)
      const decimal = this.thisMarket.decimal1 > 4 ? 4 : this.thisMarket.decimal1 ;
      reward = toFixed(reward, decimal)
      if (Number(reward) > 0) {
        reward = `+${reward}`
      }
      return  `${reward} ${this.thisMarket.symbol1}`
    },
    sym0Reward() {
      // const price = accDiv(parseFloat(this.nowMarket.getNum1), parseFloat(this.nowMarket.getNum2));
      // let reward = parseFloat(this.marketRewardSym0) + price * parseFloat(this.marketRewardSym1)
      let reward = parseFloat(this.marketRewardSym0) * 2
      const decimal = this.thisMarket.decimal0 > 4 ? 4 : this.thisMarket.decimal0 ;
      reward = toFixed(reward, decimal)
      if (Number(reward) > 0) {
        reward = `+${reward}`
      }
      return `${reward} ${this.thisMarket.symbol0}`
    },
    sym1Reward() {
      // const price = accDiv(parseFloat(this.nowMarket.getNum1), parseFloat(this.nowMarket.getNum2));
      // let reward = parseFloat(this.marketRewardSym0) / price + parseFloat(this.marketRewardSym1)
      let reward = parseFloat(this.marketRewardSym1) * 2
      const decimal = this.thisMarket.decimal1 > 4 ? 4 : this.thisMarket.decimal1 ;
      reward = toFixed(reward, decimal)
      if (Number(reward) > 0) {
        reward = `+${reward}`
      }
      return  `${reward} ${this.thisMarket.symbol1}`
    },
    percent() {
      if (!this.marketData.length || !this.nowMarket.getNum1) {
        return '0.0000';
      }
      const sym0 = accSub(parseFloat(this.nowMarket.getNum1), this.marketData[0]);
      const sym1 = accSub(parseFloat(this.nowMarket.getNum2), this.marketData[1]);
      const price = accDiv(parseFloat(this.nowMarket.getNum2), parseFloat(this.nowMarket.getNum1));
      const reward = sym0 + sym1 / price;
      let mD = accMul(this.marketData[0], 2)
      let p = accDiv(reward, mD)
      p = accMul(p, 100);
      return toFixed(p, 2)
    }
  },
  methods: {
    handleTo(name = 'withdraw') {
      this.$router.push({
        name,
        params: {
          mid: this.thisMarket.mid
        }
      })
    },
    handleShowAdd() {
      this.$emit('listenShowAdd', this.thisMarket)
    },
    handleShowRemove() {
      this.$emit('listenShowRemove', this.thisMarket)
    },
    handleChangeRewardType() {
      this.rewardType = (this.rewardType + 1) % 3
    },
    handleDealReward(sym) {
      if (!this.marketData.length || !Number(this.marketData[0])  || !this.nowMarket.getNum1) {
        return `0.0000 ${sym === 'sym1'? this.thisMarket.symbol1 : this.thisMarket.symbol0}`;
      }
      if (sym === 'sym1') {
        const sym1 = accSub(parseFloat(this.nowMarket.getNum2), this.marketData[1]);
        const t = sym1 > 0 ? '+' : ''
        const decimal = this.thisMarket.decimal1 > 4 ? 4 : this.thisMarket.decimal1 ;
        return `${t}${toFixed(sym1, decimal)} ${this.thisMarket.symbol1}`
      }
      const t = sym0 > 0 ? '+' : ''
      const sym0 = accSub(parseFloat(this.nowMarket.getNum1), this.marketData[0]);
      const decimal = this.thisMarket.decimal0 > 4 ? 4 : this.thisMarket.decimal0 ;
      return `${t}${toFixed(sym0, decimal)} ${this.thisMarket.symbol0}`
    },
    handleGetTime() {
      clearTimeout(this.timer)
      if (Number(this.sTime)) {
        this.marketTime = getMarketTime(this.sTime)
        this.timer = setTimeout(() => {
          this.handleGetTime()
        }, 1000);
        return
      }
      this.marketTime = {
        days: 0,
        hours: '00',
        minutes: '00',
        seconds: '00'
      }
    },
    handleGetNowMarket() {
      try {
        const inData = {
          poolSym0: this.thisMarket.reserve0.split(' ')[0],
          poolSym1: this.thisMarket.reserve1.split(' ')[0],
          poolToken: this.thisMarket.liquidity_token,
          sellToken: this.token
        }
        const nowMarket = sellToken(inData);
        nowMarket.getNum1 = toFixed(nowMarket.getNum1, 4)
        nowMarket.getNum2 = toFixed(nowMarket.getNum2, 4)
        this.nowMarket = nowMarket;
      } catch(error) {
        setTimeout(() => {
          this.handleGetNowMarket()
        }, 200);
      }
    },
    handleGetMarketDataByChain() {
      const params = {
        "code": "defislogsone",
        "json": true,
        "scope": this.thisMarket.mid || this.$route.params.mid,
        "table": "records",
        "lower_bound": ` ${this.scatter.identity.accounts[0].name}`,
        "upper_bound": ` ${this.scatter.identity.accounts[0].name}`,
      }
      EosModel.getTableRows(params, (res) => {
        const list = res.rows || [];
        this.sTime = '0'
        this.marketData = [];
        if (!list.length) {
          return
        }
        // console.log(list)
        const symbol0 = list[0].bal0.split(' ');
        const symbol1 = list[0].bal1.split(' ');
        const newArr = [
          symbol0[0],
          symbol1[0]
        ]
        
        const v = this.thisMarket;
        if (symbol0[1] === v.symbol0) {
          newArr[0] = symbol0[0];
          newArr[1] = symbol1[0];
        } else if (symbol1[1] === v.symbol0) {
          newArr[0] = symbol1[0];
          newArr[1] = symbol0[0];
        }

        this.sTime = moment((`${list[0].start}.000+0000`)).valueOf() / 1000 - 8 * 3600
        this.marketData = newArr;
      })
    },
    handleGetClass(mid) {
      return getV3PoolsClass(mid)
    },
    handleJoin() {
      // this.$emit('listenToMarket', this.thisMarket)
      this.$router.push({
        name: 'market',
        params: {
          mid: this.thisMarket.mid
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.green{
  color: #07D79B;
}
.red{
  color: #E9574F;
}
.ml10{
  margin-left: 10px;
}
.tipDiv{
  border: 1px solid #e3e3e3;
  margin-top: 40px;
  border-radius: 10px;
  padding: 20px 20px;
  font-size: 25px;
  overflow: hidden;
  .btn{
    font-size: 24px;
    background:#29D4B0;
    border-radius: 30px;
    color: #fff;
    padding: 10px 35px;
    &:active{
      background:rgba(#29D4B0, .8);
    }
    &.backBtn{
      background: #E9574F;
      margin-left: 15px;
      &:active{
        background:rgba(#E9574F, .8);
      }
    }
  }
}
.marketReward{
  &>div{
    margin-top: 10px;
    &:first-child{
      margin-top: 0px;
    }
    &>span{
      line-height: 37px;
      &:first-child{
        margin-right: 10px;
      }
    }
    .small{
      font-size: 26px;
    }
    .changeImg{
      width: 30px;
    }
    .maxW{
      max-width: 420px;
    }
    .qusTip{
      padding: 0 0 0 10px;
      width: 30px;
      font-size: 24px;
    }
  }
  .symbolInfo{
    .imgCoin{
      width: 50px;
      height: 50px;
      margin-right: 10px;
      border-radius: 60px;
      overflow: hidden;
    }
    .and{
      margin: 0 20px;
      width: 30px;
    }
  }
}
.myDialog{
  /deep/ .el-dialog{
    position: relative;
    margin: auto;
    width: 590px;
    border-radius: 20px;
    .el-dialog__body,
    .el-dialog__header{
      padding: 0;
    }
  }
}
</style>
