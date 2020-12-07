<template>
  <div class="audio">
    <audio :src="src"
      class="audio"
      controls
      duration
      hidden
      @ended="handleEnd"
      @loadedmetadata="handleLoaded"
      ref="myaudio"></audio>
    <div class="audioStyle flexa" @click.stop="handleToPlay">
      <img v-if="!isPlaying" class="img" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/audio.png" alt="">
      <img v-else class="img" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/audio.gif" alt="">
      <span v-if="duration.mins > 0">{{ duration.mins }}'</span>
      <span>{{ duration.secs }}''</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'myaudio',
  props: {
    src: {
      type: String,
      default: '',
    }
  },
  data() {
    return {
      isPlaying: false,
      duration: {
        total: 0,
        mins: 0,
        secs: '00',
      },
    }
  },
  methods: {
    // 加载完成处理
    handleLoaded() {
      const total = this.$refs.myaudio.duration;
      const mins = parseInt(total / 60)
      const secs = parseInt(total % 60)
      this.duration = {
        total, mins, secs
      }
    },
    // 点击播放
    handleToPlay() {
      this.isPlaying = !this.isPlaying;
      const myaudio = this.$refs.myaudio;
      if (this.isPlaying) {
        myaudio.play()
        return
      }
      myaudio.currentTime = 0;
      myaudio.pause()
    },
    // 播放结束
    handleEnd() {
      const myaudio = this.$refs.myaudio;
      myaudio.currentTime = 0;
      this.isPlaying = false;
    }
  },
}
</script>

<style lang="scss" scoped>
.audio{
  padding: 10px;
  font-size: 28px;
  .audioStyle{
    color: #333;
    border: 1px solid rgba(220,220,220,.3);
    border-radius: 40px;
    height: 60px;
    padding: 0 20px;
    box-shadow: 0px 8px 40px 0px rgba(220,220,220,0.5);
    color: #333;
    width: 120px;
    .img{
      width: 32px;
      font-size: 32px;
      margin-right: 14px;
    }
  }
}
</style>