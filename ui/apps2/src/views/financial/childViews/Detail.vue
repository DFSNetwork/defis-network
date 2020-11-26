<template>
  <div class="detail">
    <div class="title flexb">
      <span class="back flexa" @click="$router.back()">
        <img src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/back.png" alt="">
      </span>
      <span>产品详情</span>
      <span class="back"></span>
    </div>
    <!-- 币种 -->
    <div class="coinData flexa">
      <img class="coinImg" src="https://cdn.jsdelivr.net/gh/defis-net/material/coin/eosio.token-eos.svg" alt="">
      <div class="coinInfo">
        <div class="coinName">EOS</div>
        <div class="contract tip">eosio.token</div>
      </div>
    </div>
    <!-- 产品信息 -->
    <div class="detailInfo">
      <div class="info flexs">
        <div class="apyInfo">
          <div class="tip subTitle">实时年化</div>
          <div class="num dinBold">{{ apy }}%</div>
          <div class="type flexa tip">
            <img src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/kline.png" alt="">
            <span>稳健型</span>
          </div>
        </div>
        <div class="time">
          <div class="tip subTitle flexa">
            <span>产品期限</span>
            <img @click="showTip = true" class="tipImg" src="https://cdn.jsdelivr.net/gh/defis-net/material/dex/tips_icon_btn.svg" alt="">
          </div>
          <div class="date dinBold">4天</div>
          <div class="count tip">理财总额：{{ depositNum }}</div>
        </div>
      </div>
      <div class="desc tip">
        存入EOS，由智能合约自动操作参与挖矿。
      </div>
    </div>

    <!-- 交易规则 -->
    <TradeRules v-if="showRules"/>
    <!-- 我的理财 -->
    <MyFinancial :args="args" ref="myFinancial" @listenNoDeposit="handleShowRules"/>

    <div class="nullDiv"></div>
    <div class="btnDiv">
      <div class="btn flexc" @click="showDeposit = true">存入</div>
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
import TradeRules from '../comp/TradeRules';
import MyFinancial from '../comp/MyFinancial';
import Deposit from '../dialog/Deposit';
import Rules from '../dialog/Rules';

import { get_table_rows } from '@/utils/api'
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
    }
  },
  mounted() {
    this.handleGetApy()
    this.handleGetDepositNum()
  },
  beforeDestroy() {
    clearTimeout(this.argsTimer)
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
      const {status, result} = await get_table_rows(params)
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
      font-size: 48px;
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
  bottom: 110px;
  background: #FFF;
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
