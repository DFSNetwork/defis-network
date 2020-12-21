<template>
  <div class="myDeposit">
    <div class="title">
      <span v-if="isMe">{{ $t('dsr.myDeposit') }}</span>
      <span v-else>{{ $t('dsr.whoDeposit', {acc: handleDealAccountHide(myDepositInfo.holder)}) }}</span>
    </div>
    <div class="content">
      <div class="item">
        <span>{{ $t('dsr.deposit') }}：</span>
        <span>{{ myDepositInfo.bal || '0.00000000 TAG' }}</span>
      </div>
      <div class="item">
        <span>{{ $t('dsr.nowApy') }}：</span>
        <span>{{ yearApr }}%</span>
      </div>
      <div class="item">
        <span>{{ $t('dsr.percent') }}：</span>
        <span>{{ rate }}%</span>
      </div>
      <div class="item">
        <span>{{ $t('dsr.endDate') }}：</span>
        <span v-if="!myDepositInfo.isRelease" class="warn">{{myDepositInfo.releaseTime || '-'}}</span>
        <span v-else>{{ $t('dsr.anyTime') }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { dealAccountHide } from '@/utils/public';

export default {
  name: 'myDeposit',
  props: {
    myDepositInfo: {
      type: Object,
      default: function md() {
        return {}
      }
    },
    yearApr: {
      type: String,
      default: '-'
    },
    rate: {
      type: String,
      default: '0.00'
    },
    isMe: {
      type: Boolean,
      default: false,
    }
  },
  methods: {
    handleDealAccountHide(str) {
      return dealAccountHide(str)
    },
  }
}
</script>

<style lang="scss" scoped>
.warn{
  color: #f5a623;
}
.myDeposit{
  padding: 40px;
  color: #000;
  .title{
    text-align: center;
    font-size: 32px;
    color: rgba(7,215,155,1);
    margin-bottom: 20px;
  }
  .content{
    padding: 20px 30px;
    border-radius: 30px;
    border: 1px solid #f3f3f3;
    font-size: 28px;
    .item{
      display: flex;
      align-items: center;
      justify-content: center;

      &>span{
        flex: 3;
        height: 50px;
        display: flex;
        align-items: center;
        &:first-child{
          flex: 2;
          justify-content: flex-end;
        }
      }
    }
  }
}
</style>
