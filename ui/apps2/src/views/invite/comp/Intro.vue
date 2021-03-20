<template>
  <div class="intro" v-html="intro">
  </div>
</template>

<script>
export default {
  name: 'farmIntro',
  props: {
    intro: {
      type: String,
      default: ''
    }
  },
}
</script>

<style lang="scss" scoped>
.intro{
  padding-bottom: 50px;
  font-size: 28px;
  text-align: left;
  margin: 0 28px;

  word-break: break-all;
  white-space: pre-wrap;
}
</style>
