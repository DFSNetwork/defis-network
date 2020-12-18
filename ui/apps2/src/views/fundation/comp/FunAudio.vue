<template>
  <div class="audio">
    <div v-for="(v, i) in src" :key="i">
      <audio :src="v"
        class="audio"
        controls
        duration
        hidden
        @ended="handleEnd"
        @loadedmetadata="handleLoaded"
        ref="myaudio"></audio>
      <div class="audioStyle flexa" @click.stop="handleToPlay(i)">
        <img v-if="duration && duration[i] ? !duration[i].isPlaying : true" class="img" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/audio.png" alt="">
        <img v-else class="img" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/audio.gif" alt="">
        <span v-if="duration && duration[i] && duration[i].mins > 0">{{ duration[i].mins }}'</span>
        <span>{{ duration && duration[i] ? duration[i].secs : '00' }}''</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'myaudio',
  props: {
    src: {
      type: Array,
      default: function s() {
        return []
      },
    }
  },
  data() {
    return {
      isPlaying: false,
      duration: [{
        total: 0,
        mins: 0,
        secs: '00',
      }],
    }
  },
  watch: {
    src: {
      handler: function() {
        console.log(this.src)
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    // 加载完成处理
    handleLoaded() {
      const allAudio = this.$refs.myaudio
      const dArr = [];
      allAudio.forEach(v => {
        const total = v.duration;
        const mins = parseInt(total / 60)
        const secs = parseInt(total % 60)
        dArr.push({
          total, mins, secs
        })
      });
      this.duration = dArr;
    },
    // 点击播放
    handleToPlay(i) {
      const myaudio = this.$refs.myaudio;
      myaudio.forEach((v, index) => {
        v.currentTime = 0;
        v.pause()
        if (i === index) {
          this.$set(this.duration[i], 'isPlaying', !this.duration[i].isPlaying)
        } else {
          this.$set(this.duration[index], 'isPlaying', false)
        }
      })
      if (this.duration[i].isPlaying) {
        myaudio[i].play()
        return
      }
      myaudio[i].currentTime = 0;
      myaudio[i].pause()
    },
    // 播放结束
    handleEnd() {
      const myaudio = this.$refs.myaudio;
      myaudio.forEach((v, i) => {
        v.currentTime = 0;
        this.$set(this.duration[i], 'isPlaying', false)
      })
      // this.isPlaying = false;
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