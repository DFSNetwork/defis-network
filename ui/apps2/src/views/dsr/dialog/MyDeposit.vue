<template>
  <div class="myDeposit">
    <div class="title">我的存款</div>
    <div class="content">
      <div class="item">
        <span>我的存款：</span>
        <span>{{ myDepositInfo.bal || '0.0000 DFS' }}</span>
      </div>
      <!-- <div class="item">
        <span>已得利息：</span>
        <span>2.1234 DFS</span>
      </div> -->
      <div class="item">
        <span>年化：</span>
        <span>{{ yearApr }}%</span>
      </div>
      <div class="item">
        <span>存款占比：</span>
        <span>{{ rate }}%</span>
      </div>
      <div class="item">
        <span>到期时间：</span>
        <span>2{{myDepositInfo.releaseTime || '-'}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'myDeposit',
  props: {
    myDepositInfo: {
      type: Object,
      default: function md() {
        return {}
      }
    },
    yearApr: {
      type: String,
      default: '5.00'
    },
    rate: {
      type: String,
      default: '0.00'
    }
  }
}
</script>

<style lang="scss" scoped>
.myDeposit{
  padding: 40px;
  color: #000;
  .title{
    text-align: center;
    font-size: 32px;
    color: rgba(7,215,155,1);
    margin-bottom: 20px;
  }
  .content{
    padding: 20px 30px;
    border-radius: 30px;
    border: 1px solid #f3f3f3;
    font-size: 28px;
    .item{
      display: flex;
      align-items: center;
      justify-content: center;

      &>span{
        flex: 3;
        height: 50px;
        display: flex;
        align-items: center;
        &:first-child{
          flex: 2;
          justify-content: flex-end;
        }
      }
    }
  }
}
</style>
