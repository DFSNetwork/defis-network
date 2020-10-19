<template>
  <div class="timeRank">
    <div class="lists flexs">
      <div class="coinDiv flexc">
        <img class="coin" src="https://apps.defis.network/static/coin/xpettimecore-time.png?v=2" alt="">
      </div>
      <div class="f1">
        <div class="projectName flexb">
          <span>TIME/EOS抢座位</span>
          <span class="claim green" @click.stop="handleDealToken">一键抢占</span>
        </div>
        <div class="plan">
          <span class="flexa">
            <span>预约排名：</span>
            <el-input-number v-model="planRank" :min="51" :max="100" label="描述文字"></el-input-number>
            <!-- <input type="number" min="51" max="100"> -->
          </span>
          <span>
            <el-slider
              :min="51"
              :max="100"
              v-model="planRank">
            </el-slider>
          </span>
        </div>
        <div class="reward">
          <span>当前排名：{{rank}}</span>
          <span></span>
        </div>
        <div class="about">
          <span>我的Token：{{ userMine[`${mid}`] ? parseInt(userMine[`${mid}`].liq_bal0) : 0 }}</span>
        </div>
      </div>
    </div>

    <el-dialog
      class="myDialog"
      :show-close="false"
      :visible.sync="showSure">
      <SureTip v-if="showSure" :params="params"
        @handleSure="handleSure" @handleClose="handleClose"/>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { EosModel } from '@/utils/eos';
import { toFixed } from '@/utils/public';
import { sellToken } from '@/utils/logic';

import SureTip from '../dialog/SureTip';
export default {
  name: 'toolsTimeRank',
  components: {
    SureTip,
  },
  data() {
    return {
      mid: '530',
      rank: 0,
      userMine: {},
      rankList: [],
      planRank: 75,
      market: {},
      bal0: '0.0000',
      bal1: '0.0000',

      showSure: false,
      timer: null,
      params: {},
    }
  },
  props: {
    marketLists: {
      type: Array,
      default: function mlt() {
        return []
      }
    },
  },
  mounted() {
    this.handleGetTimePoolMiners()
    this.planRank = localStorage.getItem(`rank_mid_${this.mid}`) ? Number(localStorage.getItem(`rank_mid_${this.mid}`)) : 75;
  },
  beforeDestroy() {
    clearTimeout(this.timer)
  },
  watch: {
    scatter: {
      handler: function listen(newVal) {
        if (newVal.identity) {
          this.handleGetUser();
          this.handleGetRank();
        }
      },
      deep: true,
      immediate: true,
    },
    marketLists: {
      handler: function listen(newVal) {
        this.market = newVal.find(v => v.mid == this.mid) || {}
        if (!this.market.mid) {
          return
        }
        if (this.timer) {
          return
        }
        this.handleStartTimer()
      },
      deep: true,
      immediate: true,
    }
  },
  computed: {
    ...mapState({
      scatter: state => state.app.scatter,
      timeList: state => state.config.timeList,
      baseConfig: state => state.sys.baseConfig,
    }),
  },
  methods: {
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
      if (!this.scatter || !this.scatter.identity || !this.market.mid) {
        return
      }
      const v = this.market;
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
    handleGetRank() {
      if (!this.rankList.length || !this.scatter.identity.accounts[0].name) {
        return
      }
      const rankIndex = this.rankList.findIndex(v => v.miner === this.scatter.identity.accounts[0].name);
      if (rankIndex !== -1) {
        this.rank = rankIndex + 1;
      } else {
        this.rank = '100+'
      }
    },
    // 获取排名
    handleGetTimePoolMiners() {
      const params = {
        "json":true,
        "code":"loottimemine",
        "scope": this.mid,
        "table":"miners",
        "index_position":"2",
        "key_type":"i64",
        "limit":100,
        "reverse":true,
        "show_payer":false
      }
      EosModel.getTableRows(params, (res) => {
        const rows = res.rows || []
        if (!rows.length) {
          return
        }
        // console.log(rows)
        this.rankList = rows;
        this.handleGetRank();
      })
    },
    // 获取用户当前做市数据
    handleGetUser() {
      const name = this.scatter.identity.accounts[0].name;
      const params = {
        "json":true,
        "code":"loottimemine",
        "scope": this.mid,
        "table":"miners",
        "lower_bound": ` ${name}`,
        "upper_bound": ` ${name}`,
        "limit":1,
        "reverse":true,
        "show_payer":false
      }
      EosModel.getTableRows(params, (res) => {
        const rows = res.rows || []
        if (!rows.length) {
          return
        }
        this.userMine[`${this.mid}`] = rows[0];
      })
    },
    // 计算相差多少
    handleDealToken() {
      if (!this.rankList.length || !this.marketLists.length) {
        return 
      }
      const market = this.marketLists.find(v => v.mid == this.mid)
      const setRank = Number(this.planRank);
      const rank75 = this.rankList[setRank - 1];
      const uLp = this.userMine[this.mid] || {};
      const tToken = parseInt(rank75.liq_bal0) - parseInt(uLp.liq_bal0 || 0)
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
    },
    handleSure() {
      localStorage.setItem(`rank_mid_${this.mid}`, this.planRank)
      setTimeout(() => {
        this.handleGetTimePoolMiners();
        this.handleGetUser();
      }, 1000);
      setTimeout(() => {
        this.handleGetTimePoolMiners();
        this.handleGetUser();
      }, 3000);
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../comp/comp.scss';
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
