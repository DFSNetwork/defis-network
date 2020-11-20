<template>
  <div>
    <OtherAccInfo />
    <Dynamic />
  </div>
</template>

<script>
import OtherAccInfo from './comp/OtherAccInfo';
import Dynamic from './comp/Dynamic';
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
    this.handleGetOtherInfo();
  },
  methods: {
    handleGetOtherInfo() {
      
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
