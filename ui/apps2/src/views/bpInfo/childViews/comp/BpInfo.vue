<template>
  <div class="bpInfo">
    <div class="info">
      <div class="flexa">
        <img class="bpImg" src="https://cdn.jsdelivr.net/gh/defis-net/material/coin/tagtokenmain-tag.png" alt="">
        <div class="">
          <div class="name">dfs.bp</div>
          <div class="dfsVote dinReg">472079 票数</div>
        </div>
      </div>
      <div class="score">
        <div class="flexa">
          <div class="scoreInfo">
            <div class="num dinBold">9.5</div>
            <div class="star">
              <van-icon name="star" />
              <van-icon name="star" />
              <van-icon name="star" />
              <van-icon name="star" />
              <van-icon name="star" />
            </div>
            <div class="tip scoreCount">
              <span class="dinReg">21W</span>
              <span>人评价</span>
            </div>
          </div>
          <ScoreDetail />
          <div class="scoreNum tip">
            <div><span class="dinReg">10.8</span>万人推荐</div>
            <div><span class="dinReg">2.8</span>万人觉得还行</div>
            <div><span class="dinReg">1800</span>人觉得一般般</div>
          </div>
        </div>
        <div class="rank flexa">
          <img class="rankImg" src="https://cdn.jsdelivr.net/gh/defis-net/material/bpInfo/rank.png" alt="">
          <span>节点排行榜第2名</span>
        </div>
      </div>
    </div>

    <!-- 简介 -->
    <div class="desc">
      <div class="title flexb">
        <span>简介</span>
        <span class="add" v-if="isEditor" @click="handleToUpdate">编辑</span>
      </div>
      <div class="content">
        区块链奇才BM（Daniel Larimer）领导开发的类似操作
        系统的区块链架构平台，旨在实现分布式应用的性能扩
        展。EOS 提供帐户身份验证，数据库、图表…
        <span class="more">查看详情</span>
      </div>
      <div class="item flexb">
        <span class="tip">成立时间</span>
        <span>2017-05</span>
      </div>
      <div class="item flexb">
        <span class="tip">官网地址</span>
        <span>defis.network</span>
      </div>
    </div>
  </div>
</template>

<script>
import ScoreDetail from './ScoreDetail';
import {get_table_rows} from '@/utils/api'
export default {
  name: 'bpInfo',
  components: {
    ScoreDetail,
  },
  props: {
    isEditor: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {}
  },
  mounted() {
    this.handleGetQues()
    this.handleGetAns()
  },
  methods: {
    async handleGetQues() {
      const params = {
        // dfscommunity bp.dfs editors
        "code":"dfscommunity",
        "scope":"dfscommunity",
        "table":"questions",
        "json":true,
      }
      const {status, result} = await get_table_rows(params)
      if (!status) {
        return
      }
      console.log(result)
    },
    async handleGetAns() {
      const params = {
        // dfscommunity bp.dfs editors
        "code":"dfscommunity",
        "scope":"dfscommunity",
        "table":"answers",
        "json":true,
      }
      const {status, result} = await get_table_rows(params)
      if (!status) {
        return
      }
      console.log(result)
    },
    handleToUpdate() {
      this.$router.push({
        name: 'updateInfo',
        params: {
          bpname: 'bp.dfs'
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.bpInfo{
  font-size: 28px;
  text-align: left;
  color: #333;
  .info{
    padding: 30px 32px;
    border-bottom: 20px solid #f5f5f5;
    .bpImg{
      width: 64px;
      height: 64px;
      border-radius: 50%;
      margin-right: 10px;
    }
    .name{
      font-size: 32px;
      font-weight: 500;;
    }
    .dfsVote{
      color: #29D4B0;
    }
  }
  .score{
    margin-top: 34px;
    border: 1px solid rgba(220, 220, 220, .3);
    border-radius: 12px;
    padding: 26px 32px;
    .scoreInfo{
      color: #FFC300;
      text-align: center;
      font-size: 22px;
      margin-right: 20px;
      .num{
        font-size: 56px;
      }
      .star{
        font-size: 20px;
        margin-bottom: 6px;
        /deep/ .van-icon{
          margin: 3px;
        }
      }
    }
    .scoreNum{
      font-size: 20px;
      span{
        color: #333;
        font-weight: 300;
      }
      &>div{
        margin: 7px;
      }
    }
  }
  .rank{
    margin: 20px 0 0;
    padding: 24px 0 0;
    border-top: 1px solid rgba(220,220,220,.3);
    font-size: 26px;
    .rankImg{
      width: 30px;
      margin-right: 20px;
    }
  }
}
.desc{
  padding: 20px 32px;
  border-bottom: 20px solid #f5f5f5;
  .title{
    font-size: 32px;
    font-weight: 500;
    padding-left: 28px;
    position: relative;
    margin-bottom: 20px;
    &::before{
      content: '';
      position: absolute;
      height: 26px;
      width: 8px;
      top: 50%;
      left: 0px;
      transform: translate(0, -45%);
      background: #29D4B0;
      border-radius: 4px;
    }
    .add{
      font-size: 26px;
      background: #29D4B0;
      border-radius: 40px;
      padding: 8px 32px;
      font-weight: normal;
      color: #fff;
    }
  }
  .content{
    position: relative;
    margin-bottom: 15px;
  }
  .more{
    color: #29D4B0;
    position: absolute;
    bottom: 0px;
    right: 15px;
    background: #FFF;
  }
  .item{
    height: 90px;
    border-bottom: 1px solid rgba(220,220,220,.3);
    &:last-child{
      border-bottom: 0;
    }
  }
}
</style>
