<template>
  <div class="tipDiv">
    <div class="content">
      <!-- {{ $t('financial.rules10') }} -->
      <div>{{ $t('financial.rules5') }}</div>
      <div class="li">{{ $t('financial.rules8') }}</div>
      <div class="li">{{ $t('financial.rules9') }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'rules',
}
</script>

<style lang="scss" scoped>
.tipDiv{
  padding: 26px;
  font-size: 28px;
  .content{
    &>div{
      margin-bottom: 10px;
    }
  }
}
</style>
