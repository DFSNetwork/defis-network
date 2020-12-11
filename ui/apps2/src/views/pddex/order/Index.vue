<template>
  <div class="order">
    <div class="title flexc">我的订单</div>
    <van-sticky>
      <van-dropdown-menu active-color="#29d4b0">
        <van-dropdown-item v-model="value1" :options="option1" />
        <van-dropdown-item v-model="value2" :options="option2" />
      </van-dropdown-menu>
    </van-sticky>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <div class="orderLists">
        <van-list
          v-model="loading"
          :offset="150"
          :finished="finished"
          @load="onLoad"
        >
          <!-- finished-text="没有更多了" -->
          <div class="noData tip" v-if="!list.length && !loading">
            <img class="noDataPng" src="https://cdn.jsdelivr.net/gh/defis-net/material/noData/noOrder.png" alt="">
            <div>暂无数据</div>
          </div>
          <div v-for="(item, index) in list" :key="index">
            <div class="list">
              <div class="liTitle flexb">
                <div class="symbol">
                  <span v-if="item.isBuy" class="green">买 </span>
                  <span v-else class="red">卖 </span>
                  <span>{{ item.symbol1 }}/{{ item.symbol0 }}</span>
                  <span class="tip"> ({{ item.oDate }})</span>
                </div>
                <div>
                  <van-button v-if="value2 === 'a'" plain type="danger" @click="handleCancel(item, index)">撤单</van-button>
                  <span class="source flexa" v-else>
                    <span>Dex: </span>
                    <img class="dex" v-if="item.dex === 'defisswapcnt'" src="https://ndi.340wan.com/eos/minedfstoken-dfs.png" alt="">
                    <img class="dex" v-else-if="item.dex === 'swap.defi'" src="https://ndi.340wan.com/eos/token.defi-box.png" alt="">
                  </span>
                </div>
              </div>
              <div class="flexb liTitle">
                <div>
                  <div class="num">{{ item.orderNum }}</div>
                  <div class="subTitle tip">委托量({{ item.symbol1 }})</div>
                </div>
                <div>
                  <div class="num">{{ item.orderPrice }}</div>
                  <div class="subTitle tip">委托价({{ item.symbol0 }})</div>
                </div>
                <div>
                  <div class="num">{{ item.amt }}</div>
                  <div class="subTitle tip">委托额({{ item.symbol0 }})</div>
                </div>
              </div>
              <div class="flexb" v-if="false">
                <div>
                  <div class="num">10.0000</div>
                  <div class="subTitle tip">成交量({{ item.symbol1 }})</div>
                </div>
                <div>
                  <div class="num">50.0000</div>
                  <div class="subTitle tip">成交均价({{ item.symbol0 }})</div>
                </div>
                <div>
                  <div class="num">50.0000</div>
                  <div class="subTitle tip">手续费({{ item.symbol0 }})</div>
                </div>
              </div>
            </div>
          </div>
        </van-list>
      </div>
    </van-pull-refresh>

    <van-popup v-model="showCancel">
      <cancel-sure :item="item" :itemIndex="itemIndex"
        @handleClose="handleClose"
        @cancelSuccess="hanldeSuccess"/>
    </van-popup>
  </div>
</template>

<script>
import moment from 'moment';
import { mapState } from 'vuex';
import { toFixed, toLocalTime, dealPrice } from '@/utils/public';
import CancelSure from "./comp/CancelSure";
export default {
  name: 'order',
  components: {
    CancelSure
  },
  data() {
    return {
      showCancel: false,
      checked: false,
      isLoading: false,
      loading: false,
      value1: 0,
      value2: 'a',
      option1: [
        { text: '全部交易对', value: 0 },
      ],
      option2: [
        { text: '只显示进行中', value: 'a' },
        { text: '只显示已完成', value: 'b' },
        // { text: '全部订单', value: 'c' },
      ],
      allList: [],
      list: [],
      item: {},
      itemIndex: -1,
      finished: false,
      page: 0,
      pageSize: 20,

      // 支持的交易对
      pidMarketLists: [],
    }
  },
  computed: {
    ...mapState({
      account: state => state.app.account,
      marketLists: state => state.config.marketLists,
      baseConfig: state => state.sys.baseConfig,
    }),
  },
  watch: {
    account: {
      handler: function ac() {
        this.handleGetOrders()
      },
      deep: true,
      immediate: true,
    },
    marketLists: {
      handler: function ac(newVal, oldVal) {
        if (!newVal.length || (oldVal && newVal.length === oldVal.length)) {
          return
        }
        this.handlerGetMarketLists()
      },
      deep: true,
      immediate: true,
    },
    value1(newVal, oldVal) {
      if (newVal === oldVal) {
        return
      }
      this.page = 1;
      this.allList = [];
      this.list = [];
      this.loading = true;
      this.finished = false;
      if (this.value2 === 'a') {
        this.handleGetOrders()
        return
      }
      this.handleGetSuccessOrders();
    },
    value2(newVal, oldVal) {
      if (newVal === oldVal) {
        return
      }
      this.page = 1;
      this.allList = [];
      this.list = [];
      this.loading = true;
      this.finished = false;
      if (newVal === 'a') {
        this.handleGetOrders()
        return
      }
      this.handleGetSuccessOrders();
    }
  },
  methods: {
    handlerGetMarketLists() {
      const pidMarketLists = []
      const opts = [];
      this.marketLists.forEach((market) => {
        if (!market.pid) {
          return
        }
        pidMarketLists.push(market)
        opts.push({
          text: `${market.symbol1}/${market.symbol0}`,
          value: market.mid
        })
      })
      this.pidMarketLists = pidMarketLists;
      opts.unshift({
        text: '全部交易对', value: 0
      })
      this.option1 = opts;
    },
    // 获取进行中订单
    handleGetOrders() {
      if (!this.account.name || !this.marketLists.length) {
        setTimeout(() => {
          this.handleGetOrders()
        }, 1000);
        return
      }
      this.loading = false;
      this.finished = true;
      this.allList = [];
      this.list = [];
      this.marketLists.forEach(async (market) => {
        if (!market.pid) {
          return
        }
        if (this.value1 !== 0 && market.mid !== this.value1) {
          return
        }
        const params = {
          code: this.baseConfig.pddex,
          scope: market.pid,
          table: 'orders',
          json: true,
          limit: 1000,
          index_position: 3,
          key_type: "i64",
          lower_bound: ` ${this.account.name}`,
          upper_bound: ` ${this.account.name}`,
        }
        const {status, result} = await this.$api.get_table_rows(params);
        if (!status) {
          return
        }
        const lists = result.rows || [];
        lists.forEach(v => {
          const arr = v.quantity.split(' ');
          if (arr[1] === market.symbol0) {
            this.$set(v, 'isBuy', true)
            const amt = arr[0]
            this.$set(v, 'amt', amt)
            const oDate = toLocalTime(`${v.time}.000+0000`)
            this.$set(v, 'oDate', oDate)
            const orderNum = v.min_out / 10 ** market.decimal1;
            this.$set(v, 'orderNum', toFixed(orderNum, market.decimal1))
            const orderPrice = dealPrice( v.price / 1000000);
            this.$set(v, 'orderPrice', orderPrice)
          } else {
            this.$set(v, 'isBuy', false)
            const orderNum = arr[0]
            this.$set(v, 'orderNum', orderNum)
            const orderPrice = dealPrice( v.price / 1000000);
            this.$set(v, 'orderPrice', orderPrice)
            const oDate = toLocalTime(`${v.time}.000+0000`)
            this.$set(v, 'oDate', oDate)
            const amt = v.min_out / 10 ** market.decimal0
            this.$set(v, 'amt', toFixed(amt, market.decimal0))
          }
          this.$set(v, 'symbol0', market.symbol0)
          this.$set(v, 'symbol1', market.symbol1)
        });
        // console.log(lists)
        this.allList.push(...lists)
        this.list.push(...lists)
      });
      // console.log(this.list)
    },
    // 获取已完成订单
    async handleGetSuccessOrders() {
      if (!this.account.name || !this.marketLists.length) {
        return
      }
      const params = {
        user: this.account.name,
        page: this.page,
        limit: this.pageSize,
        // sym: 'LOOT'
      }
      if (this.value1 !== 0) {
        const market = this.marketLists.find(v => v.mid == this.value1)
        params.sym = market.symbol1;
      }
      const {status, result} = await this.$api.orderLists(params);
      // 加载状态结束
      this.loading = false;
      if (!status) {
        return
      }
      const lists = result.data || [];
      lists.forEach(v => {
        const market = this.marketLists.find(vv => {
          if (v.dex === 'defisswapcnt') {
            return vv.mid == v.mid
          }
          if (v.dex === "swap.defi") {
            return vv.boxMid == v.mid
          }
        });
        if (!market) {
          return;
        }
        if (market.symbol0 === v.sym0) {
          this.$set(v, 'isBuy', true)
          const orderNum = v.amount1;
          this.$set(v, 'orderNum', toFixed(orderNum, market.decimal1))
          const amt = v.amount0;
          this.$set(v, 'amt', toFixed(amt, market.decimal0))
          const orderPrice = dealPrice( v.amount0 / v.amount1);
          this.$set(v, 'orderPrice', orderPrice)

          this.$set(v, 'symbol0', v.sym0)
          this.$set(v, 'symbol1', v.sym1)
        } else {
          this.$set(v, 'isBuy', false)
          const orderNum = v.amount0;
          this.$set(v, 'orderNum', toFixed(orderNum, market.decimal1))
          const amt = v.amount1;
          this.$set(v, 'amt', toFixed(amt, market.decimal0))
          const orderPrice = dealPrice( v.amount1 / v.amount0);
          this.$set(v, 'orderPrice', orderPrice)

          this.$set(v, 'symbol0', v.sym1)
          this.$set(v, 'symbol1', v.sym0)
        }
        let t = moment(`${v.create_time}`).valueOf()
        t += 3600 * 8 * 1000;
        const oDate = toLocalTime(t)
        this.$set(v, 'oDate', oDate)
      });
      this.allList.push(...lists)
      this.list.push(...lists)

      // 数据全部加载完成
      if (lists.length < this.pageSize) {
        this.finished = true;
      }
    },
    handleClose() {
      this.showCancel = false;
    },
    handleCancel(item, index) {
      this.showCancel = true;
      this.item = item;
      this.itemIndex = index;
    },
    hanldeSuccess(index) {
      this.showCancel = false;
      if (index !== -1) {
        this.list.splice(index, 1)
      }
    },
    onRefresh() {
      setTimeout(() => {
        this.$toast('刷新成功');
        this.isLoading = false;
      }, 3000);
    },
    onLoad() {
      if (this.value2 === 'a') {
        this.loading = false;
        this.finished = true;
        return
      }
      setTimeout(() => {
        this.page += 1;
        this.handleGetSuccessOrders()
      }, 500);
    }
  }
}
</script>

<style lang="scss" scoped>

.green{
  color: #29d4b0;
}
.yellow{
  color: #f29949;
}
.red{
  color: #FE3B37;
}
.order{
  font-size: 28px;
  color: #000;
  .title{
    z-index: 2;
    background: #FFF;
    font-size: 33px;
    height: 80px;
  }
  .tools{
    padding: 10px 20px;
    .switch{
      margin-left: 10px;
    }
  }
  /deep/ .van-dropdown-menu__bar{
    box-shadow: none;
  }
  .orderLists{
    min-height: 50vh;
    .noData{
      padding: 100px 0;
      font-size: 27px;
      .noDataPng{
        height: 400px;
      }
    }
    .list{
      // height: 300px;
      padding: 20px;
      margin: 20px;
      background: #FFF;
      border-radius: 15px;;
      box-shadow: 0px 10px 20px 0px rgba(220,220,220,0.5);
      .symbol{
        font-size: 30px;
        font-weight: 500;
      }
      .van-button{
        height: 60px;
      }
      .liTitle{
        margin-bottom: 20px;
      }
      .subTitle{
        font-size: 24px;
      }
      .num{
        font-size: 30px;
      }
      .source{
        .dex{
          width: 42px;
        }
      }
    }
  }
  .van-popup--center{
    top: 30vh;
  }
}
</style>
