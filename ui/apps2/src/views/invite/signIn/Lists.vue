<template>
  <div class="signLists">
    <div class="title">{{ $t('invite.signUsers') }}</div>
    <div class="lists">
      <van-list
        v-model="loadingMore"
        :finished="finished"
        :loading-text="$t('public.loading')"
        :finished-text="$t('public.noMore')"
        @load="handleDealPage"
      >
        <div class="list flexa" v-for="(v, i) in subFarmers" :key="i">
          <img class="headImg" :src="v.avatar || $defaultAccImg" :onerror="$defaultAccImg">
          <div class="accInfo">
            <div class="name">{{ v.nick || v.owner }}</div>
            <div class="tip din" v-if="v.isSigned && !v.joinNow">
              <span v-if="rewardInfo.reward">{{ $t('invite.rewardGet', {num: rewardInfo.reward}) }}</span>
              <span v-else>{{ $t('invite.signed') }}</span>
            </div>
          </div>
          <img class="stealSign" v-if="!v.isSigned"
            @click="handleSign(v, i)"
            src="https://cdn.jsdelivr.net/gh/defis-net/material2/farm/stealSign.png">
        </div>
      </van-list>
    </div>

    <van-popup class="popup_p success" v-model="showSuccess">
      <SignSuccess @listenClose="handleClose"/>
    </van-popup>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { DApp } from '@/utils/wallet';
import { get_acc_info } from "@/utils/api";
import SignSuccess from '../dialog/SignSuccess';

export default {
  name: 'signLists',
  components: {
    SignSuccess,
  },
  props: {
    rewardInfo: {
      type: Object,
      default: function ri() {
        return {}
      }
    },
    allLists: {
      type: Array,
      default: function ri() {
        return []
      }
    }
  },
  data() {
    return {
      dName: '',
      next_key: '',
      page: 1,
      pageSize: 20,
      subFarmers: [],
      loadingMore: false,
      finished: false,
      showSuccess: false,
    }
  },
  mounted() {
    this.dName = this.$route.params.name;
  },
  computed: {
    ...mapState({
      account: (state) => state.app.account,
    }),
  },
  methods: {
    handleClose() {
      this.showSuccess = false;
    },
    handleSign(v, i) {
      const name = this.account.name;
      if (v.isSigned || !name) {
        return
      }
      const permission = this.account.permissions;
      const params = {
        actions: [{
          account: 'farms.tag',
          name: 'checkin',
          authorization: [{
            actor: name, // 转账者
            permission,
          }],
          data: {
            farmer: v.owner,
            helper: name,
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
        this.$set(this.subFarmers[i], 'isSigned', true);
        this.showSuccess = true;
      })
    },
    handleGetFarmersInfo() {
      this.subFarmers.forEach(async v => {
        if (v.getInfo) {
          return
        }
        this.$set(v, 'getInfo', true);
        const { status, result } = await get_acc_info(v.owner);
        if (!status) {
          return
        }
        this.$set(v, 'avatar', result.avatar);
        this.$set(v, 'desc', result.desc);
        this.$set(v, 'nick', result.nick);
      })
    },
    // 分页处理
    handleDealPage() {
      this.handleGetSubFarms()
    },
    handleGetSubFarms() {
      clearTimeout(this.timer)
      if (!this.allLists.length) {
        this.timer = setTimeout(() => {
          this.handleGetSubFarms()
        }, 500);
        return
      }
      const end = this.pageSize * this.page;
      const start = end - this.pageSize;
      const arr = this.allLists.slice(start, end)
      if (this.page === 1) {
        this.subFarmers = arr;
      } else {
        this.subFarmers.push(...arr)
      }
      this.loadingMore = false;
      this.page++;
      if (arr.length < this.pageSize) {
        this.finished = true;
      }
      console.log(this.subFarmers)
      this.handleGetFarmersInfo()
    }
  }
}
</script>

<style lang="scss" scoped>
.signLists{
  text-align: left;
  padding: 30px 0;
  font-size: 24px;
  color: #333;
  margin: 30px;
  box-shadow: 0px 0px 8px 2px rgba(211,211,211,0.54);
  border-radius: 12px;
  .title{
    padding-left: 30px;
    font-size: 36px;
    font-weight: 500;
    margin-bottom: 18px;
  }
  .lists{
    padding-left: 30px;
  }
  .list{
    padding: 20px 0;
    position: relative;
    border-bottom: 1px solid $color-border;
    &:last-child{
      border-bottom: 0px solid $color-border;
    }
    .name{
      font-size: 28px;
      margin-bottom: 4px;
    }
    .headImg{
      width: 80px;
      margin-right: 15px;
      height: 80px;
    }
    .stealSign{
      width: 60px;
      position: absolute;
      top: 0px;
      right: 0px;
    }
  }
}
.success{
  width: 100%;
  max-width: 750px;
  background: rgba(0,0,0,0);
}
</style>
