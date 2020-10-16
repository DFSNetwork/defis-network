// import axios from 'axios';
import store from '@/store';
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
  const nowTime = Date.parse(new Date()) / 1000;
  const sT = nowTime - li.beginTime; // 持续时间
  // console.log(li)
  if (!li.id || sT <= 0 || parseFloat(li.max_supply) <= parseFloat(li.supply)) {
    return 0
  } // || sT <= 0
  const price = parseFloat(pool.reserve0) / (parseFloat(pool.reserve1) || 1) // TIME 当前价格
  const eos = parseFloat(market.reserve0) || 1;
  // const price = 0.001
  // const eos = 10000
  try {
    if (type === 'year') {
      const times = Math.ceil(sT / li.halftime);
      const lamp = Math.pow(0.5,times); // 衰减系数
      // const secGet = (parseFloat(li.max_supply) * lamp / 7) / 2 / 604800;
      // const dayGet = secGet * 60 * 60 * 24;
      // const apy = dayGet * price / eos * 365 * 100 / 2;
      const dayGet = parseFloat(li.max_supply) * lamp / 7;
      const apy = dayGet * price / eos * 365 * 100 ;
      return apy.toFixed(3)
    }
  } catch (error) {
    console.log(error)
  }
  return 0
}