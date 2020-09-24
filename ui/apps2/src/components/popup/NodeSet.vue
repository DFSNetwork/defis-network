<template>
  <div class="nodeSet">
    <div class="title">{{ $t('node.nodeSet') }}</div>
    <div class="content">
      <div class="nodeList" v-for="(node, index) in nodeList" :key="index" @click="handleCheck(node, index)">
        <div class="icon" :class="{'act': radio === index}">
          <span>{{ $t('node.standbyNode') }}{{index + 1}}：</span>
          <span>{{ node.url }}</span>
        </div>
      </div>
      <div class="nodeList" @click="handleCheck(node, nodeList.length)">
        <div class="icon" :class="{'act': radio === nodeList.length}">
          <span>{{ $t('node.slef') }}：</span>
          <span><input class="input" type="text" @blur="handleBlur" v-model="nodeUrl" placeholder="eg. https://..."></span>
        </div>
      </div>
    </div>
    <div class="btn flexc" @click="handleSetNode">{{ $t('public.confirm') }}</div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      nodeUrl: '',
      nodeList: [
        {
          area: 'production',
          protocol: 'https',
          host: 'eos.blockeden.cn', // eospush.tokenpocket.pro
          // port: '443',
          url: 'https://eos.blockeden.cn', // https://eospush.tokenpocket.pro
          chainId: "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906",
        },
        {
          area: 'production',
          protocol: 'https',
          host: 'eospush.tokenpocket.pro',
          // port: '443',
          url: 'https://eospush.tokenpocket.pro',
          chainId: "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906",
        },
        {
          area: 'production',
          protocol: 'https',
          host: 'eos.greymass.com', // eospush.tokenpocket.pro
          // port: '443',
          url: 'https://eos.greymass.com', // https://eospush.tokenpocket.pro
          chainId: "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906",
        },
        {
          area: 'production',
          protocol: 'https',
          host: 'nodes.get-scatter.com', // eospush.tokenpocket.pro
          // port: '443',
          url: 'https://nodes.get-scatter.com', // https://eospush.tokenpocket.pro
          chainId: "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906",
        },
        {
          area: 'production',
          protocol: 'https',
          host: 'mainnet.meet.one',
          // port: '443',
          url: 'https://mainnet.meet.one', // https://eospush.tokenpocket.pro
          chainId: "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906",
        },
        {
          area: 'production',
          protocol: 'https',
          host: 'api.eossweden.se',
          // port: '443',
          url: 'https://api.eossweden.se', // https://eospush.tokenpocket.pro
          chainId: "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906",
        },
        {
          area: 'production',
          protocol: 'https',
          host: 'api.eoslaomao.com',
          // port: '443',
          url: 'https://api.eoslaomao.com', // https://eospush.tokenpocket.pro
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
  methods: {
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
      localStorage.setItem('proConfig', JSON.stringify(newConf))
      this.$store.dispatch('setBaseConfig', newConf);
      location.reload()
    }
  },
}
</script>

<style lang="scss" scoped>
.nodeSet{
  font-size: 28px;
  color: #000;
  .title{
    font-size: 32px;
    font-weight: 500;
    margin-bottom: 20px;
  }
  .nodeList{
    text-align: left;
    margin-top: 20px;
    .input{
      outline: none;
      border: 1px solid #e3e3e3;
      height: 40px;
      padding-left: 10px;
      border-radius: 3px;
    }
    .icon{
      position: relative;
      padding-left: 42px;
      &::before{
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        width: 32px;
        height: 31px;
        border: 1px solid #e3e3e3;
        transform: translate(0, -50%);
        box-sizing: border-box;
        border-radius: 30px;
      }

      &.act{
        &::before{
          background: #07d79b;
          border: 1px solid transparent;
        }
        &::after{
          content: '';
          position: absolute;
          left: 16px;
          top: 50%;
          width: 10px;
          height: 9px;
          background: #FFF;
          transform: translate(-50%, -50%);
          box-sizing: border-box;
          border-radius: 30px;
        }
      }
    }
  }
  .btn{
    margin-top: 30px;
    background: #07d79b;
    border-radius: 10px;
    color: #fff;
    height: 60px;
    min-width: 100px;
    padding: 0 20px;
    &:active{
      background: #02C698;
    }
  }
}
</style>
