<template>
  <div class="moreTip">
    <div class="title">温馨提示</div>
    <div class="content">
      <div>您的农活太多啦～为了保证顺利完成，将发起多个请求！每次最多执行10条。</div>
      <div class="step">
        <span>当前进度：</span>
        <span>{{ already }} / {{ allActions.length }}</span>
      </div>
    </div>
    <div class="flexb">
      <div class="btn cancel flexc" @click="handleClose()">取消</div>
      <div class="btn flexc" v-loading="loading" @click="handleSure">
        <span v-if="!already">确认执行</span>
        <span v-else>继续执行</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'moreTip',
  props: {
    allActions: {
      type: Array,
      default: function aa() {
        return []
      }
    },
    nextPage: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      page: 0,
      pageSize: 10,
      loading: false,
    }
  },
  computed: {
    already() {
      const len = this.page * this.pageSize;
      return len > this.allActions.length ? this.allActions.length : len
    }
  },
  watch: {
    nextPage(newVal) {
      this.loading = false;
      if (newVal === -1) {
        return
      }
      this.page = this.nextPage;
      if (this.already >= this.allActions.length) {
        this.handleClose(true)
      }
    }
  },
  methods: {
    handleClose(type) {
      this.$emit('listenClose', type || false)
    },
    handleSure() {
      this.loading = true
      this.$emit('listenSure', this.page);
    }
  }
}
</script>

<style lang="scss" scoped>
.moreTip{
  font-size: 27px;
  padding: 40px;
  text-align: left;
  color: #000;
  .title{
    text-align: center;
    font-size: 33px;
    margin-bottom: 20px;
    color: #f5a623;
  }
  .content{
    .step{
      font-size: 30px;
      text-align: center;
      margin: 8px 0;
    }
  }
  .btn{
    flex: 1;
    margin-top: 20px;
    font-size: 27px;
    background:rgba(7,215,155,1);
    border-radius: 30px;
    color: #fff;
    padding: 14px 25px;
    &:active{
      background:rgba(2,198,152,1);
    }
    &.backBtn{
      background:rgba(192,93,93,1);
      margin-left: 15px;
      &:active{
        background:rgba(185,78,90,1);
      }
    }
    &.cancel{
      background: rgba(7,215,155,1);
      margin-right: 20px;
      color: #999;
      background:#fafafa;
      border: 1px solid #eee;
    }
  }
}
</style>
