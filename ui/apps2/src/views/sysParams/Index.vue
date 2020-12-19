<template>
  <div class="voteMain">
    <div class="banner">
      <img class="bgImg" src="https://cdn.jsdelivr.net/gh/defis-net/material/banner/bpVote.png" alt="">
    </div>
    <div class="mainTitle flexb">
      <span class="act">{{ $t('vote.vote') }}</span>
    </div>
    <div class="info flexb" v-loading="!swapGet || !dssGet">
      <div>
        <div class="votes flexb">
          <span class="flexa">
            <span>{{ $t('vote.myVote') }}：<span class="dinBold">{{ vote_power }}</span></span>
          </span>
        </div>
      </div>
      <div>
        <span class="btn" @click="handleToDss">{{ $t('market.manage') }}</span>
      </div>
    </div>
    <QusForParams />
  </div>
</template>

<script>
import { EosModel } from '@/utils/eos';
import { mapState } from 'vuex';
import QusForParams from './comp/QusForParams'

export default {
  name: 'sysParams',
  components: {
    QusForParams,
  },
  data() {
    return {
      showRules: false,
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
      scatter: state => state.app.scatter,
      marketLists: state => state.sys.marketLists,
    }),
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
  methods: {
    handleToDss() {
      this.$router.push({
        name: 'dss'
      })
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
  }
}
</script>

<style lang="scss" scoped>
.voteMain{
  font-size: 27px;
  .mainTitle{
    font-size: 32px;
    text-align: left;
    margin: 30px 0;
    padding: 0 0 0 40px;
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
        background:#02C698;
        border-radius:4px;
        left: 0%;
        top: 50%;
        transform: translateY(-45%);
      }
    }
  }
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
  border-bottom: 20px solid #f6f6f6;
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
</style>
