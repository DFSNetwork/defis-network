<template>
  <div class="accLogin flexc">
    <div class="unLogin" v-if="!scatter.identity">
      <span class="tip">{{ $t('public.unLogin') }}</span>
      <span class="loginBtn" @click="handleLogin">{{ $t('public.login') }}</span>
    </div>
    <div class="login flexc" v-else>
      <span class="flexc iconSpan"><img width="100%" src="@/assets/img/dex/user_icon.svg" alt=""></span>
      <span>{{ scatter.identity.accounts[0].name }}</span>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { login } from '@/utils/public';
export default {
  name: 'accLogin',
  computed: {
    ...mapState({
      // 箭头函数可使代码更简练
      scatter: state => state.app.scatter,
    }),
  },
  mounted() {
  },
  methods: {
    // 登录
    handleLogin() {
      login(this, () => {})
    },
  },
}
</script>

<style lang="scss" scoped>
.accLogin{
  font-family: 'Sarasa UI';
  height: 80px;
  margin: 30px 40px;
  font-size: 30px;
  background: $color-bgcolor;
  border-radius:30px;
  border:2px solid rgba(224,224,224,1);
  .loginBtn{
    color: $color-main;
    font-weight: 500;
  }
  .login{
    color: $color-black;
    .iconSpan{
      width: 26px;
      margin-right: 36px;
    }
  }
}
</style>
