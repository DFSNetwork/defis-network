<template>
  <div class="detailInfo">
    <div class="title flexc">节点详情</div>
    <BpInfo />
    <Records />
    <ScoreLists />

    <div class="nullDiv"></div>
    <div class="btnDiv">
      <div class="btn flexc" @click="showAddScore = true">发布评价</div>
    </div>
    <el-dialog
      class="mydialog"
      :show-close="false"
      :visible.sync="showAddScore">
      <Score v-if="showAddScore" />
    </el-dialog>
  </div>
</template>

<script>
import BpInfo from './comp/BpInfo';
import Records from './comp/Records';
import ScoreLists from './comp/ScoreLists';
import Score from './dialog/Score';

export default {
  name: 'detailInfo',
  components: {
    BpInfo,
    Records,
    ScoreLists,
    Score,
  },
  data() {
    return {
      showAddScore: false,
    }
  }
}
</script>

<style lang="scss" scoped>
/*iphone Xs Max*/
@media only screen and (device-width: 414px) and (device-height: 896px) {
  .btnDiv{
    padding-bottom: 30px !important;
  }
}
/*iphoneX、iphoneXs*/
@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
  .btnDiv{
    padding-bottom: 30px !important;
  }
}
.detailInfo{
  .title{
    font-size: 36px;
    font-weight: 500;
    height: 90px;
    border-bottom: 1px solid rgba(220,220,220,.3);
  }
  .nullDiv{
    height: 150px;
    width: 100%;
  }
  .btnDiv{
    height: 150px;
    position: fixed;
    max-width: 750px;
    bottom: 0px;
    width: 100%;
    box-sizing: border-box;
    padding: 0 32px;
    background: #FFF;
    .btn{
      width: 100%;
      height: 90px;
      background: #29D4B0;
      color: #fff;
      font-size: 32px;
      font-weight: 500;
      border-radius: 45px;
    }
  }
}
</style>