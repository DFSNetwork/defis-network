<template>
  <div class="accInfo">
    <div class="flexb headTitle">
      <div class="title">{{ $t('invite.myFarm') }}</div>
      <div class="createBtn flexc" v-if="!accInfo.owner && joinInfo.owner" @click="handleTo('farmCreate')">
        <img class="addGreen" src="https://cdn.jsdelivr.net/gh/defis-net/material2/icon/add-green.png">
        <span>{{ $t('invite.create') }}</span>
      </div>
    </div>
    <div class="swipe">
      <div class="noData tip" v-if="!joinInfo.owner && !accInfo.owner">
        <div class="subTip">{{ $t('invite.noData') }}</div>
        <div class="createBtn flexc" v-if="!accInfo.owner" @click="handleTo('farmCreate')">
          <img class="addGreen" src="https://cdn.jsdelivr.net/gh/defis-net/material2/icon/add-green.png">
          <span>{{ $t('invite.create') }}</span>
        </div>
      </div>
      <van-swipe :loop="false" :width="300" :show-indicators="false">
        <van-swipe-item class="setWidth" v-if="joinInfo.owner">
          <div class="myAddFarm flexa" @click="handleTo('farmDetail', {name: joinInfo.owner})">
            <div class="farmHeadImg flexc">
              <img width="100%" :src="joinInfo.avatar">
            </div>
            <div>
              <div class="farmName">{{ joinInfo.farm_name }}</div>
              <div class="slogon">{{ joinInfo.slogon }}</div>
              <div class="tip num">{{ joinInfo.farmers }} 人</div>
            </div>
          </div>
        </van-swipe-item>
        <van-swipe-item  class="setWidth" v-if="accInfo.owner">
          <div class="myCreFarm flexa" @click="handleTo('farmDetail', {name: accInfo.owner})">
            <div class="farmHeadImg flexc model">
              <img width="100%" :src="accInfo.avatar">
              <div class="myFarmTab flexa">
                <img src="https://cdn.jsdelivr.net/gh/defis-net/material2/dfs/myFarm.png">
                <span>{{ $t('invite.myFarm') }}</span>
              </div>
            </div>
            <div>
              <div class="farmName">{{ accInfo.farm_name }}</div>
              <div class="slogon">{{ accInfo.slogon }}</div>
              <div class="tip num">{{ accInfo.farmers }} 人</div>
            </div>
          </div>
        </van-swipe-item>
      </van-swipe>
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
  .headTitle{
    margin-bottom: 20px;
  }
  .title{
    text-align: left;
    font-weight: 500;
    font-size: 36px;
  }
  .createBtn{
    font-size: 28px;
    color: $color-main;
    border: 1px solid $color-main;
    border-radius: 50px;
    padding: 6px 30px 6px 14px;
    .addGreen{
      width: 46px;
      margin-right: 4px;
    }
  }
  .swipe{
    margin-bottom: 30px;
    .noData{
      font-size: 28px;
      margin: 20px 0 10px;
      text-align: center;
      .subTip{
        margin-bottom: 20px;
      }
      .createBtn{
        margin: auto;
        width: 180px;
      }
    }
  }
  .myCreFarm,
  .createFarm,
  .myAddFarm{
    // width: 280px;
    // height: 320px;
    position: relative;
    border-radius: 8px;
    overflow: hidden;
    margin-right: 40px;
    text-align: left;
    .bg{
      max-width: 100%;
    }
    .farmHeadImg{
      width: 160px;
      height: 160px;
      border-radius: 8px;
      overflow: hidden;
      margin-right: 20px;
      min-width: 160px;
      position: relative;
      &.model{
        &::after{
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, .3);
        }
      }
    }
    .farmName{
      font-size: 32px;
      font-weight: 500;
    }
    .slogon{
      color: #666;
      font-size: 28px;
      margin: 8px 0;
      width: 400px;
      overflow: hidden;
      text-overflow: ellipsis; //溢出用省略号显示
      white-space: nowrap; //溢出不换行
    }
    .num{
      font-size: 24px;
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
      color: #FFF;
      height: 38px;
      font-size: 15px;
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
