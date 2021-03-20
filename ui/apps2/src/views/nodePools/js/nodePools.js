// nodePools 逻辑处理
import store from '@/store';
import moment from 'moment';

import { toLocalTime } from '@/utils/public'
import {get_producers} from '@/utils/api'
import { get_table_rows } from '@/api/list'

export async function getNodeLists() {
  const {status, result} = await get_producers()
  if (!status) {
    return
  }
  const rows = result.producers || []
  store.dispatch('setNodeLists', JSON.parse(JSON.stringify(rows)))
}
// 获取全网权重加成
export function getVoteWeight() {
  let sec_since_lanch = 946684800;
  let weight_1 = parseInt((moment().valueOf() / 1000 - sec_since_lanch) / (86400 * 7)) / 52;
  weight_1 = 1 / Math.pow(2, weight_1) / 10000
  // console.log(weight_1)
  return weight_1;
}
// 用户票数统计
export async function getAccVote(cb) {
  const formName = store.state.app.scatter.identity.accounts[0].name;
  const params = {
    "code":"eosio",
    "scope":"eosio",
    "table":"voters",
    "json":true,
    "lower_bound": ` ${formName}`,
    "upper_bound": ` ${formName}`,
  }
  const {status, result} = await get_table_rows(params)
  if (!status) {
    cb({eosNum: '0.0000'})
    return
  }
  const rows = result.rows || [];
  // 没有抵押数据
  if (!rows.length) {
    cb({eosNum: '0.0000'})
    return
  }
  // 代理不是dfsbpsproxy1
  const accVoteData = rows[0];
  // 挖矿用户
  const eosNum = accVoteData.staked / 10000;
  accVoteData.eosNum = eosNum.toFixed(4);
  accVoteData.isDfsProxy = accVoteData.proxy === "dfsbpsproxy1";
  accVoteData.isfarmer = false; // 默认非挖矿账户
  const kweight = getVoteWeight();
  const uweight = accVoteData.staked / accVoteData.last_vote_weight;
  const percent = kweight * 10000 / uweight * 100;
  // console.log(kweight, uweight)
  accVoteData.percent = percent.toFixed(2)
  accVoteData.rexBegin = moment().valueOf() / 1000 - 1605096000 >= 0;
  // cb(accVoteData)
  getAccFarmerData(accVoteData, cb)
}
// 获取farmer挖矿数据
export async function getAccFarmerData(accVoteData, cb) {
  const baseConfig = store.state.sys.baseConfig;
  const formName = store.state.app.scatter.identity.accounts[0].name;
  const params = {
    "code": baseConfig.nodeMiner,
    "scope": baseConfig.nodeMiner,
    "table":"farmers",
    "json":true,
    "lower_bound": ` ${formName}`,
    "upper_bound": ` ${formName}`,
  }
  const {status, result} = await get_table_rows(params)
  if (!status) {
    return
  }
  const rows = result.rows || [];
  // console.log(rows)
  // console.log(accVoteData)
  if (!rows.length) {
    cb(accVoteData)
    return
  }
  const row = rows[0];
  accVoteData.isfarmer = true;
  accVoteData.last_drip = row.last_drip;
  // if (accVoteData.last_vote_weight !== row.last_vote_weight) {
  if (accVoteData.proxy !== 'dfsbpsproxy1') {
    accVoteData.showJoinBtn = true;
    cb(accVoteData)
    return;
  }
  cb(accVoteData)
}

// 计算收益
// baseData = {aprs}
export function getReward(baseData, userData) {
  // console.log(baseData, userData)
  const filterMkLists = store.state.sys.filterMkLists;
  const market = filterMkLists.find(v => v.mid == baseData.mid)
  if (!market) {
    return 0
  }
  let price = parseFloat(market.reserve0) / parseFloat(market.reserve1)
  if (baseData.mid === 17) {
    price = 1;
  }
  // console.log(baseData.mid, price)
  // 基础数据
  const aprs = baseData.aprs;
  // 用户数据
  const accNum = userData.accNum;
  const nowT = moment().valueOf()
  let lastT = toLocalTime(`${userData.last_drip}.000+0000`).replace(/-/g, '/')
  // console.log(lastT)
  lastT = moment(lastT).valueOf()
  let t = (nowT - lastT) / 1000 ; // 默认一天时间
  // console.log(t)

  let rewardEos = accNum * Math.pow(aprs, t) - accNum; // 日收益 EOS
  let rewardToken = rewardEos / price;
  if (parseFloat(baseData.poolbal) < rewardToken) {
    rewardToken = parseFloat(baseData.poolbal)
  }
  return rewardToken
}

export function getJoinActions(accVoteData) {
  const baseConfig = store.state.sys.baseConfig;
  const scatter = store.state.app.scatter;
  const formName = scatter.identity.accounts[0].name;
  const permission = scatter.identity.accounts[0].authority;
  const join = {
    account: baseConfig.nodeMiner,
    name: 'join',
    authorization: [{ 
      actor: formName,
      permission,
    }],
    data: {
      farmer: formName,
    },
  }
  const harvest = {
    account: baseConfig.nodeMiner,
    name: 'harvest',
    authorization: [{ 
      actor: formName,
      permission,
    }],
    data: {
      farmer: formName,
    },
  }
  const params = {
    actions: []
  }
  if (!accVoteData.isfarmer) {
    params.actions.push(join)
  } else if (accVoteData.showJoinBtn) {
    params.actions.push(harvest)
  }
  return params;
}

// 获取投票给Ta Action
export function getVoteToProxy(accVoteData) {
  const baseConfig = store.state.sys.baseConfig;
  const scatter = store.state.app.scatter;
  const formName = scatter.identity.accounts[0].name;
  const permission = scatter.identity.accounts[0].authority;
  const stakeCpu = {
    account: 'eosio',
    name: 'delegatebw',
    authorization: [{
      actor: formName,
      permission,
    }],
    data: {
      from: formName,
      receiver: formName,
      stake_net_quantity: '0.0000 EOS',
      stake_cpu_quantity: '0.0001 EOS',
      transfer: 0
    }
  }
  const join = {
    account: baseConfig.nodeMiner,
    name: 'join',
    authorization: [{ 
      actor: formName,
      permission,
    }],
    data: {
      farmer: formName,
    },
  }
  const harvest = {
    account: baseConfig.nodeMiner,
    name: 'harvest',
    authorization: [{ 
      actor: formName,
      permission,
    }],
    data: {
      farmer: formName,
    },
  }
  const params = {
    actions: []
  }
  if (!Number(accVoteData.eosNum)) {
    params.actions.unshift(stakeCpu)
  }
  params.actions.push({
    account: 'eosio',
    name: 'voteproducer',
    authorization: [{ 
      actor: formName,
      permission,
    }],
    data: {
      voter: formName,
      proxy: 'dfsbpsproxy1', // 投票的节点名称
      producers: [],
    },
  })
  if (accVoteData.isfarmer) {
    params.actions.push(harvest)
  } else {
    params.actions.push(join)
  }
  return params;
}

// 获取领取操作Actions
export function getClaimActions(accVoteData) {
  // console.log(accVoteData)
  const baseConfig = store.state.sys.baseConfig;
  const scatter = store.state.app.scatter;
  const formName = scatter.identity.accounts[0].name;
  const permission = scatter.identity.accounts[0].authority;
  const stakeCpu = {
    account: 'eosio',
    name: 'delegatebw',
    authorization: [{
      actor: formName,
      permission,
    }],
    data: {
      from: formName,
      receiver: formName,
      stake_net_quantity: '0.0000 EOS',
      stake_cpu_quantity: '0.0001 EOS',
      transfer: 0
    }
  }
  const harvest = {
    account: baseConfig.nodeMiner,
    name: 'harvest',
    authorization: [{ 
      actor: formName,
      permission,
    }],
    data: {
      farmer: formName,
    },
  }
  // const join = {
  //   account: baseConfig.nodeMiner,
  //   name: 'join',
  //   authorization: [{ 
  //     actor: formName,
  //     permission,
  //   }],
  //   data: {
  //     farmer: formName,
  //   },
  // }
  const params = {
    actions: []
  }
  if (!Number(accVoteData.eosNum)) {
    params.actions.unshift(stakeCpu)
  }
  params.actions.push(harvest, {
    account: 'eosio',
    name: 'voteproducer',
    authorization: [{ 
      actor: formName,
      permission,
    }],
    data: {
      voter: formName,
      proxy: 'dfsbpsproxy1', // 投票的节点名称
      producers: [],
    },
  })
  // if (accVoteData.isfarmer) {
  //   params.actions.push(harvest)
  // } else {
  //   params.actions.push(join)
  // }
  return params;
}

// 获取REX操作Actions
export function getRexActions(accVoteData, obj) {
  const baseConfig = store.state.sys.baseConfig;
  const scatter = store.state.app.scatter;
  const formName = scatter.identity.accounts[0].name;
  const permission = scatter.identity.accounts[0].authority;
  let amount = obj.amount;

  const stakeCpu = {
    account: 'eosio',
    name: 'delegatebw',
    authorization: [{
      actor: formName,
      permission,
    }],
    data: {
      from: formName,
      receiver: formName,
      stake_net_quantity: '0.0000 EOS',
      stake_cpu_quantity: '0.0001 EOS',
      transfer: 0
    }
  }
  const harvest = { // 收获
    account: baseConfig.nodeMiner,
    name: 'harvest',
    authorization: [{ 
      actor: formName,
      permission,
    }],
    data: {
      farmer: formName,
    },
  }
  const harvest2 = { // 收获
    account: baseConfig.nodeMiner,
    name: 'harvest2',
    authorization: [{ 
      actor: formName,
      permission,
    }],
    data: {
      farmer: formName,
      random: parseInt(Math.random() * 100)
    },
  }
  const join = { // 加入
    account: baseConfig.nodeMiner,
    name: 'join',
    authorization: [{ 
      actor: formName,
      permission,
    }],
    data: {
      farmer: formName,
    },
  }
  const voteproducer = { // 投票
    account: 'eosio',
    name: 'voteproducer',
    authorization: [{ 
      actor: formName,
      permission,
    }],
    data: {
      voter: formName,
      proxy: 'dfsbpsproxy1', // 投票的节点名称
      producers: [],
    },
  }
  const buyRex = [{ // 充值
    account: 'eosio',
    name: 'deposit',
    authorization: [{
      actor: formName,
      permission,
    }],
    data: {
      owner: formName,
      amount, // eos 数量
    },
  }, { // 买入：buyrex
    account: 'eosio',
    name: 'buyrex',
    authorization: [{
      actor: formName,
      permission,
    }],
    data: {
      from: formName,
      amount, // eos 数量
    },
  }]
  const sellRex = [{ // 卖出：sellrex
    account: 'eosio',
    name: 'sellrex',
    authorization: [{
      actor: formName,
      permission,
    }],
    data: {
      from: formName,
      rex: obj.rex
    },
  },
  { // 提现
    account: 'eosio',
    name: 'withdraw',
    authorization: [{
      actor: formName,
      permission,
    }],
    data: {
      owner: formName,
      amount: obj.getEos
    },
  }]
  const params = {
    actions: []
  };
  if (!Number(accVoteData.eosNum)) {
    params.actions.unshift(stakeCpu)
  }
  params.actions.push(harvest)
  // REX操作处理
  if (obj.type === 'buyRex') {
    params.actions.push(...buyRex)
  } else {
    params.actions.push(...sellRex)
  }
  // 添加投票操作
  params.actions.push(voteproducer)
  // 加入 ｜ 收获
  // console.log(accVoteData)
  if (accVoteData.isfarmer) {
    params.actions.push(harvest2)
  } else {
    params.actions.push(join)
  }
  return params;
}

// 获取LPreward
export function getLpReward(baseData, accData) {
  const tagNum = baseData.contract1 === "tagtokenmain" ? parseFloat(accData.sym1) : parseFloat(accData.sym0)
  const rate = tagNum / baseData.allTag;
  const lpBal = baseData.bal;
  const weight = accData.weight || 1;
  const nowT = moment().valueOf()
  let lastT = toLocalTime(`${accData.last_drip}.000+0000`).replace(/-/g, '/')
  lastT = moment(lastT).valueOf()
  let t = (nowT - lastT) / 1000 ;
  const reward = lpBal - lpBal * Math.pow(0.9999, t * rate * weight);
  return reward.toFixed(8)
}