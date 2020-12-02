<template>
  <div class="financial">
    <div class="banner">
      <img v-if="$store.state.app.language === 'en'" src="https://cdn.jsdelivr.net/gh/defis-net/material/financial/financial2-en.png" alt="">
      <img v-else src="https://cdn.jsdelivr.net/gh/defis-net/material/financial/financial2.png" alt="">
      <div class="main flexb">
        <div>
          <div>{{ $t('financial.assigned') }}</div>
          <div class="num dinBold">{{ allSend }} YFC</div>
        </div>
        <div>
          <div>{{ $t('financial.destory') }}</div>
          <div class="num dinBold">{{ bal3 }} YFC</div>
        </div>
      </div>
    </div>
    <Steady />
    <Radical/>
  </div>
</template>

<script>
import Radical from './comp/Radical'
import Steady from './comp/Steady'
import { get_balance } from '@/utils/api'

export default {
  name: 'financial',
  components: {
    Steady,
    Radical
  },
  data() {
    return {
      acc: ['yfcpayoutone', 'yfcyfcprofit', 'yfcyfctoburn'],
      bal1: '0.00000000',
      bal2: '0.00000000',
      bal3: '0.00000000',
    }
  },
  computed: {
    allSend() {
      const n = Number(this.bal1) + Number(this.bal2)
      return n.toFixed(8)
    },
  },
  mounted() {
    this.handleFor();
  },
  methods: {
    handleFor() {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.handleFor()
      }, 200000);
      this.acc.forEach((v, i) => {
        this.handleGetBal(i)
      });
    },
    async handleGetBal(i) {
      const params = {
        code: 'yfctokenmain',
        symbol: 'YFC',
        decimal: 8,
        account: this.acc[i],
      }
      const {status, result} = await get_balance(params)
      if (!status) {
        return
      }
      console.log(result)
      if (i == 0) {
        this.bal1 = result.split(' ')[0]
        return;
      }
      if (i == 1) {
        this.bal2 = result.split(' ')[0]
        return;
      }
      if (i == 2) {
        this.bal3 = result.split(' ')[0]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.financial{
  font-size: 28px;
  min-height: 100vh;
  background: #F5F5F5;
  padding-bottom: 30px;
  .banner{
    position: relative;
    img{
      display: block;
      width: 100%;
    }
    .main{
      position: absolute;
      bottom: 36px;
      width: 90%;
      color: #FFF;
      left: 50%;
      transform: translate(-50%, 0);
      font-size: 32px;
      &>div{
        flex: 1;
        text-align: center;
      }
      .num{
        margin-top: 18px;
        font-size: 36px;
      }
    }
  }
}
</style>
