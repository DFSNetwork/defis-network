<template>
  <div class="accVoteInfo flexb">
    <div>
      <div class="votes flexb">
        <span class="flexa">
          <span>{{ $t('vote.myVote') }}：10000</span>
        </span>
      </div>
    </div>
    <div>
      <span class="btn" @click="handleToDss">{{ $t('market.manage') }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'accInfo',
  data() {
    return {
      isVoted: true,
    }
  },
  methods: {
    handleToDss() {
      
    }
  }
}
</script>

<style lang="scss" scoped>
.accVoteInfo{
  font-size: 26px;
  text-align: left;
  margin: 40px;
  background: #07d79b;
  border-radius: .26667rem;
  color: #fff;
  padding: 30px;
  box-shadow: 0 0.26667rem 0.53333rem 0 hsla(0,0%,86.3%,.5);
  .btn{
    padding: 8px 20px;
    background: #FFF;
    color: #07D79B;
    border-radius: 5px;
    margin-left: 10px;
  }
  .refresh{
    margin-left: 8px;
    width: 30px;
    height: 30px;
    display: inline-block;
    border-radius: 30px;
  }
}
</style>