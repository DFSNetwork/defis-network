<template>
  <div class="records">
    <div class="title flexb">
      <span>节点动态</span>
      <span class="add" @click="showAddScore = true">编辑</span>
    </div>
    <div class="scroll">
      <div class="longDiv flexa">
        <div class="list">
          <div class="rTitle">标题标题标题</div>
          <div class="rTime tip">11.11 09:09</div>
          <div class="flexs">
            <img class="artImg" src="https://cdn.jsdelivr.net/gh/defis-net/material/bpInfo/art.png" alt="">
            <div class="subContent tip">
              简介简介简介简介简介简介简介简介简介简介
              简介简介简介简介简介简介简介简介简介简介
            </div>
          </div>
        </div>
        <div class="list">
          <div class="rTitle">标题标题标题</div>
          <div class="rTime tip">11.11 09:09</div>
          <div class="flexs">
            <img class="artImg" src="https://cdn.jsdelivr.net/gh/defis-net/material/bpInfo/art.png" alt="">
            <div class="subContent tip">
              简介简介简介简介简介简介简介简介简介简介
              简介简介简介简介简介简介简介简介简介简介
            </div>
          </div>
        </div>
        <div class="list">
          <div class="rTitle">标题标题标题</div>
          <div class="rTime tip">11.11 09:09</div>
          <div class="flexs">
            <img class="artImg" src="https://cdn.jsdelivr.net/gh/defis-net/material/bpInfo/art.png" alt="">
            <div class="subContent tip">
              简介简介简介简介简介简介简介简介简介简介
              简介简介简介简介简介简介简介简介简介简介
            </div>
          </div>
        </div>
        <div class="list">
          <div class="rTitle">标题标题标题</div>
          <div class="rTime tip">11.11 09:09</div>
          <div class="flexs">
            <img class="artImg" src="https://cdn.jsdelivr.net/gh/defis-net/material/bpInfo/art.png" alt="">
            <div class="subContent tip">
              简介简介简介简介简介简介简介简介简介简介
              简介简介简介简介简介简介简介简介简介简介
            </div>
          </div>
        </div>
        <div class="list">
          <div class="rTitle">标题标题标题</div>
          <div class="rTime tip">11.11 09:09</div>
          <div class="flexs">
            <img class="artImg" src="https://cdn.jsdelivr.net/gh/defis-net/material/bpInfo/art.png" alt="">
            <div class="subContent tip">
              简介简介简介简介简介简介简介简介简介简介
              简介简介简介简介简介简介简介简介简介简介
            </div>
          </div>
        </div>
        <div class="list">
          <div class="rTitle">标题标题标题</div>
          <div class="rTime tip">11.11 09:09</div>
          <div class="flexs">
            <img class="artImg" src="https://cdn.jsdelivr.net/gh/defis-net/material/bpInfo/art.png" alt="">
            <div class="subContent tip">
              简介简介简介简介简介简介简介简介简介简介
              简介简介简介简介简介简介简介简介简介简介
            </div>
          </div>
        </div>
        <div class="list">
          <div class="rTitle">标题标题标题</div>
          <div class="rTime tip">11.11 09:09</div>
          <div class="flexs">
            <img class="artImg" src="https://cdn.jsdelivr.net/gh/defis-net/material/bpInfo/art.png" alt="">
            <div class="subContent tip">
              简介简介简介简介简介简介简介简介简介简介
              简介简介简介简介简介简介简介简介简介简介
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      class="mydialog"
      :show-close="false"
      :visible.sync="showAddScore">
      <AddRecord v-if="showAddScore" />
    </el-dialog>
  </div>
</template>

<script>
import AddRecord from '../dialog/AddRecord'
export default {
  name: 'records',
  components: {
    AddRecord,
  },
  data() {
    return {
      showAddScore: false,
    }
  }
}
</script>

<style lang="scss" scoped>
.records{
  text-align: left;
  font-size: 28px;
  padding: 28px 0;
  border-bottom: 20px solid #f5f5f5;
  .title{
    font-size: 32px;
    font-weight: 500;
    padding-left: 28px;
    position: relative;
    margin: 0 32px 20px;
    &::before{
      content: '';
      position: absolute;
      height: 26px;
      width: 8px;
      top: 50%;
      left: 0px;
      transform: translate(0, -45%);
      background: #29D4B0;
      border-radius: 4px;
    }
    .add{
      font-size: 26px;
      background: #29D4B0;
      border-radius: 40px;
      padding: 8px 32px;
      font-weight: normal;
      color: #fff;
    }
  }
  .scroll{
    overflow: auto;
    .longDiv{
      max-width: 2000px;
      .list{
        min-width: 260px;
        max-width: 260px;
        min-height: 160px;
        max-height: 160px;
        padding: 20px 20px 10px;
        border-radius: 8px;
        border: 1px solid rgba(220,220,220, .3);
        margin: 0 0 0 32px;
        // box-sizing: border-box;
        .rTime{
          font-size: 20px;
          margin: 10px 0;
        }
        .artImg{
          width: 22px;
          margin: 6px 6px;
        }
        .subContent{
          font-size: 22px;
          overflow : hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }
    }
  }
}
</style>