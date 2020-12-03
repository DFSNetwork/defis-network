<template>
  <div class="baseInfo">
    <div class="flexb">
      <span class="flexa">
        <span>节点账号</span>
        <span class="red_p">*</span>
      </span>
      <span class="flexa">
        <van-field v-model="account" disabled placeholder="请输入节点头像地址" />
        <img class="right" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/itemRight.png" alt="">
      </span>
    </div>
    <div class="flexb">
      <span class="flexa">
        <span>节点名称</span>
        <span class="red_p">*</span>
      </span>
      <span class="flexa">
        <van-field v-model="bpName" placeholder="请输入节点名称" />
        <img class="right" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/itemRight.png" alt="">
      </span>
    </div>
    <div class="flexb">
      <span class="flexa">
        <span>节点口号</span>
        <!-- <span class="red_p">*</span> -->
      </span>
      <span class="flexa">
        <van-field v-model="slogon" placeholder="请输入节点口号" />
        <img class="right" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/itemRight.png" alt="">
      </span>
    </div>
    <div class="flexb">
      <span class="flexa">
        <span>成立时间</span>
        <span class="red_p">*</span>
      </span>
      <span class="flexa" @click="show = true">
        <van-field v-model="time" placeholder="请输入成立时间" />
        <img class="right" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/itemRight.png" alt="">
      </span>
      <van-calendar v-model="show" :min-date="minDate" :max-date="maxDate"
        color="#29D4B0"
        @confirm="onConfirm" />
    </div>

    <div class="flexa">
      <span class="flexa">
        <span>节点简介 - 中文</span>
      </span>
    </div>
    <div class="textareaDiv">
      <span class="flexa">
        <van-field
          class="textarea"
          v-model="desc0"
          rows="3"
          autosize
          type="textarea"
          placeholder="请简单描述节点信息"
        />
      </span>
      <!-- <div class="iptlen">{{sizeof1}}/256</div> -->
    </div>

    <div class="flexa">
      <span class="flexa">
        <span>节点简介 - 英文</span>
      </span>
    </div>
    <div class="textareaDiv">
      <span class="flexa">
        <van-field
          class="textarea"
          v-model="desc1"
          rows="3"
          autosize
          type="textarea"
          placeholder="请简单描述节点信息"
        />
      </span>
      <!-- <div class="iptlen">{{sizeof2}}/256</div> -->
    </div>

    <div class="btn flexc" @click="handleSave">保存</div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { EosModel } from '@/utils/eos';
import {get_table_rows} from '@/utils/api'
import {toLocalTime} from '@/utils/public';

export default {
  name: 'setBaseInfo',
  data() {
    return {
      account: '',
      bpName: '',
      slogon: '',
      time: '',

      desc0: '',
      desc1: '',

      show: false,
      minDate: new Date(2017, 0, 1),
      maxDate: new Date(),
    }
  },
  computed: {
    ...mapState({
      scatter: state => state.app.scatter,
    }),
  },
  mounted() {
    this.account = this.$route.params.bpname;
    this.handleGetBaseInfo()
  },
  methods: {
    async handleGetBaseInfo() {
      const params = {
        "code":"dfscommunity",
        "scope":"dfscommunity",
        "table":"producers",
        "lower_bound": ` ${this.account}`,
        "upper_bound": ` ${this.account}`,
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
      this.time = toLocalTime(row.create_time).substring(0, 10);
      this.bpName = row.candidate_name;
      this.desc0 = row.desc0;
      this.desc1 = row.desc1;
      this.slogon = row.slogon;
    },
    formatDate(date) {
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    },
    onConfirm(date) {
      this.show = false;
      this.time = this.formatDate(date);
    },
    handleReg() {
      if (!this.account.trim() || !this.account.trim()
       || !this.time.trim()) {
        this.$message.error('请完善基础信息');
        return false
      }
      return true
    },
    handleSave() {
      if (!this.handleReg()) {
        return
      }
      const formName = this.scatter.identity.accounts[0].name;
      const permission = this.scatter.identity.accounts[0].authority;
      let t = new Date().toISOString()
      t = t.split('.')[0];

      const params = {
        actions: [{
          account: 'dfscommunity',
          name: 'setprod',
          authorization: [{
            actor: formName, // 转账者
            permission,
          }],
          data: {
            editor: formName,
            producer: this.account,
            candidate_name: this.bpName,
            logo: '',
            slogon: this.slogon,
            create_time: t,
            desc0: this.desc0,
            desc1: this.desc1
          }
        }]
      }
      EosModel.toTransaction(params, (res) => {
        this.loadingJoin = false;
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
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.baseInfo{
  margin: 10px 28px;
  color: #333;
  font-size: 32px;
  &>div{
    height: 100px;
    border-bottom: 1px solid rgba(220,220,220,.3);
    &:last-child{
      border: 0px;
    }
  }

  /deep/ .van-cell{
    .van-field__control{
      text-align: right;
      font-size: 32px;
    }
    &::after{
      border: 0;
    }
  }
  .textareaDiv{
    height: auto;
    background: #F5F5F5;
    padding: 18px;
    border-radius: 12px;
  }
  .textarea{
    text-align: left;
    padding: 0;
    border: 0px;
    font-size: 30px;
    background: #F5F5F5;
    /deep/ .van-field__control{
      text-align: left;
      font-size: 32px;
    }
  }
  .iptlen{
    text-align: right;
    font-size: 28px;
    color: #999;
    right: 0px;
    bottom: 5px;
  }
  .right{
    width: 12px;
  }
  .btn{
    margin: 30px 0;
    background: #29D4B0;
    color: #FFF;
    font-weight: 500;
    border-radius: 45px;
    height: 90px;
  }
}
</style>
