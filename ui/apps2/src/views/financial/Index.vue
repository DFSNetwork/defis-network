<template>
  <div class="financial">
    <div class="banner">
      <img src="https://cdn.jsdelivr.net/gh/defis-net/material/financial/financial1.png" alt="">
    </div>
    <Steady />
    <Radical/>
  </div>
</template>

<script>
import Radical from './comp/Radical'
import Steady from './comp/Steady'
export default {
  name: 'financial',
  components: {
    Steady,
    Radical
  },
}
</script>

<style lang="scss" scoped>
.financial{
  font-size: 28px;
  min-height: 100vh;
  background: #F5F5F5;
  padding-bottom: 30px;
  .banner{
    img{
      display: block;
      width: 100%;
    }
  }
}
</style>
