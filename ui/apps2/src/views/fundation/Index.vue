<template>
  <div class="fundation">
    <div class="banner">
      <img class="bgImg" src="https://cdn.jsdelivr.net/gh/defis-net/material/banner/fundation.png" alt="">
    </div>

    <!-- 币种统计 -->
    <Summary :totalNum="totalNum" :amtNum="amtNum" :summaryLists="summaryLists"/>

    <!-- 捐款记录 -->
    <FundationLists :pageLists="hisLists" :finished="finished"
      :summaryLists="summaryLists"
      @listenActChange="handleActChange"
      @listenCurrentChange="handleCurrentChange"
      @listenFilterMin="handleFilterMin"
      @listenFilter="handleFilter"/>
  
    <div class="nullDiv"></div>
    <div class="btnDiv">
      <div class="btn flexc" @click="showToFundation=!showToFundation">{{ $t('fundation.toFundation') }}</div>
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
import { getCoin, toLocalTime } from '@/utils/public'
import { get_summary, get_new_fundation,
  get_mvd_fundation, get_hot_fundation } from '@/utils/api';

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
      min: '0.1',
      typeAct: 0,

      // 上拉加载更多
      finished: false,
      isGetting: false,
    }
  },
  mounted() {
    this.handleGetSummary()
  },
  beforeDestroy() {
    clearTimeout(this.timer)
  },
  computed: {
    ...mapState({
      scatter: state => state.app.scatter,
      filterMkLists: state => state.sys.filterMkLists,
    }),
  },
  watch: {
    filterMkLists: {
      handler: function mls(newVal, oldVal) {
        if (oldVal && oldVal.length === newVal.length) {
          return
        }
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
      document.documentElement.scrollTop = 0;
      this.handleGetFundation()
    },
    handleFilterMin(min) {
      this.finished = false;
      this.hisLists = [];
      this.$forceUpdate()
      this.min = min;
      this.page = 1;
      document.documentElement.scrollTop = 0;
      this.handleGetFundation()
    },
    handleClose() {
      this.showToFundation = false;
    },
    async handleGetSummary() {
      const {status, result} = await get_summary();
      if (!status) {
        return;
      }
      this.summaryLists = result.summary || [];
      this.handleDealAmtNum()
    },
    handleActChange(act) { // 监听子页面类型切换
      this.typeAct = act;
      this.page = 1;
      this.hisLists = [];
      this.finished = false;
      this.isGetting = false;
      document.documentElement.scrollTop = 9999;
      this.$forceUpdate()
      // this.handleGetFundation()
    },
    async handleGetFundation() {
      if (this.isGetting) {
        return
      }
      this.isGetting = true;
      const params = {
        min: this.min,
        page: this.page,
        limit: this.pagesize,
        act: this.typeAct,
      }
      let status, result
      if (this.scatter && this.scatter.identity) {
        params.user = this.scatter.identity.accounts[0].name;
      }
      if (this.typeAct === 0) {
        if (this.filter) {
          const arr = this.filter.split(':');
          params.contract = arr[0];
          params.sym = arr[1];
        }
        const res = await get_new_fundation(params)
        status = res.status;
        result = res.result;
        this.totalNum = result.total;
      } else if (this.typeAct === 1) {
        params.limit = 100;
        const res = await get_hot_fundation(params)
        status = res.status;
        result = res.result;
        // console.log(result)
      } else if (this.typeAct === 2) {
        const res = await get_mvd_fundation(params)
        status = res.status;
        result = res.result;
      }
      this.isGetting = false;
      if (!status) {
        return;
      }
      // 分页数据处理
      this.handleDealMemoLists(result, params.act);
    },
    handleDealMemoLists(result, act) {
      if (act !== this.typeAct) {
        return
      }
      const list = result.data || [];
      list.forEach(v => {
        this.$set(v, 'headImg', getCoin(v.account, v.symbol))
        const replyNum = (v.reply_count || 0)
        this.$set(v, 'replyNum', replyNum)
        const t = toLocalTime(v.create_time).replace(/-/g, '/');
        const times = Date.parse(t) + 3600 * 8 * 1000;
        this.$set(v, 'dealTime', toLocalTime(times))
        const likeNum = v.like_count * 1000;
        this.$set(v, 'likeNum', likeNum.toFixed(0))
      })
      if (this.typeAct === 1) {
        list.sort((a,b) => {
          const aNum = parseInt(a.replyNum || 0) + parseInt(a.likeNum)
          const bNum = parseInt(b.replyNum || 0) + parseInt(b.likeNum)
          return bNum - aNum;
        })
      }
      if (this.page === 1) {
        this.hisLists = list;
      } else {
        this.hisLists.push(...list)
      }
      this.page += 1;
      // 数据全部加载完成
      if (this.hisLists.length >= result.total || !list.length) {
        this.finished = true;
      }
    },
    handleCurrentChange() {
      this.handleGetFundation()
    },
    // 计算捐款总额
    handleDealAmtNum() {
      let amt = 0;
      if (!this.filterMkLists.length || !this.summaryLists.length) {
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
        const market = this.filterMkLists.find(vv => {
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
  max-width: 750px;
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
