<template>
  <div class="his">
    <div>
      <div class="title">
        <span class="act">充值记录</span>
      </div>
      <div class="lists">
        <div class="item subTitle flexa">
          <div>数量({{ action.token0 }})</div>
          <div>日期</div>
          <div>TX ID(FROM)</div>
          <div>TX ID(TO)</div>
        </div>
        <div class="item flexa" v-for="(v, i) in dLists" :key="`d_${i}`">
          <div class="din">{{ v.amount }}</div>
          <div>{{ v.vdate }}</div>
          <div @click="handletoBrowser(v.originating_tx_hash)">{{ v.originating_tx_hash }}</div>
          <div @click="handletoBrowser(v.broadcast_tx_hash, 'eos')">{{ v.broadcast_tx_hash }}</div>
        </div>
      </div>
    </div>
    <div>
      <div class="title">
        <span class="act">提现记录</span>
      </div>
      <div class="lists">
        <div class="item subTitle flexa">
          <div>数量({{ action.token1 }})</div>
          <div>日期</div>
          <div>TX ID(FROM)</div>
          <div>TX ID(TO)</div>
        </div>
        <div class="item flexa" v-for="(v, i) in wLists" :key="`w_${i}`">
          <div class="din">{{ v.amount }}</div>
          <div>{{ v.vdate }}</div>
          <div @click="handletoBrowser(v.originating_tx_hash, 'eos')">{{ v.originating_tx_hash }}</div>
          <div @click="handletoBrowser(v.broadcast_tx_hash)">{{ v.broadcast_tx_hash }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
import { toLocalTime, toBrowserBtc, toBrowserEtc, toBrowser } from '@/utils/public'
export default {
  props: {
    action: {
      type: Object,
      default: function ats() {
        return {}
      }
    }
  },
  data() {
    return {
      dLists: [],
      wLists: [],
    }
  },
  watch: {
    action: {
      handler(newVal) {
        if (!newVal.token1) {
          return
        }
        this.dLists = [];
        this.wLists = [];
        this.handleGetWLists()
        this.handleGetDLists()
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
  },
  methods: {
    handletoBrowser(id, chaineos) {
      const chain = chaineos || this.action.urlToken;
      if (chain === 'eos') {
        toBrowser(id, 'tx')
        return
      }
      if (chain === 'pbtc') {
        toBrowserBtc(id, 'tx')
        return
      }
      if (chain === 'pweth') {
        toBrowserEtc(id, 'tx')
        return
      }
    },
    async handleGetDLists() {
      const uuid = uuidv4()
      const params = {
        token: this.action.urlToken,
        token1: this.action.token1,
        "id": uuid,
        "jsonrpc": "2.0",
        "method": "app_queryHostReports",
        "params": [20]
      }
      const {status, result} = await this.$api.ptoken_get_address(params)
      // console.log(result)
      if (!status) {
        return
      }
      const rows = result.result || []
      rows.forEach(v => {
        let amount = parseFloat(v.host_tx_amount)
        if (this.action.token0 === 'BTC') {
          amount = parseFloat(v.host_tx_amount) / (10 ** this.action.decimal1);
        }
        this.$set(v, 'amount', amount.toFixed(this.action.decimal1))
        let vdate = toLocalTime(v.broadcast_timestamp * 1000)
        this.$set(v, 'vdate', vdate)
      });
      this.dLists = rows;
      // console.log('dLists', result)
    },
    async handleGetWLists() {
      const uuid = uuidv4()
      const params = {
        token: this.action.urlToken,
        token1: this.action.token1,
        "id": uuid,
        "jsonrpc": "2.0",
        "method": "app_queryNativeReports",
        "params": [20]
      }
      const {status, result} = await this.$api.ptoken_get_address(params)
      // console.log(result)
      if (!status) {
        return
      }
      const rows = result.result || [];
      rows.forEach(v => {
        let amount = parseFloat(v.native_tx_amount)
        // if (this.action.token0 === 'BTC') {
          amount = parseFloat(v.native_tx_amount) / (10 ** this.action.decimal0);
          // console.log(amount, )
        // }
        this.$set(v, 'amount', amount.toFixed(this.action.decimal1))
        let vdate = toLocalTime(v.broadcast_timestamp * 1000)
        this.$set(v, 'vdate', vdate)
      });
      this.wLists = rows;
      // console.log('wLists', result)
    },
  },
}
</script>

<style lang="scss" scoped>
.his{
  color: #333;
  font-size: 24px;
  .title{
    font-size: 32px;
    text-align: left;
    margin: 10px 32px 10px;
    &>span{
      padding-left: 20px;
    }
    .act{
      color: $color-black;
      position: relative;
      &::before{
        content: '';
        position: absolute;
        width: 8px;
        height: 30px;
        background:#29D4B0;
        border-radius:4px;
        left: 0%;
        top: 50%;
        transform: translateY(-45%);
      }
    }
  }
  .lists{
    margin: 20px 32px;
    overflow-x: auto;
    text-align: left;
    .item{
      width: 930px;
      height: 50px;
      border-bottom: 1px solid rgba(220,220,220, .3);
      &.subTitle{
        &>div{
          color: #333 !important;
          text-decoration-line: none !important;
        }
      }
      &>div{
        margin-right: 10px;
        &:nth-child(1){
          width: 180px;
        }
        &:nth-child(2){
          width: 250px;
        }
        &:nth-child(3),&:nth-child(4){
          width: 250px;
          overflow: hidden;
          text-overflow: ellipsis; //溢出用省略号显示
          white-space: nowrap; //溢出不换行
          color: #29D4B0;
          text-decoration-line: underline;
        }
      }
    }
  }
}
</style>