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
        v-model="showPopover"
        trigger="click"
        :actions="actions"
        @select="onSelect"
      >
        <template #reference>
          
      <div class="iptDiv flexa" @click="handleShowPop">
        <div class="sym flexa">
          <img class="coin" src="https://cdn.jsdelivr.net/gh/defis-net/material/coin/eosio.token-eos.svg">
          <span>BTC</span>
        </div>
        <img class="to" src="https://cdn.jsdelivr.net/gh/defis-net/material/dex/exchange.svg" alt="">
        <div class="sym flexa">
          <img class="coin" src="https://cdn.jsdelivr.net/gh/defis-net/material/coin/eosio.token-eos.svg">
          <span>PBTC</span>
        </div>
      </div>
        </template>
      </van-popover>
    </div>
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
export default {
  name: 'pTokens',
  data() {
    return {
      act: 1,
      showPopover: false,
      actions: [{ text: '选项一' }, { text: '选项二' }, { text: '选项三' }],
      uuid: ''
    }
  },
  mounted() {
    this.handleGetAddress()
  },
  methods: {
    handleShowPop() {
      console.log(this.showPopover)
      if (this.showPopover) {
        return
      }
      this.showPopover = true;
    },
    onSelect(action) {
      this.$toast(action.text);
    },
    async handleGetAddress() {
      this.uuid = uuidv4()
      const params = {
        "id": this.uuid,
        "jsonrpc": "2.0",
        "method": "app_getNativeDepositAddress",
        "params": ["iq3rwbsfcqlv"]
      }
      const {status, result} = await this.$api.ptoken_get_address(params)
      console.log(result)
    }
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
  .iptDiv{
    background: #FFF;
    margin: 18px 0;
    font-size: 28px;
    height: 80px;
    border-radius: 4px;
    padding: 0 14px;
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
