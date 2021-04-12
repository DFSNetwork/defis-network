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
            <div class="dinBold">{{ lpyearApr }}%</div>
            <div class="tip bonus">
              <span>做市实时年化</span>
            </div>
          </div>
          <div class="right">
            <div class="dinBold">{{ yearApr }}%</div>
            <div class="tip bonus">
              <span>投票实时年化</span>
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
        :lpLength="lpLength"
        :poolsData="poolsData" :rank="rank" :rankList="rankListObj" :lpRankWeight="lpRankWeight"/>

      <div class="nullDiv"></div>
      <div class="btnDiv">
        <div class="btn flexc" @click="handleTo('createPool')">{{ $t('nodePools.createPool') }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import moment from 'moment';

import PoolsLists from './comp/PoolsLists';
import VoteNum from './comp/VoteNum';
import MyClaim from './comp/Claim';

import { getCoin, toLocalTime } from '@/utils/public';
import { get_balance} from '@/utils/api'
import { getVoteWeight, getAccVote, getReward } from './js/nodePools'
import { sellToken } from '@/utils/logic';

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
      lpPoolsMid: [], // 665
      lpLists: [],
      accLpData: {},
      lpRankWeight: 0,
      rank: '0',
      rankList: [],
      rankListObj: {},
      lpLength: 15,

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
      marketLists: state => state.sys.marketLists,
      baseConfig: state => state.sys.baseConfig,
      poolsTagBal: state => state.sys.poolsTagBal,
    }),
    yearApr() {
      let apy = 0;
      const pools = this.poolsData;
      const keys = Object.keys(pools);
      keys.forEach((v, index) => {
        if (index >= 3) {
          return
        }
        apy = apy + parseFloat(pools[v].apy || 0)
      })
      return apy.toFixed(2)
    },
    lpyearApr() {
      if (!this.lpLists.length) {
        return '0.00'
      }
      return this.lpLists[0].apy || '0.00'
    }
  },
  mounted() {
    this.handleGetVotes()
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
      },
      deep: true,
      immediate: true
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
    lpPoolsMid: {
      handler: function lpMids() {
        this.handleGetLpPoolsLists()
        this.handleGetAccLpMinerData()
      },
      deep: true,
      immediate: true,
    }
  },
  methods: {
    async handleGetVotes() {
      const params = {
        "code": "vote.tag",
        "scope": "vote.tag",
        "table": "pools",
        "json": true,
        limit: 10000
      }
      const {status, result} = await this.$api.get_table_rows(params)
      if (!status) {
        return
      }
      let rows = result.rows || [];
      rows.sort((a, b) => {
        return Number(b.total_votes) - Number(a.total_votes)
      })
      const mids = [];
      rows.forEach(v => {
        mids.push(v.mid)
      })
      this.lpPoolsMid = mids;
      // console.log(mids)
      // this.voteList = rows;
    },
    handleTo(name) {
      this.$router.push({
        name
      })
    },
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
      const { status, result } = await this.$api.get_table_rows(params);
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
    // 获取矿池价格
    handleGetPoolPrice(mid) {
      if (mid === 17) {
        return 1
      }
      const market = this.filterMkLists.find(v => v.mid == mid)
      if (!market) {
        return 0
      }
      return parseFloat(market.reserve0) / parseFloat(market.reserve1)
    },
    // 计算用户收益
    handleDealAccReward(accVoteData) {
      const keys = Object.keys(this.poolsData)
      if (!this.filterMkLists.length || !keys.length || !this.proxyData.eosNum || !accVoteData.isfarmer
       || accVoteData.showJoinBtn) {
        return;
      }
      const allEos = this.proxyData.eosNum; // 总票数
      const pools = this.poolsData;
      // console.log(keys)
      keys.forEach((v) => {
        // 计算年化
        const poolBal = parseFloat(pools[v].bal);
        const list = this.poolsLists.find(vv => `${vv.sym}-${vv.mid}` === v);
        const baseData = Object.assign({}, list, {
          allEos,
          poolBal,
        })
        const accData = {
          accNum: accVoteData.eosNum,
          last_drip: accVoteData.last_drip,
        }
        const reward = getReward(baseData, accData)
        const price = this.handleGetPoolPrice(list.mid)
        this.$set(this.poolsData[v], 'accReward', reward.toFixed(8));
        this.$set(this.poolsData[v], 'price', price);
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
        this.poolsLists.forEach((pList, index) => {
          if (index >= 3) {
            return
          }
          const v = `${pList.sym}-${pList.mid}`; // ${v.sym}-${v.mid}
          // console.log(this.poolsData[v])
          if (!this.poolsData[v]) {
            return
          }
          const accReward = this.poolsData[v].accReward || 0;
          const showReward = this.poolsData[v].showReward || accReward;
          let tReward = this.poolsData[v].tReward || showReward;
          const t = (accReward - showReward) / 50
          tReward = Number(tReward) + Number(t);
          if (tReward > accReward) {
            tReward = accReward
          }
          // console.log(tReward, this.poolsData[v].price)
          const aboutEos = tReward * this.poolsData[v].price;
          this.$set(this.poolsData[v], 'aboutEos', Number(aboutEos || 0).toFixed(4))
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
        "code":"dfsfundation",
        "scope":"dfsfundation",
        "table":"pools",
        "key_type": "float64",
        "index_position": 2,
        "json":true,
        "limit": 1000,
      }
      const {status, result} = await this.$api.get_table_rows(params);
      // console.log(JSON.parse(JSON.stringify(result)))
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
      this.poolsLists.forEach(async (v, i) => {
        if (this.poolsData[`${v.sym}-${v.mid}`]) {
          return
        }
        setTimeout(async () => {
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
          this.$set(this.poolsData, `${v.sym}-${v.mid}`, Object.assign({}, (this.poolsData[`${v.sym}-${v.mid}`] || v) , {bal: result}))
        }, i * 100);
      })
    },
    // 计算年化
    handleDealApy() {
      if (!this.poolsLists.length) {
        return;
      }
      this.poolsLists.forEach((list) => {
        // console.log(list)
        // if (index >= 3) {
        //   return
        // }
        const apy = (Math.pow(list.aprs, 86400 * 365) - 1) * 100;
        this.$set(list, 'apy', apy.toFixed(2));
      })
      // console.log(this.poolsLists)
    },

    // Lp 矿池
    handleGetLpPoolsLists() {
      if (!this.filterMkLists.length || this.lpLists.length || !this.lpPoolsMid.length) {
        return
      }
      const lpLists = []
      this.lpPoolsMid.forEach((mid, index) => {
        // const market = this.filterMkLists.find(v => v.mid === mid);
        const market = this.marketLists.find(v => v.mid === mid);
        if (!market) {
          return
        }
        if (market.contract1 === 'tagtokenmain' && market.symbol1 === 'TAG') {
          lpLists.push(market)
        } else if (market.contract0 === 'tagtokenmain' && market.symbol0 === 'TAG') {
          const v = market;
          const t = {
            contract0: v.contract1,
            contract1: v.contract0,
            last_update: v.last_update,
            liquidity_token: v.liquidity_token,
            mid: v.mid,
            price0_cumulative_last: v.price1_cumulative_last,
            price0_last: v.price1_last,
            price1_cumulative_last: v.price0_cumulative_last,
            price1_last: v.price0_last,
            reserve0: v.reserve1,
            reserve1: v.reserve0,
            sym0: v.sym1,
            sym1: v.sym0,
            exchangeSym: true,
            sym0Data: v.sym1Data,
            sym1Data: v.sym0Data,
            symbol0: v.symbol1,
            symbol1: v.symbol0,
          }
          lpLists.push(t)
        }
        this.handleGetLpRank(mid, index);
      })
      let dealArr = lpLists.slice(0, this.lpLength);
      let dealArr2 = lpLists.slice(this.lpLength, 1000)
      dealArr.sort((a, b) => {
        return parseFloat(b.reserve1) - parseFloat(a.reserve1)
      })
      dealArr2.sort((a, b) => {
        return parseFloat(b.reserve1) - parseFloat(a.reserve1)
      })
      
      this.lpLists = [...dealArr, ...dealArr2];
      this.handleGetLpPoolsBal()
      this.handleGetAccLpMinerData();
    },
    // 获取LP 挖矿排名
    async handleGetLpRank(mid, index) {
      if (!this.scatter || !this.scatter.identity || index >= this.lpLength) {
        return
      }
      // const formName = this.scatter.identity.accounts[0].name;
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
      const { status, result } = await this.$api.get_table_rows(params);
      if (!status) {
        return
      }
      const rows = result.rows || [];
      rows.forEach((v, index) => {
        let weight;
        let rank;
        if (index === -1) {
          weight = 1;
        } else if (index < 30) {
          weight = 1.3;
        } else if (index < 60) {
          weight = 1.2;
        } else {
          weight = 1.1;
        }
        rank = `${index + 1 ? index + 1 : '100+'}`
        this.$set(v, 'weight', weight)
        this.$set(v, 'rank', rank)
      })
      // console.log(mid, rows)
      this.rankListObj[`${mid}`] = rows;
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
      if (!this.lpPoolsMid.length) {
        return
      }
      // console.log(this.lpPoolsMid)
      const formName = this.scatter.identity.accounts[0].name;
      this.lpPoolsMid.forEach(async (mid, index) => {
        if (index >= this.lpLength) {
          return
        }
        setTimeout(async () => {
          const params = {
            "code": this.baseConfig.nodeMiner,
            "scope": mid,
            "table": "miners",
            "json":true,
            "lower_bound": ` ${formName}`,
            "upper_bound": ` ${formName}`,
          }
          const {status, result} = await this.$api.get_table_rows(params)
          if (!status) {
            return
          }
          if (!result.rows.length) {
            return
          }
          const rows = result.rows[0]
          const market = this.lpLists.find(v => v.mid === mid);
          if (!market) {
            return
          }
          const inData = {
            poolSym0: market.reserve0.split(' ')[0],
            poolSym1: market.reserve1.split(' ')[0],
            poolToken: market.liquidity_token,
            sellToken: Math.abs(rows.token)
          }
          const marketData = sellToken(inData)
          rows.market0 = marketData.getNum1;
          rows.market1 = marketData.getNum2;
          rows.symbol0 = market.symbol0;
          rows.symbol1 = market.symbol1;
          // console.log(mid, rows)
          this.accLpData[`${mid}`] = rows;
          this.handleGetLpReward()
        }, index * 100);
      });
    },
    // 计算LP池子收益
    handleGetLpReward() {
      // console.log(this.accLpData)
      // console.log(this.lpLists)
      // console.log(this.rankListObj)

      const allTagNum = this.handleAllLpTagNum()
      this.lpLists.forEach(v => {
        const mid = v.mid;
        const accLpData = this.accLpData[`${mid}`] || {};
        const rankList = this.rankListObj[`${mid}`] || [];
        if (!accLpData.token || !this.lpLists[0].lpBal || !rankList.length) {
          return;
        }
        const formName = this.scatter.identity.accounts[0].name;
        const accRank = rankList.find(vv => vv.miner === formName)
        let weight = 1;
        let rank = '100+'
        if (accRank) {
          weight = accRank.weight;
          rank = accRank.rank
        }
        const tagNum = v.contract1 === "tagtokenmain" ? parseFloat(accLpData.market1) : parseFloat(accLpData.market0)
        const rate = tagNum / allTagNum;
        const lpBal = this.lpLists[0].lpBal;
        const nowT = moment().valueOf()
        let lastT = toLocalTime(`${accLpData.last_drip}.000+0000`).replace(/-/g, '/')
        lastT = moment(lastT).valueOf()
        let t = (nowT - lastT) / 1000 ;
        const reward = lpBal - lpBal * Math.pow(0.9999, t * rate * weight);
        const price = parseFloat(this.lpLists[0].reserve0) / parseFloat(this.lpLists[0].reserve1)
        this.$set(accLpData, 'accLpReward', reward.toFixed(8))
        this.$set(v, 'price', price)
        this.$set(accLpData, 'weight', weight)
        this.$set(accLpData, 'rank', rank)
      })

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
        const priceMarket = this.lpLists.find(vv => vv.mid === 602) || {};
        let price = parseFloat(priceMarket.reserve0) / parseFloat(priceMarket.reserve1)
        // console.log(priceMarket)
        price = price || 0
        const keys = Object.keys(this.accLpData)
        const newJson = {}
        keys.forEach((mid) => {
          const accLpData = this.accLpData[mid];
          const accLpReward = accLpData.accLpReward || 0;
          const showReward = accLpData.showReward || accLpReward;
          let tReward = accLpData.tReward || showReward;
          const t = accLpData.t  || ((accLpReward - showReward) / 50)
          tReward = Number(tReward) + Number(t);
          if (tReward > accLpReward) {
            tReward = accLpReward
          }
          console.log(showReward, price)
          const aboutEos = showReward * price;
          // console.log(tReward, accLpReward, t)
          this.$set(accLpData, 'aboutEos', Number(aboutEos).toFixed(4))
          this.$set(accLpData, 'showReward', Number(tReward).toFixed(8))
          this.$set(accLpData, 'tReward', Number(tReward))
          this.$set(accLpData, 't', t)
          // console.log(this.accLpData[mid].showReward)
          newJson[`${mid}`] = JSON.parse(JSON.stringify(accLpData));
        })
        this.accLpData = newJson;
        this.$forceUpdate()
      }, 20);
    },
    // 计算LP年化
    handleGetLpApy() {
      if (!this.lpLists[0].lpBal) {
        return
      }
      const allTagNum = this.handleAllLpTagNum()
      this.lpLists.forEach((v) => {
        const num = 0.1;
        const rate = num / allTagNum;
        const lpBal = this.lpLists[0].lpBal;
        const weight = 1.3;
        const t = 86400 * 365;
        const reward = lpBal - lpBal * Math.pow(0.9999, t * rate * weight);
        const apy = reward / num * 100;
        this.$set(v, 'apy', apy.toFixed(2))
      })
    },
    // 获取LP池子的总TAG数量
    handleAllLpTagNum() {
      return this.poolsTagBal;
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
.notice{
  height: 56px;
  font-size: 24px;
}
.nullDiv{
  height: 100px;
}
.btnDiv{
  position: fixed;
  bottom: 10px;
  height: 100px;
  padding: 10px 28px;
  box-sizing: border-box;
  width: 100%;
  max-width: 750px;
  z-index: 1000;
  font-size: 36px;
  .btn{
    width: 100%;
    height: 90px;
    border-radius: 45px;
    background: #29D4B0;
    color: #FFF;
  }
}
</style>
