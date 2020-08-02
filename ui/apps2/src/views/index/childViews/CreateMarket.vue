<template>
  <div class="createDex">
    <div class="titleDiv">
      <span class="el-icon-arrow-left back" @click="handleBack"></span>
      <span>{{ $t('dex.addMarket') }}</span>
    </div>
    <div class="content">
      <div class="list">
        <div class="subTitle flexa">{{ $t('dex.coin', {coin: 'A'}) }}</div>
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
        <div class="subTitle flexa">{{ $t('dex.coin', {coin: 'B'}) }}</div>
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
        <span class="flexa">
          <span>{{ $t('public.fee') }}</span>
          <span  @click="handleShowTip" class="flexc ml10"><img width="100%" src="@/assets/img/dex/tips_icon_btn.svg" alt=""></span>
        </span>
        <span class="fees">
          50.0000 DFS
        </span>
      </div>

      <div class="btnDiv">
        <el-button class="btn" type="primary" v-if="scatter.identity" @click="handleNewMarket" plain>{{ $t('dex.submit') }}</el-button>
        <el-button class="btn" type="primary" v-else @click="handleLogin">{{ $t('public.loginPls') }}</el-button>
      </div>
    </div>
    <create-tip ref="createTip" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { EosModel } from '@/utils/eos';
import { login } from '@/utils/public';
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
      // this.$emit('listenLogin', true)
      login(this, () => {})
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
        if(res.code) {
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
        if(res.code) {
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
      padding-left: 40px;
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
    font-size: 12px;
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
  }
}
</style>
