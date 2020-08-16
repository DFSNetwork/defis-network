<template>
  <div class="borrow" :class="{'en': $store.state.app.language === 'en'}">
    <my-header />
    <pools-info />
    <recharts />
    <symbols />
    <transactions />
  </div>
</template>

<script>
import MyHeader from './components/MyHeader'
import PoolsInfo from './components/PoolsInfo'
import Recharts from './components/Recharts'
import Symbols from './components/Symbols'
import Transactions from './components/Transactions'
export default {
  name: 'index',
  components: {
    MyHeader,
    PoolsInfo,
    Recharts,
    Symbols,
    Transactions,
  },
  data() {
    return {
    }
  },
  computed:{
  },
  props: {
  },
  watch: {
  },
  mounted() {
  },
  beforeDestroy() {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
</style>
