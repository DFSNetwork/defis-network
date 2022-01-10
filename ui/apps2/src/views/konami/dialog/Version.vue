<template>
  <div class="version">
    <div>Versions V5.0.11</div>
    <div class="updata">{{ $t('public.lastUpdate') }}: 2021-05-06 18:30</div>
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
