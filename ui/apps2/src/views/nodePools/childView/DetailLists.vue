<template>
  <div class="detail">
    <div class="title">
      <span class="act" v-if="type === 'rex'">{{ pool.sym || 'EOS' }}矿池</span>
      <span class="act" v-else>{{ lpPool.symbol0 }}/{{ lpPool.symbol1 }} LP矿池</span>
    </div>
    <div class="list" v-if="type === 'rex'">
      <div class="poolInfo flexa">
        <img :src="pool.imgUrl" class="coinImg">
        <div class="bal">
          <div class="flexb">
            <span>{{ $t('nodePools.poolsReward', {token: pool.sym || 'EOS'}) }}</span>
            <span class="apy">{{ $t('nodePools.apyShort') }}：{{ pool.apy || '0.00' }}%</span>
          </div>
          <div class="num din">{{ accVoteData.showReward || '0.00000000' }}</div>
        </div>
      </div>
      <div class="reward">{{ $t('nodePools.poolsBal') }}：{{ pool.bal || `0.0000 ${pool.sym}` }}</div>
    </div>
    <div class="lpList" v-else>
      <div class="bgShadow"></div>
      <div class="list">
        <div class="poolInfo flexa">
          <img class="coinImg" :src="lpPool.sym1Data.imgUrl">
          <div class="bal">
            <div class="flexb">
              <span>{{ lpPool.symbol0 }}/{{ lpPool.symbol1 }} {{ $t('nodePools.lpMine') }}</span>
              <span class="apy">{{ $t('nodePools.apy') }}：{{ lpPool.apy || '0.00' }}%</span>
            </div>
            <div class="flexend">
              <span class="num din">{{ accLpData.showReward || '0.00000000' }}</span>
              <span class="red_p flexa" v-if="Number(addBuff)">（
                <img class="buffImg" src="https://cdn.jsdelivr.net/gh/defis-net/material/svg/buff2.svg">
                {{ addBuff }}%）</span>
            </div>
          </div>
        </div>
        <div class="reward">{{ $t('nodePools.marketNum') }}：{{ lpPool.reserve0 }}/{{ lpPool.reserve1 }}</div>

        <div class="myRank plan">
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
        <div class="flexb">
          <span>{{ $t('nodePools.myRank') }}：{{ accLpData.rank || 0 }}</span>
        </div>
      </div>
    </div>

    <div class="title flexb">
      <span class="act">矿工列表</span>
      <span class="tip count">总矿工：{{allLists.length}}</span>
    </div>
    <div class="lists">
      <template v-for="(item, index) in lists">
        <div class="mineList" :class="{'page1': page === 1}" :key="index">
          <div class="flexb mb10">
            <span>{{ item.owner }}</span>
            <span>{{ $t('mine.earnings') }}：{{ item.showReward || '0.00000000' }} {{ pool.sym }}</span>
          </div>
          <div class="flexb" v-if="type === 'rex'">
            <span>总票数</span>
            <span>{{ item.stakeEos || '0.0000' }} EOS</span>
          </div>
          <div class="flexb" v-else>
            <span>资金池</span>
            <span>{{ item.sym0 || '0.0000' }} {{lpPool.symbol0}} / {{ item.sym1 || '0.0000'}} {{lpPool.symbol1}}</span>
          </div>
          <label class="rankImg" v-if="page === 1 && index < 3"><img :src="`https://cdn.jsdelivr.net/gh/defis-net/material/rank/rank${index + 1}.png`" alt=""></label>
        </div>
      </template>

      <el-pagination
        v-if="allLists.length"
        class="pagination"
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :current-page.sync="page"
        :page-size="pageSize"
        :total="allLists.length">
      </el-pagination>
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

import {get_table_rows, get_balance} from '@/utils/api'
import { getCoin, toLocalTime, toFixed } from '@/utils/public'
import { getAccVote, getReward, getLpReward } from '../js/nodePools'
import { sellToken } from '@/utils/logic';

import SureTip from '@/views/farms/dialog/SureTip';

export default {
  name: 'mineLists',
  components: {
    SureTip
  },
  data() {
    return {
      allLists: [],
      lists: [],
      type: 'rex', // rex ｜ lp
      sym: 'eosio.token-eos', // 合约-Token ｜ mid
      pool: {},
      accVoteData: {},

      page: 1,
      pageSize: 20,
      poolsTimer: null,
      rewardTimer: null,
      runTimer: null,
      listTimer: null,
      listRunTimer: null,
      poolsLists: [],


      // Lp参数
      planRank: 30,
      lpPool: {
        sym1Data:{}
      },
      accLpData: {},
      lpTimer: null,
      lpRunTimer: null,
      bal0: '0.0000',
      bal1: '0.0000',
      showSure: false,
      params: {},
    }
  },
  mounted() {
    this.type = this.$route.params.type;
    this.sym = this.$route.params.sym;
    this.handleGetThisPools()
  },
  beforeDestroy() {
    clearTimeout(this.poolsTimer)
    clearTimeout(this.rewardTimer)
    clearInterval(this.runTimer)
    clearTimeout(this.listTimer)
    clearInterval(this.listRunTimer);

    // LpTimer
    clearTimeout(this.lpTimer)
    clearInterval(this.lpRunTimer)
  },
  watch: {
    marketLists: {
      handler: function mls(newVal, oldVal) {
        if (oldVal && oldVal.length === newVal.length) {
          return
        }
        if (this.type === 'rex') {
          this.handleDealAccReward(this.accVoteData)
          this.handleListReward()
          return
        }
        this.handleGetLpInfo()
      },
      deep: true,
      immediate: true,
    },
    scatter: {
      handler: function st(newVal) {
        if (newVal.identity) {
          this.handleGetAccVote()

          this.handleGetRank()
          this.handleStartTimer()
          // this.handleGetAccLpData();
        }
      },
      deep: true,
      immediate: true,
    }
  },
  computed: {
    ...mapState({
      scatter: state => state.app.scatter,
      baseConfig: state => state.sys.baseConfig,
      marketLists: state => state.sys.marketLists,
    }),
    addBuff() {
      let buff = (this.accLpData.weight || 1) - 1;
      buff = buff * 100;
      return buff.toFixed(2)
    }
  },
  methods: {
    handleClose() {
      this.showSure = false;
    },
    handleGetThisPools() {
      if (this.type === 'rex') {
        this.handleGetPools(); // 获取矿池APR
        this.handleGetRexPoolList(); // 获取rex矿工列表
        return
      }
      this.handleGetLpPoolsBal();
      this.handleGetLpInfo()
    },
    handleCurrentChange() {
      const start = (this.page - 1) * this.pageSize;
      const end = this.page * this.pageSize;
      this.lists = this.allLists.slice(start, end);
      if (this.type === 'rex') {
        this.handleListReward()
      }
    },

    // REX 矿池处理
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
      const contract = this.sym.split('-')[0];
      const lists = result.rows || [];
      lists.forEach(v => {
        const arr = v.sym.split(',');
        const decimal = arr[0];
        const sym = arr[1];
        const imgUrl = getCoin(v.contract, sym)
        const apy = (Math.pow(v.aprs, 86400 * 365) - 1) * 100;
        v.decimal = decimal;
        v.sym = sym;
        v.imgUrl = imgUrl;
        v.apy = apy.toFixed(2)
        if (contract === v.contract) {
          this.pool = v;
        }
      });
      this.poolsLists = lists;
      this.handleGetLpPoolBal();
    },
    // 获取池子余额
    async handleGetLpPoolBal() {
      const v = this.pool;
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
      this.$set(this.pool, 'bal', result)
    },
    // 获取用户挖矿数据
    async handleGetAccVote() {
      if (!this.scatter || !this.scatter.identity) {
        return
      }
      getAccVote((accVoteData) => {
        this.accVoteData = accVoteData;
        this.handleDealAccReward(this.accVoteData)
      })
    },
    handleDealAccReward(accVoteData) {
      if (!this.marketLists.length || !accVoteData.isfarmer) {
        return;
      }
      const baseData = this.pool;
      const accData = {
        accNum: accVoteData.eosNum,
        last_drip: accVoteData.last_drip,
      }
      const reward = getReward(baseData, accData);
      this.$set(this.accVoteData, 'accReward', reward.toFixed(8))
      // console.log(reward)
      clearTimeout(this.rewardTimer)
      this.rewardTimer = setTimeout(() => {
        this.handleDealAccReward(accVoteData)
      }, 1000);
      this.handleRun()
    },
    // 数据滚动
    handleRun() {
      clearInterval(this.runTimer)
      this.runTimer = setInterval(() => {
        const accReward = this.accVoteData.accReward || 0;
        const showReward = this.accVoteData.showReward || accReward;
        let tReward = this.accVoteData.tReward || showReward;
        const t = (accReward - showReward) / 50
        tReward = Number(tReward) + Number(t);
        if (tReward > accReward) {
          tReward = accReward
        }
        this.$set(this.accVoteData, 'showReward', Number(tReward).toFixed(8))
        this.$set(this.accVoteData, 'tReward', Number(tReward))
      }, 20);
    },
    async handleGetRexPoolList() {
      const params = {
        "code": this.baseConfig.nodeMiner,
        "scope": this.baseConfig.nodeMiner,
        "table": "farmers",
        "json":true,
        "index_position": 2,
        "key_type": "i64",
        "limit": 3000,
        "reverse": true
      }
      const { status, result } = await get_table_rows(params);
      if (!status) {
        return
      }
      const rows = result.rows || [];
      rows.forEach(v => {
        const stakeEos = v.staked / 10000;
        this.$set(v, 'stakeEos', stakeEos.toFixed(4))
      });
      this.allLists = rows;
      this.lists = rows.slice(0, this.pageSize);
      this.handleListReward()
    },
    // 当前页面列表数据滚动
    handleListReward() {
      if (!this.marketLists.length || !this.lists.length) {
        return;
      }
      this.lists.forEach(v => {
        const baseData = this.pool;
        const accData = {
          accNum: v.stakeEos,
          last_drip: v.last_drip,
        }
        const reward = getReward(baseData, accData);
        this.$set(v, 'accReward', reward.toFixed(8))
      })
      clearTimeout(this.listTimer)
      this.listTimer = setTimeout(() => {
        this.handleListReward();
      }, 1000);
      this.handleRunLists()
    },
    // 当页列表数据滚动
    handleRunLists() {
      clearInterval(this.listRunTimer);
      this.listRunTimer = setInterval(() => {
        this.lists.forEach(v => {
          const accReward = v.accReward || 0;
          const showReward = v.showReward || accReward;
          let tReward = v.tReward || showReward;
          const t = (accReward - showReward) / 50
          tReward = Number(tReward) + Number(t);
          if (tReward > accReward) {
            tReward = accReward
          }
          this.$set(v, 'showReward', Number(tReward).toFixed(8))
          this.$set(v, 'tReward', Number(tReward))
        })
      }, 20);
    },

    // LP矿池处理
    handleGetLpInfo() {
      if (!this.marketLists.length) {
        return
      }
      const market = this.marketLists.find(v => v.mid == this.sym);
      // console.log(market)
      this.lpPool = Object.assign({}, this.lpPool, market);
      this.handleGetLpReward()
      this.handleGetLpApy();
      this.handleGetLpMinersLists()
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
      // console.log(result)
      this.$set(this.lpPool, 'bal', parseFloat(result))
      this.handleGetLpReward()
      this.handleGetLpApy();
      this.handleLpListsReward();
    },
    // 获取用户挖矿数据
    async handleGetAccLpData() {
      const formName = this.scatter.identity.accounts[0].name;
      const params = {
        "code": this.baseConfig.nodeMiner,
        "scope": this.sym,
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
      this.accLpData = Object.assign({}, this.accLpData, result.rows[0])
      // console.log(this.accLpData)
      this.handleGetLpReward()
    },
    // 获取挖矿列表
    async handleGetLpMinersLists() {
      const params = {
        "code": this.baseConfig.nodeMiner,
        "scope": this.sym,
        "table":"miners",
        "json":true,
        "index_position": 2,
        "key_type": "i64",
        "limit": 2000,
        "reverse": false
      }
      const { status, result } = await get_table_rows(params);
      if (!status) {
        return
      }
      const inData = {
        poolSym0: this.lpPool.reserve0.split(' ')[0],
        poolSym1: this.lpPool.reserve1.split(' ')[0],
        poolToken: this.lpPool.liquidity_token,
        // sellToken: Math.abs(tToken)
      }
      // console.log(inData)
      const rows = result.rows || [];
      rows.forEach((v, index) => {
        v.rank = index + 1;
        v.owner = v.miner;
        inData.sellToken = v.token;
        const marketNum = sellToken(inData)
        v.sym0 = marketNum.getNum1.toFixed(this.lpPool.decimal0)
        v.sym1 = marketNum.getNum2.toFixed(this.lpPool.decimal1)
        if (index < 21) {
          v.weight = 1.3
        } else if (index < 50) {
          v.weight = 1.5
        } else if (index < 100) {
          v.weight = 1.1
        } else {
          v.weight = 1
        }
      })
      // console.log(rows)
      this.allLists = rows;
      this.lists = rows.slice(0, this.pageSize);
      this.handleGetRank()
      this.handleLpListsReward()
    },
    // 获取用户排名
    handleGetRank() {
      if (!this.allLists.length || !this.scatter || !this.scatter.identity) {
        return
      }
      const formName = this.scatter.identity.accounts[0].name;
      const miner = this.allLists.find(v => v.miner === formName) || {};
      this.accLpData = Object.assign({}, this.accLpData, miner)
      this.$forceUpdate()
      // console.log(this.accLpData)
      this.handleGetLpReward();
    },
    // 用户收益计算
    handleGetLpReward() {
      if (!this.accLpData.token || !this.lpPool.bal || !this.lpPool.liquidity_token) {
        return
      }
      const rate = this.accLpData.token / this.lpPool.liquidity_token;
      const lpBal = this.lpPool.bal;
      const weight = this.accLpData.weight || 1;
      const nowT = Date.parse(new Date())
      let lastT = toLocalTime(`${this.accLpData.last_drip}.000+0000`).replace(/-/g, '/')
      lastT = Date.parse(lastT)
      let t = (nowT - lastT) / 1000 ;
      const reward = lpBal - lpBal * Math.pow(0.9999, t * rate * weight);
      this.$set(this.accLpData, 'accLpReward', reward.toFixed(8))
      // console.log(reward)
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
      if (!this.lpPool.bal || !this.lpPool.reserve0) {
        return
      }
      const num = 1;
      const rate = num / parseFloat(this.lpPool.reserve0);
      const lpBal = this.lpPool.bal;
      const weight = 1.5;
      const t = 86400 * 365;
      const reward = lpBal - lpBal * Math.pow(0.9999, t * rate * weight);
      // console.log(reward)
      const price = parseFloat(this.lpPool.reserve0) / parseFloat(this.lpPool.reserve1);
      // console.log('price:', price)
      const apy = reward * price / num * 100;
      // console.log(apy.toFixed(2))
      this.$set(this.lpPool, 'apy', apy.toFixed(2))
    },
    // Lp列表数据获取
    handleLpListsReward() {
      if (!this.lpPool.bal || !this.lpPool.liquidity_token) {
        return;
      }
      this.lists.forEach(v => {
        const reward = getLpReward(this.lpPool, v)
        this.$set(v, 'accReward', reward)
        // console.log(reward)
      });
      clearTimeout(this.listTimer)
      this.listTimer = setTimeout(() => {
        this.handleLpListsReward()
      }, 1000)
      this.handleRunLists();
    },
    
    // 计算相差多少
    handleDealToken() {
      if (!this.allLists.length || !this.lpPool.liquidity_token) {
        return 
      }
      const market = this.lpPool;
      // console.log(market)
      const setRank = Number(this.planRank);
      const rank75 = this.allLists[setRank - 1];
      // console.log(rank75)
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
      // console.log(this.params)
    },
    handleSure() {
      localStorage.setItem(`node_lp`, this.planRank)
      setTimeout(() => {
        this.handleGetThisPools()
      }, 1000);
      setTimeout(() => {
        this.handleGetThisPools()
      }, 3000);
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
      if (!this.scatter || !this.scatter.identity || !this.lpPool.liquidity_token) {
        return
      }
      const v = this.lpPool;
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
  }
}
</script>

<style lang="scss" scoped>
.detail{
  padding: 0 26px;
  font-size: 27px;
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
}

.lpList{
  position: relative;
  .myRank{
    margin-top: 15px;
    // border-top: 1px solid #eee;
  }
}
.list{
  font-size: 27px;
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
.lists{
  margin-bottom: 30px;
}
.mineList{
  margin-top: 25px;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  // padding: 20px;
  position: relative;
  &.page1{
    &:nth-child(1) {
      border: 1px solid rgb(238, 198, 4);
      box-shadow: 0 0 5px 0px rgba(238, 198, 4, .5);
    }
    &:nth-child(2) {
      border: 1px solid #b1dcff;
      box-shadow: 0 0 5px 0px rgba(#b1dcff, .5);
    }
    &:nth-child(3) {
      border: 1px solid #8C7853;
      box-shadow: 0 0 5px 0px rgba(#8C7853, .5);
    }
    .rankImg{
      position: absolute;
      top: -0px;
      left: -0px;
      width: 72px;
      transform: translate(-47%, -47%) rotate(-45deg);
      img{
        width: 100%;
      }
    }
  }
  &>div{
    padding: 20px;
    position: relative;
    z-index: 1;
    background: #FFF;
    border-radius: 30px;

    &:nth-child(1) {
      padding-bottom: 0;;
    }
    &:nth-child(2) {
      padding-top: 0;;
    }
  }
  .mb10{
    margin-bottom: 10px;
  }
}

.pagination{
  text-align: right;
  margin-top: 20px;
  font-size: 26px;
  /deep/ .el-pager{
    li.active{
      color: #07D79B;
    }
    li:hover{
      color: #07D79B;
    }
    li{
      font-size: 26px;
    }
  }
  /deep/ .btn-prev, /deep/ .btn-next{
    &:hover {
      color: #07D79B;
    }
    .el-icon-arrow-left, .el-icon-arrow-right{
      font-size: 26px;
    }
  }
}

/deep/ .el-input-number{
  overflow: hidden;
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
