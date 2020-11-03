<template>
  <div>
    <!-- 币种统计 -->
    <div class="title flexb">
      <span class="act">捐款记录</span>
    </div>

    <div class="lists">
      <van-list
        v-model="loadingMore"
        :finished="finished"
        :loading-text="$t('public.loading')"
        :finished-text="$t('public.noMore')"
        @load="handleCurrentChange"
      >
        <!-- <div class="noData tip" v-if="!pageLists.length">{{ $t('public.noData') }}</div> -->
        <div class="listOld" v-for="(item, index) in pageLists" :key="index" @click="handleToBrowser(item.trx_id)">
          <div class="flexb name">
            <span>{{ (item.fromx) }}</span>
            <span class="tip">{{ handleToLocalTime(item.create_time) }}</span>
          </div>
          <div class="price flexb">
            <span class="tip">转账数量</span>
            <span class="flexc qua">{{ item.quantity }}</span>
          </div>
          <div class="price flexb">
            <span class="tip">留言</span>
            <span class="hideText">{{ item.memo }}</span>
          </div>
        </div>
      </van-list>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import {toLocalTime, toBrowser} from '@/utils/public'
export default {
  name: 'fundationLists',
  props: {
    pageLists: {
      type: Array,
      default: function lists() {
        return []
      }
    },
    finished: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loadingMore: false,
      toTx: false
    }
  },
  watch: {
    pageLists: {
      handler: function pls() {
        this.loadingMore = false;
      }
    }
  },
  methods: {
    handleToLocalTime(time) {
      let t = moment(`${time}`).valueOf()
      t += 3600 * 8 * 1000;
      const oDate = toLocalTime(t)
      return oDate
    },
    handleToBrowser(id, type = 'tx') {
      if (!this.toTx) {
        return
      }
      toBrowser(id, type)
    },
    handleCurrentChange() {
      this.$emit('listenCurrentChange', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.title{
  font-size: 32px;
  text-align: left;
  margin: 20px 40px 40px;
  &>span{
    margin-right: 60px;;
  }
  .about{
    margin-left: 10px;
    font-size: 24px;
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
  .right{
    margin-right: 0
  }
}
.lists{
  margin: 30px;
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
    .hideText{
      max-width: 600px;
      overflow: hidden;
      text-overflow:ellipsis; //溢出用省略号显示
      white-space:nowrap; //溢出不换行
    }
    .price{
      text-align: left;
      &>span:first-child{
        width: 120px;
        min-width: 120px;
      }
    }

    .name{
      &>span{
        text-align: left;
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
</style>
