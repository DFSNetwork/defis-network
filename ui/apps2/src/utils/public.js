import Decimal from 'decimal.js';
import { EosModel } from '@/utils/eos';
import moment from 'moment';
import store from '@/store';
import {getJson} from './api'

let cdnImgJson; // CDN 图片配置
async function getCdnImgJson() {
  const {status, result} = await getJson()
  if (!status) {
    return
  }
  cdnImgJson = result;
}
getCdnImgJson();
export function getPngLen() {
  return cdnImgJson ? cdnImgJson.png.length : 1
}
export function getPng(index) {
  return cdnImgJson ? cdnImgJson.png[index] : 'minedfstoken-dfs'
}
/*
 ** 加法函数，用来得到精确的加法结果
 ** 返回值：arg1 + arg2的精确结果 Number 型
*/
export function accAdd(arg1, arg2) {
  return new Decimal(arg1).add(new Decimal(arg2)).toNumber()
}

/*
 ** 减法函数，用来得到精确的减法结果
 ** 返回值：arg1 - arg2的精确结果 Number 型
*/
export function accSub(arg1, arg2) {
  return new Decimal(arg1).sub(new Decimal(arg2)).toNumber();
}

/*
 ** 乘法函数，用来得到精确的乘法结果
 ** 返回值：arg1 * arg2的精确结果 Number 型
*/
export function accMul(arg1, arg2) {
  if (!arg1 || !arg2) {
    return 0
  }
  return new Decimal(arg1).mul(new Decimal(arg2)).toNumber();
}

/*
 ** 除法函数，用来得到精确的除法结果
 ** 返回值：arg1 / arg2的精确结果 Number 型
*/
export function accDiv(arg1, arg2) {
  if (!arg1 || !arg2) {
    return 0
  }
  return new Decimal(arg1).div(new Decimal(arg2)).toNumber();
}

/*
 ** 指数函数，用来得到精确的指数结果
 ** 返回值：Math.pow(arg1, arg2)的精确结果 Number 型
*/
export function accPow(arg1, arg2) {
  if (!arg1 || !arg2) {
    return 0
  }
  return new Decimal(arg1).pow(new Decimal(arg2)).toNumber();
}

// 登录
export function login(vThis, cb) {
  EosModel.scatterInit(vThis, () => {
    // handleScatterOut(cb)
    EosModel.getIdentity('eos', (err => {
      cb(err)
    }));
  });
}
// 先退出scatter
export function handleScatterOut(cb) {
  EosModel.accountLoginOut(() => {
    EosModel.getIdentity('eos', (err => cb(err)));
  });
}
// 获取60秒均价
export function getPrice(cb) {
  const baseConfig = store.state.sys.baseConfig;
  const params = {
    code: baseConfig.oracle, // 'jinoracle113',
    json: true,
    limit: 2,
    scope: '0',
    table: 'avgprices',
  }
  EosModel.getTableRows(params, (res) => {
    const list = res.rows || [];
    const t = list.find(v => v.key === 60) || {};
    const price = toFixed(t.price0_avg_price / 10000, 4);
    cb(price);
  })
}

// 科学计数法转数值 - 处理 1e-7 这类精度问题
export function getFullNum(num) {
  // 处理非数字
  if (isNaN(num)) {
    return num;
  }
  // 处理不需要转换的数字
  const str = String(num);
  if (!/e/i.test(str)) {
    return num;
  }
  return Number(num).toFixed(18).replace(/\.?0+$/, '');
}

// 返回小数位后几位 截取
// number 数值
// p 位数
export function toFixed(number, pp) {
  if (!pp) pp = 4;
  let num = isNaN(number) || !number ? 0 : number;
  let p = isNaN(number) || !number ? 4 : pp;
  num = getFullNum(num);
  var n = (num + '').split('.'); // eslint-disable-line
  var x = n.length > 1 ? n[1] : ''; // eslint-disable-line
  if (x.length > p) { // eslint-disable-line
    x = x.substr(0, p); // eslint-disable-line
  } else { // eslint-disable-line
    x += Array(p - x.length + 1).join('0'); // eslint-disable-line
  } // eslint-disable-line
  return n[0] + (x == '' ? '' : '.' + x); // eslint-disable-line
}

// 获取路由参数
export function GetUrlPara() {
  const url = document.location.toString();
  const arrUrl = url.split('?');
  if (arrUrl.length === 1) {
    return {
      dapp: 'moreWallet',
    };
  }
  const para = arrUrl[1];
  const qureyArr = para.split('&');
  const params = {};
  for (let i = 0; i < qureyArr.length; i += 1) {
    const arr = qureyArr[i].split('=');
    params[arr[0]] = arr[1];
  }
  return params;
}
/**
 * 时间戳转成本地时间
 */
export function toLocalTime(time) {
  return moment(time).format('YYYY-MM-DD HH:mm:ss')
}

// 柯里化函数 - 多数据等待计算
function newArr(length) {
  var newArr = [...Object.keys(window).slice(0, length)].map(() => '')
  return newArr
}
export function crazyCurryingHelper(fn, args) {
  const length = fn.length // fn所需的参数个数
  args = args || newArr(length) // 已有参数 | 创建一个fn需要参数长度的数组
  return function(...rest) {
    let _args = args.slice();
    rest.forEach((item, i) => {
    if (item !== '') {
        _args.splice(i, 1, item)
    }
  })
  const nullLength = _args.filter(item => !item).length; // 缺少参数数量
  return !nullLength // 递归的进行柯里化
         ? fn.apply(this, _args)
         : crazyCurryingHelper.call(this, fn, _args)
  }
}

// 跳转对应链上的区块浏览器 - id: txid | account , chain: 所属链 , type: 'tx' | 'account' | 'token'
export function toBrowser(id, type) {
  const typeObj = {
    tx: 'https://bloks.io/transaction/',
    account: 'https://bloks.io/account/',
    token: 'https://bloks.io/tokens/',
  }
  let url = `${typeObj[type]}${id}`
  location.href = url;
}

// 倒计时
export function countdown(endtime, istamp, type) {
  let t;
  if (!istamp) {
    t = Date.parse(endtime.replace(/-/g, '/')) - Date.parse(new Date());
  } else {
    t = endtime * 1000 - Date.parse(new Date());
  }
  const days = Math.floor(t / (1000 * 60 * 60 * 24));
  let hours = Math.floor((t / (1000 * 60 * 60)) % 24); // 不累加天数的小时
  if (type === 'hours') {
    hours = Math.floor((t / (1000 * 60 * 60))); // 累加天数的小时
  }
  let minutes = Math.floor((t / 1000 / 60) % 60);
  let seconds = Math.floor((t / 1000) % 60);
  hours = hours >= 10 ? hours : `0${hours}`;
  minutes = minutes >= 10 ? minutes : `0${minutes}`;
  seconds = seconds >= 10 ? seconds : `0${seconds}`;
  if (t <= 0) {
    return {
      total: t,
      days: 0,
      hours: '00',
      minutes: '00',
      seconds: '00'
    };
  }
  return { total: t, days, hours, minutes, seconds };
}

export function getUrlParams(url) {
  const params = {};
  url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(str, key, value) {
    params[key] = value;
  });
  return params;
}
// 处理用户挖矿数据
export function dealMinerData(minnerData) {
  let lastTime = toLocalTime(`${minnerData.last_drip}.000+0000`);
  lastTime = moment(lastTime).valueOf();
  minnerData.lastTime = lastTime;
  // console.log(minnerData)
  const liq_bal0Arr = minnerData.liq_bal0.split(' ');
  const liq_bal1Arr = minnerData.liq_bal1.split(' ');
  let liq = 0;
  if (liq_bal0Arr[1] === 'EOS') {
    liq = liq_bal0Arr[0];
  } else if (liq_bal1Arr[1] === 'EOS') {
    liq = liq_bal1Arr[0];
  } else if (liq_bal0Arr[1] === 'USDT') {
    const eosPrice = getEosPrice()
    liq = liq_bal0Arr[0] / eosPrice;
  } else if (liq_bal1Arr[1] === 'USDT') {
    const eosPrice = getEosPrice()
    liq = liq_bal1Arr[0] / eosPrice;
  }
  minnerData.liq = liq;
  return minnerData
}

export function getEosPrice() {
  const marketLists = store.state.sys.marketLists;
  const eosMarket = marketLists.find(v => v.mid === 17)
  if (!eosMarket) {
    return 2.65
  }
  const price = parseFloat(eosMarket.reserve1) / parseFloat(eosMarket.reserve0)
  // console.log(price)
  return price;
}

// 计算池子手续费年化
export function getPoolApr(market) {
  const eggargs = store.state.sys.eggargs;
  const egg = eggargs.find(v => v.mid == market.mid);
  if (!egg || !market.reserve0) {
    return 0;
  }
  let fee_eos = parseFloat(egg.trigger_value_max) * 6 * 24 * 0.002;
  let apr = (fee_eos * 365 / parseFloat(market.reserve0) * 100).toFixed(3)
  return apr
}

export function getMarketTime(startTime) {
  let t = Date.parse(new Date()) - (Number(startTime) + 8 * 3600) * 1000;
  const days = Math.floor(t / (1000 * 60 * 60 * 24));
  let hours = Math.floor((t / (1000 * 60 * 60)) % 24); // 不累加天数的小时
  // let hours = Math.floor((t / (1000 * 60 * 60))); // 累加天数的小时
  let minutes = Math.floor((t / 1000 / 60) % 60);
  let seconds = Math.floor((t / 1000) % 60);
  hours = hours >= 10 ? hours : `0${hours}`;
  minutes = minutes >= 10 ? minutes : `0${minutes}`;
  seconds = seconds >= 10 ? seconds : `0${seconds}`;
  if (t <= 0) {
    return {
      total: t,
      days: 0,
      hours: '00',
      minutes: '00',
      seconds: '00'
    };
  }
  return { total: t, days, hours, minutes, seconds };
}
export function getMarketTimeLp(startTime) {
  let sDate = startTime.toString().indexOf('-') === -1 ? startTime : Date.parse(startTime.replace(/-/g, '/'))
  // console.log(startTime.indexOf('-'))
  let t = Date.parse(new Date()) - sDate;
  // let t = Date.parse(new Date()) - (Number(startTime) + 8 * 3600) * 1000;
  const days = Math.floor(t / (1000 * 60 * 60 * 24));
  let hours = Math.floor((t / (1000 * 60 * 60)) % 24); // 不累加天数的小时
  // let hours = Math.floor((t / (1000 * 60 * 60))); // 累加天数的小时
  let minutes = Math.floor((t / 1000 / 60) % 60);
  let seconds = Math.floor((t / 1000) % 60);
  hours = hours >= 10 ? hours : `0${hours}`;
  minutes = minutes >= 10 ? minutes : `0${minutes}`;
  seconds = seconds >= 10 ? seconds : `0${seconds}`;
  if (t <= 0) {
    return {
      total: t,
      days: 0,
      hours: '00',
      minutes: '00',
      seconds: '00'
    };
  }
  return { total: t, days, hours, minutes, seconds };
}
// project - 指代项目：eg： DBC ｜ YFC
export function getYfcReward(mid, type, project = 'YFC') {
  const lpMineList = store.state.config.lpMineList;
  const pList = lpMineList[project] || [];
  const list = pList.find(v => mid === v.id);
  // console.log(list)
  if (!list || parseFloat(list.max_supply) <= parseFloat(list.supply)) {
    return '0.00000000';
  }
  const nowT = Date.parse(new Date()) / 1000;
  if (nowT >= list.endTime || nowT < list.beginTime) {
    return '0.00000000';
  }
  const poolsBal = store.state.sys.poolsBal;
  const yfcBal = store.state.config.lpPoolsBal[project] || '0';
  const dampingYfc = store.state.config.lpDamping[project] || 1;
  const weight = Number(list.weight)
  const rate = accDiv(10000, poolsBal);
  let t = 3600;
  let reward = yfcBal - yfcBal * Math.pow(0.9999, t * rate * weight * dampingYfc);
  if (type === 'year') {
    reward = reward * 24;
    reward = reward * 365;
  }
  // console.log(yfcBal, poolsBal, dampingYfc, rate, weight)
  return toFixed(reward, 8)
}

export function getAccYfcReward(minnerData, data, type) {
  const rate = accDiv(minnerData.liq || 10000, data.eosBal);
  const weight = data.weight;
  const damping = data.damping;
  const yfcBal = data.yfcBal;
  let t = 3600;
  if (minnerData.lastTime) {
    t = moment().valueOf() - minnerData.lastTime;
    t = t / 1000;
  }
  // console.log(t, yfcBal, damping, weight, rate)
  // pow(0.9999, time_elapsed * bal_ratio * pool_weight * damping);
  let reward = yfcBal - yfcBal * Math.pow(0.9999, t * rate * weight * damping);
  // reward = reward * 0.8;
  if (type === 'year') {
    reward = reward * 24;
    reward = reward * 365;
  }
  // console.log(reward)
  return toFixed(reward, 8)
}

export function getDbcReward(mid, type) {
  const list = store.state.sys.dbcList.find(v => mid === v.id);
  if (!list || parseFloat(list.max_supply) <= parseFloat(list.supply)) {
    return '0.00000000';
  }
  const nowT = Date.parse(new Date()) / 1000;
  if (nowT >= list.endTime || nowT < list.beginTime) {
    return '0.00000000';
  }
  const poolsBal = store.state.sys.poolsBal;
  const yfcBal = store.state.sys.dbcBal;
  const dampingYfc = store.state.sys.dampingDbc;
  const weight = Number(list.weight)
  const rate = accDiv(10000, poolsBal);
  let t = 3600;
  let reward = yfcBal - yfcBal * Math.pow(0.9999, t * rate * weight * dampingYfc);
  if (type === 'year') {
    reward = reward * 24;
    reward = reward * 365;
  }
  return toFixed(reward, 8)
}

export function getDmdMinerHourRoi(market, type, dmdPools) {
  const config = store.state.config.dmdMineConfig;
  const thisConf = config.find(v => v.mid === market.mid) || {};
  if (!thisConf.mid || !dmdPools) {
    return '0'
  }
  const endDate = (thisConf.duration + thisConf.epoch) * 1000
  const nowDate = Date.parse(new Date())
  if (endDate < nowDate) {
    return '0'
  }
  const maxSupply = thisConf.maxSupply || 0;
  const hour = thisConf.duration / 3600;
  let reserve = parseFloat(market.reserve1) * 2;
  if (market.symbol1 !== 'DMD') {
    const dmdPrice = parseFloat(dmdPools.reserve0) / parseFloat(dmdPools.reserve1);
    const sym1Price = parseFloat(market.reserve0) / parseFloat(market.reserve1);
    reserve = parseFloat(market.reserve1) * 2 * sym1Price.toFixed(4) / dmdPrice.toFixed(4);
  }
  const hourRoi = (maxSupply / hour) / reserve * 100;
  // console.log('-----------------')
  // console.log(maxSupply, hour, reserve)
  // console.log(hourRoi, market)
  // console.log(hourRoi * 24, 'day')
  // console.log(hourRoi * 24 * 7, 'week')
  // console.log(hourRoi * 24 * 365, 'year')
  // console.log('-----------------')
  if (type === 'hour') {
    return toFixed(hourRoi, 3);
  }
  if (type === 'day') {
    return toFixed(hourRoi * 24, 3);
  }
  if (type === 'week') {
    return toFixed(hourRoi * 24 * 7, 3);
  }
  return toFixed(hourRoi * 24 * 365, 3);
}

export function getPriceLen(price) {
  let len = 6;
  if (Number(price) > 1000) {
    len = 2
  } else if (Number(price) > 10) {
    len = 4
  } else if (Number(price) > 1) {
    len = 5
  }
  return len;
}

export function dealPrice(price) {
  return Number(price).toFixed(getPriceLen())
}

// 返回币种图片地址
export function getCoin(contract, coin) {
  // console.log(cdnImgJson)
  const inData = `${contract.toLowerCase()}-${coin.toLowerCase()}`
  try {
    const localeCoin = cdnImgJson.svg;
    const localCoinPng = cdnImgJson.png;
    const has = localeCoin.find(v => v === inData)
    if (has) {
      return `https://cdn.jsdelivr.net/gh/defis-net/material/coin/${has}.svg`;
    }
    const hasPng = localCoinPng.find(v => v === inData);
    if (!has && hasPng) {
      // return `/static/coin/${hasPng}.png`;
      return `https://cdn.jsdelivr.net/gh/defis-net/material/coin/${hasPng}.png`;
    }
    return `https://ndi.340wan.com/eos/${inData}.png`
  } catch (error) {
    return `https://ndi.340wan.com/eos/${inData}.png`
  }
}

// 处理账号缩略 < 12 隐藏后半部分 | === 12 隐藏中间部分 | 自己账户不处理
export function dealAccountHide(str) {
  const scatter = store.state.app.scatter;
  if (scatter && scatter.identity && scatter.identity.accounts[0].name === str) {
    return str
  }
  const t = str.length % 3;
  const len1 = Math.ceil(str.length/3);
  let len2 = len1;
  let len3 = len1;
  if (t === 2) {
    len3 = len1 - 1;
  } else if (t === 1) {
    len2 = len1 - 1;
    len3 = len1 - 1;
  }
  const s1 = str.substr(0, len1)
  const s2 = '****'.substr(0, len2)
  const s3 = str.substr(len2+len1, len3)
  return s1 + s2 + s3;
}

// 数组对象去重
export function dealSymArr(lists = []) {
  const resArr = [];
  lists.forEach((v) => {
    resArr.push(v.sym0Data, v.sym1Data)
  })
  // 删除重复项
  const uniques = [];
  const stringify = {};
  resArr.forEach(v => {
    const str = `${v.contract}:${v.symbol}`;
    if (!stringify[str]) {
      uniques.push(v);
      stringify[str] = true;
    }
  })
  return uniques;
}