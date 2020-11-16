<template>
  <div class="like">
    <img class="close" @click="handleClose(false)" src="https://cdn.jsdelivr.net/gh/defis-net/material/svg/sd_icon_btn.svg" alt="">
    <div class="title">乐捐送爱心</div>
    <div class="flexb bal dinReg">
      <span>余额: {{ bal }}</span>
      <span>预计捐献：{{ about }} 颗</span>
    </div>
    <div class="flexb infoDiv">
      <div class="coinDiv flexb">
        <img src="https://cdn.jsdelivr.net/gh/defis-net/material/coin/tagtokenmain-tag.png">
        <div class="coin">
          <div class="coinName">TAG</div>
          <div class="contract tip">tagtokenmain</div>
        </div>
      </div>
      <div class="dinBold iptDiv">
        <el-input class="input" v-model="num" placeholder="0.0"></el-input>
      </div>
    </div>
    <div class="percent flexb">
      <div class="pItem" :class="{'act': act === 0}" @click="handlePercent(0)">
        <div>
          <div class="pNum dinBold">0.01</div>
          <div class="tip">小爱</div>
        </div>
      </div>
      <div class="pItem" :class="{'act': act == 0.25}" @click="handlePercent(0.25)">
        <div>
          <div class="pNum dinBold">25%</div>
          <div class="tip">中爱</div>
        </div>
      </div>
      <div class="pItem" :class="{'act': act == 0.5}" @click="handlePercent(0.5)">
        <div>
          <div class="pNum dinBold">50%</div>
          <div class="tip">大爱</div>
        </div>
      </div>
    </div>

    <div class="percent flexb">
      <div class="pItem" :class="{'act': act == 0.75}" @click="handlePercent(0.75)">
        <div>
          <div class="pNum dinBold">75%</div>
          <div class="tip">超爱</div>
        </div>
      </div>
      <div class="pItem" :class="{'act': act == 1}" @click="handlePercent(1)">
        <div>
          <div class="pNum dinBold">100%</div>
          <div class="tip">爱了爱了</div>
        </div>
      </div>
      <div></div>
    </div>
    <div class="mainTip">*乐捐的TAG将进入乐捐系统</div>
    <div class="btn flexc" @click="handleToLink">立即捐爱心</div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { EosModel } from '@/utils/eos';
import {get_balance} from '@/utils/api'

export default {
  name: 'like',
  props: {
    reply: { // 主楼
      type: Object,
      default: function rp() {
        return {}
      },
    },
  },
  data() {
    return {
      num: '',
      act: '',
      bal: '0.0000',
    }
  },
  computed: {
    ...mapState({
      scatter: state => state.app.scatter,
      baseConfig: state => state.sys.baseConfig,
    }),
    about() {
      const n = parseFloat(this.num || 0) * 1000
      return parseInt(n)
    }
  },
  watch: {
    scatter: {
      handler: function listen(newVal) {
        if (newVal.identity) {
          // 用户数据获取
          this.handleGetBal()
        }
      },
      deep: true,
      immediate: true,
    }
  },
  methods: {
    async handleGetBal() {
      const formName = this.scatter.identity.accounts[0].name;
      const params = {
        code: 'tagtokenmain',
        symbol: 'TAG',
        decimal: 8,
        account: formName,
      }
      const {status, result} = await get_balance(params);
      if (!status) {
        return
      }
      this.bal = result;
    },
    handlePercent(rate) {
      this.act = rate
      if (!rate) {
        this.num = '0.01';
        return
      }
      const num = parseFloat(this.bal) * rate;
      this.num = num.toFixed(8)
    },
    handleToLink() {
      // if (Number(this.num) < 0.001) {
      //   this.$message.error('最少 0.001 TAG')
      //   return
      // }
      // if (Number(this.num) > parseFloat(this.bal)) {
      //   this.$message.error('余额不足')
      //   return
      // }
      // if (!this.scatter || !this.scatter.identity) {
      //   return
      // }
      const formName = this.scatter.identity.accounts[0].name;
      const permission = this.scatter.identity.accounts[0].authority;

      const transfer = {
        account: 'tagtokenmain',
        name: 'transfer',
        authorization: [{
          actor: formName, // 转账者
          permission,
        }],
        data: {
          from: formName,
          to: 'dfsfundation',
          memo: `${formName}`,
          quantity: `${Number(this.num).toFixed(8)} TAG`
        }
      }
      const like = {
        account: 'dfscommunity',
        name: 'like',
        authorization: [{
          actor: formName, // 转账者
          permission,
        }],
        data: {
          author: 'judy.dfs',
          user: formName,
          target: this.reply.global_action_seq || 0,
        },
      }
      const params = {
        actions: [transfer, like],
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
        this.handleClose('likeSuccess')
      })
    },
    handleClose(type) {
      this.$emit('listenClose', type)
    }
  }
}
</script>

<style lang="scss" scoped>
.like{
  font-size: 24px;
  position: relative;
  padding: 26px;
  color: #333;
  .close{
    position: absolute;
    top: 26px;
    right: 26px;
    width: 24px;
  }
  .title{
    font-size: 40px;
    font-weight: 500;
    text-align: center;
    margin-bottom: 30px;
  }
  .bal{
    font-size: 22px;
  }
  .infoDiv{
    padding: 18px 0;
  }
  .coinDiv{
    text-align: left;
    img{
      width: 60px;
      height: 60px;
      border-radius: 50%;
      margin-right: 10px;
    }
    .coinName{
      font-size: 28px;
    }
    .contract{
      font-size: 22px;
    }
  }
  .iptDiv{
    flex: 1;
    .input{
      /deep/ .el-input__inner{
        width: 100%;
        color: $color-black;
        border: 0px;
        text-align: right;
        font-size: 52px;
        padding: 0 0 0 20px;
        height: 62px;
      }
    }
  }
  .percent{
    margin: 13px 0 26px;
    .pItem{
      border: 1px solid rgba(220,220,220, .3);
      border-radius: 6px;

      &.act{
        color: #FE3B37;
        border: 1px solid rgba(#FE3B37, .8);
        background: rgba(#FE3B37, .18);
        .tip{
          color: #FE3B37 !important;
        }
      }
    }
    &>div{
      display: flex;
      align-items: center;
      justify-content: center;
      height: 140px;
      margin-right: 26px;
      flex: 1;
      font-size: 24px;
      &:last-child{
        margin-right: 0;
      }
      .pNum{
        font-size: 36px;
        margin-bottom: 4px;
      }
    }
  }
  .mainTip{
    color: #29D4B0;
    font-size: 24px;
    margin: 28px 0;
    text-align: left;
  }
  .btn{
    border-radius: 50px;
    height: 90px;
    background: #29D4B0;
    color: #fff;
    font-size: 32px;
  }
}
</style>
