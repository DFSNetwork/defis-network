<template>
  <div class="bpInfo">
    <div class="info">
      <div class="flexb">
        <div class="flexa">
          <img class="bpImg" :src="bpDetailInfo.logo || errorCoinImg" :onerror="errorCoinImg">
          <div class="">
            <div class="name">{{ bpname }}</div>
            <div class="dfsVote dinReg">{{ $t('bpInfo.voteNum', {num: bpDetailInfo.voteNum || 0}) }}</div>
          </div>
        </div>
        <div class="likeDiv flexa din">
          <img src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/newlike1.png" alt="">
          <span>{{ bpDetailInfo.likeNum }}</span>
        </div>
      </div>
      <div class="score">
        <div class="flexa">
          <div class="scoreInfo">
            <div class="num dinBold">{{ score }}</div>
            <div class="star">
              <van-rate v-model="starIcon" allow-half readonly
                void-icon="star" void-color="#DBDBDB" color="#FFC300"/>
            </div>
            <div class="tip scoreCount">
              <!-- <span class="dinReg">{{ bpStar.showCntNum }}</span> -->
              <span class="dinReg">{{ $t('bpInfo.rpyNum', {num: bpStar.showCntNum}) }}</span>
            </div>
          </div>
          <ScoreDetail :bpStar="bpStar"/>
          <div class="scoreNum tip">
            <div><span class="dinReg">{{handleDealCountNum(type1)}}</span>{{ $t('bpInfo.rpyNum1') }}</div>
            <div><span class="dinReg">{{handleDealCountNum(type2)}}</span>{{ $t('bpInfo.rpyNum2') }}</div>
            <div><span class="dinReg">{{handleDealCountNum(type3)}}</span>{{ $t('bpInfo.rpyNum3') }}</div>
          </div>
        </div>
        <div class="rank flexa">
          <img class="rankImg" src="https://cdn.jsdelivr.net/gh/defis-net/material/bpInfo/rank.png" alt="">
          <span>{{ $t('bpInfo.currRank', {rank: bpDetailInfo.bprank || 0}) }}</span>
        </div>
      </div>
      <div class="social flexa" v-if="bpDetailInfo.social">
        <img v-if="bpDetailInfo.social.github" src="https://cdn.jsdelivr.net/gh/defis-net/material/par/GitHub_icon.svg" alt="">
        <img v-if="bpDetailInfo.social.twitter" src="https://cdn.jsdelivr.net/gh/defis-net/material/par/twitter_icon.svg" alt="">
        <img v-if="bpDetailInfo.social.telegram" src="https://cdn.jsdelivr.net/gh/defis-net/material/par/telegram_icon.svg" alt="">
        <img v-if="bpDetailInfo.social.wechat" src="https://cdn.jsdelivr.net/gh/defis-net/material/par/WeChat_icon.svg" alt="">
        <img v-if="bpDetailInfo.social.medium" src="https://cdn.jsdelivr.net/gh/defis-net/material/par/medium_icon.svg" alt="">
      </div>
    </div>

    <!-- 简介 -->
    <div class="desc">
      <div class="title flexb">
        <span>{{ $t('bpInfo.desc') }}</span>
        <span class="add" v-if="isEditor" @click="handleToUpdate">{{ $t('bpInfo.edt') }}</span>
      </div>
      <div class="content" :class="{'showAll': showDetail}" @click="showContent = true">
        {{ lang === 'cn' ? bpInfo.desc0 : bpInfo.desc1 }}
      </div>
      <div class="item flexb">
        <span class="tip">{{ $t('bpInfo.createTime') }}</span>
        <span>{{ bpInfo.lTime || '暂未编辑' }}</span>
      </div>
      <div class="item flexb">
        <span class="tip">{{ $t('bpInfo.website') }}</span>
        <span>{{ bpDetailInfo.url }}</span>
      </div>
      <div class="item flexb">
        <span class="tip flexa" @click="showEdtsTip = true">
          <span>{{ $t('bpInfo.editor') }}</span>
          <img class="qus" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/tips_icon_btn.svg" alt="">
        </span>
        <span>{{ edts || '-' }}</span>
      </div>
      <div class="item flexb">
        <span class="tip flexa" @click="handleShowBpJsonErr">
          <span>{{ $t('bpInfo.bpjson') }}</span>
          <img v-if="!bpDetailInfo.bpjson || bpDetailInfo.bpjson_error"
            class="qus" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/tips_icon_btn.svg" alt="">
        </span>
        <span class="flexa">
          <span v-if="!bpDetailInfo.bpjson || bpDetailInfo.bpjson_error">{{ $t('bpInfo.noData1') }}</span>
          <span v-else>{{ `${bpDetailInfo.url}/bp.json` }}</span>
        </span>
      </div>
      <div class="item apiDiv">
        <span class="tip flexa" @click="handleShowApiTip">
          <span>{{ $t('bpInfo.api') }}</span>
          <img class="qus" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/tips_icon_btn.svg" alt="">
        </span>
        <div class="apiUrl">
          <div class="tip" v-if="!bpDetailInfo.nodes">{{ $t('bpInfo.noData1') }}</div>
          <template v-else>
            <div class="flexb" v-for="(v, i) in bpDetailInfo.nodes" :key="`nodes${i}`">
              <span>{{ v.url }}</span>
              <span v-if="!v.isGet">Loading...</span>
              <span v-else :class="{'green': v.ms < 1000,
                'red': v.ms >= 3000,
                'yellow': v.ms < 3000 && v.ms >= 1000}">{{ v.ms }}ms</span>
            </div>
          </template>
        </div>
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
          <span>{{ $t('bpInfo.showMore') }}</span>
          <img src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/down.png" alt="">
        </span>
        <span class="closeMore flexa" v-else>
          <span>{{ $t('bpInfo.close') }}</span>
          <img src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/down.png" alt="">
        </span>
      </div>
    </div>
    <el-dialog
      class="mydialog"
      :show-close="false"
      :visible.sync="showContent">
      <ShowContent :content="bpInfo.desc0"/>
    </el-dialog>

    <el-dialog
      class="mydialog"
      :show-close="false"
      :visible.sync="showEdtsTip">
      <ShowEdts :bpname="bpname"/>
    </el-dialog>

    <el-dialog
      class="mydialog"
      :show-close="false"
      :visible.sync="showBpJsonErr">
      <ShowBpJsonErr :content="contentTip"/>
    </el-dialog>
  </div>
</template>

<script>

import Bus from '@/utils/bus';
import { mapState } from 'vuex';
import ScoreDetail from './ScoreDetail';
import {get_bp_info} from '@/utils/api'
import {toLocalTime} from '@/utils/public';
import ShowContent from '../dialog/ShowContent';
import ShowEdts from '../dialog/ShowEdts';
import ShowBpJsonErr from '../dialog/ShowBpJsonErr';
import moment from 'moment';

export default {
  name: 'bpInfo',
  components: {
    ScoreDetail,
    ShowContent,
    ShowEdts,
    ShowBpJsonErr,
  },
  props: {
    isEditor: {
      type: Boolean,
      default: false,
    },
    editors: {
      type: Array,
      default: function ets() {
        return []
      }
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
      showContent: false,
      showEdtsTip: false,
      showBpJsonErr: false,
      contentTip: '',

      // allStars
      allStars: [],
      bpStar: {},
      score: '0.0',
      starIcon: 0
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
    edts() {
      let s = [];
      this.editors.forEach(v => {
        s.push(v.owner)
      })
      return s.join(', ')
    },
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
      let weight_1 = parseInt((moment().valueOf() / 1000 - sec_since_lanch) / (86400 * 7)) / 52;
      weight_1 = 1 / Math.pow(2, weight_1) / 10000
      return weight_1
    },
    lang() {
      if (this.language !== 'en') {
        return 'cn'
      }
      return 'en'
    }
  },
  methods: {
    handleShowBpJsonErr() {
      if (this.bpDetailInfo.bpjson || !this.bpDetailInfo.bpjson_error) {
        return
      }
      this.contentTip = this.bpDetailInfo.bpjson_error;
      this.showBpJsonErr = true;
    },
    handleShowApiTip() {
      this.contentTip = this.$t('bpInfo.fromBpjson')
      this.showBpJsonErr = true;
    },
    async handleGetBpInfo() {
      const params = {
        bp: this.bpname
      }
      const {status, result} = await get_bp_info(params);
      if (!status) {
        return
      }
      const bpDetailInfo = result;
      if (bpDetailInfo.bpjson) {
        const bpjson = bpDetailInfo.bpjson;
        bpDetailInfo.logo = (bpjson.org && bpjson.org.branding) ? bpjson.org.branding.logo_256 : '';

        // 获取api列表
        const nodes = bpjson.nodes
        if (nodes) {
          const arr = [];
          nodes.forEach(v => {
            if (!v.ssl_endpoint) {
              return
            }
            const item = {
              url: v.ssl_endpoint,
            }
            arr.push(item)
          })
          bpDetailInfo.nodes = arr;
        }
        // 获取社交信息
        const social = bpjson.org ? bpjson.org.social : {};
        // console.log(social)
        bpDetailInfo.social = social;
      }
      if (bpDetailInfo.comments) {
        const like = bpDetailInfo.comments.like * 1000;
        bpDetailInfo.likeNum = like.toFixed(0)
      }
      const num = Number(bpDetailInfo.total_votes) * Number(this.voteWeight);
      bpDetailInfo.voteNum = Math.ceil(num);
      this.bpDetailInfo = bpDetailInfo;
      this.handleGetSpeed();
      // console.log(bpDetailInfo)
    },
    handleGetSpeed() {
      if (!this.bpDetailInfo.nodes) {
        return
      }
      this.bpDetailInfo.nodes.forEach(async v => {
        let time = new Date().getTime();
        const {status} = await this.$api.get_info(v.url);
        if (!status) {
          return
        }
        time = new Date().getTime() - time;
        this.$set(v, 'ms', time)
        this.$set(v, 'isGet', true)
      })
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
      const {status, result} = await this.$api.get_table_rows(params)
      if (!status) {
        return
      }
      const rows = result.rows || []
      if (!rows.length) {
        return
      }
      const row = rows[0];
      if (row.create_time !== '1970-01-01T00:00:00') {
        const time = toLocalTime(row.create_time).substring(0, 10);
        this.$set(row, 'lTime', time)
      }
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
      const {status, result} = await this.$api.get_table_rows(params)
      if (!status) {
        return
      }
      const rows = result.rows || [];
      if (!rows.length) {
        return
      }
      // console.log(rows)
      const row = rows[0]
      const score = (row.total_star / row.user_count / 2).toFixed(1);
      this.score = score;
      this.starIcon = Number(score)
    },
    async handleGetQues() {
      const params = {
        "code":"dfscommunity",
        "scope":"dfscommunity",
        "table":"questions",
        "json":true,
      }
      const {status, result} = await this.$api.get_table_rows(params)
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
      const {status, result} = await this.$api.get_table_rows(params)
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
      // console.log(this.qusAll)
      this.handleGetLangQus()
    },
    handleGetLangQus() {
      this.qus = this.qusAll.filter(v => v.lang === this.lang)
      // console.log(this.qus)
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
    .likeDiv{
      img{
        width: 36px;
        margin-right: 14px;;
      }
    }
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
    .social{
      margin-top: 24px;
      img{
        width: 40px;
        margin-right: 30px;
      }
    }
  }
  .score{
    margin-top: 34px;
    border: 1px solid rgba(220, 220, 220, .3);
    border-radius: 12px;
    padding: 26px 28px;
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
        /deep/ .van-rate__icon{
          font-size: 20px;
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
    // min-height: 60px;
    // max-height: 120px;
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
        min-height: 90px;
        padding: 18px 0;
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
    &.apiDiv{
      justify-content: space-between;
      height: auto;
      padding: 18px 0;
      .apiUrl{
        text-align: center;
        &>div{
          height: 45px;
        }
        .green{
          color: #29D4B0;
        }
        .red{
          color: #e9574f;
        }
        .yellow{
          color: #f5a623;
        }
      }
    }
    .qus{
      width: 30px;
      margin-left: 10px;
    }
  }
}
</style>
