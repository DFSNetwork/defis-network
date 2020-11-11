<template>
  <div class="tipDia">
    <div class="title">温馨提示</div>
    <div class="content">您有待领取收益，REX买卖将会导致收益丢失，请先领取</div>
    <div class="btnDiv flexb">
      <div class="btn flexc next" @click="handleClick('next')">忽略</div>
      <div class="btn flexc" @click="handleClick('claim')">领取</div>
    </div>
  </div>
</template>

<script>
export default {
  name: '',
  methods: {
    handleClick(type) {
      this.$emit('listenType', type)
    }
  }
}
</script>

<style lang="scss" scoped>
.tipDia{
  text-align: left;
  font-size: 27px;
  padding: 26px 40px;
  color: #333;
}
.title{
  color: #f5a623;
  font-size: 30px;
  font-weight: 500;
  text-align: center;
  margin-bottom: 10px;
}
.btnDiv{
  margin-top: 10px;
  .btn{
    flex: 1;
    height: 60px;
    border-radius: 30px;
    margin-right: 20px;
    background: #29d4b0;
    color: #fff;
    &:last-child{
      margin-right: 0px;
    }
    &.next{
      background: #f5f5f5;
      color: #999;
    }
  }
}
</style>
