<template>
  <div class="records">
    <div class="title flexb">
      <span>{{ $t('bpInfo.story') }}</span>
      <span class="add" v-if="isEditor" @click="showAddScore = true">{{ $t('bpInfo.edt') }}</span>
    </div>
    <div class="scroll">
      <div class="noData flexc tip" v-if="!recordLists.length">{{ $t('public.noData') }}</div>
      <div class="longDiv flexa">
        <div class="list" v-for="(v, i) in recordLists" :key="i"
          @click="handleLook(v)">
          <div class="rTitle">{{ v.title }}</div>
          <div class="rTime tip">{{ v.lTime }}</div>
          <div class="flexs">
            <img class="artImg" src="https://cdn.jsdelivr.net/gh/defis-net/material/bpInfo/art.png" alt="">
            <div class="subContent tip">{{ v.content }}</div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      class="mydialog"
      :show-close="false"
      :visible.sync="showAddScore">
      <AddRecord v-if="showAddScore" @listenClose="handleClose"/>
    </el-dialog>

    <el-dialog
      class="mydialog"
      :show-close="false"
      :visible.sync="showStory">
      <BpStory v-if="showStory" :story="story" @listenClose="handleClose"/>
    </el-dialog>
  </div>
</template>

<script>
import AddRecord from '../dialog/AddRecord'
import BpStory from '../dialog/BpStory'
import { mapState } from 'vuex';
import moment from 'moment';

import {toLocalTime} from '@/utils/public';
export default {
  name: 'records',
  components: {
    AddRecord,
    BpStory,
  },
  props: {
    isEditor: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      showAddScore: false,
      showStory: false,
      recordLists: [],
      story: {},
    }
  },
  mounted() {
    this.handleGetRecord()
  },
  computed: {
    ...mapState({
      scatter: state => state.app.scatter,
      language: state => state.app.language,
    }),
    lang() {
      if (this.language !== 'en') {
        return 'cn'
      }
      return 'en'
    }
  },
  methods: {
    handleLook(item) {
      this.showStory = true;
      this.story = item;
    },
    handleClose() {
      this.showAddScore = false;
      this.showStory = false;
    },
    async handleGetRecord() {
      const bpname = this.$route.params.bpname;
      const params = {
        "code":"dfscommunity",
        "scope": bpname,
        "table": "storys",
        "json":true,
        limit: 1000,
      }
      const {status, result} = await this.$api.get_table_rows(params);
      if (!status) {
        return
      }
      const rows = result.rows || [];
      rows.forEach(v => {
        const time = toLocalTime(`${v.time}.000+0000`)
        this.$set(v, 'lTime', time)
        const lt = moment(time.replace(/-/g, '/')).valueOf()
        this.$set(v, 'lt', lt)
      });
      rows.sort((a, b) => {
        return b.lt - a.lt
      })
      const langArr = rows.filter(v => v.lang === this.lang)
      this.recordLists = langArr;
    }
  }
}
</script>

<style lang="scss" scoped>
.records{
  text-align: left;
  font-size: 28px;
  padding: 28px 0;
  border-bottom: 20px solid #f5f5f5;
  .title{
    font-size: 32px;
    font-weight: 500;
    padding-left: 28px;
    position: relative;
    margin: 0 32px 20px;
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
  .scroll{
    overflow: auto;
    .noData{
      height: 160px;
      font-size: 28px;
    }
    .longDiv{
      max-width: 2000px;
      .list{
        min-width: 260px;
        max-width: 260px;
        min-height: 160px;
        max-height: 160px;
        padding: 20px 20px 10px;
        border-radius: 8px;
        border: 1px solid rgba(220,220,220, .3);
        margin: 0 0 0 32px;
        // box-sizing: border-box;
        .rTitle{
          overflow : hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }
        .rTime{
          font-size: 20px;
          margin: 10px 0;
        }
        .artImg{
          width: 22px;
          margin: 6px 6px;
        }
        .subContent{
          font-size: 22px;
          overflow : hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }
    }
  }
}
</style>