<template>
  <div class="nav">
    <el-dialog
      class="dialog"
      width="126px"
      top="44px"
      :show-close="false"
      :visible.sync="showNav">
      <div class="navList">
        <div class="list" @click="handleToV2">V2</div>
        <div class="list" @click="handleToTutorial">{{ $t('public.tutorial') }}</div>
        <div class="list" @click="handleShowBonus">{{ $t('bonus.stake') }}</div>
        <div class="list" v-if="false" @click="handleToPoolRules">挖矿规则</div>
        <div class="list" v-if="false" @click="handleToPoolRules">审计</div>
        <div class="list">
          <span v-if="language !== 'en'" @click="handleChangeLang('en')">EN</span>
          <span v-else @click="handleChangeLang('zh-CN')">CN</span>
        </div>
        <!-- <div class="list"><a class="github" href="https://github.com/defis-network" target="_blank">Github</a></div> -->
        <div class="list" v-if="scatter.identity" @click="handleLoginOut">{{ $t('public.loginOut') }}</div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      showNav: false,
    }
  },
  computed: {
    ...mapState({
      scatter: state => state.app.scatter,
      language: state => state.app.language,
    })
  },
  methods: {
    handleToV2() {
      location.href = 'https://app.defis.network/'
    },
    handleToPoolRules() {
      this.showNav = false;
      this.$router.push({
        name: 'tutorial'
      })
    },
    handleChangeLang(type) {
      this.showNav = false;
      this.$i18n.locale = type;
      this.$store.dispatch('setLanguage', type);
    },
    handleToTutorial() {
      this.showNav = false;
      this.$router.push({
        name: 'tutorial'
      })
    },
    handleShowBonus() {
      this.$emit('listenShowBonus', true)
    },
    handleLoginOut() {
      this.$emit('listenLoginOut', true);
    }
  }
}
</script>

<style lang="scss" scoped>
.nav{
  position: relative;
  /deep/ .el-dialog{
    position: absolute;
    border-radius: 8px;
    right: 8px;
    .el-dialog__header{
      padding: 0;
    }
    .el-dialog__body{
      padding: 20px 5px 10px;
    }
  }
  .navList{
    color: #070707;
    .list{
      font-size: 14px;
      font-weight: 500;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      .github{
        color: #070707;
        text-decoration: none;
      }
    }
  }
}
</style>
