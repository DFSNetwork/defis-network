<template>
  <div class="poolsLists">
    <div class="title flexb">
      <span class="act">矿池列表</span>
    </div>
    <div class="lpList">
      <div class="list" v-for="(v, i) in lpLists" :key="`lp${i}`">
        <div class="poolInfo flexa">
          <img class="coinImg" :src="v.sym1Data.imgUrl">
          <div class="bal">
            <div class="flexb">
              <span>{{ v.symbol0 }}/{{ v.symbol1 }} LP 挖矿</span>
              <span class="apy">年化：{{ `0.00` }}%</span>
            </div>
            <div class="num din">{{ '0.00000000' }}</div>
          </div>
        </div>
        <div class="reward">做市资金：{{ v.reserve0 }}/{{ v.reserve1 }}</div>
      </div>
    </div>
    <div class="list" v-for="(item, index) in poolsLists" :key="index">
      <div class="poolInfo flexa">
        <img class="coinImg" :src="item.imgUrl">
        <div class="bal">
          <div class="flexb">
            <span>{{ item.sym }}矿池收益</span>
            <span class="apy">年化：{{ poolsData[item.sym] ? poolsData[item.sym].apy || '0.00' : `0.00` }}%</span>
          </div>
          <div class="num din">{{ poolsData[item.sym] ? poolsData[item.sym].accReward || '0.00000000' : '0.00000000' }}</div>
        </div>
      </div>
      <div class="reward">池子余额：{{ poolsData[item.sym] ? poolsData[item.sym].bal : `0.0000 ${item.sym}` }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'poolsLists',
  props: {
    poolsLists: {
      type: Array,
      default: function pls() {
        return []
      }
    },
    poolsData: {
      type: Object,
      default: function pls() {
        return {}
      }
    },
    lpLists: {
      type: Array,
      default: function lps() {
        return []
      }
    }
  },
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
.poolsLists{
  margin: 32px;
  font-size: 28px;
  color: #333;
}
.title{
  font-size: 32px;
  text-align: left;
  margin: 0 0 20px;
  .act{
    color: #333;
    position: relative;
    padding-left: 28px;
    &::before{
      content: '';
      position: absolute;
      width: 8px;
      height: 30px;
      background:rgba(2,198,152,1);
      border-radius:4px;
      top: 50%;
      left: 0;
      transform: translateY(-45%);
    }
  }
}
.list{
  border: 1px solid #eee;
  padding: 20px 26px;
  border-radius: 12px;
  text-align: left;
  margin-bottom: 20px;
  .poolInfo{
    margin-bottom: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
    .bal{
      flex: 1;
    }
    .coinImg{
      width: 100px;
      height: 100px;
      border-radius: 50%;
      margin-right: 10px;
    }
    .num{
      font-size: 50px;
    }
    .apy{
      color: #333;
    }
  }
}
</style>
