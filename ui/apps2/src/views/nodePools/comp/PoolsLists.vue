<template>
  <div class="poolsLists">
    <div class="title flexb">
      <span class="act">{{ $t('nodePools.poolsLists') }}</span>
      <span class="mineRule flexa" @click="showRules = true">
        <span>{{ $t('miningRules.rules') }}</span>
        <img class="tipIcon" src="@/assets/img/dex/tips_icon_btn.svg" alt="">
      </span>
    </div>
    <div class="lpList" v-if="lpLists.length">
      <div class="bgShadow"></div>
      <div class="lpCutDown flexc" v-if="lpCutDown.total > 0">
        <div>
          <div>{{ $t('nodePools.cutDown', {type: 'LP'}) }}</div>
          <div>{{ lpCutDown.hours }}:{{ lpCutDown.minutes }}:{{ lpCutDown.seconds }}</div>
        </div>
      </div>
      <div class="list" v-for="(v, i) in lpLists" :key="`lp${i}`" @click="handleToDetailLists(v, 'lp')">
        <div class="poolInfo flexa">
          <img class="coinImg" :src="v.sym1Data.imgUrl">
          <div class="bal">
            <div class="flexb">
              <span>{{ v.symbol0 }}/{{ v.symbol1 }} {{ $t('nodePools.lpMine') }}</span>
              <span class="apy">{{ $t('nodePools.apy') }}：{{ v.apy }}%</span>
            </div>
            <div class="flexend">
              <span class="num din">{{ accLpData.showReward || '0.00000000' }}</span>
              <span class="red_p flexa" v-if="Number(addBuff)">（
                <img class="buffImg" src="@/assets/img/poolspage/buff2.svg">
                {{ addBuff }}%）</span>
            </div>
          </div>
        </div>
        <div class="reward">{{ $t('nodePools.marketNum') }}：{{ v.reserve0 }}/{{ v.reserve1 }}</div>

        <div class="myRank plan" @click.stop="''">
          <div class="flexb">
            <span class="flexa">
              <span>{{ $t('nodePools.planRank') }}：</span>
              <el-input-number v-model="planRank" :min="1" :max="150"></el-input-number>
            </span>
            <span class="green_p" @click="handleDealToken">{{ $t('nodePools.doing') }}</span>
          </div>
          <span>
            <el-slider
              :min="1"
              :max="100"
              v-model="planRank">
            </el-slider>
          </span>
        </div>
        <div class="flexb" @click.stop="''">
          <span>{{ $t('nodePools.myRank') }}：{{ rank }}</span>
        </div>
      </div>
    </div>
    <div class="rexCutDown" v-if="rexCutDown.total > 0">
      <div>{{ $t('nodePools.cutDown', {type: 'REX'}) }}</div>
      <div>{{ rexCutDown.hours }}:{{ rexCutDown.minutes }}:{{ rexCutDown.seconds }}</div>
    </div>
    <div class="list" v-for="(item, index) in poolsLists" :key="index"  @click="handleToDetailLists(item, 'rex')">
      <div class="poolInfo flexa">
        <img class="coinImg" :src="item.imgUrl">
        <div class="bal">
          <div class="flexb">
            <span>{{ $t('nodePools.poolsReward', {token:item.sym}) }}</span>
            <span class="apy">{{ $t('nodePools.apyShort') }}：{{ item.apy || '0.00' }}%</span>
          </div>
          <div class="num din">{{ poolsData[item.sym] ? poolsData[item.sym].showReward || '0.00000000' : '0.00000000' }}</div>
        </div>
      </div>
      <div class="reward">{{ $t('nodePools.poolsBal') }}：{{ poolsData[item.sym] ? poolsData[item.sym].bal : `0.0000 ${item.sym}` }}</div>
    </div>

    <el-dialog
      class="myDialog"
      :show-close="false"
      :visible.sync="showSure">
      <SureTip v-if="showSure" :params="params"
        @handleSure="handleSure" @handleClose="handleClose"/>
    </el-dialog>

    <el-dialog
      class="myDialog"
      :visible.sync="showRules">
      <MineRules v-if="showRules"/>
    </el-dialog>
  </div>
</template>

<script>
import { toFixed, countdown } from '@/utils/public';
import { sellToken } from '@/utils/logic';
import { mapState } from 'vuex';
import { EosModel } from '@/utils/eos';

import SureTip from '@/views/farms/dialog/SureTip';
import MineRules from '../dialog/MineRules';

export default {
  name: 'poolsLists',
  components: {
    SureTip,
    MineRules,
  },
  props: {
    poolsLists: {
      type: Array,
      default: function pls() {
        return []
      }
    },
    poolsData: {
      type: Object,
      default: function pls() {
        return {}
      }
    },
    lpLists: {
      type: Array,
      default: function lps() {
        return []
      }
    },
    accLpData: {
      type: Object,
      default: function ald() {
        return {}
      }
    },
    rank: {
      type: String,
      default: '0'
    },
    rankList: {
      type: Array,
      default: function rls() {
        return []
      }
    },
    lpRankWeight: {
      type: Number,
      default: 1,
    }
  },
  data() {
    return {
      planRank: 30,
      params: {},
      showSure: false,
      bal0: '0.0000',
      bal1: '0.0000',
      timer: null,
      // 开始时间
      lpTime: 1605067200,
      rexTime: 1604980800,
      lpCutDown: {},
      rexCutDown: {},

      showRules: false,
    }
  },
  mounted() {
    this.handleCountdown();
    this.planRank = localStorage.getItem(`node_lp`) ? Number(localStorage.getItem(`node_lp`)) : 30;
  },
  beforeDestroy() {
    clearTimeout(this.timer)
  },
  computed: {
    ...mapState({
      scatter: state => state.app.scatter,
      baseConfig: state => state.sys.baseConfig,
    }),
    addBuff() {
      let buff = (this.lpRankWeight || 1) - 1;
      buff = buff * 100;
      return buff.toFixed(2)
    }
  },
  watch: {
    scatter: {
      handler: function listen(newVal) {
        if (newVal.identity) {
          this.handleStartTimer()
        }
      },
      deep: true,
      immediate: true,
    },
    lpLists: {
      handler: function lls() {
        this.handleStartTimer()
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    handleCountdown() {
      const rexT = countdown(this.rexTime, true, 'hours')
      this.rexCutDown = rexT;
      const lpT = countdown(this.lpTime, true, 'hours')
      this.lpCutDown = lpT;
      if (rexT.total <= 0 && lpT.total <= 0) {
        return
      }
      setTimeout(() => {
        this.handleCountdown();
      }, 1000);
    },
    handleClose() {
      this.showSure = false;
    },
    handleStartTimer() {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.handleStartTimer()
      }, 5000);
      this.handleGetBal('bal0')
      this.handleGetBal('bal1')
    },
    handleGetBal(type = 'bal0') {
      if (!this.scatter || !this.scatter.identity || !this.lpLists.length) {
        return
      }
      const v = this.lpLists[0];
      let params = {
        code: v.contract0,
        coin: v.symbol0,
        decimal: v.decimal0,
      }
      if (type !== 'bal0') {
        params = {
          code: v.contract1,
          coin: v.symbol1,
          decimal: v.decimal1,
        }
      }
      EosModel.getCurrencyBalance(params, res => {
        let balance = toFixed('0.0000000000001', params.decimal);
        (!res || res.length === 0) ? balance : balance = res.split(' ')[0];
        type === 'bal0' ? this.bal0 = balance : this.bal1 = balance;
      })
    },
    // 计算相差多少
    handleDealToken() {
      if (!this.rankList.length || !this.lpLists.length) {
        return 
      }
      const market = this.lpLists[0];
      console.log(market)
      const setRank = Number(this.planRank);
      const rank75 = this.rankList[setRank - 1];
      console.log(rank75)
      const uLp = this.accLpData || {};
      const tToken = parseInt(rank75.token) - parseInt(uLp.token || 0)
      const inData = {
        poolSym0: market.reserve0.split(' ')[0],
        poolSym1: market.reserve1.split(' ')[0],
        poolToken: market.liquidity_token,
        sellToken: Math.abs(tToken)
      }
      const out = sellToken(inData)
      const pay0 = toFixed(out.getNum1, market.decimal0)
      const pay1 = toFixed(out.getNum2, market.decimal1)
      const params = {
        market,
        pay0,
        pay1,
        token: tToken,
        bal0: this.bal0,
        bal1: this.bal1,
        planRank: this.planRank,
      }
      this.params = params;
      this.showSure = true;
      console.log(this.params)
    },
    handleSure() {
      localStorage.setItem(`node_lp`, this.planRank)
      setTimeout(() => {
      }, 1000);
      setTimeout(() => {
      }, 3000);
    },
    // 去矿工列表
    handleToDetailLists(item, type) {
      let sym;
      if (type === 'rex') {
        sym = `${item.contract}-${item.sym}`
      } else {
        sym = item.mid;
      }
      this.$router.push({
        name: 'poolDetail',
        params: {
          type,
          sym
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.poolsLists{
  margin: 32px;
  font-size: 28px;
  color: #333;
}
.title{
  font-size: 32px;
  text-align: left;
  margin: 0 0 20px;
  .act{
    color: #333;
    position: relative;
    padding-left: 28px;
    &::before{
      content: '';
      position: absolute;
      width: 8px;
      height: 30px;
      background:rgba(2,198,152,1);
      border-radius:4px;
      top: 50%;
      left: 0;
      transform: translateY(-45%);
    }
  }
  .mineRule{
    margin-right: 0;
    font-size: 26px;
    .tipIcon{
      margin-left: 10px;
      width: 28px;
    }
  }
}
.lpList{
  position: relative;
  .myRank{
    margin-top: 15px;
    // border-top: 1px solid #eee;
  }
}
.lpCutDown{
  text-align: center;
  color: #f5a623;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(255,255,255, .9);
  font-size: 33px;
  z-index: 2001;
  border-radius: 12px;
}
.rexCutDown{
  text-align: center;
  margin: 20px;
  color: #f5a623;
  font-size: 33px;
}
.list{
  position: relative;
  z-index: 1;
  background: #FFF;
  border: 1px solid #eee;
  padding: 20px 26px;
  border-radius: 12px;
  text-align: left;
  margin-bottom: 20px;
  .poolInfo{
    margin-bottom: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
    .bal{
      flex: 1;
    }
    .coinImg{
      width: 100px;
      height: 100px;
      border-radius: 50%;
      margin-right: 10px;
    }
    .num{
      font-size: 50px;
    }
    .buffImg{
      width: 25px;
    }
    .apy{
      color: #333;
    }
  }
}

/deep/ .el-input-number{
  overflow: hidden;
  .el-input-number__decrease,
  .el-input-number__increase{
    display: flex;
    align-items: center;
    justify-content: center;
    height: 56px;
    width: 50px;
    box-sizing: border-box;
    font-size: 24px;
  }
  .el-input{
    font-size: 27px;
    .el-input__inner{
      height: 60px;
    }
  }
}
/deep/ .el-slider__runway{
  margin: 30px 0;
  .el-slider__button-wrapper{
    height: 60px;
    width: 60px;
    top: -25px;
    .el-slider__button{
      height: 30px;
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
