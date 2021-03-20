<template>
  <div>
    <!-- pTokens 跨链兑换 -->
    <div class="tabDiv flexb">
      <div class="tab flexc" :class="{'act': act === 1}" @click="act = 1">充值</div>
      <div class="tab flexc" :class="{'act': act === 2}" @click="act = 2">提现</div>
    </div>
    <!-- 选择币种 -->
    <div class="selectDiv">
      <div class="flexb">
        <span>选择币种</span>
        <img class="qus" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/tips_icon_btn.svg" alt="">
      </div>
      <van-popover
        class="iptPopDiv"
        v-model="showPopover"
        trigger="click"
        :get-container="getContainer"
      >
        <template #default>
          <div class="options">
            <template v-for="(v, i) in actions">
              <div class="iptDiv flexa" v-if="act === 1 ? v.deposit : v.withdraw"
                :key="i" @click="handleChecked(v)">
                <div class="sym flexa" v-if="act === 1">
                  <img class="coin" :src="v.src0">
                  <span>{{ v.token0 }}</span>
                </div>
                <div class="sym flexa" v-else>
                  <img class="coin" :src="v.src1">
                  <span>{{ v.token1 }}</span>
                </div>
                <img class="to" src="https://cdn.jsdelivr.net/gh/defis-net/material/dex/exchange.svg" alt="">
                <div class="sym flexa" v-if="act === 1">
                  <img class="coin" :src="v.src1">
                  <span>{{ v.token1 }}</span>
                </div>
                <div class="sym flexa" v-else>
                  <img class="coin" :src="v.src0">
                  <span>{{ v.token0 }}</span>
                </div>
              </div>
            </template>
          </div>
        </template>
        <template #reference>
          <div class="flexb">
            <div class="iptDiv flexa" v-if="act === 1">
              <div class="sym flexa">
                <img class="coin" :src="action.src0">
                <span>{{ action.token0 }}</span>
              </div>
              <img class="to" src="https://cdn.jsdelivr.net/gh/defis-net/material/dex/exchange.svg" alt="">
              <div class="sym flexa">
                <img class="coin" :src="action.src1">
                <span>{{ action.token1 }}</span>
              </div>
            </div>
            <div class="iptDiv flexa" v-else>
              <div class="sym flexa">
                <img class="coin" :src="action.src1">
                <span>{{ action.token1 }}</span>
              </div>
              <img class="to" src="https://cdn.jsdelivr.net/gh/defis-net/material/dex/exchange.svg" alt="">
              <div class="sym flexa">
                <img class="coin" :src="action.src0">
                <span>{{ action.token0 }}</span>
              </div>
            </div>
            <img class="down" src="https://cdn.jsdelivr.net/gh/defis-net/material/svg/down.svg" alt="">
          </div>
        </template>
      </van-popover>
    </div>
    <Deposit v-show="act === 1" :action="action"/>
    <Withdraw v-if="act === 2" :action="action"/>
    <Rules />
    <History  :action="action"/>
  </div>
</template>

<script>
import Deposit from './comp/Deposit'
import Withdraw from './comp/Withdraw'
import Rules from './comp/Rules'
import History from './comp/History'

export default {
  name: 'pTokens',
  components: {
    Withdraw,
    Deposit,
    Rules,
    History,
  },
  data() {
    return {
      act: 1,
      showPopover: false,
      actions: [{
        deposit: 1,
        withdraw: 1,
        urlToken: 'pbtc',
        token0: 'BTC',
        token1: 'PBTC',
        contract1: 'btc.ptokens',
        src0: 'https://cdn.jsdelivr.net/gh/defis-net/material2/coin/btc.png',
        src1: 'https://ndi.340wan.com/eos/btc.ptokens-pbtc.png',
        decimal0: '8',
        decimal1: '8',
      }, {
        deposit: 0,
        withdraw: 1,
        urlToken: 'pweth',
        token0: 'ETH',
        token1: 'PETH',
        decimal0: '18',
        decimal1: '9',
        contract1: 'eth.ptokens',
        src0: 'https://cdn.jsdelivr.net/gh/defis-net/material2/coin/eth.png',
        src1: 'https://ndi.340wan.com/eos/btc.ptokens-pbtc.png',
      }],
      action: {
        token0: 'BTC',
        token1: 'PBTC',
        urlToken: 'pbtc',
        src0: 'https://cdn.jsdelivr.net/gh/defis-net/material2/coin/btc.png',
        src1: 'https://ndi.340wan.com/eos/btc.ptokens-pbtc.png',
        decimal0: '8',
        decimal1: '8',
      },
      uuid: ''
    }
  },
  watch: {
    act: {
      handler: function at(newVal) {
        if (newVal === 1) {
          this.action = this.actions.find(v => v.deposit === 1)
        }
      },
      deep: true,
      immediate: true,
    }
  },
  mounted() {
    // this.handleGetAddress()
  },
  methods: {
    getContainer() {
      return document.querySelector('.selectDiv');
    },
    handleChecked(v) {
      this.action = v
      this.showPopover = false;
    },
  }
}
</script>

<style lang="scss" scoped>
.tabDiv{
  font-size: 32px;
  margin: 20px 32px;
  .tab{
    flex: 1;
    height: 70px;
    border: 1px solid rgba(220,220,220,.3);
    color: #999;
    border-radius: 4px;
    &.act{
      border: 1px solid #29D4B0;
      color: #FFF;
      background: #29D4B0;
    }
  }
}
.selectDiv{
  padding: 26px;
  font-size: 28px;
  margin: 0 32px;
  background: rgba(41, 212, 176, 0.08);
  border-radius: 4px;;
  .qus{
    width: 32px;
  }
  .iptPopDiv{
    width: 100%;
    box-sizing: border-box;
    background: #FFF;
    border-radius: 4px;
    padding: 0 18px;
    margin: 18px 0;
    .down{
      width: 18px;
    }
  }
  .options{
    padding: 0 18px;
    width: 600px;
  }
  .iptDiv{
    font-size: 28px;
    height: 80px;
    .coin{
      width: 44px;
      margin-right: 10px;
    }
    .to{
      margin: 0 32px;
      width: 14px;
    }
  }
}
</style>
