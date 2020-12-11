<template>
  <div class="bigTrade">
    <div class="title">溢价订单提醒</div>
    <div class="content">
      <div>当前挂单价格，{{ `${tradeData.direction ==='buy' ?'高出':'低于'}` }}当前市场价{{ `${tradeData.rate}` }}%，
        请确认再继续下单，避免造成不必要的损失
      </div>
      <div class="data">
        <div class="flexc">
          <span>交易均价: </span>
          <span>{{tradeData.price || '-'}}</span>
        </div>
        <div class="flexc">
          <span>交易数量: </span>
          <span>{{tradeData.num || '-'}}</span>
        </div>
        <div class="flexc">
          <span>交易金额: </span>
          <span>{{tradeData.total || '-'}}</span>
        </div>
      </div>
    </div>
    <div class="btnDiv flexb">
      <van-button class="btn" @click="handleClose">返回修改</van-button>
      <van-button class="btn" @click="handleSure" type="danger">确认下单</van-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tradeData: {
      type: Object,
      default: function td() {
        return {}
      }
    },
  },
  methods: {
    handleSure() {
      this.$emit('hanldeSuccess', true)
    },
    handleClose() {
      this.$emit('handleClose', true)
    }
  }
}
</script>

<style lang="scss" scoped>
.bigTrade{
  padding: 40px;
  .title{
    font-size: 36px;
    text-align: center;
    margin-bottom: 20px;
    color: rgb(240, 157, 61);
  }
  .data{
    border: 1px solid #e3e3e3;
    padding: 20px;
    border-radius: 20px;
    margin-top: 20px;
    &>div{
      &>span{
        flex: 1;
        text-align: right;
        line-height: 38px;
        &:last-child{
          flex: 2;
          margin-left: 10px;
          text-align: left;;
        }
      }
    }
  }
  .btnDiv{
    margin-top: 30px;
    .btn{
      width: 50%;
      margin-right: 20px;
      &:last-child{
        margin-right: 0;
      }
    }
  }
}
</style>
