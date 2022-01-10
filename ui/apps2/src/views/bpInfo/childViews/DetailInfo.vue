<template>
  <div class="detailInfo">
    <div class="title flexc">{{ $t('bpInfo.bpInfo') }}</div>
    <BpInfo :isEditor="isEditor" :editors="editors"/>
    <Records :isEditor="isEditor" />
    <ScoreLists />

    <div class="nullDiv"></div>
    <div class="btnDiv">
      <div class="btn flexc" @click="showAddScore = true">{{ $t('bpInfo.toRpy') }}</div>
    </div>
    <el-dialog
      class="mydialog"
      :show-close="false"
      :visible.sync="showAddScore">
      <Score v-if="showAddScore" @listenClose="handleClose"/>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import BpInfo from './comp/BpInfo';
import Records from './comp/Records';
import ScoreLists from './comp/ScoreLists';
import Score from './dialog/Score';

export default {
  name: 'detailInfo',
  components: {
    BpInfo,
    Records,
    ScoreLists,
    Score,
  },
  data() {
    return {
      showAddScore: false,
      editors: [],
      bpname: '',
    }
  },
  computed: {
    ...mapState({
      scatter: state => state.app.scatter,
    }),
    isEditor() {
      if (!this.scatter || !this.scatter.identity) {
        return false;
      }
      const formName = this.scatter.identity.accounts[0].name;
      const has = this.editors.find(v => v.owner === formName)
      if (has) {
        return true
      }
      return false
    }
  },
  watch: {
    scatter: {
      handler: function st(newVal) {
        if (newVal.identity) {
          // 用户数据获取
          this.handleGetBal()
        }
      },
    },
  },
  mounted() {
    this.bpname = this.$route.params.bpname || 'dfs.bp';
    // this.handleGetBpInf()
    this.handleGeteditors()
  },
  methods: {
    handleClose(type) {
      this.showAddScore = false;
      if (type) {
        // 执行操作
      }
    },
    async handleGetBpInf() {
      const params = {
        "code":"dfscommunity",
        "scope":"dfscommunity",
        "table":"questions",
        "json":true,
      }
      const {status, result} = await this.$api.get_table_rows(params)
      if (!status) {
        return
      }
      console.log(result)
    },
    async handleGeteditors() {
      const params = {
        "code":"dfscommunity",
        "scope": this.bpname,
        "table":"editors",
        "json":true,
      }
      const {status, result} = await this.$api.get_table_rows(params)
      if (!status) {
        return
      }
      this.editors = result.rows || [];
      // console.log(result)
    }
  }
}
</script>

<style lang="scss" scoped>
/*iphone Xs Max*/
@media only screen and (device-width: 414px) and (device-height: 896px) {
  .btnDiv{
    padding-bottom: 30px !important;
  }
}
/*iphoneX、iphoneXs*/
@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
  .btnDiv{
    padding-bottom: 30px !important;
  }
}
.detailInfo{
  .title{
    font-size: 36px;
    font-weight: 500;
    height: 90px;
    border-bottom: 1px solid rgba(220,220,220,.3);
  }
  .nullDiv{
    height: 150px;
    width: 100%;
  }
  .btnDiv{
    height: 150px;
    position: fixed;
    max-width: 750px;
    bottom: 0px;
    width: 100%;
    box-sizing: border-box;
    padding: 0 32px;
    background: #FFF;
    .btn{
      width: 100%;
      height: 90px;
      background: #29D4B0;
      color: #fff;
      font-size: 32px;
      font-weight: 500;
      border-radius: 45px;
    }
  }
}
</style>