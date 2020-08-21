<template>
  <div class="borrow" :class="{'en': $store.state.app.language === 'en'}">
    <my-header @listenToDiv="handleToDiv" @listenToShowReport="handleToShowReport"/>
    <div class="dapp" ref="dapp">
      <div class="minW flexB">
        <div class="dappContent">
          <div>{{ $t('index.title1_1') }}</div>
          <div class="mb30">{{ $t('index.title1_2') }}</div>
          <div><button class="btn" @click="handleToApp()">{{ $t('index.btn_1') }} ></button></div>
        </div>
        <div class="contentImg">
          <img width="100%" src="@/assets/img/1.png" alt="">
        </div>
      </div>
    </div>
    <!-- 项目愿景 -->
    <div class="vision" ref="vision">
      <div class="minW flexB">
        <div class="vCont">
          <div class="title">{{ $t('index.title2_1') }}</div>
          <div class="title mb30">{{ $t('index.title2_2') }}</div>
          <div class="tip mb15">
            {{ $t('index.cont2') }}
          </div>
          <div class="link">
            <a href="https://github.com/defis-net/defis-network/blob/master/README.md"
              target="_blank">
              <span>{{ $t('index.link2') }} ></span>
            </a>
          </div>
        </div>
        <div class="contentImg">
          <img width="100%" src="@/assets/img/2.png" alt="">
        </div>
      </div>
    </div>
    <!-- DFS代币 -->
    <div class="dfs" ref="dfs">
      <div class="minW flexB">
        <div class="contentImg">
          <img width="100%" src="@/assets/img/3.png" alt="">
        </div>
        <div class="vCont">
          <div class="title">{{ $t('index.title3_1') }}</div>
          <div class="title mb30">{{ $t('index.title3_2') }}</div>
          <div class="tip mb15">
            {{ $t('index.cont3') }}
          </div>
        </div>
      </div>
    </div>
    <!-- 项目进度 -->
    <div class="project" ref="project">
      <div class="title">{{ $t('nav.project') }}</div>
      <div class="proList flexB">
        <div class="item" @click="handleToApp()">
          <div class="">
            <div class="itemImg"><img src="@/assets/img/swap.png" width="100%" alt=""></div>
            <div class="name">SWAP</div>
            <div class="status">{{ $t('index.status1') }}</div>
          </div>
          <div class="bgImg"><img width="100%" src="@/assets/img/4.png" alt=""></div>
        </div>
        <div class="item" @click="handleToApp()">
          <div>
            <div class="itemImg"><img src="@/assets/img/bank.png" width="100%" alt=""></div>
            <div class="name">BANK</div>
            <div class="status">{{ $t('index.status1') }}</div>
          </div>
          <div class="bgImg"><img width="100%" src="@/assets/img/5.png" alt=""></div>
        </div>
        <div class="item">
          <div>
            <div class="itemImg"><img src="@/assets/img/LEND.png" width="100%" alt=""></div>
            <div class="name">LEND</div>
            <div class="status">{{ $t('index.status2') }}</div>
          </div>
          <div class="bgImg"><img width="100%" src="@/assets/img/6.png" alt=""></div>
        </div>
        <div class="item">
          <div>
            <div class="itemImg"><img src="@/assets/img/synthetix.png" width="100%" alt=""></div>
            <div class="name">SYNTHETIX</div>
            <div class="status">{{ $t('index.status2') }}</div>
          </div>
          <div class="bgImg"><img width="100%" src="@/assets/img/7.png" alt=""></div>
        </div>
      </div>
      <a href="" class="hidden" target="_blank" ref="target"></a>
    </div>
    <!-- 成员 -->
    <div class="contributors">
      <div class="title">{{ $t('nav.team') }}</div>
      <div class="users">
        <div class="user">
          <div class="userImg"><img src="@/assets/img/team/team3.jpeg" alt=""></div>
          <div class="name">Judy Lee</div>
          <div class="tip">Co-Founder & CTO</div>
        </div>
        <div class="user">
          <div class="userImg"><img src="@/assets/img/team/team7.jpeg" alt=""></div>
          <div class="name">Jay</div>
          <div class="tip">Co-Founder & CEO</div>
        </div>
        <div class="user">
          <div class="userImg"><img src="@/assets/img/team/team6.jpeg" alt=""></div>
          <div class="name">Ayana Lam</div>
          <div class="tip">Co-Founder & Project Manager</div>
        </div>
        <div class="user">
          <div class="userImg"><img src="@/assets/img/team/team1.jpeg" alt=""></div>
          <div class="name">Jaysun Xu</div>
          <div class="tip">Project Manager</div>
        </div>
        <div class="user">
          <div class="userImg"><img src="@/assets/img/team/team4.jpeg" alt=""></div>
          <div class="name">Allen Yang</div>
          <div class="tip">Front-end Developer</div>
        </div>
        <div class="user">
          <div class="userImg"><img src="@/assets/img/team/team2.jpeg" alt=""></div>
          <div class="name">BB 8</div>
          <div class="tip">Back-end Developer</div>
        </div>
        <div class="user">
          <div class="userImg"><img src="@/assets/img/team/team8.jpeg" alt=""></div>
          <div class="name">Jennifer.D</div>
          <div class="tip">UI & Marketing</div>
        </div>
        <!-- <div class="user">
          <div class="userImg"><img src="@/assets/img/team/team5.jpeg" alt=""></div>
          <div class="name">Professor Vincent</div>
          <div class="tip">Consultant</div>
        </div> -->
        <div class="user">
          <div class="userImg"><img src="@/assets/img/team/team5.jpeg" alt=""></div>
          <div class="name">Opa</div>
          <div class="tip">Marketing</div>
        </div>
        <div class="user">
          <div class="userImg"><img src="@/assets/img/team/team9.jpeg" alt=""></div>
          <div class="name">Joe</div>
          <div class="tip">Consultant</div>
        </div>
      </div>
    </div>
    <!-- 合作伙伴 -->
    <div class="partners">
      <div class="title">{{ $t('nav.partners') }}</div>
      <div class="partnersList">
        <div class="listImg flexC"><img src="@/assets/img/partners/tp.png?v=1" alt=""></div>
        <div class="listImg flexC"><img src="@/assets/img/partners/meetone.png?v=1" alt=""></div>
        <div class="listImg flexC"><img src="@/assets/img/partners/bitpie.png?v=1" alt=""></div>
        <div class="listImg flexC"><img src="@/assets/img/partners/mykey.png?v=1" alt=""></div>
        <div class="listImg flexC" @click="handleToShowReport('slowMist')"><img src="@/assets/img/partners/slowmist.png?v=2" alt=""></div>
        <div class="listImg flexC" @click="handleToShowReport('peckshield')"><img src="@/assets/img/partners/peckshield.png" alt=""></div>
        <div class="listImg flexC"><img src="@/assets/img/partners/newdex.png?v=1" alt=""></div>
        <div class="listImg flexC"><img src="@/assets/img/partners/hoov3.png?v=2" alt=""></div>
        <!-- <div class="listImg flexC none"></div> -->
      </div>
    </div>
    <my-footer ref="question"/>

    <transition name="el-fade-in-linear">
      <div class="toTop" v-if="showToTop" @click="handleBackTop">
        <span class="iconfont icon-huaban35 top"></span>
      </div>
    </transition>

    <el-dialog
      class="dialog"
      :visible.sync="showImg">
      <img width="100%" src="https://tva1.sinaimg.cn/large/007S8ZIlgy1gh00tvkd0dj30ku112tbw.jpg" />
    </el-dialog>
    <el-dialog
      class="dialog"
      :visible.sync="showImg2">
      <img width="100%" src="@/assets/img/record/peckshield.jpeg" />
    </el-dialog>
  </div>
</template>

<script>
import MyHeader from './components/MyHeader'
import MyFooter from './components/MyFooter'
export default {
  name: 'index',
  components: {
    MyHeader,
    MyFooter,
  },
  data() {
    return {
      scrollTop: 0,
      showToTop: false,
      timer: null,
      showImg: false, // 现实审计结果图片
      showImg2: false,
    }
  },
  computed:{
  },
  props: {
  },
  watch: {
  },
  mounted() {
    window.addEventListener('scroll', this.scrollToTop);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.scrollToTop)
    clearInterval(this.timer);
  },
  methods: {
    handleToApp(route) {
      // location.href = 'http://apps.defis.network/'
      const target = this.$refs.target;
      target.setAttribute('href', `https://apps.defis.network/${route || ''}`);
      target.click();
    },
    handleToDiv(refName) {
      clearInterval(this.timer);
      let t = 0
      this.timer = setInterval(() => {
        t += 1;
        const ispeed = Math.ceil((this.$refs[refName].offsetTop - this.scrollTop) / 5);
        document.documentElement.scrollTop = this.scrollTop + ispeed; // eslint-disable-line
        if (this.scrollTop >= this.$refs[refName].offsetTop || t > 20) {
          clearInterval(this.timer);
        }
      }, 10)
    },
    // 回到顶部
    handleBackTop() {
      clearInterval(this.timer);
      const timer = setInterval(() => {
        const ispeed = Math.floor(-this.scrollTop / 5);
        document.documentElement.scrollTop = this.scrollTop + ispeed; // eslint-disable-line
        if (this.scrollTop === 0) {
          clearInterval(timer);
        }
      }, 10)
    },
    // 监听滚动事件
    scrollToTop() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      this.scrollTop = scrollTop
      if (this.scrollTop > 240) {
        this.showToTop = true
      } else {
        this.showToTop = false
      }
    },
    handleToShowReport(name) {
      if (name === 'peckshield') {
        this.showImg2 = true
        return;
      }
      this.showImg = true;
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog{
  /deep/ .el-dialog{
    width: 375px;
    .el-dialog__header,
    .el-dialog__body{
      padding: 0;
    }
  }
  img{
    display: block;
  }
}
.borrow{
  color: #000;
  &.en{
    .dappContent{
      font-size: 28px !important;
    }
    .vCont{
      .title{
        font-size: 24px !important;
      }
    }
  }
  .hidden{
    visibility: hidden;
  }
  .minW{
    height: 700px;
    min-width: 1200px;
    width: 1200px;
    margin: auto;
    padding: 0px 0px 0px 70px;
    box-sizing: border-box;
    text-align: left;
  }
  .flexB{
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .flexC{
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
  .mb30{
    margin-bottom: 30px !important;
  }
  .mb15{
    margin-bottom: 15px !important;
  }
  .blod{
    font-weight: bold;
  }
  .dappContent{
    font-size: 32px;
    font-weight: bold;
    text-align: left;
    letter-spacing: 1.11px;
    .btn{
      font-weight: bold;
      color: #57BB9B;
      border: 1px solid #57BB9B;
      border-radius: 2px;
      font-size: 14px;
      background: transparent;
      height: 40px;
      padding: 0px 20px;
      outline: none;
      cursor: pointer;
    }
  }
  .contentImg{
    width: 600px;
    height: 400px;
  }
  .vision,.dfs{
    background: #fafafa;
    // padding: 100px 0px;
    .vCont{
      max-width: 500px;
      .title{
        font-size: 28px;
        font-weight: bold;
        letter-spacing: 1.11px;
      }
      .tip{
        font-size: 16px;
        color: #999;
        letter-spacing: 0.78px;
      }
      .link{
        a{
          text-decoration: none;
        }
        span{
          font-size: 16px;
          font-weight: bold;
          color: #57BB9B;
        }
      }
    }
  }
  .dfs{
    background: #FFF;
    .minW{
      padding-left: 0px;
    }
  }
  .project{
    background: #fafafa;
    padding: 100px 0px;
    .title{
      font-size: 28px;
      letter-spacing: 1.11px;
      font-weight: bold;
      margin-bottom: 47px;
    }
    .proList{
      width: 1200px;
      margin: auto;
      .item{
        background: #FFF;
        position: relative;
        width: 200px;
        height: 380px;
        display: flex;
        align-items: center;
        justify-content: center;
        &>div:first-child{
          position: relative;
          z-index: 2;
        }
        .itemImg{
          margin: auto;
          width: 60px;
          height: 60px;
          margin-bottom: 6px;
        }
        .status{
          font-size: 14px;
          color: #999999;
          letter-spacing: 0.78px;
          margin-top: 7px;
        }
        .name{
          font-size: 20px;
          font-weight: bold;
          letter-spacing: 1.11px;
        }
        .bgImg{
          position: absolute;
          bottom: 0px;
          z-index: 1;
          img{
            display: block;
          }
        }
      }
    }
  }

  .toTop{
    position: fixed;
    bottom: 120px;
    right: 90px;
    z-index: 10;
    background: #FFF;
    height: 50px;
    width: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    box-shadow: 0 0 5px 0px #999;
    .top{
      font-size: 12px;
      color: #57BB9B
    }
  }
  .contributors{
    padding: 100px 0px;
    background: #FFF !important;
    .users{
      .user{
        min-width: 400px;
        margin-bottom: 30px;
        .userImg{
          background: #f3f3f3;
          border-radius: 50%;
          height: 100px;
          width: 100px;
          margin: auto;
          margin-bottom: 20px;
          overflow: hidden;
          img{
            width: 100%;
          }
        }
        .name{
          font-size: 24px;
        }
        .tip{
          font-size: 16px;
          color: #999;
        }
      }
    }
  }
  .contributors,
  .partners{
    background: #fafafa;
    padding: 100px 0px;
    .title{
      font-size: 28px;
      letter-spacing: 1.11px;
      font-weight: bold;
      margin-bottom: 47px;
    }
    .users,
    .partnersList{
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      max-width: 1200px;
      margin: auto;
      .listImg{
        width: 280px;
        height: 55px;
        box-sizing: border-box;
        margin: 10px;
        border: 1px solid #ededed;
        border-radius: 5px;

        &.none{
          border: 1px solid transparent;
        }

        img{
          width: 100%;;
        }
      }
    }
  }
}
</style>
