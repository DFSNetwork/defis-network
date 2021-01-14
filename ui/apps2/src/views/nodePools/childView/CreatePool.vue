<template>
  <div class="createDex">
    <div class="titleDiv">
      <span class="el-icon-arrow-left back" @click="handleBack"></span>
      <span>{{ $t('nodePools.createPool') }}</span>
    </div>
    <div class="content">
      <div class="list">
        <div class="subTitle flexb">
          <span>{{ $t('dex.coin', {coin: ''}) }}</span>
          <span class="green" @click="handleShowList('pools')">{{ $t('createMarket.selectHas') }}</span>
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

      <div class="tipDiv">
        <span class="flexa mt10">{{ $t('nodePools.cpTip1') }}</span>
        <span class="flexa mt10">{{ $t('nodePools.cpTip2') }}</span>
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
      <market-list :marketLists="dealLists" :thisMarket0="symbol0"
        :type="type"
        @listenMarketChange="handleMarketChange"
        @listenClose="handleClose"/>
    </van-popup>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { EosModel } from '@/utils/eos';
import { login, dealSymArr } from '@/utils/public';
import MarketList from '@/components/MarketArea';

export default {
  name: 'createDex',
  data() {
    return {
      loading: false,
      showMarketList: false,
      type: 'other',
      symbol0: {
        contract: '', // eosio.token
        symbol: '', // EOS
        decimal: '4', // 4
      },
      dealLists: [],
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
  watch: {
    marketLists: {
      handler: function ml(newVal) {
        const dealLists = [];
        newVal.forEach(v => {
          if (v.contract0 !== 'eosio.token' && v.contract1 !== 'eosio.token') {
            return
          }
          dealLists.push(v)
        });
        this.dealLists = dealLists;
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    handleShowList(type) {
      this.type = type;
      this.showMarketList = true;
    },
    handleMarketChange(item) {
      this.symbol0 = item;
      console.log(item)
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
      if (!this.symbol0.contract || !this.symbol0.symbol) {
        return;
      }
      // 验证是否存在 /EOS 的交易对
      const arr = dealSymArr(this.dealLists)
      arr.shift()
      const has = arr.find(v => {
        return this.symbol0.contract === v.contract && this.symbol0.symbol === v.symbol
      })
      if (!has) {
        this.$message.error('当前币种未创建市场')
        return
      }
      this.loading = true;
      const formName = this.scatter.identity.accounts[0].name;
      const permission = this.scatter.identity.accounts[0].authority;
      const params = {
        actions: [{
          account: 'dfsfundation',
          name: 'createpool',
          authorization: [{
            actor: formName, // 转账者
            permission,
          }],
          data: {
            info: `${this.symbol0.contract}-${this.symbol0.symbol.toUpperCase()}-${this.symbol0.mid}`,
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
    font-size: 28px;
    color: #999;
    height: 112px;
    padding: 0 40px;
    .mt10{
      margin-top: 10px;
    }
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
