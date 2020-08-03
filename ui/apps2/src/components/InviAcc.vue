<template>
  <div class="invi">
    <div class="title flexa">
      <span class="mr10">成为邀请人</span>
      <el-popover
            class="flexc"
            popper-class="mypopper"
            placement="top-start"
            trigger="click">
            <div class="qusTip">每当被邀请人通过邀请人链接完成一笔SWAP交易，该笔交易挖矿算力增加5%，其中4%归被邀请人，1%归邀请人。</div>
            <span slot="reference" class="flexc ml10"><img width="100%" src="@/assets/img/dex/tips_icon_btn.svg" alt=""></span>
          </el-popover>
    </div>
    <div class="myLink" v-if="link">
      <div class="subTitle">我的邀请链接</div>
      <div class="linkDiv">
        <span class="link">{{ link }}</span>
        <span class="copy" v-clipboard:copy="link"
          v-clipboard:success="onCopy"
          v-clipboard:error="onError">复制</span>
      </div>
    </div>
    <div class="content" v-loading="loading">
      <div v-if="!link">
        <div class="bold">方式一</div>
        <div>消耗100 DFS成为邀请人</div>
        <div class="btn flexc" @click="handleTransfer('join')">加入</div>
      </div>
      <div v-if="!link">
        <div class="bold">方式二</div>
        <div>抵押5000DFS成为邀请人，赎回后失去资格</div>
        <div class="btn flexc" @click="handleTransfer('stake')">抵押</div>
      </div>
      <div class="btnDiv flexb">
        <div class="btn redeem flexc" v-if="redeem" @click="handleRedeem()">赎回</div>
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
      loading: true,
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
      this.$message.success(this.$t('Copy Success'));
    },
    onError() {
      this.$message.error(this.$t('Copy Error'));
    },
    handleRedeem() {
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
        if(res.code) {
          this.$message({
            message: res.message,
            type: 'error'
          });
          return
        }
      })
    },
    handleTransfer(type) {
      const params = {
        code: 'minedfstoken',
        toAccount: 'dfsdfsfamily',
        memo: 'join', // stake
        quantity: '100.0000 DFS'
      }
      if (type === 'stake') { // 抵押DFS生成推荐码 - 赎回后销毁推荐码
        params.memo = type;
        params.quantity = '5000.0000 DFS'
      }
      EosModel.transfer(params, (res) => {
        if(res.code) {
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
