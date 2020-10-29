<template>
  <div class="nodeVote">
    <div class="banner">
      <img class="bgImg" src="@/assets/img/poolspage/top_bg.svg" alt="">
      <div class="title">Node Vote</div>
      <div class="titleTip">
        Node Vote
      </div>
    </div>
    <div class="mainTitle flexb">
      <span class="act">{{ $t('vote.vote') }}</span>
      <span class="flexa rulesTip tip" @click="showRules = !showRules">
        <span>{{ $t('vote.voteRules') }}</span>
        <img class="tipIcon" src="@/assets/img/dex/tips_icon_btn.svg" alt="">
      </span>
    </div>
    <!-- 用户票数统计数据 -->
    <AccInfo />
    <!-- tab数据 -->
    <div class="tabDiv">
      <div class="tab flexb">
        <div class="nav">
          <span :class="{'act': act === 1}" @click="handleChangeTab(1)">默认</span>
          <span :class="{'act': act === 2}" @click="handleChangeTab(2)">{{ $t('vote.rank') }}</span>
          <span :class="{'act': act === 3}" @click="handleChangeTab(3)">{{ $t('vote.voted') }}</span>
        </div>
        <div class="search">
          <el-input prefix-icon="el-icon-search" @input="handleSearch"
            v-model="search" placeholder="搜索节点"></el-input>
        </div>
      </div>
      <div class="lsContent">
        <NodeList :act="act"/>
      </div>
    </div>

    <!-- 悬浮按钮 -->
    <div class="nullDiv"></div>
    <div class="voteAction flexb">
      <span>{{ $t('vote.checked') }} {{ checkedLeng }}/3</span>
      <span>
        <span v-if="checkedLeng" class="tip" @click="handleCancel">{{ $t('vote.cancelChecked') }}</span>
        <span class="voteBtn" v-loading="voteLoading" @click="handleTovote">{{ $t('vote.toVote') }}</span>
      </span>
    </div>
  </div>
</template>

<script>
import AccInfo from './comp/AccInfo';
import NodeList from './comp/NodeList';
export default {
  name: 'nodeVote',
  components: {
    AccInfo,
    NodeList,
  },
  data() {
    return {
      showRules: false,
      act: 1,
      search: '',
      checkedLeng: 0,
      voteLoading: false,
    }
  },
  methods: {
    handleSearch() {},
    handleCancel() {},
    handleTovote() {},
    handleChangeTab(num) {
      this.act = num
    }
  }
}
</script>

<style lang="scss" scoped>
.nodeVote{
  .banner{
    font-size: 30px;
    color: #fff;
    position: relative;
    background: #07D79B;
    padding: 60px 40px 60px;
    overflow: hidden;
    .title{
      position: relative;
      font-size: 54px;
      margin-bottom: 10px;
      z-index: 2;
    }
    .titleTip{
      position: relative;
      z-index: 2;
    }
    .bgImg{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 0;
    }
  }
  .mainTitle{
    font-size: 32px;
    text-align: left;
    margin: 30px 0;
    padding: 0 0 0 40px;
    &>span{
      margin-right: 60px;;
    }
    .rulesTip{
      font-size: 30px;
      margin-right: 40px;
      .tipIcon{
        margin-left: 8px;
      }
    }
    .act{
      color: $color-black;
      position: relative;
      &::before{
        content: '';
        position: absolute;
        width:60px;
        height:8px;
        background:rgba(2,198,152,1);
        border-radius:4px;
        bottom: -20px;
        left: 50%;
        transform: translateX(-45%);
      }
    }
  }
  .tabDiv{
    font-size: 28px;
    text-align: left;
    margin: 20px 30px;
    padding: 0 20px 0;
    box-shadow: 0 0.26667rem 0.53333rem 0 hsla(0,0%,86.3%,.5);
    .tab{
      padding: 20px 10px;
      top: 0;
      background: #FFF;
      position: sticky;
      z-index: 10;
      .nav{
        background: #FFF;
        color: #a6a6a6;
        &>span{
          margin-right: 20px;
          &:last-child{
            margin-right: 0;
          }
        }
        .act{
          color: #000;
          font-weight: 500;
        }
      }
      .search{
        /deep/ .el-input{
          width: 300px;
          // padding-left: 10px;
          .el-input__inner{
            text-align: center;
            font-size: 30px;
            height: 60px;
            line-height: 38px;
            padding-left: 40px;
            border-radius: 30px;
            &:focus{
              border-color: #07d79b;
            }
          }
          .el-input__prefix{
            margin-left: 10px;
            font-size: 30px;
            width: 30px;
          }
          .el-icon-search{
            // &::before{
              display: flex;
              align-items: center;
              justify-content: center;
            // }
          }
        }
      }
    }
  }
}
.nullDiv{
  height: 120px;
  width: 100%;
}
.voteAction{
  position: fixed;
  bottom: 0px;
  width: 100%;
  max-width: 750px;
  height: 120px;
  background: #fff;
  padding: 0 40px;
  font-size: 30px;
  box-sizing: border-box;
  border-top: 1px solid #eee;
  .voteBtn{
    margin-left: 20px;
    background: #07d79b;
    color: #FFF;
    padding: 12px 40px;
    border-radius: 30px;
  }
}
</style>