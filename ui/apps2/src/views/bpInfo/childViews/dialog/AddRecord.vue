<template>
  <div class="scoreDiv">
    <img class="close" @click="handleClose" src="https://cdn.jsdelivr.net/gh/defis-net/material/svg/sd_icon_btn.svg" alt="">
    <div class="title">{{$t('bpInfo.title')}}</div>
    <div class="content">
      <div class="addTitle flexb">
        <span>{{$t('bpInfo.title')}}</span>
        <span class="flexa">
          <van-field class="tleIpt" v-model="title" :placeholder="$t('bpInfo.titleTip')"/>
          <img class="right" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/itemRight.png" alt="">
        </span>
      </div>
      <div class="accMsg">
        <van-field
            class="input"
            v-model="content"
            rows="8"
            autosize
            type="textarea"
            :placeholder="$t('fundation.iptTip')"
          />
      </div>
    </div>
    <div class="btn flexc" @click="handleSave">{{ $t('public.confirm') }}</div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { EosModel } from '@/utils/eos';

export default {
  name: 'scoreAcc',
  data() {
    return {
      value: 0,
      content: '',
      title: '',
      bpname: '',
    }
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
  mounted() {
    this.bpname = this.$route.params.bpname;
  },
  methods: {
    handleClose() {
      this.$emit('listenClose', false)
    },
    handleSave() {
      if (!this.title.trim() || !this.content.trim()) {
        return
      }
      const formName = this.scatter.identity.accounts[0].name;
      const permission = this.scatter.identity.accounts[0].authority;
      let t = new Date().toISOString()
      t = t.split('.')[0];
      const params = {
        actions: [{
          account: 'dfscommunity',
          name: 'addstory',
          authorization: [{
            actor: formName, // 转账者
            permission,
          }],
          data: {
            editor: formName,
            producer: this.bpname,
            id: 100000, // 没有回答过 - 100000 ｜ 回答过 - 回答的那个aid
            lang: this.lang,
            title: this.title,
            content: this.content,
            time: t,
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
  .addTitle{
    font-size: 32px;
    border-bottom: 1px solid rgba(220, 220, 220, .3);
    .tleIpt{
      /deep/ .van-field__control{
        text-align: right;
      }
    }
    /deep/ .van-cell::after{
      border: 0;
    }
    .right{
      width: 12px;
    }
  }
  .accMsg{
    background: #F5F5F5;
    border-radius: 12px;
    padding: 22px;
    margin: 40px 0;
    .input{
      padding: 0;
      border: 0px;
      font-size: 30px;
      background: #F5F5F5;
      min-height: 350px;
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
}
</style>
