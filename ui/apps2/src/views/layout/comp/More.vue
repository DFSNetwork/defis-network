<template>
  <!-- more -->
  <el-drawer
    class="drawerCss"
    :show-close="false"
    :visible.sync="showNav"
    direction="ltr">
    <div class="morePop">
      <div class="acc flexb">
        <div>
          <div @click="handleLogin" v-if="!scatter || !scatter.identity"
            class="login">{{ $t('more.login') }}</div>
          <div v-else class="login">{{ scatter.identity.accounts[0].name }}</div>
          <div class="tip">{{ $t('more.wel') }}</div>
        </div>
        <img v-if="!scatter || !scatter.identity" @click="handleLogin"
          class="right" src="https://cdn.jsdelivr.net/gh/defis-net/material/svg/acc_right.svg" alt="">
        <span v-else class="red exit" @click="handleLoginOut">{{ $t('public.loginOut') }}</span>
      </div>
      <!-- list -->
      <div class="lists">
        <div class="title flexb" @click="handleToBP">
          <div class="flexa">
            <img class="titleImg" src="https://cdn.jsdelivr.net/gh/defis-net/material2/coin/minedfstoken-dfs.png">
            <span>{{ $t('more.aboutDfs') }}</span>
          </div>
          <img class="right" src="https://cdn.jsdelivr.net/gh/defis-net/material/svg/about_right.svg" alt="">
        </div>
        <div class="list flexa" @click="handleShowComp('silderSet')">
          <img class="listImg" src="https://cdn.jsdelivr.net/gh/defis-net/material/svg/swap_set.svg">
          <span>{{ $t('dex.TradeSet') }}</span>
        </div>
        <div class="list flexa" @click="handleShowNode">
          <img class="listImg" src="https://cdn.jsdelivr.net/gh/defis-net/material/svg/node_set.svg">
          <span>{{ $t('node.nodeSet') }}</span>
        </div>
        <div class="list flexa" @click="handleTo('createMarket')">
          <img class="listImg" src="https://cdn.jsdelivr.net/gh/defis-net/material/svg/create_set.svg">
          <span>{{ $t('dex.addMarket') }}</span>
        </div>
        <!-- <div class="list flexa" @click="handleShowComp('invi')">
          <img class="listImg" src="https://cdn.jsdelivr.net/gh/defis-net/material/svg/invi_set.svg">
          <span>{{ $t('invi.invitation') }}</span>
        </div> -->
        <div class="list flexa" @click="handleToPro('docs')">
          <img class="listImg" src="https://cdn.jsdelivr.net/gh/defis-net/material/svg/tutorial_set.svg">
          <span>{{ $t('more.faq') }}</span>
        </div>
        <div class="list flexa" @click="handleShowComp('warn')">
          <img class="listImg" src="https://cdn.jsdelivr.net/gh/defis-net/material/svg/safe_set.svg">
          <span>{{ $t('public.warnTip') }}</span>
        </div>
      </div>

      <!-- 切换语言 -->
      <div class="lang flexb" @click="handleChangeLang()">
        <span v-if="language === 'zh-CN'">{{ $t('public.switchLang') }}</span>
        <span v-else>{{ $t('public.switchLang') }}</span>
        <img class="langImg" src="https://cdn.jsdelivr.net/gh/defis-net/material/svg/lang.svg">
      </div>
      <!-- versions -->
      <div class="flexa version">
        <span class="flexc" @click="handleToV1('v1')">V1</span>
        <span class="flexc" @click="handleToV1('v2')">V2</span>
        <span class="flexc" @click="handleToV1('v3')">V3</span>
        <span class="flexc" @click="handleToV1('v4')">V4</span>
        <span class="flexc" @click="handleToV1('v5')">V5</span>
      </div>
      <!-- 合作 -->
      <div class="flexb par">
        <a href="https://github.com/defis-net" target="_blank">
          <img src="https://cdn.jsdelivr.net/gh/defis-net/material/par/GitHub_icon.svg" alt="">
        </a>
        <a href="https://bihu.com/people/1511717747" target="_blank">
          <img src="https://cdn.jsdelivr.net/gh/defis-net/material/par/bihu_icon.svg" alt="">
        </a>
        <a href="https://twitter.com/DFSnetworks" target="_blank">
          <img src="https://cdn.jsdelivr.net/gh/defis-net/material/par/twitter_icon.svg" alt="">
        </a>
        <a href="https://t.me/dfsnet" target="_blank">
          <img src="https://cdn.jsdelivr.net/gh/defis-net/material/par/telegram_icon.svg" alt="">
        </a>
        <a v-clipboard:copy="'dfsfarmer'"
          v-clipboard:success="handleCopy"
          v-clipboard:error="handleCopyError">
          <img src="https://cdn.jsdelivr.net/gh/defis-net/material/par/WeChat_icon.svg" alt="">
        </a>
        <a href="https://dfsofficial.medium.com/" target="_blank">
          <img src="https://cdn.jsdelivr.net/gh/defis-net/material/par/medium_icon.svg" alt="">
        </a>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import { EosModel } from '@/utils/eos';
import { mapState } from 'vuex'
import { login } from '@/utils/public';

export default {
  name: 'more',
  data() {
    return {
      showNav: false,
    }
  },
  computed: {
    ...mapState({
      language: state => state.app.language,
      scatter: state => state.app.scatter,
    }),
  },
  methods: {
    handleToBP() {
      location.href = 'https://defis.network/'
    },
    handleChangeLang() {
      let type;
      this.language === 'en' ? type = 'zh-CN' : type = 'en'
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
      } else if (ve === 'v3') {
        location.href = 'https://v3.defis.network/'
      } else if (ve === 'v4') {
        location.href = 'https://v4.defis.network/'
      } else if (ve === 'v4') {
        location.href = 'https://dfsswap.gitee.io/'
      }
    },
    handleToPro(type) {
      if (type === 'docs') {
        location.href = 'https://dfscommunity.baklib-free.com/'
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
    // 分享 - 复制文本
    handleCopy() {
      this.$message.success({
        message: this.$t('public.copySuccess'),
        position: 'center',
        duration: 2000
      });
    },
    handleCopyError() {
      this.$message.error({
        message: this.$t('public.copyFail'),
        position: 'center',
        duration: 2000
      });
    },
  }
}
</script>

<style lang="scss" scoped>
/*iphoneX、iphoneXs*/
@media only screen and (max-width: 750px) {
  .exit{
    display: none !important;
  }
}
.morePop{
  max-height: 100vh;
  overflow: auto;
  font-size: 27px;
  .right{
    width: 20px;
  }
  .red{
    color: #EB6765;
  }
  .acc{
    padding: 30px 60px 30px 30px;
    text-align: left;
    .login{
      font-size: 50px;
      font-weight: 500;
      margin-bottom: 10px;
      color: #333;
    }
  }
  .lists{
    margin: 0 30px 30px;
    .title{
      color: #FFF;
      background: #57DBBF;
      height: 80px;
      border-radius: 20px 20px 0px 0px;
      padding: 30px;
      box-sizing: border-box;
      margin-bottom: 10px;
      .titleImg{
        width: 60px;
        margin-right: 10px;
      }
    }
    .list{
      color: #333;
      height: 80px;
      padding-right: 30px;
      box-sizing: border-box;
      margin-bottom: 10px;
      &:last-child{
        margin-bottom: 0px;
      }
      .listImg{
        width: 33px;
        margin-right: 10px;
      }
    }
  }
  .lang{
    color: #39C8C1;
    padding: 30px;
    background: rgba(#57DBBF, .08);
  }
  .version{
    font-size: 30px;
    color: #333;
    padding: 30px;
    &>span{
      width: 50px;
      height: 50px;
      margin-right: 50px;
      &:last-child{
        margin-right: 0px;
      }
    }
  }
  .par{
    padding: 10px 30px;
    img{
      width: 72px;
    }
  }
}

.drawerCss{
  /deep/ .el-drawer{
    width: 550px !important;
  }
  /deep/ .el-drawer__header{
    margin-bottom: 0;
    padding: 0;
  }
  /deep/ .el-drawer__body,
  /deep/ .el-drawer{
    outline: none !important;
  }
}
</style>