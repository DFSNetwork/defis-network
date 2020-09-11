<template>
  <div class="version">
    <div>Versions V2.0.47</div>
    <div class="updata">{{ $t('public.lastUpdate') }}: 2020-09-11 15:00</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
.version{
  padding: 40px;
  font-size: 28px;
  text-align: left;
  padding-left: 80px;
  .updata{
    margin-top: 10px;
  }
}
</style>
