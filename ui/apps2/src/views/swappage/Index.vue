<template>
  <div>
    <div class="tabView">
      <div class="tabC">
        <tabs />
        <div class="tabD">
          <div class="symData">
            <div class="sym0Data" :class="{'focus': payIptFocus}">
              <div class="info flexb">
                <span @click="handleClickBalan('pay')">{{ $t('public.balance') }}: {{ balanceSym0 }} {{ thisMarket0.symbol }}</span>
                <span class="type">{{ $t('dex.pay') }}</span>
              </div>
              <div class="iptDiv flexb">
                <div class="coinInfo flex" @click="listenShowDrawer('start')">
                  <div class="coinImg"><img width="100%" :src="thisMarket0.imgUrl" :onerror="errorCoinImg" alt=""></div>
                  <div class="coinMinW">
                    <div class="coin">{{ thisMarket0.symbol }} <i class="el-icon-arrow-down"></i></div>
                    <div class="contract tip">{{ thisMarket0.contract }}</div>
                  </div>
                </div>
                <div class="inputDiv flexb">
                  <el-input class="elIpt dinBold" type="number" v-model="payNum" placeholder="0.0"
                    @input="handleInBy('pay')"
                    @focus="handleFocus('pay')"
                    @blur="handleBlur('pay')"></el-input>
                  <!-- <span v-if="showMax0" @click="handleClickBalan('pay')" class="max flexc">Max</span> -->
                </div>
              </div>
            </div>
          </div>
          <div class="exchange">
            <div class="border flexc" :class="{'payFocus': payIptFocus, 'getFocus': getIptFocus}" @click="handleExchange">
              <img class="iconImg" v-if="!direction" src="https://cdn.jsdelivr.net/gh/defis-net/material/dex/switch_down.svg">
              <img class="iconImg" v-else src="https://cdn.jsdelivr.net/gh/defis-net/material/dex/switch_up.svg">
            </div>
          </div>
          <div class="sym0Data" :class="{'focus': getIptFocus}">
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
              <div class="inputDiv flexb">
                <el-input class="elIpt dinBold" type="number" v-model="getNum" placeholder="0.0"
                  @input="handleInBy('get')"
                  @focus="handleFocus('get')"
                  @blur="handleBlur('get')"></el-input>
                  <!-- <span v-if="showMax1" @click="handleClickBalan('get')" class="max flexc">Max</span> -->
              </div>
            </div>
          </div>

          <div class="rate flexb">
            <span class="tip flex">
              <span>{{ $t('dex.rate') }}</span>
            </span>
            <span class="flexend din" v-loading="refreshLoading">
              <span v-if="!exRate">1{{ thisMarket1.symbol }} = {{ tradeInfo.aboutPrice || '-' }}{{ thisMarket0.symbol }}</span>
              <span v-else>1{{ thisMarket0.symbol }} = {{ tradeInfo.aboutPriceSym0 || '-' }}{{ thisMarket1.symbol }}</span>
              <span class="flexa" @click="exRate =!exRate">
                <img class="iconImg small" v-if="!exRate" src="https://cdn.jsdelivr.net/gh/defis-net/material2/icon/price_switch_icon_btn_left.svg" alt="">
                <img class="iconImg small" v-else src="https://cdn.jsdelivr.net/gh/defis-net/material2/icon/price_switch_icon_btn_right.svg" alt="">
              </span>
            </span>
          </div>
          <div class="btnDiv flexb">
            <div class="btn flexc" v-loading="loading" @click="handleSwapTrade">{{ $t('tab.dex') }}</div>
            <div class="dtokens" v-if="isDtokens" @click="handleToProject('dtoken')">
              <img :src="ptokenData.imgUrl">
              <div>{{ $t('sys.dAndW') }}</div>
            </div>
          </div>

          <div class="linkTo flexb">
            <span class="flexc">
              <img src="https://cdn.jsdelivr.net/gh/defis-net/material/svg/market.svg">
              <span @click="handleTo('myMarketList')">{{ $t('market.myMarkets') }}</span>
              <i class="el-icon-arrow-right"></i>
            </span>
            <span class="flexc">
              <img src="https://cdn.jsdelivr.net/gh/defis-net/material/svg/record.svg">
              <span @click="handleToHistory">{{ $t('dex.tradeHistory') }}</span>
              <i class="el-icon-arrow-right"></i>
            </span>
          </div>
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
                <span slot="reference" class="flexc ml10"><img width="100%" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/tips_icon_btn.svg" alt=""></span>
              </el-popover>
            </span>
            <span class="din">{{ tradeInfo.minOut }}</span>
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
                <span slot="reference" class="flexc ml10"><img width="100%" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/tips_icon_btn.svg" alt=""></span>
              </el-popover>
            </span>
            <span class="flexa" v-if="!isOgxSwap">
              <span class="green din"
                :class="{'yellow': Number(tradeInfo.priceRate) > 5,
                          'red': Number(tradeInfo.priceRate) > 10}">
                {{ tradeInfo.priceRate }}%
              </span>
              <!-- <img class="tradeSet" @click="handleShowTools" src="https://cdn.jsdelivr.net/gh/defis-net/material/svg/swapSet.svg" alt=""> -->
            </span>
            <span v-else>无滑点交易</span>
          </div>
          <div class="flexb">
            <span class="flex">
              <span class="tip">{{ $t('public.fee') }}</span>
              <el-popover 
                class="flexc"
                popper-class="mypopper"
                placement="top-start"
                trigger="click">
                <!-- 每笔交易的（0.30%）会给到流动性提供者 -->
                <div class="qusTip">{{ $t('dex.qusTip3') }}</div>
                <span slot="reference" class="flexc ml10"><img width="100%" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/tips_icon_btn.svg" alt=""></span>
              </el-popover>
            </span>
            <span class="din">{{fees}} {{ thisMarket0.symbol }}</span>
          </div>
          <!-- <div class="flexb" v-if="Number(reward)">
            <span class="flex">
              <span class="tip">{{ $t('mine.mineBonus') }}</span>
              <el-popover 
                class="flexc"
                popper-class="mypopper"
                placement="top-start"
                trigger="click">
                <div class="qusTip">{{ $t('dex.qusTip4') }}</div>
                <span slot="reference" class="flexc ml10"><img width="100%" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/tips_icon_btn.svg" alt=""></span>
              </el-popover>
            </span>
            <span class="din">{{ reward }} DFS</span>
          </div> -->
          <div class="flexb fee">
            <div>
              <span class="flexa" v-if="isMoreRouter" @click="showMoreRouter = true">
                <span class="tip">多路径转换</span>
                <img class="moreRouterIcon" src="https://cdn.jsdelivr.net/gh/defis-net/material2/icon/important.png" alt="">
              </span>
            </div>
            <img class="tradeSet" @click="handleShowTools" src="https://cdn.jsdelivr.net/gh/defis-net/material2/icon/stepupIcon.png" alt="">
          </div>
        </div>
      </el-collapse-transition>
    </div>

    <div class="pool" v-if="isOgxSwap">
      <div> 当前为Organix兑换模式 </div>
      <div class="flexa priceUpdate" v-if="ogxPrices.length">
        <span>价格更新时间: {{ ogxPrices[0].time }}</span>
        <img @click="showOgxTip = true" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/tips_icon_btn.svg" alt="">
      </div>
    </div>
    <div class="pool" v-else-if="marketLists.length && bestPath">
      <div class="flexb">
        <div>
          <span>{{ $t('dex.poolNum') }}</span>
          <span class="marketNow" @click="handleTo('dfsMinePool')">{{ $t('pools.toPool') }} ></span>
        </div>
        <div class="flexa usddTip" v-if="showTip" @click="showUsddTip = true">
          <img class="tipIcon" src="https://cdn.jsdelivr.net/gh/defis-net/material/dex/tip.svg" alt="">
          <span>{{ $t('public.warmPrompt') }}</span>
        </div>
      </div>
      <div class="poolsNum din">
        {{ bestPath.reserve0 }} / {{ bestPath.reserve1 }}
      </div>
    </div>

    <el-dialog
      class="mkListDia pcList"
      :show-close="true"
      :visible.sync="showUsddTip">
      <usdd-tip />
    </el-dialog>

    <SlipPointTools ref="slipPointTools"/>
    
    <el-dialog
      class="mkListDia pcList"
      :show-close="false"
      :visible.sync="showOgxTip">
      <OgxSwapTip />
    </el-dialog>
    

    <van-popup
      class="newMarket"
      v-model="showMarketList"
      position="left">
      <MarketArea v-if="showMarketList"
        :marketLists="marketLists" :type="type"
        @listenMarketChange="handleMarketChange"
        @listenClose="handleClose"/>
    </van-popup>

    <van-popup
      class="popup_p"
      v-model="showMoreRouter">
      <MoreRouter v-if="showMoreRouter"
        :routePath="routePath"
        @listenClose="handleClose"/>
    </van-popup>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { SwapRouter, SwapRouterFilter } from '@/utils/swap_router';
import Tabs from '../index/components/Tabs';
import { toFixed, accMul, accDiv, accSub, getPrice, GetUrlPara, getCoin, dealRouterArr } from '@/utils/public';
import { EosModel } from '@/utils/eos';
import UsddTip from '@/components/UsddTip';
import SlipPointTools from '@/components/SlipPointTools';
import OgxSwapTip from './dialog/OgxSwapTip';
import MarketArea from '@/components/MarketArea';
import MoreRouter from './dialog/MoreRouter';

import { ogx_get_num, ogx_get_prices_table } from './js/ogx.js';

export default {
  name: 'swap',
  components: {
    Tabs,
    UsddTip,
    SlipPointTools,
    OgxSwapTip,
    MarketArea,
    MoreRouter,
  },
  data() {
    return {
      discount: 0.2, // 固定
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

      ogxPrices: [],
      showOgxTip: false,
      showNewMarket: false,
      showMoreRouter: false,

      isMoreRouter: 0, // 交易是否是多路径
    }
  },
  computed: {
    ...mapState({
      scatter: state => state.app.scatter,
      slipPoint: state => state.app.slipPoint,
      baseConfig: state => state.sys.baseConfig,
      dfsPrice: state => state.sys.dfsPrice,
      rankTrade: state => state.sys.rankTrade, // 排名前21的交易对
      filterMkLists: state => state.sys.filterMkLists,
      marketLists: state => state.sys.marketLists,
      rSwitch: state => state.app.rSwitch,
    }),
    isDtokens() {
      if (this.thisMarket0.contract === 'asset.dtoken' && this.thisMarket0.symbol === 'ETH') {
        return this.thisMarket0
      }
      if (this.thisMarket1.contract === 'asset.dtoken' && this.thisMarket1.symbol === 'ETH') {
        return this.thisMarket1
      }
      return false
    },
    ptokenData() {
      if (this.thisMarket0.contract === 'asset.dtoken' && this.thisMarket0.symbol === 'ETH') {
        return this.thisMarket0
      }
      if (this.thisMarket1.contract === 'asset.dtoken' && this.thisMarket1.symbol === 'ETH') {
        return this.thisMarket1
      }
      return {}
    },
    showDetail() {
      return Number(this.payNum) && Number(this.getNum)
    },
    fees() {
      let rate = 0.003
      if (this.isOgxSwap) {
        rate = 0.002
      }
      let fee = accMul(Number(this.payNum), rate);
      if (Number(fee) < Number(accDiv(1, 10 ** this.thisMarket0.decimal))) {
        fee = 0;
      }
      return fee
    },
    bestPath() {
      const haspool = this.marketLists.find(v => {
        return (
            (v.contract0 === this.thisMarket0.contract && v.symbol0 === this.thisMarket0.symbol) && 
            (v.contract1 === this.thisMarket1.contract && v.symbol1 === this.thisMarket1.symbol)
          ) || (
            (v.contract0 === this.thisMarket1.contract && v.symbol0 === this.thisMarket1.symbol) &&
            (v.contract1 === this.thisMarket0.contract && v.symbol1 === this.thisMarket0.symbol)
          )
      })
      return haspool;
    },
    routePath() {
      const path = this.thisCoinsPath;
      if(!path) {
        return []
      }
      const pathArr = path.split('-')
      return pathArr
    },
    reward() {
      // 排名没查到 || 不是单独池子
      if (!this.rankTrade.length || !this.bestPath) {
        return '0.0000'
      }
      // 不在排名里 - return
      const rankItem = this.rankTrade.find(v => v.mid === this.bestPath.mid);
      if (!rankItem) {
        return '0.0000'
      }
      let amount = '0'
      if (!(this.thisMarket0.symbol === 'EOS' && this.thisMarket0.contract === 'eosio.token')) {
        return '0.0000'
      }
      amount = this.payNum;
      amount = accMul(amount, 3);
      amount = accDiv(amount, 1000)
      let reward = amount / this.dfsPrice * this.discount;
      reward = accMul(reward, 0.8);
      return toFixed(reward, 4)
    },
    showTip() {
      if (this.thisMarket1.contract === 'bankofusddv1' && this.thisMarket1.symbol === 'USDD') {
        return true
      }
      return false
    },
    isOgxSwap() {
      if (this.thisMarket0.contract === 'core.ogx' && this.thisMarket1.contract === 'core.ogx'
      && this.thisMarket0.symbol !== 'OGX' && this.thisMarket1.symbol !== 'OGX') {
        this.handleGetOgxPrices()
        return true
      }
      return false
    }
  },
  watch: {
    slipPoint: {
      handler: function sl(newVal) {
        if (Number(newVal) > 80) {
          this.$store.dispatch('setSlipPoint', 80)
          return
        }
        const sr = Number(newVal) > 80 ? 80 : (newVal || 5)
        this.slipPointUser = sr;
        this.handleInBy(this.tradeInfo.type)
      },
      immediate: true,
    },
    marketLists: {
      handler: function marketList(newVal) {
        if (!newVal.length) {
          return
        }
        // const newArr = newVal.filter(v => v.contract1 !== 'autopuptoken' && v.contract0 !== 'autopuptoken')
        // SwapRouter.init(newArr, this)
        // SwapRouterFilter.init(this.filterMkLists, this)
        const arr = this.handleDealSymArr(newVal)
        this.coinList = arr;
        if (!arr.length) {
          return;
        }
        const market0 = arr.find(v => v.contract === this.thisMarket0.contract && v.symbol === this.thisMarket0.symbol) || arr[0]
        this.thisMarket0 = market0;
        const market1 = arr.find(v => v.contract === this.thisMarket1.contract && v.symbol === this.thisMarket1.symbol) || arr[1]
        this.thisMarket1 = market1;
        this.handleInBy(this.tradeInfo.type, 'first')
        this.refreshLoading = false;
      },
      immediate: true,
      deep: true
    },
    thisMarket0: {
      handler: function t0() {
        // if (oldVal && oldVal.contract === newVal.contract && oldVal.symbol === newVal.symbol) {
        //   return
        // }
        this.handleDealMarkets()
      },
      immediate: true,
      deep: true
    },
    thisMarket1: {
      handler: function t1() {
        // if (oldVal && oldVal.contract === newVal.contract && oldVal.symbol === newVal.symbol) {
        //   return
        // }
        this.handleDealMarkets()
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
    handleDealMarkets() {
      const tArr = dealRouterArr(this.marketLists, this.thisMarket0, this.thisMarket1)
      SwapRouter.init(tArr, this, this.thisMarket0, this.thisMarket1)

      const tArr2 = dealRouterArr(this.filterMkLists, this.thisMarket0, this.thisMarket1)
      SwapRouterFilter.init(tArr2, this, this.thisMarket0, this.thisMarket1)
    },
    handleToProject(type) {
      if (type === 'dtoken') {
        location.href = 'https://dtoken.gitee.io/'
      }
    },
    handleGetOgxPrices() {
      ogx_get_prices_table((res) => {
        this.ogxPrices = res;
      })
    },
    handleShowTools() {
      this.$refs.slipPointTools.showNav = true;
    },
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
      const inData = item.toLowerCase().split(':')
      return getCoin(...inData)
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
    handleTo(name) {
      this.$router.push({
        name,
        params: {
          mid: this.bestPath.mid
        }
      })
    },
    handleClose() {
      this.showMarketList = false
      this.showMoreRouter = false
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
      
      try {
        let outData;
        if (this.isOgxSwap) {
          inData.sym0 = this.thisMarket0.symbol;
          inData.sym1 = this.thisMarket1.symbol;
          outData = ogx_get_num(this.ogxPrices, inData)
        } else {
          outData = this.handleDealAmountOut(inData);
        }
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
      let path = SwapRouterFilter.get_paths(params0, params1, inData.type)
      if (!path.length) {
        path = SwapRouter.get_paths(params0, params1, inData.type)
      }
      if (!this.rSwitch) {
        const fPathArr = path[0].split('-');
        if (fPathArr.length === 1) {
          path = [path[0]]
        }
      }
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
      let res = SwapRouterFilter.get_amounts_out(...params)
      if (!res.mid) {
        res = SwapRouter.get_amounts_out(...params)
      }
      // console.log(res)
      const payNum = inData.type === 'pay' ? inData.payNum : res.quantity_out.split(' ')[0];
      const getNum = inData.type === 'pay' ? res.quantity_out.split(' ')[0] : inData.getNum;
      this.thisCoinsPath = res.bestPath;
      this.thisMidsPath = inData.type === 'pay' ? res.mid : res.mid.split('-').reverse().join('-');

      // 获取单独存在的mid
      this.isMoreRouter = res.mid.split('-').length > 1;
      // console.log(this.isMoreRouter)

      let minOut = 0;
      minOut = res.price * (1 - inData.slipPointUser) * payNum * 0.997;
      minOut = toFixed(minOut, this.thisMarket1.decimal)

      let aboutPrice = res.swapOutPrice;
          aboutPrice = toFixed(aboutPrice, Number(this.thisMarket0.decimal) + 2)
      let aboutPriceSym0 = res.swapInPrice;
          aboutPriceSym0 = toFixed(aboutPriceSym0, Number(this.thisMarket1.decimal) + 2)
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
      if (Number(this.slipPoint || 5) < Number(this.tradeInfo.priceRate) || !parseFloat(this.tradeInfo.minOut)) {
        this.$message({
          type: 'error',
          message: this.$t('dex.heightSlip')
        })
        return false;
      }
      return true
    },
    // swap交易
    handleSwapTrade() {
      if (this.loading) {
        return
      }
      if (!this.handleReg()) {
        return
      }
      this.loading = true;

      if (this.isOgxSwap) {
        this.handleOgxSwap()
        return
      }
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
      } else {
        params.memo = `${params.memo}:2`
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
    handleOgxSwap() {
      const formName = this.scatter.identity.accounts[0].name;
      const permission = this.scatter.identity.accounts[0].authority;
      const params = {
        actions: [{
          account: this.thisMarket0.contract,
          name: 'exchange',
          authorization: [{ 
            actor: formName,
            permission,
          }],
          data: {
            from: formName,
            source_currency_key: `${this.thisMarket0.decimal},${this.thisMarket0.symbol}`,
            source_amount: `${this.payNum} ${this.thisMarket0.symbol}`,
            dest_currency_key: `${this.thisMarket1.decimal},${this.thisMarket1.symbol}`,
            memo: 'dfsogxinvite'
          },
        }]
      }
      EosModel.toTransaction(params, (res) => {
        this.loading = false;
        if(res.code && JSON.stringify(res.code) !== '{}') {
          this.$message({
            message: res.message,
            type: 'error'
          });
          return
        }
        this.$message({
          message: this.$t('public.success'),
          type: 'success'
        });
        setTimeout(() => {
          this.handleDealPrice()
          this.handleGetOgxPrices()
          this.payNum = '';
          this.getNum = '';
          setTimeout(() => {
            this.handleInBy(this.tradeInfo.type, 'first')
            this.handleBalanTimer();
          }, 200);
        }, 1500);
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
  border-radius: 12px;
  font-size: 24px;;
  color: #333;
  margin-bottom: 30px;
  .tabC{
    background:rgba(255,255,255,1);
    border-radius: 12px;
    border:2px solid rgba(224,224,224,1);
    // padding: 32px 26px;
    .tabD{
      padding: 8px 26px 32px;
    }
  }
  .sym0Data{
    padding: 26px 40px 26px;
    border-radius: 12px;
    border: 1px solid #F3F3F3;
    &.focus{
      border:1px solid #29D4B0;
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
        .coinMinW{
          min-width: 150px;
          flex: 1;
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
        .max{
          height: 54px;
          width: 86px;
          background: rgba(#29D4B0, .2);
          font-size: 26px;
          border-radius: 2px;
          color: #29D4B0;
          margin-left: 10px;
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
      background-image: url('https://cdn.jsdelivr.net/gh/defis-net/material/dex/enter_solid_default.svg');
      background-repeat: no-repeat;
      background-size: cover;
      &.payFocus{
        background-image: url('https://cdn.jsdelivr.net/gh/defis-net/material/dex/enter_solid_up.svg');
        background-repeat: no-repeat;
        background-size: cover;
      }
      &.getFocus{
        background-image: url('https://cdn.jsdelivr.net/gh/defis-net/material/dex/enter_solid_down.svg');
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
    margin-top: 18px;
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
    padding: 0 26px 0px;
    font-size: 24px;
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
    .tradeSet{
      width: 30px;
      margin-left: 8px;
    }
    .moreRouterIcon{
      width: 32px;
      height: 32px;
      margin-left: 10px;
    }
  }
}
.flexe{
  justify-content: flex-end;
  margin: 17px 0 20px;
  .history{
    font-size: 25px;
    // color: #07d79b;
    color: rgba(235, 103, 101, 1)
  }
}
.btnDiv{
  margin: 20px 0 20px;
  font-size: 32px;
  font-weight: 500;
  .btn{
    flex: 1;
    height: 88px;
    // background:rgba(7,215,155,1);
    background: #29D4B0;
    border-radius: 48px;
    color: #fff;
    &:active{
      background:rgba(2,198,152,1);
    }
  }
  .dtokens{
    margin-left: 30px;
    font-size: 24px;
    text-align: center;
    img{
      width: 44px;
      // margin-bottom: 5px;
    }
  }
}
.linkTo{
  font-size: 27px;
  &>span{
    flex: 1;
    height: 40px;
    &:last-child{
      border-left: 1px solid #E4E6E9;
    }
  }
  img{
    height: 36px;
    margin-right: 10px;
  }
  i{
    font-size: 28px;
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
  padding: 20px 26px;
  background:rgba(255,255,255,1);
  border-radius: 12px;
  border:2px solid rgba(224,224,224,1);
  color: #333;
  .marketNow{
    margin-left: 20px;
    color: #29D4B0;
  }
  .poolsNum{
    margin-top: 12px;
    color: $color-black;
  }
  .priceUpdate{
    margin-top: 10px;
    img{
      width: 32px;
      margin-left: 10px;
    }
  }
}
.mkListDia{
  // animation: none;
  /deep/ .el-dialog{
    position: absolute;
    bottom: 0px;
    margin: 0px;
    width: 100%;
    border-radius:12px 12px 0px 0px;
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
      border-radius:12px;
    }
  }
}
.newMarket{
  // margin-top: 15vh;
  width: 70%;
  top: 0px;
  bottom: 0px;
  transform: translate(0, 0);
  max-width: 550px;
  border-radius: 0px;
}
</style>