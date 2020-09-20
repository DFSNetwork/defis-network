<template>
  <div>
    <!-- <div class="next tip">下次更新时间(08:00:00)</div> -->
    <div class="voteLists">
      <div class="noData tip" v-if="!rankLists.length">暂无数据</div>
      <template  v-for="(item, index) in rankLists">
        <div v-if="index < 20" :class="`list flexb ${getClass(index)}`" :key="index">
          <div>
            <div class="poolName">
              <span class="coinImg flexa">
                <span class="flexa">
                  <img :src="item.sym0Data.imgUrl" :onerror="errorCoinImg">
                  <span>{{ item.symbol0 }}</span>
                </span>
                <span class="add">+</span>
                <span class="flexa">
                  <img :src="item.sym1Data.imgUrl" :onerror="errorCoinImg">
                  <span>{{ item.symbol1 }}</span>
                </span>
              </span>
            </div>
            <div class="num">
              <span class="el-icon-coin icon"></span>
              <span>{{ item.total_votes || '0' }}（{{ item.votesRate || '0.00' }}%）</span>
            </div>
          </div>
          <label class="rankImg" v-if="index < 10"><img :src="handleGetSrc(index)" alt=""></label>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
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
    handleGetSrc(index) {
      if (index < 2) {
        return 'https://apps.defis.network/static/rank/rank1.png'
      } else if (index < 5) {
        return 'https://apps.defis.network/static/rank/rank2.png'
      } else if (index < 10) {
        return 'https://apps.defis.network/static/rank/rank3.png'
      } else {
        return ''
      }
    },
    getClass(index) {
      if (index < 2) {
        return 'gold'
      } else if (index < 5) {
        return 'silver'
      } else if (index < 10) {
        return 'bronze'
      } else {
        return ''
      }
    }
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
  padding: 20px 30px;
  margin-top: 15px;
  border-radius: 20px;
  .coinImg{
    img{
      width: 50px;
      margin-right: 10px;
    }
    .add{
      margin: 20px;
    }
  }
  .num{
    text-align: left;
    .icon{
      font-size: 27px;
      margin-right: 8px;
    }
  }
  .select{
    width: 40px;
    height: 40px;
    border: 1px solid #e3e3e3;
    color: #FFF;
    border-radius: 50%;
    box-sizing: border-box;
    .el-icon-check{
      font-size: 30px;
    }
    &.active{
      background: #07d79b;
      border: 0px solid transparent;
    }
  }
}
.rankImg{
  position: absolute;
  top: 0px;
  left: 0px;
  width: 72px;
  transform: translate(-47%, -47%) rotate(-45deg);
  img{
    width: 100%;
  }
}
</style>
