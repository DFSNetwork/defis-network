// import axios from 'axios';
import store from '@/store';

export function timeApy(mid, type, pool) {
  const timeList = store.state.config.timeList;
  const li = timeList.find(v => v.id == mid) || {};
  const nowTime = Date.parse(new Date()) / 1000;
  const sT = nowTime - li.beginTime; // 持续时间
  if (!li.id || sT <= 0 || parseFloat(li.max_supply) <= parseFloat(li.supply)) {
    return 0
  } // || sT <= 0
  const price = parseFloat(pool.reserve0) / (parseFloat(pool.reserve1) || 1)
  const eos = parseFloat(pool.reserve0) || 1;
  // const price = 0.001
  // const eos = 10000
  if (type === 'year') {
    const times = Math.ceil(sT / 604800);
    const lamp = Math.pow(0.5,times); // 衰减系数
    const secGet = (parseFloat(li.max_supply) * lamp) / 2 / 604800;
    const dayGet = secGet * 60 * 60 * 24;
    const apy = dayGet * price / eos * 365 * 100;
    return apy.toFixed(3)
  }
  return 0
}