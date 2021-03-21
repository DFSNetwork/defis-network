<template>
  <div class="farmLists">
    <div class="subTip flexa">{{ $t('invite.farmer') }}</div>
    <div class="mainFarmer flexa">
      <!-- <div class="headImg"></div> -->
      <img class="headImg" :src="farmerInfo.avatar || defaultImg" :onerror="errorImg">
      <div>
        <div class="name">{{ farmerInfo.nick || farmInfo.owner }}</div>
        <div class="tip small intro">
          <!-- <span>{{ $t('invite.wealth') }}：</span> -->
          <span>{{ farmerInfo.desc || '-' }}</span>
        </div>
      </div>
    </div>
    <div class="subTip flexa">{{ $t('invite.user') }}</div>
    <div class="lists">
      <div class="farmer flexa" v-for="(v, i) in subFarmers" :key="i">
        <!-- <div class="headImg"></div> -->
        <img class="headImg" :src="v.avatar || defaultImg" :onerror="errorImg">
        <div>
          <div class="name">{{ v.nick || v.owner}}</div>
          <div class="tip small">
            <span>{{ $t('invite.wealth') }}：</span>
            <span>${{ parseFloat(v.wealth) }}（{{ handleGetRate(v.wealth) }}%）</span>
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
  },
  data() {
    return {
      defaultImg: 'https://ndi.340wan.com/eos/eosio.token-eos.png',
      errorImg: 'this.src="https://ndi.340wan.com/eos/eosio.token-eos.png"',
    }
  },
  methods: {
    // 获取占比
    handleGetRate(wealth) {
      const w = parseFloat(wealth || 0);
      const all = parseFloat(this.farmInfo.wealth || 0);
      if (!all) {
        return 0
      }
      return (w/all * 100).toFixed(2)
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
    .intro{
      width: 100%;
      word-break: break-all;
      white-space: pre-wrap;
    }
  }
}
</style>
