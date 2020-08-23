<template>
  <div class="poolsLists">
    <div class="title flexb">
      <span class="act">{{ $t('mine.minersList') }}</span>
      <span class="totalMiners">{{ $t('mine.totalMiners') }}：{{ allMinersList.length }}</span>
    </div>
    <div class="noData" v-loading="!getMinersList" v-if="!minersArr.length">{{ $t('public.noData') }}</div>
    <template v-for="(item, index) in minersArr">
      <div class="list" :key="index">
        <div class="flexb mb10">
          <span>{{ item.miner }}</span>
          <span>{{ $t('mine.earnings') }}：{{ item.showReward || '0.00000000' }} DFS</span>
        </div>
        <div class="flexb">
          <span>{{ $t('dex.pools') }}</span>
          <span>{{ item.liq_bal0 }} / {{ item.liq_bal1 }}</span>
        </div>
      </div>
    </template>
    <el-pagination
      v-if="allMinersList.length"
      class="pagination"
      layout="prev, pager, next"
      @current-change="handleCurrentChange"
      :current-page.sync="page"
      :page-size="pageSize"
      :total="allMinersList.length">
    </el-pagination>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { EosModel } from '@/utils/eos';
import { toFixed, accSub, accAdd, accMul, accDiv, dealReward, dealMinerData, perDayReward } from '@/utils/public';
export default {
  name: 'dsrMinerList',
  data() {
    return {
      getMinersList: true,
      minersArr: [],
      allMinersList: [],
      pageSize: 10,
      page: 1,
    }
  },
  mounted() {
    this.handleGetMinersLists()
  },
  methods: {
    handleCurrentChange() {
      this.handleGetPageArr();
    },
    handleGetPageArr() {
      const start = (this.page - 1) * this.pageSize;
      const end = this.page * this.pageSize;
      this.minersArr = this.allMinersList.slice(start, end);
      this.handleRunReward()
    },

    handleGetMinersLists(type) {
      const params = {
        "code": "miningpool11",
        "scope": 39,
        "table": "miners",
        // "lower_bound": " dfsdeveloper",
        // "upper_bound": " dfsdeveloper",
        limit: 1000,
        "json": true,
      }
      if (type === 'user') {
        params.lower_bound = ` ${this.scatter.identity.accounts[0].name}`;
        params.upper_bound = ` ${this.scatter.identity.accounts[0].name}`;
      }
      EosModel.getTableRows(params, (res) => {
        if (type === 'user') {
          this.getAccData = true;
        } else {
          this.getMinersList = true;
        }
        const rows = res.rows || []
        if (!rows.length) {
          this.accMineData = {};
          return
        }
        const newList = [];
        rows.forEach(item => {
          let v = item;
          const minnerData = dealMinerData(v, this.thisMarket)
          // console.log(minnerData)
          if (type === 'user') {
            this.accMineData = minnerData;
            return;
          }
          // if (this.scatter.identity && this.scatter.identity.accounts[0].name === v.miner) {
          //   return
          // }
          newList.push(minnerData)
        })
        if (type === 'user') {
          this.handleRunAccReward()
          return
        }
        const newListSort = newList.sort((a, b) => {
          return b.liq - a.liq;
        })
        try {
          this.allMinersList = newListSort;
          this.handleGetPageArr();
        } catch (error) {
          console.log(error)
        }
      })
    },
    // 秒级定时器
    handleRunReward() {
      clearInterval(this.secTimer)
      this.handleRunLogic()
      this.secTimer = setInterval(() => {
        this.handleRunLogic()
      }, 1000);
    },
    // 数据滚动效果
    handleRunLogic() {
      this.minersArr.forEach((v, index) => {
        if (this.timerArr[index]) {
          clearInterval(this.timerArr[index]);
        }
        if (!Number(v.liq)) {
          this.timerArr[index] = null;
          return
        }
        const reward = dealReward(v, this.weight)
        let showReward = v.reward || '0.00000000';
        let countReward = showReward;
        if (!v.showReward) {
          this.$set(v, 'showReward', reward)
          showReward = reward;
          countReward = reward;
        }
        this.$set(v, 'reward', reward)
        let t = accSub(reward, showReward);
        t = accDiv(t, 20)
        this.timerArr[index] = setInterval(() => {
          countReward = accAdd(countReward, t)
          if (countReward > Number(reward)) {
            showReward = toFixed(reward, 8);
            clearInterval(this.timerArr[index])
          } else {
            showReward = toFixed(countReward, 8);
          }
          this.$set(v, 'showReward', showReward);
        }, 50);
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.poolsLists{
  margin: 40px;
  font-size: 28px;
  .title{
    font-size: 32px;
    text-align: left;
    margin: 0 0 40px;
    .act{
      color: $color-black;
      position: relative;
      &::before{
        content: '';
        position: absolute;
        width:60px;
        height:8px;
        background:rgba(2,198,152,1);
        border-radius:4px;
        bottom: -20px;
        left: 50%;
        transform: translateX(-45%);
      }
    }
  }
  .totalMiners{
    margin-right: 0;
    font-size: 26px;
    .tipIcon{
      margin-left: 10px;
      width: 28px;
    }
  }
  .list{
    margin-top: 20px;
    border: 1px solid #e0e0e0;
    border-radius: 20px;
    padding: 20px;
    .mb10{
      margin-bottom: 10px;
    }
  }
  .noData{
    text-align: center;
    margin: 100px 0;
    color: #A6A6A6;
    font-size: 24px;
  }
}
.pagination{
  text-align: right;
  margin-top: 20px;
  font-size: 26px;
  /deep/ .el-pager{
    li.active{
      color: #07D79B;
    }
    li:hover{
      color: #07D79B;
    }
    li{
      font-size: 26px;
    }
  }
  /deep/ .btn-prev, /deep/ .btn-next{
    &:hover {
      color: #07D79B;
    }
    .el-icon-arrow-left, .el-icon-arrow-right{
      font-size: 26px;
    }
  }
}
</style>
