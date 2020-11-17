<template>
  <div class="rexLock">
    <div class="title">REX 待解锁列表</div>
    <div class="lists">
      <div class="list head flexb">
        <span>数量(REX)</span>
        <span>解锁时间</span>
      </div>
      <div class="list flexb" v-for="(item, index) in lists" :key="index">
        <span>{{ item.num }}</span>
        <span>{{ item.dateTime }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'rexLock',
  props: {
    lists: {
      type: Array,
      default: function lts() {
        return []
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.rexLock{
  padding: 26px;
  font-size: 27px;
  color: #333;
  .title{
    font-size: 30px;
    text-align: center;
    font-weight: 500;
    margin-bottom: 20px;
  }
  .lists{
    height: 500px;
    overflow: auto;
    .list{
      height: 70px;
      margin-bottom: 1px solid rgba(220,220,220, .3);
      &>span{
        flex: 1;
      }
    }
    .head{
      height: 60px;
    }
  }
}
</style>