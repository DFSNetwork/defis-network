<template>
  <div>
    <div class="title">
      <span class="act">我的做市</span>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { EosModel } from '@/utils/eos';
export default {
  data() {
    return {
      getToken: false,
      lists: [],
    }
  },
  props: {
    marketLists: {
      type: Array,
      default: function lists() {
        return []
      }
    }
  },
  watch: {
    marketLists: {
      handler: function mlt() {
        if (!this.getToken) {
          this.handleGetToken()
          return
        }
        this.handleDealLists();
      }
    }
  },
  computed: {
    ...mapState({
      minScreen: state => state.app.minScreen,
      scatter: state => state.app.scatter,
      slipPoint: state => state.app.slipPoint,
      baseConfig: state => state.sys.baseConfig,
      weightList: state => state.sys.weightList, // 交易对权重列表
    }),
  },
  methods: {
    handleGetToken() {
      this.lists = []
      this.marketLists.forEach(v => {
        const params = {
          code: this.baseConfig.toAccountSwap,
          scope: v.mid,
          table: 'liquidity',
          lower_bound: ` ${this.scatter.identity.accounts[0].name}`,
          upper_bound: ` ${this.scatter.identity.accounts[0].name}`,
          json: true
        }
        EosModel.getTableRows(params, (res) => {
          const list = res.rows || [];
          let token = '0'
          !list[0] ? token = '0' : token = `${list[0].token}`;
          if (Number(token)) {
            this.lists.push({
              mid: v.mid,
              token,
            })
          }
        })
      })
      setTimeout(() => {
        console.log(this.lists)
      }, 2000);
    },
    handleDealLists() {
    }
  }
}
</script>

<style lang="scss" scoped>
.title{
  font-size: 32px;
  text-align: left;
  margin: 0 0 40px;
  &>span{
    margin-right: 60px;;
  }
  .act{
    color: $color-black;
    position: relative;
    &::before{
      content: '';
      position: absolute;
      width:60px;
      height:8px;
      background:rgba(2,198,152,1);
      border-radius:4px;
      bottom: -20px;
      left: 50%;
      transform: translateX(-45%);
    }
  }
}
</style>
