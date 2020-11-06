<template>
  <div class="nodePools">
    <div class="banner">
      <img class="bannerImg" src="@/assets/navImg/dssBanner.png" alt="">
    </div>
    <div class="dataInfo">
      <div class="flexb floatDiv">
        <div class="left">
          <div class="dinBold">{{ proxyData.eosNum || '0.0000' }}</div>
          <div class="tip bonus">
            <span>总票数（EOS）</span>
          </div>
        </div>
        <div class="right">
          <div class="dinBold">{{ yearApr }}%</div>
          <div class="tip bonus">
            <span>{{ $t('dsr.nowApy') }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 票数管理 -->
    <VoteNum :accVoteData="accVoteData" @listenUpdata="handleUpdata"/>
    <!-- 待领取收益 -->
    <MyClaim :poolsData="poolsData"/>
    <!-- 矿池列表 -->
    <PoolsLists :poolsLists="poolsLists" :poolsData="poolsData"/>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import PoolsLists from './comp/PoolsLists';
import VoteNum from './comp/VoteNum';
import MyClaim from './comp/Claim';

import { getCoin } from '@/utils/public';
import {get_table_rows, get_balance} from '@/utils/api'
import { getNodeLists } from './js/nodePools'

export default {
  name: 'nodePools',
  components: {
    PoolsLists,
    VoteNum,
    MyClaim,
  },
  data() {
    return {
      totalVote: '100000',
      showReWardTip: false,
      claim: false,
      poolsLists: [],
      poolsData: {}, // 存放余额、年化、收益

      voteWeight: 0,
      proxyData: {},
      accVoteData: {}, // 用户投票数据

      // LP 挖矿
      lpPoolsMid: [39],
      lpLists: [],
    }
  },
  computed: {
    ...mapState({
      scatter: state => state.app.scatter,
      marketLists: state => state.sys.marketLists,
    }),
    yearApr() {
      let apy = 0;
      const pools = this.poolsData;
      const keys = Object.keys(pools);
      keys.forEach((v) => {
        apy = apy + parseFloat(pools[v].apy || 0)
      })
      return apy.toFixed(2)
    }
  },
  mounted() {
    // 获取代理信息
    this.handleGetProxy();
    this.handleGetNodeLists();

    this.handleGetPools()
  },
  watch: {
    marketLists: {
      handler: function mls() {
        this.handleDealAccReward(this.accVoteData)
      }
    },
    scatter: {
      handler: function listen(newVal) {
        if (newVal.identity) {
          // 用户数据获取
          this.handleGetAccVote()
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    // 监听更新操作
    handleUpdata(type) {
      if (type === 'acc') {
        this.handleGetAccVote()
      }
    },
    // 获取节点列表
    handleGetNodeLists() {
      getNodeLists((weight) => {
        this.voteWeight = weight;
        this.hanldeDealNum();
      })
    },
    // 获取代理账户信息
    async handleGetProxy() {
      const params = {
        "code":"eosio",
        "scope":"eosio",
        "table":"voters",
        "json":true,
        "lower_bound": "dfsbpsproxy1",
        "upper_bound": "dfsbpsproxy1",
      }
      const { status, result } = await get_table_rows(params);
      if (!status) {
        return
      }
      this.proxyData = result.rows[0]
      this.hanldeDealNum();
    },
    // 计算票数
    hanldeDealNum() {
      if (!this.voteWeight || !Number(this.proxyData.last_vote_weight)) {
        return
      }
      const num = Number(this.proxyData.last_vote_weight) * this.voteWeight;
      this.$set(this.proxyData, 'eosNum', Math.ceil(num));
      this.handleDealApy();
    },

    // 用户票数统计
    async handleGetAccVote() {
      if (!this.scatter || !this.scatter.identity) {
        return
      }
      const formName = this.scatter.identity.accounts[0].name;
      const params = {
        "code":"eosio",
        "scope":"eosio",
        "table":"voters",
        "json":true,
        "lower_bound": ` ${formName}`,
        "upper_bound": ` ${formName}`,
      }
      const {status, result} = await get_table_rows(params)
      if (!status) {
        return
      }
      const rows = result.rows || [];
      // 没有抵押数据
      if (!rows.length) {
        this.accVoteData = {};
        return
      }
      // 代理不是dfsbpsproxy1
      const accVoteData = rows[0];
      if (accVoteData.proxy !== "dfsbpsproxy1") {
        this.accVoteData = {};
        return
      }
      // 挖矿用户
      const eosNum = accVoteData.staked / 10000;
      accVoteData.eosNum = eosNum.toFixed(4);
      this.accVoteData = accVoteData;
      this.handleDealAccReward(this.accVoteData)
    },
    // 计算用户收益
    handleDealAccReward(accVoteData) {
      const keys = Object.keys(this.poolsData)
      if (!this.marketLists.length || !keys.length || !this.proxyData.eosNum || !accVoteData.isDfsProxy) {
        return;
      }
      const allEos = this.proxyData.eosNum; // 总票数
      const pools = this.poolsData;
      keys.forEach((v) => {
        // 计算年化
        const poolBal = parseFloat(pools[v].bal);
        const baseData = {
          poolBal,
          allEos,
        }
        const accData = {
          accNum: accVoteData.eosNum,
        }
        const reward = this.handleDealReward(baseData, accData)
        this.$set(this.poolsData[v], 'accReward', reward.toFixed(8));
      })
      this.$forceUpdate()
    },

    // 获取矿池列表
    async handleGetPools() {
      const params = {
        "code":"tagtokenmine",
        "scope":"tagtokenmine",
        "table":"pools",
        "json":true,
        "limit": 1000
      }
      const {status, result} = await get_table_rows(params);
      if (!status) {
        return
      }
      const lists = result.rows || [];
      lists.forEach(v => {
        const arr = v.sym.split(',');
        const decimal = arr[0];
        const sym = arr[1];
        const imgUrl = getCoin(v.contract, sym)
        v.decimal = decimal;
        v.sym = sym;
        v.imgUrl = imgUrl;
      });
      this.poolsLists = lists;
      this.handleGetBal()
    },
    handleGetBal() {
      this.poolsLists.forEach(async (v) => {
        const params = {
          code: v.contract,
          symbol: v.sym,
          decimal: v.decimal,
          account: 'dfsfundation'
        }
        const {status, result} = await get_balance(params);
        if (!status) {
          return
        }
        this.$set(this.poolsData, v.sym, Object.assign({}, v , {bal: result}))
        // this.poolsData[v.sym] = {bal: result}
        console.log(result)
        this.handleDealApy();
      })
    },
    // baseData = {poolBal,allEos,type}
    handleDealReward(baseData, userData) {
      // console.log(baseData, userData)
      // 基础数据
      const poolBal = baseData.poolBal,
            allEos = baseData.allEos,
            type = baseData.type;
      // 用户数据
      const accNum = userData.accNum;
      let t = 86400; // 默认一天时间
      if (type !== 'year') {
        t = 1; // 用户挖矿持续时间
      }
      let reward = poolBal - poolBal * Math.pow(0.9999, t * accNum / allEos); // 日收益
      // console.log(poolBal,  poolBal * Math.pow(0.9999, t * accNum / allEos))
      if (type === 'year') {
        let yReward = reward * 365;
        if (yReward > poolBal) {
          yReward = poolBal;
        }
        return yReward
      }
      if (reward > poolBal) {
        reward = poolBal;
      }
      return reward
    },
    // 计算年化 & 收益
    handleDealApy() {
      const keys = Object.keys(this.poolsData)
      if (!this.marketLists.length || !keys.length || !this.proxyData.eosNum) {
        return;
      }
      const allEos = this.proxyData.eosNum; // 总票数
      const pools = this.poolsData;
      keys.forEach((v) => {
        const market = this.marketLists.find(vv => {
          return vv.contract0 === 'eosio.token'
              && vv.contract1 === pools[v].contract && vv.symbol1 === pools[v].sym;
        }) || { // EOS
          reserve0: 1,
          reserve1: 1,
        }
        // 计算币种价格
        const price = parseFloat(market.reserve0) / parseFloat(market.reserve1)
        // 计算年化
        const poolBal = parseFloat(pools[v].bal);
        const baseData = {
          poolBal,
          allEos,
          type: 'year'
        }
        const accData = {
          accNum: 1,
        }
        const reward = this.handleDealReward(baseData, accData)
        console.log(reward)
        const apy = reward * price * 100 / accData.accNum;
        this.$set(this.poolsData[v], 'apy', apy.toFixed(2));
      })
    },

    // Lp 矿池
    handleGetLpPoolsLists() {
      if (!this.marketLists.length) {
        return
      }
      const lpLists = []
      this.lpPoolsMid.forEach(mid => {
        const market = this.marketLists.find(v => v.mid === mid);
        lpLists.push(market)
      })
      this.lpLists = lpLists;
    }
  }
}
</script>

<style lang="scss" scoped>
.banner{
  position: relative;
  color: #FFF;
  text-align: left;
  overflow: hidden;
  .bannerImg{
    display: block;
    height: 334px;
    width: 100%;
  }
}
.dataInfo{
  box-shadow: 0px 4px 8px 4px rgba(227,227,227,0.5);
  border-radius: 20px 20px 0px 0px;
  padding: 28px 28px;
  margin: -70px 32px 20px;
  background: #FFF;
  position: relative;
  color: #333;
  .dinBold{
    font-size: 33px !important;
    margin-bottom: 9px;
  }
  .floatDiv{
    z-index: 1;
    position: relative;
    text-align: left;
    font-size: 32px;
    color: #333;
    &>div{
      flex: 1;
      background: #FFF;
      // padding: 40px 20px;
      border-radius: 20px;
      text-align: left;
      &:first-child{
        margin-right: 30px;
      }
    }
    .bonus{
      font-size: 26px;
      margin-top: 10px;
    }
  }
}
</style>
