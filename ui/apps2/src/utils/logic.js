/* eslint-disable */
import { toFixed, getCoin, dealPrice, accDiv } from '@/utils/public';
import moment from 'moment';
import store from '@/store';
// import { Decimal } from 'decimal.js';

const config = {
  rate: 0.003, // 手续费 - 0.2%
  MINIMUM_LIQUIDITY: 10000, // 最小流动性Token
}

// 算法逻辑
// 1. 滑点 & 成交数量算
/**
 *
 * @param {*} inData
 * {
 *  direction: 0 - buyJIN | 1 - sellJIN
 *  payNum: 输入支付数量
 *  getNum: 输入获得数量
 *  poolSym0: EOS池子数量
 *  poolSym1: JIN池子数量
 * }
 */
export function dealTrade(inData) {
  // EOS价格
  let eosPrice = inData.poolSym1 / inData.poolSym0;
      eosPrice = toFixed(eosPrice, 8);
  // JIN价格
  let jinPrice = inData.poolSym0 / inData.poolSym1;
      jinPrice = toFixed(jinPrice, 8);
  const outData = {
    eosPrice, // 当前EOS价格
    jinPrice, // 当前JIN价格
    type: inData.type,
    aboutPrice: inData.type === 'pay' ? jinPrice : eosPrice
  }
  // 没有输入支付数量 & 得到数量时 - 返回默认配置
  if (!Number(inData.payNum) && !Number(inData.getNum)) {
    return outData;
  }
  // 计算当前pool不变量
  // 计算1: 根据输入支付数量 计算 得到数量 成交价格 滑点
  // 计算2: 根据输入得到数量 计算 支付数量 成交价格 滑点
  const { payNum, getNum, aboutPrice, minOut } = dealPayToGet(inData); // 获得支付数量 & 得到数量
  // console.log({ payNum, getNum, aboutPrice })
  const slipPoint = (aboutPrice - jinPrice) * 100 / jinPrice; // 溢价率 =（当前价格-预估成交价）/ 当前价格
  return Object.assign(outData, {
    payNum, getNum, aboutPrice, slipPoint, minOut
  });
}

function dealPayToGet(inData) {
  const Invariant = inData.poolSym1 * inData.poolSym0;
  const payMainPool = inData.direction ? inData.poolSym1 : inData.poolSym0; // 支付池子 - 池子里币种数量增加
  const getMainPool = inData.direction ? inData.poolSym0 : inData.poolSym1; // 得到池子 - 池子里币种数量减少
  let payNum, getNum, aboutPrice;
  // 输入支付金额
  if (Number(inData.payNum)) {
    payNum = inData.payNum;
    let byNum = payNum - payNum * config.rate; // 实际用于交易的数量 - 去除手续费后的支付金额
    let payPool = Number(payMainPool) + Number(byNum); // 交易成功后，池子应到达金额
    let getPool = Invariant / payPool; // 交易成功后，对应池子应减少到的数量
    getNum = getMainPool - getPool; // 最终获取到的数量
  } else { // 输入得到数量
    getNum = inData.getNum;
    let getPool = getMainPool - getNum; // 交易成功后，对应池子应减少到的数量
    let payPool = Invariant / getPool; // 交易成功后，池子应到达金额
    let byNum = payPool - payMainPool; // 实际用于交易的数量 - 去除手续费后的支付金额
    payNum = byNum / (1 - config.rate);
  }
  aboutPrice = payNum / getNum; // 计算出预估成交价 - payCoin/getCoin
  let minOut = 0;
  if (inData.type === 'pay') {
    minOut = getNum * (1 - inData.slipPointUser);
  } else {
    minOut = payNum * (1 + Number(inData.slipPointUser));
  }
  return {
    payNum,
    getNum,
    aboutPrice,
    minOut,
  }
}


// 做市算法处理
/**
 * 做市token 计算
 * @param {*} inData
 * payNum1: 输入存币数量 - EOS
 * payNum2: 输入存币数量 - JIN
 * poolSym0: EOS池子数量
 * poolSym1: JIN池子数量
 * poolToken: 凭证数量
 */
export function dealTokenV1(inData) {
  // EOS价格
  let eosPrice = inData.poolSym1 / inData.poolSym0;
      eosPrice = toFixed(eosPrice, 8);
  let payNum1 = Number(inData.payNum1);
  let payNum2 = Number(inData.payNum2);
  if (Number(payNum1)) {
    payNum2 = payNum1 * eosPrice;
  } else {
    payNum1 = payNum2 / eosPrice;
  }
  const poolToken = inData.poolToken;
  const poolSym0 = inData.poolSym0;
  // 计算做市占比
  const rate = Number(payNum1) / (Number(payNum1) + Number(poolSym0));
  const getToken = (Number(poolToken) * Number(rate)) / (1 - Number(rate));
  // console.log(dealTokenV2(inData))
  return {
    payNum1,
    payNum2,
    getToken
  }
}
export function dealToken(inData) {
  let payNum1 = Number(inData.payNum1);
  let payNum2 = Number(inData.payNum2);
  const rate = inData.poolSym1 / inData.poolSym0;
  if (!payNum1 && !payNum2) {
    return {
      payNum1,
      payNum2,
      getToken: 0,
      rate
    };
  }
  if (inData.poolToken === 0) {
    // console.log(inData)
    const amount0 = inData.payNum1 * 10 ** inData.decimal0;
    const amount1 = inData.payNum2 * 10 ** inData.decimal1;
    let getToken = Math.sqrt(amount0 * amount1) - config.MINIMUM_LIQUIDITY;
        getToken = parseInt(getToken);
    if (getToken < 0) {
      getToken = 0
    }
    const rate = inData.payNum2 / (Number(inData.payNum1) || 1);
    return {
      payNum1,
      payNum2,
      getToken,
      rate
    }
  }
  // EOS价格
  let eosPrice = inData.poolSym1 / inData.poolSym0;
      eosPrice = toFixed(eosPrice, 8);
  if (Number(payNum1)) {
    payNum2 = payNum1 * eosPrice;
  } else {
    payNum1 = payNum2 / eosPrice;
  }
  const x = payNum1 * inData.poolToken / inData.poolSym0;
  const y = payNum2 * inData.poolToken / inData.poolSym1;
  const getToken = parseInt(Math.min(x, y));
  return {
    payNum1,
    payNum2,
    getToken,
    rate
  }
}
/**
 * 卖出Token赎回资产
 * @param {*} inData 
 * poolSym0: EOS池子数量
 * poolSym1: JIN池子数量
 * poolToken: 池子总凭证
 * sellToken: 卖出token数量
 */
export function sellToken(inData) {
  const poolToken = inData.poolToken;
  const sellToken = Number(inData.sellToken);
  const poolSym0 = inData.poolSym0;
  const poolSym1 = inData.poolSym1;
  // 计算卖出比率
  const rate = sellToken / poolToken;
  let getNum1 = poolSym0 * rate;
  let getNum2 = poolSym1 * rate;
  return {
    getNum1,
    getNum2
  }
}
// 获取过滤 主币种 价格
export function getFilterPrice(list) {
  const mkFlt = store.state.config.mkFilterConf;
  const priceObj = {};
  mkFlt.forEach(conf => {
    const market = list.find(v => v.mid === conf.priceMid)
    if (!market) {
      return
    }
    if (conf.symbol === 'EOS') {
      priceObj.EOS = 1;
      return
    }
    let price, r0, r1;
    if (conf.sym === market.sym0 && conf.contract === market.contract0) {
      r0 = market.reserve0;
      r1 = market.reserve1;
    } else {
      r1 = market.reserve0;
      r0 = market.reserve1;
    }
    price = parseFloat(r1) / parseFloat(r0);
    priceObj[conf.symbol] = price;
  })
  return priceObj;
}
// 处理立标排序
function dealMarketSort(newList) {
  const newListSort = newList.sort((a, b) => {
    let aEos = 0;
    if (a.sym0Data.contract === 'eosio.token') {
      aEos = parseInt(a.reserve0)
    } else if(a.sym1Data.contract === 'eosio.token') {
      aEos = parseInt(a.reserve1)
    }
    let bEos = 0;
    if (b.sym0Data.contract === 'eosio.token') {
      bEos = parseInt(b.reserve0)
    } else if(a.sym1Data.contract === 'eosio.token') {
      bEos = parseInt(b.reserve1)
    }
    return bEos - aEos;
  })
  return newListSort;
}


function get_token_eos_value(a, eos_price, tag_price) {
  let val0 = 0;
  if (a.contract0 === "eosio.token" && a.sym0 === "4,EOS") {
      val0 = parseFloat(a.reserve0);
  } else if (a.contract1 === "eosio.token" && a.sym1 === "4,EOS") {
      val0 = parseFloat(a.reserve1);
  } else if (a.contract0 === "tethertether" && a.sym0 === "4,USDT") {
      val0 = parseFloat(a.reserve0) / eos_price;
  } else if (a.contract1 === "tethertether" && a.sym1 === "4,USDT") {
      val0 = parseFloat(a.reserve1) / eos_price;
  } else if (a.contract0 === "tagtokenmain" && a.sym0 === "8,TAG") {
    val0 = parseFloat(a.reserve0) / tag_price;
    // console.log(a.mid, val0)
  } else if (a.contract1 === "tagtokenmain" && a.sym1 === "8,TAG") {
    val0 = parseFloat(a.reserve1) / tag_price;
    // console.log(a.mid, val0)
  }
  return val0;
}
// 列表处理 - 非vue数据处理迁移
export function dealMarketLists(list, topLists) {
  const newList = []
  let mainList = []; // 存放EOS - token 和 usdt - token 的交易对
  let dfsData = {}
  const mkFlt = store.state.config.mkFilterConf;
  const priceObj = getFilterPrice(list)
  // EOS/USDT 价格
  let eos_market = list.find(v => v.mid === 17);
  let eos_price = parseFloat(eos_market.reserve1) / parseFloat(eos_market.reserve0);
  // EOS/TAG 价格
  let tag_market = list.find(v => v.mid === 602);
  let tag_price = parseFloat(tag_market.reserve1) / parseFloat(tag_market.reserve0);
  // console.log(tag_price, eos_price)
  list.forEach((item) => {
    let v = item;
    if (v.contract0 === 'bgbgbgbgbgbg' || v.contract0 === 'betdicetoken' || v.contract0 === 'sportbetsbet'
     || v.contract0 === 'betasharetkn' || v.contract0 === 'betacorecash' || v.contract0 === 'betkingtoken'
     || v.contract1 === 'bgbgbgbgbgbg' || v.contract1 === 'betdicetoken' || v.contract1 === 'sportbetsbet'
     || v.contract1 === 'betasharetkn' || v.contract1 === 'betacorecash' || v.contract1 === 'betkingtoken') {
      return
    }
    if (v.contract1 === 'eosio.token' && v.sym1 === '4,EOS') {
      const newList = {
        contract0: v.contract1,
        contract1: v.contract0,
        last_update: v.last_update,
        liquidity_token: v.liquidity_token,
        mid: v.mid,
        price0_cumulative_last: v.price1_cumulative_last,
        price0_last: v.price1_last,
        price1_cumulative_last: v.price0_cumulative_last,
        price1_last: v.price0_last,
        reserve0: v.reserve1,
        reserve1: v.reserve0,
        sym0: v.sym1,
        sym1: v.sym0,
        exchangeSym: true,
      }
      v = newList;
    } else if (v.contract0 !== 'eosio.token' && v.contract1 === 'tethertether' && v.sym1 === '4,USDT') {
      const newList = {
        contract0: v.contract1,
        contract1: v.contract0,
        last_update: v.last_update,
        liquidity_token: v.liquidity_token,
        mid: v.mid,
        price0_cumulative_last: v.price1_cumulative_last,
        price0_last: v.price1_last,
        price1_cumulative_last: v.price0_cumulative_last,
        price1_last: v.price0_last,
        reserve0: v.reserve1,
        reserve1: v.reserve0,
        sym0: v.sym1,
        sym1: v.sym0,
        exchangeSym: true,
      }
      v = newList;
    } else if (v.contract0 !== 'eosio.token' && v.contract0 !== 'tethertether'
            && v.contract1 === 'tagtokenmain' && v.sym1 === '8,TAG') {
      const newList = {
        contract0: v.contract1,
        contract1: v.contract0,
        last_update: v.last_update,
        liquidity_token: v.liquidity_token,
        mid: v.mid,
        price0_cumulative_last: v.price1_cumulative_last,
        price0_last: v.price1_last,
        price1_cumulative_last: v.price0_cumulative_last,
        price1_last: v.price0_last,
        reserve0: v.reserve1,
        reserve1: v.reserve0,
        sym0: v.sym1,
        sym1: v.sym0,
        exchangeSym: true,
      }
      v = newList;
    }
    const sym0 = v.sym0.split(',');
    v.symbol0 = sym0[1]; // 币种
    v.decimal0 = sym0[0]; // 精度
    const sym1 = v.sym1.split(',');
    v.symbol1 = sym1[1]; // 币种
    v.decimal1 = sym1[0]; // 精度
    v.price = dealPrice((parseFloat(v.reserve0) / parseFloat(v.reserve1) || 0))
    v.sym0Data = {
      mid: v.mid,
      last_update: v.last_update,
      liquidity_token: v.liquidity_token,
      price_cumulative_last: v.price0_cumulative_last,
      price_last: v.price0_last,
      contract: v.contract0,
      decimal: v.decimal0,
      reserve: v.reserve0,
      sym: v.sym0,
      symbol: v.symbol0,
      imgUrl: getCoin(v.contract0, v.symbol0.toLowerCase()),
    }
    v.sym1Data = {
      mid: v.mid,
      last_update: v.last_update,
      liquidity_token: v.liquidity_token,
      price_cumulative_last: v.price1_cumulative_last,
      price_last: v.price1_last,
      contract: v.contract1,
      decimal: v.decimal1,
      reserve: v.reserve1,
      sym: v.sym1,
      symbol: v.symbol1,
      imgUrl: getCoin(v.contract1, v.symbol1.toLowerCase()),
    }
    let val0 = get_token_eos_value(v, eos_price, tag_price);
    v.eos_value = val0 * 2;
    v.usdt_value = val0 * 2 * eos_price;
    const i = topLists.find(vv => vv === v.mid)
    if (i) {
      dfsData = v;
    } else {
      // 处理过滤数组
      let isPush = false;
      mkFlt.forEach(conf => {
        if (isPush) {
          return
        }
        if ((v.sym0Data.symbol === conf.symbol && v.sym0Data.contract === conf.contract)
          || (v.sym1Data.symbol === conf.symbol && v.sym1Data.contract === conf.contract)) {
          const priceAll = parseFloat(v.sym0Data.reserve) * priceObj[conf.symbol];
          if (priceAll >= conf.minEos) {
            mainList.push(v)
            isPush = true;
          }
        }
      })

      // 正常数组
      if ((v.sym0Data.symbol === 'EOS' && v.sym0Data.contract === 'eosio.token') ||
          (v.sym1Data.symbol === 'EOS' && v.sym1Data.contract === 'eosio.token')) {
        newList.unshift(v)
        return
      }
      newList.push(v)
    }
  })
  // 排序处理
  const newListSort = dealMarketSort(newList); // 全部做市列表
  newListSort.splice(1, 0, dfsData)
  store.dispatch('setMarketLists', newListSort); // 保存全部列表

  // 过滤列表处理
  const newMainList = dealMarketSort(mainList);
  mainList.sort((a, b) => {
    return parseFloat(b.usdt_value || 0) - parseFloat(a.usdt_value || 0)
  })
  newMainList.splice(1, 0, dfsData)
  store.dispatch('setFilterMkLists', newMainList)
  // console.log(newListSort)
  return {
    allLists: newListSort,
    filterLists: newMainList,
  }
}

// V3版本做市收益计算
// 1. 计算使用固定APR 还是 动态利率
export function getV3Apr(mid, rankAprs) {
  const rankInfoV3 = store.state.sys.rankInfoV3;
  const aprs = rankAprs ? rankAprs : rankInfoV3.find(v => v.mid === mid);
  // console.log(aprs)
  if (!aprs) {
    return {
      isRainbow: false,
      cur_apy: 0
    };
  }
  let poolEos = getPoolEosBal(mid);
  // console.log(poolEos)
  poolEos = poolEos * 2;
  if (!Number(poolEos)) {
    return {
      isRainbow: false,
      cur_apy: 0,
    }
  }
  const damping = store.state.sys.damping;
  const dfsPrice = store.state.sys.dfsPrice;
  // console.log(aprs);
  const aprs_s = aprs.aprs;
  const max = parseFloat(aprs.daily_max_supply) * damping;
  const apr_d = (max * 0.8 * dfsPrice * 365 / poolEos) * 100;
  const aprs_d = Math.pow((apr_d / 100 * 20000 / ( 0.8 * 365) + 10000) / 10000, 1 / 86400);
  // console.log(max, dfsPrice, poolEos, apr_d, aprs_d)
  return {
    isRainbow: Number(aprs_s) > Number(aprs_d),
    cur_apy: Number(aprs_s) < Number(aprs_d) ? aprs_s : aprs_d,
  }
}
// 获取池子EOS余额
function getPoolEosBal(mid) {
  const marketLists = store.state.sys.marketLists;
  const market = marketLists.find(v => v.mid === mid) || {};
  const usdt = marketLists.find(v => v.mid === 17) || {};
  const usdtPrice = parseFloat(usdt.reserve0 || 0) / parseFloat(usdt.reserve1 || 1)
  let eosBal = 0;
  if (market.symbol0 === 'EOS' && market.contract0 === 'eosio.token') {
    eosBal = parseFloat(market.reserve0)
  } else if (market.symbol1 === 'EOS' && market.contract1 === 'eosio.token') {
    eosBal = parseFloat(market.reserve1)
  } else if (market.symbol0 === 'USDT' && market.contract0 === 'tethertether') {
    eosBal = parseFloat(market.reserve0) * usdtPrice
  } else if (market.symbol1 === 'USDT' && market.contract1 === 'tethertether') {
    eosBal = parseFloat(market.reserve1) * usdtPrice
  }
  return eosBal;
}
// 计算v3版本1W EOS 一天挖出多少
export function perDayRewardV3(mid) {
  const dfsPrice = store.state.sys.dfsPrice;
  const aprs = getV3Apr(mid)
  // console.log(aprs)
  const t = 86400;
  let minNum = 10000 * Math.pow(aprs.cur_apy || 1, t)
  minNum -= 10000;
  let reward = minNum / dfsPrice
  reward *= 0.8
  reward = toFixed(reward, 4)
  return reward
}

// V3计算收益
export function dealRewardV3(minnerData, mid) {
  const dfsPrice = store.state.sys.dfsPrice;
  const aprs = getV3Apr(mid)
  // console.log(minnerData)
  let t = moment().valueOf() - minnerData.lastTime;
  t = t / 1000;
  if (t > 15552000){
    t = 15552000;
  }
  // console.log(t)
  // 用户实际数据计算
  let minNum = minnerData.liq * Math.pow(aprs.cur_apy || 1, t)
  minNum -= minnerData.liq;
  let reward = minNum / dfsPrice
  reward *= 0.8
  reward = toFixed(reward, 8)
  return reward
}

export function getV3PoolsClass(mid) {
  const rankInfoV3 = store.state.sys.rankInfoV3;
  const tRank = rankInfoV3.find(v => v.mid === mid) || {};
  if (tRank.rank <= 1) {
    return 'poolslv6'
  } else if (tRank.rank <= 3) {
    return 'poolslv5'
  } else if (tRank.rank <= 6) {
    return 'poolslv4'
  } else if (tRank.rank <= 10) {
    return 'poolslv3'
  } else if (tRank.rank <= 15) {
    return 'poolslv2'
  } else if (tRank.rank <= 21) {
    return 'poolslv1'
  }
  return ''
}

// pddex
class swapRouter {
  constructor() {
    this.markets = [];
    this.pair_market_map = {};
    this.mid_market_map = {};
    this.tokens = [];
    this.paths = [];
    this.isInit = false;
    this._pathsArr = [];
    this.bestPath = '';
  }
  init(data, vThis) { // eslint-disable-line
    this.markets = data || [];
    this._pathsArr = [];
    this.bestPath = '';
    if (this.paths.length) {
      return
    }
    if (window.Worker) {
      this.workerToInitPath(vThis)
    } else {
      this.initPath()
    }
  }

  workerToInitPath(vThis) {
    const dealPath = (markets) => {
      let paths = [];
      let pair_market_map = {};
      let mid_market_map = {};
      let tokens = [];
      markets.map(x => {
        let tokenA = x.contract0 + ":" + x.sym0.split(",")[1];
        let tokenB = x.contract1 + ":" + x.sym1.split(",")[1];
        let pair_a = tokenA + "-" + tokenB;
        let pair_b = tokenB + "-" + tokenA;
  
        pair_market_map[pair_a] = x;
        pair_market_map[pair_b] = x;
  
        mid_market_map[x.mid] = x;
  
        paths.push(pair_a);
        paths.push(pair_b);
  
        let new_paths = []

        for (let i = 0; i < paths.length; i++) {
          let path = paths[i];
          let tks = path.split("-");
          if (tks.length >= 3) {
            continue
          }
          if (tks[0] === tokenA && tks[tks.length - 1] !== tokenB) {
            new_paths.push(tokenB + "-" + path)
          }
  
          if (tks[tks.length - 1] === tokenA && tks[0] !== tokenB) {
            new_paths.push(path + "-" + tokenB);
          }
  
          if (tks[0] === tokenB && tks[tks.length - 1] !== tokenA) {
            new_paths.push(tokenA + "-" + path)
          }
  
          if (tks[tks.length - 1] === tokenB && tks[0] !== tokenA) {
            new_paths.push(path + "-" + tokenA);
          }
        }
  
        paths = paths.concat(new_paths);
  
        if (tokens.indexOf(tokenA) === -1) {
          tokens.push(tokenA)
        }
        if (tokens.indexOf(tokenB) === -1) {
          tokens.push(tokenB)
        }
      })
      paths = paths.sort((a, b) => {
        return a.length - b.length;
      })
      return {
        paths, pair_market_map, mid_market_map, tokens
      }
    }
    console.log('开始执行循环 - ', Date.parse(new Date()))
    vThis.$worker.run(dealPath, [this.markets]).then(res => {
      this.paths = res.paths;
      this.pair_market_map = res.pair_market_map;
      this.mid_market_map = res.mid_market_map;
      this.tokens = res.tokens;
      this.isInit = true;
      // console.log('生成路径长度 - ', this.paths)
      console.log('生成路径长度 - ', this.paths.length)
      console.log('循环执行结束 - ', Date.parse(new Date()))
    }).catch(e => console.log(e))
  }

  initPath() {
    this.paths = [];
    this.pair_market_map = {};
    this.mid_market_map = {};
    this.tokens = [];
    this.markets.map(x => {
      let tokenA = x.contract0 + ":" + x.sym0.split(",")[1];
      let tokenB = x.contract1 + ":" + x.sym1.split(",")[1];
      let pair_a = tokenA + "-" + tokenB;
      let pair_b = tokenB + "-" + tokenA;

      this.pair_market_map[pair_a] = x;
      this.pair_market_map[pair_b] = x;

      this.mid_market_map[x.mid] = x;

      this.paths.push(pair_a);
      this.paths.push(pair_b);

      let new_paths = []

      this.paths = this.paths.concat(new_paths);

      if (this.tokens.indexOf(tokenA) === -1) {
        this.tokens.push(tokenA)
      }
      if (this.tokens.indexOf(tokenB) === -1) {
        this.tokens.push(tokenB)
      }
    })
    this.paths = this.paths.sort((a, b) => {
      return a.length - b.length;
    })
    console.log('生成路径长度 - ', this.paths)
    this.isInit = true;
  }

  get_paths(tokenA, tokenB, type) {
    const newTokenA = type === 'pay' ? tokenA : tokenB
    const newTokenB = type === 'pay' ? tokenB : tokenA
    if (!this.isInit) return;
    let _paths;
    const _pathsArr = [];

    for (let i = 0; i < this.paths.length; i++) {
      if (_pathsArr.length === 10) {
        break
      }
      let path = this.paths[i];
      let tks = path.split("-");
      if ((tks[0] === newTokenA && tks[tks.length - 1] === newTokenB)) {
        _paths = path;
        _pathsArr.push(_paths)
      }
    }
    // 根据兑换路径, 找出对应的mid路径
    this._pathsArr = _pathsArr; // 查到所有路径 - 合约路径
    const _pathsMids = [];
    _pathsArr.forEach((v) => {
      let mids;
      let tks = v.split("-");

      for (let i = 0; i < tks.length - 1; i++) {
        let pair = tks[i] + "-" + tks[i + 1]
        if (!mids) {
          mids = this.pair_market_map[pair].mid;
        } else {
          mids = mids + "-" + this.pair_market_map[pair].mid;
        }
      }
      _pathsMids.push(mids + '') // 返回所有Mid路径
    })
    // console.log(_pathsMids)
    return _pathsMids;
  }

  //  mids = [], token_in = eosio.token:EOS, amount_in = 10000, type = 'pay' | 'get'
  get_amounts_out(mids, token_in, amount_in, type) {
    if (!this.isInit) return;
    let amounts_out_arr = [];
    mids.forEach((m, mIndex) => {
      let mid_arr = m.split("-");
      let quantity_out;
      let price = 1;
      let swapInPrice = 1;
      let swapOutPrice = 1;
      let new_token_in = token_in, new_amount_in = amount_in;
      // console.log(' --------------------- ')
      for (let i = 0; i < mid_arr.length; i++) {
        let mid = mid_arr[i];
        // console.log('mid', mid)
        let swap_result
        if (!type) {
          swap_result = this.swap(mid, new_token_in, new_amount_in);
        } else {
          swap_result = this.swap(mid, new_token_in, new_amount_in, type);
        }
        new_amount_in = swap_result.amount_out;
        new_token_in = swap_result.token_out;
        quantity_out = swap_result.quantity_out;
        price = swap_result.price * price;
        swapInPrice = swap_result.swapInPrice * swapInPrice;
        swapOutPrice = swap_result.swapOutPrice * swapOutPrice;
      }
      amounts_out_arr.push({
        amount_in: new_amount_in, token_in: new_token_in, quantity_out, price, mid: m, mIndex,
        swapInPrice, swapOutPrice
      })
    })
    if (!type) {
      amounts_out_arr.sort((a, b) => {
        return parseFloat(b.quantity_out) - parseFloat(a.quantity_out);
      })
    } else {
      amounts_out_arr = amounts_out_arr.filter(v => v.amount_in > 0)
      amounts_out_arr.sort((a, b) => {
        return parseFloat(a.quantity_out) - parseFloat(b.quantity_out);
      })
    }
    console.log(amounts_out_arr)
    this.bestPath = this._pathsArr[amounts_out_arr[0].mIndex]
    amounts_out_arr[0].bestPath = this.bestPath;
    return amounts_out_arr[0]
  }

  swap(mid, token_in, amount_in, type) {
    if (!this.isInit) return;
    let market = this.markets.find(v => v.mid == mid);
    let tokenA = market.contract0 + ":" + market.sym0.split(",")[1];
    let tokenB = market.contract1 + ":" + market.sym1.split(",")[1];
    let inNum = amount_in;
    if (!type) {
      amount_in -= amount_in * 0.001; // 协议费扣除
      inNum = amount_in * 0.998;
    }
    let amount_out;
    let token_out;
    let quantity_out;
    let price;
    let swapPrice; // 兑换后的价格
    if (token_in === tokenA) {
      inNum = inNum / (10 ** market.sym0.split(",")[0]);
      let reserve_in = parseFloat(market.reserve0) * (10 ** market.sym0.split(",")[0]);
      let reserve_out = parseFloat(market.reserve1) * (10 ** market.sym1.split(",")[0]);
      if (!(reserve_in > 0 && reserve_out > 0)) {
        return {
          token_out: tokenB,
          amount_out: '0',
          quantity_out: '0',
          price: '0'
        }
      }
      if (!type) {
        amount_out = this.get_amount_out(amount_in, reserve_in, reserve_out);
      } else {
        amount_out = this.get_amount_in(amount_in, reserve_in, reserve_out);
      }
      token_out = tokenB
      // console.log('tokenA' ,amount_out)
      quantity_out = toFixed((amount_out / (10 ** market.sym1.split(",")[0])), market.sym1.split(",")[0]) + " " + market.reserve1.split(" ")[1];
      if (!type) {
        price = parseFloat(market.reserve1) / parseFloat(market.reserve0);
      } else {
        price = parseFloat(market.reserve0) / parseFloat(market.reserve1);
      }
      swapPrice = accDiv(amount_out, 10 ** market.sym1.split(",")[0]); // 计算总输出 - 不截取
      // console.log('1 ----- ', quantity_out, ' ------- ', price)
    }
    if (token_in === tokenB) {
      inNum = inNum / (10 ** market.sym1.split(",")[0]);
      let reserve_in = parseFloat(market.reserve1) * (10 ** market.sym1.split(",")[0]);
      let reserve_out = parseFloat(market.reserve0) * (10 ** market.sym0.split(",")[0]);
      if (!(reserve_in > 0 && reserve_out > 0)) {
        return {
          token_out: tokenA,
          amount_out: '0',
          quantity_out: '0',
          price: '0'
        }
      }
      if (!type) {
        amount_out = this.get_amount_out(amount_in, reserve_in, reserve_out);
      } else {
        amount_out = this.get_amount_in(amount_in, reserve_in, reserve_out);
      }
      token_out = tokenA;
      quantity_out = toFixed((amount_out / (10 ** market.sym0.split(",")[0])), (market.sym0.split(",")[0])) + " " + market.reserve0.split(" ")[1];
      if (!type) {
        price = parseFloat(market.reserve0) / parseFloat(market.reserve1);
      } else {
        price = parseFloat(market.reserve1) / parseFloat(market.reserve0);
      }
      swapPrice = accDiv(amount_out, 10 ** market.sym0.split(",")[0]); // 计算总输出 - 不截取
    }
    let swapInPrice, swapOutPrice;
    if (!type) {
      swapInPrice = swapPrice / inNum;
      swapOutPrice = inNum / swapPrice;
    } else {
      swapPrice = swapPrice * 0.997;
      swapInPrice = inNum / swapPrice;
      swapOutPrice = swapPrice / inNum;
    }
    return {
      token_out,
      amount_out,
      quantity_out,
      price,
      swapInPrice,
      swapOutPrice
    }
  }

  get_amount_out(amount_in, reserve_in, reserve_out) {
    if (!this.isInit) return 0;
    if (!(amount_in > 0)) {
      return 0
    }
    let amount_in_with_fee = amount_in * (10000 - 20); // 去除手续费后总输入
    let numerator = amount_in_with_fee * reserve_out;
    let denominator = reserve_in * 10000 + amount_in_with_fee;
    let amount_out = numerator / denominator;
    if (!(amount_out > 0)) {
      return 0
    }
    return amount_out;
  }
  // 根据获得计算输入
  get_amount_in(amount_out, reserve_in, reserve_out) {
    if (!this.isInit) return 0;
    if (!(amount_out > 0)) {
      return 0
    }
    let amount_in_with_fee = amount_out * 10000; // 去除手续费后总输入
    let numerator = amount_in_with_fee * reserve_out;
    let denominator = reserve_in * 10000 - amount_in_with_fee;
    let amount_in = numerator / denominator;
    amount_in = amount_in / 0.997
    if (!(amount_in > 0)) {
      return 0
    }
    return amount_in;
  }
}
export const SwapRouter = new swapRouter();