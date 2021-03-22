<template>
  <div class="accCenterTools">
    <!-- 应用功能 -->
    <div class="tools">
      <div class="title">数据与服务</div>
      <div class="lists flexa">
        <div class="list" @click="handleTo('history', {mid: 39})">
          <img class="icon big" src="https://cdn.jsdelivr.net/gh/defis-net/material2/icon/swapHis.png" alt="">
          <div>交易记录</div>
        </div>
        <div class="list" @click="handleTo('MarketHis', {mid: 39})">
          <img class="icon" src="https://cdn.jsdelivr.net/gh/defis-net/material2/icon/marketHis.png" alt="">
          <div>做市记录</div>
        </div>
        <div class="list" @click="handleTo('pddexOrder')">
          <img class="icon" src="https://cdn.jsdelivr.net/gh/defis-net/material2/icon/order.png" alt="">
          <div>我的订单</div>
        </div>
        <div class="list" @click="handleTo('myMarketList')">
          <img class="icon big" src="https://cdn.jsdelivr.net/gh/defis-net/material2/icon/myMarket.png" alt="">
          <div>我的做市</div>
        </div>
      </div>
    </div>
    <div class="tools">
      <div class="title">投票与治理</div>
      <div class="lists flexa">
        <div class="list" @click="handleTo('vote')">
          <img class="icon" src="https://cdn.jsdelivr.net/gh/defis-net/material2/coin/minedfstoken-dfs.png" alt="">
          <div>DFS投票</div>
        </div>
        <div class="list">
          <van-popover v-model="showGovern" trigger="click" @click.stop="''">
            <div class="myPopover">
              <div class="item flexc" @click="handleTo('voteForTag')">{{ $t('sys.coinPool', {coin: 'TAG'}) }}</div>
              <div class="item flexc" @click="handleTo('sysParams')">{{ $t('sys.vote2') }}</div>
            </div>
            <template #reference>
              <img class="icon" src="https://cdn.jsdelivr.net/gh/defis-net/material2/coin/tagtokenmain-tag.png" alt="">
              <div>TAG投票</div>
            </template>
          </van-popover>
        </div>
        <div class="list" @click="handleToProject('usdxVote')">
          <img class="icon" src="https://cdn.jsdelivr.net/gh/defis-net/material2/icon/usdx.png" alt="">
          <div>USDX系统</div>
        </div>
        <div class="list" @click="handleTo('nodeVote')">
          <img class="icon" src="https://cdn.jsdelivr.net/gh/defis-net/material2/coin/eosio.token-eos.svg" alt="">
          <div>EOS节点</div>
        </div>
      </div>
    </div>

    <!-- 游戏中心 -->
    <div class="tools">
      <div class="title">应用与游戏</div>
      <div class="lists flexa">
        <div class="list" @click="handleToProject('dtoken')">
          <img class="icon" src="https://cdn.jsdelivr.net/gh/defis-net/material2/coin/dcap.png" alt="">
          <div>跨链充提</div>
          <img class="beta" src="https://cdn.jsdelivr.net/gh/defis-net/material2/icon/beta.png" alt="">
        </div>
        <div class="list" @click="handleToProject('diary')">
          <img class="icon" src="https://cdn.jsdelivr.net/gh/defis-net/material2/icon/notice.png" alt="">
          <div>大丰收日记</div>
          <img class="beta hot" src="https://cdn.jsdelivr.net/gh/defis-net/material2/icon/hot.png" alt="">
        </div>
        <div class="list" @click="handleTo('pools')">
          <img class="icon" src="https://cdn.jsdelivr.net/gh/defis-net/material2/coin/minedfstoken-dfs.png" alt="">
          <div>DFS 矿池</div>
        </div>
        <div class="list" @click="handleTo('nodePools')">
          <img class="icon" src="https://cdn.jsdelivr.net/gh/defis-net/material2/coin/tagtokenmain-tag.png" alt="">
          <div>TAG 矿池</div>
        </div>
      </div>
      <div class="lists flexa">
        <div class="list" @click="handleToProject('usdx')">
          <img class="icon" src="https://cdn.jsdelivr.net/gh/defis-net/material2/icon/usdx.png" alt="">
          <div>USDX 矿池</div>
        </div>
        <div class="list" @click="handleToProject('eosdefi')">
          <img class="icon" src="https://cdn.jsdelivr.net/gh/defis-net/material2/coin/eosio.token-eos.svg" alt="">
          <div>EOS DeFis</div>
        </div>
        <div class="list" @click="handleTo('farms')">
          <img class="icon" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/yfcFarm.png" alt="">
          <div>农活大厅</div>
        </div>

        <div class="list">
          <van-popover v-model="showDss" placement="top" trigger="click" @click.stop="''">
            <div class="myPopover">
              <div class="item flexc" @click="handleTo('dss')">DFS DSS</div>
              <div class="item flexc" @click="handleToProject('yfcDss')">YFC DSS</div>
              <div class="item flexc" @click="handleTo('dssForTag')">TAG DSS</div>
            </div>
            <template #reference>
              <img class="icon" src="https://cdn.jsdelivr.net/gh/defis-net/material2/icon/dss.png" alt="">
              <div>DSS</div>
            </template>
          </van-popover>
        </div>
      </div>
      <div class="lists flexa">
        <div class="list" @click="handleTo('total')">
          <img class="icon" src="https://cdn.jsdelivr.net/gh/defis-net/material2/icon/top21.png" alt="">
          <div>TOP21</div>
        </div>
        <div class="list" @click="handleToProject('totalData')">
          <img class="icon" src="https://cdn.jsdelivr.net/gh/defis-net/material2/icon/total.png" alt="">
          <div>数据总览</div>
        </div>
        <div class="list" @click="handleToProject('kline')">
          <img class="icon" src="https://cdn.jsdelivr.net/gh/defis-net/material2/icon/kline.png" alt="">
          <div>K线数据</div>
        </div>
        <div class="list" @click="handleTo('coinViews', {mid: 39})">
          <img class="icon" src="https://cdn.jsdelivr.net/gh/defis-net/material2/icon/coinView.png" alt="">
          <div>代币观察</div>
        </div>
      </div>
      <div class="lists flexa">
        <div class="list" @click="handleTo('fundation')">
          <img class="icon" src="https://cdn.jsdelivr.net/gh/defis-net/material2/icon/fundation.png" alt="">
          <div>乐捐系统</div>
        </div>
        <div class="list" @click="handleToProject('help')">
          <img class="icon" src="https://cdn.jsdelivr.net/gh/defis-net/material2/icon/helper.png" alt="">
          <div>大丰收助手</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'accCenterTools',
  data() {
    return {
      showGovern: false,
      showDss: false,
    }
  },
  methods: {
    handleClick() {
      this.showGovern = false;
    },
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
      if (name === 'eosdefi') {
        location.href = 'http://eos-defi.sgxiang.com/'
        return
      }
      if (name === 'usdxVote') {
        location.href = 'https://usdx.gitee.io/govern/usdc'
        return
      }
      if (name === 'usdx') {
        location.href = 'https://usdx.gitee.io/'
        return
      }
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
      if (name === 'eosdefi') {
        location.href = 'http://eos-defi.sgxiang.com/'
        return
      }
      if (name === 'pbtc') {
        location.href = 'https://dapp.ptokens.io/pbtc-on-eos/issue-redeem'
        return
      }
      if (name === 'totalData') {
        location.href = 'http://dfs-info.sgxiang.com'
      }
      if (name === 'kline') {
        location.href = 'https://dfs.defiview.io/kline'
      }
      if (name === 'dtoken') {
        location.href = 'https://dtoken.gitee.io/'
      }
      if (name === 'help') {
        location.href = 'https://dfsdefi.com/'
      }
      if (name === 'diary') {
        location.href = 'https://dfsfans.io/'
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
        position: relative;
        &:last-child{
          margin-right: 0;
        }
        .beta{
          position: absolute;
          top: -15px;
          width: 58px;
          right: 8px;
          color: #FFF;
          font-weight: 300;
          &.hot{
            width: 48px;
            top: -10px;
            right: 12px;
          }
        }
        .icon{
          width: 42px;
          height: 42px;
          margin: auto;
          margin-bottom: 18px;
          display: block;
          &.big{
            width: 44px;
          }
        }
      }
    }
  }
}

.myPopover{
  font-size: 28px;
  padding: 8px 26px;
  .item{
    height: 80px;
    border-bottom: 1px solid rgba(220,220,220, .3);
    &:last-child{
      border-bottom: 0;
    }
  }
}
</style>
