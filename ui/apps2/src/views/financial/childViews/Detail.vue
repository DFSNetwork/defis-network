<template>
  <div class="detail">
    <div class="title flexb">
      <span class="back flexa" @click="$router.back()">
        <img src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/back.png" alt="">
      </span>
      <span>{{ $t('financial.detail') }}</span>
      <span class="back"></span>
    </div>
    <!-- 币种 -->
    <div class="coinData flexa">
      <img class="coinImg" src="https://cdn.jsdelivr.net/gh/defis-net/material2/coin/eosio.token-eos.svg" alt="">
      <div class="coinInfo">
        <div class="coinName">EOS</div>
        <div class="contract tip">eosio.token</div>
      </div>
    </div>
    <!-- 产品信息 -->
    <div class="detailInfo">
      <div class="info flexs">
        <div class="apyInfo">
          <div class="tip subTitle">{{ $t('financial.apy') }}</div>
          <div class="num dinBold">{{ apy }}%</div>
          <div class="type flexa tip">
            <img src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/kline.png" alt="">
            <span>{{ $t('financial.status1') }}</span>
          </div>
        </div>
        <div class="time">
          <div class="tip subTitle flexa">
            <span>{{ $t('financial.date1') }}</span>
            <img @click="showTip = true" class="tipImg" src="https://cdn.jsdelivr.net/gh/defis-net/material/dex/tips_icon_btn.svg" alt="">
          </div>
          <div class="date dinBold">{{ $t('financial.day', {days: 4}) }}</div>
          <div class="count">
            <span class="tip">{{ $t('financial.amount') }}：</span>
            <span class="din">{{ depositNum }}</span>
          </div>
        </div>
      </div>
      <div class="desc tip">
        <div>{{ $t('financial.tip1') }}</div>
        <div class="mt10">{{ $t('financial.tip2') }}：{{ about }} YFC</div>
      </div>
    </div>


    <!-- 我的理财 -->
    <MyFinancial :args="args" ref="myFinancial" @listenNoDeposit="handleShowRules"/>
    <!-- 交易规则 -->
    <TradeRules />

    <div class="nullDiv"></div>
    <div class="btnDiv">
      <div class="btn flexc" @click="showDeposit = true">{{ $t('financial.deposit') }}</div>
    </div>

    <el-dialog
      class="mydialog"
      :show-close="false"
      :visible.sync="showDeposit">
      <Deposit v-if="showDeposit" @listenClose="handleClose"/>
    </el-dialog>

    <el-dialog
      class="mydialog"
      :show-close="false"
      :visible.sync="showTip">
      <Rules v-if="showTip" />
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import TradeRules from '../comp/TradeRules';
import MyFinancial from '../comp/MyFinancial';
import Deposit from '../dialog/Deposit';
import Rules from '../dialog/Rules';

import { gat_apys } from '../js/financial';

export default {
  name: 'financialDetail',
  components: {
    TradeRules,
    MyFinancial,
    Deposit,
    Rules,
  },
  data() {
    return {
      showDeposit: false,
      apy: '0.00',
      argsTimer: null,
      depositNum: 0,
      args: {},
      showRules: true,
      showTip: false,
      price: '0.0000',
    }
  },
  mounted() {
    this.handleGetApy()
    this.handleGetDepositNum()
  },
  beforeDestroy() {
    clearTimeout(this.argsTimer)
  },
  watch: {
    filterMkLists: {
      handler: function fm(newVal) {
        if (!newVal.length) {
          return
        }
        const market = newVal.find(v => v.mid === 329)
        this.price = parseFloat(market.reserve0) / parseFloat(market.reserve1)
      },
      deep: true,
      immediate: true,
    },
  },
  computed: {
    ...mapState({
      filterMkLists: state => state.sys.filterMkLists,
    }),
    about() {
      if (!this.args.aprs || !Number(this.price)) {
        return '0.00000000'
      }
      const apyAcc = Math.pow(this.args.aprs, 86400) - 1;
      const yfcPrice = this.price;
      const yfcNum = 10000 / yfcPrice;
      let reward = yfcNum * apyAcc;
      return reward.toFixed(8)
    }
  },
  methods: {
    handleShowRules(noDeposit) {
      this.showRules = noDeposit;
    },
    handleClose(type) {
      this.showDeposit = false;
      this.showTip = false;
      if (type) {
        // 获取新的用户挖矿数据
        // 获取总理财数据
        setTimeout(() => {
          this.handleGetDepositNum()
          this.handleGetApy()
          this.$refs.myFinancial.handleGetAccDepInfo()
        }, 1500);
      }
    },
    // 获取理财年化
    async handleGetApy() {
      clearTimeout(this.argsTimer)
      this.argsTimer = setTimeout(() => {
        this.handleGetApy()
      }, 5000);
      gat_apys((res) => {
        // console.log(res)
        this.apy = res.apy || '0.00';
        this.args = res;
      })
    },
    // 获取理财总额
    async handleGetDepositNum() {
      const params = {
        "code": "yfcsteadyone",
        "scope": "yfcsteadyone",
        "table": "guns",
        "json": true,
        limit: 2000
      }
      const {status, result} = await this.$api.get_table_rows(params)
      if (!status) {
        return
      }
      const rows = result.rows || [];
      // console.log(rows)
      this.depositNum = rows[0].bullet;
    }
  }
}
</script>

<style lang="scss" scoped>
/*iphone Xs Max*/
@media only screen and (device-width: 414px) and (device-height: 896px) {
  .btnDiv{
    bottom: 30px !important;
  }
}
/*iphoneX、iphoneXs*/
@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
  .btnDiv{
    bottom: 30px !important;
  }
}
.detail{
  text-align: left;
  font-size: 24px;
  color: #333;
  .title{
    font-size: 36px;
    height: 80px;
    padding: 0 28px;
    font-weight: 500;
    .back{
      width: 50px;
      height: 50px;
      img{
        display: block;
        width: 18px;
      }
    }
  }
  .coinData{
    margin: 0 32px;
    padding: 24px 0;
    border-bottom: 1px solid rgba(220,220,220, .3);
    .coinImg{
      width: 72px;
      height: 72px;
      border-radius: 50%;
      margin-right: 20px;
    }
    .coinInfo{
      .coinName{
        font-size: 28px;
        font-weight: 500;
      }
      .contract{
        font-size: 22px;
      }
    }
  }
  .detailInfo{
    padding: 28px;
    border-bottom: 26px solid #f5f5f5;
  }
  .info{
    &>div{
      flex: 1;
    }
    .subTitle{
      font-size: 30px;
      margin-bottom: 20px;
      .tipImg{
        width: 32px;
        margin-left: 8px;
      }
    }
    .num{
      font-size: 56px;
      line-height: 64px;
      color: #E62C3B;
    }
    .date{
      font-size: 36px;
      line-height: 64px;
    }
    .type{
      margin-top: 24px;
      background: #F7F8FA;
      border-radius: 5px;
      width: 140px;
      img{
        width: 44px;
        margin-right: 8px;
      }
    }
    .count{
      line-height: 40px;
      margin-top: 24px;
    }
  }
  .desc{
    padding: 20px;
    margin: 40px 0 0;
    background: #F7F8FA;
    font-size: 26px;
    border-radius: 12px;
    .mt10{
      margin-top: 10px;
    }
  }
}
.nullDiv{
  height: 135px;
  width: 100%;
}
.btnDiv{
  // height: 120px;
  width: 100%;
  max-width: 750px;
  position: fixed;
  bottom: 10px;
  background: #FFF;
  z-index: 1000;
  .btn{
    height: 90px;
    background: #29D4B0;
    border-radius: 45px;
    font-size: 32px;
    font-weight: 500;
    color: #FFF;
    margin: 15px 32px 30px;
  }
}
.mydialog{
  /deep/ .el-dialog{
    width: 697px;
  }
}
</style>
