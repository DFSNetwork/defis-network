<template>
  <div class="addCoin">
    <div class="title flexb">
      <span class="back flexa" @click="$router.back()">
        <img src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/back.png" alt="">
      </span>
      <span v-if="$route.name === 'addSignCoin'">{{ $t('invite.addCoin') }}</span>
      <span v-else>{{ $t('invite.editCoin') }}</span>
      <span class="back"></span>
    </div>

    <div class="coinInfo">
      <div class="subTitle flexb">
        <span>{{ $t('dex.coin', {coin: ''}) }}</span>
        <span class="checkCoin" v-if="$route.name === 'addSignCoin'"
          @click="showMarketList = true">{{ $t('tutorial.ul5_3') }}</span>
      </div>
      <div class="iptInfo">
        <div class="item">
          <div class="label">{{ $t('dex.contract') }}</div>
          <div>
            <van-field class="ipt" v-model="contract" :placeholder="$t('dex.plsContract')"/>
          </div>
        </div>
        <div class="item">
          <div class="label">{{ $t('dex.coinName') }}</div>
          <div>
            <van-field class="ipt" v-model="coinName" :placeholder="$t('dex.plsCoinName')"/>
          </div>
        </div>
        <div class="item">
          <div class="label">{{ $t('dex.coinDecimal') }}</div>
          <div>
            <van-field class="ipt" v-model="decimal" :placeholder="$t('dex.plsCoinDecimal')"/>
          </div>
        </div>
      </div>
    </div>

    <div class="coinInfo">
      <div class="subTitle flexb">
        <span>{{ $t('invite.infoShort') }}</span>
      </div>
      <div class="iptInfo">
        <!-- <div class="item">
          <div class="label">充值数量</div>
          <div>
            <van-field class="ipt" v-model="transfer" type="number"
              placeholder="输入充值数量，例：1.0000"/>
          </div>
        </div> -->
        <div class="item">
          <div class="label">
            <span>{{ $t('invite.signLimit') }}</span>
            <span class="eg">{{ $t('invite.signLimitEg') }}</span>
          </div>
          <div>
            <van-field class="ipt" v-model="limit" type="number"
              :placeholder="$t('invite.plsSignLimit')"/>
          </div>
        </div>
        <div class="item">
          <div class="label">
            <span>{{ $t('invite.signAmt') }}</span>
          </div>
          <div>
            <van-field class="ipt" v-model="getNum" type="number"
              :placeholder="$t('invite.plsSignAmt')"/>
          </div>
        </div>
      </div>
    </div>

    <div class="btn flexc" @click="handleAddCoin">{{ $t('public.confirm') }}</div>

    <!-- 弹窗组件 -->
    <van-popup
      class="newMarket"
      v-model="showMarketList"
      position="left">
      <market-list :marketLists="marketLists"
        :type="type"
        @listenMarketChange="handleMarketChange"
        @listenClose="handleClose"/>
    </van-popup>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { DApp } from '@/utils/wallet';
import MarketList from '@/components/MarketArea';
export default {
  name: 'addCoin',
  components: {
    MarketList,
  },
  data() {
    return {
      rCoin: '',
      lists: [],
      text: '',
      showMarketList: false,
      type: 'pay',
      coinName: 'TAG',
      contract: 'tagtokenmain',
      decimal: '8',
      transfer: '',
      limit: '',
      getNum: '',
    }
  },
  created() {
    this.rCoin = this.$route.params.coin;
  },
  computed: {
    ...mapState({
      // 箭头函数可使代码更简练
      account: state => state.app.account,
      marketLists: state => state.sys.marketLists,
    })
  },
  watch: {
    account: {
      handler: function at(newVal) {
        if (!newVal.name) {
          return
        }
        this.handleGetLists()
      },
      immediate: true,
      deep: true,
    },
    rCoin: {
      handler: function at(newVal) {
        if (!newVal) {
          return
        }
        this.handleGetLists()
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    async handleGetLists() {
      const name = this.account.name;
      if (!this.account.name || !this.rCoin) {
        return
      }
      const params = {
        code: "farms.tag",
        scope: ` ${name}`,
        table: "rewards",
        json: true,
        lower_bound: this.rCoin,
        upper_bound: this.rCoin,
      };
      const {status, result} = await this.$api.get_table_rows(params);
      this.loading = false;
      if (!status) {
        return
      }
      let rows = result.rows || [];
      rows.sort((a, b) => {
        return b.weight - a.weight
      })
      rows.forEach(v => {
        const sym = v.balance.split(' ');
        this.$set(v, 'symbol', sym[1])
        this.$set(v, 'bal', sym[0])
        const decimal = sym[0].split('.')[1].length;
        this.$set(v, 'decimal', decimal)
      });
      this.lists = rows;
      this.handleGetEditInfo()
    },
    handleGetEditInfo() {
      if (!this.rCoin || !this.lists.length) {
        return
      }
      const info = this.lists.find(v => v.symbol === this.rCoin)
      this.coinName = info.symbol;
      this.contract = info.cnt;
      this.decimal = info.decimal;
      this.transfer = '';
      this.limit = info.limit;
      this.getNum = info.reward;
    },
    handleMarketChange(v) {
      this.showMarketList = false;
      this.decimal = v.decimal;
      this.coinName = v.symbol;
      this.contract = v.contract;
    },
    handleClose() {
      this.showMarketList = false;
    },
    handleReg() {
      if (!this.contract.trim()) {
        this.$toast.fail(this.$t('dex.plsContract'))
        return false
      }
      if (!this.coinName.trim()) {
        this.$toast.fail(this.$t('dex.plsCoinName'))
        return false
      }
      if (!this.decimal.trim()) {
        this.$toast.fail(this.$t('dex.plsCoinDecimal'))
        return false
      }
      if (!this.getNum.trim()) {
        this.$toast.fail(this.$t('invite.plsSignAmt'))
        return false
      }
      return true
    },
    handleAddCoin() {
      if (!this.account.name) {
        return
      }
      if (!this.handleReg()) {
        return
      }
      const name = this.account.name;
      const permission = this.account.permissions;
      const reward = `${parseFloat(this.getNum || 0).toFixed(this.decimal || 4)} ${this.coinName.toUpperCase()}`;
      const limit = `${parseFloat(this.limit || 0).toFixed(4)} USDT`
      // name cnt, asset reward, asset limit, uint64_t weight
      const params = {
        actions: [{
          account: 'farms.tag',
          name: 'setreward',
          authorization: [{
            actor: name, // 转账者
            permission,
          }],
          data: {
            farmer: name,
            cnt: this.contract.trim(),
            // limit: this.limit.trim(),
            limit,
            reward,
            weight: 0,
          }
        }]
      }
      console.log(params)
      DApp.toTransaction(params, (err) => {
        if (err && err.code === 402) {
          return;
        }
        if (err) {
          this.$toast({
            type: 'fail',
            message: err.message,
          })
          return;
        }
        this.$toast({
          type: 'success',
          message: 'Success'
        })
        setTimeout(() => {
          this.$router.back()
        }, 2000);
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.addCoin{
  padding-bottom: 80px;
  font-size: 36px;
  min-height: 100vh;
  background: #f5f5f5;
  .title{
    background: #FFF;
    font-size: 36px;
    height: 80px;
    padding: 0 28px;
    .back{
      width: 50px;
      height: 50px;
      img{
        display: block;
        width: 18px;
      }
    }
  }
  .coinInfo{
    margin: 30px;
    text-align: left;
    .subTitle{
      font-size: 40px;
      font-weight: 500;
      margin-bottom: 15px;
      .checkCoin{
        color: $color-main;
        font-size: 36px;
        font-weight: normal;
      }
    }
    .iptInfo{
      background: #FFF;
      border-radius: 12px;
      padding: 28px 34px 0;
      font-size: 32px;
      .item{
        margin-bottom: 20px;
        border-bottom: 1px solid $color-border;
        &:last-child{
          margin-bottom: 0;
        }
      }
      .ipt{
        padding-left: 0px;
        font-size: 28px;
        color: #333;
      }
      .eg{
        color: $color-main;
        font-size: 26px;
      }
    }
  }
  .btn{
    font-size: 36px;
    color: #FFF;
    border-radius: 8px;
    height: 96px;
    background: $color-main;
    margin: 80px 30px 0;
  }
}
</style>
