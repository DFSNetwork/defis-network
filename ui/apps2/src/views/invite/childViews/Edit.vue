<template>
  <div class="farmEdit">
    <div class="title flexb">
      <span class="back flexa" @click="$router.back()">
        <img src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/back.png" alt="">
      </span>
      <span>{{ $t('invite.editFarm') }}</span>
      <span class="back"></span>
    </div>

    <div class="headDiv" @click="handleShowImgCheck('head')">
      <img class="headImg" :src="avatar || 'https://cdn.jsdelivr.net/gh/defis-net/material2/coin/eosio.token-eos.svg'">
      <div class="setHead flexc">{{ $t('invite.setHead') }}</div>
    </div>
    <div class="item flexb">
      <van-field
        class="ipt flexa"
        v-model="nick"
        :label="$t('invite.farmName')"
        :placeholder="$t('invite.farmNameIpt')"
        input-align="right"
      />
      <img class="rightIcon" src="https://cdn.jsdelivr.net/gh/defis-net/material2/icon/toRight-999.png">
    </div>
    <div class="item flexb">
      <van-field
        class="ipt flexa"
        v-model="slogon"
        label="Slogon"
        :placeholder="$t('invite.slogonIpt')"
        input-align="right"
      />
      <img class="rightIcon" src="https://cdn.jsdelivr.net/gh/defis-net/material2/icon/toRight-999.png">
    </div>
    <div class="item flexb">
      <van-field
        class="ipt flexa"
        v-model="qq"
        label="QQ"
        :placeholder="$t('invite.qqIpt')"
        input-align="right"
      />
      <img class="rightIcon" src="https://cdn.jsdelivr.net/gh/defis-net/material2/icon/toRight-999.png">
    </div>
    <div class="item flexb">
      <van-field
        class="ipt flexa"
        v-model="wx"
        :label="$t('invite.wx')"
        :placeholder="$t('invite.wxIpt')"
        input-align="right"
      />
      <img class="rightIcon" src="https://cdn.jsdelivr.net/gh/defis-net/material2/icon/toRight-999.png">
    </div>
    <div class="item flexb">
      <van-field
        class="ipt flexa"
        v-model="tg"
        label="Telegram"
        :placeholder="$t('invite.tgIpt')"
        input-align="right"
      />
      <img class="rightIcon" src="https://cdn.jsdelivr.net/gh/defis-net/material2/icon/toRight-999.png">
    </div>
    <div class="item flexb" @click="handleShowImgCheck('bg')">
      <span class="subTitle">{{ $t('invite.bg') }}</span>
      <div class="flexa">
        <img class="bgImg" :src="cover || 'https://cdn.jsdelivr.net/gh/defis-net/material2/dfs/farmDefaultBg.png'">
        <img class="rightIcon" src="https://cdn.jsdelivr.net/gh/defis-net/material2/icon/toRight-999.png">
      </div>
    </div>
    <div class="descDiv">
      <span class="subTitle">{{ $t('invite.farmDesc') }}</span>
      <van-field
        class="textarea"
        v-model="desc"
        rows="5"
        autosize
        type="textarea"
        :placeholder="$t('invite.farmDescIpt')"
      />
    </div>

    <div class="btn flexc" @click="handleCreate">{{ $t('invite.save') }}</div>


    <van-popup class="popup_p"
      v-model="showCheckImg">
      <ImgCheck v-if="showCheckImg" :showType="type" @listenSure="handleSure"/>
    </van-popup>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { DApp } from '@/utils/wallet';
import ImgCheck from '@/views/my/dialog/ImgCheck'
export default {
  name: 'farmEdit',
  components: {
    ImgCheck,
  },
  data() {
    return {
      showCheckImg: false,
      type: '',
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
    }),
  },
  watch: {
    account: {
      handler: function at(newVal) {
        if (!newVal.name) {
          return
        }
        this.handleGetFarmInfo()
      },
      deep: true,
      immediate: true,
    }
  },
  methods: {
    // 获取农场信息
    async handleGetFarmInfo() {
      const name = this.account.name;
      const params = {
        json: true,
        limit: 10,
        code: "farms.tag",
        scope: "farms.tag",
        table: "farms",
        lower_bound: ` ${name}`,
        upper_bound: ` ${name}`,
      };
      const { status, result } = await this.$api.get_table_rows(params);
      if (!status) {
        return;
      }
      const rows = result.rows || [];
      if (!rows.length) {
        return;
      }
      const farmInfo = rows[0];
      this.cover = farmInfo.bg; // 背景
      this.avatar = farmInfo.avatar; // 头像 
      this.nick = farmInfo.farm_name; // 昵称
      this.slogon = farmInfo.slogon; // 口号
      this.desc = farmInfo.desc; // 简介
      this.qq = farmInfo.qq;
      this.wx = farmInfo.wx;
      this.tg = farmInfo.tg;
    },
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
.farmEdit{
  background: #FFF;
  min-height: 100vh;
  padding-bottom: 50px;
  font-size: 28px;
  color: #333;
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
}
.headDiv{
  margin: 30px;
  .headImg{
    width: 160px;
    height: 160px;
    border-radius: 50%;
  }
  .setHead{
    background: $color-main;
    color: #FFF;
    border-radius: 30px;
    height: 52px;
    width: 172px;
    margin: -20px auto 0;
    position: relative;
    z-index: 1;
  }
}
.descDiv,
.item{
  padding: 20px 0;
  margin: 0 28px;
  border-bottom: 1px solid $color-border;
  height: 80px;
  .rightIcon{
    width: 18px;
    margin-left: 18px;
  }
  .subTitle{
    font-size: 30px;
    font-weight: 500;
  }
  .bgImg{
    width: 150px;
    max-height: 80px;
  }
  .ipt{
    padding: 0;
    font-size: 28px;
    height: 80px;
    color: #333;
    &::after{
      border: 0;
    }
    /deep/ .van-cell__title{
      color: #333;
      font-size: 30px;
      font-weight: 500;
    }
  }
}
.descDiv{
  text-align: left;
  height: auto;
  .textarea{
    margin-top: 20px;
    background: #f7f7f7;
    padding: 20px;
  }
}
.btn{
  margin: 28px;
  background: $color-main;
  font-size: 32px;
  color: #fff;
  border-radius: 16px;
  height: 96px;
}
</style>