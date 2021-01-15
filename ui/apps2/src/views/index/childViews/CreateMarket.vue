<template>
  <div class="createDex">
    <div class="titleDiv">
      <span class="el-icon-arrow-left back" @click="handleBack"></span>
      <span>{{ $t('dex.addMarket') }}</span>
    </div>
    <div class="content">
      <div class="list">
        <div class="subTitle flexb">
          <span>{{ $t('dex.coin', {coin: 'A'}) }}</span>
          <span class="green" @click="handleShowList('start')">{{ $t('createMarket.selectHas') }}</span>
        </div>
        <el-form class="formDiv" ref="formBorrow">
          <!-- 抵押数量 -->
          <el-form-item>
            <div class="label">{{ $t('dex.contract') }}</div>
            <el-input v-model="symbol0.contract" type="text" :placeholder="$t('dex.plsContract')" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <div class="label">{{ $t('dex.coinName') }}</div>
            <el-input class="mt10" v-model="symbol0.symbol" type="text" :placeholder="$t('dex.plsCoinName')" clearable></el-input>
          </el-form-item>
          <el-form-item v-if="false">
            <div class="label">{{ $t('dex.coinDecimal') }}</div>
            <el-input class="mt10" v-model="symbol0.decimal" type="number" :placeholder="$t('dex.plsCoinDecimal')" clearable></el-input>
          </el-form-item>
        </el-form>
      </div>

      <div class="list">
        <div class="subTitle flexb">
          <span>{{ $t('dex.coin', {coin: 'B'}) }}</span>
          <span class="green" @click="handleShowList('end')">{{ $t('createMarket.selectHas') }}</span>
        </div>
        <el-form class="formDiv" ref="formBorrow">
          <el-form-item>
            <div class="label">{{ $t('dex.contract') }}</div>
            <el-input v-model="symbol1.contract" type="text" :placeholder="$t('dex.plsContract')"  clearable></el-input>
          </el-form-item>
          <el-form-item>
            <div class="label">{{ $t('dex.coinName') }}</div>
            <el-input class="mt10" v-model="symbol1.symbol" type="text" :placeholder="$t('dex.plsCoinName')" clearable></el-input>
          </el-form-item>
          <el-form-item v-if="false">
            <div class="label">{{ $t('dex.coinDecimal') }}</div>
            <el-input class="mt10" v-model="symbol1.decimal" type="number" :placeholder="$t('dex.plsCoinDecimal')" clearable></el-input>
          </el-form-item>
        </el-form>
      </div>

      <div class="tipDiv flex">
        <span class="flexa">
          {{ $t('createMarket.noFees') }}
        </span>
      </div>

      <div class="btnDiv">
        <el-button class="btn" type="primary" v-loading="loading"
          v-if="scatter.identity" @click="handleNewMarket" plain>{{ $t('dex.submit') }}</el-button>
        <el-button class="btn" type="primary" v-else @click="handleLogin">{{ $t('public.loginPls') }}</el-button>
      </div>
    </div>
    <!-- 弹窗组件 -->
    <van-popup
      class="newMarket"
      v-model="showMarketList"
      position="left">
      <market-list :marketLists="marketLists" :thisMarket0="symbol0" :thisMarket1="symbol1"
        :type="type"
        @listenMarketChange="handleMarketChange"
        @listenClose="handleClose"/>
    </van-popup>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { EosModel } from '@/utils/eos';
import { login } from '@/utils/public';
import MarketList from '@/components/MarketArea';

export default {
  name: 'createDex',
  data() {
    return {
      loading: false,
      showMarketList: false,
      type: 'pay',
      symbol0: {
        contract: 'eosio.token', // eosio.token
        symbol: 'EOS', // EOS
        decimal: '4', // 4
      },
      symbol1: {
        contract: '', // eosio.token
        symbol: '', // EOS
        decimal: '4', // 4
      }
    }
  },
  components: {
    MarketList
  },
  computed: {
    ...mapState({
      // 箭头函数可使代码更简练
      scatter: state => state.app.scatter,
      baseConfig: state => state.sys.baseConfig, // 基础配置 - 默认为{}
      marketLists: state => state.sys.marketLists,
    })
  },
  methods: {
    handleShowList(type) {
      this.type = type;
      this.showMarketList = true;
    },
    handleMarketChange(item) {
      if (this.type === 'start') {
        this.symbol0 = item;
      } else {
        this.symbol1 = item;
        this.symbol1.symbol = item.symbol;
      }
      this.showMarketList = false;
    },
    handleClose() {
      this.showMarketList = false;
    },
    handleBack() {
      this.$router.back();
    },
    handleLogin() {
      // this.$emit('listenLogin', true)
      login(this, () => {})
    },
    handleNewMarket() {
      if (this.loading) {
        return
      }
      if (!this.symbol0.contract || !this.symbol0.symbol || !this.symbol1.contract || !this.symbol1.symbol) {
        return;
      }
      this.loading = true;
      const formName = this.scatter.identity.accounts[0].name;
      const permission = this.scatter.identity.accounts[0].authority;
      const params = {
        actions: [{
          account: 'defisfactory',
          name: 'newmarket',
          authorization: [{
            actor: formName, // 转账者
            permission,
          }],
          data: {
            creator: formName,
            memo: `${this.symbol0.contract}-${this.symbol0.symbol.toUpperCase()}-${this.symbol1.contract}-${this.symbol1.symbol.toUpperCase()}`,
          }
        }]
      }
      EosModel.toTransaction(params, (res) => {
        this.loading = false;
        if(res.code && JSON.stringify(res.code) !== '{}') {
          this.$message({
            message: res.message,
            type: 'error'
          });
          return
        }
        this.$emit('listenGetMarketsList', true)
        this.$router.back()
        this.$message({
          message: this.$t('public.success'),
          type: 'success'
        });
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.green{
  color: #02C698;
  font-size: 27px
}
.createDex{
  min-height: 100vh;
  position: relative;
  .titleDiv{
    display: flex;
    align-items: center;
    justify-content: center;
    height: 120px;
    position: relative;
    color: #000;
    font-size: 30px;
    .back{
      font-size: 32px;
      position: absolute;
      left: 40px;
      top: 50%;
      transform: translate(0%, -50%);
    }
  }
  .content{
    box-sizing: border-box;
    background: #FAFAFA;
    // padding: 20px 18px;
    position: relative;
    min-height: calc(100vh - 100px);
    .subTitle{
      padding: 0 40px;
      height: 118px;
      text-align: left;
      font-size: 30px;
      color: #000;
    }
  }
  .formDiv{
    background: #FFF;
    border-radius: 8px;
    padding: 40px;
    .label{
      font-size: 28px;
      text-align: left;
      line-height: normal;
      color: #2F3F52;
    }
    /deep/ .el-form-item{
      // margin-bottom: 5px;
      &:last-child{
        margin-bottom: 0px;
      }
    }

    /deep/ .el-input{
      background-color: transparent;
      height: 94px;
      display: flex;
      align-items: center;
      .el-input__inner{
        height: 94px;
        color: #070707;
        font-weight: 500;
        background-color: transparent;
        font-size: 30px;
        padding-left: 0px;
        outline: none;
        border: 1px solid transparent;
        border-bottom: 1px solid #F3F3F3;
        &:focus{
          border-bottom: 1px solid #07D79B;
        }
      }
      .el-input__suffix{
        color: #070707;
        font-weight: 500;
        font-size: 16px;
      }
    }
  }
  .tipDiv{
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 28px;
    color: #999;
    height: 112px;
    padding: 0 40px;
    .ml10{
      margin-left: 10px;
    }

    .fees{
      color: #000;
    }

    .tip{
      margin-left: 5px;
      font-size: 16px;
    }
  }
  .btnDiv{
    margin: 0 40px;
  }
  .btn{
    display: block;
    width: 100%;
    font-size: 32px;
    box-sizing: border-box;
    color: #fff;
    border-color: transparent;
    height:88px;
    background:rgba(7,215,155,1);
    border-radius:30px;
    overflow: hidden;
  }
}
.mkListDia{
  // animation: none;
  /deep/ .el-dialog{
    position: absolute;
    bottom: 0px;
    margin: 0px;
    width: 100%;
    border-radius:30px 30px 0px 0px;
    .el-dialog__body,
    .el-dialog__header{
      padding: 0;
    }
  }
  &.pcList{
    /deep/ .el-dialog{
      position: relative;
      margin: auto;
      width: 670px;
      border-radius:30px;
    }
  }
}
</style>
