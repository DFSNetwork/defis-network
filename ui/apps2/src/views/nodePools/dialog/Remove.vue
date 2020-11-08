<template>
  <div class="removeRex">
    <!-- <div class="title">减少票数</div> -->
    <div class="rexData rules">
      <div class="allRex flexa">
        <span>{{ $t('nodePools.myRex') }}：</span>
        <span class="dinBold"> {{ bal }}</span>
      </div>
      <div class="able flexa">
        <span>{{ $t('nodePools.ableSell') }}：</span>
        <span class="dinBold"> {{ ableSell }}</span>
      </div>
    </div>
    <div class="iptDiv">
      <div class="subTitle">{{ $t('nodePools.sellRex') }}</div>
      <div class="flexend">
        <input class="ipt dinBold" v-model="buy" type="number">
        <span class="coin">REX</span>
      </div>
      <div class="info flexe">
        <!-- <div class="bal" @click="handleIn(1)">余额: {{ bal }} EOS</div> -->
        <div class="about tip">≈ {{ aboutEosNum }}EOS</div>
      </div>
      <div class="percent flexb dingBold">
        <span @click="handleIn(0)">0%</span>
        <span @click="handleIn(0.25)">25%</span>
        <span @click="handleIn(0.5)">50%</span>
        <span @click="handleIn(0.75)">75%</span>
        <span @click="handleIn(1)">MAX</span>
      </div>
    </div>
    <div class="btnDiv">
      <div class="btn flexc" v-loading="loading" @click="handlerSellRex">{{ $t('public.confirm') }}</div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { EosModel } from '@/utils/eos';
import {toLocalTime, toFixed} from '@/utils/public'
import {get_table_rows} from '@/utils/api'
import { getRexActions } from '../js/nodePools'

export default {
  name: 'removeRex',
  props: {
    rexPrice: {
      type: Number,
      default: 0.0001,
    },
    accVoteData: {
      type: Object,
      default: function avd() {
        return {}
      }
    }
  },
  data() {
    return {
      bal: '0.0000',
      ableSell: '0.0000',
      buy: '',
      loading: false,
    }
  },
  mounted() {
  },
  computed: {
    ...mapState({
      scatter: state => state.app.scatter,
    }),
    aboutEosNum() {
      const num = this.buy * this.rexPrice;
      return num.toFixed(4)
    }
  },
  watch: {
    scatter: {
      handler: function listen(newVal) {
        if (newVal.identity) {
          // 用户数据获取
          this.handleGetAccRexData()
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    async handleGetAccRexData() {
      const formName = this.scatter.identity.accounts[0].name;
      // const formName = 'eospublicbus';
      const params = {
        code: "eosio",
        json: true,
        limit: 1,
        lower_bound: ` ${formName}`,
        scope: "eosio",
        table: "rexbal",
        table_key: "",
        upper_bound: ` ${formName}`,
      }
      const {status, result} = await get_table_rows(params);
      if (!status) {
        return
      }
      console.log(result)
      if (!result.rows.length) {
        return
      }
      const rows = result.rows[0] || {};
      this.bal = rows.rex_balance.split(' ')[0];
  
      const lists = rows.rex_maturities || [];
      let ableRex = rows.matured_rex;
      lists.forEach(v => {
        const nowT = Date.parse(new Date())
        const rexT = Date.parse(toLocalTime(`${v.key}.000+0000`).replace(/-/g, '/'))
        // console.log(nowT, rexT)
        if (nowT >= rexT) {
          ableRex += v.value
        }
      });
      this.ableSell = `${(ableRex/10000).toFixed(4)}`
    },
    handleIn(rate) {
      const t = this.ableSell * rate;
      this.buy = t.toFixed(4)
    },
    handlerSellRex() {
      if (!Number(this.buy)) {
        return;
      }
      if (Number(this.buy) > Number(this.ableSell)) {
        this.$message({
          message: this.$t('public.balanLow'),
          type: 'error'
        });
        return
      }
      this.loading = true;
      const params = getRexActions(this.accVoteData, {
        rex: `${toFixed(this.buy, 4)} REX`,
        getEos: `${this.aboutEosNum} EOS`
      })
      EosModel.toTransaction(params, (res) => {
        this.loading = false;
        if(res.code && JSON.stringify(res.code) !== '{}') {
          this.$message({
            message: res.message,
            type: 'error'
          });
          return
        }
        this.$message({
          message: this.$t('public.success'),
          type: 'success'
        });
        this.$emit('listenUpdata', 'acc')
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.removeRex{
  // padding: 26px;
  text-align: left;
  font-size: 27px;
  color: #333;
  .rules{
    margin: 26px 0;
    padding: 26px;
    background: #fafafa;
    border-radius: 12px;
  }
  .iptDiv{
    .subTitle{
      font-size: 30px;
      font-weight: 500;
    }
    .ipt{
      height: 65px;
      font-size: 40px;
      width: 100%;
      outline: none;
      border: 0px;
      border-bottom: 1px solid #eeeeee;
    }
    .coin{
      width: 100px;
      font-size: 30px;
      text-align: right;
    }
    .info{
      margin: 20px 0;
    }
    .percent{
      &>span{
        width: 100px;
        font-size: 30px;
        text-align: center;
        background: rgba(#e9574f,.2);
        color: #e9574f;
        padding: 10px 0 12px;
        border-radius: 5px;
      }
    }
  }
  .btnDiv{
    margin: 30px 0 10px;
    .btn{
      height: 80px;
      width: 100%;
      background: #e9574f;
      color: #fff;
      border-radius: 40px;
      font-size: 30px;
    }
  }
}
</style>
