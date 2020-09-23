<template>
  <div>
    <div class="tabView">
      <div class="tabC">
        <tabs />
        <div class="symData">
          <div class="sym0Data" :class="{'focus': payIptFocus}">
            <div class="info flexb">
              <span @click="handleClickBalan('pay')">{{ $t('public.balance') }}: {{ balanceSym0 }} {{ thisMarket0.symbol }}</span>
              <span class="type">{{ $t('dex.pay') }}</span>
            </div>
            <div class="iptDiv flexb">
              <div class="coinInfo flex" @click="listenShowDrawer('start')">
                <div class="coinImg"><img width="100%" :src="thisMarket0.imgUrl" :onerror="errorCoinImg" alt=""></div>
                <div>
                  <div class="coin">{{ thisMarket0.symbol }} <i class="el-icon-arrow-down"></i></div>
                  <div class="contract tip">{{ thisMarket0.contract }}</div>
                </div>
              </div>
              <div class="inputDiv">
                <el-input class="elIpt" type="number" v-model="payNum" placeholder="0.0"
                  @input="handleInBy('pay')"
                  @focus="handleFocus('pay')"
                  @blur="handleBlur('pay')"></el-input>
              </div>
            </div>
          </div>
        </div>
        <div class="exchange">
          <div class="border flexc" :class="{'payFocus': payIptFocus, 'getFocus': getIptFocus}" @click="handleExchange">
            <img class="iconImg" v-if="!direction" src="@/assets/img/dex/switch_down.svg">
            <img class="iconImg" v-else src="@/assets/img/dex/switch_up.svg">
          </div>
        </div>
        <div class="sym0Data pdb10" :class="{'focus': getIptFocus}">
          <div class="info flexb">
            <span class="ableGet" @click="handleClickBalan('get')">{{ $t('public.balance') }}: {{ balanceSym1 }} {{ thisMarket1.symbol }}</span>
            <span class="type">{{ $t('dex.obtain') }}</span>
          </div>
          <div class="iptDiv flexb">
            <div class="coinInfo flex" @click="listenShowDrawer('end')">
              <div class="coinImg"><img width="100%" :src="thisMarket1.imgUrl" :onerror="errorCoinImg" alt=""></div>
              <div>
                <div class="coin">{{ thisMarket1.symbol }} <i class="el-icon-arrow-down"></i></div>
                <div class="contract tip">{{ thisMarket1.contract }}</div>
              </div>
            </div>
            <div class="inputDiv">
              <el-input class="elIpt" type="number" v-model="getNum" placeholder="0.0"
                @input="handleInBy('get')"
                @focus="handleFocus('get')"
                @blur="handleBlur('get')"></el-input>
            </div>
          </div>
        </div>

        <div class="rate flexb">
          <span class="tip flex">
            <span>{{ $t('dex.rate') }}</span>
            <!-- <span class="flexa" @click="exRate =!exRate">
              <img class="iconImg small" v-if="!exRate" src="@/assets/img/dex/price_switch_icon_btn_left.svg" alt="">
              <img class="iconImg small" v-else src="@/assets/img/dex/price_switch_icon_btn_right.svg" alt="">
            </span> -->
          </span>
          <span class="flexend" v-loading="refreshLoading">
            <span v-if="!exRate">1{{ thisMarket1.symbol }} = {{ tradeInfo.aboutPrice || '-' }}{{ thisMarket0.symbol }}</span>
            <span v-else>1{{ thisMarket0.symbol }} = {{ tradeInfo.aboutPriceSym0 || '-' }}{{ thisMarket1.symbol }}</span>
            <!-- <img @click="handleDealPrice" class="refresh" src="@/assets/img/dex/refresh.svg" alt=""> -->
            <span class="flexa" @click="exRate =!exRate">
              <img class="iconImg small" v-if="!exRate" src="@/assets/img/dex/price_switch_icon_btn_left.svg" alt="">
              <img class="iconImg small" v-else src="@/assets/img/dex/price_switch_icon_btn_right.svg" alt="">
            </span>
          </span>
        </div>
      </div>
      <!-- 价格滑点等 -->
      <el-collapse-transition>
        <div class="tabB" v-show="showDetail">
          <div class="flexb">
            <span class="flexb">
              <span class="tip">{{ $t('dex.minGet') }}</span>
              <el-popover
                class="flexc"
                popper-class="mypopper"
                placement="top-start"
                trigger="click">
                <!-- 你的交易将会回滚，如果在确认前有很大的价格变化 -->
                <div class="qusTip">{{ $t('dex.qusTip1') }}</div>
                <span slot="reference" class="flexc ml10"><img width="100%" src="@/assets/img/dex/tips_icon_btn.svg" alt=""></span>
              </el-popover>
            </span>
            <span>{{ tradeInfo.minOut }}</span>
          </div>
          <div class="flexb">
            <span class="flex">
              <span class="tip">{{ $t('dex.priceSlip') }}</span>
              <el-popover
                class="flexc"
                popper-class="mypopper"
                placement="top-start"
                trigger="click">
                <!-- 根据交易量的多少，成交价与市价的差异 -->
                <div class="qusTip">{{ $t('dex.qusTip2') }}</div>
                <span slot="reference" class="flexc ml10"><img width="100%" src="@/assets/img/dex/tips_icon_btn.svg" alt=""></span>
              </el-popover>
            </span>
            <span class="green"
              :class="{'yellow': Number(tradeInfo.priceRate) > 5,
                       'red': Number(tradeInfo.priceRate) > 10}">
              {{ tradeInfo.priceRate }}%
            </span>
          </div>
          <div class="flexb" :class="{'fee': !(weight || useBank)}">
            <span class="flex">
              <span class="tip">{{ $t('public.fee') }}</span>
              <el-popover 
                class="flexc"
                popper-class="mypopper"
                placement="top-start"
                trigger="click">
                <!-- 每笔交易的（0.30%）会给到流动性提供者 -->
                <div class="qusTip">{{ $t('dex.qusTip3') }}</div>
                <span slot="reference" class="flexc ml10"><img width="100%" src="@/assets/img/dex/tips_icon_btn.svg" alt=""></span>
              </el-popover>
            </span>
            <span>{{fees}} {{ thisMarket0.symbol }}</span>
          </div>
          <div class="flexb fee" v-if="(weight && Number(reward)) || useBank">
            <span class="tip">{{ $t('mine.mineBonus') }}</span>
            <span>{{ reward }} DFS</span>
          </div>
        </div>
      </el-collapse-transition>
    </div>

    <div class="flexa flexe" v-if="marketLists.length && bestPath">
      <span class="history" @click="handleToHistory">{{ $t('dex.tradeHistory') }}></span>
    </div>

    <div class="btnDiv">
      <div class="btn flexc" v-loading="loading" @click="handleSwapTrade">{{ $t('tab.dex') }}</div>
    </div>

    <div class="routePath" v-if="useBank">
      <div class="flexb">
        <div>
          <span>{{ $t('dex.bankFor') }}</span>
        </div>
        <div class="flexa usddTip" v-if="showTip" @click="showUsddTip = true">
          <img class="tipIcon" src="@/assets/img/dex/tip.svg" alt="">
          <span>{{ $t('public.warmPrompt') }}</span>
        </div>
      </div>
      <div class="tip bankTip">{{ $t('dex.bankForTip') }}</div>
    </div>
    <div class="pool" v-else-if="marketLists.length && bestPath">
      <div class="flexb">
        <div>
          <span>{{ $t('dex.poolNum') }}</span>
          <span class="marketNow" @click="handleToMarketNow">{{ $t('dex.marketNow') }} ></span>
        </div>
        <div class="flexa usddTip" v-if="showTip" @click="showUsddTip = true">
          <img class="tipIcon" src="@/assets/img/dex/tip.svg" alt="">
          <span>{{ $t('public.warmPrompt') }}</span>
        </div>
      </div>
      <div class="poolsNum">
        {{ bestPath.reserve0 }} / {{ bestPath.reserve1 }}
      </div>
    </div>
    <div v-else-if="routePath" class="routePath">
      <div class="flexb">
        <div>{{ $t('dex.moreRoute') }}： </div>
        <div class="flexa usddTip" v-if="showTip" @click="showUsddTip = true">
          <img class="tipIcon" src="@/assets/img/dex/tip.svg" alt="">
          <span>{{ $t('public.warmPrompt') }}</span>
        </div>
      </div>
      <div class="flexw">
        <span v-for="(item, i) in routePath" :key="i" class="flexc coin">
          <img class="coinUrl" :onerror="errorCoinImg"
            :src="handleDealRouteImg(item)">
          <span>{{ item.split(':')[1] }}</span>
          <span v-if="routePath.length - 1 !== i" class="el-icon-arrow-right"></span>
        </span>
      </div>
    </div>

    <!-- 弹窗组件 -->
    <el-dialog
      class="mkListDia pcList"
      :show-close="false"
      :visible.sync="showMarketList">
      <market-list :marketLists="marketLists" :thisMarket0="thisMarket0"
        :thisMarket1="thisMarket1" :type="type"
        @listenMarketChange="handleMarketChange"
        @listenClose="handleClose"/>
    </el-dialog>
    <el-dialog
      class="mkListDia pcList"
      :show-close="true"
      :visible.sync="showUsddTip">
      <usdd-tip />
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { SwapRouter } from '@/utils/swap_router';
import Tabs from '../index/components/Tabs';
import { toFixed, accMul, accDiv, accSub, getPrice, GetUrlPara } from '@/utils/public';
import { EosModel } from '@/utils/eos';
import MarketList from '@/components/MarketList';
import UsddTip from '@/components/UsddTip';

export default {
  name: 'swap',
  components: {
    Tabs,
    MarketList,
    UsddTip
  },
  data() {
    return {
      discount: 0.2, // 配置项 - 后期从合约拿
      loading: false,
      errorCoinImg: 'this.src="https://ndi.340wan.com/eos/eosio.token-eos.png"',
      payNum: '',
      getNum: '',
      payIptFocus: false,
      getIptFocus: false,
      exRate: false,
      coinList: [],
      tradeInfo: {},
      slipPointUser: '1',
      direction: false,
      routeArr: [],
      balanceSym0: '0.0000',
      balanceSym1: '0.0000',
      timer: null,
      priceTimer: null,
      price: 2.7,
      showMarketList: false,
      showUsddTip: false,
      type: 'pay',
      thisCoinsPath: '', // 币种路由路径
      thisMidsPath: '', // Mids路由路径
      thisMarket0: {
        mid: 17,
        last_update: "2020-05-14T06:49:27",
        liquidity_token: 2509980,
        price_cumulative_last: "10524156827",
        price_last: "2.52539999999999987",
        contract: "eosio.token",
        decimal: "4",
        reserve: "",
        sym: "4,EOS",
        symbol: "EOS",
      }, // 当前选中的做市池子
      thisMarket1: {
        mid: 17,
        last_update: "2020-05-14T06:49:27",
        liquidity_token: 2509980,
        price_cumulative_last: 1513579653,
        price_last: "0.39589999999999997",
        contract: "tethertether",
        decimal: "4",
        reserve: "",
        sym: "4,USDT",
        symbol: "USDT",
      },
      firstUrl: true,
      refreshLoading: false,
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
  computed: {
    ...mapState({
      scatter: state => state.app.scatter,
      slipPoint: state => state.app.slipPoint,
      baseConfig: state => state.sys.baseConfig,
      dfsPrice: state => state.sys.dfsPrice,
      weightList: state => state.sys.weightList, // 交易对权重列表
      // aprs: state => state.sys.aprs,
      damping: state => state.sys.damping,
    }),
    showDetail() {
      return Number(this.payNum) && Number(this.getNum)
    },
    fees() {
      if (this.useBank) {
        return 0
      }
      let fee = accMul(Number(this.payNum), 0.003);
      if (Number(fee) < Number(accDiv(1, 10 ** this.thisMarket0.decimal))) {
        fee = 0;
      }
      return fee
    },
    bestPath() {
      const path = this.thisMidsPath;
      const pathArr = path.split('-');
      const showPool = pathArr.length <= 1;
      if (!showPool) {
        return ''
      }
      const haspool = this.marketLists.find(v => (v.mid === Number(path)))
      // console.log(haspool)
      return haspool;
    },
    routePath() {
      const path = this.thisCoinsPath;
      // console.log(path)
      if(!path) {
        return false
      }
      const pathArr = path.split('-')
      return pathArr
    },
    weight() {
      if (!this.weightList.length || !this.bestPath) {
        return 0
      }
      const weiData = this.weightList.find(v => v.mid === this.bestPath.mid);
      if (!weiData) {
        return 0
      }
      return Number(weiData.pool_weight)
    },
    reward() {
      if (this.useBank) {
        if (this.thisMarket1.symbol !== 'USDD' || this.thisMarket1.contract !== 'bankofusddv1') {
          return '0'
        }
        let amount = accMul(this.getNum, 3);
        amount = accDiv(amount, 1000);
        amount = accDiv(amount, this.price);
        let reward = amount / this.dfsPrice * this.discount * this.damping;
        reward = accMul(reward, 0.8)
        return toFixed(reward, 4)
      }
      if (!this.bestPath) {
        return '0.0000';
      }
      let amount = '0'
      if (!(this.thisMarket0.symbol === 'EOS' && this.thisMarket0.contract === 'eosio.token')) {
        return '0.0000'
      }
      amount = this.payNum;
      amount = accMul(amount, 3);
      amount = accDiv(amount, 1000)
      let reward = amount / this.dfsPrice * this.discount * this.damping * this.weight;
      reward = accMul(reward, 0.8);
      return toFixed(reward, 4)
    },
    showTip() {
      if (this.thisMarket1.contract === 'bankofusddv1' && this.thisMarket1.symbol === 'USDD') {
        return true
      }
      return false
    },
    useBank() {
      if ((this.thisMarket0.contract === 'tethertether' && this.thisMarket0.symbol === 'USDT') &&
          (this.thisMarket1.contract === 'bankofusddv1' && this.thisMarket1.symbol === 'USDD')) {
        return true
      }
      return false
    }
  },
  watch: {
    slipPoint: {
      handler: function sl(newVal) {
        this.slipPointUser = newVal;
        this.handleInBy(this.tradeInfo.type)
      },
      immediate: true,
    },
    marketLists: {
      handler: function marketList(newVal) {
        // console.log(newVal)
        if (!newVal.length) {
          return
        }
        const newArr = newVal.filter(v => v.contract1 !== 'autopuptoken' && v.contract0 !== 'autopuptoken')
        SwapRouter.init(newArr, this)
        const arr = this.handleDealSymArr(newVal)
        this.coinList = arr;
        if (!arr.length) {
          return;
        }
        // this.handleGetUrlInAndOut()
        const market0 = arr.find(v => v.contract === this.thisMarket0.contract && v.symbol === this.thisMarket0.symbol) || arr[0]
        this.thisMarket0 = market0;
        const market1 = arr.find(v => v.contract === this.thisMarket1.contract && v.symbol === this.thisMarket1.symbol) || arr[1]
        // const market1 = arr[1]
        this.thisMarket1 = market1;
        this.handleInBy(this.tradeInfo.type, 'first')
        this.refreshLoading = false;
      },
      immediate: true,
      deep: true
    },
    scatter: {
      handler: function listen(newVal) {
        if (newVal.identity) {
          this.handleBalanTimer();
        }
      },
      deep: true,
      immediate: true,
    },
    payNum(newVal, oldVal) {
      if (Number(newVal) < 0) {
        this.payNum = oldVal;
      }
    },
  },
  created() {
    this.handleGetUrlInAndOut()
    this.handleInBy(this.tradeInfo.type, 'first')
  },
  mounted() {
    this.handleGetPrice()
    clearInterval(this.priceTimer)
    this.priceTimer = setInterval(() => {
      this.handleGetPrice()
    }, 60000)
  },
  beforeDestroy() {
    clearInterval(this.timer)
    clearInterval(this.priceTimer)
    this.handleSetMarkets();
  },
  methods: {
    handleToHistory() {
      this.$router.push({
        name: 'history',
        params: {
          mid: this.bestPath.mid
        }
      })
    },
    handleSetMarkets() {
      const swapMarkets = {
        thisMarket0: this.thisMarket0,
        thisMarket1: this.thisMarket1,
        thisCoinsPath: this.thisCoinsPath,
        thisMidsPath: this.thisMidsPath,
      }
      // console.log(JSON.stringify(this.thisMidsPath))
      localStorage.setItem('swapMarkets', JSON.stringify(swapMarkets))
    },
    handleGetUrlInAndOut() {
      const urlData = GetUrlPara();
      if (urlData.in && urlData.out && this.firstUrl) {
        try {
          this.firstUrl = false;
          const inData = urlData.in.split('-');
          const sym0 = {
            contract: inData[0],
            decimal: "4",
            symbol: inData[1].toUpperCase(),
          }
          this.thisMarket0 = sym0;
          const outData = urlData.out.split('-');
          const sym1 = {
            contract: outData[0],
            decimal: "4",
            symbol: outData[1].toUpperCase(),
          }
          this.thisMarket1 = sym1;
          return
        } catch (error) {
          console.log(error)
        }
        return
      }
      const localData = localStorage.getItem('swapMarkets') ? JSON.parse(localStorage.getItem('swapMarkets')) : null;
      // console.log(localData)
      if (localData) {
        this.thisMarket0 = localData.thisMarket0;
        this.thisMarket1 = localData.thisMarket1;
        this.thisCoinsPath = localData.thisCoinsPath;
        this.thisMidsPath = localData.thisMidsPath;
      }
    },
    // 获取60秒均价
    handleGetPrice() {
      getPrice((price) => {
        this.price = price;
      })
    },
    handleDealRouteImg(item) {
      const localeCoin = ['eosio.token-eos', 'bankofusddv1-usdd'];
      const localCoinPng = ['hbbguanfang5-hbb', 'cynthiacaoyi-cbed', 'huangheeos.e-jcb', 'buyniubinbbb-nbb',
      'yfctokenmain-yfc', 'eossanguotkt-tkt', 'pink.bank-pink', 'dbctokenmain-dbc', 'looptoken123-loop']
      const inData = item.toLowerCase().replace(':', '-')
      const has = localeCoin.find(v => v === inData)
      if (has) {
        return `https://apps.defis.network/static/coin/${has}.svg`;
      }
      const hasPng = localCoinPng.find(v => v === inData);
      if (!has && hasPng) {
        return `https://apps.defis.network/static/coin/${hasPng}.png`;
      }
      return `https://ndi.340wan.com/eos/${inData}.png`
    },
    handleClickBalan(type) {
      if (type === 'pay') {
        this.payNum = this.balanceSym0;
        this.handleInBy('pay')
        return
      }
      this.getNum = this.balanceSym1;
      this.handleInBy('get')
    },
    handleToMarketNow() {
      this.$router.push({
        name: 'market',
        params: {
          mid: this.bestPath.mid
        }
      })
    },
    handleClose() {
      this.showMarketList = false
    },
    listenShowDrawer(type) {
      this.type = type;
      // this.$emit('listenShowDrawer', false)
      this.showMarketList = true
    },
    // 处理所有币种
    handleDealSymArr(lists = []) {
      const resArr = [];
      lists.forEach((v) => {
        resArr.push(v.sym0Data, v.sym1Data)
      })
      // 删除重复项
      const newArr = resArr.filter((item, index, self) => {
        const i = self.findIndex(v => v.contract === item.contract && v.symbol === item.symbol);
        return self.indexOf(item) === i;
      })
      return newArr
    },
    handleInBy(type = 'pay', status) {
      const inData = {
        direction: this.direction,
        type,
        slipPointUser: accDiv(Number(this.slipPointUser), 100), // 滑点保护
      }
      if (type === 'pay') {
        inData.payNum = this.payNum || `${toFixed(1, this.thisMarket0.decimal)}`;
      } else {
        inData.getNum = this.getNum || `${toFixed(1, this.thisMarket1.decimal)}`;
      }
      if (this.useBank) {
        if (status === 'first') {
          return;
        }
        (type === 'pay') ? this.getNum = toFixed(this.payNum, this.thisMarket1.decimal)
                            : this.payNum = toFixed(this.getNum, this.thisMarket0.decimal)
        this.tradeInfo = {
          aboutPrice: '1.000000',
          aboutPriceSym0: '1.000000',
          type,
          minOut: toFixed(this.getNum, this.thisMarket0.decimal),
          price: '1.000000',
          priceRate: '0.00',
        }
        return
      }
      try {
        // console.log(inData)
        const outData = this.handleDealAmountOut(inData);
        // console.log(outData)
        // in & out 都是0，非焦点ipt置空
        if (!Number(outData.payNum) && !Number(outData.getNum)) {
          if (type === 'pay') {
            this.getNum = '';
          } else {
            this.payNum = '';
          }
          return;
        }
        this.tradeInfo = outData;
        // 第一次计算价格
        if (status === 'first') {
          return;
        }
        // 支付框输入为空 || 获取框输入为空，两个输入框直接清空
        if ((type === 'pay' && this.payNum === '') || (type !== 'pay' && this.getNum === '')) {
          this.payNum = '';
          this.getNum = '';
          return;
        }
        type === 'pay' ? this.getNum = toFixed(outData.getNum, this.thisMarket1.decimal) :
                         this.payNum = toFixed(outData.payNum, this.thisMarket0.decimal);
      } catch (error) {
        // console.log(error)
        setTimeout(() => {
          this.handleInBy(this.tradeInfo.type)
        }, 200);
        this.tradeInfo = {}
        if (type === 'pay') {
          this.getNum = '';
        } else {
          this.payNum = '';
        }
        this.tradeInfo.aboutPrice = toFixed(0, this.thisMarket0.decimal)
      }
    },
    // 计算得到多少 - 正序 - 输入支付
    handleDealAmountOut(inData) {
      // 没有输入支付数量 & 得到数量时 - 返回默认配置
      if (!Number(inData.payNum) && !Number(inData.getNum)) {
        const outData = {
          type: inData.type,
        }
        return outData
      }
      const m0 = this.thisMarket0
      const m1 = this.thisMarket1
      const params0 = `${m0.contract}:${m0.symbol}`
      const params1 = `${m1.contract}:${m1.symbol}`
      const path = SwapRouter.get_paths(params0, params1, inData.type)
      const params = [
        path,
        inData.type === 'pay' ? params0 : params1,
      ]
      if (inData.type === 'pay') {
        params.push(accMul(inData.payNum, 10 ** this.thisMarket0.decimal))
      } else {
        params.push(accMul(inData.getNum, 10 ** this.thisMarket1.decimal))
        params.push(inData.type)
      }
      const res = SwapRouter.get_amounts_out(...params)
      // console.log(res)
      const payNum = inData.type === 'pay' ? inData.payNum : res.quantity_out.split(' ')[0];
      const getNum = inData.type === 'pay' ? res.quantity_out.split(' ')[0] : inData.getNum;
      this.thisCoinsPath = res.bestPath;
      this.thisMidsPath = inData.type === 'pay' ? res.mid : res.mid.split('-').reverse().join('-');
      let minOut = 0;
      // console.log('quantity_out - ', res.quantity_out)
      // console.log('price - ', res.price)
      // console.log('slipPointUser - ', inData.slipPointUser)
      // console.log('payNum - ', payNum)
      minOut = res.price * (1 - inData.slipPointUser) * payNum * 0.997;
      minOut = toFixed(minOut, this.thisMarket1.decimal)

      let aboutPrice = res.swapOutPrice;
          aboutPrice = toFixed(aboutPrice, Number(this.thisMarket0.decimal) + 2)
      let aboutPriceSym0 = res.swapInPrice;
          aboutPriceSym0 = toFixed(aboutPriceSym0, Number(this.thisMarket1.decimal) + 2)
      // console.log(aboutPriceSym0, res.price)
      let priceRate = accDiv(res.swapInPrice, res.price);
          priceRate = accSub(1, priceRate)
          priceRate = accMul(priceRate, 100)
      if (Number(priceRate) < 0) {
        priceRate = '0.00000000';
      }
      priceRate = toFixed(priceRate, 2)
      const obj = {
        payNum,
        getNum,
        aboutPrice,
        aboutPriceSym0,
        type: inData.type,
        minOut,
        price: res.price,
        priceRate,
        thisCoinsPath: this.thisCoinsPath,
        thisMidsPath: this.thisMidsPath,
      }
      // console.log(obj)
      return obj
    },
    handleReg() {
      if (!Number(this.payNum)) {
        return false;
      }
      const balance = Number(this.balanceSym0);
      if (Number(this.payNum) > balance) {
        this.$message({
          type: 'error',
          message: this.$t('public.balanLow')
        })
        return false;
      }
      if (Number(this.slipPoint) < Number(this.tradeInfo.priceRate)) {
        this.$message({
          type: 'error',
          message: this.$t('dex.heightSlip')
        })
        return false;
      }
      return true
    },
    handleToBank() {
      if (this.useBank) {
        this.handleTransfer()
        return false
      }
      return true
    },
    // 铸币
    handleTransfer() {
      this.loading = true;
      const memo = this.thisMarket0.symbol === 'USDD' ? 'burn' : 'mint';
      const params = {
        code: this.thisMarket0.contract,
        toAccount: this.baseConfig.toAccountJin,
        memo,
        quantity: `${this.payNum} ${this.thisMarket0.symbol}`
      }
      EosModel.transfer(params, (res) => {
        this.loading = false;
        if(res.code && JSON.stringify(res.code) !== '{}') {
          this.$message({
            message: res.message,
            type: 'error'
          });
          return
        }
        this.payNum = '';
        this.getNum = '';
        this.handleInBy(this.tradeInfo.type, 'first')
        this.handleBalanTimer();
        this.$message({
          message: this.$t('public.success'),
          type: 'success'
        });
      })
    },
    // swap交易
    handleSwapTrade() {
      if (this.loading) {
        return
      }
      if (!this.handleReg()) {
        return
      }
      if (!this.handleToBank()) {
        return
      }
      this.loading = true;
      const path = this.thisMidsPath

      const tradeCoin = this.thisMarket0.symbol;
      const minOutDecimal = this.thisMarket1.decimal;
      const params = {
        code: this.thisMarket0.contract,
        toAccount: this.baseConfig.toAccountSwap,
        memo: `swap:${path}:${accMul(toFixed(this.tradeInfo.minOut, minOutDecimal), (10 ** minOutDecimal))}`,
        quantity: `${this.payNum} ${tradeCoin}`
      }
      const inviAcc = localStorage.getItem('inviAcc') ? JSON.parse(localStorage.getItem('inviAcc')) : '';
      if (inviAcc) {
        params.memo = `${params.memo}:${inviAcc.id}`
      }
      // console.log(params)
      EosModel.transfer(params, (res) => {
        this.loading = false;
        if(res.code && JSON.stringify(res.code) !== '{}') {
          this.$message({
            message: res.message,
            type: 'error'
          });
          return
        }
        this.handleDealPrice()
        this.payNum = '';
        this.getNum = '';
        setTimeout(() => {
          this.handleInBy(this.tradeInfo.type, 'first')
          this.handleBalanTimer();
        }, 200);
        this.$message({
          message: this.$t('public.success'),
          type: 'success'
        });
      })
    },
    handleDealPrice() {
      this.refreshLoading = true;
      setTimeout(() => {
        // console.log('重新查列表')
        this.$emit('listenUpdateList', true)
      }, 500);
    },
    handleExchange() {
      this.direction = !this.direction;
      const t = this.thisMarket0;
      this.thisMarket0 = this.thisMarket1;
      this.thisMarket1 = t;
      this.payNum = '';
      this.getNum = '';
      this.tradeInfo = {};
      const b = this.balanceSym0;
      this.balanceSym0 = this.balanceSym1;
      this.balanceSym1 = b;
      // console.log(this.thisMarket0)
      // console.log(this.thisMarket1)
      this.handleInBy(this.tradeInfo.type, 'first')
      this.handleSetMarkets();
    },
    handleFocus(type = 'pay') {
      type === 'pay' ? this.payIptFocus = true : this.getIptFocus = true
      const num = type === 'pay' ? Number(this.payNum) : Number(this.getNum);
      if (!num) {
        type === 'pay' ? this.payNum = '' : this.getNum = '';
        return
      }
      type === 'pay' ? this.payNum = Number(this.payNum) : this.getNum = Number(this.getNum);
    },
    handleBlur(type = 'pay') {
      type === 'pay' ? this.payIptFocus = false : this.getIptFocus = false
      if (type === 'pay' && this.payNum === '') {
        return
      }
      if (type !== 'pay' && this.getNum === '') {
        return
      }
      type === 'pay' ? this.payNum = toFixed(Number(this.payNum), this.thisMarket0.decimal)
                     : this.getNum = toFixed(Number(this.getNum), this.thisMarket1.decimal);
    },
    // 重启余额定时器
    handleBalanTimer() {
      clearInterval(this.timer);
      this.handleGetBalance();
      this.handleGetBalance('next');
      this.timer = setInterval(() => {
        this.handleGetBalance();
        this.handleGetBalance('next');
      }, 20000)
    },
    // 获取账户余额
    async handleGetBalance(next) {
      const params = {
        code: this.thisMarket0.contract,
        coin: this.thisMarket0.symbol,
        decimal: this.thisMarket0.decimal
      };
      if (next) {
        params.code = this.thisMarket1.contract;
        params.coin = this.thisMarket1.symbol;
        params.decimal = this.thisMarket1.decimal;
      }
      await EosModel.getCurrencyBalance(params, res => {
        let balance = toFixed('0.0000000000001', params.decimal);
        (!res || res.length === 0) ? balance : balance = res.split(' ')[0];
        if (next) {
          if (params.coin !== this.thisMarket1.symbol || params.code !== this.thisMarket1.contract) {
            this.handleGetBalance(next)
            return
          }
          this.balanceSym1 = balance;
          return;
        }
        if (params.coin !== this.thisMarket0.symbol || params.code !== this.thisMarket0.contract) {
          this.handleGetBalance()
          return
        }
        this.balanceSym0 = balance;
      })
    },
    handleMarketChange(item, type) {
      if (type === 'start') {
        this.thisMarket0 = item;
      } else {
        this.thisMarket1 = item;
      }
      this.payNum = '';
      this.getNum = '';
      this.handleInBy(this.tradeInfo.type, 'first')
      this.handleBalanTimer();
      this.handleClose()
      this.handleSetMarkets();
    }
  },
}
</script>

<style lang="scss" scoped>
@keyframes turn{
  0%{-webkit-transform:rotate(0deg);}
  25%{-webkit-transform:rotate(90deg);}
  50%{-webkit-transform:rotate(180deg);}
  75%{-webkit-transform:rotate(270deg);}
  100%{-webkit-transform:rotate(360deg);}
}
.refresh{
  // font-size: 33px;
  margin-left: 8px;
  width: 30px;
  height: 30px;
  display: inline-block;
  border-radius: 30px;
  // animation:turn 1s linear infinite;
}
.mypopper{
  .qusTip{
    padding: 10px;
    width: 240px;
    font-size: 24px;
  }
}
.tabView{
  background: #FAFAFA;
  border-radius:30px;
  font-size: 24px;;
  .tabC{
    background:rgba(255,255,255,1);
    border-radius:30px;
    border:2px solid rgba(224,224,224,1);
    padding: 32px 20px;
  }
  .sym0Data{
    padding: 26px 40px 52px;
    border-radius:30px;
    border: 1px solid #F3F3F3;
    &.focus{
      border:1px solid rgba(7,215,155,1);
      // /deep/ .el-input__inner{
      //   color: #07D79B !important;
      // }
    }
    &.pdb10{
      padding-bottom: 28px;
    }
    .info{
      font-size: 24px;
      margin-bottom: 24px;
      .type{
        font-size: 28px;
      }
    }
    .iptDiv{
      .coinInfo{
        text-align: left;
        flex: 1;
        .coinImg{
          width: 60px;
          height: 60px;
          margin-right: 10px;
          border-radius: 60px;
          overflow: hidden;
          display: flex;
        }
        .coin{
          font-size: 28px;
          font-weight: 500;;
          line-height: 30px;
        }
        .contract{
          line-height: 30px;
        }
        .ableGet{
          color: #2F3F52;
        }
      }
      .inputDiv{
        flex: 2;;
        .elIpt{
          /deep/ .el-input__inner{
            color: $color-black;
            border: 0px;text-align: right;
            font-size: 52px;
            padding: 0 0 0 20px;
            height: 62px;
          }
        }
      }
    }
  }
  .exchange{
    height: 20px;
    position: relative;
    .border{
      width: 100px;
      height: 100px;
      border-radius: 50px;
      // border: 1px solid #07D79B;
      position: absolute;
      background: $color-bgcolor;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-image: url('../../assets/img/dex/enter_solid_default.svg');
      background-repeat: no-repeat;
      background-size: cover;
      &.payFocus{
        background-image: url('../../assets/img/dex/enter_solid_up.svg');
        background-repeat: no-repeat;
        background-size: cover;
      }
      &.getFocus{
        background-image: url('../../assets/img/dex/enter_solid_down.svg');
        background-repeat: no-repeat;
        background-size: cover;
      }
      .iconImg{
        width: 72px;
      }
    }
  }
  .rate{
    color: $color-black;
    padding: 0 20px;
    margin-top: 28px;
    font-size: 28px;
    .iconImg{
      width: 30px;
      margin-left: 12px;
    }
    .flexend{
      line-height: 26px;
    }
  }
  .tabB{
    margin: 24px 0;
    padding: 0 40px;
    font-size: 26px;
    color: $color-black;
    .flexb{
      margin-top: 10px;
      &:first-child{
        margin-top: 0px;
      }
    }
    .fee{
      padding-bottom: 24px;
    }
    .ml10{
      width: 28px;
      margin-left: 10px;
    }
    .green{
      color: #02C698;
    }
    .yellow{
      color: #f29949;
    }
    .red{
      color: rgb(255, 104, 113);;
    }
  }
}
.flexe{
  justify-content: flex-end;
  margin: 17px 0 20px;
  .history{
    font-size: 27px;
    color: #07d79b;
  }
}
.btnDiv{
  margin: 20px 0 30px;
  font-size: 32px;
  font-weight: 500;
  .btn{
    height: 88px;
    background:rgba(7,215,155,1);
    border-radius:30px;
    color: #fff;
    &:active{
      background:rgba(2,198,152,1);
    }
  }
}
.usddTip{
  color: #f5a623;
  font-size: 26px;
  .tipIcon{
    width: 32px;
    display: block;
    margin-right: 6px;
  }
}
.pool{
  font-size: 28px;
  text-align: left;
  padding: 20px 40px;
  background:rgba(255,255,255,1);
  border-radius:20px;
  border:2px solid rgba(224,224,224,1);
  .marketNow{
    margin-left: 20px;
    color: #02C698;
  }
  .poolsNum{
    margin-top: 12px;
    color: $color-black;
  }
}
.routePath{
  font-size: 28px;
  text-align: left;
  padding: 20px 40px;
  background:rgba(255,255,255,1);
  border-radius:20px;
  border:2px solid rgba(224,224,224,1);
  .bankTip{
    margin-top: 10px;
    font-size: 24px;
  }
  .flexw{
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
    .coin{
      margin-top: 15px;
      min-width: 30%;
      margin-right: 10px;
      justify-content: flex-start;
    }
  }
  .coinUrl{
    width: 60px;
    height: 60px;
    margin-right: 10px;
    border-radius: 60px;
    overflow: hidden;
  }
}

.mkListDia{
  // animation: none;
  /deep/ .el-dialog{
    position: absolute;
    bottom: 0px;
    margin: 0px;
    width: 100%;
    border-radius:30px 30px 0px 0px;
    .el-dialog__body,
    .el-dialog__header{
      padding: 0;
    }
  }
  &.pcList{
    /deep/ .el-dialog{
      position: relative;
      margin: auto;
      width: 670px;
      border-radius:30px;
    }
  }
}
</style>