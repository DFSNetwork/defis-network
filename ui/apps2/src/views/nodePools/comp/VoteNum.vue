<template>
  <div class="voteNum flexb">
    <span>您的EOS票数: {{ accVoteData.isDfsProxy ? accVoteData.eosNum || 0 : 0 }}</span>
    <span v-if="!accVoteData.eosNum" class="proxy btn"
      v-loading="loadingProxy"
      @click="handleProxy">投票给TA</span>
    <span class="btn" @click="showManage = !showManage">管理票数</span>

    <el-dialog
      class="myDialog"
      :show-close="false"
      :visible.sync="showManage">
      <ManageVote />
      <!-- <Remove /> -->
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { EosModel } from '@/utils/eos';

import ManageVote from '../dialog/ManageVote'
// import Remove from '../dialog/Remove'

export default {
  name: 'accVoteNum',
  components: {
    ManageVote,
    // Remove,
  },
  props: {
    accVoteData: {
      type: Object,
      default: function avd() {
        return {}
      }
    }
  },
  data() {
    return {
      loadingProxy: false,
      showManage: false,
    }
  },
  computed: {
    ...mapState({
      scatter: state => state.app.scatter,
    }),
  },
  methods: {
    // 执行代理委托
    handleProxy() {
      if (!this.scatter || !this.scatter.identity || this.loadingProxy) {
        return
      }
      this.loadingProxy = true;
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
        this.loadingProxy = false;
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
          this.$emit('listenUpdata', 'acc')
        }, 1500);
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.voteNum{
  margin: 30px 32px;
  padding: 20px 26px;
  font-size: 27px;
  border: 8px;
  box-shadow: 0px 4px 8px 4px rgba(220,220,220,0.5);
  .btn{
    background: #29D4B0;
    border-radius: 40px;
    padding: 10px 36px;
    color: #FFF;
  }
}
.myDialog{
  // animation: none;
  /deep/ .el-dialog{
    width: 700px;
    border-radius:12px;
    .el-dialog__body,
    .el-dialog__header{
      padding: 0;
    }
  }
}
</style>
