<template>
  <div>
    <el-dialog
      :visible.sync="showDialog0">
      <Version v-if="showDialog0"/>
    </el-dialog>

    <el-dialog
      :visible.sync="showDialog1">
      <div class="memes">
        {{picked_meme}}
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Konami from './js/myKonami';
import Version from './dialog/Version';
import memes from './js/memes.js';
export default {
  components: {
    Version,
  },
  data() {
    return {
      egg: null,
      showVersion: false,
      keys: {
        pc: [ // 按键
          '18986', // - v 回车
        ],
        apps: [ // 手势
          ['RIGHT', 'RIGHT', 'DOWN', 'DOWN', 'TAP', 'TAP'], // 左 右 点击 点击
          ["RIGHT", "DOWN", "TAP", 'TAP'], // 右 下 上 点击 点击
        ]
      },
      picked_meme: '',
      showDialog0: false,
      showDialog1: false,
    }
  },
  mounted() {
    this.egg = new Konami(this.keys, (index) => {
      setTimeout(() => {
        if (index === 0) {
          this.showDialog0 = true;
          // this.$message('Versions V2.0.1');
        }
        if (index === 1) {
          this.showDialog1 = true;
          this.picked_meme = this.handleRandom()
        }
      }, 100);
    });
  },
  beforeDestroy() {
    this.egg.unload()
  },
  methods: {
    handleRandom() {
      let random = (Math.random() * 1000) % memes.length;
      random = parseInt(random);
      let picked_meme = memes[random];
      return picked_meme
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-dialog{
  width: 564px;
  border-radius: 16px;
  .el-dialog__header{
    padding: 0;
  }
  .el-dialog__body{
    padding: 0px;
  }
}
.memes{
  text-align: left;
  padding: 40px;
  font-size: 28px;
}
</style>
