<template>
  <div class="pools">
    <div class="dfsInfo flexa">
      <img class="coin" src="https://cdn.jsdelivr.net/gh/defis-net/material2/coin/minedfstoken-dfs.png">
      <div>
        <div class="coinName din">DFS</div>
        <div>{{ $t('dfsMine.totalLiq') }}</div>
      </div>
    </div>
    <div class="flexb token">
      <div class="item">
        <div class="dinBold num">{{ parseInt(current) }}</div>
        <div class="tip">{{ $t('dfsMine.supply') }}</div>
      </div>
      <div class="item">
        <div class="dinBold num">{{ usedDfs }}</div>
        <div class="tip">{{ $t('dfsMine.liq') }}</div>
      </div>
      <div class="item">
        <div class="dinBold num">${{ price5min }}</div>
        <div class="tip">{{ $t('dfsMine.price') }}</div>
      </div>
    </div>

    <div class="speed">
      <div class="total dinBold">{{ totalBal }}</div>
      <div class="vil">
        <div class="green">{{ $t('dfsMine.reservoir') }}</div>
        <img class="down" src="https://cdn.jsdelivr.net/gh/defis-net/material2/dfs/down-black.png">
        <div class="flexc tip spdNum" @click="showSpeed = true">
          <span>{{ speed }} DFS/{{ $t('dfsMine.sec') }}</span>
          <img class="tipImg" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/tips_icon_btn.svg">
        </div>
      </div>
      <div class="subPools flexb">
        <div class="subPool">
          <div class="bal din">{{ 100 > parseInt(dfsPoolsBal) ? dfsPoolsBal : parseInt(dfsPoolsBal) }}</div>
          <div class="tip">{{ $t('dfsMine.coinPool', {coin: 'DFS'}) }}</div>
        </div>
        <div class="subPool">
          <div class="bal din">{{ 100 > parseInt(eosPoolsBal) ? eosPoolsBal : parseInt(eosPoolsBal)}}</div>
          <div class="tip">{{ $t('dfsMine.coinPool', {coin: 'EOS'}) }}</div>
        </div>
        <div class="subPool">
          <div class="bal din">{{ 100 > parseInt(usdtPoolsBal) ? usdtPoolsBal : parseInt(usdtPoolsBal)}}</div>
          <div class="tip">{{ $t('dfsMine.coinPool', {coin: 'USDT'}) }}</div>
        </div>
        <div class="subPool">
          <div class="bal din">{{ 100 > parseInt(dssPoolsBal) ? dssPoolsBal : parseInt(dssPoolsBal)}}</div>
          <div class="tip">{{ $t('dfsMine.coinPool', {coin: 'DSS'}) }}</div>
        </div>
      </div>
    </div>

    <van-popup class="popup_p" v-model="showSpeed">
      <Speed :speed="speed"/>
    </van-popup>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { accDiv } from '@/utils/public';
import Speed from '../popup/Speed'
export default {
  name: 'pools',
  components: {
    Speed
  },
  props: {
    current: {
      type: String,
      default: '0.0000',
    }
  },
  data() {
    return {
      showSpeed: false,
      price5min: '0.0000',
      totalBal: '0.0000',
      dfsPoolsBal: '0.0000',
      eosPoolsBal: '0.0000',
      usdtPoolsBal: '0.0000',
      dssPoolsBal: '0.0000',
      timer: null,
    }
  },
  mounted() {
    this.handleGetPrice()
    this.handleGetBal('total')
    this.handleGetBal('dfs')
    this.handleGetBal('eos')
    this.handleGetBal('usdt')
    this.handleGetBal('dss')

    this.timer = setInterval(() => {
      this.handleGetPrice()
      this.handleGetBal('total')
      this.handleGetBal('dfs')
      this.handleGetBal('eos')
      this.handleGetBal('usdt')
      this.handleGetBal('dss')
    }, 10000);
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  computed: {
    // damping
    ...mapState({
      damping: (state) => state.sys.damping,
    }),
    speed() {
      const max_supply = 3600;
      const damping = this.damping;
      return parseFloat(max_supply * damping / 86400).toFixed(4);
    },
    usedDfs() {
      let total = parseFloat(this.current) - parseFloat(this.totalBal) -
                  parseFloat(this.dfsPoolsBal) - parseFloat(this.eosPoolsBal) -
                  parseFloat(this.usdtPoolsBal) - parseFloat(this.dssPoolsBal)
      return parseFloat(total || 0).toFixed(4)
    }
  },
  methods: {
    async handleGetBal(type = "total") {
      const params = {
        code: 'minedfstoken',
        symbol: 'DFS',
        decimal: 4,
        account: 'dfsavingpool'
      }
      if (type === 'dfs') {
        params.account = 'dfspool11111'
      } else if (type === 'eos') {
        params.account = 'dfspool22222'
      } else if (type === 'usdt') {
        params.account = 'dfspool33333'
      } else if (type === 'dss') {
        params.account = 'dfspool44444'
      }
      const {status, result} = await this.$api.get_currency_balance(params);
      if (!status) {
        return
      }
      const bal = result;
      if (type === 'total') {
        this.totalBal = parseFloat(bal) + ''
      } else if (type === 'dfs') {
        this.dfsPoolsBal = parseFloat(bal) + ''
      } else if (type === 'eos') {
        this.eosPoolsBal = parseFloat(bal) + ''
      } else if (type === 'usdt') {
        this.usdtPoolsBal = parseFloat(bal) + ''
      } else if (type === 'dss') {
        this.dssPoolsBal = parseFloat(bal) + ''
      }

      this.$emit('listenAllBal', {
        dfsPoolsBal: this.dfsPoolsBal,
        eosPoolsBal: this.eosPoolsBal,
        usdtPoolsBal: this.usdtPoolsBal,
        dssPoolsBal: this.dssPoolsBal,
      })
    },
    // DFS价格 - 5分钟一次
    async handleGetPrice() {
      const params = {
        "code": "defislinkeos",
        "scope": "451",
        "table": "avgprices",
        "limit": 3,
        "json": true,
      }
      const {status, result} = await this.$api.get_table_rows(params);
      if (!status) {
        return
      }
      const res = result;
      const rows = res.rows || [];
      if (!rows.length) {
        return
      }
      const price = rows.find(v => v.key === 300) || {};
      const price5min = accDiv(price.price0_avg_price, 10000) || 0;
      this.price5min = parseFloat(price5min).toFixed(2)
    },
  }
}
</script>

<style lang="scss" scoped>
.pools{
  margin-top: 30px;
  box-shadow: 4px 4px 10px 4px rgba(230,230,230,0.64);
  border-radius: 20px;
  padding: 28px;
  .dfsInfo{
    text-align: left;
    margin-bottom: 25px;
    .coin{
      width: 80px;
      margin-right: 15px;
    }
    .coinName{
      font-size: 40px;
    }
  }
  .token{
    padding-bottom: 30px;
    border-bottom: 1px solid $color-border;
    .item{
      flex: 1;
    }
    .num{
      font-size: 36px;
    }
    .tip{
      font-size: 24px;
      margin-top: 6px;
    }
  }
  .speed{
    padding: 30px 0 0;
    .total{
      font-size: 52px;
      margin-bottom: 9px;
    }
    .green{
      color: $color-main;
      font-size: 28px;
      margin-bottom: 9px;
    }
    .down{
      width: 26px;
    }
    .tipImg{
      width: 32px;
      margin-left: 9px;
    }
    .spdNum{
      margin: 9px 0;
    }
  }
  .subPools{
    font-size: 24px;
    margin-top: 25px;
    .subPool{
      flex: 1;
      margin-right: 15px;
      &:last-child{
        margin-right: 0;
      }
      .bal{
        font-size: 36px;
      }
    }
  }
}
</style>
