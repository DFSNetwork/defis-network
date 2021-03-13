<template>
  <div class="marketInfo">
    <div class="flexb info">
      <div class="coin flexa">
        <div class="token flexa">
          <img class="coinImg" :src="checkedMarket.imgUrl1 || errorCoinImg" :onerror="errorCoinImg">
          <div class="">
            <div class="tokenName">{{ checkedMarket.symbol1 }}</div>
            <div class="tokenContract tip">{{ checkedMarket.contract1 }}</div>
          </div>
        </div>
        <img class="add" src="https://cdn.jsdelivr.net/gh/defis-net/material/svg/add.svg" alt="">
        <div class="token flexa">
          <img class="coinImg" :src="checkedMarket.imgUrl0 || errorCoinImg" :onerror="errorCoinImg">
          <div class="">
            <div class="tokenName">{{ checkedMarket.symbol0 }}</div>
            <div class="tokenContract tip">{{ checkedMarket.contract0 }}</div>
          </div>
        </div>
      </div>
      <div class="follow">
        <img v-if="isLike" @click="handleCancelLike" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/star-is.png">
        <img v-else @click="handleAddLike" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/star-un.png">
      </div>
    </div>
    <div class="flexb dinBold price">
      <div class="flexa">
        <span v-if="!isExPrice">1 {{ checkedMarket.symbol1 }} ≈ {{ checkedMarket.price }} {{ checkedMarket.symbol0 }}</span>
        <span v-else>1 {{ checkedMarket.symbol0 }} ≈ {{ exPrice }} {{ checkedMarket.symbol1 }}</span>
        <span @click="isExPrice = !isExPrice" class="flexa">
          <img v-if="isExPrice" class="exImg" src="https://cdn.jsdelivr.net/gh/defis-net/material2/icon/price_switch_icon_btn_left.svg" alt="">
          <img v-else class="exImg" src="https://cdn.jsdelivr.net/gh/defis-net/material2/icon/price_switch_icon_btn_right.svg" alt="">
        </span>
      </div>
      <span class="tip dinReg" v-if="language === 'en'">
        <span>$</span>
        <span>{{ checkedMarket.aboutPriceU }}</span>
      </span>
      <span class="tip dinReg" v-else>
        <span>¥</span>
        <span>{{ checkedMarket.aboutPriceCNY }}</span>
      </span>
    </div>
    <div class="flexb rate">
      <span class="tip dinReg">24H额：{{ (checkedMarket.volume24H || 0) }}</span>
      <span class="green dinBold"
        :class="{'green': parseFloat(checkedMarket.price_change_rate) > 0,
                 'red': parseFloat(checkedMarket.price_change_rate) < 0}">
        {{ checkedMarket.priceRate || '-' }}
      </span>
    </div>

    <!-- 详细数据 -->
    <div class="bg">
      <div class="item">
        <div class="subTitle">做市年化收益</div>
        <div class="num flexa">
          <span>实时收益：{{ checkedMarket.countApy }}%</span>
          <span class="detail" @click="showApyDetail = true">详情></span>
        </div>
      </div>
      <div class="item">
        <div class="subTitle flexa">
          <span>流动池数量</span>
          <span class="detail" @click="handleTo('poolsMarket')">前往矿池></span>
        </div>
        <div class="num flexa dinReg">
          {{ checkedMarket.reserve1 }} / {{ checkedMarket.reserve0 }}
        </div>
      </div>
      <div class="flexa subTitle">
        <span>成为做市商可赚取交易手续费</span>
        <img class="qusImg" @click="showAboutMarket = true" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/tips_icon_btn.svg" alt="">
      </div>
    </div>

    <!-- 年化详情 -->
    <el-dialog
      class="myDialog apy"
      :visible.sync="showApyDetail">
      <MarketApy :countApy="checkedMarket.countApy" :isActual="true"
                 :aprInfo="checkedMarket"/>
    </el-dialog>

    <!-- 关于做市 -->
    <el-dialog
      class="myDialog apy"
      :show-close="false"
      :visible.sync="showAboutMarket">
      <AboutMarket />
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { DApp } from '@/utils/wallet';
import MarketApy from '@/views/market/popup/MarketApy'
import AboutMarket from '@/views/market/popup/AboutMarket'

export default {
  props: {
    checkedMarket: {
      type: Object,
      default: function cmt() {
        return {}
      }
    }
  },
  components: {
    MarketApy,
    AboutMarket,
  },
  data() {
    return {
      errorCoinImg: 'this.src="https://ndi.340wan.com/eos/eosio.token-eos.png"',
      likeArr: [],
      isExPrice: false,
      showApyDetail: false,
      showAboutMarket: false,
    }
  },
  computed: {
    ...mapState({
      account: state => state.app.account,
      language: state => state.app.language,
    }),
    isLike() {
      const has = this.likeArr.find(v => v.mid === this.checkedMarket.mid)
      return !!has;
    },
    exPrice() {
      if (!parseFloat(this.checkedMarket.price)) {
        return 0
      }
      const exp = 1 / parseFloat(this.checkedMarket.price);
      return exp.toFixed(6)
    },
  },
  watch: {
    account: {
      handler: function acc(newVal) {
        if (!newVal.name) {
          return
        }
        this.handleGetLikes();
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    handleTo(name) {
      this.$router.push({
        name,
        params: {
          mid: this.checkedMarket.mid
        }
      })
    },
    async handleGetLikes() {
      if (!this.account.name) {
        return
      }
      const {status, result} = await this.$api.get_acc_follow();
      if (!status) {
        return
      }
      const rows = result.rows;
      if (!rows.length) {
        this.likeArr = [];
        return
      }
      this.likeArr = rows;
    },

    handleCancelLike() {
      if (!this.account.name) {
        return
      }
      const formName = this.account.name;
      const permission = this.account.permissions;
      const params = {
        actions: [{
          account: 'dfsusersinfo',
          name: 'unlike',
          authorization: [{
            actor: formName, // 转账者
            permission,
          }],
          data: {
            user: formName,
            mid: this.checkedMarket.mid
          }
        }]
      }
      DApp.toTransaction(params, (err) => {
        if (err && err.code === 402) {
          return;
        }
        if (err) {
          this.$message({
            type: 'error',
            message: err.message,
          })
          return;
        }
        this.$message({
          type: 'success',
          message: '操作成功'
        })
        setTimeout(() => {
          this.handleGetLikes()
        }, 1000);
      })
    },
    handleAddLike() {
      if (!this.account.name) {
        return
      }
      const formName = this.account.name;
      const permission = this.account.permissions;
      const params = {
        actions: [{
          account: 'dfsusersinfo',
          name: 'like',
          authorization: [{
            actor: formName, // 转账者
            permission,
          }],
          data: {
            user: formName,
            mid: this.checkedMarket.mid
          }
        }]
      }
      DApp.toTransaction(params, (err) => {
        if (err && err.code === 402) {
          return;
        }
        if (err) {
          this.$message({
            type: 'error',
            message: err.message,
          })
          return;
        }
        this.$message({
          type: 'success',
          message: '操作成功'
        })
        setTimeout(() => {
          this.handleGetLikes()
        }, 1000);
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.marketInfo{
  padding: 40px 28px;
  .info{
    margin-bottom: 27px;
  }
  .coin{
    flex: 1;
    .token{
      // flex: 1;
      min-width: 200px;
      max-width: 300px;
    }
    .coinImg{
      width: 60px;
      height: 60px;
      border-radius: 30px;
      margin-right: 10px;
    }
    .tokenName{
      font-size: 28px;
    }
    .tokenContract{
      font-size: 24px;
      margin-top: 0px;
    }
    .add{
      margin: 0 30px;
    }
  }
  .follow{
    // width: 42px;
    img{
      width: 42px;
    }
  }
  .price{
    font-size: 30px;
    margin-bottom: 15px;
    .exImg{
      width: 36px;
      margin-left: 20px;
    }
  }
  .rate{
    margin-bottom: 26px;
    .green{
      color: #1FCD12; // #29d4b0 // 1FCD12
    }
    .red {
      color: #fe3b37;
    }
  }
  .bg{
    padding: 26px 22px;
    background: #FAFAFA;
    border-radius: 20px;
    .item{
      margin-bottom: 12px;
      .detail{
        color: #29d4b0;
        margin-left: 20px;
      }
    }
    .subTitle{
      color: #A6A6A6;
    }
    .qusImg{
      width: 28px;
      margin-left: 16px;
    }
  }
}

.myDialog{
  /deep/ .el-dialog{
    position: relative;
    margin: auto;
    width: 570px;
    border-radius: 20px;
    .el-dialog__body,
    .el-dialog__header{
      padding: 0;
    }
  }
  &.apy{
    /deep/ .el-dialog{
      width: 620px;
    }
  }
}
</style>
