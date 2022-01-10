<template>
  <div class="lists" v-loading="getLoading">
    <van-list
        v-model="loadingMore"
        :finished="finished"
        :loading-text="$t('public.loading')"
        :finished-text="$t('public.noMore')"
        @load="handleCurrentChange()"
      >
      <!-- <div class="noData tip" v-if="!lists.length">{{ $t('public.noData') }}</div> -->
      <div class="list flexa" v-for="(item, index) in lists" :key="index"
        @click="handleCheckedNode(item)">
        <div class="rankDiv dinBold flexc" v-if="act !== 3 && act !== 4">
          <img v-if="index < 3" :src="`https://cdn.jsdelivr.net/gh/defis-net/material/rank/voteRank${index+1}.png`" alt="">
          <span v-else>{{index + 1}}</span>
        </div>
        <div class="main">
          <div class="flexa">
            <!-- <span class="rank flexc">{{ item.rank }}</span> -->
            <img class="logo" :src="item.owner !== 'bp.dfs' ? item.logo : voteDefaultImg" :onerror="errorCoinImg">
            <span class="nodeName">{{ item.owner }}</span>
          </div>
          <div v-if="item.tags && act === 4" class="tags">
            <span v-for="(v, i) in item.tags" :key="`tags_${i}`">{{ v }}</span>
          </div>
          <div class="tip data flexb" v-if="act !== 4">
            <div class="flexa dinReg">
              <span class="voteIcon flexc">
                <img class="small" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/money.png" alt="">
              </span>
              <span>{{ parseInt(item.voteNum) | numeralFormat }} EOS</span>
            </div>
            <div class="flexa dinReg">
              <span class="tip">BP Rank:</span>
              <span>{{ item.bprank }}</span>
            </div>
          </div>
          <div class="tip data flexb" v-if="act !== 4">
            <div class="flexa">
              <img class="voteIcon" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/vote.png" alt="">
              <span class="dinReg">{{ item.dfsVote || '0' }} DFS</span>
              <span class="green" @click.stop="handleToDetail(item)">{{ $t('public.detail') }}></span>
            </div>
            <div class="flexa dinReg">
              <img class="voteIcon" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/earth.png" alt="">
              <a class="tip websize" :href="item.url" target="_blank" rel="noopener noreferrer">
                {{ handleDealUrl(item.url) }}
              </a>
            </div>
          </div>
        </div>
        <div class="checkBoxDiv flexc">
          <div class="checkBox flexc" :class="{'isChecked': item.isChecked}">
            <img v-if="item.isChecked" class="checkedImg" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/checked.png" alt="">
          </div>
        </div>
      </div>
    </van-list>
  </div>
</template>

<script>
export default {
  name: 'nodeLists',
  props: {
    act: {
      type: Number,
      default: 1
    },
    nodeLists: {
      type: Array,
      default: function nl () {
        return []
      }
    },
    tagLists: {
      type: Array,
      default: function nl () {
        return []
      }
    },
    getLoading: {
      type: Boolean,
      default: true
    },
    myVote: {
      type: Array,
      default: function nl () {
        return []
      }
    },
    search: {
      type: String,
      default: ''
    },
    AccMaxNum: {
      type: Number,
      default: 20
    }
  },
  data() {
    return {
      voteDefaultImg: 'https://cdn.jsdelivr.net/gh/defis-net/material2/coin/tagtokenmain-tag.png',
      errorCoinImg: 'this.src="https://ndi.340wan.com/eos/eosio.token-eos.png"',
      isChecked: false,
      lists: [],
      rankLists: [],
      myVoteList: [],
      searchArr: [],

      // 加载更多
      loadingMore: false,
      finished: false,
      page: 1,
      pageSize: 30,
    }
  },
  watch: {
    nodeLists: {
      handler: function nls(newVal, oldVal) {
        if (!newVal.length || (oldVal && oldVal.length === newVal.length)) {
          return
        }
        this.handleDealLists()
      }
    },
    act: {
      handler: function act() {
        this.page = 1;
        this.lists = []
        this.finished = false;
        document.documentElement.scrollTop = 9999;
        this.handleDealLists()
      },
      immediate: true,
      deep: true
    },
    myVote: {
      handler: function nls(newVal) {
        if (!newVal.length) {
          return
        }
        this.handleGetMyLists()
      }
    },
    search() {
      this.page = 1;
      this.lists = []
      this.loadingMore = true;
      this.finished = false;
      this.handleSearch()
    }
  },
  methods: {
    handleToDetail(item) {
      this.$router.push({
        name: 'nodeDetail',
        params: {
          owner: item.owner
        }
      })
    },
    handleCurrentChange() {
      if (!this.nodeLists.length) {
        return
      }
      setTimeout(() => {
        let tArr = this.nodeLists;
        if (this.search) {
          tArr = this.searchArr;
        } else if (this.act === 2) {
          tArr = this.rankLists;
        } else if (this.act === 3) {
          tArr = this.myVoteList;
        } else if (this.act === 4) {
          tArr = this.handleDealTags()
        }
        const start = (this.page - 1) * this.pageSize;
        const end = this.page * this.pageSize;
        const pageLists = tArr.slice(start, end);
        this.lists.push(...pageLists)
        this.loadingMore = false;
        this.page += 1;
        if (this.lists.length >= tArr.length) {
          this.finished = true;
        }
      }, 200);
    },
    handleSearch() {
      const search = this.search.toLowerCase();
      if (!search) {
        this.handleDealLists()
        return
      }
      let tArr = this.nodeLists;
      if (this.act === 2) {
        tArr = this.rankLists;
      } else if (this.act === 3) {
        tArr = this.myVoteList;
      } else if (this.act === 4) {
        tArr = this.handleDealTags()
      }
      const arr = tArr.filter(v => {
        const index = v.owner.indexOf(search);
        return index !== -1
      })
      this.searchArr = arr;
      // this.lists = arr;
      this.handleCurrentChange()
    },
    handleDealTags() {
      const arr = [];
      this.tagLists.forEach(v => {
        const item = this.nodeLists.find(vv => vv.owner === v.name);
        if (!item) {
          return
        }
        arr.push(item)
      });
      return arr
    },
    handleGetMyLists() {
      if (!this.nodeLists.length || !this.myVote.length) {
        return
      }
      const list = []
      this.myVote.forEach(v => {
        const node = this.nodeLists.find(vv => vv.owner === v);
        list.push(node);
      })
      list.sort((a, b) => {
        return b.dfsVote - a.dfsVote
      })
      this.myVoteList = list
      // this.myVoteList.find(v => {
      //   if (v.isChecked) {
      //     return
      //   }
      //   const item = this.nodeLists.find(vv => v.owner === vv.owner)
      //   this.$set(item, 'isChecked', true)
      // })
    },
    handleDealLists() {
      const lists = this.nodeLists;
      let rank = lists.filter(v => v.dfsRank <= 21)
      rank.sort((a, b) => {
        return b.dfsVote - a.dfsVote
      })
      rank = rank.slice(0, 30)
      this.rankLists = rank;
      // act === 3
      this.handleGetMyLists();

      // lists 赋值
      this.handleCurrentChange();
    },
    handleDealUrl(url) {
      let nUrl = url.replace(/(http|https):\/\//, '')
      nUrl = nUrl.replace(/^www\./, '')
      const arr = nUrl.split('/');
      return arr[0]
    },
    handleCheckedNode(item) {
      const checkedArr = this.nodeLists.filter(v => v.isChecked)
      const index = this.nodeLists.findIndex(v => v.owner === item.owner);
      const isChecked = this.nodeLists[index].isChecked || false;
      if (checkedArr.length >= this.AccMaxNum && !isChecked) {
        return
      }
      this.$set(this.nodeLists[index], 'isChecked', !isChecked)
    },
  }
}
</script>

<style lang="scss" scoped>
.lists{
  padding: 0 30px;
  .noData{
    font-size: 28px;
    text-align: center;
    padding: 50px 0;
  }
  .list{
    padding: 28px 0;
    border-top: 1px solid rgba(220,220,220,.3);
    &:last-child{
      border-bottom: 0px solid #EEE;
    }
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
    .main{
      flex: 1;
      .logo{
        width: 44px;
        height: 44px;
        margin-right: 10px;
        border-radius: 50%;
      }
      .tags{
        display: flex;
        flex-wrap: wrap;
        margin: 10px 0;
        &>span{
          margin: 5px 0;
          border-radius: 4px;
          color: #29D4B0;
          background: rgba(41, 212, 176, 0.12);
          font-size: 22px;
          padding: 4px 8px;
          margin-right: 8px;
          overflow : hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          max-width: 350px;
        }
      }
    }
    .checkBoxDiv{
      width: 50px;
      height: 50px;
      margin-left: 20px;
      .checkBox{
        box-sizing: border-box;
        height: 45px;
        width: 45px;
        border: 1px solid #eee;
        border-radius: 50%;;
        color: #07d79b;
        &.isChecked{
          border: 0px solid #eee;
        }
      }
      .checkedImg{
        width: 50px;
      }
    }
    .rank{
      background: rgba(#29D4B0, .2);
      color: #29D4B0;
      width: 50px;
      height: 35px;
      border-radius: 8px;
      font-size: 21px;
      margin-right: 10px;
    }
    .nodeName{
      font-weight: 500;
      color: #000;
      font-size: 28px;
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
      .voteIcon{
        width: 28px;
        margin-right: 8px;
        .small{
          width: 22px;
        }
      }
      .coin{
        font-size: 32px;
        max-width: 32px;
        margin-right: 10px;
      }
      .green{
        margin-left: 8px;
        color: #29D4B0;
        font-size: 22px;
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
}
</style>