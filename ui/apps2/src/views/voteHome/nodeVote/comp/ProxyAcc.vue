<template>
  <div class="proxyAcc">
    <div class="flexb title">
      <div>Proxy</div>
      <div class="proxyBtn">
        <span @click="handleTo('nodePools')">{{ $t('nodePools.proxyToHis') }}</span>
      </div>
    </div>
    <div class="content flexb" v-loading="getLoading" @click="handleToBro">
      <div class="item">
        <div class="subTitle">{{ $t('bpInfo.proxyAcc') }}</div>
        <div class="dinReg">dfsbpsproxy1</div>
      </div>
      <div class="item flexb">
        <div>
          <div class="subTitle">{{ $t('bpInfo.proxyNum') }}</div>
          <div class="dinReg">{{ proxyData.eosNum || '-' }} EOS</div>
        </div>
        <i class="el-icon-arrow-right"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { EosModel } from '@/utils/eos';

export default {
  name: 'proxyAcc',
  props: {
    voteWeight: {
      type: Number,
      default: 0
    },
    getLoading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      proxyData: {}
    }
  },
  mounted() {
    this.handleGetProxy();
  },
  computed: {
    ...mapState({
      dsrPools: state => state.sys.dsrPools,
      scatter: state => state.app.scatter,
    }),
  },
  watch: {
    voteWeight() {
      this.hanldeDealNum()
    }
  },
  methods: {
    handleToBro() {
      location.href = "https://bloks.io/account/dfsbpsproxy1#votes"
    },
    handleTo(name) {
      this.$router.push({
        name
      })
    },
    // 执行代理委托
    handleProxy() {
      if (!this.scatter || !this.scatter.identity || this.loading) {
        return
      }
      this.loading = true;
      const formName = this.scatter.identity.accounts[0].name;
      const permission = this.scatter.identity.accounts[0].authority;
      const params = {
        actions: [{
          account: 'eosio',
          name: 'voteproducer',
          authorization: [{ 
            actor: formName,
            permission,
          }],
          data: {
            voter: formName,
            proxy: 'dfsbpsproxy1', // 投票的节点名称
            producers: [],
          },
        }]
      }
      EosModel.toTransaction(params, (res) => {
        this.loading = false;
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
          // 查询代理账户数据

        }, 1500);
      })
    },
    // 获取代理账户信息
    async handleGetProxy() {
      const params = {
        "code":"eosio",
        "scope":"eosio",
        "table":"voters",
        "json":true,
        "lower_bound": "dfsbpsproxy1",
        "upper_bound": "dfsbpsproxy1",
      }
      const { status, result } = await this.$api.get_table_rows(params);
      if (!status) {
        return
      }
      this.proxyData = result.rows[0]
      this.hanldeDealNum();
    },
    // 计算票数
    hanldeDealNum() {
      if (!this.voteWeight || !Number(this.proxyData.last_vote_weight)) {
        return
      }
      const num = Number(this.proxyData.last_vote_weight) * this.voteWeight;
      this.$set(this.proxyData, 'eosNum', Math.ceil(num));
      // console.log(this.proxyData)
    }
  }
}
</script>

<style lang="scss" scoped>
.proxyAcc{
  color: #333;
  font-size: 28px;
  // margin: 30px;
  border-top: 1px solid rgba(220,220,220,.3);
  border-bottom: 1px solid rgba(220,220,220,.3);
  padding: 30px;
  .title{
    font-size: 34px;
    font-weight: 500;
    color: #29D4B0;
    margin-bottom: 26px;
    .proxyBtn{
      font-size: 28px;
      padding: 10px 28px;
      background:#29D4B0;
      color: #FFF;
      border-radius: 40px;
    }
  }
  .content{
    text-align: left;
    margin-top: 15px;
    font-size: 28px;
    &>div{
      flex: 1;
    }
    .subTitle{
      color: #000;
      margin-bottom: 8px;
      font-weight: 500;
    }
  }
}
</style>
