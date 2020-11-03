<template>
  <div class="fundation">
    <div class="banner">
      <img class="bgImg" src="@/assets/fundation/banner.png" alt="">
    </div>

    <!-- 币种统计 -->
    <Summary :totalNum="totalNum" :amtNum="amtNum" :summaryLists="summaryLists"/>

    <!-- 捐款记录 -->
    <FundationLists :pageLists="hisLists" :finished="finished"
      :summaryLists="summaryLists"
      @listenCurrentChange="handleCurrentChange"
      @listenFilter="handleFilter"/>
  
    <div class="nullDiv"></div>
    <div class="btnDiv">
      <div class="btn flexc" @click="showToFundation=!showToFundation">乐捐一下</div>
    </div>
    <!-- 去捐款 -->
    <el-dialog
      class="mydialog"
      :show-close="false"
      :visible="showToFundation">
      <ToFundation v-if="showToFundation" @listenClose="handleClose"/>
    </el-dialog>
  </div>
</template>

<script>
// 依赖
import { mapState } from 'vuex';
// 组件
import Summary from './comp/Summary'
import FundationLists from './comp/FundationLists'
import ToFundation from './dialog/ToFundation';

// api
import { get_fundation } from '@/utils/api';
import { getCoin } from '@/utils/public'

export default {
  name: 'fundation',
  components: {
    Summary,
    FundationLists,
    ToFundation,
  },
  data() {
    return {
      page: 1,
      pagesize: 20,
      totalNum: 0, // 总人次
      hisLists: [], // 转账记录
      summaryLists: [], // 捐款统计 - 计算出总估值
      amtNum: '0.0000', // 捐款总额 - EOS为单位
      timer: null,
      showToFundation: false,
      filter: '', // 过滤条件

      // 上拉加载更多
      finished: false,
    }
  },
  mounted() {
    // this.handleGetFundation()
  },
  beforeDestroy() {
    clearTimeout(this.timer)
  },
  computed: {
    ...mapState({
      marketLists: state => state.sys.marketLists,
    }),
  },
  watch: {
    marketLists: {
      handler: function mls() {
        this.handleDealAmtNum()
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    handleFilter(filter) {
      this.finished = false;
      this.hisLists = [];
      this.$forceUpdate()
      this.filter = filter;
      this.page = 1;
      this.handleGetFundation()
    },
    handleClose() {
      this.showToFundation = false;
    },
    async handleGetFundation() {
      const params = {
        page: this.page,
        limit: this.pagesize
      }
      if (this.filter) {
        const arr = this.filter.split(':');
        params.contract = arr[0];
        params.sym = arr[1];
      }
      const {status, result} = await get_fundation(params)
      if (!status) {
        return;
      }
      this.summaryLists = result.summary || [];
      if (this.page === 1) {
        this.totalNum = result.total;
        this.handleDealAmtNum()
      }
      // 分页数据处理
      const list = result.data || [];
      if (this.page === 1) {
        this.hisLists = list;
      } else {
        this.hisLists.push(...list)
      }
      this.page += 1;
      // 数据全部加载完成
      if (this.hisLists.length >= result.data.total) {
        this.finished = true;
      }
    },
    handleCurrentChange() {
      this.handleGetFundation()
    },
    // 计算捐款总额
    handleDealAmtNum() {
      let amt = 0;
      if (!this.marketLists.length || !this.summaryLists.length) {
        return amt;
      }
      this.summaryLists.forEach(v => {
        const imgUrl = getCoin(v.account, v.symbol)
        this.$set(v, 'imgUrl', imgUrl)
        if (v.account === 'eosio.token' && v.symbol === 'EOS') {
          amt += v.total;
          this.$set(v, 'aboutEos', v.total)
          return
        }
        const market = this.marketLists.find(vv => {
          return vv.contract0 === 'eosio.token' && vv.contract1 === v.account && vv.symbol1 === v.symbol
        })
        if (!market || !parseFloat(market.reserve1)) {
          // console.log(v.symbol)
          this.$set(v, 'aboutEos', 0)
          return
        }
        const price = parseFloat(market.reserve0) / parseFloat(market.reserve1);
        // console.log(price)
        const eTotal = v.total * price;
        amt += eTotal;
        this.$set(v, 'aboutEos', eTotal)
      })
      this.summaryLists.sort((a, b) => {
        return b.aboutEos - a.aboutEos;
      })
      this.amtNum = amt.toFixed(4)
    }
  }
}
</script>

<style lang="scss" scoped>
.fundation{
  font-size: 27px;
  .banner{
    color: #FFF;
    position: relative;
    &>div{
      z-index: 1;
    }
    .bgImg{
      height: 300px;
      width: 100%;
      z-index: 0;
    }

    .title{
      font-size: 40px;
      font-weight: 500;
    }
    .subTitle{
      font-size: 33px;
    }
  }
}
.nullDiv{
  height: 160px;
  width: 100%;
}
.btnDiv{
  position: fixed;
  bottom: 0px;
  height: 160px;
  width: 100%;
  background: #fFF;
  padding: 36px;
  box-sizing: border-box;
  border-top: 1px solid #EAEAEA;
  .btn{
    background: #29D4B0;
    height: 90px;
    border-radius: 45px;
    color: #fFF;
  }
}

.mydialog{
  /deep/ .el-dialog{
    border-radius: 12px;
    width: 650px;
    margin-top: 15vh !important;
    .el-dialog__header{
      padding: 0;
    }
    .el-dialog__body{
      padding: 0;
    }
    .el-dialog__headerbtn{
      font-size: 40px;
      z-index: 1;
    }
  }
}
</style>
