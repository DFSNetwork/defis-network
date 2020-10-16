<template>
  <div class="farms">
    <div class="banner flexc">
      <img class="bgImg" src="@/assets/img/poolspage/top_bg.svg" alt="">
      <div>
        <div class="title">农场大厅</div>
        <div class="subTip">每日农活，收益一目了然</div>
      </div>
    </div>
    <div class="farmsTitle flexb">
      <span>
        <span class="act">每日必做</span>
        <span class="about tip">预估总收益 ≈ {{ allReward }} EOS</span>
      </span>
      <span class="right green" v-loading="allClaiming" @click="handleRegLength()">一键领取</span>
    </div>
    <div class="proLists">
      <div @click="handleTo('time')">
        <MyTime  ref="time" :marketLists="marketLists" :allClaiming="allClaiming"/>
      </div>
      <div @click="handleTo('pools')">
        <DfsMiner ref="dfsMiner" :marketLists="marketLists" :allClaiming="allClaiming"/>
      </div>
      <div @click="handleTo('dss')">
        <Dss ref="dss" :marketLists="marketLists" :allClaiming="allClaiming"/>
      </div>
      <div @click="handleTo('yfc')">
        <Yfc ref="yfc" :marketLists="marketLists" :allClaiming="allClaiming"/>
      </div>
      <div @click="handleTo('guns')">
        <Guns ref="guns" :marketLists="marketLists" :allClaiming="allClaiming"/>
      </div>
      <div @click="handleTo('yfcDss')">
        <YfcDss ref="yfcDss" :marketLists="marketLists" :allClaiming="allClaiming"/>
      </div>
      <div @click="handleTo('dbc')">
        <Dbc ref="dbc" :marketLists="marketLists" :allClaiming="allClaiming"/>
      </div>
      <div @click="handleTo('pdd')">
        <Pdd ref="pdd" :marketLists="marketLists" :allClaiming="allClaiming"/>
      </div>
      <div @click="handleTo('loop')">
        <Loop ref="loop" :marketLists="marketLists" :allClaiming="allClaiming"/>
      </div>
      <div @click="handleTo('dmd')">
        <Dmd  ref="dmd" :marketLists="marketLists" :allClaiming="allClaiming"/>
      </div>
    </div>

    <el-dialog
      class="myDialog"
      :show-close="false"
      :visible="showTip">
      <MoreActionTip v-if="showTip" :allActions="allActions" :nextPage="nextPage"
        @listenSure="handleSure" @listenClose="handleClose"/>
    </el-dialog>
  </div>
</template>

<script>
import MoreActionTip from './dialog/MoreActionTip';
import Dss from './comp/Dss';
import DfsMiner from './comp/DfsMiner';
import Yfc from './comp/Yfc';
import Dbc from './comp/Dbc';
import Dmd from './comp/Dmd';
import Guns from './comp/Guns';
import Loop from './comp/Loop';
import Pdd from './comp/Pdd';
import YfcDss from './comp/YfcDss';
import MyTime from './comp/MyTime';
import { EosModel } from '@/utils/eos';

export default {
  name: 'farms',
  components: {
    MoreActionTip,
    Dss,
    DfsMiner,
    Yfc,
    Dbc,
    Dmd,
    Guns,
    Loop,
    Pdd,
    YfcDss,
    MyTime,
  },
  props: {
    marketLists: {
      type: Array,
      default: function lists() {
        return []
      }
    }
  },
  data() {
    return {
      allClaiming: false,
      showTip: false,
      allActions: [],
      thisPage: 0,
      nextPage: 0,
      allRewardTimer: null,
      allReward: '0.0000'
    }
  },
  computed: {
  },
  mounted() {
    this.handleGetAll()
  },
  methods: {
    handleGetAll() {
      clearTimeout(this.allReward)
      let n = 0
      const dss = this.$refs.dss ? Number(this.$refs.dss.aboutEos || 0) : 0;
      const dfsMiner = this.$refs.dfsMiner ? Number(this.$refs.dfsMiner.aboutEos || 0) : 0;
      const yfc = this.$refs.yfc ? Number(this.$refs.yfc.aboutEos || 0) : 0;
      const dbc = this.$refs.dbc ? Number(this.$refs.dbc.aboutEos || 0) : 0;
      const dmd = this.$refs.dmd ? Number(this.$refs.dmd.aboutEos || 0) : 0;
      const guns = this.$refs.guns ? Number(this.$refs.guns.aboutEos || 0) : 0;
      const loop = this.$refs.loop ? Number(this.$refs.loop.aboutEos || 0) : 0;
      const pdd = this.$refs.pdd ? Number(this.$refs.pdd.aboutEos || 0) : 0;
      const yfcDss = this.$refs.yfcDss ? Number(this.$refs.yfcDss.aboutEos || 0) : 0;
      const time = this.$refs.time ? Number(this.$refs.time.aboutEos || 0) : 0;
      n = dss + dfsMiner + yfc + dbc + dmd + guns + loop + pdd + yfcDss + time + n;
      this.allReward = n.toFixed(4);
      this.allRewardTimer = setTimeout(() => {
        this.handleGetAll()
      }, 50)
    },
    handleClose(type) {
      this.showTip = false;
      if (type || this.nextPage !== 0) {
        location.reload()
      }
    },
    handleTo(name) {
      if (this.$route.name === name)  {
        return;
      }
      if (name === 'yfc') {
        location.href = 'https://yfc.one';
        return
      }
      if (name === 'dbc') {
        location.href = 'https://dbc.yfc.one';
        return
      }
      if (name === 'dmd') {
        location.href = 'https://dmd.finance/';
        return
      }
      if (name === 'guns') {
        location.href = 'https://yfc.one/guns';
        return
      }
      if (name === 'loop') {
        location.href = 'https://loop.ech.one/index.html';
        return
      }
      if (name === 'pdd') {
        location.href = 'https://pddex.defis.network/';
        return
      }
      if (name === 'yfcDss') {
        location.href = 'https://yfc.one/vault';
        return
      }
      if (name === 'time') {
        location.href = 'https://timemine.xloot.io';
        return
      }
      
      this.$router.push({name: name})
    },
    handleRegLength() {
      const dss = this.$refs.dss.handleGetActions()
      const dfsMiner = this.$refs.dfsMiner.handleGetActions()
      const yfc = this.$refs.yfc.handleGetActions()
      const dbc = this.$refs.dbc.handleGetActions()
      const dmd = this.$refs.dmd.handleGetActions()
      const guns = this.$refs.guns.handleGetActions()
      const loop = this.$refs.loop.handleGetActions()
      const pdd = this.$refs.pdd.handleGetActions()
      const yfcDss = this.$refs.yfcDss.handleGetActions()
      const time = this.$refs.time.handleGetActions()
      const tArr = [...dss, ...dfsMiner, ...yfc, ...dbc, ...dmd, ...guns, ...loop, ...pdd, ...yfcDss, ...time];
      this.allActions = tArr;
      if (this.allActions.length <= 10) { // 10条以内
        // console.log(this.allActions.length)
        // 直接执行
        this.handleAllClaim(-1)
        return
      }
      this.showTip = true;
    },
    handleSure(page) {
      this.thisPage = page;
      this.handleAllClaim(page)
    },
    handleAllClaim(pageIndex) {
      this.allClaiming = true;
      let actions = this.allActions;
      let pageArr = []
      if (pageIndex !== -1) {
        this.allActions.forEach((v, index) => {
          const page = parseInt(index / 10);
          if (!pageArr[page]) {
            pageArr[page] = []
          }
          pageArr[page].push(v)
        })
        actions = pageArr[pageIndex];
      }
      const params = {
        actions: actions
      }
      EosModel.toTransaction(params, (res) => {
        this.allClaiming = false;
        if(res.code && JSON.stringify(res.code) !== '{}') {
          this.nextPage = -1;
          this.$message({
            message: res.message,
            type: 'error'
          });
          return
        }
        if (pageIndex !== -1) {
          this.nextPage = Number(pageIndex) + 1;
        } else {
          setTimeout(() => {
            location.reload()
          }, 2000);
        }
        this.$message({
          message: this.$t('public.success'),
          type: 'success'
        });
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.farms{
  .green{
    color: #07D79B;
  }
  .banner{
    color: #FFF;
    background: #07d79b;
    // padding: 80px 0 60px;
    height: 2rem;
    position: relative;
    overflow: hidden;
    &>div{
      z-index: 1;
    }
    .bgImg{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 0;
    }

    .title{
      font-size: 40px;
      font-weight: 500;
    }
    .subTip{
      font-size: 33px;
    }
  }
  .farmsTitle{
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
  .proLists{
    padding: 0 40px 40px;
    font-size: 27px;
  }
}
.myDialog{
  /deep/ .el-dialog{
    position: relative;
    margin: auto;
    width: 590px;
    border-radius: 20px;
    .el-dialog__body,
    .el-dialog__header{
      padding: 0;
    }
  }
}
</style>
