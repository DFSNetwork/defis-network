// nodePools 逻辑处理
import store from '@/store';

import {get_table_rows, get_producers} from '@/utils/api'

export async function getNodeLists(cb) {
  const {status, result} = await get_producers()
  if (!status) {
    return
  }
  const rows = result.producers || []
  store.dispatch('setNodeLists', JSON.parse(JSON.stringify(rows)))
  // 计算权重值
  getVoteWeight(rows, cb)
}
// 获取全网权重加成
export async function getVoteWeight(nodeLists, cb) {
  const params = {
    "code": "eosio",
    "scope": "eosio",
    "json": true,
    "table": "producers",
    "lower_bound": "bp.dfs",
    "upper_bound": "bp.dfs",
    limit: 1,
  }
  const {status, result} = await get_table_rows(params)
  if (!status) {
    return 0
  }
  const row = result.rows[0];
  const node = nodeLists.find(v => v.owner === row.owner)
  const weight = parseFloat(node.num_votes) / parseFloat(row.total_votes)
  cb(weight)
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