<template>
  <div class="invi">
    <div class="title flexa">
      <span class="mr10">成为推荐人</span>
      <el-popover
            class="flexc"
            popper-class="mypopper"
            placement="top-start"
            trigger="click">
            <div class="qusTip">{{ $t('dex.slipTip') }}</div>
            <span slot="reference" class="flexc ml10"><img width="100%" src="@/assets/img/dex/tips_icon_btn.svg" alt=""></span>
          </el-popover>
    </div>
    <div class="myLink">
      <div class="subTitle">我的邀请链接</div>
      <div class="linkDiv">
        <span class="link">https://apps.defis.network?code=testtesttest</span>
        <span class="copy" v-clipboard:copy="'https://apps.defis.network?code=testtesttest'"
          v-clipboard:success="onCopy"
          v-clipboard:error="onError">复制</span>
      </div>
    </div>
    <div class="content">
      <div>成为邀请人可以获得</div>
      <div class="bold">方式一</div>
      <div>消耗100 DFS成为邀请人</div>
      <div class="btn flexc" @click="handleTransfer('join')">加入</div>
      <div class="bold">方式二</div>
      <div>抵押5000DFS成为邀请人，赎回后失去资格</div>
      <div class="btn flexc" @click="handleTransfer('stake')">抵押</div>
    </div>
  </div>
</template>

<script>
import { EosModel } from '@/utils/eos';
export default {
  data() {
    return {}
  },
  methods: {
    onCopy() {
      this.$message.success(this.$t('Copy Success'));
    },
    onError() {
      this.$message.error(this.$t('Copy Error'));
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
    color: #FFF;
    background: #07d79b;
    padding: 0 16px;
    height: 60px;
    border-radius: 20px;
    margin: 15px 0;
  }
}
</style>
