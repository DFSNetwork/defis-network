<template>
  <div class="voteDetail">
    <div class="title">
      <span class="act">{{ `${thisMarket.symbol0}-${thisMarket.symbol1} ${$t('vote.vote')}` }}</span>
    </div>
    <div class="mylist" @click="handleJoin(thisMarket)">
      <div class="symbol flexb">
        <div class="coinInfo flex">
          <div class="coinImg"><img width="100%" :src="thisMarket.sym0Data.imgUrl" :onerror="errorCoinImg"></div>
          <div>
            <div class="coin">{{ thisMarket.symbol0 }}</div>
            <div class="contract tip">{{ thisMarket.contract0 }}</div>
          </div>
        </div>
        <div class="add">+</div>
        <div class="coinInfo flex">
          <div class="coinImg"><img width="100%" :src="thisMarket.sym1Data.imgUrl" :onerror="errorCoinImg"></div>
          <div>
            <div class="coin">{{ thisMarket.symbol1 }}</div>
            <div class="contract tip">{{ thisMarket.contract1 }}</div>
          </div>
        </div>
      </div>
      <div class="allVotes">
        <span>{{ $t('vote.allVoteNum') }}：{{ allVotes }}</span>
      </div>
    </div>

    <!-- 列表 -->
    <div class="minerLists">
      <div class="title flexb">
        <span class="act">{{ $t('vote.voter') }}</span>
        <span class="totalMiners">{{ $t('vote.voterNum') }}：{{ allMinersList.length }}</span>
      </div>

      <div class="noData" v-loading="!getMinersList" v-if="!minersArr.length">{{ $t('public.noData') }}</div>
      <template v-for="(item, index) in minersArr">
        <div class="list" :class="{'page1': page === 1}" :key="index">
          <div class="flexb mb10">
            <span>{{ item.voter }}</span>
            <span>{{ item.voteDate }}</span>
          </div>
          <div class="flexb">
            <span>{{ $t('vote.vote') }}</span>
            <span>{{ item.voteNum }}</span>
          </div>
          <label class="rankImg" v-if="page === 1 && index < 3"><img :src="`https://cdn.jsdelivr.net/gh/defis-net/material/rank/rank${index + 1}.png`" alt=""></label>
        </div>
      </template>

      <el-pagination
        v-if="allMinersList.length"
        class="pagination"
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :current-page.sync="page"
        :page-size="pageSize"
        :total="allMinersList.length">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { EosModel } from '@/utils/eos';
import { toLocalTime } from '@/utils/public';
export default {
  name: 'voteDetail',
  data() {
    return {
      errorCoinImg: 'this.src="https://ndi.340wan.com/eos/eosio.token-eos.png"',
      mid: '',
      thisMarket: {
        symbol0: 'EOS',
        symbol1: 'DFS',
        contract0: 'eosio.token',
        contract1: 'minedfstoken',
        sym0Data: {
          imgUrl: "https://apps.defis.network/static/coin/eosio.token-eos.svg"
        },
        sym1Data: {
          imgUrl: "https://ndi.340wan.com/eos/minedfstoken-dfs.png"
        },
      }, // 当前矿池数据
      allVotes: '0',
      allMinersList: [],
      getMinersList: false,
      minersArr: [],
      page: 1,
      pageSize: 15,
    }
  },
  computed: {
    ...mapState({
      marketLists: state => state.sys.marketLists,
    }),
  },
  watch: {
    marketLists: {
      handler: function ml(newVal) {
        if (!newVal.length) {
          return
        }
        this.thisMarket = newVal.find(v => v.mid == this.$route.params.mid)
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.mid = this.$route.params.mid;
  },
  mounted() {
    this.handleGetList()
  },
  methods: {
    handleCurrentChange() {
      this.handleDealPage();
    },
    handleJoin(item) {
      this.$router.push({
        name: 'market',
        params: {
          mid: item.mid
        }
      })
    },
    handleGetList() {
      const params = {
        "code": "vote.tag",
        "scope": this.mid,
        "table": "vlists",
        "json": true,
        limit: 10000
      }
      EosModel.getTableRows(params, (res) => {
        this.getMinersList = false;
        const rows = res.rows || [];
        let count = 0
        rows.forEach(v => {
          const num = parseInt(v.vote_power / 10000)
          count = num + Number(count);
          const voteDate = toLocalTime(`${v.vote_time}.000+0000`)
          this.$set(v, 'voteNum', num)
          this.$set(v, 'voteDate', voteDate)
        });
        let newArr = rows.sort((a, b) => {
          return b.voteNum - a.voteNum;
        })
        this.allVotes = count;
        this.allMinersList = newArr;
        this.handleDealPage()
      })
    },
    handleDealPage() {
      const start = (this.page - 1) * this.pageSize;
      const end = this.page * this.pageSize;
      this.minersArr = this.allMinersList.slice(start, end);
    }
  }
}
</script>

<style lang="scss" scoped>
.voteDetail{
  padding: 0 40px 40px;
  font-size: 30px;
}
.title{
  font-size: 32px;
  text-align: left;
  margin: 0 0 40px;
  &>span{
    margin-right: 60px;;
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
}
.mylist{
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  .allVotes{
    margin-top: 20px;
    text-align: left;
  }
}
.symbol{
  border-radius: 20px;
  .coinInfo{
    text-align: left;
    .coinImg{
      width: 60px;
      height: 60px;
      margin-right: 10px;
      border-radius: 60px;
      overflow: hidden;
    }
    .coin{
      font-size: 28px;
      font-weight: 500;;
      line-height: 30px;
    }
    .contract{
      line-height: 30px;
    }
    .ableGet{
      color: #2F3F52;
    }
  }
  .add{
    width: 40px;
  }
}
.minerLists{
  margin-top: 30px;
  .totalMiners{
    margin-right: 0px;
    font-size: 27px;
  }
  .list{
    margin-top: 25px;
    border: 1px solid #e0e0e0;
    border-radius: 20px;
    // padding: 20px;
    position: relative;
    &.page1{
      &:nth-child(2) {
        border: 1px solid rgb(238, 198, 4);
        box-shadow: 0 0 5px 0px rgba(238, 198, 4, .5);
      }
      &:nth-child(3) {
        border: 1px solid #b1dcff;
        box-shadow: 0 0 5px 0px rgba(#b1dcff, .5);
      }
      &:nth-child(4) {
        border: 1px solid #8C7853;
        box-shadow: 0 0 5px 0px rgba(#8C7853, .5);
      }
      .rankImg{
        position: absolute;
        top: -0px;
        left: -0px;
        width: 72px;
        transform: translate(-47%, -47%) rotate(-45deg);
        img{
          width: 100%;
        }
      }
    }
    &>div{
      padding: 20px;
      position: relative;
      z-index: 1;
      background: #FFF;
      border-radius: 30px;

      &:nth-child(1) {
        padding-bottom: 0;;
      }
      &:nth-child(2) {
        padding-top: 0;;
      }
    }
    .mb10{
      margin-bottom: 10px;
    }
  }
  .noData{
    text-align: center;
    margin: 100px 0;
    color: #A6A6A6;
    font-size: 24px;
  }
}
.pagination{
  text-align: right;
  margin-top: 20px;
  font-size: 26px;
  /deep/ .el-pager{
    li.active{
      color: #07D79B;
    }
    li:hover{
      color: #07D79B;
    }
    li{
      font-size: 26px;
    }
  }
  /deep/ .btn-prev, /deep/ .btn-next{
    &:hover {
      color: #07D79B;
    }
    .el-icon-arrow-left, .el-icon-arrow-right{
      font-size: 26px;
    }
  }
}
</style>