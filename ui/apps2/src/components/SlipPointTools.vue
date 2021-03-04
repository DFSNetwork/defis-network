<template>
  <div class="nav">
    <van-popup
      class="popup_p"
      v-model="showNav">
      <div class="navList">
        <img class="close" @click="showNav = false"
          src="https://cdn.jsdelivr.net/gh/defis-net/material/svg/sd_icon_btn.svg" alt="">
        <div class="title">{{ $t('dex.TradeSet') }}</div>
        <div class="item">
          <div class="subTitle flexb">
            <span>多路径兑换</span>
            <van-switch class="switch"
              :value="rSwitch" fon active-color="#29D4B0" @input="handleCheckSwitch" />
          </div>
          <div class="tip">
            *通系统将为您匹配价格最优的兑换路径，确保在扣除手续费后，依然能获得更多代币
          </div>
        </div>
        <div class="item">
          <div class="subTitle flexb">
            <span>滑点设置</span>
          </div>
          <div class="tip">
            *{{ $t('dex.slipTip') }}
          </div>
          <div class="rateDiv">
            <div class="flexb lists">
              <span class="tab flexc" :class="{'act': Number(tipRate) === 1}" @click="handleSetSlipPoint(1)">1%</span>
              <span class="tab flexc" :class="{'act': Number(tipRate) === 5}" @click="handleSetSlipPoint(5)">5%</span>
              <span class="tab flexc" :class="{'act': Number(tipRate) === 10}" @click="handleSetSlipPoint(10)">10%</span>
            </div>
            <div class="flexb lists">
              <span class="tab flexc iptSpan"
                :class="{'actIpt': Number(tipRate) !== 1 && Number(tipRate) !== 5 && Number(tipRate) !== 10 }">
                <van-field class="ipt"
                  input-align="center"
                  v-model="slipRate"
                  @blur="handleBlur" :placeholder="tipRate" type="number" />
                <span class="per">%</span>
              </span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
        <span class="btn flexc" v-loading="loading" @click="handleSureSlip">{{ $t('public.confirm') }}</span>
      </div>
    </van-popup>
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
      rSwitch: state => state.app.rSwitch,
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
    },
    slipRate(newVal) {
      if (Number(newVal) > 80) {
        this.slipRate = '80';
      }
      this.tipRate = this.slipRate
    }
  },
  mounted() {
  },
  methods: {
    handleCheckSwitch() {
      this.$store.dispatch('setRSwitch', !this.rSwitch)
    },
    handleSureSlip() {
      this.$store.dispatch('setSlipPoint', this.tipRate)
      this.$message.success('Success')
      this.showNav = false
    },
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
        "lower_bound": ` ${this.inviAcc}`,
        "upper_bound": ` ${this.inviAcc}`,
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
      const sr = Number(this.slipRate) > 80 ? 80 : this.slipRate;
      this.tipRate = sr;
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
  .navList{
    padding: 34px;
    text-align: left;
    color: #333;
    .close{
      width: 24px;
      position: absolute;
      right: 30px;
      top: 30px;
    }
    .title{
      font-weight: 500;
      margin-bottom: 20px;
      font-size: 36px;
      text-align: center;
    }
  }
  .item{
    margin-bottom: 34px;
    .subTitle{
      font-size: 30px;
      margin-bottom: 20px;
    }
    .switch{
      font-size: 40px;
    }
    .tip{
      font-size: 28px;
    }
    .rateDiv{
      margin-top: 20px;
      .lists{
        margin-bottom: 20px;
        &>span{
          flex: 1;
          margin-left: 28px;
          box-sizing: border-box;
        }
        .tab{
          border: 1px solid $color-border;
          margin-left: 28px;
          box-sizing: border-box;
          height: 72px;
          border-radius: 40px;
          font-size: 32px;
          &:first-child{
            margin-left: 0px;
          }
          &.act{
            background: $color-main;
            border: 1px solid rgba(224,224,224,0);
            color: #FFF;
          }
        }
        .iptSpan{
          position: relative;
          overflow: hidden;
          &.actIpt{
            border: 1px solid $color-main;
          }
          .ipt{
            text-align: center;
            padding: 0;
            background: rgba(255,255,255, 0);
            &::after{
              display: none;
            }
          }
          .per{
            z-index: -1;
            position: absolute;
            right: 20px;
            color: #999;
            font-size: 26px;
          }
        }
      }
    }
  }
  .btn{
    background: $color-main;
    border-radius: 50px;
    color: #fff;
    height: 90px;
    min-width: 100px;
    padding: 0 20px;
    font-size: 32px;
    font-weight: 500;
    &:active{
      background: $color-main;
    }
  }
}
</style>
