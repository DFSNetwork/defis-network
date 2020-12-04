<template>
  <div class="story">
    <img class="close" @click="handleClose()"
      src="https://cdn.jsdelivr.net/gh/defis-net/material/svg/sd_icon_btn.svg" alt="">
    <div class="title">{{ story.title }}</div>
    <div class="actor tip flexb">
      <span class="flexend">
        <img class="artImg" src="https://cdn.jsdelivr.net/gh/defis-net/material/bpInfo/art.png" alt="">
        <span>{{ story.editor }}</span>
      </span>
      <span>{{ story.lTime }}</span>
    </div>
    <div class="content">{{ story.content }}</div>
  </div>
</template>

<script>
export default {
  name: 'bpStory',
  props: {
    story: {
      type: Object,
      default: function st() {
        return {}
      }
    }
  },
  methods: {
    handleClose(type) {
      this.$emit('listenClose', type)
    }
  }
}
</script>

<style lang="scss" scoped>
.story{
  position: relative;
  padding: 28px;
  color: #333;
  font-size: 28px;
  text-align: left;
  .close{
    position: absolute;
    top: 20px;
    right: 20px;
    width: 26px;
  }
  .title{
    font-size: 32px;
    font-weight: 500;
    margin-bottom: 15px;
    text-align: center;
  }
  .actor{
    font-size: 24px;
    margin-bottom: 20px;
    .artImg{
      width: 26px;
      display: block;
      // height: 28px;
      margin-right: 10px;
    }
  }
}
</style>
