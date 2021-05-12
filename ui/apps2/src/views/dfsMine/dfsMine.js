
import { getCoin, dealPrice } from '@/utils/public';
import moment from 'moment';
import store from '@/store';
export function getApy(allBal, swapBals, type) {
  const coinPrices = store.state.sys.coinPrices;
  const dfsPriceObj = coinPrices.find(v => v.coin === 'DFS');
  const dfsPrice = dfsPriceObj.price;
  let poolBal, swapBal, price;
  if (type === 'dfs') {
    poolBal = allBal.dfsPoolsBal;
    swapBal = swapBals.dfsSwapBal;
    price = dfsPrice;
  } else if (type === 'eos') {
    poolBal = allBal.eosPoolsBal;
    swapBal = swapBals.eosSwapBal;
    const priceObj = coinPrices.find(v => v.coin === 'EOS')
    price = priceObj.price;
  } else if (type === 'usdt') {
    poolBal = allBal.usdtPoolsBal;
    swapBal = swapBals.usdtSwapBal;
    const priceObj = coinPrices.find(v => v.coin === 'USDT')
    price = priceObj.price;
  }
  if (!parseFloat(poolBal) || !parseFloat(swapBal)) {
    return '0.00'
  }
  const reward = getReward({
    poolBal, swapBal
  })
  const apy = reward * dfsPrice / (10 * price) * 100;
  return (apy || 0).toFixed(2)
}
export function getReward(sysData, accData = {}) {
  const poolBal = sysData.poolBal;
  const swapBal = sysData.swapBal;
  const nowTime = moment().valueOf();
  const t = accData.lastTime ? (nowTime - accData.lastTime) / 1000 : (86400 * 365);
  // console.log(nowTime, t)
  const accNum = accData.num || 10;
  const rate = (accNum / swapBal)
  const reward = poolBal * (1 - Math.pow(0.9999, rate * t));
  return reward || 0
}

export function dfsMineLists(lists = [], tops = []) {
  const arr = [], top = [];
  lists.forEach(item => {
    let v = item
    if (v.contract1 === 'tethertether' && v.sym1 === '4,USDT') {
      const newList = {
        contract0: v.contract1,
        contract1: v.contract0,
        liquidity_token: v.liquidity_token,
        mid: v.mid,
        reserve0: v.reserve1,
        reserve1: v.reserve0,
        sym0: v.sym1,
        sym1: v.sym0,
        exchangeSym: true,
      }
      v = newList;
    } else if (v.contract0 === 'tethertether' && v.contract1 === 'eosio.token' && v.sym1 === '4,EOS') {
      const newList = {
        contract0: v.contract1,
        contract1: v.contract0,
        liquidity_token: v.liquidity_token,
        mid: v.mid,
        reserve0: v.reserve1,
        reserve1: v.reserve0,
        sym0: v.sym1,
        sym1: v.sym0,
        exchangeSym: true,
      }
      v = newList;
    } if (v.contract0 === 'tethertether' && v.contract0 === 'eosio.token' &&
          v.contract1 === 'minedfstoken' && v.sym1 === '4,DFS') {
      const newList = {
        contract0: v.contract1,
        contract1: v.contract0,
        liquidity_token: v.liquidity_token,
        mid: v.mid,
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
    v.imgUrl0 = getCoin(v.contract0, v.symbol0.toLowerCase())
    v.imgUrl1 = getCoin(v.contract1, v.symbol1.toLowerCase())
    v.price = dealPrice((parseFloat(v.reserve0) / parseFloat(v.reserve1) || 0))

    v.sym0Data = {
      mid: v.mid,
      last_update: v.last_update,
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
      contract: v.contract1,
      decimal: v.decimal1,
      reserve: v.reserve1,
      sym: v.sym1,
      symbol: v.symbol1,
      imgUrl: getCoin(v.contract1, v.symbol1.toLowerCase()),
    }

    const topHas = tops.findIndex(vv => vv === v.mid)
    if (topHas !== -1) {
      top.push(v)
    } else {
      arr.push(v)
    }
  })
  return [...top, ...arr]
}