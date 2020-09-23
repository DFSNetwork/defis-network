<template>
  <div class="farms">
    <div class="banner">
      <div class="title">农场大厅</div>
      <div class="subTip">每日农活，收益一目了然</div>
    </div>
    <div class="farmsTitle flexb">
      <span class="act">每日必做</span>
      <span class="right green" v-loading="allClaiming" @click="handleAllClaim">一键领取</span>
    </div>
    <div class="proLists">
      <Dss ref="dss" :allClaiming="allClaiming"/>
      <DfsMiner ref="dfsMiner" :marketLists="marketLists" :allClaiming="allClaiming"/>
      <Yfc ref="yfc" :marketLists="marketLists" :allClaiming="allClaiming"/>
      <Dbc ref="dbc" :marketLists="marketLists" :allClaiming="allClaiming"/>
      <Dmd  ref="dmd" :allClaiming="allClaiming"/>
    </div>
  </div>
</template>

<script>
import Dss from './comp/Dss';
import DfsMiner from './comp/DfsMiner';
import Yfc from './comp/Yfc';
import Dbc from './comp/Dbc';
import Dmd from './comp/Dmd';
import { EosModel } from '@/utils/eos';

export default {
  name: 'farms',
  components: {
    Dss,
    DfsMiner,
    Yfc,
    Dbc,
    Dmd,
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
    }
  },
  methods: {
    handleAllClaim() {
      this.allClaiming = true;
      const dss = this.$refs.dss.handleGetActions()
      const dfsMiner = this.$refs.dfsMiner.handleGetActions()
      const yfc = this.$refs.yfc.handleGetActions()
      const dbc = this.$refs.dbc.handleGetActions()
      const dmd = this.$refs.dmd.handleGetActions()
      const params = {
        actions: [...dss, ...dfsMiner, ...yfc, ...dbc, ...dmd]
      }
      EosModel.toTransaction(params, (res) => {
        setTimeout(() => {
          location.reload()
        }, 2000);
        if(res.code && JSON.stringify(res.code) !== '{}') {
          this.$message({
            message: res.message,
            type: 'error'
          });
          return
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
    padding: 80px 0 60px;
    .title{
      font-size: 60px;
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
    .lists{
      text-align: left;
      border-radius: 15px;
      padding: 30px;
      margin-bottom: 30px;
      box-shadow: 0px 10px 40px 0px rgba(220,220,220,0.5);
      .projectName{
        font-size: 30px;
        font-weight: 500;
        margin-bottom: 10px;
        .claim{
          font-size: 27px;
          font-weight: 400;
        }
      }
    }
  }
}
</style>
