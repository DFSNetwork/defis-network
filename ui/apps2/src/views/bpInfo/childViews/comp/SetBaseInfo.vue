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
        <span>节点头像</span>
        <span class="red_p">*</span>
      </span>
      <span class="flexa">
        <van-field v-model="actorImg" placeholder="请输入节点头像地址" />
        <img class="right" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/itemRight.png" alt="">
      </span>
    </div>
    <div class="flexb">
      <span class="flexa">
        <span>节点名称</span>
        <span class="red_p">*</span>
      </span>
      <span class="flexa">
        <van-field v-model="name" placeholder="请输入节点名称" />
        <img class="right" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/itemRight.png" alt="">
      </span>
    </div>
    <div class="flexb">
      <span class="flexa">
        <span>节点口号</span>
        <!-- <span class="red_p">*</span> -->
      </span>
      <span class="flexa">
        <van-field v-model="slogen" placeholder="请输入节点口号" />
        <img class="right" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/itemRight.png" alt="">
      </span>
    </div>
    <div class="flexb">
      <span class="flexa">
        <span>成立时间</span>
        <!-- <span class="red_p">*</span> -->
      </span>
      <span class="flexa" @click="show = true">
        <van-field v-model="time" placeholder="请输入成立时间" />
        <img class="right" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/itemRight.png" alt="">
      </span>
      <van-calendar v-model="show" :min-date="minDate" :max-date="maxDate"
        @confirm="onConfirm" />
    </div>

    <div class="flexb">
      <span class="flexa">
        <span>官网地址</span>
        <span class="red_p">*</span>
      </span>
      <span class="flexa">
        <van-field v-model="web" placeholder="请输入官网地址" />
        <img class="right" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/itemRight.png" alt="">
      </span>
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
          v-model="desc1"
          rows="5"
          autosize
          type="textarea"
          placeholder="请简单描述节点信息"
        />
      </span>
      <div class="iptlen">{{sizeof1}}/256</div>
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
          v-model="desc2"
          rows="5"
          autosize
          type="textarea"
          placeholder="请简单描述节点信息"
        />
      </span>
      <div class="iptlen">{{sizeof2}}/256</div>
    </div>

    <div class="btn flexc" @click="handleSave">保存</div>
  </div>
</template>

<script>
export default {
  name: 'setBaseInfo',
  data() {
    return {
      account: '',
      actorImg: '',
      name: '',
      slogen: '',
      time: '',
      web: '',

      desc1: '',
      desc2: '',

      show: false,
      minDate: new Date(2017, 0, 1),
      maxDate: new Date(),
    }
  },
  computed: {
    sizeof1(){
      const str = this.desc1;
      return this.handleGetSize(str)
    },
    sizeof2(){
      const str = this.desc2;
      return this.handleGetSize(str)
    },
  },
  mounted() {
    this.account = this.$route.params.bpname;
  },
  methods: {
    formatDate(date) {
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    },
    onConfirm(date) {
      this.show = false;
      this.time = this.formatDate(date);
    },
    handleGetSize(str) {
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
    handleReg() {
      if (!this.actorImg.trim() || !this.account.trim() || !this.web.trim()) {
        this.$message.error('请完善基础信息');
        return false
      }
      return true
    },
    handleSave() {
      if (!this.handleReg()) {
        return
      }
      console.log(234)
    },
  }
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
