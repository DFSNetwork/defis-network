<template>
  <div class="deposit">
    <img class="close" src="https://cdn.jsdelivr.net/gh/defis-net/material/svg/sd_icon_btn.svg">
    <div class="title">存款</div>
    <div class="content">
      <div>
        <div class="bal dinReg">余额：1234.0000 EOS</div>
        <div class="flexb">
          <div class="flexa coinInfo">
            <img class="coinImg" src="https://cdn.jsdelivr.net/gh/defis-net/material/coin/eosio.token-eos.svg" alt="">
            <div>
              <div class="coinName">EOS</div>
              <div class="contract tip">eosio.token</div>
            </div>
          </div>
          <div class="iptDiv flexb">
            <van-field class="ipt dinBold" v-model="deposit" placeholder="0.0" />
            <span class="max">MAX</span>
          </div>
        </div>
      </div>
      <div class="flexb lockTime">
        <span class="tip">存款时间</span>
        <span class="red">存款锁定四日</span>
      </div>
    </div>

    <!-- 按钮 -->
    <div class="btn flexc">确认</div>
    <!-- 交易规则 -->
    <div class="rules">
      <TradeRules :showType="'dialog'"/>
    </div>
  </div>
</template>

<script>
import TradeRules from '../comp/TradeRules';
export default {
  name: 'financialDeposit',
  components: {
    TradeRules
  },
  data() {
    return {
      deposit: '',
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../css/dialog.scss';
</style>
