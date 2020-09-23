<template>
  <div class="lists" v-loading="loading">
    <div class="projectName flexb">
      <span>DMD钻石</span>
      <span class="claim green" v-loading="claiming || allClaiming" @click.stop="handleClaim">领取</span>
    </div>
    <div class="reward">
      <span>收益：</span>
      <span>{{ allClaim }} DMD</span>
    </div>
  </div>
</template>

<script>
// import moment from 'moment';
import { mapState } from 'vuex';
import { toFixed, accAdd } from '@/utils/public';
import { EosModel } from '@/utils/eos';

export default {
  name: 'dmd',
  props: {
    marketLists: {
      type: Array,
      default: function mlt() {
        return []
      }
    },
    allClaiming: {
      type: Boolean,
      default: false,
    }
  },
  computed: {
    ...mapState({
      scatter: state => state.app.scatter,
      dmdMineConfig: state => state.config.dmdMineConfig,
    }),
    allClaim() {
      let all = '0.0000000000';
      this.mineList.forEach(v => {
        all = accAdd(all, parseFloat(v.unclaimed))
      })
      return toFixed(all, 8)
    },
  },
  data() {
    return {
      loading: true,
      get: false,
      mineList: [],
      timer: null,
      claiming: false,
    }
  },
  watch: {
    scatter: {
      handler: function listen(newVal) {
        if (newVal.identity || !this.get) {
          this.handleGetUnclaim();
        }
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    handleClaim() {
      if (this.allClaiming || this.claiming) {
        return
      }
      const actions = this.handleGetActions()
      if (!actions.length) {
        return
      }
      this.claiming = true;
      const params = {
        actions,
      }
      EosModel.toTransaction(params, (res) => {
        this.claiming = false;
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
        setTimeout(() => {
          this.handleGetUnclaim()
        }, 1000);
      })
    },
    handleGetActions() {
      const actions = [];
      const formName = this.scatter.identity.accounts[0].name;
      const permission = this.scatter.identity.accounts[0].authority;
      this.mineList.forEach(v => {
        const action = {
          account: v.poolContract,
          name: 'claim',
          authorization: [{
            actor: formName, // 转账者
            permission,
          }],
          data: {
            from: formName,
          }
        }
        actions.push(action)
      })
      return actions;
    },
    handleGetUnclaim() {
      clearInterval(this.timer)
      this.timer = setInterval(() => {
        this.handleGetUnclaim()
      }, 5000);
      const formName = this.scatter.identity.accounts[0].name;
      this.get = true;
      this.dmdMineConfig.forEach(v => {
        const params = {
          code: "eosdmdpool1a",
          json: true,
          limit: 1,
          lower_bound: ` ${formName}`,
          upper_bound: ` ${formName}`,
          scope: v.poolContract,
          table: "userstake",
        }
        EosModel.getTableRows(params, (res) => {
          this.loading = false;
          const rows = res.rows || []
          if (!rows.length) {
            return
          }
          rows[0] = Object.assign({}, rows[0], v);
          const index = this.mineList.findIndex(vv => vv.mid === v.mid)
          if (index !== -1) {
            this.mineList.splice(index, 1, rows[0])
          } else {
            this.mineList.push(rows[0])
          }
        })
      });
    }
  },
}
</script>

<style lang="scss" scoped>
.lists{
  text-align: left;
  border-radius: 15px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0px 10px 40px 0px rgba(220,220,220,0.5);
  .projectName{
    font-size: 30px;
    font-weight: 500;
    margin-bottom: 10px;
    .claim{
      font-size: 27px;
      font-weight: 400;
    }
  }
}
.green{
  color: #07D79B;
}
</style>
