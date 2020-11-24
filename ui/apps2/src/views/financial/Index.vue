<template>
  <div class="financial">
    <div class="banner">
      <img src="https://cdn.jsdelivr.net/gh/defis-net/material/financial/financial.png" alt="">
    </div>
    <Steady />
  </div>
</template>

<script>
import Steady from './comp/Steady'
export default {
  name: 'financial',
  components: {
    Steady
  },
}
</script>

<style lang="scss" scoped>
.financial{
  font-size: 28px;
  min-height: 100vh;
  background: #F5F5F5;
  .banner{
    img{
      display: block;
      width: 100%;
    }
  }
}
</style>
