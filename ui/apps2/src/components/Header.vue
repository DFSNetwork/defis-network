<template>
  <div class="header flexb">
    <div @click="handleToIndex"><img class="logoOld" src="@/assets/img/dex/logo.svg"></div>
    <!-- <div @click="handleToIndex" class="flexa logoMain">
      <div class="logoDiv">
        <img class="logo" src="/static/faviconV3.png">
      </div>
      <div class="name">
        <div>DeFis</div>
        <div>Network</div>
      </div>
    </div> -->
    <div class="tools flexb">
      <!-- <label v-if="!scatter.identity" class="login" @click="handleLogin">{{ $t('public.login') }}</label>
      <label v-else class="account flexa">
        <span class="flexc iconSpan"><img width="100%" src="@/assets/img/dex/user_icon.svg" alt=""></span>
        <span>{{ scatter.identity.accounts[0].name }}</span>
      </label> -->
      <span class="create flexc" @click="handleToVote">{{ $t('vote.vote') }}</span>
      <!-- <span class="create flexc" @click="handleTo('farms')">{{ $t('farms.farms') }}</span> -->
      <!-- <span class="create flexc" @click="handleToProject('pddex')">Pddex</span>
      <span class="create flexc" @click="handleToProject('pdd')">养猪</span> -->
      <span class="create flexc" @click="handleTo('pools')">{{ $t('mine.pools') }}</span>
      <span class="create flexc" @click="showDss = true">
        <span>DSS</span>
        <img class="downdraw" src="@/assets/img/dialog/down.svg" alt="">
      </span>
      <span class="create flexc" @click="showApps = true">
        <span>Apps</span>
        <img class="downdraw" src="@/assets/img/dialog/down.svg" alt="">
      </span>
      <span class="flexc" @click="handleShowNav"><img class="svgIcon" src="@/assets/img/dex/menu_icon.svg" alt=""></span>
    </div>

    <el-dialog class="mydialog showApps"
      :modal="false"
      :show-close="false"
      :visible.sync="showApps">
      <div @click="showApps = false">
        <div class="proClass">
          <div class="create flexc" @click="handleToProject('pddex')">Pddex</div>
          <div class="create flexc" @click="handleToProject('yfcGuns')">YFC机枪池</div>
        </div>
        <div class="proClass">
          <div class="create flexc" @click="handleTo('farms')">农活大厅</div>
          <div class="create flexc" @click="handleTo('total')">Top20{{ $t('info.info') }}</div>
        </div>
        <div class="proClass">
          <div class="create flexc" @click="handleToProject('yfc')">YFC钓鱼</div>
          <div class="create flexc" @click="handleToProject('dbc')">DBC偷菜</div>
          <div class="create flexc" @click="handleToProject('pdd')">PDD养猪</div>
          <div class="create flexc" @click="handleToProject('loop')">LOOP葫芦</div>
        </div>
      </div>
    </el-dialog>
    <el-dialog class="mydialog showDss"
      :modal="false"
      :show-close="false"
      :visible.sync="showDss">
      <div @click="showDss = false">
        <div class="create flexc" @click="handleTo('dss')">DFS DSS</div>
        <div class="create flexc" @click="handleToProject('yfcDss')">YFC DSS</div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { login } from '@/utils/public';
export default {
  name: 'headerTools',
  data() {
    return {
      showApps: false,
      showDss: false,
    }
  },
  computed: {
    ...mapState({
      // 箭头函数可使代码更简练
      scatter: state => state.app.scatter,
    }),
  },
  methods: {
    // 登录
    handleLogin() {
      login(this, () => {})
    },
    handleToIndex() {
      if (this.$route.name === 'index') {
        return
      }
      this.$router.push({name: 'index'})
    },
    handleShowNav() {
      this.$emit('listenShowNav', false)
    },
    listenShowTools() {
      this.$emit('listenShowTools', false)
    },
    handleToCreate() {
      this.$router.push({name: 'createMarket'})
    },
    handleTo(name) {
      if (this.$route.name === name)  {
        return;
      }
      this.$router.push({name: name})
    },
    handleToVote() {
      if (this.$route.name === 'vote') {
        return
      }
      this.$router.push({name: 'vote'})
    },
    handleToProject(name) {
      if (name === 'pddex') {
        location.href = 'https://pddex.defis.network/'
        return
      }
      if (name === 'pdd') {
        location.href = 'https://pddfarm.defis.network/'
        return;
      }
      if (name === 'yfc') {
        location.href = 'https://yfc.one'
        return
      }
      if (name === 'yfcGuns') {
        location.href = 'https://yfc.one/guns'
        return
      }
      if (name === 'yfcDss') {
        location.href = 'https://yfc.one/vault'
        return
      }
      if (name === 'dbc') {
        location.href = 'https://dbc.yfc.one'
        return
      }
      if (name === 'loop') {
        location.href = 'https://loop.ech.one/index.html'
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.header{
  background: $color-bgcolor;
  height: 120px;
  padding: 0 40px;
  font-size: 28px;
  color: $color-tip;
  margin-bottom: 5px;
  .logoOld{
    width: 196px;
  }
  .logoMain{
    text-align: left;
    color: #000;
    .logoDiv{
      position: relative;
      height: 80px;
      width: 80px;
      margin-right: 10px;
      .logo{
        position: absolute;
        height: 80px;
        width: 80px;
      }
    }
    .name{
      &>div:first-child{
        font-size: 30px;
        font-weight: 500;;
      }
      &>div:last-child{
        font-size: 25px;
        // font-weight: 300;
      }
    }
  }
  img{
    display: block;
  }
  .tools{
    .login{
      padding-right: 10px;
      color: $color-main;
      font-weight: 500;
    }
    .account{
      padding-right: 10px;
      color: #000;
      .iconSpan{
        width: 26px;
        margin-right: 12px;
      }
    }
    &>span{
      margin-left: 10px;
      height: 80px;
      min-width: 80px;
      background: $color-bgcolor;
      border-radius: 30px;
      box-shadow: 0px 20px 40px 0px rgba(220,220,220,0.5);
    }
    .create{
      box-sizing: border-box;
      box-shadow: none;
      padding: 10px;
      color: #000;
      margin-left: 00px;
      .downdraw{
        width: 12px;
        margin-left: 8px;
      }
    }
    .svgIcon{
      width: 30px;
    }
  }
}
.mydialog{
  /deep/ .el-dialog{
    border-radius: 10px;
    width: 150px;
    margin-top: 90px !important;
    box-shadow: 0px 0px 15px 0px rgba(230,230,230,0.6);
    border: 1px solid rgba(230,230,230,0.6);
    .el-dialog__header{
      padding: 0;
    }
    .el-dialog__body{
      font-size: 26px;
      padding: 0 15px;
    }
  }
  &.showApps{
    /deep/ .el-dialog{
      width: 200px;
      margin-right: 100px;
    }
  }
  &.showDss{
    /deep/ .el-dialog{
      margin-right: 210px;
    }
  }
  .proClass{
    border-top: 1px dashed #e3e3e3;
    &:first-child{
      border-top: 0px dashed #e3e3e3;
    }
  }
  .create{
    height: 75px;
    color: #000;
  }
}
</style>