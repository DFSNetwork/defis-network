<template>
  <div class="farmLists">
    <div class="subTip flexa">{{ $t('invite.farmer') }}</div>
    <div class="mainFarmer flexa">
      <!-- <div class="headImg"></div> -->
      <img class="headImg" :src="farmerInfo.avatar || $defaultAccImg" :onerror="$defaultAccImg">
      <div>
        <div class="name">{{ farmerInfo.nick || farmInfo.owner }}</div>
        <div class="tip small intro">
          <!-- <span>{{ $t('invite.wealth') }}：</span> -->
          <span>{{ farmerInfo.desc || '-' }}</span>
        </div>
      </div>
    </div>
    <div class="subTip flexa">{{ $t('invite.user') }}</div>
    <div class="lists">
      <van-list
        v-model="loadingMore"
        :finished="finished"
        :loading-text="$t('public.loading')"
        :finished-text="$t('public.noMore')"
        @load="handleDealPage"
      >
        <div class="farmer flexa" v-for="(v, i) in subFarmers" :key="i">
          <!-- <div class="headImg"></div> -->
          <img class="headImg" :src="v.avatar || $defaultAccImg" :onerror="$defaultAccImg">
          <div>
            <div class="name">{{ v.nick || v.owner}}</div>
            <div class="tip small">
              <span>{{ $t('invite.wealth') }}：</span>
              <span>${{ parseFloat(v.wealth) }}（{{ handleGetRate(v.wealth) }}%）</span>
            </div>
          </div>
        </div>
      </van-list>
    </div>
  </div>
</template>

<script>
import { get_acc_info } from "@/utils/api";
export default {
  name: 'farmLists',
  props: {
    farmerInfo: {
      type: Object,
      default: function fi() {
        return {}
      }
    },
    farmInfo: {
      type: Object,
      default: function fi() {
        return {}
      }
    },
  },
  data() {
    return {
      defaultImg: 'https://ndi.340wan.com/eos/eosio.token-eos.png',
      errorImg: 'this.src="https://ndi.340wan.com/eos/eosio.token-eos.png"',
      subFarmers: [], // 总列表
      lists: [], // 展示的列表
      page: 1,
      pageSize: 20,
      finished: false,
      loadingMore: false,
      next_key: '',
    }
  },
  mounted() {
    // this.handleGetSubFarms();
  },
  methods: {
    // 获取占比
    handleGetRate(wealth) {
      const w = parseFloat(wealth || 0);
      const all = parseFloat(this.farmInfo.wealth || 0);
      if (!all) {
        return 0
      }
      return (w/all * 100).toFixed(2)
    },
    // 获取农场下成员列表
    async handleGetSubFarms() {
      let arr = [];
      const dName = this.$route.params.name;
      const params = {
        json: true,
        limit: 20,
        code: "farms.tag",
        scope: ` ${dName}`,
        table: "members",
        upper_bound: this.next_key,
        index_position: 2,
        key_type: "i64",
        reverse: true
      };
      const { status, result } = await this.$api.get_table_rows(params);
      if (!status) {
        return;
      }
      this.next_key = result.next_key;
      const rows = result.rows || [];
      arr.push(...rows)
      if (this.page === 1) {
        this.subFarmers = arr;
      } else {
        this.subFarmers.push(...arr)
      }
      this.loadingMore = false;
      this.page += 1;
      if (!this.next_key) {
        this.finished = true;
      }
      this.handleGetFarmersInfo()
    },
    // 分页处理
    handleDealPage() {
      // 没有数据时 - 延时处理
      // if (!this.lists.length) {
      //   setTimeout(() => {
      //     this.handleDealPage()
      //   }, 500);
      //   return
      // }
      this.handleGetSubFarms()
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
    }
  }
}
</script>

<style lang="scss" scoped>
.farmLists{
  font-size: 28px;
  text-align: left;
  padding-bottom: 50px;
  .subTip{
    background: #F5F5F5;
    padding-left: 28px;
    height: 52px;
  }
  .farmer,
  .mainFarmer{
    padding: 28px;
    .headImg{
      height: 80px;
      width: 80px;
      border-radius: 4px;
      margin-right: 18px;
      // background: #f5f5f5;
    }
    .name{
      font-weight: 500;
    }
    .small{
      font-size: 24px;
      width: 500px;
      overflow: hidden;
      text-overflow: ellipsis; //溢出用省略号显示
      white-space: nowrap; //溢出不换行
    }
    .intro{
      width: 100%;
      word-break: break-all;
      white-space: pre-wrap;
    }
  }
}
</style>
