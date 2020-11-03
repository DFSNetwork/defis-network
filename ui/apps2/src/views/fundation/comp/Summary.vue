<template>
  <div>
    <!-- 币种统计 -->
    <div class="title flexb">
      <span class="act">概览</span>
    </div>
    <div class="lists">
      <div class="list">
        <div class="coin flexb">
          <div class="flexa">
            <!-- <img class="coinImg" src="https://ndi.340wan.com/eos/minedfstoken-dfs.png"> -->
            <span>捐款账户：dfsfundation</span>
          </div>
          <div class="btn green_p" @click="showToFundation = !showToFundation">去捐款</div>
        </div>
        <div class="flexb totalDiv">
          <div>
            <div class="tip">捐款总额（EOS）</div>
            <div class="num">{{ amtNum }}</div>
          </div>
          <div>
            <div class="tip">捐款人次</div>
            <div>
              <span class="num">{{ totalNum }}</span>
              <span class="green_p detail" @click="showDetail = !showDetail">查看详情></span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 详情 -->
    <el-dialog
      class="mydialog"
      :show-close="false"
      :visible.sync="showDetail">
      <Detail :summaryLists="summaryLists"/>
    </el-dialog>

    <!-- 去捐款 -->
    <el-dialog
      class="mydialog"
      :show-close="false"
      :visible="showToFundation">
      <ToFundation v-if="showToFundation" @listenClose="handleClose"/>
    </el-dialog>
  </div>
</template>

<script>
import Detail from '../dialog/Detail';
import ToFundation from '../dialog/ToFundation';

export default {
  name: 'summary',
  components: {
    Detail,
    ToFundation,
  },
  props: {
    totalNum: {
      type: Number,
      default: 0
    },
    amtNum: {
      type: String,
      default: '0.0000'
    },
    summaryLists: {
      type: Array,
      default: function sls() {
        return []
      }
    }
  },
  data() {
    return {
      showDetail: false,
      showToFundation: false,
    }
  },
  methods: {
    handleClose() {
      this.showToFundation = false;
      this.showDetail = false;
    }
  }
}
</script>

<style lang="scss" scoped>
.title{
  font-size: 32px;
  text-align: left;
  margin: 20px 40px 40px;
  &>span{
    margin-right: 60px;;
  }
  .about{
    margin-left: 10px;
    font-size: 24px;
  }
  .act{
    color: $color-black;
    position: relative;
    &::before{
      content: '';
      position: absolute;
      width:60px;
      height:8px;
      background:rgba(2,198,152,1);
      border-radius:4px;
      bottom: -20px;
      left: 50%;
      transform: translateX(-45%);
    }
  }
  .right{
    margin-right: 0
  }
}
.lists{
  margin: 30px;
  text-align: left;
  .list{
    box-shadow: 0px 10px 40px 0px rgba(220,220,220,0.5);
    border-radius: 10px;
    padding: 20px;
    .coin{
      .coinImg{
        width: 50px;
        height: 50px;
        margin-right: 10px;
      }
    }
    .totalDiv{
      margin-top: 10px;
      &>div{
        flex: 1;
      }
      .num{
        font-size: 33px;
        color: #000;
      }
      .detail{
        margin-left: 10px;
      }
    }
  }
}
.mydialog{
  /deep/ .el-dialog{
    border-radius: 12px;
    width: 650px;
    margin-top: 15vh !important;
    .el-dialog__header{
      padding: 0;
    }
    .el-dialog__body{
      padding: 0;
    }
    .el-dialog__headerbtn{
      font-size: 40px;
      z-index: 1;
    }
  }
}
</style>
