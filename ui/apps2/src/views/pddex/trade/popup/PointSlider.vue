<template>
  <div class="pointSlider" @click="handleCloseTip">
    <div class="title">{{ $t('dex.TradeSet') }}</div>
    <div class="content">
      <div class="subTitle flexa">
        <span>{{ $t('dex.slipPoint') }}</span>
        <img class="tipCoin" @click.stop="handleShowTip" src="https://cdn.jsdelivr.net/gh/defis-net/material/svg/question.svg" alt="">
        <transition name="fade">
          <div class="tipConten" v-if="showTip">
            {{ $t('dex.slipTip') }}
          </div>
        </transition>
      </div>
      <div class="defaultNum flexb">
        <div class="num flexc" :class="{'act': slipPoint==1}" @click="handleChange('1')">1%</div>
        <div class="num flexc" :class="{'act': slipPoint==5}" @click="handleChange('5')">5%</div>
        <div class="num flexc" :class="{'act': slipPoint==10}" @click="handleChange('10')">10%</div>
      </div>
      <div class="accSet flexa" :class="{'act': actIpt}">
        <van-field class="numIpt" type="number" v-model="num" :placeholder="tipNum" @blur="handleDealNum">
          <template #extra>
            <span class="flexc">%</span>
          </template>
        </van-field>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'pointSlider',
  data() {
    return {
      act: '1',
      num: '',
      tipNum: '1',
      showTip: false,
    }
  },
  watch: {
    slipPoint: {
      handler: function sp() {
        if (this.actIpt) {
          this.num = this.slipPoint
        }
      },
      immediate: true
    }
  },
  computed: {
    ...mapState({
      slipPoint: state => state.app.slipPoint,
    }),
    actIpt() {
      return this.slipPoint != 1 && this.slipPoint != 5 && this.slipPoint != 10
    }
  },
  methods: {
    handleShowTip() {
      this.showTip = !this.showTip;
    },
    handleCloseTip() {
      this.showTip = false;
    },
    handleChange(num) {
      this.num = '';
      this.tipNum = num;
      this.$store.dispatch('setSlipPoint', num);
    },
    handleDealNum() {
      if (!this.num || Number(this.num) <= 0) {
        this.act = this.slipPoint;
        this.$store.dispatch('setSliderPonit', this.slipPoint);
        return;
      }
      this.$store.dispatch('setSliderPonit', this.num);
    }
  }
}
</script>

<style lang="scss" scoped>
.pointSlider{
  background: #FFF;
  padding: 40px;
  .title{
    font-size: 30px;
    font-weight: 500;
    margin-bottom: 10px;
  }
  .content{
    .subTitle{
      font-size: 27px;
      position: relative;
      .tipCoin{
        margin-left: 8px;
        width: 30px;
      }
      .tipConten{
        left: 160px;
        background: #FFF;
        position: absolute;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0px 20px 50px 0px rgba(100,101,102,0.12);
      }
    }
    .defaultNum{
      margin: 10px 0;
      .num{
        border: 1px solid #e3e3e3;
        font-size: 24px;
        flex: 1;
        height: 60px;
        text-align: center;
        margin-right: 21px;
        border-radius: 50px;
      }
    }
    .accSet{
      margin: 20px 0;
      width: 50%;
      height: 65px;
      border: 1px solid #e3e3e3;
      padding: 0 20px;
      box-sizing: border-box;
      border-radius: 30px;
      overflow: hidden;
      .numIpt{
        padding: 0px;
        /deep/ .van-field__control{
          height: 60px;
          padding-right: 20px;
          text-align: right;
        }
      }
    }
    .act{
      border: 1px solid #29D4B0 !important;
      font-size: 27px !important;
      font-weight: 500 !important;
      color: #29D4B0;
    }
  }
}
.popupTip{
  background: #FFF;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
