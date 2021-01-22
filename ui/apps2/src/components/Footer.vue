<template>
  <div class="footer">
    <div v-if="isEx" class="" @click="clickOnDFSInfoData">
      24H{{ $t('footer.swapNum') }}: {{ dfsInfoData.total_volume ? dfsInfoData.total_volume : "0.00" }}
      {{ dfsInfoData.order_number ? dfsInfoData.order_number : 0 }}{{ $t('footer.orderNum') }}
    </div>
    <div v-else class="" @click="clickOnDFSInfoData">
      24H{{ $t('footer.swapNum') }}: ${{ dfsInfoData.total_volume_usdt ? dfsInfoData.total_volume_usdt : "0.00" }}
      {{ dfsInfoData.order_number ? dfsInfoData.order_number : 0 }}{{ $t('footer.orderNum') }}
    </div>
    <div class="poolsNum flexc" @click="isEx = !isEx">
      <span>{{ $t('footer.tlv') }}: </span>
      <span v-if="isEx">{{ poolsEos }}</span>
      <span v-else>${{ poolsUsdt }}</span>
      <img v-if="isEx" class="exchange" src="https://cdn.jsdelivr.net/gh/defis-net/material/dex/price_switch_icon_btn_left.svg" alt="">
      <img v-else class="exchange" src="https://cdn.jsdelivr.net/gh/defis-net/material/dex/price_switch_icon_btn_right.svg" alt="">
    </div>

    <div class="safe tip">
      <span>{{ $t('public.safeRecord1') }}</span>
      <span class="who" @click="handleToShowReport('slotMist')"> {{ $t('public.safeRecord2') }}</span> &
      <span class="who" @click="handleToShowReport('peckshield')">{{ $t('public.safeRecord4') }} </span>
      <span>{{ $t('public.safeRecord3') }}</span>
    </div>

    <el-dialog
      class="dialog"
      :visible.sync="showImg">
      <img width="100%" src="https://tva1.sinaimg.cn/large/007S8ZIlgy1gh00tvkd0dj30ku112tbw.jpg" />
    </el-dialog>
    <el-dialog
      class="dialog"
      :visible.sync="showImg2">
      <img width="100%" src="https://tva1.sinaimg.cn/large/0081Kckwly1gjzkya7bllj30ku112abv.jpg" />
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import { mapState } from 'vuex';
import { EosModel } from '@/utils/eos';
import { toFixed, accMul } from '@/utils/public';

export default {
  data() {
    return {
      showImg: false,
      showImg2: false,
      dfsInfoData: {},
      timer: null,
      closeDFSInfoDataTip: true,
      poolsEos: '0.0000 EOS',
      poolsUsdt: '0.0000',
      isEx: false,
    }
  },
  computed: {
    ...mapState({
      poolsBal: state => state.sys.poolsBal,
      marketLists: state => state.sys.marketLists,
    }),
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  mounted() {
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.handleGetDfsInfoData();
    }, 1000 * 30);
    this.handleGetDfsInfoData();
  },
  watch: {
    // poolsBal: {
    //   handler: function pb(val) {
    //     // this.poolsEos = accMul(val, 2).toFixed(4);
    //   },
    //   immediate: true,
    //   deep: true,
    // },
    // marketLists: {
    //   handler: function mls(newVal) {
    //     let count = 0
    //     let countU = 0
    //     newVal.forEach(v => {
    //       count = Number(count) + Number(v.eos_value)
    //       countU = Number(countU) + Number(v.usdt_value)
    //     })
    //     this.poolsEos = count;
    //     this.poolsUsdt = countU;
    //   }
    // }
  },
  methods: {
    handleSetAllRes() {
      const allResult = [];
      const feesDataKeys = this.dfsInfoData.trading_volume_in || [];
      const feesDataKeysOut = this.dfsInfoData.trading_volume_out || [];
      // const coinArr = dealSymArr(this.marketLists);
      const dealArr = [];
      feesDataKeys.forEach((item) => {
        const allHas = dealArr.find(v => v.mid === item.mid)
        if (allHas) {
          return
        }
        const i = item;
        const o = feesDataKeysOut.find(v => v.mid === item.mid && v.sym === item.sym) || {}
        const total = {
          mid: i.mid,
          total: parseFloat(i.total || 0) + parseFloat(o.total || 0),
          sym: i.sym,
        }
        dealArr.push(total)
      })
      dealArr.forEach(v => {
        const value = v.total * 0.002;
        const market = this.marketLists.find(vv => vv.mid === v.mid);
        if (!market) {
          return
        }
        let liq = market.symbol0 === v.sym ? market.reserve0 : market.reserve1;
        liq = parseFloat(liq || 0) * 2;
        const poolsApr = value / (liq - value) * 365 * 100;
        allResult.push({
          mid: v.mid,
          symbol: v.sym,
          poolsApr: `${poolsApr.toFixed(3)}%`
        });
      });
      this.$store.dispatch('setFeesApr', allResult);
    },
    handleToShowReport(name) {
      if (name === 'peckshield') {
        this.showImg2 = true;
        return
      }
      this.showImg = true;
    },
    clickOnDFSInfoData() {
      // this.closeDFSInfoDataTip = false;
      this.$router.push({
        name: 'total',
      })
    },
    // 获取总发行量
    async handleGetDfsInfoData() {
      const result = await axios.get("https://api.defis.network/basic/swap/summary");
      if (result.status !== 200) {
        return;
      }
      this.dfsInfoData = result.data;
      this.poolsEos = this.dfsInfoData.tvl_eos;
      this.poolsUsdt = parseFloat(this.dfsInfoData.tvl_usdt);
      const price = this.poolsUsdt / parseFloat(this.poolsEos)
      const total_volume_usdt = price * parseFloat(this.dfsInfoData.total_volume)
      this.$set(this.dfsInfoData, 'total_volume_usdt', total_volume_usdt.toFixed(4))
      this.$store.dispatch('setDfsData', this.dfsInfoData)
      this.handleSetAllRes()
    },
    // 获取账户余额
    async handleGetBalance() {
      const params = {
        code: 'eosio.token',
        coin: 'EOS',
        decimal: 4,
        account: 'defisswapcnt'
      };
      await EosModel.getCurrencyBalance(params, res => {
        let balance = toFixed('0.0000000000001', params.decimal);
        (!res || res.length === 0) ? balance : balance = res.split(' ')[0];
        this.poolsEos = accMul(balance, 2).toFixed(4);
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.dialog{
  /deep/ .el-dialog{
    margin-top: 10vh !important;
    width: 600px;
    .el-dialog__header,
    .el-dialog__body{
      padding: 0;
    }
  }
  img{
    display: block;
  }
}
.copy{
  width: 30px;
  margin-left: 10px;
}
.footer{
  font-size: 26px;
  margin-top: 30px;
  color: #333;
  .poolsNum{
    margin-top: 8px;
    &>span{
      &:first-child{
        margin-right: 8px;
      }
    }
    .exchange{
      width: 30px;
      margin: 0 10px;
    }
  }
  .safe{
    margin: 12px 0 30px;
    font-size: 24px;
    // font-weight: 300;
  }
  .who{
    font-weight: bold;
    color: $color-black;
  }
  .help{
    font-size: 27px;
    margin: 12px 0 ;
  }
}
</style>
