<template>
  <div class="timeRank">
    <div class="lists flexc">
      <div class="coinDiv flexc">
        <img class="coin" src="https://apps.defis.network/static/coin/xpettimecore-time.png?v=2" alt="">
      </div>
      <div class="f1">
        <div class="projectName flexb">
          <span>TIME/EOS抢座位</span>
          <span class="claim green" @click.stop="handleClaim">一键抢占</span>
        </div>
        <div class="reward">
          <span>当前排名：{{rank}}</span>
          <span></span>
        </div>
        <div class="about">
          <!-- <span>{{ userMine['530'] }}</span> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { EosModel } from '@/utils/eos';
export default {
  name: 'toolsTimeRank',
  data() {
    return {
      rank: 0,
      userMine: {},
      rankList: [],
    }
  },
  mounted() {
    this.handleGetTimePoolMiners()
  },
  watch: {
    scatter: {
      handler: function listen(newVal) {
        if (newVal.identity) {
          this.handleGetUser();
          this.handleGetRank();
        }
      },
      deep: true,
      immediate: true,
    },
  },
  computed: {
    ...mapState({
      scatter: state => state.app.scatter,
      timeList: state => state.config.timeList,
    }),
  },
  methods: {
    handleGetRank() {
      if (!this.rankList.length || !this.scatter.identity.accounts[0].name) {
        return
      }
      const rankIndex = this.rankList.findIndex(v => v.miner === this.scatter.identity.accounts[0].name);
      if (rankIndex !== -1) {
        this.rank = rankIndex + 1;
      } else {
        this.rank = '100+'
      }
    },
    // 获取排名
    handleGetTimePoolMiners() {
      const params = {
        "json":true,
        "code":"loottimemine",
        "scope": 530,
        "table":"miners",
        "index_position":"2",
        "key_type":"i64",
        "limit":100,
        "reverse":true,
        "show_payer":false
      }
      EosModel.getTableRows(params, (res) => {
        const rows = res.rows || []
        if (!rows.length) {
          return
        }
        this.rankList = rows;
        console.log(rows)
        this.handleGetRank();
      })
    },
    // 获取用户当前做市数据
    handleGetUser() {
      const name = this.scatter.identity.accounts[0].name;
      const params = {
        "json":true,
        "code":"loottimemine",
        "scope": 530,
        "table":"miners",
        "lower_bound": ` ${name}`,
        "upper_bound": ` ${name}`,
        "limit":1,
        "reverse":true,
        "show_payer":false
      }
      EosModel.getTableRows(params, (res) => {
        const rows = res.rows || []
        if (!rows.length) {
          return
        }
        this.userMine[`530`] = rows[0];
        console.log(rows[0])
      })
    }
  },
}
</script>

<style lang="scss" scoped>
@import '../comp/comp.scss';
</style>
