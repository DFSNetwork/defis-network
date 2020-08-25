<template>
  <div class="symbolData">
    <div class="myPools">
      <!-- <div class="title"><span class="act">{{ $t('mine.myMine') }}</span></div> -->
      <div class="title"><span class="act">{{ $t('mine.symbolPool', {symbol: `${thisMarket.symbol0}-${thisMarket.symbol1}`}) }}</span></div>
      <div class="data">
        <div class="allClaim flexb">
          <div>
            <div class="subTitle flexa">
              <span>{{ $t('mine.waitClaim') }}</span>
              <img class="tipIcon ml10" @click="showReWardTip = true" src="@/assets/img/dex/tips_icon_btn.svg" alt="">
            </div>
            <div class="claimNum">{{ accMineData.showReward || '0.00000000' }} DFS</div>
          </div>
          <div class="allClaimBtn" v-if="Number(accMineData.liq)" v-loading="claimLoading"
            @click="handleClaim(thisMarket)">{{ $t('bonus.claim') }}</div>
          <div class="allClaimBtn" v-if="!Number(accMineData.liq) && getAccData"
            @click="handleJoin(thisMarket)">{{ $t('mine.join') }}</div>
        </div>
        <div class="mylist" @click="handleJoin(thisMarket)">
          <div class="flexb">
            <span class="flexa" v-if="Number(buff)">
              <img class="buffImg" src="@/assets/img/poolspage/buff2.svg">
              <span class="addition">{{ $t('mine.buff') }}：{{ buff }}%</span>
            </span>
          </div>
          <div class="symbol flexb">
            <div class="coinInfo flex">
              <div class="coinImg"><img width="100%" :src="thisMarket.sym0Data.imgUrl"></div>
              <div>
                <div class="coin">{{ thisMarket.symbol0 }}</div>
                <div class="contract tip">{{ thisMarket.contract0 }}</div>
              </div>
            </div>
            <div class="add">+</div>
            <div class="coinInfo flex">
              <div class="coinImg"><img width="100%" :src="thisMarket.sym1Data.imgUrl"></div>
              <div>
                <div class="coin">{{ thisMarket.symbol1 }}</div>
                <div class="contract tip">{{ thisMarket.contract1 }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="tipDiv">
          <div>
            <span>{{ $t('mine.accPools') }}: </span>
            <span>{{ accMineData.liq_bal0 || `0.0000 ${thisMarket.symbol0}` }} / {{ accMineData.liq_bal1 || `0.0000 ${thisMarket.symbol1}`}}</span>
          </div>
          <div class="myMarket">
            <span>{{ $t('dex.pools') }}: </span>
            <span>{{ thisMarket.reserve0 || '—' }} / {{ thisMarket.reserve1 || '—' }}</span>
          </div>
          <div class="rewardPerDay tip">
            <span>{{ $t('mine.poolsMine2', {perDayReward: dayRewardNum}) }}</span>
          </div>
          <div class="rewardPerDay tip"><span>{{ $t('mine.mineApr') }}: {{ apr }}%</span></div>
          <div class="rewardPerDay tip" v-if="!isActual && Number(feesApr)"><span>{{ $t('mine.marketFeesApr') }}: {{ feesApr }} %</span></div>
          <div class="rewardPerDay tip" v-if="isActual && Number(feesApr)"><span>{{ $t('mine.marketApr24H') }}: {{ feesApr }} %</span></div>
        </div>
      </div>
    </div>

    <div class="poolsLists">
      <div class="title flexb">
        <span class="act">{{ $t('mine.minersList') }}</span>
        <span class="totalMiners">{{ $t('mine.totalMiners') }}：{{ allMinersList.length }}</span>
      </div>
      <div class="noData" v-loading="!getMinersList" v-if="!minersArr.length">{{ $t('public.noData') }}</div>
      <template v-for="(item, index) in minersArr">
        <div class="list" :key="index">
          <div class="flexb mb10">
            <span>{{ item.miner }}</span>
            <span>{{ $t('mine.earnings') }}：{{ item.showReward || '0.00000000' }} DFS</span>
          </div>
          <div class="flexb">
            <span>{{ $t('dex.pools') }}</span>
            <span>{{ item.liq_bal0 }} / {{ item.liq_bal1 }}</span>
          </div>
        </div>
      </template>
      <el-pagination
        v-if="allMinersList.length"
        class="pagination"
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :current-page.sync="page"
        :page-size="pageSize"
        :total="allMinersList.length">
      </el-pagination>
    </div>

    <el-dialog
      class="myDialog"
      :visible.sync="showReWardTip">
      <MinReward :minReward="minReward"/>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { EosModel } from '@/utils/eos';
import { toFixed, accSub, accAdd, accMul, accDiv, dealReward, dealMinerData, perDayReward, getPoolApr } from '@/utils/public';
import MinReward from '../popup/MinReward'

export default {
  components: {
    MinReward
  },
  data() {
    return {
      getMinersList: false,
      showReWardTip: false,
      claimLoading: false,
      getAccData: false,
      thisMarket: {
        symbol0: 'EOS',
        symbol1: 'USDD',
        contract0: 'eosio.token',
        contract1: 'bankofusddv1',
        sym0Data: {
          imgUrl: "/static/coin/eosio.token-eos.svg"
        },
        sym1Data: {
          imgUrl: "/static/coin/bankofusddv1-usdd.svg"
        },
      }, // 当前矿池数据
      accMineData: {}, // 用户记录
      allMinersList: [], // 所有挖矿者列表
      page: 1,
      pageSize: 20,
      minersArr: [], // 所有挖矿者列表 - 单页面
      timerArr: [], // 所有挖矿者收益定时器
      secTimer: null, // 秒级定时器
      accTimer: null, // 用户自己的收益定时器
      accSecTimer: null, // 用户自己的秒级定时器
    }
  },
  props: {
    marketLists: {
      type: Array,
      default: function lists() {
        return []
      }
    }
  },
  watch: {
    marketLists: {
      handler: function ml(newVal) {
        if (this.thisMarket.mid || !newVal.length) {
          return
        }
        this.thisMarket = newVal.find(v => v.mid === Number(this.$route.params.mid))
        // console.log(this.thisMarket)
      },
      immediate: true
    },
    scatter: {
      handler: function listen(newVal) {
        if (newVal.identity) {
          this.handleGetMinersLists('user')
        }
      },
      deep: true,
      immediate: true,
    },
  },
  computed: {
    ...mapState({
      // 箭头函数可使代码更简练
      // baseConfig: state => state.sys.baseConfig, // 基础配置 - 默认为{}
      weightList: state => state.sys.weightList, // 交易对权重列表
      aprs: state => state.sys.aprs,
      damping: state => state.sys.damping,
      scatter: state => state.app.scatter,
      dfsPrice: state => state.sys.dfsPrice,
      storeFeesApr: state => state.sys.feesApr,
    }),
    minReward() {
      if (!Number(this.dfsPrice)) {
        return '0.0005'
      }
      let min = accDiv(0.0001, this.dfsPrice)
      if (Number(toFixed(min, 4)) < min) {
        min = accAdd(min, 0.0001)
      }
      return toFixed(min, 4)
    },
    weight() {
      if (!this.weightList.length || !this.thisMarket.mid) {
        return '0'
      }
      const wData = this.weightList.find(v => v.mid === this.thisMarket.mid)
      return wData.pool_weight;
    },
    buff() {
      if (Number(this.weight) <= 1) {
        return 0
      }
      let t = accSub(this.weight, 1);
      t = accMul(t, 100);
      return t.toFixed(0)
    },
    dayRewardNum() {
      if (Number(this.weight) <= 0) {
        return '0.0000'
      }
      return perDayReward(this.weight)
    },
    apr() {
      const apr = this.dayRewardNum * this.dfsPrice / 20000 * 365 * 100;
      return apr.toFixed(2)
    },
    feesApr() {
      const feesApr = this.storeFeesApr.find(v => v.symbol === this.thisMarket.symbol1) || {}
      const thisPoolApr = getPoolApr(this.thisMarket)
      return parseFloat(feesApr.poolsApr) > parseFloat(thisPoolApr) ? parseFloat(feesApr.poolsApr) : parseFloat(thisPoolApr)
      // return getPoolApr(this.thisMarket)
    },
    isActual() {
      const feesApr = this.storeFeesApr.find(v => v.symbol === this.thisMarket.symbol1) || {}
      const thisPoolApr = getPoolApr(this.thisMarket)
      return parseFloat(feesApr.poolsApr) > parseFloat(thisPoolApr)
    }
  },
  mounted() {
    this.handleGetMinersLists()
  },
  beforeDestroy() {
    clearInterval(this.accTimer)
    clearInterval(this.secTimer)
    clearInterval(this.accSecTimer)
    this.timerArr.forEach(v => {
      clearInterval(v)
    })
  },
  methods: {
    handleCurrentChange() {
      this.handleGetPageArr();
    },
    handleGetMinersLists(type) {
      const params = {
        "code": "miningpool11",
        "scope": this.$route.params.mid,
        "table": "miners",
        // "lower_bound": " dfsdeveloper",
        // "upper_bound": " dfsdeveloper",
        limit: 1000,
        "json": true,
      }
      if (type === 'user') {
        params.lower_bound = ` ${this.scatter.identity.accounts[0].name}`;
        params.upper_bound = ` ${this.scatter.identity.accounts[0].name}`;
      }
      EosModel.getTableRows(params, (res) => {
        if (type === 'user') {
          this.getAccData = true;
        } else {
          this.getMinersList = true;
        }
        const rows = res.rows || []
        if (!rows.length) {
          this.accMineData = {};
          return
        }
        const newList = [];
        rows.forEach(item => {
          let v = item;
          // if (this.thisMarket.exchangeSym) {
          if (v.liq_bal1.split(' ')[1] === 'EOS' || this.thisMarket.exchangeSym) {
            const tList = {
              last_drip: v.last_drip,
              liq_bal0: v.liq_bal1,
              liq_bal1: v.liq_bal0,
              miner: v.miner
            }
            v = tList;
          }
          const minnerData = dealMinerData(v, this.thisMarket)
          // console.log(minnerData)
          if (type === 'user') {
            this.accMineData = minnerData;
            return;
          }
          // if (this.scatter.identity && this.scatter.identity.accounts[0].name === v.miner) {
          //   return
          // }
          newList.push(minnerData)
        })
        if (type === 'user') {
          this.handleRunAccReward()
          return
        }
        const newListSort = newList.sort((a, b) => {
          return b.liq - a.liq;
        })
        try {
          this.allMinersList = newListSort;
          this.handleGetPageArr();
        } catch (error) {
          console.log(error)
        }
      })
    },
    handleGetPageArr() {
      const start = (this.page - 1) * this.pageSize;
      const end = this.page * this.pageSize;
      this.minersArr = this.allMinersList.slice(start, end);
      // console.log(this.minersArr)
      this.handleRunReward()
    },
    // 秒级定时器
    handleRunReward() {
      clearInterval(this.secTimer)
      this.handleRunLogic()
      this.secTimer = setInterval(() => {
        this.handleRunLogic()
      }, 1000);
    },
    // 数据滚动效果
    handleRunLogic() {
      this.minersArr.forEach((v, index) => {
        if (this.timerArr[index]) {
          clearInterval(this.timerArr[index]);
        }
        if (!Number(v.liq)) {
          this.timerArr[index] = null;
          return
        }
        const reward = dealReward(v, this.weight)
        let showReward = v.reward || '0.00000000';
        let countReward = showReward;
        if (!v.showReward) {
          this.$set(v, 'showReward', reward)
          showReward = reward;
          countReward = reward;
        }
        this.$set(v, 'reward', reward)
        let t = accSub(reward, showReward);
        t = accDiv(t, 20)
        this.timerArr[index] = setInterval(() => {
          countReward = accAdd(countReward, t)
          if (countReward > Number(reward)) {
            showReward = toFixed(reward, 8);
            clearInterval(this.timerArr[index])
          } else {
            showReward = toFixed(countReward, 8);
          }
          this.$set(v, 'showReward', showReward);
        }, 50);
      })
    },
    handleRunAccReward() {
      clearInterval(this.accSecTimer)
      this.handleAccRun()
      this.accSecTimer = setInterval(() => {
        this.handleAccRun()
      }, 1000);
    },
    handleAccRun() {
      // console.log(this.accMineData)
      const reward = dealReward(this.accMineData, this.weight)
      let showReward = this.accMineData.reward || '0.00000000';
      let countReward = showReward;
      if (!this.accMineData.showReward) {
        this.accMineData.showReward = reward;
        showReward = reward;
        countReward = reward;
      }
      this.accMineData.reward = reward;
      let t = accSub(reward, showReward);
      t = accDiv(t, 20)
      clearInterval(this.accTimer)
      this.accTimer = setInterval(() => {
        countReward = accAdd(countReward, t)
        if (countReward > Number(reward)) {
          showReward = toFixed(reward, 8);
          clearInterval(this.accTimer)
        } else {
          showReward = toFixed(countReward, 8);
        }
        this.accMineData.showReward = showReward;
        // console.log(this.accMineData.showReward)
      }, 50);
    },
    handleJoin(item) {
      this.$router.push({
        name: 'market',
        params: {
          mid: item.mid
        }
      })
    },
    handleClaim(item) {
      if (this.claimLoading) {
        return
      }
      if (Number(this.accMineData.reward) < Number(this.minReward)) {
        this.showReWardTip = true;
        return
      }
      this.claimLoading = true;
      const formName = this.$store.state.app.scatter.identity.accounts[0].name;
      const permission = this.$store.state.app.scatter.identity.accounts[0].authority;
      const params = {
        actions: [
          {
            account: 'miningpool11',
            name: 'claim',
            authorization: [{
              actor: formName, // 转账者
              permission,
            }],
            data: {
              user: formName,
              mid: item.mid,
            }
          },
        ]
      }
      EosModel.toTransaction(params, (res) => {
        this.claimLoading = false
        if(res.code && JSON.stringify(res.code) !== '{}') {
          this.$message({
            message: res.message,
            type: 'error'
          });
          return
        }
        // this.changeReWard = toFixed(0, 8);
        // this.reward = 0;
        this.handleGetMinersLists('user')
        this.$message({
          message: this.$t('public.success'),
          type: 'success'
        });
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.title{
  font-size: 32px;
  text-align: left;
  margin: 0 0 40px;
  &>span{
    margin-right: 60px;;
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
.green{
  color: #07D79B;
}
.mylist{
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  .addition{
    font-size: 24px;
    color: #E9574F;
  }
  .buffImg{
    width: 30px;
    margin-right: 8px;
  }
}
.symbolData{
  text-align: left;
  font-size: 28px;
  color: #000;
  .allClaim{
    // margin: 0 40px 40px;
    background: #07D79B;
    border-radius: 20px;
    color: #FFF;
    padding: 40px;
    .ml10{
      margin-left: 10px;
    }
    .subTitle{
      font-size: 26px;
    }
    .claimNum{
      font-size: 30px;
      font-weight: 500;
      margin-top: 8px;
    }
    .allClaimBtn{
      background: #FFF;
      border-radius: 8px;
      color: #07D79B;
      font-size: 28px;
      padding: 10px 30px;
    }
  }
  .myPools{
    margin: 40px;
    .addition{
      font-size: 24px;
      color: #E9574F;
    }
    .symbol{
      margin-top: 20px;
      border-radius: 20px;
      .coinInfo{
        text-align: left;
        .coinImg{
          width: 60px;
          height: 60px;
          margin-right: 10px;
        }
        .coin{
          font-size: 28px;
          font-weight: 500;;
          line-height: 30px;
        }
        .contract{
          line-height: 30px;
        }
        .ableGet{
          color: #2F3F52;
        }
      }
      .add{
        width: 40px;
      }
    }
    .myMarket{
      margin-top: 10px;
    }
    .rewardPerDay{
      font-size: 24px;
      margin-top: 10px;
    }
  }
  .tipDiv{
    border: 1px solid #e3e3e3;
    margin-top: 20px;
    border-radius: 20px;
    padding: 20px;
    font-size: 28px;
  }
  .poolsLists{
    margin: 40px;
    .totalMiners{
      margin-right: 0;
      font-size: 26px;
      .tipIcon{
        margin-left: 10px;
        width: 28px;
      }
    }
    .list{
      margin-top: 20px;
      border: 1px solid #e0e0e0;
      border-radius: 20px;
      padding: 20px;
      .mb10{
        margin-bottom: 10px;
      }
    }
    .noData{
      text-align: center;
      margin: 100px 0;
      color: #A6A6A6;
      font-size: 24px;
    }
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
.myDialog{
  /deep/ .el-dialog{
    position: relative;
    margin: auto;
    width: 570px;
    border-radius: 20px;
    .el-dialog__body,
    .el-dialog__header{
      padding: 0;
    }
  }
}
</style>