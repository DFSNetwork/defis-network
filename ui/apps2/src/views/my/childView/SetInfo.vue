<template>
  <div class="setInfo">
    <div class="title flexb">
      <span class="back flexa" @click="$router.back()">
        <img src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/back.png" alt="">
      </span>
      <span>修改资料</span>
      <span class="back"></span>
    </div>

    <!-- 主要编辑内容 -->
    <div class="mainView">
      <div class="headImgItem" @click="handleShowImgCheck('head')">
        <img class="headImg" :src="avatar || 'https://cdn.jsdelivr.net/gh/defis-net/material2/coin/eosio.token-eos.svg'">
        <div class="checkBtn">
          <span class="checkHead">选择头像</span>
        </div>
      </div>
      <van-form>
        <div class="flexb item">
          <van-field
            v-model="nick"
            name="用户名"
            label="用户名"
            placeholder="用户名"
          />
          <img class="rightIcon" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/itemRight.png" alt="">
        </div>
        <div class="flexb item account">
          <van-field
            v-model="acc"
            disabled
            name="EOS账号"
            label="EOS账号"
          />
        </div>
        <div class="flexb item">
          <van-field
            readonly
            clickable
            :value="sex"
            name="picker"
            label="性别"
            placeholder="性别"
            @click="showPicker = true"
          />
          <img class="rightIcon" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/itemRight.png" alt="">
        </div>
        <div class="flexb item">
          <van-field
            v-model="desc"
            name="简介"
            label="简介"
            placeholder="简介"
          />
          <img class="rightIcon" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/itemRight.png" alt="">
        </div>
        <div class="flexb item bgItem" @click="handleShowImgCheck('bg')">
          <div class="flexb">
            <span>背景图</span>
            <img class="bgImg" :src="cover || 'https://cdn.jsdelivr.net/gh/defis-net/material/accBanner/banner0.png'" alt="">
          </div>
          <img class="rightIcon" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/itemRight.png" alt="">
        </div>

        <div class="btnDiv">
          <div class="btn flexc" @click="handleSave">保存</div>
        </div>
      </van-form>
    </div>

    <van-popup v-model="showPicker" position="bottom">
      <van-picker
        show-toolbar
        :columns="columns"
        @confirm="onConfirm"
        @cancel="showPicker = false"
      />
    </van-popup>

    <el-dialog
      class="mydialog"
      :visible.sync="showCheckImg">
      <ImgCheck v-if="showCheckImg" :showType="type" @listenSure="handleSure"/>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { EosModel } from '@/utils/eos';

import { get_acc_info } from '@/utils/api';
import ImgCheck from '../dialog/ImgCheck'

export default {
  name: 'setInfo',
  components: {
    ImgCheck,
  },
  data() {
    return {
      avatar: '', // 头像
      nick: '', // 昵称
      acc: '', // 账号
      sex: '保密', // 性别
      desc: '', // 简介
      cover: '', // 背景

      columns: ['保密', '男', '女'],
      showPicker: false,
      showCheckImg: false,
      type: '',
    }
  },
  mounted() {
  },
  computed: {
    ...mapState({
      scatter: state => state.app.scatter,
      accInfo: state => state.app.accInfo,
    }),
  },
  watch: {
    scatter: {
      handler: function sc (newVal) {
        if (newVal.identity) {
          this.acc = newVal.identity.accounts[0].name;
        }
      },
      deep: true,
      immediate: true
    },
    accInfo: {
      handler: function sc (newVal) {
        this.avatar = newVal.avatar
        this.cover = newVal.cover;
        this.desc = newVal.desc;
        this.nick = newVal.nick;
        if (newVal.sex === 1) {
          this.sex = '男'
        } else if (newVal.sex === 0) {
          this.sex = '女'
        } else {
          this.sex = '保密'
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    handleShowImgCheck(type) {
      this.type = type;
      this.showCheckImg = true;
    },
    onConfirm(value) {
      this.sex = value;
      this.showPicker = false;
    },
    handleSure(src) {
      this.showCheckImg = false;
      if (this.type === 'bg') {
        this.cover = src;
        return
      }
      this.avatar = src;
    },
    // 保存
    handleSave() {
      const formName = this.scatter.identity.accounts[0].name;
      const permission = this.scatter.identity.accounts[0].authority;
      let sex = 2;
      if (this.sex === '男') {
        sex = 1
      } else if (this.sex === '女') {
        sex = 0
      }
      const params = {
        actions: [{
          account: 'dfscommunity',
          name: 'setprofiles',
          authorization: [{
            actor: formName, // 转账者
            permission,
          }],
          data: {
            user: formName,
            nick: this.nick,
            desc: this.desc,
            avatar: this.avatar,
            cover: this.cover,
            sex,
          }
        }]
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
        get_acc_info(this.acc)
        this.$router.replace({
          name: 'myCenter',
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.setInfo{
  font-size: 32px;
  color: #333;
  .title{
    font-size: 36px;
    height: 70px;
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
  .mainView{
    padding: 28px;
    .headImgItem{
      text-align: center;
      margin-bottom: 20px;
      .headImg{
        width: 204px;
        height: 204px;
        overflow: hidden;
        border-radius: 50%;
      }
      .checkBtn{
        margin-top: -20px;
      }
      .checkHead{
        background: #29D4B0;
        font-size: 26px;
        color: #fff;
        padding: 8px 30px;
        border-radius: 26px;
      }
    }
    .rightIcon{
      width: 10px;
      margin-left: 20px;
    }
    .item{
      color: #666;
      height: 100px;
      border-bottom: 1px solid rgba(#ebedf0, .4);
      &.bgItem{
        height: 178px;
        &>div{
          flex: 1;
        }
        .bgImg{
          width: 188px;
          height: 100px;
        }
      }
    }
    .btn{
      height: 90px;
      background: #29D4B0;
      border-radius: 50px;
      font-size: 32px;
      color: #FFF;
      margin-top: 72px;
      font-weight: 500;
    }
    /deep/ .van-field--disabled{
      .van-field__label{
        color: #666;
      }
      .van-field__control{
        color: #999;
      }
    }
    /deep/ .van-cell{
      height: 100%;
      font-size: 28px;
      padding-left: 0;
      padding-right: 0;
      padding: 0;
      display: flex;
      align-items: center;
      &::after{
        display: none;
      }
    }
    /deep/ .van-field__control{
      text-align: right;
    }
  }
}
.mydialog{
  /deep/ .el-dialog{
    width: 700px;
  }
}
</style>
