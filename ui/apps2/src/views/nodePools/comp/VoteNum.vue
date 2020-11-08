<template>
  <div class="voteNum">
    <div class="flexb">
      <div>
        <span>EOS票数：{{ accVoteData.eosNum }}</span>
      </div>
      <span v-if="!accVoteData.isfarmer" class="proxy btn"
        v-loading="loadingProxy"
        @click="handleProxy">投票给TA</span>
      <span class="flexa" v-else>
        <span class="btn" @click="showManage = !showManage">管理票数</span>
      </span>
    </div>

    <el-dialog
      class="myDialog"
      :show-close="false"
      :visible.sync="showManage">
      <ManageVote v-if="showManage" :accVoteData="accVoteData"
        @listenUpdata="listenUpdata"/>
      <!-- <Remove /> -->
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { EosModel } from '@/utils/eos';

import { getClaimActions } from '../js/nodePools';

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
    listenUpdata() {
      setTimeout(() => {
        // 查询代理账户数据
        this.$emit('listenUpdata', 'acc')
      }, 1500);
    },
    // 执行代理委托
    handleProxy() {
      if (!this.scatter || !this.scatter.identity || this.loadingProxy) {
        return
      }
      this.loadingProxy = true;
      const params = getClaimActions(this.accVoteData)
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
        this.listenUpdata();
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.voteNum{
  text-align: left;
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
  .weight{
    .updata{
      font-size: 24px;
      margin-left: 10px;
      color: #29D4B0;
    }
    .yellow{
      color: #fec50a;
    }
    .red{
      color: #e9574f;
    }
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
