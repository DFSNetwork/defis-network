<template>
  <div class="lists" v-loading="getLoading">
    <div class="noData tip" v-if="!lists.length">{{ $t('public.noData') }}</div>
    <div class="list flexa" v-for="(item, index) in lists" :key="index"
      @click="handleCheckedNode(item)">
      <div class="main">
        <div class="flexa">
          <span class="rank flexc">{{ index+1 }}</span>
          <img class="logo" :src="item.logo || voteDefaultImg" :onerror="defaultImg">
          <span class="nodeName">{{ item.owner }}</span>
        </div>
        <div class="tip data flexb">
          <div class="flexa">
            <van-icon class="coin rotate" name="coupon-o" />
            <span>{{ parseInt(item.num_votes) }} EOS</span>
          </div>
          <div class="flexa">
            <img class="coin" src="@/assets/navImg/percent.svg">
            <span>{{ item.percentage_votes }}%</span>
          </div>
        </div>
        <div class="tip data flexb">
          <div class="flexa">
            <img class="coin" src="@/assets/navImg/earth.svg">
            <a class="tip websize" :href="item.url" target="_blank" rel="noopener noreferrer">
              {{ handleDealUrl(item.url) }}
            </a>
          </div>
          <div class="flexa">
            <i class="el-icon-coin coin"></i>
            <span>{{ item.dfsVote || '-' }}</span>
            <span class="green_p">详情></span>
          </div>
        </div>
      </div>
      <div class="checkBoxDiv flexc">
        <div class="checkBox flexc" :class="{'isChecked': item.isChecked}">
          <van-icon v-if="item.isChecked" name="checked"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import voteDefaultImg from '@/assets/img/poolspage/voteDefaultImg.png'
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
    getLoading: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      voteDefaultImg,
      defaultImg: 'this.src="/static/default/voteImg.png"',
      isChecked: false,
      lists: []
    }
  },
  watch: {
    nodeLists: {
      handler: function nls(newVal) {
        if (!newVal.length) {
          return
        }
        this.handleDealLists()
      }
    },
    act() {
      this.handleDealLists()
    }
  },
  methods: {
    handleDealLists() {
      // const lists = JSON.parse(JSON.stringify(this.nodeLists));
      const lists = this.nodeLists;
      if (this.act === 1) {
        this.lists = lists
        return
      }
      let rank = lists.filter(v => v.dfsRank <= 10)
      rank = rank.slice(0, 10)
      this.lists = rank;
    },
    handleDealUrl(url) {
      let nUrl = url.replace(/(http|https):\/\//, '')
      nUrl = nUrl.replace(/^www\./, '')
      const arr = nUrl.split('/');
      return arr[0]
    },
    handleCheckedNode(item) {
      const index = this.nodeLists.findIndex(v => v.owner === item.owner);
      const isChecked = this.nodeLists[index].isChecked || false;
      this.$set(this.nodeLists[index], 'isChecked', !isChecked)
    }
  }
}
</script>

<style lang="scss" scoped>
.lists{
  .noData{
    font-size: 28px;
    text-align: center;
    padding: 50px 0;
  }
  .list{
    // height: 130px;
    padding: 20px 0;
    border-top: 1px solid #EEE;
    &:last-child{
      border-bottom: 0px solid #EEE;
    }
    .main{
      flex: 1;
      .logo{
        width: 50px;
        height: 50px;
        margin-right: 10px;
        border-radius: 50%;
      }
    }
    .checkBoxDiv{
      width: 50px;
      height: 50px;
      margin-left: 20px;
      .checkBox{
        box-sizing: border-box;
        height: 42px;
        width: 42px;
        border: 1px solid #eee;
        font-size: 45px;
        border-radius: 50%;;
        color: #07d79b;
        &.isChecked{
          border: 0px solid #eee;
        }
      }
    }
    .rank{
      background: #337352;
      color: #fFF;
      width: 50px;
      height: 35px;
      border-radius: 8px;
      font-size: 21px;
      margin-right: 10px;
    }
    .nodeName{
      font-weight: 500;
      color: #000;
      font-size: 30px;
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
      .coin{
        font-size: 32px;
        max-width: 32px;
        margin-right: 10px;
      }
      .green_p{
        margin-left: 8px;
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