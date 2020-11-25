<template>
  <div class="deposit">
    <img class="close" src="https://cdn.jsdelivr.net/gh/defis-net/material/svg/sd_icon_btn.svg">
    <div class="title">取回</div>
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
            <span class="max" @click="percent = 1">MAX</span>
          </div>
        </div>
      </div>
      <div class="percent_p flexb din">
        <span :class="{'act_p': percent === 0}" @click="percent = 0">0%</span>
        <span :class="{'act_p': percent === 0.25}" @click="percent = 0.25">25%</span>
        <span :class="{'act_p': percent === 0.5}" @click="percent = 0.5">50%</span>
        <span :class="{'act_p': percent === 0.75}" @click="percent = 0.75">75%</span>
        <!-- <span>100%</span> -->
      </div>
    </div>
    <div class="btn flexc">确认</div>
  </div>
</template>

<script>
export default {
  name: 'financialWithdraw',
  data() {
    return {
      deposit: '',
      percent: -1,
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../css/dialog.scss';
.percent_p{
  margin: 20px 0 0;
}
</style>
