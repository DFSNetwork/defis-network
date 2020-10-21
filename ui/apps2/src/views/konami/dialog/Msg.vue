<template>
  <div class="memes">
    {{picked_meme}}
  </div>
</template>

<script>
import memes from '../js/memes.js';
export default {
  data() {
    return {
      picked_meme: '恭喜你发现了第一个彩蛋',
    }
  },
  mounted() {
    this.handleRandom();
  },
  methods: {
    handleRandom() {
      const firstEgg = Number(localStorage.getItem('FIRSTEGG') || 0);
      if (!firstEgg) {
        localStorage.setItem('FIRSTEGG', 1)
        return
      }
      let random = (Math.random() * 1000) % memes.length;
      random = parseInt(random);
      this.picked_meme = memes[random];
    }
  }
}
</script>

<style lang="scss" scoped>
.memes{
  text-align: left;
  padding: 40px;
  font-size: 28px;
}
</style>
