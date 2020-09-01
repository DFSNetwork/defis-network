<template>
  <div class="poolsLists">
    <div class="title flexb">
      <span class="act">{{ $t('dsr.dfsHolders') }}</span>
      <span class="totalMiners">{{ $t('dsr.total') }}：{{ allMinersList.length }}</span>
    </div>
    <div class="noData" v-loading="!getMinersList" v-if="!minersArr.length">{{ $t('public.noData') }}</div>
    <template v-for="(item, index) in minersArr">
      <div class="list" :key="index">
        <div class="flexb mb10">
          <span>{{ item.holder }}</span>
          <span class="flexc">
            <span>{{ $t('mine.earnings') }}：{{ item.showReward || '0.00000000' }} DFS</span>
            <span class="addition flexa" v-if="Number(item.buff)">
              <img class="buffImg" src="@/assets/img/poolspage/buff2.svg">
              <span>{{ item.buff }}%</span>
            </span>
          </span>
        </div>
        <div class="flexb mb10">
          <span>存款时间</span>
          <span>{{ item.inTime }}</span>
        </div>
        <div class="flexb">
          <span>{{ $t('dex.pools') }}</span>
          <span>{{ item.bal }}</span>
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
import moment from 'moment';
import { EosModel } from '@/utils/eos';
import { toFixed, accAdd, accMul, toLocalTime } from '@/utils/public';
import Mock from 'mockjs';
export default {
  name: 'dsrMinerList',
  data() {
    return {
      getMinersList: true,
      minersArr: [],
      allMinersList: [],
      pageSize: 10,
      page: 1,
      timerArr: [],
      args: '0',
      mock: null,
    }
  },
  computed: {
    ...mapState({
      dsrPools: state => state.sys.dsrPools,
    }),
  },
  mounted() {
    // this.handlMock();
    this.handleGetList()
    this.handleGetArgs()
  },
  methods: {
    handlMock() {
      this.mock = Mock.mock({
        // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
        'allMinersList|0-50': [{
          'lastTime|1598222381000-1598223381000': 1598223381000,
          last_drip: "2020-08-23T22:56:21",
          'liq': '@float(100, 10000)',
          'liq_bal0': '@float(100, 10000)' + ` EOS`,
          'liq_bal1': '@float(200, 30000)' + ` DFS`,
          'miner': '@string("lower", 12)',
        }]
      })
      this.allMinersList = this.mock.allMinersList
      this.handleGetPageArr();
      // 输出结果
      // console.log(this.mock)
    },
    handleGetArgs() {
      const params = {
        "code": "dfsdsrsystem",
        "scope": "dfsdsrsystem",
        "table": "args",
        "json": true,
      }
      EosModel.getTableRows(params, (res) => {
        if (!res.rows.length) {
          return
        }
        this.args = res.rows[0];
        this.handleRunReward()
        console.log(this.args)
      })
    },
    handleGetList() {
      const params = {
        "code": "dfsdsrsystem",
        "scope": "dfsdsrsystem",
        "table": "holders",
        "index_position": 2,
        "key_type": "i64",
        // "lower_bound": ` ${this.inviAcc}`,
        // "upper_bound": ` ${this.inviAcc}`,
        "json": true,
      }
      EosModel.getTableRows(params, (res) => {
        this.loading = false;
        if (!res.rows.length) {
          this.allMinersList = []
          return
        }
        const allList = res.rows;
        const buff = [0, 0.05, 0.1, 0.2, 0.5]
        allList.forEach((v) => {
          let accApr = accMul(5, buff[Number(v.pool)]);
          this.$set(v, 'buff', accApr);
          accApr = accAdd(5, accApr);
          this.$set(v, 'accApr', accApr);
          const inTime = toLocalTime(`${v.last_drip}.000+0000`)
          this.$set(v, 'inTime', inTime);
        })
        this.allMinersList = allList.reverse();
        this.handleGetPageArr();
        console.log(allList)
      })
    },
    handleCurrentChange() {
      this.handleGetPageArr();
    },
    handleGetPageArr() {
      const start = (this.page - 1) * this.pageSize;
      const end = this.page * this.pageSize;
      this.minersArr = this.allMinersList.slice(start, end);
      this.handleRunReward()
    },
    // 秒级定时器
    handleRunReward() {
      clearInterval(this.secTimer)
      if (!this.minersArr.length || !Number(this.args.aprs) || !this.dsrPools.length) {
        return
      }
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
        if (!parseFloat(v.bal)) {
          this.timerArr[index] = null;
          return
        }
        // v.ableRedeemDate = toLocalTime(`${v.rex_maturity}.000+0000`);
        //   const redeemTime = moment(v.ableRedeemDate).valueOf(); // 解锁时间
        //   const nowTime = moment().valueOf(); // 当前时间
        let userTime = toLocalTime(`${v.last_drip}.000+0000`)
        userTime = moment(userTime).valueOf();
        const nowTime = moment().valueOf(); // 当前时间
        const t = (nowTime - userTime) / 1000;
        let reward = parseFloat(v.bal) * Math.pow(this.args.aprs, t) - parseFloat(v.bal)
        if (v.pool) {
          const pool = this.dsrPools.find(vv => vv.id === v.pool)
          reward = reward * pool.bonus;
        }
        this.$set(v, 'reward', reward)
        this.$set(v, 'showReward', toFixed(reward, 8))
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
    .addition{
      font-size: 24px;
      color: #E9574F;
      line-height: 40px;
      margin-left: 10px;
    }
    .buffImg{
      width: 20px;
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
