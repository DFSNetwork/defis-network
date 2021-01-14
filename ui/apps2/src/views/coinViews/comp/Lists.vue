<template>
  <div class="history">
    <div class="lists">
      <div class="noData tip" v-if="!pageLists.length">{{ $t('public.noData') }}</div>
      <div v-for="(item, index) in pageLists" :key="index" @click="handleToBrowser(item.trx_id)">
        <div class="listOld" v-if="item.transType === -1">
          <div class="flexb name">
              <span>{{ (item.fromx) }}</span>
              <span class="flexc"><img class="exchange" src="https://cdn.jsdelivr.net/gh/defis-net/material/dex/exchange.svg" alt=""></span>
              <span>{{ (item.tox) }}</span>
          </div>
          <div class="price flexb">
            <span class="tip">转账数量</span>
            <span class="flexc qua dinReg">{{ item.quantity }}</span>
          </div>
          <div class="price flexb tip">
            <span>转账时间</span>
            <span>{{ handleToLocalTime(item.create_time) }}</span>
          </div>
        </div>
        <div class="listOld flexb" v-else>
          <div class="liTitle">
            <div class="fromx">{{ (item.fromx) }}</div>
            <div class="tip mt10">转账数量</div>
            <div class="tip mt10">转账时间</div>
          </div>
          <div class="transType flexc" :class="{'buy': item.transType === 1, 'sell': item.transType === 0}">
            <span v-if="item.transType === 1">买入</span>
            <span v-else-if="item.transType === 0">卖出</span>
            <span v-else-if="item.transType === 2">做市</span>
            <span v-else-if="item.transType === 3 || item.transType === 5">取回</span>
            <span v-else-if="item.transType === 4">存入</span>
            <span v-else>转账</span>
          </div>
          <div class="content dinReg">
            <div class="smallTo tip">{{ (item.tox) }}</div>
            <div class="qua mt10">{{ item.quantity }}</div>
            <div class="mt10 tip">{{ handleToLocalTime(item.create_time) }}</div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import moment from 'moment';
import { mapState } from 'vuex';
import {toLocalTime, toBrowser, dealAccountHide} from '@/utils/public'
export default {
  name: 'tradeHistory',
  components: {
  },
  props: {
    pageLists: {
      type: Array,
      default: function lists() {
        return []
      }
    },
    checkedMarket: {
      type: Object,
      default: function lists() {
        return {}
      }
    }
  },
  computed: {
    ...mapState({
      scatter: state => state.app.scatter,
    }),
  },
  data() {
    return {
    }
  },
  methods: {
    handleDealAccountHide(str) {
      return dealAccountHide(str)
    },
    handleToLocalTime(time) {
      let t = moment(`${time}`).valueOf()
      t += 3600 * 8 * 1000;
      const oDate = toLocalTime(t)
      return oDate
    },
    handleToBrowser(id, type = 'tx') {
      toBrowser(id, type)
    }
  },
}
</script>

<style lang="scss" scoped>
.history{
  font-size: 27px;
  color: #333;
  text-align: left;
  line-height: 40px;
  .title{
    font-size: 32px;
    text-align: left;
    margin: 40px 0 40px;
    padding: 0 0 0 40px;
    color: #000;
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
      cursor: pointer;
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

  .lists{
    .mt10{
      margin-top: 10px;
    }
    .exchange{
      margin: 0 8px;
      width: 30px;
    }
    .noData{
      padding: 50px 0;
      font-size: 30px;
    }
    .subTitle{
      color: #444;
    }
    .listOld{
      margin: 30px 0 0;
      padding: 30px;
      border-radius: 12px;
      border: 1px solid #EAEAEA;
      &>div{
        margin-top: 10px;
        &:first-child{
          margin-top: 0;
        }
      }
      .name{
        &>span{
          text-align: left;
          flex: 3;
          &:nth-child(2){
            flex: 1;
          }
          &:nth-child(3){
            text-align: right;
          }
        }
      }
      .num{
        font-size: 33px;
      }
      .qua{
        font-size: 30px;
        font-weight: 500;
      }
      .liTitle{
        flex: 1;
        .fromx{
          font-size: 30px;
          font-weight: 500;
        }
      }
      .content{
        flex: 1;
        text-align: right;
        font-size: 24px;
      }
      .transType{
        width: 68px;
        height: 68px;
        font-size: 22px;
        border: 3px solid #FFD200;
        border-radius: 40px;
        color: #FFD200;
        font-weight: 500;
        &.sell{
          border: 3px solid #FF2800;
          color: #FF2800;
        }
        &.buy{
          border: 3px solid #29D4B0;
          color: #29D4B0;
        }
      }
    }
  }

  .iconImg{
    width: 30px;
    margin: 0 0 0 8px;
  }
}
</style>
