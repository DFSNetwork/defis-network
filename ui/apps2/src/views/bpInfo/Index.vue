<template>
  <div class="bpInfo">
    <div class="banner">
      <img class="banImg" src="https://cdn.jsdelivr.net/gh/defis-net/material/bpInfo/banner1.png" alt="">
      <div class="typeDiv">
        <div class="flexb">
          <div class="flexa">
            <img src="https://cdn.jsdelivr.net/gh/defis-net/material/bpInfo/type2.png" alt="">
            <span>出块出得好</span>
          </div>
          <div class="flexc">
            <img src="https://cdn.jsdelivr.net/gh/defis-net/material/bpInfo/type2.png" alt="">
            <span>节点速度快</span>
          </div>
        </div>
        <div class="flexb item">
          <div class="flexa">
            <img src="https://cdn.jsdelivr.net/gh/defis-net/material/bpInfo/type3.png" alt="">
            <span>社区超给力</span>
          </div>
          <div class="flexc">
            <img src="https://cdn.jsdelivr.net/gh/defis-net/material/bpInfo/type4.png" alt="">
            <span>技术猛如虎</span>
          </div>
        </div>
      </div>
    </div>
    <van-list
        v-model="loadingMore"
        :finished="finished"
        :loading-text="$t('public.loading')"
        :finished-text="$t('public.noMore')"
        @load="handleCurrentChange"
      >
      <div class="bpList" v-for="(v, i) in bpLists" :key="i" @click="handleTo(v)">
        <div class="flexa">
          <img class="bpImg" :src="v.logo || errImg" :onerror="errImg">
          <div class="name">{{ v.owner }}</div>
        </div>
        <div class="content" v-if="language === 'zh-CN'">{{ v.baseInfo.desc0  || '暂时没有简介'}}</div>
        <div class="content" v-else>{{ v.baseInfo.desc1  || '暂时没有简介'}}</div>
      </div>
    </van-list>
  </div>
</template>

<script>
import {get_bp_info} from '@/utils/api'
import { mapState } from 'vuex';
import moment from 'moment';

export default {
  name: 'bpInfo',
  data() {
    return {
      errImg: 'this.src="https://ndi.340wan.com/eos/eosio.token-eos.png"',
      bpLists: [],
      allBpLists: [],
      loadingMore: false,
      finished: false,
      page: 1,
      pageSize: 20,
    }
  },
  mounted() {
    this.handleGetBpInfo()
  },
  computed: {
    ...mapState({
      language: state => state.app.language,
    }),
    voteWeight() {
      let sec_since_lanch = 946684800;
      let weight_1 = parseInt((moment().valueOf() / 1000 - sec_since_lanch) / (86400 * 7)) / 52;
      weight_1 = 1 / Math.pow(2, weight_1) / 10000
      return weight_1
    }
  },
  methods: {
    handleTo(v) {
      this.$router.push({
        name: 'detailInfo',
        params: {
          bpname: v.owner,
        }
      })
    },
    async handleGetBpInfo() {
      const {status, result} = await get_bp_info();
      if (!status) {
        return
      }
      const allBpLists = result.voters;
      allBpLists.forEach(v => {
        try {
          const logo = v.bpjson.org.branding.logo_256;
          this.$set(v, 'logo', logo)
        } catch (error) {
          this.$set(v, 'logo', '')
        }
        const num = Number(v.total_votes) * Number(this.voteWeight);
        this.$set(v, 'voteNum', Math.ceil(num))
        this.$set(v, 'baseInfo', {})
      });
      this.allBpLists = allBpLists;
      // console.log(allBpLists)
    },
    handleCurrentChange() {
      if (!this.allBpLists.length) {
        setTimeout(() => {
          this.handleCurrentChange()
        }, 500);
        return
      }
      setTimeout(() => {
        const start = (this.page - 1) * this.pageSize;
        const end = this.page * this.pageSize;
        const lists = this.allBpLists.slice(start, end);
        if (this.page === 1) {
          this.bpLists = lists;
        } else {
          this.bpLists.push(...lists);
        }
        this.loadingMore = false;
        this.page += 1;
        if (this.bpLists.length >= this.allBpLists.length) {
          this.finished = true;
        }
        this.handleGetContent();
      }, 500);
    },
    handleGetContent() {
      this.bpLists.forEach(async v => {
        if (v.getBase) {
          return
        }
        this.$set(v, 'getBase', true) 
        const params = {
          "code":"dfscommunity",
          "scope":"dfscommunity",
          "table":"producers",
          "lower_bound": ` ${v.owner}`,
          "upper_bound": ` ${v.owner}`,
          "json":true,
        }
        const {status, result} = await this.$api.get_table_rows(params)
        if (!status) {
          return
        }
        const rows = result.rows || []
        if (!rows.length) {
          return
        }
        const row = rows[0];
        this.$set(v, 'baseInfo', row) 
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.banner{
  color: #333;
  position: relative;
  .banImg{
    width: 100%;
  }
  .typeDiv{
    position: relative;
    padding: 28px 34px;
    border-radius: 12px;
    margin: -26px 32px 30px;
    background: #FFF;
    box-shadow: 0px 4px 8px 0px rgba(214,214,214,0.5);
    img{
      width: 60px;
      margin-right: 14px;
    }
    .item{
      margin-top: 18px;
    }
    .flexa, .flexc{
      flex: 1;
    }
  }
}
.bpInfo{
  // background-image: url('https://cdn.jsdelivr.net/gh/defis-net/material/bpInfo/banner.png');
  background-repeat: no-repeat;
  background-size: contain;
  min-height: 700px;
  color: #333;
  // padding-top: 350px;
  font-size: 28px;
  text-align: left;

  .bpList{
    margin: 0 32px 36px;
    background: #FFF;
    border-radius: 12px;
    padding: 26px 0px;
    border-bottom: 1px solid #EAEAEA;
    .bpImg{
      width: 64px;
      height: 64px;
      margin-right: 10px;
      border-radius: 50%;
    }
    .name{
      font-size: 28px;
      font-weight: 500;
    }
    .content{
      font-size: 28px;
      margin-top: 20px;
      overflow : hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }
  }
}
</style>
