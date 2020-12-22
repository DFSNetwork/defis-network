<template>
  <div class="withdraw">
    <div class="title">提币地址</div>
    <div>
      <van-field class="ipt din flexa" v-model="address" placeholder="请输入用户名" />
    </div>
    <div class="title">提币数量</div>
    <div>
      <van-field class="ipt din flexa" v-model="amount" placeholder="请输入用户名" />
    </div>
    <div class="percent_p flexb din">
      <span :class="{'act_p': percent === 0}" @click="handlePercent(0)">0%</span>
      <span :class="{'act_p': percent === 25}" @click="handlePercent(25)">25%</span>
      <span :class="{'act_p': percent === 50}" @click="handlePercent(50)">50%</span>
      <span :class="{'act_p': percent === 75}" @click="handlePercent(75)">75%</span>
      <span :class="{'act_p': percent === 100}" @click="handlePercent(100)">100%</span>
    </div>
    <div class="btn flexc" @click="show = true">提币</div>

    <van-popup class="popup" v-model="show">
      <WithDrawSure />
    </van-popup>
  </div>
</template>

<script>
import WithDrawSure from '../dialog/WithDrawSure'
export default {
  name: 'withdrawForPtoken',
  components: {
    WithDrawSure
  },
  data() {
    return {
      percent: 0,
      amount: '',
      address: '',
      bal: '100.00000000',
      show: false,
    }
  },
  methods: {
    handlePercent(n) {
      this.percent = n
      const amount = this.bal * n / 100;
      this.amount = amount.toFixed(4)
    }
  }
}
</script>

<style lang="scss" scoped>
.withdraw{
  color: #333;
  font-size: 28px;
  text-align: left;
  margin: 20px 32px;
  .title{
    font-size: 24px;
    margin: 16px 0;
  }
  .ipt{
    height: 80px;
    padding: 0px 16px;
    box-sizing: border-box;
    width: 100%;
    border: 1px solid rgba(220,220,220,.3);
    border-radius: 4px;
    margin-bottom: 10px;
    font-size: 28px;
  }
  .percent_p{
    margin: 36px 0;
  }
  .btn{
    border-radius: 45px;
    height: 90px;
    font-size: 36px;
    color: #FFF;
    background: #29D4B0;
    margin-bottom: 50px;
  }
}
.popup{
  border-radius: 12px;
}
</style>
