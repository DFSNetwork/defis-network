// App.vue 比较复杂的逻辑处理部分
import { getCoin, dealPrice, getYfcReward, getTagLpApy, accAdd} from '@/utils/public';
import { perDayRewardV3 } from '@/utils/logic';
import store from '@/store';

// 做市列表数据处理
export function logicToDealMarket(lists, topLists, klineMids) {
  const newList = [];
  let dfsData = {}
  lists.forEach(item => {
    let v = item;
    if (v.contract1 === 'eosio.token' && v.sym1 === '4,EOS') {
      const tLi = {
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
      v = tLi;
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
      imgUrl: getCoin(v.contract0, v.symbol0),
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
      imgUrl: getCoin(v.contract1, v.symbol1),
    }
    const i = topLists.find(vv => vv === v.mid)
    const hasKline = klineMids.find(vv => vv == v.mid)
    if (hasKline) {
      v.hasKline = true;
    }
    if (i) {
      dfsData = v;
    } else {
      if (v.sym0Data.symbol === 'EOS' && v.sym0Data.contract === 'eosio.token') {
        newList.unshift(v)
        return
      }
      if (v.sym1Data.symbol === 'EOS' && v.sym1Data.contract === 'eosio.token') {
        newList.unshift(v)
        return;
      }
      newList.push(v)
    }
  });
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
  newListSort.splice(1, 0, dfsData)
  return newListSort;
}

// BOX做市列表数据处理
export function logicToDealBoxMarket(lists) {
  const boxMids = store.state.config.boxMids;
  const boxLists = [];
  boxMids.forEach(bmid => {
    const t = lists.find(vv => vv.id === bmid)
    const newMarket = Object.assign(t, {
      contract0: t.token0.contract,
      sym0: t.token0.symbol,
      contract1: t.token1.contract,
      sym1: t.token1.symbol,
    })
    let v = newMarket;
    if (v.contract1 === 'eosio.token' && v.sym1 === '4,EOS') {
      const tLi = {
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
      v = tLi;
    }
    const sym0 = v.sym0.split(',');
    v.symbol0 = sym0[1]; // 币种
    v.decimal0 = sym0[0]; // 精度
    const sym1 = v.sym1.split(',');
    v.symbol1 = sym1[1]; // 币种
    v.decimal1 = sym1[0]; // 精度
    v.price = dealPrice((parseFloat(v.reserve0) / parseFloat(v.reserve1) || 0))
    v.boxMid = bmid;
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
      imgUrl: getCoin(v.contract0, v.symbol0),
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
      imgUrl: getCoin(v.contract1, v.symbol1),
    }
    boxLists.push(v)
  })
  return boxLists
}

// dexs 数据处理 -> 获取支持BOX的Mids
export function logicToDealBoxMids(obj) {
  const dexs = obj.dexs
  const pids = Object.keys(dexs)
  const mids = [];
  pids.forEach(v => {
    dexs[v].forEach(vv => {
      if (vv.nick === 'box') {
        mids.push(vv.mid)
      }
    })
  })
  store.dispatch('setBoxMids', mids)
  return mids
}

// 处理分区列表
export function dealAreaArr(arr, coin) {
  const newArr = []
  const coinPrice = getAreaPrice(coin);
  arr.forEach(list => {
    let v = list;
    if (v.contract0 === 'bgbgbgbgbgbg' || v.contract0 === 'betdicetoken' || v.contract0 === 'sportbetsbet'
     || v.contract0 === 'betasharetkn' || v.contract0 === 'betacorecash' || v.contract0 === 'betkingtoken'
     || v.contract1 === 'bgbgbgbgbgbg' || v.contract1 === 'betdicetoken' || v.contract1 === 'sportbetsbet'
     || v.contract1 === 'betasharetkn' || v.contract1 === 'betacorecash' || v.contract1 === 'betkingtoken') {
      return
    }
    if (!regExchange(coin, v)) {
      const tLi = {
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
        cur_price: v.cur_price,
        eos_value: v.eos_value,
        last_price: v.last_price,
        usdt_value: v.usdt_value,
        volume24H: v.volume24H,
        price_change_rate: v.price_change_rate,
        price_change_24h: v.price_change_24h,
      }
      v = tLi;
    }
    const sym0 = v.sym0.split(',');
    v.symbol0 = sym0[1]; // 币种
    v.decimal0 = sym0[0]; // 精度
    const sym1 = v.sym1.split(',');
    v.symbol1 = sym1[1]; // 币种
    v.decimal1 = sym1[0]; // 精度
    v.poolsNum = `${parseFloat(v.reserve0).toFixed(4)} ${v.symbol0}`
    v.price = dealPrice((parseFloat(v.reserve0) / parseFloat(v.reserve1) || 0))
    
    v.aboutPriceU = ((coinPrice.price || 0) * v.price).toFixed(4)
    v.aboutPriceCNY = ((coinPrice.CNY || 0) * v.price).toFixed(4)
    v.volume24HToUsdt = (parseFloat(v.volume24H || 0) * (coinPrice.price || 0)).toFixed(4)
    v.priceRate = parseFloat(v.price_change_rate) > 0 ? `+${v.price_change_rate}` : v.price_change_rate;
    v.imgUrl0 = getCoin(v.contract0, v.symbol0),
    v.imgUrl1 = getCoin(v.contract1, v.symbol1),
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
      imgUrl: getCoin(v.contract0, v.symbol0),
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
      imgUrl: getCoin(v.contract1, v.symbol1),
    }
    // 年化计算
    const {countApy, lpApy, tagLpApy, aprV3, feesApr, usdcApr} = dealApy(v)
    v.countApy = parseFloat(countApy || 0).toFixed(2);
    v.lpApy = lpApy;
    v.tagLpApy = parseFloat(tagLpApy || 0).toFixed(2);
    v.aprV3 = parseFloat(aprV3 || 0).toFixed(2);
    v.feesApr = parseFloat(feesApr || 0).toFixed(2);
    v.usdcApr = parseFloat(usdcApr || 0).toFixed(2);
    newArr.push(v)
  })
  return newArr
}

// 获取分区币种的价格
function getAreaPrice(coin) {
  const coinPrices = store.state.sys.coinPrices;
  const has = coinPrices.find(v => v.coin === coin) || {}
  return has;
}
// 是否交换数据
function regExchange(coin, v) {
  const tCoin = coin === 'BTC' ? coin = 'PBTC' : coin;
  if (tCoin === 'EOS' && v.contract0 === 'eosio.token' && v.sym0 === '4,EOS') {
    return true
  }
  if (tCoin === 'TAG' && v.contract0 === 'tagtokenmain' && v.sym0 === '8,TAG') {
    return true
  }
  if (tCoin === 'USDT' && v.contract0 === 'tethertether' && v.sym0 === '4,USDT') {
    return true
  }
  if (tCoin === 'USDC' && v.contract0 === 'usdxusdxusdx' && v.sym0 === '4,USDC') {
    return true
  }
  if (tCoin === 'DFS' && v.contract0 === 'minedfstoken' && v.sym0 === '4,DFS') {
    return true
  }
  if (tCoin === 'PBTC' && v.contract0 === 'btc.ptokens' && v.sym0 === '8,PBTC') {
    return true
  }
  return false
}
// 处理币种APY
export function dealApy(v) {
  // 基础数据
  const dfsPrice = store.state.sys.dfsPrice;
  const marketListsPddex = store.state.config.marketLists;
  const marketLists = store.state.sys.marketLists;

  const tagLpMids = store.state.config.tagLpMids;
  const lpMid = store.state.config.lpMid;
  // 手续费年化
  let feesApr = 0
  let newItem = v;
  if (!newItem.volume24H) {
    const market = marketListsPddex.find(vv => vv.mid === v.mid)
    market ? newItem = market : ''
  }
  if (newItem.volume24H) {
    const fees = parseFloat(newItem.volume24H || 0) * 0.002;
    const sym0Liq = parseFloat(newItem.reserve0 || 0) * 2;
    feesApr = fees / (sym0Liq - fees) * 365 * 100;
  } else {
    const storeFeesApr = store.state.sys.feesApr;
    const aprJson = storeFeesApr.find(vv => vv.mid === v.mid) || {};
    feesApr = parseFloat(aprJson.poolsApr || 0)
    if (newItem.mid === 637) {
      console.log(aprJson)
    }
  }
  // DFS 挖矿年化
  const rewardV3 = perDayRewardV3(v.mid)
  const aprV3 = rewardV3 * dfsPrice / 20000 * 365 * 100;
  // TAG 挖矿年化
  let tagLpApy = 0
  const has = tagLpMids.find(vv => vv === v.mid)
  if (has) {
    tagLpApy = getTagLpApy(v.mid)
  }
  let countApy = parseFloat(feesApr) + parseFloat(aprV3)
                 + parseFloat(tagLpApy)
  // LP 挖矿
  let lpApy = {}
  lpMid.forEach(vv => {
    const apy = dealLpAPY(vv.mid, vv.symbol, v);
    lpApy[`${vv.symbol.toLowerCase()}Apy`] = apy;
    if (apy) {
      countApy = accAdd(countApy, Number(apy))
    }
  })
  // USDC 年化
  const dfsPoolsBal = store.state.mine.usdcBalForDfs; // usdc DFS 挖矿池子余额
  const usdcPoolsBal = store.state.mine.usdcBalForUsdc; // usdc 挖矿池子余额
  const swapDfsBal = store.state.mine.swapDfsBal; // swap 内全部DFS
  const swapUsdcBal = store.state.mine.swapUsdcBal; // swap 内全部USDC
  const dfsPools = store.state.mine.dfsPools;
  const usdcPools = store.state.mine.usdcPools;
  let usdcApr = 0;
  const hasIndex = usdcPools.findIndex(vv => vv.mid === v.mid)
  if (hasIndex !== -1) {
    if ((v.contract0 === 'usdxusdxusdx' && v.symbol0 === 'USDC')
    || (v.contract1 === 'usdxusdxusdx' && v.symbol1 === 'USDC')) {
      // 计算USDC年化
      const num = 10;
      const rate = 10 / swapUsdcBal;
      const t = 86400 * 365;
      let weight = 1;
      const rank = hasIndex + 1;
      if (rank === 1) {
        weight = 1.5;
      } else if (rank === 2) {
        weight = 1.4;
      } else if (rank === 3) {
        weight = 1.3;
      } else if (rank === 4) {
        weight = 1.2;
      } else if (rank === 5) {
        weight = 1.1;
      }
      if (v.mid === 722) {
        weight = 1.5;
      }
      const reward = usdcPoolsBal - usdcPoolsBal * Math.pow(0.9999, t * rate * weight)
      const apy = reward / num * 100;
      usdcApr += Number(apy || 0)
    }
  }
  const hasIndexDfs = dfsPools.findIndex(vv => vv.mid === v.mid)
  if (hasIndexDfs !== -1) {
    if ((v.contract0 === 'minedfstoken' && v.symbol0 === 'DFS')
    || (v.contract1 === 'minedfstoken' && v.symbol1 === 'DFS')) {
      // 计算DFS 交易对 的usdc年化
      const num = 10;
      const rate = 10 / swapDfsBal;
      const t = 86400 * 365;
      const weight = 1;
      const reward = dfsPoolsBal - dfsPoolsBal * Math.pow(0.9999, t * rate * weight)
      const mineCoin = marketLists.find(vv => vv.mid === 729)
      const dfsPrice = mineCoinPrice(mineCoin)
      // console.log(dfsPoolsBal, dfsPrice, swapDfsBal)
      const apy = reward * dfsPrice * 100 / num;
      usdcApr += Number(apy || 0)
    }
  }
  // if (usdcApr) {
  //   console.log(v.mid, usdcApr)
  // }
  countApy += Number(usdcApr || 0)

  return {countApy, lpApy, tagLpApy, aprV3, feesApr, usdcApr}
}
function mineCoinPrice(mineCoin = {}) {
  if (mineCoin.symbol0 === 'DFS') {
    return (parseFloat(mineCoin.reserve0) / parseFloat(mineCoin.reserve1) || 0)
  }
  return (parseFloat(mineCoin.reserve1) / parseFloat(mineCoin.reserve0) || 0)
}
// 获取LP年化
function dealLpAPY(mid = 329, project, v) {
  const marketLists = store.state.sys.marketLists;
  let yfcReward = getYfcReward(v.mid, 'year', project);
  if (Number(yfcReward)) {
    const YfcPool = marketLists.find(vv => vv.mid === mid) || {};
    const price = parseFloat(YfcPool.reserve0 || 0) / parseFloat(YfcPool.reserve1 || 1)
    yfcReward = yfcReward * price / 20000 * 100;
    yfcReward = yfcReward.toFixed(2);
  }
  return yfcReward || '0.00';
}
