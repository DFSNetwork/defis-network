<template>
  <div class="nav">
    <el-dialog
      class="dialog"
      :show-close="false"
      :visible.sync="showNav">
      <div class="navList">
        <!-- <div class="list" @click="handleTo('pools')">{{ $t('mine.pools') }}</div> -->
        <!-- <div class="list" @click="handleTo('dss')">DSS</div> -->
        <!-- <div class="list" @click="handleToOther('yfc')">{{ $t('tab.yfc') }}</div> -->
        <div class="sameClass">
          <div class="list" @click="handleShowComp('silderSet')">{{ $t('dex.TradeSet') }}</div>
          <div class="list" @click="handleShowNode">{{ $t('node.nodeSet') }}</div>
          <div class="list" @click="handleTo('createMarket')">{{ $t('dex.addMarket') }}</div>
        </div>
        <div class="sameClass">
          <!-- <div class="list" @click="handleTo('total')">{{ $t('info.info') }}</div> -->
          <div class="list" @click="handleShowComp('invi')">{{ $t('invi.invitation') }}</div>
          <div class="list" @click="handleTo('tutorial')">{{ $t('public.tutorial') }}</div>
        </div>
        <div class="sameClass">
          <div class="list" @click="handleShowComp('warn')">{{ $t('public.warnTip') }}</div>
          <div class="list">
            <span v-if="language !== 'en'" @click="handleChangeLang('en')">EN</span>
            <span v-else @click="handleChangeLang('zh-CN')">CN</span>
          </div>
        </div>
        <div class="sameClass">
          <div class="list" @click="handleToV1('v1')">V1</div>
          <div class="list" @click="handleToV1('v2')">V2</div>
        </div>
        <div class="list out" v-if="scatter.identity" @click="handleLoginOut">{{ $t('public.loginOut') }}</div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { login } from '@/utils/public';
import { EosModel } from '@/utils/eos';

export default {
  data() {
    return {
      showNav: false,
    }
  },
  computed: {
    ...mapState({
      language: state => state.app.language,
      scatter: state => state.app.scatter,
    })
  },
  methods: {
    handleChangeLang(type) {
      this.showNav = false;
      this.$i18n.locale = type;
      this.$store.dispatch('setLanguage', type);
    },
    // 登录
    handleLogin() {
      login(this, () => {
        this.showNav = false;
      })
    },
    handleShowNode() {
      this.$emit('listenShowComp', 'node')
      this.showNav = false;
    },
    handleToV1(ve) {
      if (ve === 'v1') {
        location.href = 'https://app2.defis.network/'
      } else if (ve === 'v2') {
        location.href = 'https://v2.defis.network/'
      }
    },
    handleTo(name) {
      if (this.$route.name === name)  {
        this.showNav = false;
        return;
      }
      this.$router.push({name: name})
      this.showNav = false;
    },
    handleShowComp(type) {
      this.$emit('listenShowComp', type)
      this.showNav = false;
    },
    handleLoginOut() {
      EosModel.accountLoginOut(() => {
        location.reload()
      })
    },
    handleToOther(name) {
      if (name === 'yfc') {
        location.href = 'https://yfc.one/guns'
        return;
      }
    },
    listenShowTools() {
      this.$emit('listenShowTools', false)
    },
  }
}
</script>

<style lang="scss" scoped>
.nav{
  position: relative;
  font-size: 24px;
  /deep/ .el-dialog{
    position: absolute;
    border-radius: 24px 0px 24px 24px;
    right: 40px;
    top: 120px;
    width: 240px;
    margin-top: 0 !important;
    .el-dialog__header{
      padding: 0;
    }
    .el-dialog__body{
      padding: 35px 5px 10px;
    }
  }
  .navList{
    color: #000;
    padding: 0 24px;
    .list{
      font-size: 28px;
      font-weight: 500;
      height: 70px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .login{
      padding: 8px 20px;
      box-sizing: border-box;
      border: 1px dashed #E0E0E0;
      border-radius: 8px;
    }
    .out{
      border-top: 1px dashed #e3e3e3;
      color: #C05D5D;
    }
    .sameClass{
      border-top: 1px dashed #efefef;
      &:first-child{
        border-top: 0px dashed #e3e3e3;
      }
    }
  }
}
</style>
