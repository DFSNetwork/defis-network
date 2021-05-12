<template>
  <div class="nodeSet">
    <img class="close" @click="handleClose" src="https://cdn.jsdelivr.net/gh/defis-net/material/svg/sd_icon_btn.svg">
    <div class="title">{{ $t('node.nodeSet') }}</div>
    <div class="content">
      <div class="nodeList flexa" v-for="(node, index) in nodeList" :key="index" @click="handleCheck(node, index)">
        <div class="checkBox" :class="{'checked': radio === index}">
          <img class="checkBoxImg" v-if="radio === index" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/checked.png">
        </div>
        <div class="icon">
          <div class="">
            <span class="name">{{ node.name || $t('node.standbyNode') }}</span>
            <span class="delay" :class="{
              'green': node.delay < 1000,
              'yellow': node.delay < 3000 && node.delay >= 1000,
              'red': node.delay >= 3000 || !node.delay,
            }">{{ node.delay || '- ' }}ms</span>
          </div>
          <span class="tip">{{ node.url }}</span>
        </div>
      </div>
      <div class="nodeList flexa" @click="handleCheck(node, nodeList.length)">
        <div class="checkBox" :class="{'checked': radio === nodeList.length}">
          <img class="checkBoxImg" v-if="radio === nodeList.length" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/checked.png">
        </div>
        <div class="icon flexa">
          <span class="tip">{{ $t('node.slef') }}：</span>
          <input class="input" type="text" @blur="handleBlur" v-model="nodeUrl" placeholder="eg. https://...">
        </div>
      </div>
    </div>
    <div class="btnDiv flexb">
      <div class="btn cancel flexc tip" @click="handleClose">{{ $t('public.cancel') }}</div>
      <div class="btn flexc" @click="handleSetNode">{{ $t('public.confirm') }}</div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import { mapState } from 'vuex'
export default {
  data() {
    return {
      nodeUrl: '',
      nodeList: [
        {
          name: 'BlockEden',
          area: 'production',
          protocol: 'https',
          host: 'eos.blockeden.cn', // eospush.tokenpocket.pro
          port: '443',
          url: 'https://eos.blockeden.cn', // https://eospush.tokenpocket.pro
          chainId: "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906",
        },
        {
          name: 'DFS社区节点',
          area: 'production',
          protocol: 'http',
          host: 'eos.rrdy.com', // eospush.tokenpocket.pro
          port: '443',
          url: 'https://eos.rrdy.com', // https://eospush.tokenpocket.pro
          chainId: "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906",
        },
        {
          name: 'Newdex',
          area: 'production',
          protocol: 'https',
          host: 'eos.newdex.one', // eospush.tokenpocket.pro
          port: '443',
          url: 'https://eos.newdex.one', // https://eospush.tokenpocket.pro
          chainId: "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906",
        },
        {
          name: 'Eosflare',
          area: 'production',
          protocol: 'https',
          host: 'api.eosflare.io', // eospush.tokenpocket.pro
          port: '443',
          url: 'https://api.eosflare.io', // https://eospush.tokenpocket.pro
          chainId: "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906",
        },
        {
          name: 'TP',
          area: 'production',
          protocol: 'https',
          host: 'eospush.tokenpocket.pro',
          port: '443',
          url: 'https://eospush.tokenpocket.pro',
          chainId: "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906",
        },
        {
          name: 'Fwnw',
          area: 'production',
          protocol: 'https',
          host: 'api.fwnw.com',
          port: '443',
          url: 'https://api.fwnw.com',
          chainId: "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906",
        },
        {
          name: 'Greymass',
          area: 'production',
          protocol: 'https',
          host: 'eos.greymass.com', // eospush.tokenpocket.pro
          port: '443',
          url: 'https://eos.greymass.com', // https://eospush.tokenpocket.pro
          chainId: "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906",
        },
        {
          name: 'Scatter',
          area: 'production',
          protocol: 'https',
          host: 'nodes.get-scatter.com', // eospush.tokenpocket.pro
          port: '443',
          url: 'https://nodes.get-scatter.com', // https://eospush.tokenpocket.pro
          chainId: "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906",
        },
        {
          name: 'Sweden',
          area: 'production',
          protocol: 'https',
          host: 'api.eossweden.se',
          port: '443',
          url: 'https://api.eossweden.se', // https://eospush.tokenpocket.pro
          chainId: "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906",
        },
        {
          name: 'Laomao',
          area: 'production',
          protocol: 'https',
          host: 'api.eoslaomao.com',
          port: '443',
          url: 'https://api.eoslaomao.com', // https://eospush.tokenpocket.pro
          chainId: "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906",
        },
        {
          name: 'Eosn',
          area: 'production',
          protocol: 'https',
          host: 'api.eosn.io',
          port: '443',
          url: 'https://api.eosn.io', // https://eospush.tokenpocket.pro
          chainId: "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906",
        }
      ],
      node: null,
      radio: 1,
    }
  },
  computed: {
    ...mapState({
      baseConfig: state => state.sys.baseConfig, // 基础配置 - 默认为{}
      testConfig: state => state.sys.testConfig, // 测试网环境
      devConfig: state => state.sys.devConfig, // 开发环境
      proConfig: state => state.sys.proConfig, // 生产环境
    })
  },
  watch: {
    baseConfig: {
      handler: function bc() {
        const url = this.baseConfig.node.url;
        let radio = this.nodeList.findIndex(v => v.url === url);
        if (radio === -1) {
          radio = this.nodeList.length;
          this.nodeUrl = url
        }
        this.radio = radio;
      },
      immediate: true
    },
    nodeUrl() {
      this.node.url = this.nodeUrl;
    }
  },
  mounted() {
    this.handleDealNodeDalay()
  },
  methods: {
    handleClose() {
      this.$emit('listenClose', false)
    },
    handleBlur() {
      const inArr = this.nodeUrl.split('://');

      const protocol = inArr.length > 1 ? inArr[0] : 'https'
      const host = inArr.length > 1 ? inArr[1] : inArr[0];
      const url = inArr.length > 1 ? this.nodeUrl : `https://${inArr[0]}`
      const self = {
        area: 'production',
        protocol,
        host,
        port: '443',
        url, // https://eospush.tokenpocket.pro
        chainId: "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906",
      }
      this.node = self;
    },
    handleCheck(node, index) {
      this.radio = index;
      if (index === this.nodeList.length) {
        if (!this.nodeUrl) {
          this.node = {};
          return
        }
        this.handleBlur()
        return
      }
      this.node = node;
    },
    handleSetNode() {
      // const node = this.nodeList[this.radio];
      // console.log(this.node)
      const newConf = this.baseConfig;
      newConf.node = this.node;
      newConf.type = true;
      localStorage.setItem('proConfig', JSON.stringify(newConf))
      this.$store.dispatch('setBaseConfig', newConf);
      location.reload()
    },
    // 获取节点延时
    handleDealNodeDalay() {
      this.nodeList.forEach(async v => {
        const url = v.url;
        let nodeTime = moment().valueOf();
        const {status} = await this.$api.get_info(url)
        if (!status) {
          this.$set(v, 'delay', 9999)
          return
        }
        let t = moment().valueOf() - nodeTime;
        this.$set(v, 'delay', t)
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.nodeSet{
  font-size: 28px;
  padding: 40px 0 0;
  color: #333;
  position: relative;
  .close{
    position: absolute;
    top: 40px;
    right: 40px;
    width: 24px;
  }
  .title{
    font-size: 36px;
    font-weight: 500;
    margin-bottom: 20px;
  }
  .content{
    height: 700px;
    overflow: auto;
  }
  .nodeList{
    text-align: left;
    height: 120px;
    border-bottom: 1px solid $color-border;
    padding: 0 40px;
    // &:last-child{
    //   border-bottom: 0;
    // }
    .checkBox{
      margin-right: 30px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 1px solid $color-border;
      box-sizing: border-box;
      &.checked{
        border: 0px solid $color-border;
      }
      .checkBoxImg{
        width: 100%;
      }
    }
    .name{
      font-size: 30px;
    }
    .delay{
      font-size: 24px;
      margin-left: 20px;
      &.green{
        color: $color-main;
      }
      &.yellow{
        color: #FFBE00;
      }
      &.red{
        color: #FE3B37;
      }
    }
    .input{
      outline: none;
      border: 1px solid $color-border;
      height: 45px;
      flex: 1;
      padding-left: 10px;
      border-radius: 3px;
    }
    .icon{
      position: relative;
      padding-left: 10px;
      flex: 1;
    }
  }
  .btnDiv{
    height: 136px;
  }
  .btn{
    flex: 1;
    font-size: 36px;
    border-radius: 10px;
    color: $color-main;
    min-width: 100px;
    padding: 0 20px;
    height: 120px;
    &.cancel{
      color: $color-tip;
      position: relative;
      &::after{
        content: '';
        position: absolute;
        top: 50%;
        right: 0%;
        transform: translate(-50%, -50%);
        height: 60px;
        border-left: 2px solid $color-border;
      }
    }
  }
}
</style>
