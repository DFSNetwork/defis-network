<template>
  <div class="detail">
    <div class="title">{{ $t('fundation.funDetail') }}</div>
    <div class="tables">
      <div class="liTitle flexb">
        <div>{{ $t('dex.coin', {coin: ''}) }}</div>
        <div>{{ $t('fundation.fundationNum') }}</div>
        <div>{{ $t('fundation.fundationPeo') }}</div>
      </div>
      <div class="licontent">
        <div class="li flexb" v-for="(item, index) in summaryLists" :key="index">
          <div class="flexa">
            <img class="coinImg" :src="item.imgUrl" :onerror="errorCoinImg">
            <span>{{ item.symbol }}</span>
          </div>
          <div class="num">{{ Number(item.total).toFixed(5) }}</div>
          <div class="num">{{ item.num }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'fundationDetail',
  props: {
    summaryLists: {
      type: Array,
      default: function sls() {
        return []
      }
    }
  },
  data() {
    return {
      errorCoinImg: 'this.src="https://ndi.340wan.com/eos/eosio.token-eos.png"',
    }
  }
}
</script>

<style lang="scss" scoped>
.detail{
  padding: 30px;
  border-radius: 12px;
  font-size: 27px;
  .title{
    font-size: 33px;
    color: #333;
    margin-bottom: 10px;
    text-align: center;
  }
  .tables{
    .liTitle,.li{
      &>div{
        flex: 3;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        &:first-child{
          flex: 2;
          text-align: left;
          justify-content: flex-start;
        }
        &:last-child{
          flex: 1.5;
          text-align: right;
          justify-content: flex-end;
        }
      }
      .coinImg{
        width: 50px;
        height: 50px;
        margin-right: 10px;
      }
    }
    .licontent{
      max-height: 500px;
      overflow: auto;
      .li{
        height: 70px;
        border-top: 1px solid rgba(#eee, .5);
      }
    }
  }
}
</style>
