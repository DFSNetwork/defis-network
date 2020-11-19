<template>
  <div class="accLists">
    <div class="title flexb">
      <span class="back flexa" @click="$router.back()">
        <img src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/back.png" alt="">
      </span>
      <span v-if="$route.name === 'attention'">关注</span>
      <span v-else-if="$route.name === 'fans'">粉丝</span>
      <span v-else>访客</span>
      <span class="back"></span>
    </div>
    <div class="searchDiv flexa">
      <img src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/search.png">
      <van-field class="searchIpt" v-model="value" placeholder="请输入用户昵称/ID" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'accLists',
  data() {
    return {}
  },
  computed: {
    ...mapState({
      scatter: state => state.app.scatter,
      accInfo: state => state.app.accInfo,
    }),
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.accLists{
  font-size: 32px;
  color: #333;
  .title{
    font-size: 36px;
    height: 80px;
    padding: 0 28px;
    font-weight: 500;
    .back{
      width: 50px;
      height: 50px;
      img{
        display: block;
        width: 18px;
      }
    }
  }
  .searchDiv{
    margin: 10px 28px;
    border-radius: 30px;
    height: 66px;
    padding: 0 26px;
    background: #F5F6F6;
    img{
      width: 26px;
      margin-right: 16px;
    }
    /deep/ .van-cell{
      background: #F5F6F6;
      height: 100%;
      padding: 0;
      .van-field__value{
        display: flex;
        align-items: center;
        .van-field__body{
          flex: 1;
        }
      }
      .van-field__control{
        width: 100%;
      }
    }
    .searchIpt{
    }
  }
}
</style>
