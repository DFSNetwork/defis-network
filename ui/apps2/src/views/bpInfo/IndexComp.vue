<template>
  <div class="bpInfo">
    <van-list
        v-model="loadingMore"
        :finished="finished"
        :loading-text="$t('public.loading')"
        :finished-text="$t('public.noMore')"
        @load="handleCurrentChange"
      >
      <div class="bpList flexa" v-for="(v, i) in bpLists" :key="i" @click="handleTo(v)">
        <div class="rankDiv dinBold flexc">
          <img v-if="i < 3" :src="`https://cdn.jsdelivr.net/gh/defis-net/material/rank/voteRank${i+1}.png`" alt="">
          <span v-else>{{i + 1}}</span>
        </div>
        <div class="flexs" style="flex: 1">
          <img class="bpImg" :src="v.logo || errImg" :onerror="errImg">
          <div style="flex: 1">
            <div class="name">{{ v.owner }}</div>
            <div class="star flexa dinBold">
              <span>{{ v.scoreNum || '0.0' }}</span>
              <van-rate v-model="v.scoreNumStar" allow-half readonly
                void-icon="star" void-color="#DBDBDB" color="#FFC300"/>
              <span class="tip small dinReg">({{ $t('bpInfo.rpyNum', {num: v.total || 0}) }})</span>
            </div>
            <div class="flexa">
              <span class="rpy flexa">{{ v.rpy.memo || $t('bpInfo.noRpy') }}</span>
            </div>
            
            <div class="data flexb">
              <div class="flexa dinReg">
                <span class="voteIcon flexc">
                  <img class="small" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/money.png" alt="">
                </span>
                <span>{{ parseInt(v.voteNum) | numeralFormat }} EOS</span>
              </div>
              <div class="flexa dinReg">
                <span class="tip">BP Rank:</span>
                <span>{{ v.bprank }}</span>
              </div>
            </div>
            <div class="data flexb">
              <div class="flexa">
                <img class="voteIcon" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/vote.png" alt="">
                <span class="dinReg">{{ v.dfsVote || '0' }} DFS</span>
              </div>
              <div class="flexa dinReg">
                <img class="voteIcon" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/earth.png" alt="">
                <a class="tip websize" :href="v.url" target="_blank" rel="noopener noreferrer">
                  {{ handleDealUrl(v.url) }}
                </a>
              </div>
            </div>
          </div>
        </div>
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
  props: {
    nodeLists: {
      type: Array,
      default: function nls() {
        return []
      }
    },
    search: {
      type: String,
      default: '',
    }
  },
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
    // this.handleGetBpInfo()
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
  watch: {
    search: {
      handler: function sc() {
        this.finished = false;
        this.page = 1;
        this.handleCurrentChange();
      },
      deep: true,
      immediate: true,
    }
  },
  methods: {
    handleDealUrl(url) {
      let nUrl = url.replace(/(http|https):\/\//, '')
      nUrl = nUrl.replace(/^www\./, '')
      const arr = nUrl.split('/');
      return arr[0]
    },
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
      if (!this.nodeLists.length) {
        setTimeout(() => {
          this.handleCurrentChange()
        }, 500);
        return
      }
      setTimeout(() => {
        const start = (this.page - 1) * this.pageSize;
        const end = this.page * this.pageSize;
        let nls = this.nodeLists
        if (this.search) {
          nls = this.nodeLists.filter(v => v.owner.indexOf(this.search) !== -1)
        }
        const lists = nls.slice(start, end);
        if (this.page === 1) {
          this.bpLists = lists;
        } else {
          this.bpLists.push(...lists);
        }
        this.loadingMore = false;
        this.page += 1;
        if (this.bpLists.length >= nls.length) {
          this.finished = true;
        }
        this.handleGetContent();
      }, 200);
    },
    handleGetContent() {
      this.bpLists.forEach(async v => {
        if (v.getBase) {
          return
        }
        this.$set(v, 'getBase', true);
        if (!v.comments) {
          this.$set(v, 'score', 0);
          this.$set(v, 'rpy', {});
          this.$set(v, 'total', 0);
          return
        }
        // 默认数据
        this.$set(v, 'score', 0);
        this.$set(v, 'rpy', {});
        this.$set(v, 'total', 0);
        // 处理评分
        if (v.comments.stars) {
          // const mvpRpy = 
          const scoreArr = v.comments.stars || [];
          let allStar = 0;
          let num = 0;
          scoreArr.forEach(vv => {
            allStar = Number(allStar) + Number(vv.star) * Number(vv.sum)
            num = Number(num) + Number(vv.sum);
          })
          const score = (allStar / num / 2).toFixed(1)
          this.$set(v, 'score', Number(score || 0));
        }
        if (v.comments.top3) { // 处理评论
          if (!v.comments.top3.length) {
            this.$set(v, 'rpy', {});
          } else {
            this.$set(v, 'rpy', v.comments.top3[0]);
          }
        }
        if (v.comments.total) {
          this.$set(v, 'total', v.comments.total);
        }

        const params = {
          "code":"dfscommunity",
          "scope":"dfscommunity",
          "table":"scores",
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
        const scoreNum = (row.total_star / row.user_count / 2).toFixed(1);

        this.$set(v, 'scoreNum', scoreNum) 
        this.$set(v, 'scoreNumStar', Number(scoreNum)) 
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
  background-repeat: no-repeat;
  background-size: contain;
  min-height: 700px;
  color: #333;
  font-size: 28px;
  text-align: left;

  .bpList{
    // margin: 0 32px 36px;
    background: #FFF;
    border-radius: 12px;
    padding: 26px 28px;
    border-bottom: 1px solid #EAEAEA;
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
    .star{
      color: #FFC300;
      margin: 0px 0 10px;
      font-size: 30px;
      margin-bottom: 6px;
      /deep/ .van-rate{
        margin: 0 10px;
      }
      /deep/ .van-rate__icon{
        font-size: 20px;
      }
      .small{
        font-size: 24px;
      }
    }
    .rpy{
      margin: 10px 0;
      color: #29D4B0;
      font-size: 22px;
      height: 36px;
      border-radius: 8px;
      background: rgba(41, 212, 176, 0.12);
      overflow : hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      padding: 0 12px;
      line-height: 36px;
    }

    .bpImg{
      width: 44px;
      height: 44px;
      margin-right: 10px;
      border-radius: 50%;
    }
    .name{
      line-height: 44px;
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
    .data{
      margin-top: 15px;
      text-align: left;
      color: #666;
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
