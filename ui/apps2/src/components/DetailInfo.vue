<template>
  <div class="detailInfo">
    {{ info }}
  </div>
</template>

<script>
export default {
  name: 'detailInfo',
  props: {
    info: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.detailInfo{
  font-size: 28px;
  padding: 28px;
  text-align: left;
}
</style>
