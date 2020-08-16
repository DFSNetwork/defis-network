<template>
  <div class="footer">
    <div class="minW flexB">
      <div class="logo"><img src="@/assets/img/defis.png" alt=""></div>
      <div class="team">
        <!-- <span>常见问题</span> -->
        <div class="telMe">
          <a href="https://github.com/defis-net/defis-network" target="_blank">
            <img src="@/assets/img/team/github.svg" alt="github">
          </a>
          <a href="https://t.me/dfsnet" target="_blank">
            <img src="@/assets/img/team/telegram.svg" alt="telegram">
          </a>
          <img @click="showWeChat = true" src="@/assets/img/team/wechat.svg" alt="wechat">
          <!-- <img src="@/assets/img/team/discord.svg" alt="discord"> -->
          <a href="https://twitter.com/DefisNetwork" target="_blank">
             <img src="@/assets/img/team/twitter.svg" alt="twitter">
          </a>
        </div>
        <span>Copyright © 2020 DeFis.Network All rights reserved.</span>
      </div>
    </div>
    <el-dialog
      class="dialog"
      width="300px"
      :visible.sync="showWeChat">
      <div class="title">WeChat QR</div>
      <img class="weChat" src="@/assets/img/team/wechatqr.jpg" alt="">
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'myFooter',
  data() {
    return {
      showWeChat: false,
    }
  }
}
</script>

<style lang="scss" scoped>
.footer{
  margin: 13px auto;
  div{
    font-size: 16px;
  }
  .minW{
    min-width: 1200px;
    width: 1200px;
    margin: auto;
  }
  .flexB{
    display: flex;
    align-content: center;
    justify-content: space-between;
  }
  .logo{
    width: 200px;
    min-width: 200px;
    img{
      width: 100%;;
    }
  }
  .team{
    span{
      color: #999;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 30px;
      font-size: 14px;
      font-weight: bold;
      letter-spacing: 0.89px;
      cursor: pointer;
    }
  }
  .telMe{
    a,
    img{
      width: 40px;
      margin-right: 20px;
      cursor: pointer;
      &:last-child{
        margin-right: 0px;
      }
    }
  }
  .dialog{
    /deep/ .el-dialog__header{
      padding: 0;
    }
    .title{
      font-size: 26px;
      color: #070707;
      font-weight: bold;
    }
    .weChat{
      width: 100%;
    }
  }
}
@media screen and (max-width: 750px) {
  .footer{
    .minW{
      width: 100%;
      min-width: 100%;
    }
  }
}
</style>
