<template>
  <div class="content">
    {{ content }}
  </div>
</template>

<script>
export default {
  name: 'showContent',
  props: {
    content: {
      type: String,
      default: '',
    },
  }
}
</script>

<style lang="scss" scoped>
.content{
  font-size: 28px;
  padding: 28px;
  border-radius: 12px;
  color: #333;

  .code{
    margin: 18px 0;
    background: #f5f5f5;
    border-radius: 12px;
    padding: 28px;
  }
}
</style>
