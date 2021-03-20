<template>
  <div class="header flexb">
    <div class="tools flexb">
      <div class="logoDiv" :class="{'ani': ani}" @click="handleToIndex" @dblclick="handleDbClick">
        <img class="logo" src="https://cdn.jsdelivr.net/gh/defis-net/material2/coin/minedfstoken-dfs.png">
      </div>
      <span class="create flexc" @click="showVote = true">
        <span>{{ $t('vote.vote') }}</span>
        <img class="downdraw" src="https://cdn.jsdelivr.net/gh/defis-net/material/svg/down.svg" alt="">
      </span>
      <span class="create flexc" @click="showPools = true">
        <span>{{ $t('mine.pools') }}</span>
        <img class="downdraw" src="https://cdn.jsdelivr.net/gh/defis-net/material/svg/down.svg" alt="">
      </span>
      <span class="create flexc" @click="showDss = true">
        <span>DSS</span>
        <img class="downdraw" src="https://cdn.jsdelivr.net/gh/defis-net/material/svg/down.svg" alt="">
      </span>
      <span class="create flexc" @click="showApps = true">
        <span>APPS</span>
        <img class="downdraw" src="https://cdn.jsdelivr.net/gh/defis-net/material/svg/down.svg" alt="">
      </span>
      <span class="create flexc more" @click="handleShowNav"><img class="svgIcon" src="https://cdn.jsdelivr.net/gh/defis-net/material/dex/menu_icon.svg" alt=""></span>
    </div>

    <el-dialog class="mydialog showApps"
      :modal="false"
      :show-close="false"
      :visible.sync="showApps">
      <div @click="showApps = false">
        <!-- <div class="proClass">
          <div class="create flexc" @click="handleTo('fundation')">
            <span>{{ $t('fundation.nav') }}</span>
          </div>
          <div class="create flexc" @click="handleToProject('pddex')">PDDEX</div>
          <div class="create flexc" @click="handleToProject('yfcGuns')">YFC {{ $t('farms.yfcGun') }}</div>
        </div> -->
        <div class="proClass">
          <div class="create flexc" @click="handleTo('farms')">{{ $t('farms.Lobby') }}</div>
          <div class="create flexc" @click="handleTo('total')">TOP21 {{ $t('info.info') }}</div>
          <div class="create flexc" @click="handleTo('coinViews', {mid: 39})">{{ $t('farms.coinView') }}</div>
        </div>
        <div class="proClass">
          <!-- <div class="create flexc" @click="handleToProject('pdd')">PDD {{ $t('farms.pdd') }}</div> -->
          <!-- <div class="create flexc" @click="handleToProject('time')">TIME {{ $t('farms.time') }}</div> -->
          <div class="create flexc" @click="handleToProject('eosdefi')">EOS DeFis</div>
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
        <div class="create flexc" @click="handleTo('dssForTag')">
          <span>TAG DSS</span>
          <span class="newPro">NEW</span>
        </div>
      </div>
    </el-dialog>

    <el-dialog class="mydialog showPools"
      :modal="false"
      :show-close="false"
      :visible.sync="showPools">
      <div @click="showPools = false">
        <div class="create flexc" @click="handleTo('pools')">{{ $t('sys.coinPool', {coin: 'DFS'}) }}</div>
        <div class="create flexc" @click="handleTo('nodePools')">{{ $t('sys.coinPool', {coin: 'TAG'}) }}</div>
        <div class="create flexc" @click="handleToProject('usdx')">{{ $t('sys.coinPool', {coin: 'USDX'}) }}</div>
      </div>
    </el-dialog>

    <el-dialog class="mydialog showVote"
      :modal="false"
      :show-close="false"
      :visible.sync="showVote">
      <div @click="showVote = false">
        <div class="create flexc" @click="handleTo('vote')">{{ $t('sys.coinPool', {coin: 'DFS'}) }}</div>
        <div class="create flexc" @click="handleTo('voteForTag')">
          <span>{{ $t('sys.coinPool', {coin: 'TAG'}) }}</span>
          <!-- <span class="newPro">NEW</span> -->
        </div>
        <div class="create flexc" @click="handleTo('sysParams')">
          <span>{{ $t('sys.vote2') }}</span>
          <!-- <span class="newPro">NEW</span> -->
        </div>
        <div class="create flexc" @click="handleTo('nodeVote')">{{ $t('sys.vote1') }}</div>
        <div class="create flexc" @click="handleToProject('usdxVote')">
          <span>{{ $t('sys.coinSystem', {coin: 'USDX'}) }}</span>
          <span class="newPro">NEW</span>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      class="showEggCss"
      :show-close="false"
      :visible.sync="showEgg">
      <Msg v-if="showEgg"/>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { login } from '@/utils/public';
import Msg from '@/views/konami/dialog/Msg'
export default {
  name: 'headerTools',
  components: {
    Msg
  },
  data() {
    return {
      showVote: false,
      showApps: false,
      showDss: false,
      showPools: false,
      ani: false,
      aniTimer: null,
      showEgg: false,
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
      clearTimeout(this.aniTimer)
      this.ani = true;
      this.aniTimer = setTimeout(() => {
        this.ani = false;
      }, 200);
      if (this.$route.name === 'home') {
        return
      }
      this.$router.push({name: 'home'})
    },
    handleDbClick() {
      this.showEgg = true;
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
    handleTo(name, params) {
      if (this.$route.name === name)  {
        return;
      }
      this.$router.push({
        name: name,
        params,
      })
    },
    handleToVote() {
      if (this.$route.name === 'vote') {
        return
      }
      this.$router.push({name: 'vote'})
    },
    handleToProject(name) {
      if (name === 'pddex') {
        location.href = 'https://pddex.gitee.io/'
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
        // location.href = 'https://yfcone.gitee.io'
        location.href = 'https://yfc.one/guns'
        return
      }
      if (name === 'yfcDss') {
        // location.href = 'https://yfcone.gitee.io'
        location.href = 'https://yfc.one/vault'
        return
      }
      if (name === 'dbc') {
        location.href = 'https://dbc.yfc.one'
        return
      }
      if (name === 'eosdefi') {
        location.href = 'http://eos-defi.sgxiang.com/'
        return
      }
      if (name === 'usdx') {
        location.href = 'https://usdx.gitee.io/'
      }
      if (name === 'usdxVote') {
        location.href = 'https://usdx.gitee.io/govern/usdc'
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.header{
  background: $color-bgcolor;
  height: 110px;
  padding: 0 18px 0 40px;
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
  }
  img{
    display: block;
  }
  .tools{
    width: 100%;
    .logoDiv{
      position: relative;
      height: 72px;
      width: 72px;
      margin-right: 10px;
      transition: .3s all;
      transform: scale(1);
      &.ani{
        transform: scale(1.2) !important;
      }
      .logo{
        position: absolute;
        height: 80px;
        width: 80px;
      }
    }
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
      width: 35px;
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
      width: 200px;
      margin-right: 210px;
    }
  }
  &.showPools{
    /deep/ .el-dialog{
      width: 180px;
      margin-left: 230px;
    }
  }

  &.showVote{
    /deep/ .el-dialog{
      width: 200px;
      margin-left: 80px;
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
    position: relative;

    .newPro{
      position: absolute;
      color: #ff3100;
      font-size: 18px;
      transform: scale(.6);
      right: -25px;
      top: 5px;
      background: #FFF;
      border: 1px solid #ff3100;
      padding: 3px;
      border-radius: 3px;
    }
  }
}
.showEggCss{
  /deep/ .el-dialog{
    width: 564px;
    border-radius: 16px;
    .el-dialog__header{
      padding: 0;
    }
    .el-dialog__body{
      padding: 0px;
    }
  }
}
</style>