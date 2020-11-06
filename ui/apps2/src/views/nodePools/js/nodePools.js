// nodePools 逻辑处理
import store from '@/store';

import {get_table_rows, get_producers} from '@/utils/api'

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
  let weight_1 = parseInt((Date.parse(new Date()) / 1000 - sec_since_lanch) / (86400 * 7)) / 52;
  weight_1 = 1 / Math.pow(2, weight_1) / 10000
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
    return
  }
  const rows = result.rows || [];
  // 没有抵押数据
  if (!rows.length) {
    cb({})
    return
  }
  // 代理不是dfsbpsproxy1
  const accVoteData = rows[0];
  // 挖矿用户
  const eosNum = accVoteData.staked / 10000;
  accVoteData.eosNum = eosNum.toFixed(4);
  accVoteData.isDfsProxy = accVoteData.proxy === "dfsbpsproxy1";
  cb(accVoteData)
}

// 计算node pools 年化
export function getPoolsApy() {
  const marketLists = store.state.sys.marketLists;

}

// 计算收益
// baseData = {poolBal,allEos,type}
export function getReward(baseData, userData) {
  // console.log(baseData, userData)
  // 基础数据
  const poolBal = baseData.poolBal,
        allEos = baseData.allEos,
        type = baseData.type;
  // 用户数据
  const accNum = userData.accNum;
  let t = 86400; // 默认一天时间
  if (type !== 'year') {
    t = 1; // 用户挖矿持续时间
  }
  let reward = poolBal - poolBal * Math.pow(0.9999, t * accNum / allEos); // 日收益
  // console.log(poolBal,  poolBal * Math.pow(0.9999, t * accNum / allEos))
  if (type === 'year') {
    let yReward = reward * 365;
    if (yReward > poolBal) {
      yReward = poolBal;
    }
    return yReward
  }
  if (reward > poolBal) {
    reward = poolBal;
  }
  return reward
}