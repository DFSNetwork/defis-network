<template>
  <div class="preview">
    <div class="title">存款预览</div>
    <div class="content">
      <div class="item">
        <span>存款数量：</span>
        <span>{{ params.payNum || '0.0000' }} DFS</span>
      </div>
      <div class="item">
        <span>存款时间：</span>
        <span>{{ params.date || '3个月' }}</span>
      </div>
      <div class="item">
        <span>已有存款：</span>
        <span>{{ params.hasNum || '0.0000' }} DFS</span>
      </div>
      <div class="item">
        <span>总计：</span>
        <span>{{ params.total || '0.0000' }} DFS</span>
      </div>
      <div class="item">
        <span>预计到期时间：</span>
        <span>{{ params.localDate || '2020-11-27' }}</span>
      </div>
    </div>
    <div class="btnDiv flexb">
      <div class="btn flexc cancel" @click="handleClose">取消</div>
      <div class="btn flexc sure">确认</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  props: {
    params: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('listenClose')
    }
  },
}
</script>

<style lang="scss" scoped>
.preview{
  padding: 40px;
  color: #000;
  .title{
    text-align: center;
    font-size: 32px;
    color: rgba(7,215,155,1);
    margin-bottom: 20px;
  }
  .content{
    padding: 20px 30px;
    border-radius: 30px;
    border: 1px solid #f3f3f3;
    font-size: 28px;
    .item{
      display: flex;
      align-items: center;
      justify-content: center;

      &>span{
        flex: 1;
        max-width: 50%;
        height: 50px;
        display: flex;
        align-items: center;
        &:first-child{
          justify-content: flex-end;
        }
      }
    }
  }
  .btnDiv{
    margin: 40px 0 0;
    font-size: 32px;
    // font-weight: 500;
    .btn{
      flex: 1;
      height: 88px;
      background:rgba(7,215,155,1);
      border-radius:30px;
      color: #fff;
      &:first-child{
        margin-right: 8px;
        background: #FFF;
        color: $color-tip;
        border: 1px solid #e3e3e3;
        &:active{
          background: linear-gradient(#eee, #ededed);
        }
      }
      &:active{
        background:rgba(2,198,152,1);
      }
    }
  }
}
</style>
