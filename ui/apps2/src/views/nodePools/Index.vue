<template>
  <div class="nodePools">
    <div class="bg">
      <div class="banner">
        <img class="bannerImg" src="https://cdn.jsdelivr.net/gh/defis-net/material/banner/nodePools.png" alt="">
      </div>
      <div class="dataInfo">
        <div class="flexb floatDiv">
          <div class="left">
            <div class="dinBold">{{ proxyData.eosNum || '0.0000' }}</div>
            <div class="tip bonus">
              <span>{{ $t('nodePools.allVote') }}（EOS）</span>
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
      <MyClaim :poolsData="poolsData" :accVoteData="accVoteData" :lpPoolsMid="lpPoolsMid"
        :accLpData="accLpData" @listenUpdata="handleUpdata"/>
      <!-- 矿池列表 -->
      <PoolsLists :poolsLists="poolsLists" :lpLists="lpLists" :accLpData="accLpData"
        :poolsData="poolsData" :rank="rank" :rankList="rankList" :lpRankWeight="lpRankWeight"/>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import PoolsLists from './comp/PoolsLists';
import VoteNum from './comp/VoteNum';
import MyClaim from './comp/Claim';

import { getCoin, toLocalTime } from '@/utils/public';
import {get_table_rows, get_balance} from '@/utils/api'
import { getVoteWeight, getAccVote, getReward } from './js/nodePools'

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
      lpPoolsMid: [602],
      lpLists: [],
      accLpData: {},
      lpRankWeight: 0,
      rank: '0',
      rankList: [],

      // 定时器
      poolsTimer: null,
      rewardTimer: null,
      runTimer: null,
      lpTimer: null,
      lpRunTimer: null,
    }
  },
  computed: {
    ...mapState({
      scatter: state => state.app.scatter,
      filterMkLists: state => state.sys.filterMkLists,
      baseConfig: state => state.sys.baseConfig,
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
  beforeDestroy() {
    clearTimeout(this.poolsTimer)
    clearTimeout(this.rewardTimer)
    clearInterval(this.runTimer)
    clearTimeout(this.lpTimer)
    clearInterval(this.lpRunTimer)
  },
  watch: {
    filterMkLists: {
      handler: function mls() {
        this.handleDealAccReward(this.accVoteData)
        this.handleGetLpPoolsLists()
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
      console.log('数据更新', type)
      if (type === 'acc') {
        setTimeout(() => {
          this.handleGetAccVote()
          this.handleGetAccLpMinerData()
        }, 1000);
      }
    },
    // 获取节点列表
    handleGetNodeLists() {
      const weight = getVoteWeight()
      this.voteWeight = weight;
      this.hanldeDealNum();
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
    },

    // 用户票数统计
    async handleGetAccVote() {
      if (!this.scatter || !this.scatter.identity) {
        return
      }
      getAccVote((accVoteData) => {
        this.accVoteData = accVoteData;
        this.$forceUpdate()
        this.handleDealAccReward(this.accVoteData)
      })
    },
    // 计算用户收益
    handleDealAccReward(accVoteData) {
      const keys = Object.keys(this.poolsData)
      if (!this.filterMkLists.length || !keys.length || !this.proxyData.eosNum || !accVoteData.isfarmer) {
        return;
      }
      const allEos = this.proxyData.eosNum; // 总票数
      const pools = this.poolsData;
      // console.log(pools)
      keys.forEach((v) => {
        // 计算年化
        const poolBal = parseFloat(pools[v].bal);
        const list = this.poolsLists.find(vv => vv.sym === v);
        const baseData = Object.assign({}, list, {
          allEos,
          poolBal,
        })
        const accData = {
          accNum: accVoteData.eosNum,
          last_drip: accVoteData.last_drip,
        }
        const reward = getReward(baseData, accData)
        this.$set(this.poolsData[v], 'accReward', reward.toFixed(8));
      })
      this.handleRun()
      clearTimeout(this.rewardTimer)
      this.rewardTimer = setTimeout(() => {
        this.handleDealAccReward(accVoteData)
      }, 1000);
      this.$forceUpdate()
    },
    // 数据滚动
    handleRun() {
      clearInterval(this.runTimer)
      this.runTimer = setInterval(() => {
        const keys = Object.keys(this.poolsData)
        keys.forEach(v => {
          const accReward = this.poolsData[v].accReward || 0;
          const showReward = this.poolsData[v].showReward || accReward;
          let tReward = this.poolsData[v].tReward || showReward;
          const t = (accReward - showReward) / 50
          tReward = Number(tReward) + Number(t);
          if (tReward > accReward) {
            tReward = accReward
          }
          // console.log(tReward)
          this.$set(this.poolsData[v], 'showReward', Number(tReward).toFixed(8))
          this.$set(this.poolsData[v], 'tReward', Number(tReward))
          // this.$set(this.poolsData[v], 't', t)
        })
      }, 20);
    },

    // 获取矿池列表
    async handleGetPools() {
      clearTimeout(this.poolsTimer)
      this.poolsTimer = setTimeout(() => {
        this.handleGetPools();
      }, 10000)
      const params = {
        "code": this.baseConfig.nodeMiner,
        "scope": this.baseConfig.nodeMiner,
        "table": "pools",
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
      this.handleDealApy()
      this.handleGetBal()
    },
    handleGetBal() {
      this.poolsLists.forEach(async (v) => {
        if (this.poolsData[v.sym]) {
          return
        }
        const params = {
          code: v.contract,
          symbol: v.sym,
          decimal: v.decimal,
          account: this.baseConfig.fundation,
        }
        const {status, result} = await get_balance(params);
        if (!status) {
          return
        }
        this.$set(this.poolsData, v.sym, Object.assign({}, (this.poolsData[v.sym] || v) , {bal: result}))
      })
    },
    // 计算年化
    handleDealApy() {
      if (!this.poolsLists.length) {
        return;
      }
      this.poolsLists.forEach((list) => {
        const apy = (Math.pow(list.aprs, 86400 * 365) - 1) * 100;
        this.$set(list, 'apy', apy.toFixed(2));
      })
      this.poolsLists.sort((a, b) => {
        return b.apy - a.apy
      })
    },

    // Lp 矿池
    handleGetLpPoolsLists() {
      if (!this.filterMkLists.length || this.lpLists.length) {
        return
      }
      const lpLists = []
      this.lpPoolsMid.forEach(mid => {
        const market = this.filterMkLists.find(v => v.mid === mid);
        lpLists.push(market)
        this.handleGetLpRank(mid);
      })
      this.lpLists = lpLists;
      this.handleGetLpPoolsBal()
      this.handleGetAccLpMinerData();
    },
    // 获取LP 挖矿排名
    async handleGetLpRank(mid) {
      if (!this.scatter || !this.scatter.identity) {
        return
      }
      const formName = this.scatter.identity.accounts[0].name;
      const params = {
        "code": this.baseConfig.nodeMiner,
        "scope": mid,
        "table":"miners",
        "json":true,
        "index_position": 2,
        "key_type": "i64",
        "limit": 100,
        "reverse": false
      }
      const { status, result } = await get_table_rows(params);
      if (!status) {
        return
      }
      const rows = result.rows || [];
      this.rankList = rows;
      const index = rows.findIndex(v => formName === v.miner);
      let weight;
      let rank;
      if (index === -1) {
        weight = 1;
      } else if (index < 21) {
        weight = 1.3;
      } else if (index < 50) {
        weight = 1.5;
      } else {
        weight = 1.1;
      }
      rank = `${index + 1 ? index + 1 : '100+'}`
      this.rank = rank;
      this.lpRankWeight = weight;
      this.handleGetLpReward()
    },
    // 获取LP矿池余额
    async handleGetLpPoolsBal() {
      const params = {
        code: this.baseConfig.nodeToken,
        symbol: 'TAG',
        decimal: 8,
        account: this.baseConfig.lpPools,
      }
      const {status, result} = await get_balance(params);
      if (!status) {
        return
      }
      this.$set(this.lpLists[0], 'lpBal', parseFloat(result))
      this.handleGetLpReward()
      this.handleGetLpApy();
    },
    // 获取用户LP挖矿数据
    async handleGetAccLpMinerData() {
      const formName = this.scatter.identity.accounts[0].name;
      const params = {
        "code": this.baseConfig.nodeMiner,
        "scope": this.lpPoolsMid[0],
        "table": "miners",
        "json":true,
        "lower_bound": ` ${formName}`,
        "upper_bound": ` ${formName}`,
      }
      const {status, result} = await get_table_rows(params)
      if (!status) {
        return
      }
      if (!result.rows.length) {
        return
      }
      // console.log(result.rows[0])
      this.accLpData = result.rows[0]
      this.handleGetLpReward()
    },
    // 计算LP池子收益
    handleGetLpReward() {
      if (!this.accLpData.token || !this.lpLists[0].lpBal || !this.lpRankWeight) {
        return
      }
      const rate = this.accLpData.token / this.lpLists[0].liquidity_token;
      const lpBal = this.lpLists[0].lpBal;
      const weight = this.lpRankWeight;
      const nowT = Date.parse(new Date())
      let lastT = toLocalTime(`${this.accLpData.last_drip}.000+0000`).replace(/-/g, '/')
      lastT = Date.parse(lastT)
      let t = (nowT - lastT) / 1000 ;
      const reward = lpBal - lpBal * Math.pow(0.9999, t * rate * weight);
      this.$set(this.accLpData, 'accLpReward', reward.toFixed(8))

      // 定时器
      clearTimeout(this.lpTimer)
      this.lpTimer = setTimeout(() => {
        this.handleGetLpReward();
      }, 1000);
      // LP数据滚动
      this.handleRunLp()
    },
    handleRunLp() {
      clearInterval(this.lpRunTimer)
      this.lpRunTimer = setInterval(() => {
        const accLpReward = this.accLpData.accLpReward || 0;
        const showReward = this.accLpData.showReward || accLpReward;
        
        let tReward = this.accLpData.tReward || showReward;
        const t = this.accLpData.t  || ((accLpReward - showReward) / 50)
        tReward = Number(tReward) + Number(t);
        if (tReward > accLpReward) {
          tReward = accLpReward
        }
        // console.log(tReward, accLpReward, t)
        this.$set(this.accLpData, 'showReward', Number(tReward).toFixed(8))
        this.$set(this.accLpData, 'tReward', Number(tReward))
        this.$set(this.accLpData, 't', t)
      }, 20);
    },
    // 计算LP年化
    handleGetLpApy() {
      if (!this.lpLists[0].lpBal) {
        return
      }
      const num = 1;
      const rate = num / parseFloat(this.lpLists[0].reserve0);
      const lpBal = this.lpLists[0].lpBal;
      const weight = 1.5;
      const t = 86400 * 365;
      const reward = lpBal - lpBal * Math.pow(0.9999, t * rate * weight);
      // console.log(reward)
      const price = parseFloat(this.lpLists[0].reserve0) / parseFloat(this.lpLists[0].reserve1);
      // console.log('price:', price)
      const apy = reward * price / num * 100;
      // console.log(apy.toFixed(2))
      this.$set(this.lpLists[0], 'apy', apy.toFixed(2))
    },
  }
}
</script>

<style lang="scss" scoped>
.bg{
  padding-bottom: 30px;
  background-image: linear-gradient(to bottom, #FFF1DE , rgba(#FFF1DE, .3));
}
.banner{
  position: relative;
  color: #FFF;
  text-align: left;
  overflow: hidden;
  .bannerImg{
    display: block;
    height: 320px;
    width: 100%;
  }
}
.dataInfo{
  box-shadow: 0px 4px 8px 4px rgba(227,227,227,0.5);
  border-radius: 20px 20px 0px 0px;
  padding: 28px 28px;
  margin: -40px 32px 20px;
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
