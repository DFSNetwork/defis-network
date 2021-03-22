<template>
  <div class="tools">
    <!-- 快捷交易 -->
    <div class="quick flexb">
      <img class="bg" src="https://cdn.jsdelivr.net/gh/defis-net/material2/dfs/quick_bg.png">
      <div class="info">
        <div class="name">{{ $t('home.oChain') }}</div>
        <div class="tip">{{ $t('home.oChainTip') }}</div>
      </div>
      <div class="btn flexc" @click="handleToPro('dcap')">
        <span>{{ $t('home.onkey') }}</span>
      </div>
    </div>

    <!-- 应用工具 -->
    <div class="appLists">
      <div class="lists flexb">
        <div class="list" @click="handleTo('invite')">
          <img class="hot" src="https://cdn.jsdelivr.net/gh/defis-net/material2/dfs/new.png">
          <img class="iconImg" src="https://cdn.jsdelivr.net/gh/defis-net/material2/dfs/invite_icon.png">
          <div>{{ $t('invite.myFarm') }}</div>
        </div>
        <div class="list" @click="handleTo('vote')">
          <img class="iconImg" src="https://cdn.jsdelivr.net/gh/defis-net/material2/dfs/vote_icon.png">
          <div>{{ $t('home.vote') }}</div>
        </div>
        <div class="list" @click="handleTo('pools')">
          <img class="iconImg" src="https://cdn.jsdelivr.net/gh/defis-net/material2/dfs/mining_icon.png">
          <div>{{ $t('home.mine') }}</div>
        </div>
        <!-- https://usdtcross.starteos.io/  兑换USDT -->
        <div class="list" @click="handleToPro('starteos')">
          <img class="iconImg" src="https://cdn.jsdelivr.net/gh/defis-net/material2/icon/exchange.png">
          <div>{{ $t('home.exchange') }}</div>
        </div>
      </div>
      <div class="lists flexb">
        <!-- <div class="list" @click="handleTo('fundation')">
          <img class="iconImg" src="https://cdn.jsdelivr.net/gh/defis-net/material2/dfs/fundation_icon.png">
          <div>{{ $t('home.fundation') }}</div>
        </div> -->
        <div class="list" @click="handleTo('financial')">
          <img class="iconImg" src="https://cdn.jsdelivr.net/gh/defis-net/material2/dfs/financial_icon.png">
          <div>{{ $t('home.financial') }}</div>
        </div>
        <div class="list" @click="handleTo('dss')">
          <img class="iconImg" src="https://cdn.jsdelivr.net/gh/defis-net/material2/dfs/dss_icon.png">
          <div>DFS DSS</div>
        </div>
        <div class="list" @click="handleToPro('usdx')">
          <img class="iconImg" src="https://cdn.jsdelivr.net/gh/defis-net/material2/dfs/usdx_icon.png">
          <div>USDX</div>
        </div>
        <div class="list" @click="handleToPro('record')">
          <img class="hot" src="https://cdn.jsdelivr.net/gh/defis-net/material2/icon/hot.png">
          <img class="iconImg" src="https://cdn.jsdelivr.net/gh/defis-net/material2/dfs/note_icon.png">
          <div>{{ $t('home.diary') }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'homeTools',
  methods: {
    handleTo(name, params) {
      this.$router.push({
        name, params,
      })
    },
    handleToPro(name) {
      if (name === 'dcap') {
        location.href = 'https://dtoken.gitee.io/convert/'
        return
      }
      if (name === 'record') {
        location.href = 'https://dfsfans.io/'
        return
      }
      if (name === 'usdx') {
        location.href = 'https://usdx.gitee.io/'
        return
      }
      if (name === 'starteos') {
        location.href = 'https://usdtcross.starteos.io/'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.tools{
  text-align: left;
}
.quick{
  font-size: 32px;
  margin: 28px;
  background: #FFF;
  border-radius: 8px;
  // border: 1px solid $color-border;
  padding: 18px;
  position: relative;
  .info{
    position: relative;
    z-index: 1;
  }
  .tip{
    font-size: 22px;
    font-weight: 300;
  }
  .name{
    font-weight: 500;
    margin-bottom: 8px;
  }
  .btn{
    background: $color-main;
    color: #fff;
    height: 76px;
    width: 188px;
    border-radius: 8px;
    font-size: 28px;
  }
  .bg{
    position: absolute;
    top: 50%;
    left: 55%;
    width: 116px;
    transform: translate(-50%, -50%);
    z-index: 0;
  }
}
.appLists{
  margin: 28px;
  font-size: 26px;
  background: #FFF;
  padding: 22px 18px;
  border-radius: 8px;
  // border: 1px solid $color-border;
  .lists{
    margin-bottom: 28px;
    text-align: center;
    &:last-child{
      margin-bottom: 0px;
    }
  }
  .list{
    flex: 1;
    font-size: 27px;
    position: relative;
    .iconImg{
      width: 60px;
      margin-bottom: 8px;
    }
    .hot{
      position: absolute;
      top: 0px;
      right: 35px;
      width: 48px;
    }
  }
}
</style>
