<template>
  <div class="history">
    <div class="lists">
      <div class="noData tip" v-if="!pageLists.length">{{ $t('public.noData') }}</div>
      <div class="list" v-for="(item, index) in pageLists" :key="index">
        <div class="flexb">
          <span class="flexc num">
            <span>{{ item.fromx }}</span>
            <img class="exchange" src="@/assets/img/dex/exchange.svg" alt="">
            <span>{{ item.tox }}</span>
          </span>
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
import {toLocalTime} from '@/utils/public'
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
    .noData{
      padding: 50px 0;
      font-size: 30px;
    }
    .list{
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
      .num{
        font-size: 33px;
        .exchange{
          margin: 0 8px;
          width: 30px;
        }
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
