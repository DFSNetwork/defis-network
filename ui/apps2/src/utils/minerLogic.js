// import axios from 'axios';
import moment from 'moment';
import store from '@/store';
import { get_balance, get_table_rows } from '@/utils/api'
/**
 * 
 * @param {*} mid 映射LP 做市ID
 * @param {*} type 'year' - 年化 
 * @param {*} pool time池子数据
 */
export function timeApy(market, type, pool) {
  const mid = market.mid;
  const timeList = store.state.config.timeList; // TIME LP挖矿列表
  const li = timeList.find(v => v.id == mid) || {};
  const nowTime = moment().valueOf() / 1000;
  const sT = nowTime - li.beginTime; // 持续时间
  // console.log(li)
  if (!li.id || sT <= 0 || parseFloat(li.max_supply) <= parseFloat(li.supply)) {
    return 0
  } // || sT <= 0
  const price = parseFloat(pool.reserve0) / (parseFloat(pool.reserve1) || 1) // TIME 当前价格
  const eos = parseFloat(market.reserve0) || 1;
  try {
    if (type === 'year') {
      const times = Math.ceil(sT / li.halftime);
      const lamp = Math.pow(2,times); // 衰减系数
      const tNum = parseFloat(li.max_supply) - parseFloat(li.supply); // 池子剩余数量
      const secGet = tNum / lamp / li.halftime;
      const dayGet = secGet * 60 * 60 * 24;
      const apy = dayGet * price / eos * 365 * 100 ;
      // console.log(li.max_supply, lamp, price, eos)
      return apy.toFixed(3)
    }
  } catch (error) {
    console.log(error)
  }
  return 0
}

export function timeNum(market, userLP, rankWeight) {
  const mid = market.mid;
  const timeList = store.state.config.timeList; // TIME LP挖矿列表
  const li = timeList.find(v => v.id == mid) || {};
  const nowTime = moment().valueOf() / 1000;
  const sT = nowTime - userLP.beginTime; // 持续时间
  if (!li.id || sT <= 0 || parseFloat(li.max_supply) <= parseFloat(li.supply)) {
    return 0
  } // || sT <= 0
  try {
    const times = Math.ceil(sT / li.halftime);
    const lamp = Math.pow(2, times); // 衰减系数
    const tNum = parseFloat(li.max_supply) - parseFloat(li.supply); // 池子剩余数量
    const secGet = tNum / lamp / 2 / li.halftime;
    const num = secGet * sT * (parseInt(userLP.liq_bal0) / market.liquidity_token / 2) * rankWeight.constant;
    // console.log(num)
    return num
  } catch (error) {
    console.log(error)
  }
  return 0
}

export function timeDssNum(li, userLP, rankWeight, allStaked) {
  const nowTime = moment().valueOf() / 1000;
  const sT = nowTime - userLP.beginTime; // 持续时间
  if (!li.id || sT <= 0 || parseFloat(li.max_supply) <= parseFloat(li.supply)) {
    return 0
  } // || sT <= 0
  try {
    const pools = [0.5333,0.7,0.7333,0.8,1];
    const uPool = pools[userLP.pool]
    const times = Math.ceil(sT / li.halftime);
    const lamp = Math.pow(2,times); // 衰减系数
    const tNum = parseFloat(li.max_supply) - parseFloat(li.supply); // 池子剩余数量
    const secGet = tNum / lamp / 2 / 604800;
    const num = secGet * sT * (parseFloat(userLP.liq_bal0) / parseFloat(allStaked.stackasset) / 2) * rankWeight.constant * uPool;
    // console.log(num)
    return num
  } catch (error) {
    console.log(error)
  }
  return 0
}

// 获取Tag Lp余额
export async function getTagLpBal(cb) {
  const baseConfig = store.state.sys.baseConfig;
  const params = {
    code: baseConfig.nodeToken,
    symbol: 'TAG',
    decimal: 8,
    account: baseConfig.lpPools,
  }
  const {status, result} = await get_balance(params);
  if (!status) {
    cb(0)
    return
  }
  store.dispatch('setTagLpBal', parseFloat(result))
  cb(parseFloat(result))
}

// TAG LP 矿池列表
export async function get_tag_lp_mids(cb) {
  const params = {
    "code": "vote.tag",
    "scope": "vote.tag",
    "table": "pools",
    "json": true,
    limit: 10000
  }
  const {status, result} = await get_table_rows(params)
  if (!status) {
    return
  }
  let rows = result.rows || [];
  rows.sort((a, b) => {
    return Number(b.total_votes) - Number(a.total_votes)
  })
  let mids = [];
  rows.forEach(v => {
    mids.push(v.mid)
  })
  mids = mids.slice(0, 15)
  store.dispatch('setTagLpMids', mids)
  if (cb) {
    cb(mids)
  }
}