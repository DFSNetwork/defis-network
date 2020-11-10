<template>
  <div class="accCenterTools">
    <!-- 应用功能 -->
    <div class="tools">
      <div class="title">数据与服务</div>
      <div class="lists flexa">
        <div class="list" @click="handleTo('myMarketList')">
          <img class="icon big" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/market.svg" alt="">
          <div>我的做市</div>
        </div>
        <div class="list" @click="handleTo('history', {mid: 39})">
          <img class="icon big" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/tradeHistory.png" alt="">
          <div>交易记录</div>
        </div>
        <div class="list" @click="handleTo('MarketHis', {mid: 39})">
          <img class="icon" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/marketHistory.png" alt="">
          <div>做市记录</div>
        </div>
        <div class="list" @click="handleTo('coinViews', {mid: 39})">
          <img class="icon" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/coinViews.png" alt="">
          <div>代币观察</div>
        </div>
      </div>
    </div>

    <!-- 游戏中心 -->
    <div class="tools">
      <div class="title">应用与游戏</div>
      <div class="lists flexa">
        <div class="list" @click="handleToProject('pddex')">
          <img class="icon" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/pddex.png" alt="">
          <div>PDDEX</div>
        </div>
        <div class="list" @click="handleTo('nodePools')">
          <img class="icon" src="https://cdn.jsdelivr.net/gh/defis-net/material/coin/tagtokentest-tag.png" alt="">
          <div>TAG</div>
        </div>
        <div class="list" @click="handleToProject('pbtc')">
          <img class="icon" src="https://ndi.340wan.com/eos/btc.ptokens-pbtc.png" alt="">
          <div>PBTC</div>
        </div>
        <div class="list" @click="handleTo('fundation')">
          <img class="icon" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/fundation.png" alt="">
          <div>乐捐系统</div>
        </div>
      </div>
      <div class="lists flexa">
        <div class="list" @click="handleTo('farms')">
          <img class="icon" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/yfcFarm.png" alt="">
          <div>农活大厅</div>
        </div>
        <div class="list" @click="handleToProject('time')">
          <img class="icon" src="https://cdn.jsdelivr.net/gh/defis-net/material/coin/xpettimecore-time.png" alt="">
          <div>TIME</div>
        </div>
        <div class="list" @click="handleToProject('yfc')">
          <img class="icon" src="https://cdn.jsdelivr.net/gh/defis-net/material/coin/yfctokenmain-yfc.png" alt="">
          <div>YFC</div>
        </div>
        <div class="list" @click="handleToProject('pdd')">
          <img class="icon" src="https://cdn.jsdelivr.net/gh/defis-net/material/coin/pddtokenmain-pdd.png" alt="">
          <div>PDD</div>
        </div>
      </div>
      <div class="lists flexa">
        <div class="list" @click="handleToProject('dbc')">
          <img class="icon" src="https://cdn.jsdelivr.net/gh/defis-net/material/coin/dbctokenmain-dbc.png" alt="">
          <div>白菜</div>
        </div>
        <div class="list" @click="handleTo('total')">
          <img class="icon" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/fundation.png" alt="">
          <div>TOP21 {{ $t('info.info') }}</div>
        </div>
        <!-- <div class="list">
          <img class="icon" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/bird.png" alt="">
          <div>青鸟</div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'accCenterTools',
  methods: {
    handleTo(name, params) {
      if (this.$route.name === name)  {
        return;
      }
      this.$router.push({
        name: name,
        params,
      })
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
      if (name === 'time') {
        location.href = 'https://timemine.xloot.io/'
        return
      }
      if (name === 'eosdefi') {
        location.href = 'http://eos-defi.sgxiang.com/'
        return
      }
      if (name === 'pbtc') {
        location.href = 'https://dapp.ptokens.io/pbtc-on-eos/issue-redeem'
        return
      }
      if (name === 'loop') {
        location.href = 'https://loop.ech.one/index.html'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.accCenterTools{
  color: #333;
  font-size: 24px;
  .tools{
    margin: 28px;
    padding: 20px 28px 46px;
    background: #FFF;
    border-radius: 12px;
    box-shadow: 0px 4px 8px 0px rgba(226,226,226,0.5);
    .title{
      font-size: 32px;
      text-align: left;
      font-weight: 500;
    }
    .lists{
      margin-top: 30px;
      .list{
        flex: 1;
        width: 146px;
        max-width: 146px;
        margin-right: 18px;
        text-align: center;
        line-height: 34px;
        &:last-child{
          margin-right: 0;
        }
        .icon{
          width: 42px;
          height: 42px;
          margin: auto;
          margin-bottom: 8px;
          display: block;
          &.big{
            width: 44px;
          }
        }
      }
    }
  }
}
</style>
