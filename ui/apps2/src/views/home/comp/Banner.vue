<template>
  <div class="banner">
    <van-swipe class="my-swipe" :autoplay="6000" indicator-color="white">
      <van-swipe-item>
        <img class="bannerImg" v-if="language === 'zh-CN'"
          src="https://cdn.jsdelivr.net/gh/defis-net/material2/dfs/banner1.png">
        <img class="bannerImg" v-else
          src="https://cdn.jsdelivr.net/gh/defis-net/material2/dfs/banner1-en.png">
      </van-swipe-item>
      <van-swipe-item>
         <img class="bannerImg"
          src="https://cdn.jsdelivr.net/gh/defis-net/material2/dfs/spring1.png">
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
}
</script>

<style lang="scss" scoped>
.banner{
  margin: 10px 28px 28px;
  .bannerImg{
    width: 100%;
    max-height: 280px;
    display: block;
  }
}
</style>
