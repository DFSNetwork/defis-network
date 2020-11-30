<template>
  <div class="accData">
    <!-- 币种统计 -->
    <!-- <div class="title flexb">
      <span class="act">概览</span>
    </div> -->
    <div class="lists">
      <div class="list">
        <div class="coin flexb">
          <div class="flexa">
            <span>{{ $t('fundation.fundationAcc') }}：dfsfundation</span>
          </div>
          <!-- <div class="btn green_p" @click="showToFundation = !showToFundation">去捐款</div> -->
        </div>
        <div class="flexb totalDiv">
          <div>
            <div class="num dinBold">{{ amtNum }}</div>
            <div class="tip">{{ $t('fundation.fundationNum') }}（EOS）</div>
          </div>
          <div>
            <div>
              <span class="num dinBold">{{ totalNum }}</span>
              <span class="detail" @click="showDetail = !showDetail">{{ $t('fundation.showDetail') }}></span>
            </div>
            <div class="tip">
              <span>{{ $t('fundation.fundationPeo') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 详情 -->
    <el-dialog
      class="mydialog"
      :show-close="false"
      :append-to-body="true"
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
  name: 'summaryPage',
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
.accData{
  position: relative;
  border-radius: 20px 20px 0 0;
  box-shadow: 0px 4px 8px 4px rgba(237,237,237,0.5);
  margin: 20px 30px 30px;
  background: #FFF;
  z-index: 1;
}
.lists{
  text-align: left;
  color: #333333;
  .list{
    // box-shadow: 0px 10px 40px 0px rgba(220,220,220,0.5);
    padding: 26px;
    .coin{
      margin-bottom: 20px;
    }
    .totalDiv{
      margin-top: 10px;
      &>div{
        flex: 1;
      }
      .num{
        font-size: 34px;
        color: #333;
      }
      .tip{
        margin-top: 10px;
      }
      .detail{
        margin-left: 10px;
        color: #29D4B0;
        font-size: 21px;
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
