<template>
  <div class="proxyAcc">
    <div class="flexb title">
      <div>Proxy</div>
      <div class="proxyBtn">
        <span @click="handleProxy">投票给TA</span>
      </div>
    </div>
    <div class="content flexb" v-loading="getLoading" @click="handleToBro">
      <div class="item">
        <div class="subTitle">代理账户</div>
        <div>dfsbpsproxy1</div>
      </div>
      <div class="item flexb">
        <div>
          <div class="subTitle">代理票数</div>
          <div>{{ proxyData.eosNum || '-' }} EOS</div>
        </div>
        <i class="el-icon-arrow-right"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { EosModel } from '@/utils/eos';
import { get_table_rows } from '@/utils/api';

export default {
  name: 'proxyAcc',
  props: {
    voteWeight: {
      type: Number,
      default: 0
    },
    getLoading: {
      type: Boolean,
      default: true
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
      const { status, result } = await get_table_rows(params);
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
      const num = Number(this.proxyData.last_vote_weight) / this.voteWeight;
      this.$set(this.proxyData, 'eosNum', Math.ceil(num));
      console.log(this.proxyData)
    }
  }
}
</script>

<style lang="scss" scoped>
.proxyAcc{
  color: #333;
  font-size: 28px;
  margin: 30px;
  box-shadow: 0 0.26667rem 0.53333rem 0 hsla(0,0%,86.3%,.5);
  border-radius: 8px;
  padding: 30px;
  .title{
    font-size: 40px;
    font-weight: 500;
    color: rgba(2,198,152,1);
    .proxyBtn{
      font-size: 24px;
      padding: 8px 21px;
      background:rgba(7,215,155,1);
      color: #FFF;
      border-radius: 40px;
    }
  }
  .content{
    text-align: left;
    margin-top: 15px;
    &>div{
      flex: 1;
    }
  }
}
</style>
