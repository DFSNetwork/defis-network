// App.vue 比较复杂的逻辑处理部分
import { getCoin, dealPrice} from '@/utils/public';
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