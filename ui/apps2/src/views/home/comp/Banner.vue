<template>
  <div class="banner">
    <van-swipe class="my-swipe" :autoplay="6000" indicator-color="white">
      <van-swipe-item>
        <img class="bannerImg" v-if="language === 'zh-CN'"
          src="https://cdn.jsdelivr.net/gh/defis-net/material2/dfs/banner1.png">
        <img class="bannerImg" v-else
          src="https://cdn.jsdelivr.net/gh/defis-net/material2/dfs/banner1-en.png">
      </van-swipe-item>
      <van-swipe-item @click="handleToObj('trade')">
        <img class="bannerImg"
          src="@/assets/banner/trade.jpeg">
      </van-swipe-item>
      <van-swipe-item>
        <img class="bannerImg" v-if="language === 'zh-CN'"
          src="https://cdn.jsdelivr.net/gh/defis-net/material2/banner/dfsMine.png">
        <img class="bannerImg" v-else
          src="https://cdn.jsdelivr.net/gh/defis-net/material2/banner/dfsMine-en.png">
      </van-swipe-item>
    </van-swipe>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'homeBanner',
  computed: {
    ...mapState({
      language: state => state.app.language, // 基础配置 - 默认为{}
    })
  },
  methods: {
    handleToObj(type) {
      if (type === 'trade') {
        location.href = 'https://dfsfans.io/?page=home&tab=play'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.banner{
  margin: 10px 28px 28px;
  .bannerImg{
    border-radius: 8px;
    width: 100%;
    max-height: 280px;
    display: block;
  }
}
</style>
