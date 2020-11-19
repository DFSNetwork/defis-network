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
      <van-field class="searchIpt" v-model="search" placeholder="请输入用户昵称/ID" />
    </div>

    <div class="lists">
      <div class="noData tip" v-if="!lists.length">
        <img src="https://cdn.jsdelivr.net/gh/defis-net/material/noData/noData.png" alt="">
        <div v-if="$route.name === 'attention'">还没有任何关注的人</div>
        <div v-else-if="$route.name === 'fans'">暂时没有粉丝哦</div>
        <div v-else>暂时没有历史访问哦</div>
      </div>
      <div class="list flexb" v-for="(item, index) in lists" :key="index">
        <img class="headImg" src="https://cdn.jsdelivr.net/gh/defis-net/material/coin/eosio.token-eos.svg" alt="">
        <div class="mainData">
          <div class="name">Nick</div>
          <div class="desc tip">简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介</div>
        </div>
        <div class="type">
          <div class="atted flexc" v-if="$route.name === 'attention'">已关注</div>
          <div v-else-if="$route.name === 'fans'">
            <span class="atted flexc" v-if="item.isAtted">互相关注</span>
            <span class="fans flexc">回粉</span>
          </div>
          <div class="fans flexc" v-else>访问</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'accLists',
  data() {
    return {
      search: '',
      lists: [{}],
    }
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
  font-size: 28px;
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
    // .searchIpt{
    // }
  }
  .noData{
    padding-top: 15vh;
    img{
      width: 400px;
    }
  }
  .list{
    height: 158px;
    padding: 0 26px;
    border-bottom: 1px solid rgba(220, 220, 220, .3);
    &:last-child{
      border-bottom: 0px solid rgba(220, 220, 220, .3);
    }
    .headImg{
      height: 100px;
      width: 100px;
      border-radius: 50%;
      margin-right: 22px;
    }
    .mainData{
      flex: 1;
      text-align: left;
      .name{
        font-size: 32px;
        font-weight: 500;
      }
      .desc{
        font-size: 26px;
        margin-top: 4px;
        max-width: 390px;
        overflow:hidden; //超出的文本隐藏
        text-overflow:ellipsis; //溢出用省略号显示
        white-space:nowrap; //溢出不换行
      }
    }
    .atted{
      color: #999;
      border: 1px solid #CBCBCB;
      width: 140px;
      height: 56px;
      border-radius: 30px;
    }
    .fans{
      width: 140px;
      height: 56px;
      border-radius: 30px;
      color: #FFF;
      background: #29D4B0;
    }
  }
}
</style>
