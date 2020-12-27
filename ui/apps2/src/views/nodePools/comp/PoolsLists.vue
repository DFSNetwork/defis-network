<template>
  <div class="poolsLists">
    <div class="tabDiv flexb">
      <div class="tab flexc" :class="{'actTab': tabAct === 2}" @click="tabAct = 2">
        {{ $t('nodePools.lpMineNew') }}</div>
      <div class="tab flexc" :class="{'actTab': tabAct === 1}" @click="tabAct = 1">
        {{ $t('nodePools.voteMineNew') }}</div>
    </div>
    <div v-if="tabAct === 2">
      <div class="title flexb">
        <span class="">{{ $t('nodePools.lpMineNew') }}</span>
        <span class="mineRule flexa" @click="handleShowRules('lp')">
          <span>{{ $t('miningRules.rules') }}</span>
          <img class="tipIcon" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/tips_icon_btn.svg" alt="">
        </span>
      </div>
      <div class="lpList" v-if="lpLists.length">
        <div style="position: relative;" v-for="(v, i) in lpLists" :key="`lp${i}`" @click="handleToDetailLists(v, 'lp')">
          <div class="list mg20">
            <div class="model" v-if="i >= lpLength" @click.stop="''">
              <span class="boost flexc" @click="handleTo('voteForTag')">{{ $t('nodePools.boost') }}</span>
            </div>
            <div class="poolInfo flexa">
              <img class="coinImg" :src="v.sym0Data.imgUrl" :onerror="errorCoinImg">
              <div class="bal">
                <div class="flexb">
                  <span>{{ v.symbol0 }}/{{ v.symbol1 }} {{ $t('nodePools.lpMine') }}</span>
                  <span class="apy">{{ $t('nodePools.apy') }}：{{ v.apy || '0.00' }}%</span>
                </div>
                <div class="flexend">
                  <span class="num din">
                    {{ accLpData[`${v.mid}`] ? accLpData[`${v.mid}`].showReward || '0.00000000' : '0.00000000' }}
                  </span>
                  <span class="red_p flexa" v-if="Number(handleAddBuff(accLpData[`${v.mid}`]))">（
                    <img class="buffImg" src="https://cdn.jsdelivr.net/gh/defis-net/material/svg/buff2.svg">
                    {{ handleAddBuff(accLpData[`${v.mid}`]) }}%）</span>
                </div>
              </div>
            </div>
            <div class="reward">{{ $t('nodePools.marketNum') }}：{{ handleDealReserve(v.reserve0) }}/{{ handleDealReserve(v.reserve1) }}</div>
            <!-- <div class="reward">{{ $t('market.myMarkets') }}：{{ handleDealMyLpNum(v) }}</div>
            <div class="myRank plan" @click.stop="''">
              <div class="flexb">
                <span class="flexa">
                  <span>{{ $t('nodePools.planRank') }}：</span>
                  <el-input-number v-model="plan[v.mid]" :min="1" :max="150"></el-input-number>
                </span>
                <span class="green_p" @click="handleDealToken(v)">{{ $t('nodePools.doing') }}</span>
              </div>
              <span>
                <el-slider
                  :min="1"
                  :max="100"
                  v-model="plan[v.mid]">
                </el-slider>
              </span>
            </div>
            <div class="flexb" @click.stop="''">
              <span>{{ $t('nodePools.myRank') }}：{{ accLpData[`${v.mid}`] ? accLpData[`${v.mid}`].rank || '100+' : '100+' }}</span>
            </div> -->
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="title flexb">
        <span class="">{{ $t('nodePools.voteMineNew') }}</span>
        <span class="mineRule flexa" @click="handleShowRules('rex')">
          <span>{{ $t('miningRules.rules') }}</span>
          <img class="tipIcon" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/tips_icon_btn.svg" alt="">
        </span>
      </div>
      <div class="list" v-for="(item, index) in poolsLists" :key="index"  @click="handleToDetailLists(item, 'rex')">
        <div class="model" v-if="index > 2" @click.stop="''">
          <span class="boost flexc" @click="handleShowBoost(item)">{{ $t('nodePools.boost') }}</span>
        </div>
        <div class="poolInfo flexa">
          <img class="coinImg" :src="item.imgUrl" :onerror="errorCoinImg">
          <div class="bal">
            <div class="flexb">
              <span>{{ $t('nodePools.poolsReward', {token:item.sym}) }}</span>
              <span class="apy">{{ $t('nodePools.apy') }}：{{ item.apy || '0.00' }}%</span>
            </div>
            <div class="num din">{{ poolsData[`${item.sym}-${item.mid}`] ? poolsData[`${item.sym}-${item.mid}`].showReward || '0.00000000' : '0.00000000' }}</div>
          </div>
        </div>
        <div class="reward">{{ $t('nodePools.poolsBal') }}：{{ poolsData[`${item.sym}-${item.mid}`] ? poolsData[`${item.sym}-${item.mid}`].poolbal : `0.0000 ${item.sym}` }}</div>
      </div>
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
      <MineRules v-if="showRules" :status="status"/>
    </el-dialog>

    <van-popup
      class="mypopup"
      v-model="showBoost" position="center">
      <Boost :boostData="boostData" @handleClose="handleClose"/>
    </van-popup>


    <!-- 加入做市 -->
    <el-dialog
      class="mkListDia"
      :show-close="false"
      :visible.sync="showAdd">
      <AddMarket v-if="showAdd"
        :thisMarket="thisMarket"
        @listenClose="handleClose"/>
    </el-dialog>
    <!-- 去捐款 -->
    <el-dialog
      class="mydialog"
      :show-close="false"
      :visible="showToFundation">
      <ToFundation v-if="showToFundation"
        :setCoin="boostData"
        @listenClose="handleClose"/>
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
import Boost from '../dialog/Boost';
import AddMarket from '@/views/market/popup/AddMarket'
import ToFundation from '@/views/fundation/dialog/ToFundation';

export default {
  name: 'poolsLists',
  components: {
    SureTip,
    MineRules,
    Boost,
    AddMarket,
    ToFundation,
  },
  props: {
    lpLength: {
      type:  Number,
      default: 15,
    },
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
      type: Object,
      default: function rls() {
        return {}
      }
    },
    lpRankWeight: {
      type: Number,
      default: 1,
    }
  },
  data() {
    return {
      tabAct: 2,
      errorCoinImg: 'this.src="https://ndi.340wan.com/eos/eosio.token-eos.png"',
      plan: {},
      planRank: 30,
      params: {},
      showSure: false,
      bal0: '0.0000',
      bal1: '0.0000',
      timer: null,
      // 开始时间
      lpTime: 1605096000 + 86400,
      rexTime: 1605096000,
      lpCutDown: {},
      rexCutDown: {},

      showRules: false,
      showBoost: false,
      boostData: {},

      // 弹窗
      showAdd: false,
      showToFundation: false,
      thisMarket: {},
      status: '',
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
      marketLists: state => state.sys.marketLists,
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
      handler: function lls(newVal) {
        this.handleStartTimer()
        newVal.forEach(v => {
          this.plan[v.mid] = localStorage.getItem(`node_lp${v.mid}`) ? Number(localStorage.getItem(`node_lp${v.mid}`)) : 30;
        });
        // console.log(this.accLpData)
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    handleTo(name) {
      this.$router.push({
        name
      })
    },
    handleDealMyLpNum(v) {
      if (!v) {
        return
      }
      const lpNum = this.accLpData[`${v.mid}`] || {};
      const num0 = `${Number(lpNum.market0 || 0).toFixed(4)} ${v.symbol0}`
      const num1 = `${Number(lpNum.market1 || 0).toFixed(4)} ${v.symbol1}`
      let numStr = `${num0}/${num1}`
      return numStr
    },
    handleDealReserve(reserve) {
      const arr = reserve.split(' ');
      return `${Number(arr[0]).toFixed(4)} ${arr[1]}`
    },
    handleShowRules(status) {
      this.status = status
      this.showRules = true
    },
    handleAddBuff(v) {
      if (!v) {
        return 0
      }
      let buff = (v.weight || 1) - 1;
      buff = buff * 100;
      return buff.toFixed(2)
    },
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
    handleShowBoost(item) {
      this.boostData = item
      this.showBoost = true;
      this.thisMarket = this.marketLists.find(v => v.mid === item.mid)
      // console.log(item)
    },
    handleClose(type) {
      this.showSure = false;
      this.showBoost = false;
      this.showAdd = false;
      this.showToFundation = false
      if (type === 'market') {
        this.showAdd = true;
      } else if (type === 'fundation') {
        this.showToFundation = true;
      }
    },
    handleStartTimer() {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.handleStartTimer()
      }, 5000);
      // this.handleGetBal('bal0')
      // this.handleGetBal('bal1')
    },
    handleGetBal(type = 'bal0') {
      if (!this.scatter || !this.scatter.identity || !this.lpLists.length) {
        return
      }
      this.lpLists.forEach(v => {
        // const v = this.lpLists[0];
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
          type === 'bal0' ? this.$set(v, 'bal0', balance) : this.$set(v, 'bal1', balance);
        })
      })
    },
    // 计算相差多少
    handleDealToken(v) {
      // console.log(this.rankList)
      // console.log(v)
      if (!this.rankList[v.mid] || !this.rankList[v.mid].length) {
        return 
      }
      const market = v;
      // console.log(market)
      const setRank = Number(this.plan[v.mid]);
      if (setRank > this.rankList[v.mid].length) {
        this.$message.error('当前矿工人数不足')
        return
      }
      const rank75 = this.rankList[v.mid][setRank - 1];
      const uLp = this.accLpData[v.mid] || {};
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
        bal0: v.bal0,
        bal1: v.bal1,
        // planRank: this.planRank,
        planRank: setRank,
      }
      this.params = params;
      this.showSure = true;
    },
    handleSure() {
      localStorage.setItem(`node_lp${this.params.market.mid}`, this.params.planRank)
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
  .tabDiv{
    font-size: 36px;
    margin: 14px 0;
    &>div{
      position: relative;
      height: 92px;
      flex: 1;
      &.actTab{
        color: #29D4B0;
        &::after{
          content: '';
          position: absolute;
          width: 52px;
          height: 4px;
          background: #29D4B0;
          border-radius: 4px;
          bottom: 0px;
        }
      }
    }
  }
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
  .reward{
    margin: 14px 0 0;
  }
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
  z-index: 1001;
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
  z-index: 10;
  background: #FFF;
  border: 1px solid #eee;
  padding: 20px 26px;
  border-radius: 12px;
  text-align: left;
  margin-bottom: 20px;
  &.mg20{
    margin-bottom: 30px;
  }
  .model{
    border-radius: 12px;
    position: absolute;
    height: 100%;
    width: 100%;
    left: 0;
    top: 0;
    background: rgba(255,255,255, .8);
    .boost{
      position: absolute;
      bottom: 20px;
      right: 26px;
      background: #FE8C37;
      color: #FFF;
      border-radius: 48px;
      height: 60px;
      padding: 0px 32px;
    }
  }
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
  // overflow: hidden;
  position: relative;
  height: 62px;
  display: flex;
  align-items: center;
  justify-content: center;
  .el-input-number__decrease,
  .el-input-number__increase{
    display: flex;
    align-items: center;
    justify-content: center;
    top: 2px;
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
    max-height: 900px;
    overflow: auto;
    border-radius: 20px;
    .el-dialog__body,
    .el-dialog__header{
      padding: 0;
    }
  }
}
.mypopup{
  background: transparent;
  overflow-y: visible !important;
}

.mkListDia{
  // animation: none;
  /deep/ .el-dialog{
    border-radius:12px 12px 0px 0px;
    position: relative;
    margin: auto;
    width: 690px;
    border-radius:12px;
    .el-dialog__body,
    .el-dialog__header{
      padding: 0;
    }
  }
}
</style>
