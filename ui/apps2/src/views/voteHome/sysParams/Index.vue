<template>
  <div class="voteMain">
    <!-- <div class="banner">
      <img class="bgImg" src="https://cdn.jsdelivr.net/gh/defis-net/material/banner/bpVote.png" alt="">
    </div> -->
    <div class="accVoteNum_p">
      <div class="mainTitle flexb">
        <span class="act">{{ $t('vote.vote') }}</span>
      </div>
      <div class="info flexb" v-loading="!dssGet">
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
      vote_power: 0,
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
  },
  watch: {
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
        this.dssGet = true;
        // console.log('get')
        const rows = res.rows || [];
        if (!rows.length) {
          return
        }
        this.myVoteList = rows[0].last_vote;
        this.vote_power = parseInt(rows[0].vote_power / 10000);
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
        background:$color-main;
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
