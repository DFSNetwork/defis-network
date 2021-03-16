<template>
  <div>
    <!-- <div class="next tip">下次更新时间(08:00:00)</div> -->
    <div class="voteLists">
      <div class="noData tip" v-if="!rankLists.length">{{ $t('public.noData') }}</div>
      <template  v-for="(item, index) in rankLists">
        <div v-if="index < 21" class="list flexa" :key="index">
          <div class="rankDiv dinBold">
            <img v-if="index < 3" :src="`https://cdn.jsdelivr.net/gh/defis-net/material/rank/voteRank${index+1}.png`" alt="">
            <span v-else>{{index + 1}}</span>
          </div>
          <div>
            <div class="poolName">
              <span class="coinImg flexa">
                <span class="flexa">
                  <img :src="item.sym0Data.imgUrl" :onerror="errorCoinImg">
                  <span>{{ item.symbol0 }}</span>
                </span>
                <span class="flexa">
                  <img :src="item.sym1Data.imgUrl" :onerror="errorCoinImg">
                  <span>{{ item.symbol1 }}</span>
                </span>
              </span>
            </div>
            <div class="num">
              <img class="voteIcon" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/vote.png" alt="">
              <span>{{ item.total_votes || '0' }}</span>
              <span class="tip small">（{{ item.votesRate || '0.00' }}%）</span>
              <span class="green" @click.stop="handleToDetail(item)">{{ $t('public.detail') }}></span>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { getV3PoolsClass } from '@/utils/logic';
export default {
  name: 'voteList',
  props: {
    rankList: {
      type: Array,
      default: function lists() {
        return []
      }
    },
    voteList: {
      type: Array,
      default: function lists() {
        return []
      }
    },
  },
  watch: {
    rankList: {
      handler: function sl(newVal) {
        this.rankLists = newVal;
        this.$forceUpdate()
      },
      deep: true,
      immediate: true,
    },
    voteList: {
      handler: function sl(newVal) {
        const arr = JSON.parse(JSON.stringify(newVal)) || [];
        arr.sort((a, b) => {
          return parseFloat(b.total_votes) - parseFloat(a.total_votes)
        })
        this.rankVote = arr;
      },
      deep: true,
      immediate: true,
    },
  },
  data() {
    return {
      errorCoinImg: 'this.src="https://ndi.340wan.com/eos/eosio.token-eos.png"',
      rankLists: [],
      rankVote: [],
    }
  },
  methods: {
    handleGetClass(mid) {
      return getV3PoolsClass(mid)
    },
    handleToDetail(item) {
      this.$router.push({
        name: 'voteDetail',
        params: {
          symbol: `${item.symbol0}-${item.symbol1}`,
          mid: item.mid
        }
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.voteLists{
  padding: 0 30px;
}
.noData{
  padding: 50px 0;
  font-size: 30px;
}
.list{
  position: relative;
  border-top: 1px solid #eee;
  padding: 28px 0;
  border-radius: 20px;
  .rankDiv{
    width: 64px;
    height: 64px;
    font-size: 28px;
    color: #999;
    margin-right: 12px;
    img{
      width: 64px;
    }
  }
  .coinImg{
    margin-bottom: 16px;
    img{
      width: 44px;
      height: 44px;
      border-radius: 25px;;
      margin-right: 10px;
    }
    &>span{
      &:first-child{
        margin-right: 30px;
      }
    }
  }
  .num{
    margin-top: 8px;
    text-align: left;
    .voteIcon{
      width: 28px;
      margin-right: 8px;
    }
    .icon{
      font-size: 27px;
      margin-right: 8px;
    }
    .small{
      font-size: 24px;
      margin-left: -8px;
    }
    .green{
      font-size: 22px;
      color: #29D4B0;
    }
  }
}
.rankImg{
  position: relative;
  width: 80px;
  margin-right: 10px;
  img{
    width: 100%;
  }
  .rankNum{
    position: absolute;
    bottom: 28px;
    left: 50%;
    font-size: 27px;
    transform: translateX(-55%);
    color: #FFF;
  }
}
</style>
