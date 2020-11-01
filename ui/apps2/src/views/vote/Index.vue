<template>
  <div class="voteMain">
    <div class="banner">
      <img class="bgImg" src="@/assets/img/poolspage/top_bg.svg" alt="">
      <div class="title">DFS Governance</div>
      <div class="titleTip">
        DFS tokens represent voting shares.
      </div>
    </div>
    <div class="mainTitle flexb">
      <span class="act">{{ $t('vote.vote') }}</span>
      <span class="flexa rulesTip tip" @click="showRules = !showRules">
        <span>{{ $t('vote.voteRules') }}</span>
        <img class="tipIcon" src="@/assets/img/dex/tips_icon_btn.svg" alt="">
      </span>
    </div>
    <div class="info flexb" v-loading="!swapGet || !dssGet">
      <div>
        <div class="votes flexb">
          <span class="flexa">
            <span>{{ $t('vote.myVote') }}：{{ vote_power }}</span>
          </span>
        </div>
      </div>
      <div>
        <span class="btn" @click="handleToDss">{{ $t('market.manage') }}</span>
      </div>
    </div>
    <div class="selectList">
      <div class="tab flexb">
        <div class="nav">
          <span :class="{'act': act === 1}" @click="handleChangeTab(1)">{{ $t('vote.vote') }}</span>
          <span :class="{'act': act === 2}" @click="handleChangeTab(2)">{{ $t('vote.rank') }}</span>
          <span :class="{'act': act === 3}" @click="handleChangeTab(3)">{{ $t('vote.voted') }}</span>
        </div>
        <div class="search">
          <el-input prefix-icon="el-icon-search" @input="handleSearch"
            v-model="search" placeholder="搜索市场"></el-input>
        </div>
      </div>
      <div v-if="act !== 2" class="voteLists" v-loading="listLoading || hisLoading">
        <div class="noData tip" v-if="!searchList.length">{{ $t('public.noData') }}</div>
        <template  v-for="(item, index) in searchList">
          <div class="list flexb" :key="index" @click="handleChecked(item, index)">
            <div>
              <div class="poolName">
                <span class="coinImg flexa">
                  <span class="flexa">
                    <img :src="item.sym0Data.imgUrl" :onerror="errorCoinImg">
                    <span>{{ item.symbol0 }}</span>
                  </span>
                  <span class="add">+</span>
                  <span class="flexa">
                    <img :src="item.sym1Data.imgUrl" :onerror="errorCoinImg">
                    <span>{{ item.symbol1 }}</span>
                  </span>
                </span>
              </div>
              <div class="num">
                <span class="el-icon-coin icon"></span>
                <span>{{ item.total_votes || '0' }}（{{ item.votesRate || '0.00' }}%）</span>
                <span class="green" @click.stop="handleToDetail(item)">{{ $t('public.detail') }}></span>
              </div>
            </div>
            <div v-if="act !== 3" class="select flexc" :class="{'active': item.isChecked}">
              <span class="el-icon-check"></span>
            </div>
          </div>
        </template>
      </div>
      <div class="rank" v-else v-loading="rankLoading">
        <Rank :rankList="rankList" :voteList="voteList"/>
      </div>
    </div>

    <div class="nullDiv"></div>
    <div class="voteAction flexb">
      <span>{{ $t('vote.checked') }} {{ checkedLeng }}/3</span>
      <span>
        <span v-if="checkedLeng" class="tip" @click="handleCancel">{{ $t('vote.cancelChecked') }}</span>
        <span class="voteBtn" v-loading="voteLoading" @click="handleTovote">{{ $t('vote.toVote') }}</span>
      </span>
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
        this.allList = newVal;
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
          this.handleGetDssNum();
          this.handleGetSwapData()
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
            account: 'dfspoolsvote',
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
        "code": "dfspoolsvote",
        "scope": "dfspoolsvote",
        "table": "pools",
        "json": true,
        limit: 10000
      }
      EosModel.getTableRows(params, (res) => {
        // console.log('get')
        const rows = res.rows || [];
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
      this.voteList.forEach(v => {
        const marketIndex = this.allList.findIndex(vv => vv.mid === v.mid);
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
        name: 'voteDetail',
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
        "code": "dfspoolsvote",
        "scope": "dfspoolsvote",
        "table": "voters",
        "json": true,
        lower_bound: ` ${this.scatter.identity.accounts[0].name}`,
        upper_bound: ` ${this.scatter.identity.accounts[0].name}`, // 11.bank
        // lower_bound: ` judy.dfs`,
        // upper_bound: ` judy.dfs`,
        limit: 10000
      }
      EosModel.getTableRows(params, (res) => {
        this.hisLoading = false;
        // console.log('get')
        const rows = res.rows || [];
        if (!rows.length) {
          return
        }
        this.myVoteList = rows[0].last_vote;
        // this.vote_power = parseInt(rows[0].vote_power / 10000);
      })
    },
    handleGetDssNum() {
      const formName = this.scatter.identity.accounts[0].name;
      const params = {
        "code": "dfsdsrsystem",
        "scope": "dfsdsrsystem",
        "table": "holders",
        "lower_bound": ` ${formName}`,
        "upper_bound": ` ${formName}`,
        "json": true,
      }
      EosModel.getTableRows(params, (res) => {
        this.dssGet = true;
        if (!res.rows.length) {
          this.dssData = {}
          return
        }
        const allList = res.rows;
        allList.forEach((v) => {
          let buff = v.pool ? (this.config[v.pool - 1].bonus - 1) * 100 : 0;
          this.$set(v, 'buff', buff.toFixed(2));
          this.$set(v, 'balance', v.bal.split(' ')[0]);
        })
        // console.log(allList)
        this.dssData = allList[0];
      })
    },
    handleGetSwapData() {
      const params = {
        "code": "miningpool11",
        "scope": 39,
        "table": "miners",
        "lower_bound": ` ${this.scatter.identity.accounts[0].name}`,
        "upper_bound": ` ${this.scatter.identity.accounts[0].name}`,
        limit: 2000,
        "json": true,
      }
      EosModel.getTableRows(params, (res) => {
        this.swapGet = true;
        const rows = res.rows || [];
        if (!rows.length) {
          return
        }
        this.swapData = rows[0];
        // console.log(rows)
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
      if (checkedArr.length >= 3 && !item.isChecked) {
        this.$message.error(this.$t('vote.maxNum'))
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
  margin: 40px 0 40px;
  padding: 0 0 0 40px;
  &>span{
    margin-right: 60px;;
  }
  .rulesTip{
    font-size: 30px;
    margin-right: 40px;
    .tipIcon{
      margin-left: 8px;
    }
  }
  .act{
    color: $color-black;
    position: relative;
    &::before{
      content: '';
      position: absolute;
      width:60px;
      height:8px;
      background:rgba(2,198,152,1);
      border-radius:4px;
      bottom: -20px;
      left: 50%;
      transform: translateX(-45%);
    }
  }
}
.voteMain{
  font-size: 27px;
}
.banner{
  font-size: 30px;
  color: #fff;
  position: relative;
  background: #07D79B;
  padding: 30px 40px;
  overflow: hidden;
  .title{
    position: relative;
    font-size: 36px;
    margin-bottom: 10px;
    z-index: 2;
  }
  .titleTip{
    position: relative;
    z-index: 2;
    font-weight: 300;
  }
  .bgImg{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
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
  margin: 40px;
  background: #07d79b;
  border-radius: .26667rem;
  color: #fff;
  padding: 30px;
  box-shadow: 0 0.26667rem 0.53333rem 0 hsla(0,0%,86.3%,.5);
  .btn{
    padding: 8px 20px;
    background: #FFF;
    color: #07D79B;
    border-radius: 5px;
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
.selectList{
  margin: 40px;
  // padding: 0 30px;
  box-shadow: 0 0.26667rem 0.53333rem 0 hsla(0,0%,86.3%,.5);
  border-radius: 10px;
  // overflow: hidden;
}
.tab{
  padding: 30px;
  top: 0;
  background: #FFF;
  position: sticky;
  z-index: 10;
  .nav{
    background: #FFF;
    color: #a6a6a6;
    &>span{
      margin-right: 20px;
      &:last-child{
        margin-right: 0;
      }
    }
    .act{
      color: #000;
      font-weight: 500;
    }
  }
  .search{
    /deep/ .el-input{
      width: 300px;
      // padding-left: 10px;
      .el-input__inner{
        text-align: center;
        font-size: 30px;
        height: 60px;
        line-height: 38px;
        padding-left: 40px;
        border-radius: 30px;
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
        // &::before{
          display: flex;
          align-items: center;
          justify-content: center;
        // }
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
}
.list{
  padding: 20px 0;
  border-top: 1px solid #eee;
  .coinImg{
    img{
      width: 50px;
      margin-right: 10px;
    }
    .add{
      margin: 20px;
    }
  }
  .num{
    margin-top: 8px;
    text-align: left;
    .icon{
      font-size: 27px;
      margin-right: 8px;
    }
    .green{
      font-size: 27px;
      color: #07d79b;
    }
  }
  .select{
    width: 40px;
    height: 40px;
    border: 1px solid #e3e3e3;
    color: #FFF;
    border-radius: 50%;
    box-sizing: border-box;
    .el-icon-check{
      font-size: 30px;
    }
    &.active{
      background: #07d79b;
      border: 0px solid transparent;
    }
  }
}
.nullDiv{
  height: 150px;
  width: 100%;
}
.voteAction{
  position: fixed;
  bottom: 0px;
  width: 100%;
  max-width: 750px;
  height: 150px;
  background: #fff;
  padding: 0 40px;
  font-size: 30px;
  box-sizing: border-box;
  border-top: 1px solid #eee;
  .voteBtn{
    margin-left: 20px;
    background: #07d79b;
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
