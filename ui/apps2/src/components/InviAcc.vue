<template>
  <div class="invi">
    <div class="title flexa">
      <span class="mr10">{{ $t('invi.toInviter') }}</span>
      <el-popover
            class="flexc"
            popper-class="mypopper"
            placement="top-start"
            trigger="click">
            <div class="qusTip">{{ $t('invi.whatIsInviter') }}</div>
            <span slot="reference" class="flexc ml10"><img width="100%" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/tips_icon_btn.svg" alt=""></span>
          </el-popover>
    </div>
    <div class="myLink" v-if="link">
      <div class="subTitle">{{ $t('invi.myLink') }}</div>
      <div class="linkDiv">
        <span class="link">{{ link }}</span>
        <span class="copy" v-clipboard:copy="link"
          v-clipboard:success="onCopy"
          v-clipboard:error="onError">{{ $t('invi.copy') }}</span>
      </div>
    </div>
    <div class="content" v-loading="loading">
      <div v-if="!link">
        <div class="bold">{{ $t('invi.way1') }}</div>
        <div>{{ $t('invi.way1Tip') }}</div>
        <div class="btn flexc" v-loading="joinLoading" @click="handleTransfer('join')">{{ $t('invi.join') }}</div>
      </div>
      <div v-if="!link">
        <div class="bold">{{ $t('invi.way2') }}</div>
        <div>{{ $t('invi.way2Tip') }}</div>
        <div class="btn flexc" v-loading="stakeLoading"  @click="handleTransfer('stake')">{{ $t('bank.stake') }}</div>
      </div>
      <div class="btnDiv flexb">
        <div class="btn redeem flexc" v-if="redeem" v-loading="unstakeLoading"
          @click="handleRedeem()">{{ $t('bank.redeem') }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { EosModel } from '@/utils/eos';
export default {
  data() {
    return {
      link: '',
      redeem: false, // 是否可赎回
      loading: false,
      joinLoading: false,
      stakeLoading: false,
      unstakeLoading: false,
    }
  },
  computed: {
    ...mapState({
      scatter: state => state.app.scatter,
    })
  },
  watch: {
    scatter: {
      handler: function listen(newVal) {
        if (newVal.identity) {
          // console.log(newVal.identity.accounts[0].name)
          this.handleGetInviAcc()
          this.handleGetStakes();
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    handleGetInviAcc() {
      this.loading = true;
      const params = {
        "code": "dfsdfsfamily",
        "scope": "dfsdfsfamily",
        "table": "codes",
        "index_position": 2,
        "key_type": "i64",
        "lower_bound": ` ${this.scatter.identity.accounts[0].name}`,
        "upper_bound": ` ${this.scatter.identity.accounts[0].name}`,
        // "lower_bound": ' dfsdeveloper',
        // "upper_bound": ' dfsdeveloper',
        "json": true,
      }
      EosModel.getTableRows(params, (res) => {
        this.loading = false;
        if (!res.rows.length) {
          this.link = ''
          return
        }
        this.link = `https://apps.defis.network?code=${this.scatter.identity.accounts[0].name}`;
        // console.log(this.link)
      })
    },
    handleGetStakes() {
      const params = {
        "code": "dfsdfsfamily",
        "scope": "dfsdfsfamily",
        "table": "stakes",
        "lower_bound": ` ${this.scatter.identity.accounts[0].name}`,
        "upper_bound": ` ${this.scatter.identity.accounts[0].name}`,
        // "lower_bound": " dfsdeveloper",
        // "upper_bound": " dfsdeveloper",
        "json": true,
      }
      EosModel.getTableRows(params, (res) => {
        if (!res.rows.length) {
          this.redeem = false;
          return
        }
        this.redeem = true;
      })
    },
    onCopy() {
      this.$message.success(this.$t('public.copySuccess'));
    },
    onError() {
      this.$message.error(this.$t('public.copyFail'));
    },
    handleRedeem() {
      this.unstakeLoading = true;
      // cleos push action dfsdfsfamily unstake '["joetothemoon"]' -p joetothemoon
      const formName = this.$store.state.app.scatter.identity.accounts[0].name;
      const permission = this.$store.state.app.scatter.identity.accounts[0].authority;
      const params = {
        actions: [
          {
            account: 'dfsdfsfamily',
            name: 'unstake',
            authorization: [{
              actor: formName, // 转账者
              permission,
            }],
            data: {
              user: formName,
            }
          }
        ]
      }
      EosModel.toTransaction(params, (res) => {
        this.unstakeLoading = false;
        if(res.code && JSON.stringify(res.code) !== '{}') {
          this.$message({
            message: res.message,
            type: 'error'
          });
          return
        }
      })
    },
    handleTransfer(type) {
      if (type === 'stake') {
        if (this.stakeLoading) {
          return
        }
        this.stakeLoading = true;
      } else {
        if (this.joinLoading) {
          return
        }
        this.joinLoading = true
      }
      const params = {
        code: 'minedfstoken',
        toAccount: 'dfsdfsfamily',
        memo: 'join', // stake
        quantity: '100.0000 DFS'
      }
      if (type === 'stake') { // 抵押DFS生成推荐码 - 赎回后销毁推荐码
        params.memo = type;
        params.quantity = '5000.0000 DFS';
      }
      EosModel.transfer(params, (res) => {
        type === 'stake' ? this.stakeLoading = false : this.joinLoading = false;
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
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.mypopper{
  .qusTip{
    padding: 10px;
    width: 340px;
    font-size: 24px;
  }
}
.mr10{
  margin-right: 10px;
}
.invi{
  text-align: left;
  color: #000;
  .title{
    font-size: 30px;
    font-weight: 500;
  }
  .myLink{
    margin-top: 20px;
    .subTitle{
      font-size: 26px;
      font-weight: 500;
    }
    .linkDiv{
      margin-top: 5px;
      .link{
        color: #999;
      }
      .copy{
        margin-left: 10px;
        color: #07d79b;
      }
    }
  }
  .content{
    margin-top: 20px;
    .bold{
      font-weight: 500;
    }
  }
  .btn{
    flex: 1;
    color: #FFF;
    background: #07d79b;
    padding: 0 16px;
    height: 60px;
    border-radius: 20px;
    margin: 15px 0;
    margin-right: 10px;

    &.redeem{
      background: #c05d5d;
      margin-right: 0px;
    }
  }
}
</style>
