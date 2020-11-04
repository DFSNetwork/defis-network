<template>
  <div class="voteNum flexb">
    <span>您的EOS票数: 1000</span>
    <span v-if="false" class="proxy btn">投票给TA</span>
    <span v-if="true" class="btn">管理票数</span>
  </div>
</template>

<script>
export default {
  name: 'accVoteNum',
}
</script>

<style lang="scss" scoped>
.voteNum{
  margin: 30px 32px;
  padding: 20px 26px;
  font-size: 27px;
  border: 8px;
  box-shadow: 0px 4px 8px 4px rgba(220,220,220,0.5);
  .btn{
    background: #29D4B0;
    border-radius: 40px;
    padding: 10px 36px;
    color: #FFF;
  }
}
</style>
