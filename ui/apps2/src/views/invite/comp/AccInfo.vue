<template>
  <div class="accInfo">
    <div class="title">{{ $t('invite.myFarm') }}</div>
    <div class="flexa">
      <!-- 我加入的农场 -->
      <div class="myAddFarm flexc" v-if="joinInfo.owner" @click="handleTo('farmDetail', {name: joinInfo.owner})">
        <img class="bg" :src="joinInfo.bg">
        <div class="template flexc">
          <div>
            <div>{{ joinInfo.farm_name }}</div>
            <div class="num tip">{{ joinInfo.slogon }}</div>
          </div>
        </div>
      </div>
      <!--自己没有创建农场时展示 -->
      <div class="createFarm flexc tip" @click="handleTo('farmCreate')" v-if="!accInfo.owner">
        <img class="tipIcon" @click.stop="showTip = true"
          src="https://cdn.jsdelivr.net/gh/defis-net/material2/dfs/tipIcon.png">
        <div>
          <img class="createImg" src="https://cdn.jsdelivr.net/gh/defis-net/material2/dfs/create.png">
          <div>{{ $t('invite.create') }}</div>
        </div>
      </div>
      <!-- 我创建的农场 -->
      <div class="myCreFarm flexc" v-else  @click="handleTo('farmDetail', {name: accInfo.owner})">
        <div class="myFarmTab flexa">
          <img src="https://cdn.jsdelivr.net/gh/defis-net/material2/dfs/myFarm.png">
          <span>{{ $t('invite.myFarm') }}</span>
        </div>
        <img class="bg" :src="accInfo.bg">
        <div class="template flexc">
          <div>
            <div>{{ accInfo.farm_name }}</div>
            <div class="num tip">{{ accInfo.slogon }}</div>
          </div>
        </div>
      </div>
    </div>

    <van-popup class="popup_p" v-model="showTip">
      <CreateTip @listenClose="handleClose"/>
    </van-popup>
  </div>
</template>

<script>
import CreateTip from '../dialog/CreateTip';
export default {
  name: 'accInfo',
  components: {
    CreateTip
  },
  props: {
    accInfo: {
      type: Object,
      default: function ai() {
        return {}
      }
    },
    joinInfo: {
      type: Object,
      default: function ji() {
        return {}
      }
    }
  },
  data() {
    return {
      showTip: false,
    }
  },
  methods: {
    handleTo(name, params) {
      this.$router.push({
        name, params
      })
    },
    handleClose() {
      this.showTip = false;
    }
  }
}
</script>

<style lang="scss" scoped>
.accInfo{
  color: #333;
  margin: 0 28px 28px;
  .title{
    text-align: left;
    font-weight: 400;
    font-size: 36px;
    margin-bottom: 26px;
  }
  .myCreFarm,
  .createFarm,
  .myAddFarm{
    width: 280px;
    height: 320px;
    position: relative;
    border-radius: 8px;
    overflow: hidden;
    margin-right: 40px;
    .bg{
      max-width: 100%;
    }
    .template{
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      position: absolute;
      background: rgba(#272727, .6);
      color: #FFF;
      font-size: 28px;
      .num{
        font-size: 26px;
      }
    }
  }
  .createFarm{
    border: 1px dashed #C7C7C7;
    font-size: 30px;
    .tipIcon{
      width: 32px;
      position: absolute;
      top: 24px;
      right: 28px;
    }
    .createImg{
      width: 80px;
      margin-bottom: 15px;
    }
  }
  .myCreFarm{
    margin-right: 0;
    position: relative;
    .myFarmTab{
      z-index: 3;
      position: absolute;
      top: 0px;
      left: 0px;
      background: linear-gradient(140deg, #4ADBC9 0%, #37C7A7 100%);
      // width: 124px;
      color: #FFF;
      height: 48px;
      font-size: 18px;
      border-radius: 8px 2px 8px 2px;
      padding: 4px 14px;
      img{
        width: 24px;
        margin-right: 8px;
        display: block;
      }
    }
  }
}
</style>
