<template>
  <div class="header">
    <div class="logo">
      <img src="@/assets/logo.png" alt="">
    </div>
    <div class="tools">
      <div class="account">
        <span class="login" v-if="!scatter.identity" @click="handleLogin">{{ $t('public.login') }}</span>
        <span class="acc" v-else>{{ scatter.identity.accounts[0].name }}</span>
      </div>
      <!-- <div class="lang">
        <span v-if="language === 'en'" @click="handleChangeLang('zh-CN')">En</span>
        <span v-else @click="handleChangeLang('en')">CN</span>
      </div> -->
      <div class="more" @click="handleShowNav">
        <img class="img" src="@/assets/img/more.png" alt="">
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {}
  },
  components: {
  },
  computed:{
    ...mapState({
      // 箭头函数可使代码更简练
      scatter: state => state.app.scatter,
      language: state => state.app.language,
    })
  },
  methods: {
    handleChangeLang(type) {
      this.$i18n.locale = type;
      this.$store.dispatch('setLanguage', type);
    },
    handleLogin() {
      this.$emit('listenLogin', true)
    },
    handleShowNav() {
      this.$emit('listenShowNav', true)
    }
  }
}
</script>

<style lang="scss" scoped>
.header{
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 44px;
  .logo{
    img{
      display: block;
      width: 141px;
    }
  }
  .tools{
    display: flex;
    align-items: center;
    &>div{
      font-size: 12px;
      min-width: 35px;
      line-height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding-right: 10px;
    }
    .login{
      font-size: 14px;
      font-weight: 500;
      color: #42B48F;
    }
  }
  .acc{
    font-weight: 500;
  }
  .more{
    height: 44px;
    .img{
      width: 16px;
    }
  }
}
</style>
