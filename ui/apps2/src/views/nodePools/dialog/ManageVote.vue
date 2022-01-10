<template>
  <div class="manageVote">
    <div class="title">{{ $t('nodePools.manage') }}</div>
    <div class="tab flexb">
      <span class="flexc" :class="{'buy': tab === 1}" @click="tab = 1">{{ $t('nodePools.addVote') }}</span>
      <span class="flexc" :class="{'sell': tab === 2}" @click="tab = 2">{{ $t('nodePools.desVote') }}</span>
    </div>
    <AddVote v-if="tab === 1" :rexPrice="rexPrice" :accVoteData="accVoteData"
      @listenUpdata="listenUpdata"/>
    <Remove v-else :rexPrice="rexPrice" :accVoteData="accVoteData"
      @listenUpdata="listenUpdata"/>
  </div>
</template>

<script>
import AddVote from './Add'
import Remove from './Remove'


export default {
  name: 'manageVote',
  props: {
    accVoteData: {
      type: Object,
      default: function avd() {
        return {}
      }
    }
  },
  components: {
    AddVote,
    Remove,
  },
  data() {
    return {
      tab: 1,
      rexPrice: 0,
    }
  },
  mounted() {
    this.handleGetRexData()
  },
  methods: {
    listenUpdata() {
      this.$emit('listenUpdata', 'acc')
    },
    // 获取REX数据
    async handleGetRexData() {
      const params = {
        "code":"eosio",
        "json":true,
        "scope":"eosio",
        "table":"rexpool"
      }
      const {status, result} = await this.$api.get_table_rows(params);
      if (!status) {
        return
      }
      const rows = result.rows[0];
      this.rexPrice = parseFloat(rows.total_lendable) / parseFloat(rows.total_rex);
    }
  }
}
</script>

<style lang="scss" scoped>
.manageVote{
  padding: 26px;
  text-align: left;
  font-size: 27px;
  color: #333;
  .title{
    font-size: 33px;
    font-weight: 500;
    text-align: center;
  }
  .tab{
    margin: 20px 0;
    &>span{
      flex: 1;
      border: 1px solid #eee;
      border-radius: 12px;
      height: 70px;
      margin-right: 10px;
      color: #999;
      &:last-child{
        margin-right: 0;
      }
      &.buy {
        color: #29d4b0;
        border: 1px solid #29d4b0;
      }
      &.sell{
        color: #e9574f;
        border: 1px solid #e9574f;
      }
    }
  }
}
</style>
