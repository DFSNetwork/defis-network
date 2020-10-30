<template>
  <div class="accVoteInfo flexb">
    <div>
      <div class="votes flexb">
        <span class="flexa">
          <span>您的DFS票数：{{ vote_power }}</span>
        </span>
      </div>
    </div>
    <div>
      <span class="btn" @click="handleToDss">{{ $t('market.manage') }}</span>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { EosModel } from '@/utils/eos';

export default {
  name: 'accInfo',
  data() {
    return {
      isVoted: true,
      swapGet: false,
      dssGet: false,
      dssData: {},
      swapData: {},
    }
  },
  computed: {
    ...mapState({
      scatter: state => state.app.scatter,
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
.accVoteInfo{
  font-size: 26px;
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
</style>