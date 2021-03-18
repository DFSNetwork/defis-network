<template>
  <div class="voteMain">
    <!-- <div class="banner">
      <img class="bgImg" src="https://cdn.jsdelivr.net/gh/defis-net/material/banner/bpVote.png" alt="">
    </div> -->
    <div class="accVoteNum_p">
      <div class="mainTitle flexb">
        <span class="act">{{ $t('nodePools.tagVote', {coin: 'TAG'}) }}</span>
        <span class="flexa rulesTip tip" @click="showRules = !showRules">
          <span>{{ $t('vote.voteRules') }}</span>
          <img class="tipIcon" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/tips_icon_btn.svg" alt="">
        </span>
      </div>
      <div class="info " v-loading="!swapGet">
        <div class="flexb">
          <div class="votes flexb">
            <span class="flexa">
              <span>{{ $t('vote.myVote') }}：<span class="dinBold">{{ accNum }}</span></span>
            </span>
          </div>
          <div>
            <span class="btn" @click="handleToDss">{{ $t('market.manage') }}</span>
          </div>
        </div>
        <div class="subTitle">{{ $t('nodePools.tagVoteRules') }}</div>
      </div>
    </div>

    <div class="selectList">
      <div class="tab flexb">
        <div class="nav flexa">
          <span :class="{'act': act === 1}" @click="handleChangeTab(1)">{{ $t('vote.vote') }}</span>
          <span :class="{'act': act === 2}" @click="handleChangeTab(2)">{{ $t('vote.rank') }}</span>
          <span :class="{'act': act === 3}" @click="handleChangeTab(3)">{{ $t('vote.voted') }}</span>
        </div>
        <div class="search flexc">
          <img class="searchImg" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/search.png" alt="">
          <el-input @input="handleSearch"
            v-model="search" :placeholder="$t('sys.searchMarket')"></el-input>
        </div>
      </div>
      <div v-if="act !== 2" class="voteLists" v-loading="listLoading || hisLoading">
        <div class="noData tip" v-if="!searchList.length">
          <img class="noDataImg" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/noData.png" alt="">
          <div class="noDataTip">{{ $t('public.noData') }}</div>
        </div>
        <template  v-for="(item, index) in searchList">
          <div class="list flexb" :key="index" @click="handleChecked(item, index)">
            <div>
              <div class="poolName">
                <span class="coinImg flexa">
                  <span class="flexa">
                    <img :src="item.sym0Data.imgUrl" :onerror="errorCoinImg">
                    <span>{{ item.symbol0 }}</span>
                  </span>
                  <span class="flexa">
                    <img :src="item.sym1Data.imgUrl" :onerror="errorCoinImg">
                    <span>{{ item.symbol1 }}</span>
                  </span>
                </span>
              </div>
              <div class="num flexa">
                <img class="voteIcon" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/vote.png" alt="">
                <span>{{ item.total_votes || '0' }}</span>
                <span class="tip small">（{{ item.votesRate || '0.00' }}%）</span>
                <span class="green" @click.stop="handleToDetail(item)">{{ $t('public.detail') }}></span>
              </div>
            </div>
            <div v-if="act !== 3" class="select flexc" :class="{'active': item.isChecked}">
              <!-- <span class="el-icon-check"></span> -->
              <img v-if="item.isChecked" class="checkedImg" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/checked.png" alt="">
            </div>
          </div>
        </template>
      </div>
      <div class="rank" v-else v-loading="rankLoading">
        <Rank :rankList="rankList" :voteList="voteList"/>
      </div>
    </div>

    <div v-if="act === 1">
      <div class="nullDiv"></div>
      <div class="voteAction flexb">
        <span>{{ $t('vote.checked') }} {{ checkedLeng }}/{{ maxLen }}</span>
        <span>
          <span v-if="checkedLeng" class="tip" @click="handleCancel">{{ $t('vote.cancelChecked') }}</span>
          <span class="voteBtn" v-loading="voteLoading" @click="handleTovote">{{ $t('vote.toVote') }}</span>
        </span>
      </div>
    </div>

    <el-dialog
      class="mkListDia pcList"
      :show-close="false"
      :visible.sync="showRules">
      <Rules/>
    </el-dialog>
  </div>
</template>

<script>
import { EosModel } from '@/utils/eos';
import { mapState } from 'vuex';
import { getVotePools } from '@/utils/api';
import Rank from './comp/Rank';
import Rules from './dialog/Rules';

export default {
  name: 'vote',
  components: {
    Rank,
    Rules
  },
  data() {
    return {
      showRules: false,
      act: 1,
      errorCoinImg: 'this.src="https://ndi.340wan.com/eos/eosio.token-eos.png"',
      search: '',
      searchList: [],
      checkBox: [],
      listLoading: true,
      hisLoading: false,
      rankLoading: false,
      voteLoading: false,
      voteList: [],
      allList: [],
      rankList: [],
      myVoteList: [],
      maxLen: 7,
      accNum: 0,

      // 处理票数
      dssData: {}, // dss数据
      swapData: {},
      dssGet: false,
      swapGet: false,
      config: [{
        "id": 1,
        "bonus": 1.5,
      },
      {
        "id": 2,
        "bonus": 1.5,
      },
      {
        "id": 3,
        "bonus": 2,
        "refund_delay_sec": 15552000
      },
      {
        "id": 4,
        "bonus": 3,
        "refund_delay_sec": 31104000
      }]
    }
  },
  computed: {
    ...mapState({
      // dsrPools: state => state.sys.dsrPools,
      scatter: state => state.app.scatter,
      marketLists: state => state.sys.marketLists,
    }),
    checkedLeng() {
      const n = this.allList.filter(v => v.isChecked)
      return n.length;
    },
    vote_power() {
      if (!this.swapGet || !this.dssGet) {
        return 0
      }
      const buff = this.dssData.pool ? Number(this.config[this.dssData.pool - 1].bonus) : 1;
      const dssCount = Number(this.dssData.balance || 0) * buff;
      const swapCount = parseFloat(this.swapData.liq_bal1 || '0') * 0.5;
      return parseInt(dssCount + swapCount)
    }
  },
  watch: {
    marketLists: {
      handler: function ml(newVal, oldVal) {
        if (!newVal.length || (oldVal && newVal.length === oldVal.length)) {
          return
        }
        this.allList = this.handleDealTagMarket(newVal);
        console.log(this.allList)
        this.listLoading = false;
        this.handlerDealMlVote();
        this.handleSearch();
      },
      deep: true,
      immediate: true,
    },
    allList: {
      handler: function ml() {
        this.handleSearch();
      },
      deep: true,
    },
    scatter: {
      handler: function listen(newVal) {
        if (newVal.identity) {
          this.handleGetMyVotes();
        }
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
    this.handleGetVotes()
  },
  methods: {
    handleDealTagMarket(marketLists) {
      const dealTagLists = [];
      marketLists.forEach(v => {
        if ((v.contract0 === 'tagtokenmain' && v.symbol0 === 'TAG')) {
          dealTagLists.push(v)
          return
        }
        if (v.contract1 === 'tagtokenmain' && v.symbol1 === 'TAG') {
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
          dealTagLists.push(t)
        }
      })
      return dealTagLists;
    },
    handleTovote() {
      const checked = this.allList.filter(v => v.isChecked) || []
      if (!checked.length || this.voteLoading) {
        return;
      }
      this.voteLoading = true;
      const pools = [];
      checked.forEach(v => {
        pools.push(Number(v.mid))
      })
      const formName = this.scatter.identity.accounts[0].name;
      const permission = this.scatter.identity.accounts[0].authority;
      const params = {
        actions: [
          {
            account: 'vote.tag',
            name: 'vote',
            authorization: [{
              actor: formName, // 转账者
              permission,
            }],
            data: {
              voter: formName,
              pools,
            }
          },
        ]
      }
      EosModel.toTransaction(params, (res) => {
        this.voteLoading = false;
        if(res.code && JSON.stringify(res.code) !== '{}') {
          this.$message({
            message: res.message,
            type: 'error'
          });
          return
        }
        this.$message({
          message: this.$t('public.success'),
          type: 'success'
        });
        this.handleCancel()
        setTimeout(() => {
          this.handleGetVotes();
          this.handleGetMyVotes();
          getVotePools()
        }, 800);
      })
    },
    handleGetVotes() {
      const params = {
        "code": "vote.tag",
        "scope": "vote.tag",
        "table": "pools",
        "json": true,
        limit: 10000
      }
      EosModel.getTableRows(params, (res) => {
        const rows = res.rows || [];
        // console.log(rows)
        this.voteList = rows;
        this.handlerDealMlVote()
      })
    },
    handlerDealMlVote() {
      if (!this.allList.length) {
        // console.log('this.allList.length ---  ', this.allList.length)
        return
      }
      let allVote = 0;
      this.voteList.forEach(v => {
        allVote = parseInt(Number(v.total_votes) / 10000) + Number(allVote);
      })
      // console.log(this.voteList)
      this.voteList.forEach(v => {
        const marketIndex = this.allList.findIndex(vv => vv.mid === v.mid);
        if (marketIndex === -1) {
          return
        }
        const total_votes = parseInt(Number(v.total_votes) / 10000)
        this.$set(this.allList[marketIndex], 'total_votes', total_votes)
        const rate =  total_votes / allVote * 100
        this.$set(this.allList[marketIndex], 'votesRate', rate.toFixed(2))
      })

      this.allList = this.allList.sort((a, b) => {
        return (b.total_votes || 0) - (a.total_votes || 0);
      })
    },
    handleToDetail(item) {
      this.$router.push({
        name: 'tagVoteDetail',
        params: {
          symbol: `${item.symbol0}-${item.symbol1}`,
          mid: item.mid
        }
      })
    },
    handleChangeTab(index) {
      if (index === this.act) {
        return
      }
      this.search = '';
      this.act = index;
      this.handleCancel();
      if (index === 1) {
        this.searchList = this.allList;
        return
      }
      if (index === 2) {
        this.handleGetRank()
        return
      }
      if (index === 3) {
        this.handleGetMyVote()
      }
    },
    handleGetRank() {
      this.handleSort()
    },
    handleSort() {
      const allList = JSON.parse(JSON.stringify(this.allList))
      const newArr = allList.sort((a, b) => {
        return parseInt(b.total_votes || 0) - parseInt(a.total_votes || 0)
      });
      this.rankList = newArr.slice(0, 21);
      this.$forceUpdate()
    },
    // 查询我的投票
    handleGetMyVote() {
      this.searchList = [];
      this.$forceUpdate()
      if (this.myVoteList.length) {
        this.handleDealMyVote()
        return
      }
      this.hisLoading = true;
      this.handleGetMyVotes()
    },
    handleGetMyVotes() {
      const params = {
        "code": "vote.tag",
        "scope": "vote.tag",
        "table": "voters",
        "json": true,
        lower_bound: ` ${this.scatter.identity.accounts[0].name}`,
        upper_bound: ` ${this.scatter.identity.accounts[0].name}`, // 11.bank
        limit: 10000
      }
      EosModel.getTableRows(params, (res) => {
        this.hisLoading = false;
        this.swapGet = true;
        const rows = res.rows || [];
        if (!rows.length) {
          return
        }
        this.myVoteList = rows[0].last_vote;
        this.accNum = parseInt((rows[0].vote_power || 0) / 10000);
      })
    },
    handleDealMyVote() {
      const newArr = [];
      this.searchList = [];
      this.$forceUpdate()
      this.hisLoading = true;
      setTimeout(() => {
        this.hisLoading = false;
        this.myVoteList.forEach(v => {
          const checked = this.allList.find(vv => vv.mid === v) || {};
          newArr.push(checked)
        })
        this.searchList = newArr;
        this.$forceUpdate()
      }, 200);
    },
    handleCancel() {
      this.allList.forEach(v => {
        this.$set(v, 'isChecked', false)
      })
    },
    handleChecked(item) {
      const checkedArr = this.allList.filter(v => v.isChecked);
      if (checkedArr.length >= this.maxLen && !item.isChecked) {
        this.$message.error(this.$t('vote.maxNum', {n: this.maxLen}))
        return
      }
      const mlIndex = this.allList.findIndex(v => v.mid === item.mid)
      this.$set(this.allList[mlIndex], 'isChecked', !this.allList[mlIndex].isChecked);
      this.$forceUpdate()
    },
    handleSearch() {
      if (this.search === '') {
        if (this.act === 2) {
          this.handleGetRank();
          return;
        }
        if (this.act === 3) {
          return
        }
        this.searchList = this.allList;
        this.$forceUpdate()
        return;
      }
      this.act = 1;
      const search = this.search.toUpperCase();
      const arr = this.allList.filter(v => {
        const sym0has = v.symbol0.indexOf(search)
        if (sym0has !== -1) {
          return true
        }
        const sym1has = v.symbol1.indexOf(search)
        if (sym1has !== -1) {
          return true
        }
        return false
      })
      this.searchList = arr || [];
      this.$forceUpdate()
    },
    handleToDss() {
      this.$router.push({
        name: 'dss'
      })
    },
    handleRegIsChecked(item) {
      const has = this.checkBox.find(v => v.mid === item.mid)
      return !!has
    },
  }
}
</script>

<style lang="scss" scoped>
.mainTitle{
  font-size: 32px;
  text-align: left;
  margin: 0 0 30px 0;
  padding: 0 0 0 28px;
  &>span{
    margin-right: 60px;;
  }
  .rulesTip{
    font-size: 26px;
    margin-right: 40px;
    .tipIcon{
      width: 28px;
      margin-left: 8px;
      display: block;
    }
  }
  .act{
    color: $color-black;
    position: relative;
    padding-left: 26px;
    &::before{
      content: '';
      position: absolute;
      width: 8px;
      height: 32px;
      background: $color-main;
      border-radius:4px;
      left: 0%;
      top: 50%;
      transform: translateY(-45%);
    }
  }
}
.subTitle{
  text-align: left;
  padding-left: 0px;
  margin-top: 25px;
  color: $color-tip;
  font-size: 24px;
}
.voteMain{
  font-size: 27px;
}
.banner{
  font-size: 30px;
  color: #fff;
  position: relative;
  overflow: hidden;
  .bgImg{
    display: block;
    width: 100%;
    height: 100%;
    z-index: 0;
  }
}
.rules{
  margin: 40px;
  text-align: left;
  margin-top: 20px;
  .title{
    font-size: 35px
  }
  &>div{
    margin-top: 8px;
  }
  .subRules{
    margin-left: 60px;
    &>li{
      margin-top: 5px;
    }
  }
}
.info{
  text-align: left;
  background: #FFF;
  color: #333;
  padding: 40px 30px;
  border-top: 1px solid rgba(220,220,220, .3);
  // border-bottom: 20px solid #f6f6f6;
  .btn{
    font-size: 28px;
    padding: 10px 38px;
    background: #29D4B0;
    color: #FFF;
    border-radius: 30px;
    margin-left: 10px;
  }
  .refresh{
    margin-left: 8px;
    width: 30px;
    height: 30px;
    display: inline-block;
    border-radius: 30px;
  }
}
.tab{
  padding: 0 26px;
  top: 0;
  background: #FFF;
  position: sticky;
  z-index: 10;
  .nav{
    height: 85px;
    background: #FFF;
    color: #a6a6a6;
    &>span{
      margin-right: 40px;
      padding: 26px 0;
      &:last-child{
        margin-right: 0;
      }
    }
    .act{
      color: #000;
      font-weight: 500;
      position: relative;
      &::before{
        content: '';
        position: absolute;
        width: 32px;
        height: 2px;
        background:#333;
        border-radius:4px;
        left: 50%;
        bottom: 0%;
        transform: translateX(-50%);
      }
    }
  }
  .search{
    background: #F5F6F6;
    border-radius: 30px;
    // padding-left: 20px;
    width: 240px;
    // overflow: hidden;
    position: relative;
    .searchImg{
      width: 26px;
      position: absolute;
      left: 20px;
      top: 50%;
      transform: translateY(-50%);
    }
    /deep/ .el-input{
      // padding-left: 10px;
      .el-input__inner{
        flex: 1;
        text-align: center;
        font-size: 28px;
        height: 60px;
        line-height: 38px;
        background: transparent;
        border: 0px;
        &:focus{
          border-color: #07d79b;
        }
      }
      .el-input__prefix{
        margin-left: 10px;
        font-size: 30px;
        width: 30px;
      }
      .el-icon-search{
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}
.voteLists{
  padding: 0 30px;
}
.noData{
  padding: 50px 0;
  font-size: 30px;
  position: relative;
  .noDataImg{
    width: 400px;
  }
  .noDataTip{
    margin-top: -20px;
  }
}
.list{
  padding: 28px 0;
  border-top: 1px solid rgba(220,220,220,.3);
  .coinImg{
    margin-bottom: 16px;
    img{
      width: 44px;
      height: 44px;
      border-radius: 25px;;
      margin-right: 10px;
    }
    &>span{
      &:first-child{
        margin-right: 30px;
      }
    }
  }
  .num{
    margin-top: 8px;
    text-align: left;
    .voteIcon{
      width: 28px;
      margin-right: 8px;
    }
    .icon{
      font-size: 27px;
      margin-right: 8px;
    }
    .small{
      font-size: 24px;
      margin-left: -8px;
    }
    .green{
      font-size: 22px;
      color: #29D4B0;
    }
  }
  .select{
    width: 50px;
    height: 50px;
    border: 1px solid #eee;
    color: #FFF;
    border-radius: 50%;
    box-sizing: border-box;
    .el-icon-check{
      font-size: 30px;
    }
    &.active{
      background: #29D4B0;
      border: 0px solid transparent;
    }
    .checkedImg{
      width: 50px;
    }
  }
}
.nullDiv{
  height: 116px;
  width: 100%;
}
.voteAction{
  position: fixed;
  bottom: 0px;
  width: 100%;
  max-width: 750px;
  height: 116px;
  background: #fff;
  padding: 0 40px;
  font-size: 26px;
  box-sizing: border-box;
  border-top: 1px solid #eee;
  .voteBtn{
    font-size: 28px;
    margin-left: 20px;
    background: #29D4B0;
    color: #FFF;
    padding: 12px 40px;
    border-radius: 30px;
  }
}
.mkListDia{
  // animation: none;
  /deep/ .el-dialog{
    width: 600px;
    .el-dialog__body,
    .el-dialog__header{
      padding: 0;
      box-sizing: border-box;
    }
  }
  &.pcList{
    /deep/ .el-dialog{
      position: relative;
      border-radius:30px;
    }
  }
}
</style>
