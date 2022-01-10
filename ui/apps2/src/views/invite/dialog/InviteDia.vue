<template>
  <div class="inviteDia">
    <img
      class="shareBg" v-if="language === 'zh-CN'"
      src="https://cdn.jsdelivr.net/gh/defis-net/material2/dfs/inviteBg1.png"
    />
    <img
      class="shareBg" v-else
      src="https://cdn.jsdelivr.net/gh/defis-net/material2/dfs/inviteBg1-en.png"
    />
    <img class="close" @click="handleClose"
      src="https://cdn.jsdelivr.net/gh/defis-net/material2/dfs/close-white.png">
    <div class="content">
      <div>{{ $t('invite.address') }}</div>
      <div class="address din">{{ link }}</div>
      <div
        class="copy flexc"
        v-clipboard:copy="link"
        v-clipboard:success="onCopy"
        v-clipboard:error="onError"
      >
        {{ $t('invite.copyAdd') }}
      </div>

      <div class="tips">
        <div>{{ $t('invite.inviteRules1') }}</div>
        <div>{{ $t('invite.inviteRules2') }}</div>
        <div>{{ $t('invite.inviteRules3') }}</div>
        <div>{{ $t('invite.inviteRules4') }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "inviteDia",
  data() {
    return {
      link: "https://xxxxxxxxx?xxxx=xxxx",
    };
  },
  mounted() {
    this.link = location.href;
  },
  computed: {
    ...mapState({
      language: (state) => state.app.language,
    }),
  },
  methods: {
    handleClose() {
      this.$emit('listenClose', false)
    },
    onCopy() {
      this.$toast.success(this.$t("public.copySuccess"));
    },
    onError() {
      this.$toast.fail(this.$t("public.copyFail"));
    },
  },
};
</script>

<style lang="scss" scoped>
.inviteDia {
  color: #333;
  font-size: 32px;
  width: 692px;
  height: 960px;
  overflow: hidden;
  border-radius: 16px;
  background: #00d8ae;
  position: relative;
  .shareBg {
    width: 692px;
    display: block;
    overflow: hidden;
  }
  .close{
    position: absolute;
    top: 30px;
    right: 30px;
    width: 28px;
  }
  .content {
    height: 660px;
    width: 620px;
    margin: 40px 36px;
    position: absolute;
    background: #fff;
    border-radius: 16px;
    bottom: 0px;
    padding: 30px 40px;
    box-sizing: border-box;
  }
  .address {
    font-size: 28px;
    margin: 20px auto;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis; //溢出用省略号显示
    white-space: nowrap; //溢出不换行
  }
  .copy {
    background: $color-main;
    color: #fff;
    border-radius: 40px;
    height: 80px;
    width: 240px;
    margin: 30px auto;
  }
  .tips {
    text-align: left;
    & > div {
      margin-bottom: 20px;
      font-size: 28px;
    }
  }
}
</style>
