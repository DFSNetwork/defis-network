<template>
  <div class="createDex">
    <div class="titleDiv">
      <span class="iconfont icon-huaban29 back" @click="handleBack"></span>
      <span>{{ $t('dex.addMarket') }}</span>
    </div>
    <div class="content">
      <div class="list">
        <div class="subTitle">{{ $t('dex.coin', {coin: 'A'}) }}</div>
        <el-form class="formDiv" ref="formBorrow">
          <!-- 抵押数量 -->
          <el-form-item>
            <div class="label">{{ $t('dex.contract') }}</div>
            <el-input v-model="symnol0.contract" type="text" :placeholder="$t('dex.plsContract')" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <div class="label">{{ $t('dex.coinName') }}</div>
            <el-input class="mt10" v-model="symnol0.coinName" type="text" :placeholder="$t('dex.plsCoinName')" clearable></el-input>
          </el-form-item>
          <el-form-item v-if="false">
            <div class="label">{{ $t('dex.coinDecimal') }}</div>
            <el-input class="mt10" v-model="symnol0.decimal" type="number" :placeholder="$t('dex.plsCoinDecimal')" clearable></el-input>
          </el-form-item>
        </el-form>
      </div>

      <div class="list">
        <div class="subTitle">{{ $t('dex.coin', {coin: 'B'}) }}</div>
        <el-form class="formDiv" ref="formBorrow">
          <el-form-item>
            <div class="label">{{ $t('dex.contract') }}</div>
            <el-input v-model="symnol1.contract" type="text" :placeholder="$t('dex.plsContract')"  clearable></el-input>
          </el-form-item>
          <el-form-item>
            <div class="label">{{ $t('dex.coinName') }}</div>
            <el-input class="mt10" v-model="symnol1.coinName" type="text" :placeholder="$t('dex.plsCoinName')" clearable></el-input>
          </el-form-item>
          <el-form-item v-if="false">
            <div class="label">{{ $t('dex.coinDecimal') }}</div>
            <el-input class="mt10" v-model="symnol1.decimal" type="number" :placeholder="$t('dex.plsCoinDecimal')" clearable></el-input>
          </el-form-item>
        </el-form>
      </div>

      <div class="tipDiv flex">
        <span>{{ $t('public.fee') }}：50.0000 DFS</span>
        <span class="iconfont icon-huaban tip" @click="handleShowTip"></span>
      </div>

      <el-button class="btn" type="primary" v-if="scatter.identity" @click="handleNewMarket" plain>{{ $t('dex.submit') }}</el-button>
      <el-button class="btn" type="primary" v-else @click="handleLogin">{{ $t('public.loginPls') }}</el-button>
    </div>
    <create-tip ref="createTip" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { EosModel } from '@/utils/eos';
import CreateTip from '../components/CreateTip';

export default {
  name: 'createDex',
  data() {
    return {
      symnol0: {
        contract: 'eosio.token', // eosio.token
        coinName: 'EOS', // EOS
        decimal: '4', // 4
      },
      symnol1: {
        contract: '', // eosio.token
        coinName: '', // EOS
        decimal: '', // 4
      }
    }
  },
  components: {
    CreateTip
  },
  computed: {
    ...mapState({
      // 箭头函数可使代码更简练
      scatter: state => state.app.scatter,
      baseConfig: state => state.sys.baseConfig, // 基础配置 - 默认为{}
    })
  },
  methods: {
    handleShowTip() {
      this.$refs.createTip.showTip = true;
    },
    handleBack() {
      this.$router.back();
    },
    handleLogin() {
      this.$emit('listenLogin', true)
    },
    handleNewMarket() {
      const params = {
        code: 'minedfstoken',
        toAccount: 'defisfactory',
        memo: `${this.symnol0.contract}-${this.symnol0.coinName.toUpperCase()}-${this.symnol1.contract}-${this.symnol1.coinName.toUpperCase()}`,
        quantity: '50.0000 DFS'
      }
      // console.log(params)
      EosModel.transfer(params, (res) => {
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
    handleNewMarket1() {
      const formName = this.scatter.identity.accounts[0].name;
      const permission = this.scatter.identity.accounts[0].authority;
      const params = {
        actions: [{
          account: this.baseConfig.createMarket,
          name: 'newmarket',
          authorization: [{
            actor: formName, // 转账者
            permission,
          }],
          data: {
            creator: formName,
            contract0: this.symnol0.contract,
            contract1: this.symnol1.contract,
            // sym0: `${this.symnol0.decimal},${this.symnol0.coinName.toUpperCase()}`,
            // sym1: `${this.symnol1.decimal},${this.symnol1.coinName.toUpperCase()}`
            sym0: `${this.symnol0.coinName.toUpperCase()}`,
            sym1: `${this.symnol1.coinName.toUpperCase()}`
          }
        }]
      }
      // console.log(params)
      EosModel.toTransaction(params, (res) => {
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
    }
  },
}
</script>

<style lang="scss" scoped>
.createDex{
  min-height: 100vh;
  position: relative;
  .titleDiv{
    display: flex;
    align-items: center;
    justify-content: center;
    height: 44px;
    position: relative;
    color: #070707;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,0.08);
    .back{
      font-size: 16px;
      position: absolute;
      left: 10px;
      top: 50%;
      transform: translate(0%, -50%) rotate(180deg);
    }
  }
  .content{
    box-sizing: border-box;
    padding: 20px 18px;
    position: relative;
    min-height: calc(100vh - 44px);
    .subTitle{
      text-align: left;
      margin-bottom: 10px;
      font-size: 14px;
      color: #070707;
      font-weight: 500;
    }
  }
  .formDiv{
    background: #F5F5F5;
    border-radius: 8px;
    padding: 20px 20px 10px 20px;
    margin-bottom: 12px;
    .label{
      font-size: 14px;
      text-align: left;
      font-weight: 500;
      line-height: normal;
    }
    /deep/ .el-form-item{
      margin-bottom: 5px;
      &:last-child{
        margin-bottom: 0px;
      }
    }

    /deep/ .el-input{
      background-color: transparent;
      .el-input__inner{
        color: #070707;
        font-weight: 500;
        background-color: transparent;
        font-size: 18px;
        padding-left: 0px;
        outline: none;
        border: 1px solid transparent;
        &:focus{
          border-color: transparent;
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
    font-size: 12px;
    color: #999;

    .tip{
      margin-left: 5px;
      font-size: 16px;
    }
  }
  .btn{
    margin: 20px 0 0;
    // position: absolute;
    bottom: 5px;
    left: 0px;
    width: calc(100%);
    background: #42B48F;
    color: #fff;
    border-color: transparent;
  }
}
</style>
