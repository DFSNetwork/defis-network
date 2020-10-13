<template>
  <div class="history">
    <div class="lists">
      <div class="noData tip" v-if="!pageLists.length">{{ $t('public.noData') }}</div>
      <div class="listOld" v-for="(item, index) in pageLists" :key="index" @click="handleToBrowser(item.trx_id)">
        <div class="flexb name">
          <!-- <span class="flexc num"> -->
            <span>{{ item.fromx }}</span>
            <span class="flexc"><img class="exchange" src="@/assets/img/dex/exchange.svg" alt=""></span>
            <span>{{ item.tox }}</span>
          <!-- </span> -->
        </div>
        <div class="price flexb">
          <span class="tip">转账数量</span>
          <span class="flexc qua">{{ item.quantity }}</span>
        </div>
        <div class="price flexb tip">
          <span>转账时间</span>
          <span>{{ handleToLocalTime(item.create_time) }}</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { mapState } from 'vuex';
import {toLocalTime, toBrowser} from '@/utils/public'
export default {
  name: 'tradeHistory',
  components: {
    // MarketList,
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
    handleToLocalTime(t) {
      return toLocalTime(t)
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
      // margin: 40px;
      padding: 30px;
      border-radius: 15px;
      box-shadow: 0px 8px 40px 0px rgba(220,220,220,0.5);
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
    }
  }

  .iconImg{
    width: 30px;
    margin: 0 0 0 8px;
  }
}
</style>
