<template>
  <div class="create">
    <div class="title flexb">
      <span class="back flexa" @click="$router.back()">
        <img src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/back.png" alt="">
      </span>
      <span>{{ $t('invite.create') }}</span>
      <span class="back"></span>
    </div>
    <CreateTop />

    <div class="farm">
      <div class="infoImg flexc">
        <img v-if="language === 'zh-CN'"
          src="https://cdn.jsdelivr.net/gh/defis-net/material2/dfs/createTitleBg.png">
        <img v-else
          src="https://cdn.jsdelivr.net/gh/defis-net/material2/dfs/createTitleBg-en.png">
        <span>{{ $t('invite.farmInfo') }}</span>
      </div>

      <!-- 头像 -->
      <div class="header" @click="handleShowImgCheck('head')">
        <img class="hdImg" :src="avatar">
        <div class="upload tip">{{ $t('invite.setHead') }}</div>
      </div>
      <!-- 农场名 -->
      <div class="item">
        <div class="name">{{ $t('invite.farmName') }}</div>
        <van-field class="ipt" v-model="nick" :placeholder="$t('invite.farmNameIpt')" />
      </div>
      <div class="item">
        <div class="name">Slogon</div>
        <van-field class="ipt" v-model="slogon" :placeholder="$t('invite.slogonIpt')" />
      </div>
      <div class="item">
        <div class="name">QQ</div>
        <van-field class="ipt" v-model="qq" :placeholder="$t('invite.qqIpt')" />
      </div>
      <div class="item">
        <div class="name">{{ $t('invite.wx') }}</div>
        <van-field class="ipt" v-model="wx" :placeholder="$t('invite.wxIpt')" />
      </div>
      <div class="item">
        <div class="name">Telegram</div>
        <van-field class="ipt" v-model="tg" :placeholder="$t('invite.tgIpt')" />
      </div>
      <div class="item noBorder">
        <div class="name">{{ $t('invite.bg') }}</div>
        <div class="addImg flexc" @click="handleShowImgCheck('bg')" v-if="!cover">
          <div>
            <img class="add" src="https://cdn.jsdelivr.net/gh/defis-net/material2/dfs/create.png">
            <div>{{ $t('invite.setBg') }}</div>
          </div>
        </div>
        <div class="hasImg flexc" @click="handleShowImgCheck('bg')" v-else>
          <img class="bgImg" :src="cover">
        </div>
      </div>
      <div class="item">
        <div class="name">{{ $t('invite.farmDesc') }}</div>
        <van-field class="ipt txt" v-model="desc"
          rows="1"
          autosize
          type="textarea"
          :placeholder="$t('invite.farmDescIpt')" />
      </div>

      <div class="btn flexc" @click="handleCreate">{{ $t('invite.create') }}</div>
    </div>


    <van-popup class="popup_p"
      v-model="showCheckImg">
      <ImgCheck v-if="showCheckImg" :showType="type" @listenSure="handleSure"/>
    </van-popup>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { DApp } from '@/utils/wallet';
import CreateTop from '../comp/CreateTop'
import ImgCheck from '@/views/my/dialog/ImgCheck'
export default {
  name: 'create',
  components: {
    CreateTop,
    ImgCheck,
  },
  data() {
    return {
      value: '',
      showCheckImg: false,
      type: '', // head | bg

      // 表单参数
      cover: '', // 背景
      avatar: 'https://cdn.jsdelivr.net/gh/defis-net/material2/coin/eosio.token-eos.svg', // 头像 
      nick: '', // 昵称
      slogon: '', // 口号
      desc: '', // 简介
      qq: '',
      wx: '',
      tg: '',
    }
  },
  computed: {
    ...mapState({
      account: (state) => state.app.account,
      language: (state) => state.app.language,
    }),
  },
  methods: {
    handleShowImgCheck(type) {
      this.type = type;
      this.showCheckImg = true;
    },
    handleSure(src) {
      this.showCheckImg = false;
      if (this.type === 'bg') {
        this.cover = src;
        return
      }
      this.avatar = src;
    },
    handleReg() {
      if (!this.qq.length && !this.wx.length && !this.tg.length) {
        this.$toast.fail(this.$t('invite.errTip4'))
        return false
      }
      if (!this.nick.trim()) {
        this.$toast.fail(this.$t('invite.farmNameIpt'))
        return false;
      }
      return true
    },
    handleCreate() {
      if (!this.handleReg()) {
        return
      }
      const name = this.account.name;
      const permission = this.account.permissions;
      
      const params = {
        actions: [{
          account: 'farms.tag',
          name: 'regfarm',
          authorization: [{
            actor: name, // 转账者
            permission,
          }],
          data: {
            user: name,
            farm_name: this.nick,
            slogon: this.slogon,
            desc: this.desc,
            avatar: this.avatar,
            bg: this.cover,
            wx: this.wx,
            qq: this.qq,
            tg: this.tg,
          }
        }]
      }
      DApp.toTransaction(params, (err) => {
        if (err && err.code === 402) {
          return;
        }
        if (err) {
          this.$toast({
            type: 'fail',
            message: err.message,
          })
          return;
        }
        this.$toast({
          type: 'success',
          message: 'Success'
        })
        setTimeout(() => {
          this.$router.replace({
            name: 'farmDetail',
            params: {name}
          })
        }, 1000);
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.create{
  background: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 50px;
  .title{
    background: #FFF;
    font-size: 36px;
    height: 100px;
    padding: 0 28px;
    font-weight: 500;
    .back{
      width: 50px;
      height: 50px;
      img{
        display: block;
        width: 18px;
      }
    }
  }
  .farm{
    background: #FFF;
    border-radius: 16px;
    padding: 0 30px 30px;
    margin: 28px;
    text-align: left;
    font-size: 28px;
    .infoImg{
      margin: auto;
      margin-bottom: 30px;
      position: relative;
      color: #FFF;
      height: 64px;
      img{
        position: absolute;
        height: 100%;
        left: 50%;
        top: 0;
        transform: translateX(-50%);
      }
      span{
        position: relative;
      }
    }
    .header{
      text-align: center;
      .hdImg{
        width: 120px;
        height: 120px;
        border-radius: 60px;
        margin-bottom: 16px;
      }
    }
    .ipt{
      padding: 10px 0;
    }
    .item{
      padding-top: 20px;
      border-bottom: 1px solid #eaeaea;
    }
    .addImg{
      color: $color-tip;
      font-size: 28px;
      text-align: center;
      border: 1px dashed #ccc;
      height: 200px;
      width: 180px;
      border-radius: 4px;
      margin: 20px 0;
      .add{
        width: 40px;
      }
    }
    .hasImg{
      height: 200px;
      width: 180px;
      .bgImg{
        width: 100%;
      }
    }
    .btn{
      height: 96px;
      background: $color-main;
      border-radius: 8px;
      color: 32px;
      color: #fff;
      margin: 30px 0 10px;
    }
  }
}

.popup_p{
   width: 700px;
}
</style>
