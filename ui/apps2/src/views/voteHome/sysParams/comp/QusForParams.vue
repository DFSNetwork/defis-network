<template>
  <div class="qus">
    <div class="qusTitle flexb">
      <span>{{ $t('sysParams.qusTitle') }}</span>
      <img @click="showRules = !showRules" class="tipIcon" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/tips_icon_btn.svg" alt="">
    </div>
    <!-- <div class="qusSubTitle">当前 30% DSS + 10%乐捐 + 60% LP挖矿。</div> -->
    <div class="options">
      <div class="item flexa" v-for="(v, i) in options" :key="i" @click="handleCheck(v.mid)"
        :class="{'active': check === v.mid}">
        <div class="checkDiv flexc">
          <img v-if="check === v.mid" class="checkedImg" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/checked.png" alt="">
        </div>
        <div class="main">
          <div class="">
            <span>{{ $t('sysParams.ans') }}: </span>
            <span class="dinBold">{{ v.fun }}%</span>
          </div>
          <div class="flexb">
            <div class="percent">
              <van-progress :show-pivot="false" :percentage="handleGetPercent(v.allVote)" color="#29D4B0"/>
            </div>
            <div class="voteNum dinReg">
              <span>{{ $t('sysParams.votes', {num: v.allVote}) }}</span>
              <span class="pNum">{{ handleGetPercent(v.allVote) }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="nullDiv"></div>
    <div class="btnDiv">
      <div v-loading="loading"
        class="btn flexc" @click="handleVote">{{ $t('sysParams.sure') }}</div>
    </div>

    <el-dialog
      class="mkListDia pcList"
      :show-close="false"
      :visible.sync="showRules">
      <ParamsTip/>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { EosModel } from '@/utils/eos';

import ParamsTip from '../dialog/ParamsTip'

export default {
  name: 'qusForParams',
  components: {
    ParamsTip,
  },
  data() {
    return {
      check: 1,
      options: [],
      totalNum: 0,
      isVote: false,
      showRules: false,
      loading: false,
    }
  },
  mounted() {
    this.handleGetOption()
  },
  computed: {
    ...mapState({
      // scatter: state => state.app.scatter,
      account: state => state.app.account,
    }),
  },
  watch: {
    account: {
      handler: function acc(newVal) {
        if (!newVal.name) {
          return
        }
        this.handleGetAccVote()
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    handleCheck(mid) {
      this.check = mid
    },
    // 获取当前投票详情
    async handleGetOption() {
      const params = {
        "code":"vote.tag",
        "scope": "vote.tag",
        "table":"pools2",
        "json":true,
        "limit": 1000,
      }
      const { status, result } = await this.$api.get_table_rows(params);
      if (!status) {
        return
      }
      const rows = result.rows || [];
      let totalNum = 0;
      rows.forEach(v => {
        const fun = v.mid;
        const lp = 80 - fun
        this.$set(v, 'dss', 20);
        this.$set(v, 'fun', fun);
        this.$set(v, 'lp', lp);
        const allVote = parseInt(v.total_votes / 10000)
        this.$set(v, 'allVote', allVote);
        totalNum = Number(totalNum) + Number(allVote)
      })
      rows.sort((a, b) => {
        return b.allVote - a.allVote
      })
      this.totalNum = totalNum;
      this.options = rows;
      let maxArr = JSON.parse(JSON.stringify(rows))
      maxArr.sort((a, b) => {
        return b.allVote - a.allVote
      })
      if (!this.isVote) {
        this.check = maxArr[0].mid
      }
    },
    // 获取百分比
    handleGetPercent(num) {
      const p = Number(num || 0) / Number(this.totalNum) * 100;
      return p.toFixed(2)
    },
    // 获取账户投票信息
    async handleGetAccVote() {
      const name = this.account.name;
      // const name = 'dfsdeveloper';
      const params = {
        "code":"vote.tag",
        "scope": "vote.tag",
        "table":"voters2",
        "json":true,
        "lower_bound": ` ${name}`,
        "upper_bound": ` ${name}`,
        "limit": 1000,
      }
      const { status, result } = await this.$api.get_table_rows(params);
      if (!status) {
        return
      }
      const rows = result.rows || [];
      if (!rows.length) {
        return
      }
      this.check = rows[0].last_vote;
      this.isVote = true;
    },
    // 投票
    handleVote() {
      if (!this.account.name || !this.check || this.loading) {
        return
      }
      this.loading = true;
      const actor = this.account.name;
      const permission = this.account.permissions;
      const params = {
        actions: [{
          account: 'vote.tag',
          name: 'vote2',
          authorization: [{
            actor, // 转账者
            permission,
          }],
          data: {
            voter: actor,
            option: this.check,
          }
        }],
      }
      EosModel.toTransaction(params, (res) => {
        this.loading = false;
        if(res.code && JSON.stringify(res.code) !== '{}') {
          this.$message({
            message: res.message,
            type: 'error'
          });
          return
        }
        this.$message({
          message: this.$t('public.success'),
          type: 'success'
        });
        setTimeout(() => {
          this.handleGetAccVote()
          this.handleGetOption()
        }, 3000);
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.qus{
  font-size: 32px;
  padding: 26px 32px;
  text-align: left;
  color: #333;
  .qusTitle{
    font-weight: 500;
    .tipIcon{
      width: 32px;
    }
  }
  .qusSubTitle{
    font-size: 28px;
    margin-top: 8px;
  }
  .options{
    .item{
      padding: 18px;
      border-radius: 12px;
      margin: 24px 0;
      border-radius: 8px;
      border: 1px solid rgba(220,220,220,.3);
      &.active{
        background: rgba(41, 212, 176, 0.08);
        border: 1px solid rgba(41, 212, 176, 0.08);
        .checkDiv{
          border: 0px solid rgba(220,220,220,.5);
        }
      }
      .checkDiv{
        width: 48px;
        height: 48px;
        box-sizing: border-box;
        border-radius: 50%;
        border: 1px solid rgba(220,220,220,.5);
        margin-right: 20px;
        .checkedImg{
          width: 48px;
          border: 0px;
        }
      }
      .main{
        flex: 1;
        font-size: 34px;
        .percent{
          width: 300px;
        }
        .voteNum{
          font-size: 24px;
        }
        .pNum{
          margin-left: 20px;
        }
      }
    }
  }
  .nullDiv{
    height: 110px;
  }
  .btnDiv{
    margin: auto;
    position: fixed;
    bottom: 0px;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 750px;
    box-sizing: border-box;
    padding: 10px 32px;
    background: #FFF;
    .btn{
      background: #29D4B0;
      color: #fff;
      border-radius: 50px;
      height: 96px;
      &.disabled{
        background: #EAEAEA;
        color: #999;
      }
    }
  }
}

.mkListDia{
  // animation: none;
  /deep/ .el-dialog{
    width: 650px;
    .el-dialog__body,
    .el-dialog__header{
      padding: 0;
      box-sizing: border-box;
    }
  }
  &.pcList{
    /deep/ .el-dialog{
      position: relative;
      border-radius: 12px;
    }
  }
}
</style>
