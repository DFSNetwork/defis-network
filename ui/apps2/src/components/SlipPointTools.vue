<template>
  <div class="nav">
    <el-dialog
      class="dialog"
      :show-close="false"
      :visible.sync="showNav">
      <div class="navList">
        <div class="title">{{ $t('dex.TradeSet') }}</div>
        <div class="subTitle flex">
          <span>{{ $t('dex.slipSet') }}</span>
          <el-popover
            class="flexc"
            popper-class="mypopper"
            placement="top-start"
            trigger="click">
            <div class="qusTip">{{ $t('dex.slipTip') }}</div>
            <span slot="reference" class="flexc ml10"><img width="100%" src="@/assets/img/dex/tips_icon_btn.svg" alt=""></span>
          </el-popover>
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
        <div class="invitation">
          <div class="subTitle flex">
            <span>{{ $t('dex.inviter') }}</span>
            <!-- <img class="iconImg" src="@/assets/img/dex/tips_icon_btn.svg" alt=""> -->
          </div>
          <div class="invitationIpt flex">
            <el-input class="elIpt" v-model="inviAcc"></el-input>
            <span class="btn flexc" v-loading="loading" @click="handleSureInviArr">{{ $t('public.confirm') }}</span>
          </div>
          <!-- <div><span class="btn flexc">确认</span></div> -->
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { toFixed } from '@/utils/public';
import { EosModel } from '@/utils/eos';

export default {
  data() {
    return {
      showNav: false,
      slipRate: '',
      tipRate: '1.00',
      min: '20',
      inviAcc: '', // 邀请人账户
      loading: false,
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
    },
    showNav() {
      try {
        const inviAcc = localStorage.getItem('inviAcc') ? JSON.parse(localStorage.getItem('inviAcc')) : {};
        this.inviAcc = inviAcc.owner;
      } catch (error) {
        localStorage.removeItem('inviAcc')
        this.inviAcc = '';
      }
    }
  },
  mounted() {
  },
  methods: {
    handleSureInviArr() {
      if (this.loading) {
        return
      }
      if (!this.inviAcc) {
        return
      }
      this.loading = true;
      const params = {
        "code": "dfsdfsfamily",
        "scope": "dfsdfsfamily",
        "table": "codes",
        "index_position": 2,
        "key_type": "i64",
        "lower_bound": this.inviAcc,
        "upper_bound": this.inviAcc,
        "json": true,
      }
      EosModel.getTableRows(params, (res) => {
        this.loading = false;
        if (!res.rows.length) {
          localStorage.removeItem('inviAcc');
          this.$message.error('Invitation code does not exist')
          return
        }
        const inviAcc = res.rows[0];
        inviAcc.accSet = true;
        localStorage.setItem('inviAcc', JSON.stringify(inviAcc))
        this.showNav = false;
        this.$message.success('Success')
      })
    },
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
.mypopper{
  .qusTip{
    padding: 10px;
    width: 240px;
    font-size: 24px;
  }
}
.nav{
  position: relative;
  font-size: 26px;
  .ml10{
    margin-left: 10px;
  }
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
          color: #000;
          font-size: 24px;
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

  .invitation{
    .invitationIpt{
      margin-top: 20px;
      /deep/ .el-input{
        width: 200px;
        border: 1px solid rgba(224,224,224,1);
        border-radius: 40px;
        overflow: hidden;
        margin-right: 20px;
        .el-input__inner{
          color: #000;
          font-size: 24px;
          height: 55px;
          border: 1px solid transparent;
          padding-right: 0px;
          padding-left: 0px;
          text-align: center;
        }
        .el-input-group__append{
          background: $color-bgcolor;
          border: 0px solid #DCDFE6;
        }
      }
    }
    .btn{
      background: #07d79b;
      border-radius: 30px;
      color: #fff;
      height: 60px;
      min-width: 100px;
      padding: 0 20px;
      &:active{
        background: #02C698;
      }
    }
  }
}
</style>
