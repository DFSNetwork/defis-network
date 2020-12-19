<template>
  <div class="paramsTip">
    <div class="content">
      <div>{{ $t('sysParams.rules1') }}</div>
      <ul class="subRules">
        <li>{{ $t('sysParams.rules2') }}</li>
        <li>{{ $t('sysParams.rules3') }}</li>
        <li>{{ $t('sysParams.rules4') }}</li>
      </ul>
      <div>{{ $t('sysParams.rules5') }}</div>
      <div>{{ $t('sysParams.rules6') }}</div>
      <div>{{ $t('sysParams.rules7') }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'paramsTip',
}
</script>

<style lang="scss" scoped>
.paramsTip{
  border-radius: 8px;
  padding: 26px;
  position: relative;
  font-size: 28px;
  color: #333;
  .content{
    font-size: 27px;
    text-align: left;
    &>div{
      margin-bottom: 10px;
    }
    .subRules>li{
      padding-left: 40px;
      margin: 10px 0;
      position: relative;

      &::before{
        content: '';
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #29D4B0;
        position: absolute;
        left: 20px;
        top: 20px;
        transform: translate(-50%, -50%);
      }
    }
  }
}
</style>
