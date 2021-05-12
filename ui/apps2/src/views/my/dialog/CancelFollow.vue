<template>
  <div class="sureTip">
    <div class="title">{{ $t('my.cancelFollow') }}</div>
    <div class="content">{{ $t('my.cancelFlTip', {owner:checkItem.owner}) }}</div>
    <div class="btnDiv flexb">
      <div class="btn flexc cancel" @click="handleClose">{{ $t('public.cancel') }}</div>
      <div class="btn flexc" @click="handleSure">{{ $t('public.confirm') }}</div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { EosModel } from '@/utils/eos';
export default {
  name: '',
  props: {
    checkItem: {
      type: Object,
      default: function ci() {
        return {}
      }
    }
  },
  computed: {
    ...mapState({
      scatter: state => state.app.scatter,
    }),
  },
  methods: {
    handleClose() {
      this.$emit('listenClose', false)
    },
    handleSure() {
      const formName = this.scatter.identity.accounts[0].name;
      const permission = this.scatter.identity.accounts[0].authority;
      
      const params = {
        actions: [{
          account: 'dfscommunity',
          name: 'unfollow',
          authorization: [{
            actor: formName,
            permission,
          }],
          data: {
            user: formName,
            who: this.checkItem.owner,
          },
        }]
      }
      EosModel.toTransaction(params, (res) => {
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
        this.$emit('listenClose', true)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.sureTip{
  padding: 28px;
  color: #333;
  font-size: 28px;
  .title{
    font-size: 32px;
    font-weight: 500;
    margin-bottom: 15px;
  }
  .btnDiv{
    margin-top: 20px;
  }
  .btn{
    height: 70px;
    flex: 1;
    margin-right: 20px;
    background: rgba(#FE3B37, .18);
    color: #FE3B37;
    font-size: 32px;
    font-weight: 500;
    border-radius: 12px;
    &:last-child{
      margin-right: 0;
    }
    &.cancel{
      color: #999;
      background: #f5f5f5;
    }
  }
}
</style>
