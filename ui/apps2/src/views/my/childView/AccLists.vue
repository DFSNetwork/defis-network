<template>
  <div class="accLists">
    <div class="title flexb">
      <span class="back flexa" @click="$router.back()">
        <img src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/back.png" alt="">
      </span>
      <span v-if="type === 'follow' || type === 'otherFollow'">{{ $t('my.follows') }}</span>
      <span v-else-if="type === 'fans' || type === 'otherFans'">{{ $t('my.fans') }}</span>
      <span v-else>{{ $t('my.visitors') }}</span>
      <span class="back"></span>
    </div>
    <div class="searchDiv flexa">
      <img src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/search.png">
      <van-field class="searchIpt" v-model="search" @input="handleSearch" :placeholder="$t('my.searchId')" />
    </div>

    <div class="lists">
      <!-- <van-list
          v-model="loadingMore"
          :finished="finished"
          :loading-text="$t('public.loading')"
          :finished-text="$t('public.noMore')"
          @load="handleCurrentChange"
        > -->
        <div class="noData tip" v-if="!lists.length">
          <img src="https://cdn.jsdelivr.net/gh/defis-net/material/noData/noData.png" alt="">
          <div v-if="type === 'follow' || type === 'otherFollow'">{{ $t('my.noFollow') }}</div>
          <div v-else-if="type === 'fans' || type === 'otherFans'">{{ $t('my.noFans') }}</div>
          <div v-else>{{ $t('my.noVist') }}</div>
        </div>
        <div class="list flexb" v-for="(item, index) in lists" :key="index">
          <img class="headImg" :src="item.avatar" @click="handleTo(item)">
          <div class="mainData" @click="handleTo(item)">
            <div class="name">{{ item.nick || item.owner }}</div>
            <div class="desc tip">{{ item.desc || $t('my.noDesc') }}</div>
          </div>
          <div class="type">
            <div class="atted flexc"
              v-if="type === 'follow' || type === 'otherFollow'"
              @click="handleShowCancel(item)">{{ $t('my.followed') }}</div>
            <div v-else-if="type === 'fans' || type === 'otherFans'">
              <span class="atted flexc" v-if="item.isFollow" @click="handleShowCancel(item)">{{ $t('my.followed2') }}</span>
              <span class="fans flexc" @click="handleFollow(item)" v-else>{{ $t('my.followed3') }}</span>
            </div>
            <div class="fans flexc" v-else>{{ $t('my.toVist') }}</div>
          </div>
        </div>
      <!-- </van-list> -->
    </div>
    <el-dialog
      class="mydialog"
      :show-close="false"
      :visible.sync="showCancel">
      <CancelFollow v-if="showCancel" :checkItem="checkItem"
        @listenClose="handleClose"/>
      <!-- <Remove /> -->
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { EosModel } from '@/utils/eos';
import { get_acc_lists, get_acc_info } from '@/utils/api';
import CancelFollow from '../dialog/CancelFollow';

export default {
  name: 'accLists',
  components: {
    CancelFollow
  },
  data() {
    return {
      user: '',
      search: '',
      lists: [],
      followLoading: false,
      fansLoading: false,
      followLists: [], // 关注列表

      fansLists: [],
      allFollow: [], // 所有关注列表

      finished: false,
      loadingMore: false,
      nextKey: '',

      showCancel: false,
      checkItem: {},
    }
  },
  mounted() {
    if (this.$route.name !== 'follow' || this.$route.name !== 'fans' || this.$route.name !== 'visitors') {
      this.user = this.$route.params.id;
      this.handleDeal()
    }
  },
  computed: {
    ...mapState({
      scatter: state => state.app.scatter,
      accInfo: state => state.app.accInfo,
    }),
    type() {
      const rn = this.$route.name;
      return rn
    },
  },
  watch: {
    scatter: {
      handler: function sc (newVal) {
        if (!(this.$route.name === 'follow' || this.$route.name === 'fans' || this.$route.name === 'visitors')) {
          return
        }
        if (newVal.identity) {
          this.user = newVal.identity.accounts[0].name;
          if (this.followLists.length) {
            return
          }
          this.handleDeal()
        }
      },
      deep: true,
      immediate: true
    },
    allFollow: {
      handler: function af (newVal) {
        if (!newVal.length || !this.fansLists.length) {
          return
        }
        this.handleDealFollowArr()
      },
      deep: true,
      immediate: true
    },
    fansLists: {
      handler: function af (newVal) {
        if (!newVal.length || !this.allFollow.length) {
          return
        }
        this.handleDealFollowArr()
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    handleDealFollowArr() {
      this.fansLists.forEach(v => {
        const has = this.allFollow.find(vv => vv.owner === v.owner)
        if (has) {
          this.$set(v, 'isFollow', true)
        }
      })
    },
    handleTo(item) {
      this.$router.push({
        name: 'otherInfo',
        params: {
          id: item.owner
        }
      })
    },
    handleClose(type) {
      this.showCancel = false;
      if (type) {
        console.log('sure')
      }
    },
    handleShowCancel(item) {
      this.showCancel = true;
      this.checkItem = item
    },
    handleFollow(item) {
      const formName = this.scatter.identity.accounts[0].name;
      const permission = this.scatter.identity.accounts[0].authority;
      
      const params = {
        actions: [{
          account: 'dfscommunity',
          name: 'follow',
          authorization: [{
            actor: formName,
            permission,
          }],
          data: {
            user: formName,
            who: item.owner
          },
        }]
      }
      EosModel.toTransaction(params, (res) => {
        if(res.code && JSON.stringify(res.code) !== '{}') {
          this.$message({
            message: res.message,
            type: 'error'
          });
          return
        }
        this.$message({
          message: '关注成功',
          type: 'success'
        });
      })
    },
    handleSearch() {
      let searchLists = [];
      if (this.type === 'follow' || this.type === 'otherFollow') {
        searchLists = this.followLists;
      } else if (this.type === 'fans' || this.type === 'otherFans') {
        searchLists = this.fansLists;
      }
      const search = this.search;
      if (!search) {
        this.lists = searchLists;
        return
      }
      const arrs = searchLists.filter(v => v.owner.indexOf(search) !== -1)
      this.lists = arrs;
    },
    handleSetType(table, type) {
      if (table === 'followers') {
        this.followLoading = type;
      }
      if (table === 'fans') {
        this.fansLoading = type;
      }
    },
    handleGetDefaultInfo(obj) {
      const df = {
        avatar: "https://cdn.jsdelivr.net/gh/defis-net/material2/coin/tagtokenmain-tag.png",
        cover: "https://cdn.jsdelivr.net/gh/defis-net/material/accBanner/banner0.png",
        desc: "",
        nick: "",
        sex: 2,
      }
      return Object.assign({}, df, obj)
    },
    handleDeal() {
      this.lists = [];
      this.followLists = [];
      this.fansLists = [];
      if (this.type === 'follow' || this.type === 'otherFollow') {
        !this.followLoading ? this.handleGetLists(this.user, 'followers') : '';
      } else if (this.type === 'fans' || this.type === 'otherFans') {
        this.handleGetAccFollow()
        !this.fansLoading ? this.handleGetLists(this.user, 'fans') : '';
      } else {
        console.log('访客暂未开放')
      }
    },
    async handleGetLists(user, table) {
      this.handleSetType(table, true)
      const {status, result} = await get_acc_lists(user, table);
      // console.log(user, result)
      if (!status) {
        this.handleSetType(table, false)
        return
      }
      this.handleDealFollow(result, table)
    },
    handleDealFollow(result, table) {
      // 是否还有数据
      if (!result.more) {
        this.finished = true;
      }
      this.nextKey = result.next_key;

      const followLists = result.rows || [];
      if (!followLists.length) {
        this.handleSetType(table, false)
        return
      }
      followLists.forEach(async (v) => {
        const has = this.followLists.find(vv => vv.owner === v.owner)
        if (has) {
          return
        }
        const {status, result} = await get_acc_info(v.owner);
        this.handleSetType(table, false)
        if (!status) {
          return
        }
        const t = this.handleGetDefaultInfo(v)
        if (table === 'followers') {
          this.followLists.push(Object.assign({}, t, result))
          this.lists = this.followLists;
          return
        }
        if (table === 'fans') {
          this.fansLists.push(Object.assign({}, t, result))
          this.lists = this.fansLists;
        }
      });
    },
    // 用于粉丝
    async handleGetAccFollow(next_key) {
      if (this.allFollowLoading) {
        return
      }
      this.allFollowLoading = true;
      if (!next_key) {
        this.allFollow = [];
      }
      const formName = this.scatter.identity.accounts[0].name;
      const {status, result} = await get_acc_lists(formName, 'followers', next_key);
      this.allFollowLoading = false;
      if (!status) {
        return
      }
      this.allFollow.push(...result.rows)
      if (result.next_key) {
        this.handleGetAccFollow(result.next_key)
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.accLists{
  font-size: 28px;
  color: #333;
  .title{
    font-size: 36px;
    height: 80px;
    padding: 0 28px;
    font-weight: 500;
    .back{
      width: 50px;
      height: 50px;
      img{
        display: block;
        width: 18px;
      }
    }
  }
  .searchDiv{
    margin: 10px 28px;
    border-radius: 30px;
    height: 66px;
    padding: 0 26px;
    background: #F5F6F6;
    img{
      width: 26px;
      margin-right: 16px;
    }
    /deep/ .van-cell{
      background: #F5F6F6;
      height: 100%;
      padding: 0;
      .van-field__value{
        display: flex;
        align-items: center;
        .van-field__body{
          flex: 1;
        }
      }
      .van-field__control{
        width: 100%;
      }
    }
    // .searchIpt{
    // }
  }
  .noData{
    padding-top: 15vh;
    img{
      width: 400px;
    }
  }
  .list{
    height: 158px;
    padding: 0 26px;
    border-bottom: 1px solid rgba(220, 220, 220, .3);
    &:last-child{
      border-bottom: 0px solid rgba(220, 220, 220, .3);
    }
    .headImg{
      height: 100px;
      width: 100px;
      border-radius: 50%;
      margin-right: 22px;
    }
    .mainData{
      flex: 1;
      text-align: left;
      .name{
        font-size: 32px;
        font-weight: 500;
      }
      .desc{
        font-size: 26px;
        margin-top: 4px;
        max-width: 390px;
        overflow:hidden; //超出的文本隐藏
        text-overflow:ellipsis; //溢出用省略号显示
        white-space:nowrap; //溢出不换行
      }
    }
    .atted{
      color: #999;
      border: 1px solid #CBCBCB;
      width: 140px;
      height: 56px;
      border-radius: 30px;
    }
    .fans{
      width: 140px;
      height: 56px;
      border-radius: 30px;
      color: #FFF;
      background: #29D4B0;
    }
  }
}
</style>
