<template>
  <div class="myCenter">
    <AccInfo />
    <AccWallet />
    <Tools />
  </div>
</template>

<script>
import AccInfo from '@/views/my/comp/AccInfo'
import AccWallet from  '@/views/my/comp/AccWallet'
import Tools from  '@/views/my/comp/Tools'

export default {
  name: 'myCenter',
  components: {
    AccInfo,
    AccWallet,
    Tools,
  }
}
</script>

<style lang="scss" scoped>
.myCenter{
  background: #f5f5f5;
  padding-bottom: 10px;
}
</style>
