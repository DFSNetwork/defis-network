<template>
  <div class="lists">
    <div class="list flexb nav">
      <span>时间</span>
      <span>价格</span>
      <span>数量({{ checkedMarket.symbol1 }})</span>
    </div>
    <div class="list flexb" v-for="(v, i) in lists" :key="i">
      <span>{{ v.tdate }}</span>
      <span :class="{'green': v.isBuy, 'red': !v.isBuy}">{{ v.price }}</span>
      <span>{{ v.num }}</span>
    </div>
  </div>
</template>

<script>
import {dealPrice, toLocalTime} from '@/utils/public'
export default {
  name: 'lasterTrade',
  props: {
    checkedMarket: {
      type: Object,
      default: function cmt(){
        return {}
      }
    },
  },
  data() {
    return {
      lists: [{
        time: '',
      }],
    }
  },
  mounted() {
    this.handleGetLists()
  },
  methods: {
    handleToLocalTime(time) {
      return toLocalTime(time).substr(5, 16)
    },
    handlePrice(v) {
      const n0 = v.sym0 === this.checkedMarket.symbol0 ? v.amount0 : v.amount1;
      const n1 = v.sym0 === this.checkedMarket.symbol0 ? v.amount1 : v.amount0;
      return dealPrice(n0/n1)
    },
    handleNum(v) {
      const n0 = v.sym0 === this.checkedMarket.symbol0 ? v.bal1 : v.bal0;
      return n0.split(' ')[0]
    },
    async handleGetLists() {
      const params = {
        page: 1, 
        limit: 20,
        sym: 'DFS'
      }
      const {status, result} = await this.$api.orderLists(params)
      if (!status) {
        return
      }
      const lists = result.data || [];
      console.log(lists)
      lists.forEach(v => {
        const tdate = toLocalTime(v.create_time).substr(5, 16);
        const price = this.handlePrice(v)
        const num = this.handleNum(v)
        const isBuy = v.sym0 === this.checkedMarket.symbol0;
        this.$set(v, 'tdate', tdate)
        this.$set(v, 'price', price)
        this.$set(v, 'num', num)
        this.$set(v, 'isBuy', isBuy)
      });
      this.lists = lists;
      console.log(this.lists)
    }
  }
}
</script>

<style lang="scss" scoped>
.lists{
  font-size: 27px;
  padding: 0 20px;

  .green{
    color: #00be66;
  }
  .red{
    color: #ea573c;
  }
  .list{
    color: #000;
    height: 60px;
    text-align: left;
    &>span{
      flex: 1;
      &:nth-child(2){
        text-align: center;
      }
      &:last-child{
        text-align: right;
      }
    }
  }
  .nav{
    color: #333;
    border-bottom: 1px solid #e3e3e3;;
  }
}
</style>
