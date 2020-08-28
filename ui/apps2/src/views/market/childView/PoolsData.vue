<template>
  <div class="pools">
    <pools-info :lists="lists"/>
    <div class="allClaim flexb">
      <div>
        <div class="subTitle flexa">
          <span>{{ $t('mine.waitClaim') }}</span>
          <img class="tipIcon ml10" @click="showReWardTip = true" src="@/assets/img/dex/tips_icon_btn.svg" alt="">
        </div>
        <div class="claimNum">{{allReward}} DFS</div>
      </div>
      <div class="flexb">
        <div class="allClaimBtn" v-loading="allClaim" @click="handleClaimAll">{{ $t('mine.claimAll') }}</div>
      </div>
    </div>
    <div class="poolsList">
      <div class="title flexb">
        <span class="act">{{ $t('mine.poolsList') }}</span>
        <span class="flexa mineRule" @click="showRules = true">
          <span>{{ $t('miningRules.rules') }}</span>
          <img class="tipIcon" src="@/assets/img/dex/tips_icon_btn.svg" alt="">
        </span>
      </div>
      <div class="noData" v-loading="!firstGet" v-if="!lists.length">{{ $t('public.noData') }}</div>
      <div :class="`list ${handleGetClass(item.mid)}`" v-for="(item, index) in lists" :key="index" @click="handleToMarket(item)">
        <div class="flexb">
          <span class="flexa">
            <span>{{ $t('mine.earnings') }}：</span>
            <!-- <span v-if="!item.minnerData || !Number(item.minnerData.liq)">0.00000000 DFS </span> -->
            <span>{{ item.showReward || '0.00000000' }} DFS </span>
            <span class="addition flexa" v-if="Number(handleGetBuff(item))">
              <img class="buffImg" src="@/assets/img/poolspage/buff2.svg">
              <span>{{ handleGetBuff(item) }}%</span>
            </span>
          </span>
          <span class="green" v-if="item.minnerData && !Number(item.minnerData.liq)" @click.stop="handleJoin(item)">{{ $t('mine.join') }}</span>
          <span class="green" v-if="item.minnerData && Number(item.minnerData.liq)" v-loading="item.loading"
            @click.stop="handleClaim(item)">{{ $t('bonus.claim') }}</span>
        </div>
        <div class="symbol flexa">
          <div class="coinInfo flex">
            <div class="coinImg"><img width="100%" :src="item.sym0Data.imgUrl" :onerror="errorCoinImg"></div>
            <div>
              <div class="coin">{{ item.symbol0 }}</div>
              <div class="contract tip">{{ item.contract0 }}</div>
            </div>
          </div>
          <div class="add">+</div>
          <div class="coinInfo flex">
            <div class="coinImg"><img width="100%" :src="item.sym1Data.imgUrl" :onerror="errorCoinImg"></div>
            <div>
              <div class="coin">{{ item.symbol1 }}</div>
              <div class="contract tip">{{ item.contract1 }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      class="myDialog"
      :visible.sync="showReWardTip">
      <min-reward :minReward="minReward"/>
    </el-dialog>

    <el-dialog
      class="myDialog"
      :visible.sync="showRules">
      <mining-rules :minReward="minReward"/>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { EosModel } from '@/utils/eos';
import moment from 'moment';
import { toFixed, toLocalTime, accSub, accAdd, accMul, accDiv, dealReward, getClass } from '@/utils/public';
import MinReward from '../popup/MinReward'
import MiningRules from '../popup/MiningRules'
import PoolsInfo from '../comp/PoolsInfo'

export default {
  name: 'poolsData',
  components: {
    MinReward,
    MiningRules,
    PoolsInfo,
  },
  data() {
    return {
      errorCoinImg: 'this.src="https://ndi.340wan.com/eos/eosio.token-eos.png"',
      poolsInfo: {},

      showRules: false,
      showReWardTip: false,
      listLoading: false,
      allClaim: false,
      lists: [],
      firstGet: false,
      priceTimer: null,
      listsTimer: null,
      timerArr: [],
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
  computed: {
    ...mapState({
      // 箭头函数可使代码更简练
      // baseConfig: state => state.sys.baseConfig, // 基础配置 - 默认为{}
      weightList: state => state.sys.weightList, // 交易对权重列表
      aprs: state => state.sys.aprs,
      damping: state => state.sys.damping,
      scatter: state => state.app.scatter,
      dfsPrice: state => state.sys.dfsPrice,
      sortClass: state => state.sys.sortClass,
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
    allReward() {
      if (!this.lists.length) {
        return '0.00000000'
      }
      let all = 0;
      this.lists.forEach(v => {
        if (!v.showReward) {
          return
        }
        all = accAdd(Number(v.showReward), all)
      })
      return toFixed(all, 8)
    }
  },
  watch: {
    marketLists: {
      handler: function ml(newVal) {
        if (!newVal.length || !this.weightList.length || this.firstGet) {
          return
        }
        const weightList = this.weightList;
        const lists = [];
        const gold = [], silver = [], bronze = [];
        weightList.sort((a, b) => {
          return b.pool_weight - a.pool_weight
        })
        weightList.forEach(v => {
          const item = newVal.find(vv => vv.mid === v.mid)
          item.pool_weight = v.pool_weight;
          if (this.sortClass.gold.find(vv => vv === item.mid)) {
            gold.push(item)
          } else if (this.sortClass.silver.find(vv => vv === item.mid)) {
            silver.push(item)
          } else if (this.sortClass.bronze.find(vv => vv === item.mid)) {
            bronze.push(item)
          } else {
            lists.push(item)
          }
        });
        this.lists = [...gold, ...silver, ...bronze, ...lists];
        this.firstGet = true;
        this.handleGetMiners()
        // console.log(this.lists)
      },
      deep: true,
      immediate: true
    },
    scatter: {
      handler: function sc (newVal) {
        if (newVal.identity) {
          this.handleGetMiners()
        }
      },
      deep: true
    }
  },
  mounted() {
  },
  beforeDestroy() {
    clearInterval(this.listsTimer)
    this.timerArr.forEach(v => {
      clearInterval(v)
    })
  },
  methods: {
    handleGetClass(mid) {
      return getClass(mid)
    },
    handleJoin(item) {
      this.$router.push({
        name: 'market',
        params: {
          mid: item.mid
        }
      })
    },
    handleToMarket(item) {
      this.$router.push({
        name: 'poolsMarket',
        params: {
          mid: item.mid
        }
      })
    },
    handleGetMiners() {
      if (!this.$store.state.app.scatter || !this.$store.state.app.scatter.identity) {
        return;
      }
      const formName = this.$store.state.app.scatter.identity.accounts[0].name;
      this.lists.forEach((v) => {
        const params = {
          code: 'miningpool11',
          scope: v.mid,
          table: 'miners',
          lower_bound: ` ${formName}`,
          upper_bound: ` ${formName}`,
          json: true,
        }
        EosModel.getTableRows(params, (res) => {
          const rows = res.rows || []
          if (!rows.length) {
            this.$set(v, 'minnerData', {})
            return
          }
          const minnerData = rows[0];
          let lastTime = toLocalTime(`${minnerData.last_drip}.000+0000`);
          lastTime = moment(lastTime).valueOf();
          minnerData.lastTime = lastTime;
          const liq = minnerData.liq_bal0.split(' ')[1] === 'EOS' ? minnerData.liq_bal0.split(' ')[0] : minnerData.liq_bal1.split(' ')[0];
          minnerData.liq = liq;
          this.$set(v, 'minnerData', minnerData)
        })
        this.handleRunReward()
      })
    },
    handleRunReward() {
      clearInterval(this.listsTimer)
      this.listsTimer = setInterval(() => {
        this.lists.forEach((v, index) => {
          if (this.timerArr[index]) {
            clearInterval(this.timerArr[index]);
          }
          if (!v.minnerData || !Number(v.minnerData.liq)) {
            this.timerArr[index] = null;
            return
          }
          const reward = dealReward(v.minnerData, v.pool_weight)
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
      }, 1000);
    },
    handleDealMineNum(minnerData, weight) {
      // 用户实际数据计算
      let minNum = '0';
      const type = minnerData.lastTime < this.aprs.lastTime; // 用户时间 < 系统时间
      if (type) {
        let t = moment().valueOf() - this.aprs.lastTime;
        t = t / 1000;
        minNum = minnerData.liq * this.aprs.aprs_accumulator * Math.pow(this.aprs.aprs, t)
      } else {
        let t = moment().valueOf() - minnerData.lastTime;
        t = t / 1000;
        minNum = minnerData.liq * Math.pow(this.aprs.aprs, t)
      }
      minNum = minNum - minnerData.liq;
      let reward = minNum / this.dfsPrice * this.damping * weight
      reward *= 0.8
      reward = toFixed(reward, 8)
      return reward
    },
    handleGetBuff(item) {
      let t = accSub(item.pool_weight, 1);
      t = accMul(t, 100);
      if (Number(t) < 0) {
        return '0'
      }
      return t.toFixed(0)
    },
    handleClaim(item) {
      if (item.loading) {
        return
      }
      if (!item.reward || Number(item.reward) < Number(this.minReward)) {
        this.showReWardTip = true;
        return
      }
      item.loading = true;
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
        item.loading = false;
        if(res.code && JSON.stringify(res.code) !== '{}') {
          this.$message({
            message: res.message,
            type: 'error'
          });
          return
        }
        // this.changeReWard = toFixed(0, 8);
        // this.reward = 0;
        this.handleGetMiners();
        this.$message({
          message: this.$t('public.success'),
          type: 'success'
        });
      })
    },
    handleClaimAll() {
      if (this.allClaim) {
        return
      }
      if (!this.scatter.identity || !this.scatter.identity.accounts[0].name) {
        return
      }
      const formName = this.$store.state.app.scatter.identity.accounts[0].name;
      const permission = this.$store.state.app.scatter.identity.accounts[0].authority;
      const actions = [];
      this.lists.forEach(item => {
        if (!item.reward || Number(item.reward) < Number(this.minReward)) {
          return
        }
        this.$set(item, 'loading', true);
        actions.push({
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
        })
      })
      if (!actions.length) {
        return
      }
      const params = {
        actions
      }
      this.allClaim = true;
      EosModel.toTransaction(params, (res) => {
        this.allClaim = false;
        this.lists.forEach(item => {
          this.$set(item, 'loading', false);
        })
        if(res.code && JSON.stringify(res.code) !== '{}') {
          this.$message({
            message: res.message,
            type: 'error'
          });
          return
        }
        this.handleGetMiners();
        this.$message({
          message: this.$t('public.success'),
          type: 'success'
        });
      })
    },
    handleGetWeight() {
      const params = {
        code: 'miningpool11',
        scope: 'miningpool11',
        table: 'weights',
        json: true,
        limit: 100
      }
      EosModel.getTableRows(params, (res) => {
        console.log(res)
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.green{
  color: #07D79B;
}
.pools{
  font-size: 28px;
  text-align: left;
  color: #000;
  .allClaim{
    margin: 0 40px 40px;
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
  .poolsList{
    margin: 40px;
    .noData{
      text-align: center;
      margin: 100px 0;
      color: #A6A6A6;
      font-size: 24px;
    }
    .mineRule{
      margin-right: 0;
      font-size: 26px;
      .tipIcon{
        margin-left: 10px;
        width: 28px;
      }
    }
    .list{
      margin-top: 20px;
      padding: 20px;
      border: 1px solid #e0e0e0;
      border-radius: 20px;
      &.gold {
        border: 1px solid rgb(238, 198, 4);
        box-shadow: 0 0 5px 0px rgba(238, 198, 4, .5);
      }
      &.silver {
        border: 1px solid #c0c0c0;
        box-shadow: 0 0 5px 0px rgba(#c0c0c0, .5);
      }
      &.bronze {
        border: 1px solid #8C7853;
        box-shadow: 0 0 5px 0px rgba(#8C7853, .5);
      }
      .addition{
        font-size: 24px;
        color: #E9574F;
        line-height: 40px;
        margin-left: 10px;
      }
      .buffImg{
        width: 30px;
        margin: 0 0px 0 8px;
      }
      .symbol{
        margin-top: 20px;
        .coinInfo{
          text-align: left;
          flex: 1;
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
