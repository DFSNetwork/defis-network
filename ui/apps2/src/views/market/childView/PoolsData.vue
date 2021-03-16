<template>
  <div class="pools">
    <pools-info :lists="lists"/>
    <div class="allClaim flexb">
      <div>
        <div class="subTitle flexa">
          <span>{{ $t('mine.waitClaim') }}</span>
          <img class="tipIcon ml10" @click="showReWardTip = true" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/tips_icon_btn.svg" alt="">
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
          <img class="tipIcon" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/tips_icon_btn.svg" alt="">
        </span>
      </div>
      <div class="noData" v-loading="!firstGet" v-if="!lists.length">{{ $t('public.noData') }}</div>
      <div :class="`list ${handleGetClass(item.mid)}`" v-for="(item, index) in lists" :key="index" @click="handleToMarket(item)">
        <div class="bgShadow" v-if="rankInfoV3.length && rankInfoV3[index].isRainbow"></div>
        <div class="content">
          <div class="flexa">
            <label class="rankImg" v-if="handleGetClass(item.mid)">
              <img :src="handleGetSrc(item.mid, index)" alt="">
              <!-- <span class="rankNum">{{ index + 1}}</span> -->
            </label>
            <div class="flexb reward">
              <span class="flexa">
                <span>{{ $t('mine.earnings') }}：</span>
                <span>{{ item.showReward || '0.00000000' }} DFS </span>
              </span>
              <span class="green" v-if="item.minnerData && !Number(item.minnerData.liq)" @click.stop="handleJoin(item)">{{ $t('mine.join') }}</span>
              <span class="green" v-if="item.minnerData && Number(item.minnerData.liq)" v-loading="item.loading"
                @click.stop="handleClaim(item)">{{ $t('bonus.claim') }}</span>
            </div>
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
          <div class="flexa liq">
            <div>{{ $t('dex.pools') }}: </div>
            <div>{{ item.reserve0 | numToShot }} / {{ item.reserve1 | numToShot }}</div>
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
import { sellToken } from '@/utils/logic';
// import moment from 'moment';
import { toFixed, accSub, accAdd, accDiv, dealMinerData } from '@/utils/public';
import MinReward from '../popup/MinReward'
import MiningRules from '../popup/MiningRules'
import PoolsInfo from '../comp/PoolsInfo'
import { getV3PoolsClass, dealRewardV3 } from '@/utils/logic';

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
  computed: {
    ...mapState({
      // 箭头函数可使代码更简练
      // baseConfig: state => state.sys.baseConfig, // 基础配置 - 默认为{}
      damping: state => state.sys.damping,
      scatter: state => state.app.scatter,
      dfsPrice: state => state.sys.dfsPrice,
      rankInfoV3: state => state.sys.rankInfoV3,
      marketLists: state => state.sys.marketLists,
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
        if (!newVal.length || !this.rankInfoV3.length || this.firstGet) {
          return
        }
        const rankInfoV3 = this.rankInfoV3;
        // console.log(rankInfoV3)
        let lists = [];
        rankInfoV3.forEach(v => {
          const item = newVal.find(vv => vv.mid === v.mid)
          lists.push(item)
        });

        this.lists = lists;
        this.firstGet = true;
        this.handleGetMiners()
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
    handleGetSrc(mid, index) {
      if (index <= 21) {
        // https://cdn.jsdelivr.net/gh/defis-net/material/art/levels/1.png
        return `https://cdn.jsdelivr.net/gh/defis-net/material/art/levels/${index + 1}.png`
      } else {
        return ''
      }
    },
    handleGetClass(mid) {
      return getV3PoolsClass(mid)
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
          table: 'miners2',
          lower_bound: ` ${formName}`,
          upper_bound: ` ${formName}`,
          json: true,
        }
        EosModel.getTableRows(params, (res) => {
          // console.log(res)
          const rows = res.rows || []
          if (!rows.length) {
            this.$set(v, 'minnerData', {})
            return
          }
          const item = this.marketLists.find(vv => vv.mid === v.mid)
          const inData = {
            poolSym0: item.reserve0.split(' ')[0],
            poolSym1: item.reserve1.split(' ')[0],
            poolToken: item.liquidity_token,
            sellToken: `${rows[0].token}`
          }
          const nowMarket = sellToken(inData);
          // console.log(nowMarket)
          rows[0].liq_bal0 = `${parseFloat(nowMarket.getNum1).toFixed(item.decimal0)} ${item.symbol0}`
          rows[0].liq_bal1 = `${parseFloat(nowMarket.getNum2).toFixed(item.decimal1)} ${item.symbol1}`

          const minnerData = dealMinerData(rows[0], v)

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
          const reward = dealRewardV3(v.minnerData, v.mid)
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
      border: 1px solid #e0e0e0;
      border-radius: 20px;
      position: relative;
      .content{
        border-radius: 20px;
        padding: 20px;
        position: relative;
        background: #fff;
        z-index: 2;
        .reward{
          flex: 1;
          padding-left: 10px;
          // padding-left: 70px;
        }
      }
      .rankImg{
        // position: absolute;
        // top: 15px;
        // left: 25px;
        width: 60px;
        height: 60px;
        // top: 0px;
        // left: 25px;
        // width: 50px;
        img{
          width: 100%;
        }
        .rankNum{
          position: absolute;
          bottom: 18px;
          left: 50%;
          font-size: 21px;
          transform: translateX(-55%);
          color: #FFF;
        }
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
            border-radius: 60px;
            overflow: hidden;
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
      .liq{
        align-items: flex-start;
        line-height: 38px;
        margin-top: 15px;
        font-size: 27px;
        &>div{
          &:first-child{
            text-align: left;
            min-width: 100px;
          }
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
