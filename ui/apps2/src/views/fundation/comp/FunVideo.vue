<template>
  <div class="video">
    <video class="myVideo" controls>
      <source :src="src">
      <!-- <source src="https://cdn.jsdelivr.net/gh/defis-net/material/video/JingleBellRock.mp4"> -->
      <!-- 您的浏览器不支持 video 标签。 -->
  </video>
  </div>
</template>

<script>
export default {
  name: 'funVideo',
  props: {
    src: {
      type: String,
      default: '',
    }
  },
  data() {
    return {
    }
  },
  methods: {
  },
}
</script>

<style lang="scss" scoped>
.video{
  padding: 0px;
  font-size: 28px;
  .myVideo{
    width: 100%;
  }
}
</style>