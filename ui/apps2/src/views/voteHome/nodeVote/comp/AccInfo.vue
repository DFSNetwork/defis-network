<template>
  <div class="accVoteInfo flexb">
    <div>
      <div class="votes flexb">
        <span class="flexa">
          <span>{{ $t('bpInfo.accDfsNum') }}：<span class="num dinBold">{{ vote_power }}</span></span>
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
// import { EosModel } from '@/utils/eos';

export default {
  name: 'accInfo',
  props: {
    voteWeight: {
      type: Number,
      default: 0.000001
    }
  },
  data() {
    return {
      vote_power: 0,
      isVoted: true,
      swapGet: false,
      dssGet: false,
      dssData: {},
      swapData: {},
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
    }),
  },
  watch: {
    scatter: {
      handler: function listen(newVal) {
        if (newVal.identity) {
          this.handleGetAccVoteNum()
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
    async handleGetAccVoteNum() {
      const name = this.scatter.identity.accounts[0].name;
      const params = {
        "code":"dfspoolsvote",
        "scope": "dfspoolsvote",
        "table":"voters",
        "lower_bound": ` ${name}`,
        "upper_bound": ` ${name}`,
        "json":true,
        "limit": 1000,
      }
      const {status, result} = await this.$api.get_table_rows(params);
      this.swapGet = true;
      if (!status) {
        return
      }
      const rows = result.rows || [];
      if (!rows.length) {
        // this.showTip = true;
        return
      }
      this.vote_power = parseInt((rows[0].vote_power || 0) / 10000);
    },
  }
}
</script>

<style lang="scss" scoped>
.accVoteInfo{
  font-size: 28px;
  text-align: left;
  color: #333;
  padding: 38px 30px;
  border-top: 1px solid $color-border;
  .btn{
    padding: 10px 32px;
    background: #29D4B0;
    color: #FFF;
    border-radius: 30px;
    margin-left: 10px;
  }
  .num{
    font-size: 32px;
  }
  .refresh{
    margin-left: 8px;
    width: 30px;
    // height: 30px;
    display: inline-block;
    border-radius: 30px;
  }
}
</style>