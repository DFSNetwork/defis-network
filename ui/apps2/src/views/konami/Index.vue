<template>
  <div>
    <el-dialog
      :visible.sync="showDialog0">
      <Version v-if="showDialog0"/>
    </el-dialog>
  </div>
</template>

<script>
import Konami from './js/myKonami';
import Version from './dialog/Version';
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
          ["RIGHT", "DOWN", "UP", "TAP"], // 右 下 上 点击 点击
        ]
      },
      showDialog0: false,
    }
  },
  mounted() {
    this.egg = new Konami(this.keys, (index) => {
      setTimeout(() => {
        if (index === 0) {
          this.showDialog0 = true;
          this.$message('Versions V2.0.1');
        }
      }, 100);
    });
  },
  beforeDestroy() {
    this.egg.unload()
  },
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
</style>
