<template>
  <div>
    <el-dialog
      title=""
      :visible.sync="showArr.dialog0"
      width="width">
      <Version />
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
      keys = {
        pc: ['18986', '18983'],
        apps: ["RIGHT", "DOWN", "UP", "TAP", "TAP"]
      },
      showArr: {
        dialog0: false,
        dialog1: false,
      }
    }
  },
  mounted() {
    this.egg = new Konami(this.keys, (index) => {
      console.log(index)
      this.showArr[index] = true;
      this.$message('当前版本 V2.0.1');
    });
    console.log(this.egg)
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
