<template>
  <div class="voteNum">
    <div class="flexb">
      <div>
        <span>{{ $t('nodePools.voteNum', {token: 'EOS'}) }}：{{ accVoteData.eosNum }}</span>
      </div>
      <span v-if="!accVoteData.isDfsProxy" class="proxy btn"
        v-loading="loadingProxy"
        @click="handleProxy">{{ $t('nodePools.proxyToHis') }}</span>
      <span class="btn" v-loading="loadingJoin"
        v-else-if="accVoteData.showJoinBtn" @click="handleJoin">加入矿池</span>
      <span class="flexa">
        <span class="btn" @click="showManage = !showManage">{{ $t('nodePools.manage') }}</span>
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

import { getJoinActions, getVoteToProxy } from '../js/nodePools';

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
      loadingJoin: false,
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
    handleJoin() {
      if (!this.scatter || !this.scatter.identity || this.loadingProxy) {
        return
      }
      this.loadingJoin = true;
      const params = getJoinActions(this.accVoteData)
      EosModel.toTransaction(params, (res) => {
        this.loadingJoin = false;
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
    listenUpdata() {
      this.showManage = false;
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
      const params = getVoteToProxy(this.accVoteData)
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
  background: #FFF;
  border: 8px;
  box-shadow: 0px 4px 8px 4px rgba(220,220,220,0.5);
  .btn{
    background: #29D4B0;
    border-radius: 40px;
    padding: 10px 26px;
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
