<template>
  <div class="createTop">
    <img class="bg" v-if="language === 'zh-CN'"
      src="https://cdn.jsdelivr.net/gh/defis-net/material2/dfs/createTop-en.png">
    <img class="bg" v-else
      src="https://cdn.jsdelivr.net/gh/defis-net/material2/dfs/createTop.png">
    <div class="info">
      <div class="infoImg flexc">
        <img v-if="language === 'zh-CN'"
          src="https://cdn.jsdelivr.net/gh/defis-net/material2/dfs/createTitleBg.png">
        <img v-else
          src="https://cdn.jsdelivr.net/gh/defis-net/material2/dfs/createTitleBg-en.png">
        <span>{{ $t('invite.farmDesc') }}</span>
      </div>
      <div class="item flexs">
        <!-- <div class="disc1"></div> -->
        <div class="subTip">
          <div class="title">{{ $t('invite.farmDesc') }}</div>
          <div class="tip">{{ $t('invite.createTip1') }}</div>
          <div class="tip">{{ $t('invite.createTip2') }}</div>
        </div>
      </div>
      <div class="item flexs">
        <!-- <div class="disc1"></div> -->
        <div class="subTip">
          <div class="title">{{ $t('invite.createTip3') }}</div>
          <div class="tip">{{ $t('invite.createTip4') }}</div>
          <div class="tip">{{ $t('invite.createTip5') }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: 'createTop',
  computed: {
    ...mapState({
      language: (state) => state.app.language,
    }),
  },
}
</script>

<style lang="scss" scoped>
.bg{
  width: 100%;
}
.info{
  background: #FFF;
  border-radius: 16px;
  font-size: 28px;
  padding: 0 32px 48px;
  margin: 0 28px;
  text-align: left;
  margin-top: -210px;
  z-index: 1;
  position: relative;
  .infoImg{
    margin: auto;
    margin-bottom: 30px;
    position: relative;
    color: #FFF;
    height: 64px;
    img{
      position: absolute;
      height: 100%;
      left: 50%;
      top: 0;
      transform: translateX(-50%);
    }
    span{
      position: relative;
    }
  }
  .item{
    margin-bottom: 25px;
    &:last-child{
      margin-bottom: 0;
    }
  }
  .disc1{
    border-radius: 30px;
    height: 30px;
    width: 30px;
    border: 4px solid $color-main;
    box-sizing: border-box;
    margin-right: 20px;
    margin-top: 10px;
  }
  .subTip{
    flex: 1;
    font-size: 24px;
    .title{
      font-weight: 500;
      font-size: 28px;
      margin-bottom: 10px;
    }
    .tip{
      margin-top: 4px;
    }
  }
}
</style>
