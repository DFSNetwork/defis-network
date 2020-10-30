<template>
  <div class="proxyAcc">
    <div class="flexb title">
      <div>Proxy</div>
      <div class="proxyBtn">
        <span @click="handleProxy">投票给TA</span>
      </div>
    </div>
    <div class="content flexb">
      <div class="item">
        <div class="subTitle">代理账户</div>
        <div>dfsbpsproxy1</div>
      </div>
      <div class="item">
        <div class="subTitle">代理票数</div>
        <div>1000.0000 EOS</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { EosModel } from '@/utils/eos';
// import { get_table_row, get_producers } from '@/utils/api';

export default {
  name: 'proxyAcc',
  computed: {
    ...mapState({
      dsrPools: state => state.sys.dsrPools,
      scatter: state => state.app.scatter,
    }),
  },
  mounted() {
    this.handleGetProxy()
  },
  methods: {
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
      // const res = await get_producers()
      // console.log(res)
      // https://www.api.bloks.io/producers?pageNum=1&perPage=100
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
