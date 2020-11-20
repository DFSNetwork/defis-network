<template>
  <div>
    <OtherAccInfo />
    <Dynamic />
  </div>
</template>

<script>
import OtherAccInfo from './comp/OtherAccInfo';
import Dynamic from './comp/Dynamic';
// import {acc_visit_other} from '@/utils/api'
export default {
  name: 'otherInfo',
  components: {
    OtherAccInfo,
    Dynamic
  },
  data() {
    return {
      id: '',
    }
  },
  mounted() {
    this.id = this.$route.params.id;
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>

</style>
