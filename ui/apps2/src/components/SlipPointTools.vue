<template>
  <div class="nav">
    <el-dialog
      class="dialog"
      :show-close="false"
      :visible.sync="showNav">
      <div class="navList">
        <div class="title">交易设置</div>
        <div class="subTitle flex">
          <span>滑点设置</span>
          <img class="iconImg" src="@/assets/img/dex/tips_icon_btn.svg" alt="">
        </div>
        <div class="slips flexb">
          <div class="flexc" :class="{'act': Number(tipRate) === 1}" @click="handleSetSlipPoint(1)">1%</div>
          <div class="flexc" :class="{'act': Number(tipRate) === 5}" @click="handleSetSlipPoint(5)">5%</div>
          <div class="flexc" :class="{'act': Number(tipRate) === 10}" @click="handleSetSlipPoint(10)">10%</div>
        </div>
        <div class="iptDiv" :class="{'act': Number(tipRate) !== 1 && Number(tipRate) !== 5 && Number(tipRate) !== 10 }">
          <el-input class="elIpt" v-model="slipRate" @blur="handleBlur" :placeholder="tipRate">
            <template slot="append">%</template>
          </el-input>
        </div>
        <div class="subTitle flex" v-if="false">
          <span>交易超时时间</span>
          <img class="iconImg" src="@/assets/img/dex/tips_icon_btn.svg" alt="">
        </div>
        <div class="minute flex" v-if="false">
          <el-input class="elIpt" v-model="min" :placeholder="min"></el-input>
          <span>分钟</span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { toFixed } from '@/utils/public';

export default {
  data() {
    return {
      showNav: false,
      slipRate: '',
      tipRate: '1.00',
      min: '20',
    }
  },
  computed: {
    ...mapState({
      language: state => state.app.language,
      scatter: state => state.app.scatter,
      slipPoint: state => state.app.slipPoint,
    })
  },
  watch: {
    slipPoint: {
      handler: function sl(newVal) {
        this.tipRate = toFixed(newVal, 2);
        if (newVal !== 1 && newVal !== 5 && newVal !== 10) {
          this.slipRate = newVal
        }
      },
      immediate: true
    }
  },
  mounted() {
  },
  methods: {
    handleSetSlipPoint(num) {
      this.$store.dispatch('setSlipPoint', num)
    },
    handleBlur() {
      if (!Number(this.slipRate)) {
        return
      }
      this.tipRate = this.slipRate;
      this.$store.dispatch('setSlipPoint', this.slipRate)
    }
  }
}
</script>

<style lang="scss" scoped>
.nav{
  position: relative;
  font-size: 26px;
  /deep/ .el-dialog{
    position: absolute;
    border-radius: 30px 0px 30px 30px;
    right: 150px;
    top: 120px;
    width: 480px;
    margin-top: 0 !important;
    .el-dialog__header{
      padding: 0;
    }
    .el-dialog__body{
      font-size: 26px;
      padding: 35px;
    }
  }
  .navList{
    color: #000;
    padding: 0 24px;
    text-align: left;
    .title{
      font-weight: 500;
      margin-bottom: 20px;
    }
    .subTitle{
      align-items: center;
      .iconImg{
        width: 28px;
        margin-left: 15px;
      }
    }
    .slips{
      font-size: 24px;
      &>div{
        border:1px solid rgba(224,224,224,1);
        border-radius: 40px;
        height: 55px;
        padding: 0 16px;
        width: 75px;
        margin: 20px;
        &:first-child{
          margin-left: 0px;
        }
        &:last-child{
          margin-right: 0px;
        }
        &.act{
          background:rgba(7,215,155,1);
          border: 0px solid rgba(224,224,224,1);
          color: #FFF;
        }
      }
    }
    .iptDiv{
      width: 200px;
      height: 55px;
      border: 1px solid rgba(224,224,224,1);
      border-radius: 40px;
      margin-bottom: 35px;
      overflow: hidden;
      &.act{
        border: 1px solid rgba(7,215,155,1);;
      }
      /deep/ .el-input{
        .el-input__inner{
          height: 55px;
          border: 1px solid transparent;
          padding-right: 0px;
          text-align: right;
        }
        .el-input-group__append{
          background: $color-bgcolor;
          border: 0px solid #DCDFE6;
        }
      }
    }
    .minute{
      margin-top: 25px;
      align-items: center;
      /deep/ .el-input{
        width: 200px;
        overflow: hidden;
        border: 1px solid rgba(224,224,224,1);
        border-radius: 40px;
        margin-right: 20px;
        .el-input__inner{
          height: 55px;
          border: 0px;
          text-align: right;
        }
        .el-input-group__append{
          background: $color-bgcolor;
          border: 0px solid #DCDFE6;
        }
      }
    }
  }
}
</style>
