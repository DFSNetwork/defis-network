<template>
  <div class="cancelSure">
    <div class="title">{{ $t('pddex.cancelOrder') }}</div>
    <div class="content">{{ $t('pddex.cancelTip') }}</div>
    <div class="btnDiv flexb">
      <van-button class="btn tip" plain type="default"
        @click="handleCancel">{{ $t('public.cancel') }}</van-button>
      <van-button class="btn" plain type="danger"
        @click="handleCancelOrder">{{ $t('public.confirm') }}</van-button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { DApp } from '@/utils/wallet';

export default {
  name: 'cancelSure',
  props: {
    item: {
      type: Object,
      default: function it() {
        return {}
      }
    },
    itemIndex: {
      type: Number,
      default: -1
    }
  },
  computed: {
    ...mapState({
      baseConfig: state => state.sys.baseConfig, // 基础配置 - 默认为{}
      account: state => state.app.account, // 开发环境
    })
  },
  methods: {
    handleCancel() {
      this.$emit('handleClose', false)
    },
    handleCancelOrder() {
      const actor = this.account.name;
      const permission = this.account.permissions;
      let params = {}
      if (!this.item.pid) {
        // 没有pid - 执行新的撤单action
        params = {
          actions: [
            {
              account: this.baseConfig.pddex,
              name: 'cancel2',
              authorization: [{
                actor, // 转账者
                permission,
              }],
              data: {
                pid: this.item.mid,
                oid: this.item.oid,
              }
            },
          ]
        }
      } else {
        params = {
          actions: [
            {
              account: this.baseConfig.pddex,
              name: 'cancel',
              authorization: [{
                actor, // 转账者
                permission,
              }],
              data: {
                pid: this.item.pid,
                oid: this.item.oid,
              }
            },
          ]
        }
      }
      console.log(params)
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
        this.$emit('cancelSuccess', this.itemIndex);
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.cancelSure{
  width: 500px;
  border-radius: 15px;
  overflow: hidden;
  background: #FFF;
  padding: 40px;
  .title{
    font-size: 30px;
    color: #ee0a24;
    margin-bottom: 20px;
  }
  .btnDiv{
    margin-top: 20px;
    .btn{
      flex: 1;
      &:last-child{
        margin-left: 20px;
      }
    }
    .van-button{
      height: 80px !important;
    }
  }
}
</style>
