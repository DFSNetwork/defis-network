<template>
  <div class="farmLists">
    <div class="subTip flexa">{{ $t('invite.farmer') }}</div>
    <div class="mainFarmer flexa">
      <!-- <div class="headImg"></div> -->
      <img class="headImg" :src="farmerInfo.avatar">
      <div>
        <div class="name">{{ farmerInfo.nick }}</div>
        <div class="tip small">
          <span>{{ $t('invite.wealth') }}：</span>
          <span>{{ farmInfo.wealth }}</span>
        </div>
      </div>
    </div>
    <div class="subTip flexa">{{ $t('invite.user') }}</div>
    <div class="lists">
      <div class="farmer flexa" v-for="(v, i) in subFarmers" :key="i">
        <!-- <div class="headImg"></div> -->
        <img class="headImg" :src="v.avatar">
        <div>
          <div class="name">{{ v.nick || v.owner}}</div>
          <div class="tip small">
            <span>{{ $t('invite.wealth') }}：</span>
            <span>{{ v.wealth }}</span>
          </div>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'farmLists',
  props: {
    subFarmers: {
      type: Array,
      default: function sf() {
        return []
      }
    },
    farmerInfo: {
      type: Object,
      default: function fi() {
        return {}
      }
    },
    farmInfo: {
      type: Object,
      default: function fi() {
        return {}
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.farmLists{
  font-size: 28px;
  text-align: left;
  padding-bottom: 50px;
  .subTip{
    background: #F5F5F5;
    padding-left: 28px;
    height: 52px;
  }
  .farmer,
  .mainFarmer{
    padding: 28px;
    .headImg{
      height: 80px;
      width: 80px;
      border-radius: 4px;
      margin-right: 18px;
      // background: #f5f5f5;
    }
    .name{
      font-weight: 500;
    }
    .small{
      font-size: 24px;
      width: 500px;
      overflow: hidden;
      text-overflow: ellipsis; //溢出用省略号显示
      white-space: nowrap; //溢出不换行
    }
  }
}
</style>
