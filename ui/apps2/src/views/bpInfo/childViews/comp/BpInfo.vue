<template>
  <div class="bpInfo">
    <div class="info">
      <div class="flexa">
        <img class="bpImg" :src="bpDetailInfo.logo" :onerror="errorCoinImg">
        <div class="">
          <div class="name">{{ bpname }}</div>
          <div class="dfsVote dinReg">{{ bpDetailInfo.voteNum || 0 }} 票数</div>
        </div>
      </div>
      <div class="score">
        <div class="flexa">
          <div class="scoreInfo">
            <div class="num dinBold">{{ score }}</div>
            <div class="star">
              <van-icon name="star" />
              <van-icon name="star" />
              <van-icon name="star" />
              <van-icon name="star" />
              <van-icon name="star" />
            </div>
            <div class="tip scoreCount">
              <span class="dinReg">{{ bpStar.showCntNum }}</span>
              <span>人评价</span>
            </div>
          </div>
          <ScoreDetail :bpStar="bpStar"/>
          <div class="scoreNum tip">
            <div><span class="dinReg">{{handleDealCountNum(type1)}}</span>人推荐</div>
            <div><span class="dinReg">{{handleDealCountNum(type2)}}</span>人觉得还行</div>
            <div><span class="dinReg">{{handleDealCountNum(type3)}}</span>人觉得一般般</div>
          </div>
        </div>
        <div class="rank flexa">
          <img class="rankImg" src="https://cdn.jsdelivr.net/gh/defis-net/material/bpInfo/rank.png" alt="">
          <span>节点排行榜第{{ bpDetailInfo.bprank || 0 }}名</span>
        </div>
      </div>
    </div>

    <!-- 简介 -->
    <div class="desc">
      <div class="title flexb">
        <span>简介</span>
        <span class="add" v-if="isEditor" @click="handleToUpdate">编辑</span>
      </div>
      <div class="content" :class="{'showAll': showDetail}">
        {{ bpInfo.desc0 }}
        <span class="more"
          @click="showDetail = !showDetail">
          <span v-if="!showDetail">查看详情</span>
          <span v-else>收起</span>
        </span>
      </div>
      <div class="item flexb">
        <span class="tip">成立时间</span>
        <span>{{ bpInfo.lTime }}</span>
      </div>
      <div class="item flexb">
        <span class="tip">官网地址</span>
        <span>{{ bpDetailInfo.url }}</span>
      </div>
      <div class="qusLists" v-if="showMore">
        <template v-for="(v, i) in qus">
          <div class="qus" v-if="v.ans" :key="`qus${i}`">
            <div class="tip qusTitle flexa">{{ v.content }}</div>
            <div class="qusContent">{{ v.ans }}</div>
          </div>
        </template>
      </div>

      <div class="showMore tip flexc" @click="showMore = !showMore">
        <span class="flexa" v-if="!showMore">
          <span>查看更多</span>
          <img src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/down.png" alt="">
        </span>
        <span class="closeMore flexa" v-else>
          <span>收起</span>
          <img src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/down.png" alt="">
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import Bus from '@/utils/bus';
import { mapState } from 'vuex';
import ScoreDetail from './ScoreDetail';
import {get_table_rows, get_bp_info} from '@/utils/api'
import {toLocalTime} from '@/utils/public';
export default {
  name: 'bpInfo',
  components: {
    ScoreDetail,
  },
  props: {
    isEditor: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      errorCoinImg: 'this.src="https://ndi.340wan.com/eos/eosio.token-eos.png"',
      bpname: '',
      bpInfo: {},
      bpDetailInfo: {},
      qusAll: [],
      ansAll: [],
      qus: [],
      showMore: false,
      showDetail: false,

      // allStars
      allStars: [],
      bpStar: {},
      score: '0.0',
    }
  },
  mounted() {
    this.bpname = this.$route.params.bpname;
    Bus.$on('busStars', (val) => {
      this.hendleGetStars(val)
    });
    this.handleGetBaseInfo()
    this.handleGetScores()
    this.handleGetQues()
    this.handleGetAns()
    this.handleGetBpInfo()
  },
  computed: {
    ...mapState({
      scatter: state => state.app.scatter,
      language: state => state.app.language,
    }),
    type1() {
      let t = 0;
      t = Number(this.bpStar.star10 || 0) + Number(this.bpStar.star9 || 0) + Number(this.bpStar.star8 || 0);
      return t
    },
    type2() {
      let t = 0;
      t = Number(this.bpStar.star6 || 0) + Number(this.bpStar.star7 || 0);
      return t
    },
    type3() {
      let t = 0;
      t = Number(this.bpStar.count_num || 0) - Number(this.type1 || 0) - Number(this.type2 || 0)
      return t
    },
    voteWeight() {
      let sec_since_lanch = 946684800;
      let weight_1 = parseInt((Date.parse(new Date()) / 1000 - sec_since_lanch) / (86400 * 7)) / 52;
      weight_1 = 1 / Math.pow(2, weight_1) / 10000
      return weight_1
    }
  },
  methods: {
    async handleGetBpInfo() {
      const params = {
        bp: this.bpname
      }
      const {status, result} = await get_bp_info(params);
      if (!status) {
        return
      }
      const bpDetailInfo = result;
      bpDetailInfo.logo = bpDetailInfo.bpjson.org.branding.logo_256;
      const num = Number(bpDetailInfo.total_votes) * Number(this.voteWeight);
      bpDetailInfo.voteNum = Math.ceil(num);
      this.bpDetailInfo = bpDetailInfo;
      // console.log(bpDetailInfo)
    },
    handleDealCountNum(n) {
      let t = n
      t > 1000 ? t = `${(t / 1000).toFixed(1)}K` : t;
      return t
    },
    hendleGetStars(val) {
      this.allStars = val;
      const list = val.filter(v => v.bp === this.bpname)
      let count_num = 0;
      const bpStar = {};

      list.forEach(v => {
        count_num = Number(count_num) + Number(v.sum);
        let s = bpStar[`star${v.star}`] || 0;
        s = Number(s) + Number(v.sum);
        bpStar[`star${v.star}`] = s;
      })
      bpStar.count_num = count_num;
      bpStar.showCntNum = count_num > 1000 ? `${(count_num / 1000).toFixed(1)}K` : count_num;
      this.bpStar = bpStar;
    },
    async handleGetBaseInfo() {
      const params = {
        "code":"dfscommunity",
        "scope":"dfscommunity",
        "table":"producers",
        "lower_bound": ` ${this.bpname}`,
        "upper_bound": ` ${this.bpname}`,
        "json":true,
      }
      const {status, result} = await get_table_rows(params)
      if (!status) {
        return
      }
      const rows = result.rows || []
      if (!rows.length) {
        return
      }
      const row = rows[0];
      const time = toLocalTime(row.create_time).substring(0, 10);
      this.$set(row, 'lTime', time)
      this.bpInfo = row;
    },
    async handleGetScores() {
      const params = {
        "code":"dfscommunity",
        "scope":"dfscommunity",
        "table":"scores",
        "json":true,
        "lower_bound": this.bpname,
        "upper_bound": this.bpname,
      }
      const {status, result} = await get_table_rows(params)
      if (!status) {
        return
      }
      const rows = result.rows || [];
      if (!rows.length) {
        return
      }
      const row = rows[0]
      const score = (row.total_star / row.user_count).toFixed(1);
      this.score = score;
    },
    async handleGetQues() {
      const params = {
        "code":"dfscommunity",
        "scope":"dfscommunity",
        "table":"questions",
        "json":true,
      }
      const {status, result} = await get_table_rows(params)
      if (!status) {
        return
      }
      this.qusAll = result.rows || [];
      this.handleDeal()
    },
    async handleGetAns() {
      const params = {
        "code":"dfscommunity",
        "scope": this.bpname,
        "table":"answers",
        "json":true,
      }
      const {status, result} = await get_table_rows(params)
      if (!status) {
        return
      }
      this.ansAll = result.rows || [];
      this.handleDeal()
    },
    handleDeal() {
      if (!this.qusAll.length || !this.ansAll.length) {
        return
      }
      this.qusAll.forEach(v => {
        // const ans = this.ansAll.find(vv => vv.qid === v.id && vv.lang === v.lang)
        const ans = this.ansAll.find(vv => vv.qid === v.id)
        if (ans) {
          this.$set(v, 'ans', ans.content)
        }
      })
      console.log(this.qusAll)
      this.handleGetLangQus()
    },
    handleGetLangQus() {
      let lang = 'en';
      if (this.language !== 'en') {
        lang = 'zh'
      }
      this.qus = this.qusAll.filter(v => v.lang === lang)
      console.log(this.qus)
    },
    handleToUpdate() {
      this.$router.push({
        name: 'updateInfo',
        params: {
          bpname: this.bpname
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.bpInfo{
  font-size: 28px;
  text-align: left;
  color: #333;
  .info{
    padding: 30px 32px;
    border-bottom: 20px solid #f5f5f5;
    .bpImg{
      width: 64px;
      height: 64px;
      border-radius: 50%;
      margin-right: 10px;
    }
    .name{
      font-size: 32px;
      font-weight: 500;;
    }
    .dfsVote{
      color: #29D4B0;
    }
  }
  .score{
    margin-top: 34px;
    border: 1px solid rgba(220, 220, 220, .3);
    border-radius: 12px;
    padding: 26px 32px;
    .scoreInfo{
      color: #FFC300;
      text-align: center;
      font-size: 22px;
      margin-right: 20px;
      .num{
        font-size: 56px;
      }
      .star{
        font-size: 20px;
        margin-bottom: 6px;
        /deep/ .van-icon{
          margin: 3px;
        }
      }
    }
    .scoreNum{
      font-size: 20px;
      span{
        color: #333;
        font-weight: 300;
      }
      &>div{
        margin: 7px;
      }
    }
  }
  .rank{
    margin: 20px 0 0;
    padding: 24px 0 0;
    border-top: 1px solid rgba(220,220,220,.3);
    font-size: 26px;
    .rankImg{
      width: 30px;
      margin-right: 20px;
    }
  }
}
.desc{
  padding: 20px 32px 0;
  border-bottom: 20px solid #f5f5f5;
  .title{
    font-size: 32px;
    font-weight: 500;
    padding-left: 28px;
    position: relative;
    margin-bottom: 20px;
    &::before{
      content: '';
      position: absolute;
      height: 26px;
      width: 8px;
      top: 50%;
      left: 0px;
      transform: translate(0, -45%);
      background: #29D4B0;
      border-radius: 4px;
    }
    .add{
      font-size: 26px;
      background: #29D4B0;
      border-radius: 40px;
      padding: 8px 32px;
      font-weight: normal;
      color: #fff;
    }
  }
  .content{
    position: relative;
    margin-bottom: 15px;
    min-height: 60px;
    max-height: 120px;
    overflow: hidden;
    &.showAll{
      max-height: 20000px;
    }
  }
  .showMore{
    height: 110px;
    img{
      width: 20px;
      margin: 0 14px;
    }
    .closeMore{
      img{
        display: inline-block;
        transform: rotate(180deg);
      }
    }
  }
  .qusLists{
    .qus{
      .qusTitle{
        height: 90px;
      }
      .qusContent{
        font-size: 28px;
        padding-bottom: 20px;
        border-bottom: 1px solid rgba(220,220,220,.3);
      }
    }
  }
  .more{
    color: #29D4B0;
    position: absolute;
    bottom: 0px;
    right: 15px;
    background: #FFF;
  }
  .item{
    height: 90px;
    border-bottom: 1px solid rgba(220,220,220,.3);
    &:last-child{
      border-bottom: 0;
    }
  }
}
</style>
