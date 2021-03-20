<template>
  <div class="voteDetail">
    <div class="title">
      <span class="act">{{ $t('bpInfo.bpInfo') }}</span>
    </div>
    <div class="mylist">
      <div class="flexa">
        <span class="rank flexc">{{ node.rank }}</span>
        <img class="logo" :src="node.owner !== 'bp.dfs' ? node.logo : voteDefaultImg" :onerror="errorCoinImg">
        <span class="nodeName">{{ owner }}</span>
      </div>
      <div class="tip data flexb">
        <div class="flexa">
          <van-icon class="coin rotate" name="coupon-o" />
          <span>{{ parseInt(node.num_votes || 0) }} EOS</span>
        </div>
        <div class="flexa">
          <img class="coin" src="https://cdn.jsdelivr.net/gh/defis-net/material/svg/earth.svg">
          <a class="tip websize" :href="node.url" target="_blank" rel="noopener noreferrer">
            {{ handleDealUrl(node.url || '') }}
          </a>
        </div>
      </div>
      <div class="allVotes">
        <span>DFS{{ $t('vote.allVoteNum') }}：{{ allVotes }}</span>
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
            <span>{{ (item.voter) }}</span>
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
import { toLocalTime, dealAccountHide } from '@/utils/public';
import { get_producers } from '@/utils/api';

export default {
  name: 'voteDetail',
  data() {
    return {
      voteDefaultImg: 'https://cdn.jsdelivr.net/gh/defis-net/material2/coin/tagtokenmain-tag.png',
      errorCoinImg: 'this.src="https://ndi.340wan.com/eos/eosio.token-eos.png"',
      owner: '',
      allVotes: '0',
      allMinersList: [],
      getMinersList: false,
      minersArr: [],
      page: 1,
      pageSize: 15,
      node: {},
    }
  },
  mounted() {
    this.handleGetList()
  },
  computed: {
    ...mapState({
      nodeLists: state => state.sys.nodeLists,
    })
  },
  watch: {
    nodeLists: {
      handler: function nl(newVal) {
        this.owner = this.$route.params.owner;
        if (!newVal || !newVal.length) {
          this.handleGetNodeLists();
          return
        }
        console.log(newVal, this.owner)
        this.node = newVal.find(v => v.owner === this.owner) || {}
        console.log(this.node)
      },
      immediate: true,
      deep: true,
    }
  },
  methods: {
    handleDealUrl(url) {
      let nUrl = url.replace(/(http|https):\/\//, '')
      nUrl = nUrl.replace(/^www\./, '')
      const arr = nUrl.split('/');
      return arr[0]
    },
    async handleGetNodeLists() {
      const {status, result} = await get_producers()
      this.getLoading = false;
      if (!status) {
        return
      }
      const rows = result.producers || []
      this.$store.dispatch('setNodeLists', JSON.parse(JSON.stringify(rows)))
    },
    handleDealAccountHide(str) {
      return dealAccountHide(str)
    },
    handleCurrentChange() {
      this.handleDealPage();
    },
    handleGetList() {
      const params = {
        "code": "dfsbpsvoters",
        "scope": this.owner,
        "table": "vlists",
        "json": true,
        limit: 10000
      }
      EosModel.getTableRows(params, (res) => {
        this.getMinersList = true;
        const rows = res.rows || [];
        let count = 0
        console.log(rows)
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
  // border: 1px solid #e0e0e0;
  box-shadow: 0 0.26667rem 0.53333rem 0 hsla(0,0%,86.3%,.5);
  border-radius: 20px;
  .allVotes{
    margin-top: 20px;
    text-align: left;
  }
  .logo{
    width: 50px;
    height: 50px;
    margin-right: 10px;
    border-radius: 50%;
  }
  .rank{
    background: #337352;
    color: #fFF;
    width: 50px;
    height: 35px;
    border-radius: 8px;
    font-size: 21px;
    margin-right: 10px;
  }
  .nodeName{
    font-weight: 500;
    color: #000;
    font-size: 30px;
  }
  .data{
    margin-top: 15px;
    text-align: left;
    &>div{
      flex: 5;
      &:last-child{
        flex: 4;
      }
    }
    .coin{
      font-size: 32px;
      max-width: 32px;
      margin-right: 10px;
    }
    .green_p{
      margin-left: 8px;
    }
    .rotate{
      transform: rotate(-45deg);
    }
    .websize{
      // width: 200px;
      max-width: 90%;
      overflow: hidden;
      text-overflow:ellipsis; //溢出用省略号显示
      white-space:nowrap; //溢出不换行
    }
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