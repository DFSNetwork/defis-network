<template>
  <div class="farms">
    <div class="title">{{ $t('invite.dfsFarms') }}</div>
    <div class="lists">
      <van-list
        v-model="loadingMore"
        :finished="finished"
        :loading-text="$t('public.loading')"
        :finished-text="$t('public.noMore')"
        @load="handleDealPage"
      >
        <div class="li" v-for="(v, i) in showLists" :key="i" @click="handleTo('farmDetail', {name: v.owner || 'test'})">
          <div class="flexa">
            <div class="flexc bgImgDiv">
              <img class="bgImg" width="100%" :src="v.avatar">
            </div>
            <div class="right">
              <div class="farmName flexb">
                <div>{{ v.farm_name }}</div>
                <div>
                  <img v-if="v.wx" class="linkImg" src="https://cdn.jsdelivr.net/gh/defis-net/material2/icon/wechat.png">
                  <img v-if="v.tg" class="linkImg" src="https://cdn.jsdelivr.net/gh/defis-net/material2/icon/telegram.png">
                  <img v-if="v.qq" class="linkImg" src="https://cdn.jsdelivr.net/gh/defis-net/material2/icon/QQ.png">
                </div>
              </div>
              <div class="tip num din">{{ v.slogon }}</div>
              <div class="tip num din">
                <span>{{ v.farmers }}{{ $t('invite.people') }}</span>
                <span class="wealth">{{ $t('invite.wealth') }}: ${{ parseInt(v.wealth) }}</span>
              </div>
            </div>
          </div>
        </div>
      </van-list>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { DApp } from '@/utils/wallet';
export default {
  name: 'farms',
  props: {
    lists: {
      type: Array,
      default: function ls() {
        return []
      }
    },
    joinInfo: {
      type: Object,
      default: function ls() {
        return {}
      }
    },
  },
  data() {
    return {
      nJoinInfo: {},
      loadingMore: false,
      finished: false,
      page: 1,
      pageSize: 20,
      showLists: [],
    }
  },
  watch: {
    joinInfo: {
      handler: function ji() {
        this.nJoinInfo = this.joinInfo;
      },
      deep: true,
      immediate: true,
    }
  },
  computed: {
    ...mapState({
      account: (state) => state.app.account,
    }),
  },
  methods: {
    // 处理分页
    handleDealPage() {
      // 没有数据时 - 延时处理
      if (!this.lists.length) {
        setTimeout(() => {
          this.handleDealPage()
        }, 500);
        return
      }
      // 正常时
      setTimeout(() => {
        const end = this.page * this.pageSize;
        const start = end - this.pageSize;
        const tArr = this.lists.slice(start, end);
        if (this.page === 1) {
          this.showLists = tArr;
        } else {
          this.showLists.push(...tArr)
        }
        this.loadingMore = false;
        this.page += 1;
        if (this.showLists.length >= this.lists.length) {
          this.finished = true;
        }
      }, 200);
    },
    handleTo(name, params) {
      this.$router.push({
        name, params
      })
    },
    handleAddFarm(v) {
      if (this.nJoinInfo.owner) {
        this.$toast.fail(this.$t('invite.errTip1'))
        return
      }
      const name = this.account.name;
      const permission = this.account.permissions;
      const params = {
        actions: [{
          account: 'farms.tag',
          name: 'join',
          authorization: [{
            actor: name, // 转账者
            permission,
          }],
          data: {
            farmer: name,
            farm: v.owner,
          }
        }]
      }
      DApp.toTransaction(params, (err) => {
        if (err && err.code === 402) {
          return;
        }
        if (err) {
          this.$toast({
            type: 'fail',
            message: err.message,
          })
          return;
        }
        this.$toast({
          type: 'success',
          message: 'Success'
        })
        this.nJoinInfo = v
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.farms{
  color: #333;
  margin: 28px;
  text-align: left;
  font-size: 26px;
  .title{
    text-align: left;
    font-weight: 400;
    font-size: 36px;
    margin-bottom: 10px;
  }
  .lists{
    .li{
      border-bottom: 1px solid $color-border;
      padding: 20px 0;
      &:last-child{
        border-bottom: 0px solid $color-border;
      }
      .bgImgDiv{
        width: 100px;
        height: 100px;
        margin-right: 20px;
        border-radius: 4px;
      }
      .right{
        flex: 1;
      }
      .farmName{
        font-size: 30px;
        width: 100%;
        img{
          margin-left: 20px;
          width: 32px;
        }
      }
      .wealth{
        margin-left: 30px;
      }
      .num{
        margin-top: 4px;
      }
      .btn{
        background: $color-main;
        color: #FFF;
        width: 160px;
        height: 60px;
        border-radius: 4px;
        &.joined{
          color: $color-main;
          background: #FFF;
          border: 1px solid $color-main;
        }
      }
    }
  }
}
</style>
