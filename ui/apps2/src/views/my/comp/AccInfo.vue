<template>
  <div class="accInfo">
    <img class="accBgImg" :src="`https://cdn.jsdelivr.net/gh/defis-net/material/accBanner/banner${bgImg}.png`" alt="">
    <div class="info flexa">
      <div class="headDiv flexc">
        <img class="headImg" :src="`https://cdn.jsdelivr.net/gh/defis-net/material/coin/${headImg}.png`" alt="">
      </div>
      <div>
        <div class="name">{{ nick }}</div>
        <div class="account flexa">
          <span
            v-clipboard:copy="id"
            v-clipboard:success="onCopy"
            v-clipboard:error="onError">ID: {{ id }}</span>
          <img class="copy"
            v-clipboard:copy="id"
            v-clipboard:success="onCopy"
            v-clipboard:error="onError"
            src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/copy.png" alt="">
        </div>
        <div class="intro">{{ intro }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import {getPngLen, getPng} from '@/utils/public';
import {nick} from '../js/nick'
import memes from '@/views/konami/js/memes.js';

export default {
  name: 'accInfo',
  data() {
    return {
      nick: '',
      id: '',
      bgImg: '',
      headImg: '',
      intro: '',
    }
  },
  mounted() {
    this.handleGetRandom()
  },
  computed: {
    ...mapState({
      scatter: state => state.app.scatter,
    }),
  },
  watch: {
    scatter: {
      handler: function sc (newVal) {
        if (newVal.identity) {
          this.id = newVal.identity.accounts[0].name;
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    handleGetRandom() {
      const r3 = parseInt(Math.random() * 1000 % memes.length);
      if (memes[r3].length > 50) {
        this.handleGetRandom()
        return
      }
      this.intro = memes[r3];

      const r1 = parseInt(Math.random() * 1000 % nick.length);
      this.nick = nick[r1]
      const r2 = parseInt(Math.random() * 1000 % 5);
      this.bgImg = r2
      const len = getPngLen()
      const r4 = parseInt(Math.random() * 1000 % len);
      // console.log(r4)
      this.headImg = getPng(r4)
      // console.log(this.headImg)
    },
    onCopy() {
      this.$message.success(this.$t('public.copySuccess'));
    },
    onError() {
      this.$message.error(this.$t('public.copyFail'));
    },
  }
}
</script>

<style lang="scss" scoped>
.accInfo{
  font-size: 24px;
  height: 296px;
  position: relative;
  .accBgImg{
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0%;
    top: 0%;
  }
  .info{
    position: relative;
    padding: 46px 28px 0;
    color: #FFF;
    text-align: left;
    .headDiv{
      background: #FFF;
      border-radius: 70px;
      width: 140px;
      min-width: 140px;
      height: 140px;
      margin-right: 28px;
    }
    .headImg{
      width: 84px;
      height: 84px;
      border-radius: 50px;
    }
    .name{
      font-size: 40px;
      font-weight: 500;
    }
    .account{
      margin-bottom: 8px;
      .copy{
        width: 24px;
        margin-left: 10px;
      }
    }
  }
}
</style>
