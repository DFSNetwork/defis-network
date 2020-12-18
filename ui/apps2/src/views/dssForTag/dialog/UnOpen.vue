<template>
  <div class="unOpen">
    {{ $t('dsr.unOpen') }}
    <div class="tip">{{ $t('dsr.testData') }}</div>
  </div>
</template>

<script>
  export default {
    
  }
</script>

<style lang="scss" scoped>
.unOpen{
  padding: 40px;
  .tip{
    margin-top: 10px;
    text-align: left;
  }
}
</style>
