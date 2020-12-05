<template>
  <div class="content">
    <div>1. {{ $t('bpInfo.addEditor1') }}：</div>
    <div class="code"
      v-clipboard:copy="code"
      v-clipboard:success="onCopy"
      v-clipboard:error="onError">{{ code }}</div>
    <div>2. {{ $t('bpInfo.addEditor2') }}</div>
  </div>
</template>

<script>
export default {
  name: 'showContent',
  props: {
    content: {
      type: String,
      default: '',
    },
    bpname: {
      type: String,
      default: '',
    },
  },
  computed: {
    code() {
      const t = `cleos push action dfscommunity seteditor '["${ this.bpname }","editor_account"]' -p ${ this.bpname }`;
      return t
    }
  },
  methods: {
    onCopy() {
      this.$message.success(this.$t('public.copySuccess'));
    },
    onError() {
      this.$message.error(this.$t('public.copyFail'));
    },
  }
}
</script>

<style lang="scss" scoped>
.content{
  font-size: 28px;
  padding: 28px;
  border-radius: 12px;
  color: #333;

  .code{
    margin: 18px 0;
    background: #f5f5f5;
    border-radius: 12px;
    padding: 28px;
  }
}
</style>
