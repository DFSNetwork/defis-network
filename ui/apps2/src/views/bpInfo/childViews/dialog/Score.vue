<template>
  <div class="scoreDiv">
    <img class="close" @click="handleClose()"
      src="https://cdn.jsdelivr.net/gh/defis-net/material/svg/sd_icon_btn.svg" alt="">
    <div class="title">{{ $t('bpInfo.score') }}</div>
    <div class="content">
      <div>{{ $t('bpInfo.give') }}</div>
      <div class="payLike">
        <div class="flexb bal dinReg">
          <span @click="handlePercent(1)">{{ $t('public.balance') }}: {{ bal }}</span>
          <span class="flexa">
            <span>{{ $t('fundation.aboutFundation') }}：{{ about }} </span>
            <img class="love" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/newlike1.png" alt="">
          </span>
        </div>
        <div class="flexb infoDiv">
          <div class="coinDiv flexb">
            <img src="https://cdn.jsdelivr.net/gh/defis-net/material2/coin/tagtokenmain-tag.png">
            <div class="coin">
              <div class="coinName">TAG</div>
              <div class="contract tip">tagtokenmain</div>
            </div>
          </div>
          <div class="dinBold iptDiv">
            <el-input class="input" v-model="payNum" placeholder="0.0"></el-input>
          </div>
        </div>
        <!-- <van-field class="" placeholder="最小0.001"/> -->
        <div class="percent_p flexb">
          <span :class="{'act_p': act === 0}" @click="handlePercent(0)">0.01</span>
          <span :class="{'act_p': act === 0.25}" @click="handlePercent(0.25)">25%</span>
          <span :class="{'act_p': act === 0.5}" @click="handlePercent(0.5)">50%</span>
          <span :class="{'act_p': act === 0.75}" @click="handlePercent(0.75)">75%</span>
          <span :class="{'act_p': act === 1}" @click="handlePercent(1)">100%</span>
        </div>
      </div>

      <div>{{ $t('bpInfo.toScore') }}</div>
      <div class="score">
        <van-rate v-model="value" allow-half
          void-icon="star" void-color="#DBDBDB" color="#FFC300"/>
        <div class="type">
          <span v-if="value >= 4.5">{{ $t('bpInfo.starType1') }}</span>
          <span v-else-if="value >= 3">{{ $t('bpInfo.starType2') }}</span>
          <span v-else-if="value >= 2">{{ $t('bpInfo.starType3') }}</span>
          <span v-else-if="value >= 1 ">{{ $t('bpInfo.starType4') }}</span>
          <span v-else-if="value > 0">{{ $t('bpInfo.starType5') }}</span>
        </div>
      </div>
      <div>{{ $t('bpInfo.toEdtRpy') }}</div>
      <div class="accMsg">
        <van-field
            class="input"
            v-model="memo"
            rows="1"
            autosize
            type="textarea"
            :placeholder="$t('fundation.iptTip')"
          />
          <div class="iptlen">{{sizeof}}/256</div>
      </div>
    </div>

    <div class="btn flexc unClick" v-if="showErr">{{ errTip }}</div>
    <div class="btn flexc" v-else @click="handleToSubmit">{{ $t('public.confirm') }}</div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import {get_balance} from '@/utils/api'
// import {toFixed} from '@/utils/public'
import { EosModel } from '@/utils/eos';
export default {
  name: 'scoreAcc',
  data() {
    return {
      value: 0,
      memo: '',
      payNum: '',
      act: -1,
      bal: '100.00000000',
      errTip: '',
      bpname: '',
    }
  },
  mounted() {
    this.bpname = this.$route.params.bpname;
  },
  computed: {
    ...mapState({
      scatter: state => state.app.scatter,
      baseConfig: state => state.sys.baseConfig,
    }),
    sizeof(){
      const str = this.memo;
      let total = 0,
          charCode,
          i,
          len;
      for(i = 0, len = str.length; i < len; i++){
        charCode = str.charCodeAt(i);
        if(charCode <= 0x007f) {
            total += 1;
        }else if(charCode <= 0x07ff){
            total += 2;
        }else if(charCode <= 0xffff){
            total += 3;
        }else{
            total += 4;
        }
      }
      return total;
    },
    about() {
      const n = parseFloat(this.payNum || 0) * 1000
      return parseInt(n)
    },
    showErr() {
      if (Number(this.payNum) < 0.001) {
        this.errTip = this.$t('fundation.minNum', {num: '0.001 TAG'}); // eslint-disable-line
        return true;
      }
      if (Number(this.payNum) > parseFloat(this.bal)) {
        this.errTip = this.$t('more.lowBal', {sym: 'TAG'}); // eslint-disable-line
        return true;
      }
      if (!this.value) {
        this.errTip = '请给个评分'; // eslint-disable-line
        return true;
      }
      return false
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
    handleClose(type) {
      this.$emit('listenClose', type)
    },
    handlePercent(num) {
      this.act = num;
      if (!num) {
        this.payNum = '0.001';
        return
      }
      const payNum = parseFloat(this.bal) * num;
      this.payNum = payNum.toFixed(8)
    },
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
    handleToSubmit() {
      if (this.showErr) {
        return
      }
      if (!this.scatter || !this.scatter.identity) {
        return
      }
      const formName = this.scatter.identity.accounts[0].name;
      const permission = this.scatter.identity.accounts[0].authority;
      const memo = this.memo.trim();
      const quantity = `${Number(this.payNum).toFixed(8)} TAG`;
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
          memo,
          quantity,
        }
      }
      const target0 = (this.value * 2).toFixed(0);
      const like = {
        account: 'dfscommunity',
        name: 'submit',
        authorization: [{
          actor: formName, // 转账者
          permission,
        }],
        data: {
          user: formName,
          author: this.bpname,
          target0,
          target1: 0,
          memo,
          code: 'tagtokenmain',
          quantity,
          type: 'star'
        },
      }
      const params = {
        actions: [like, transfer],
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
  }
}
</script>

<style lang="scss" scoped>
.scoreDiv{
  position: relative;
  padding: 28px;
  color: #333;
  font-size: 28px;
  text-align: left;
  .close{
    position: absolute;
    top: 20px;
    right: 20px;
    width: 26px;
  }
  .title{
    font-size: 32px;
    font-weight: 500;
    margin-bottom: 15px;
    text-align: center;
  }
  .score{
    margin: 15px 0;
    text-align: center;
    .type{
      margin-top: 15px;
      color: #FFBE00;
    }
    /deep/ .van-rate__icon{
      font-size: 60px;
      margin-right: 30px;
    }
  }
  .payLike{
    margin: 15px 0 30px;
    .bal{
      font-size: 22px;
      .love{
        width: 32px;
        margin-left: 8px;
      }
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
  }
  .accMsg{
    background: #F5F5F5;
    border-radius: 12px;
    padding: 22px;
    margin: 15px 0;
    .input{
      padding: 0;
      border: 0px;
      font-size: 30px;
      background: #F5F5F5;
    }
    .iptlen{
      text-align: right;
      font-size: 24px;
      color: #666;
      right: 0px;
      bottom: 5px;
    }
  }
}
.btn{
  margin: 40px 0 10px;
  height: 88px;
  // background:rgba(7,215,155,1);
  background: #29D4B0;
  border-radius: 48px;
  color: #fff;
  font-size: 32px;
  font-weight: 500;
  &:active{
    background:rgba(2,198,152,1);
  }
  &.unClick{
    background: #EAEAEA;
    color: #999;
  }
}
</style>
