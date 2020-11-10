<template>
  <div class="rankTip">
    <div class="title">{{ $t('public.warmPrompt') }}</div>
    <div class="content">
      该矿池排名在TOP21之外，暂无挖矿收益。
    </div>
  </div>
</template>

<script>
export default {
  name: 'rankTip',
}
</script>

<style lang="scss" scoped>
.rankTip{
  padding: 40px;
  font-size: 26px;
  .title{
    color: #f5a623;
    text-align: center;
    font-size: 30px;
    margin-bottom: 20px;
  }
}
</style>
