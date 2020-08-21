<template>
  <div class="poolsInfo" :class="{'minscNoBg': minScreen}">
    <div class="minW" v-if="!minScreen">
      <div class="item">
        <div class="subTitle">DFS Price</div>
        <div class="num">{{ price }} EOS</div>
      </div>
      <div class="item">
        <div class="subTitle">Liq</div>
        <div class="num">{{ liq }}</div>
      </div>
      <div class="item">
        <div class="subTitle">Vol</div>
        <div class="num">{{ vol }}</div>
      </div>
      <div class="item">
        <div class="subTitle">transaction</div>
        <div class="num">{{ tradeNum }}</div>
      </div>
    </div>
    <div v-else class="minSc flexb">
      <div class="bgSize"><img class="bgImg" src="@/assets/img/poolspage/top_bg.svg" alt=""></div>
      <div class="li">
        <div class="item">
          <div class="subTitle tip">DFS Price</div>
          <div class="num">{{ price }} EOS</div>
        </div>
        <div class="item">
          <div class="subTitle tip">Liq</div>
          <div class="num">{{ liq }}</div>
        </div>
      </div>
      <div class="li">
        <div class="item">
          <div class="subTitle tip">Vol</div>
          <div class="num">{{ vol }}</div>
        </div>
        <div class="item">
          <div class="subTitle tip">transaction</div>
          <div class="num">{{ tradeNum }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      price: '0.5200',
      liq: '300000.0000 EOS',
      vol: '$2700000.00',
      tradeNum: 20000,
    }
  },
  computed:{
    ...mapState({
      minScreen: state => state.app.minScreen,
    })
  },
}
</script>

<style lang="scss" scoped>
.poolsInfo{
  background: #07d79b;
  padding: 20px 0;
  &.minscNoBg{
    background: transparent;
    padding: 0;
  }
  .minW{
    max-width: 1240px;
    margin: auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  .item{
    text-align: left;
    background-color: rgba(255, 255, 255, 0.4);
    flex: 1;
    padding: 20px;
    border-radius: 5px;
    max-width: 305px;
    margin-right: 10px;
    &:last-child{
      margin-right: 0;
    }
    .subTitle{
      font-size: 14px;
      font-weight: bold;
    }
    .num{
      font-weight: bold;
      font-size: 24px;
    }
  }
  .minSc{
    padding: 40px;
    padding-top: 60px;
    text-align: left;
    position: relative;
    .bgSize{
      position: absolute;
      background: #07d79b;
      width: 100%;
      height: 55%;
      left: 0;
      top: 0;
      overflow: hidden;
      .bgImg{
        position: absolute;
        top: -50%;
        left: 0;
        width: 100%;
        z-index: 0;
      }
    }
    .li{
      position: relative;
      background: rgba(255, 255, 255, .9);
      font-size: 26px;
      padding: 5px 10px;
      flex: 1;
      margin-right: 20px;
      border-radius: 20px;
      box-shadow: 0px 0.26667rem 0.53333rem 0px rgba(220, 220, 220, 0.5);
      &:last-child{
        margin-right: 0;
      }
      .item{
        padding: 0;
        margin: 20px;
        background-color: rgba(255, 255, 255, 0);
        .subTitle{
          font-size: 28px;
          font-weight: bold;
        }
        .num{
          font-weight: bold;
          font-size: 30px;
        }
      }
    }
  }
}
</style>
